import { describe, expect, it } from 'vitest';
import { buildLogPayload, buildMetricPayload, commentCreatedTags } from '../src/datadog';

describe('datadog payloads', () => {
    it('builds a v2 count-metric series', () => {
        const payload = buildMetricPayload({
            metric: 'comment.created',
            tags: commentCreatedTags('Post123', 'new', 'allowed'),
            value: 1,
            timestampSec: 1_700_000_000,
        }) as any;
        const series = payload.series[0];
        expect(series.metric).toBe('comment.created');
        expect(series.type).toBe(1); // count
        expect(series.points).toEqual([{ timestamp: 1_700_000_000, value: 1 }]);
        expect(series.tags).toEqual(['post:Post123', 'trust:new', 'result:allowed']);
    });

    it('builds a structured log event with source/service/action', () => {
        const payload = buildLogPayload({ action: 'ban', fields: { subject_type: 'did', subject: 'did:plc:x' } }) as any;
        expect(payload).toHaveLength(1);
        expect(payload[0].ddsource).toBe('cloudflare-worker');
        expect(payload[0].service).toBe('log-comments');
        expect(payload[0].action).toBe('ban');
        expect(payload[0].ddtags).toBe('action:ban');
        expect(payload[0].subject).toBe('did:plc:x');
    });

    it('tags trusted-vs-new and allowed-vs-blocked', () => {
        expect(commentCreatedTags('p', 'trusted', 'blocked')).toEqual(['post:p', 'trust:trusted', 'result:blocked']);
    });
});
