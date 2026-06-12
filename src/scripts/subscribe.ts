// Client for the native email-subscribe form (issue #7). Posts to the comments
// Worker's /subscribe endpoint, Turnstile-gated when a sitekey is configured.
import { COMMENTS_API_URL, TURNSTILE_SITEKEY } from '../consts';

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, opts: { sitekey: string }) => string;
            getResponse: (id: string) => string | undefined;
            reset: (id?: string) => void;
        };
    }
}

function loadTurnstile(): Promise<void> {
    if (!TURNSTILE_SITEKEY || document.querySelector('script[src*="turnstile"]')) return Promise.resolve();
    return new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.append(s);
    });
}

// Wire every subscribe form on the page (the footer + the landing-page modal can
// both be present). Idempotent: each form is wired at most once.
export function initSubscribe() {
    document.querySelectorAll<HTMLFormElement>('[data-subscribe]').forEach((form) => {
        if (form.dataset.wired) return;
        form.dataset.wired = '1';
        wireForm(form);
    });
}

function wireForm(form: HTMLFormElement) {
    const email = form.querySelector<HTMLInputElement>('input[type="email"]')!;
    const status = form.querySelector<HTMLElement>('[data-subscribe-status]')!;
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const turnstileMount = form.querySelector<HTMLElement>('[data-subscribe-turnstile]')!;

    let turnstileId: string | undefined;
    void loadTurnstile().then(() => {
        if (TURNSTILE_SITEKEY && window.turnstile) {
            turnstileId = window.turnstile.render(turnstileMount, { sitekey: TURNSTILE_SITEKEY });
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const value = email.value.trim();
        if (!value) return;
        submit.disabled = true;
        status.textContent = '';
        const token = turnstileId && window.turnstile ? window.turnstile.getResponse(turnstileId) : undefined;
        try {
            const res = await fetch(`${COMMENTS_API_URL}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: value, turnstileToken: token }),
            });
            if (!res.ok) {
                const { error } = (await res.json().catch(() => ({}))) as { error?: string };
                throw new Error(error || 'Could not subscribe.');
            }
            status.textContent = "You're on the list. Talk soon.";
            email.value = '';
        } catch (err) {
            status.textContent = err instanceof Error ? err.message : 'Could not subscribe.';
            submit.disabled = false;
            if (turnstileId && window.turnstile) window.turnstile.reset(turnstileId);
        }
    });
}
