// Shared Cloudflare Turnstile loader + types for the comment and subscribe forms.
// Both render the widget on demand - hidden until the user commits to the action
// (clicks Subscribe / Post comment) - so the script is only injected when first
// needed and no widget sits in the page on load.
import { TURNSTILE_SITEKEY } from '../consts';

export interface TurnstileRenderOpts {
    sitekey: string;
    size?: 'normal' | 'flexible' | 'compact';
    callback?: (token: string) => void;
    'error-callback'?: () => void;
    'expired-callback'?: () => void;
}

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, opts: TurnstileRenderOpts) => string;
            getResponse: (id: string) => string | undefined;
            reset: (id?: string) => void;
        };
    }
}

// Inject the Turnstile script once and resolve when window.turnstile is ready.
// No-op (resolves immediately) when no sitekey is configured - the Worker only
// enforces Turnstile when it has a secret, so the forms degrade to a plain submit.
export function loadTurnstile(): Promise<void> {
    if (!TURNSTILE_SITEKEY || window.turnstile) return Promise.resolve();
    if (document.querySelector('script[src*="turnstile"]')) {
        // A sibling form already injected the script; wait for the API to define.
        return new Promise((resolve) => {
            const tick = () => (window.turnstile ? resolve() : setTimeout(tick, 50));
            tick();
        });
    }
    return new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.append(s);
    });
}
