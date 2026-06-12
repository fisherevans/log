// DataDog observability (issue #6). The Worker ships a `comment.created` metric
// and structured activity logs directly to DataDog's HTTP intake, fired via
// ctx.waitUntil so they never block (or fail) the response. No Logpush / Workers
// Paid needed.
//
// All shipping is best-effort and a no-op when DATADOG_API_KEY is unset (local
// dev + tests). The org is on US5; override the site with DATADOG_SITE if needed.
import type { Env } from './env';

const DEFAULT_SITE = 'us5.datadoghq.com';
const SERVICE = 'log-comments';
const SOURCE = 'cloudflare-worker';

type Trust = 'new' | 'trusted';
type Result = 'allowed' | 'blocked';

// ---- pure payload builders (unit-tested) -----------------------------------

export interface MetricPoint {
    metric: string;
    tags: string[];
    value: number;
    timestampSec: number;
}

// DataDog v2 metrics "series" payload for a count metric.
export function buildMetricPayload(p: MetricPoint): unknown {
    return {
        series: [
            {
                metric: p.metric,
                type: 1, // count
                points: [{ timestamp: p.timestampSec, value: p.value }],
                tags: p.tags,
            },
        ],
    };
}

export interface LogEvent {
    action: string;
    fields: Record<string, unknown>;
}

// DataDog v2 logs intake payload (a single structured event).
export function buildLogPayload(e: LogEvent): unknown {
    return [
        {
            ddsource: SOURCE,
            service: SERVICE,
            ddtags: `action:${e.action}`,
            message: `comments ${e.action}`,
            action: e.action,
            ...e.fields,
        },
    ];
}

export function commentCreatedTags(postId: string, trust: Trust, result: Result): string[] {
    return [`post:${postId}`, `trust:${trust}`, `result:${result}`];
}

// ---- shipping --------------------------------------------------------------

// Per-request telemetry sink. Metric + log sends are queued on ctx.waitUntil and
// swallow their own errors, so observability can never break a request.
export class Telemetry {
    private readonly key?: string;
    private readonly site: string;

    constructor(
        env: Env,
        private readonly ctx: ExecutionContext,
    ) {
        this.key = env.DATADOG_API_KEY;
        this.site = env.DATADOG_SITE || DEFAULT_SITE;
    }

    // comment.created count, tagged by post, new-vs-trusted, allowed-vs-blocked.
    commentCreated(postId: string, trust: Trust, result: Result): void {
        this.metric('comment.created', 1, commentCreatedTags(postId, trust, result));
    }

    // Structured activity-log entry - the durable audit trail.
    event(action: string, fields: Record<string, unknown>): void {
        this.log({ action, fields });
    }

    private metric(metric: string, value: number, tags: string[]): void {
        if (!this.key) return;
        const payload = buildMetricPayload({ metric, tags, value, timestampSec: Math.floor(Date.now() / 1000) });
        this.send(`https://api.${this.site}/api/v2/series`, payload);
    }

    private log(e: LogEvent): void {
        if (!this.key) return;
        this.send(`https://http-intake.logs.${this.site}/api/v2/logs`, buildLogPayload(e));
    }

    private send(url: string, payload: unknown): void {
        const key = this.key!;
        this.ctx.waitUntil(
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'DD-API-KEY': key },
                body: JSON.stringify(payload),
            })
                .then(() => undefined)
                .catch(() => undefined),
        );
    }
}
