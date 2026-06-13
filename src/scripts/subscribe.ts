// Client for the native email-subscribe form (issue #7). Posts to the comments
// Worker's /subscribe endpoint, Turnstile-gated when a sitekey is configured.
//
// The form is a three-stage, fixed-height flow (see SubscribeForm.astro):
//   email row  -> Subscribe clicked -> Turnstile human-check -> confirmation
// The Turnstile widget is only loaded + rendered once Subscribe is clicked (no
// widget sitting there upfront), it replaces the email row in the same slot, and
// on a passing token we submit and swap the slot to the confirmation. Errors drop
// back to the email stage. No stage changes the slot height, so nothing jumps.
import { COMMENTS_API_URL, TURNSTILE_SITEKEY } from '../consts';
import { loadTurnstile } from './turnstile';

// Wire every subscribe form on the page (idempotent: each form is wired once).
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
    const checkMount = form.querySelector<HTMLElement>('[data-subscribe-turnstile]')!;
    const stages: Record<string, HTMLElement | null> = {
        email: form.querySelector('[data-subscribe-stage="email"]'),
        check: form.querySelector('[data-subscribe-stage="check"]'),
        done: form.querySelector('[data-subscribe-stage="done"]'),
    };

    let turnstileId: string | undefined;
    let posting = false;

    const setStage = (name: 'email' | 'check' | 'done') => {
        for (const [k, el] of Object.entries(stages)) if (el) el.hidden = k !== name;
    };

    const backToEmail = (msg: string) => {
        posting = false;
        status.textContent = msg;
        submit.disabled = false;
        if (turnstileId !== undefined && window.turnstile) window.turnstile.reset(turnstileId);
        setStage('email');
        email.focus();
    };

    const post = async (token: string | undefined) => {
        if (posting) return;
        posting = true;
        try {
            const res = await fetch(`${COMMENTS_API_URL}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.value.trim(), turnstileToken: token }),
            });
            if (!res.ok) {
                const { error } = (await res.json().catch(() => ({}))) as { error?: string };
                throw new Error(error || 'Could not subscribe.');
            }
            setStage('done');
        } catch (err) {
            backToEmail(err instanceof Error ? err.message : 'Could not subscribe.');
        }
    };

    // Native validation runs before this fires (required + type=email), so we only
    // reach here with a non-empty, well-formed address.
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!email.value.trim()) return;
        status.textContent = '';
        submit.disabled = true;

        // No Turnstile configured (e.g. local dev): skip the human check entirely.
        if (!TURNSTILE_SITEKEY) {
            void post(undefined);
            return;
        }

        // Reveal the (empty) mount first - Turnstile must render into a visible
        // element - then load + render the widget into it.
        setStage('check');
        await loadTurnstile();
        if (!window.turnstile) {
            void post(undefined); // script blocked: degrade to a plain submit
            return;
        }
        checkMount.innerHTML = '';
        turnstileId = window.turnstile.render(checkMount, {
            sitekey: TURNSTILE_SITEKEY,
            size: 'flexible',
            callback: (token) => void post(token),
            'error-callback': () => backToEmail('Verification failed - try again.'),
            'expired-callback': () => backToEmail('Verification expired - try again.'),
        });
    });
}
