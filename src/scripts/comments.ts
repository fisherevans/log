// Client for the native in-page comments UI (issue #5). Talks to the comments
// Worker (COMMENTS_API_URL) with credentialed fetches so the session cookie
// rides along. Bluesky is the identity layer; sign-in starts the OAuth flow on
// the Worker. No third-party iframe - this renders into the page's own DOM and
// inherits the site's styles (see Comments.astro).
import { COMMENTS_API_URL, TURNSTILE_SITEKEY } from '../consts';
import { renderMarkdown, wireLinks, openSyntaxHelp } from './markdown';

interface Author {
    did: string;
    handle: string | null;
    displayName: string | null;
    avatar: string | null;
}
interface Comment {
    id: string;
    postId: string;
    parentId: string | null;
    author: Author;
    body: string;
    createdAt: number;
    deleted: boolean;
}
interface Me {
    loggedIn: boolean;
    did?: string;
    handle?: string | null;
    displayName?: string | null;
    avatar?: string | null;
}

const api = (path: string, init?: RequestInit) =>
    fetch(`${COMMENTS_API_URL}${path}`, { credentials: 'include', ...init });

// ---- tiny DOM helpers -------------------------------------------------------

type Attrs = Record<string, string | ((e: Event) => void)>;
function el(tag: string, attrs: Attrs = {}, ...kids: (Node | string)[]): HTMLElement {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (typeof v === 'function') node.addEventListener(k, v);
        else if (k === 'class') node.className = v;
        else node.setAttribute(k, v);
    }
    for (const kid of kids) node.append(kid);
    return node;
}

// Icons. innerHTML is a fixed trusted constant (never user input).
const REPLY_SVG =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3.5 3 7l4 3.5"/><path d="M3 7h6.5a3.5 3.5 0 0 1 3.5 3.5V12"/></svg>';
const MENU_SVG =
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="3" cy="8" r="1.4"/><circle cx="8" cy="8" r="1.4"/><circle cx="13" cy="8" r="1.4"/></svg>';
function icon(svg: string): HTMLElement {
    const s = document.createElement('span');
    s.className = 'comment-icon';
    s.innerHTML = svg;
    return s;
}

function relativeTime(ms: number): string {
    const s = Math.floor((Date.now() - ms) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(ms).toLocaleDateString();
}

// ---- Turnstile (optional) ---------------------------------------------------

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, opts: { sitekey: string }) => string;
            getResponse: (id: string) => string | undefined;
            reset: (id?: string) => void;
        };
    }
}

let turnstileLoaded: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
    if (!TURNSTILE_SITEKEY) return Promise.resolve();
    if (!turnstileLoaded) {
        turnstileLoaded = new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => resolve(); // degrade: Worker only enforces if it has a secret
            document.head.append(s);
        });
    }
    return turnstileLoaded;
}

// ---- widget -----------------------------------------------------------------

class CommentsWidget {
    private me: Me = { loggedIn: false };
    private comments: Comment[] = [];
    private enabled = true;
    private hashApplied = false;
    private hashBound = false;

    constructor(
        private root: HTMLElement,
        private postId: string,
        private opDid: string | null = null,
    ) {}

    async init() {
        // Same-document hash navigation (a shared permalink opened while already
        // on the page) doesn't reload, so jump on hashchange too.
        if (!this.hashBound) {
            this.hashBound = true;
            window.addEventListener('hashchange', () => {
                const m = location.hash.match(/^#comment-([A-Za-z0-9]+)$/);
                if (m) this.gotoComment(m[1]);
            });
        }
        this.setStatus('Loading comments…');
        try {
            const [me, data] = await Promise.all([
                api('/oauth/me').then((r) => r.json() as Promise<Me>).catch(() => ({ loggedIn: false })),
                api(`/comments?post_id=${encodeURIComponent(this.postId)}`).then((r) => r.json()),
            ]);
            this.me = me;
            this.enabled = data.enabled !== false;
            this.comments = data.comments ?? [];
            this.render();
        } catch {
            this.setStatus('Comments are unavailable right now.');
        }
    }

    private setStatus(msg: string) {
        this.root.replaceChildren(el('p', { class: 'comments-status' }, msg));
    }

    private render() {
        const frag = document.createDocumentFragment();
        frag.append(el('h2', { class: 'comments-heading' }, this.headingText()));

        if (!this.enabled) {
            frag.append(el('p', { class: 'comments-status' }, 'Comments are closed for this post.'));
            this.root.replaceChildren(frag);
            return;
        }

        frag.append(this.composer(null));

        if (this.comments.length === 0) {
            frag.append(el('p', { class: 'comments-status' }, 'Be the first to comment.'));
        } else {
            frag.append(this.thread());
        }
        this.root.replaceChildren(frag);
        this.maybeApplyHash();
    }

    private headingText(): string {
        const live = this.comments.filter((c) => !c.deleted).length;
        return live === 0 ? 'Comments' : live === 1 ? '1 comment' : `${live} comments`;
    }

    // Build a nested thread from the flat list (oldest-first, by parentId).
    private thread(): HTMLElement {
        const byParent = new Map<string | null, Comment[]>();
        for (const c of this.comments) {
            const arr = byParent.get(c.parentId) ?? [];
            arr.push(c);
            byParent.set(c.parentId, arr);
        }
        const list = el('ul', { class: 'comments-list' });
        const renderLevel = (parentId: string | null, depth: number, into: HTMLElement) => {
            for (const c of byParent.get(parentId) ?? []) {
                into.append(this.commentNode(c, depth));
                const kids = byParent.get(c.id);
                if (kids && kids.length) {
                    const sub = el('ul', { class: 'comments-list comments-replies' });
                    renderLevel(c.id, Math.min(depth + 1, 4), sub);
                    into.append(sub);
                }
            }
        };
        renderLevel(null, 0, list);
        return list;
    }

    private commentNode(c: Comment, _depth: number): HTMLElement {
        const name = c.author.displayName || c.author.handle || 'someone';
        const avatar = c.author.avatar
            ? el('img', { class: 'comment-avatar', src: c.author.avatar, alt: '', loading: 'lazy' })
            : el('span', { class: 'comment-avatar comment-avatar-blank' });

        const isOp = !!this.opDid && c.author.did === this.opDid;
        const headBits: (Node | string)[] = [avatar, el('span', { class: 'comment-author' }, name)];
        if (isOp) headBits.push(el('span', { class: 'comment-op-badge', title: 'Post author' }, 'author'));
        if (c.author.handle) {
            headBits.push(
                el('a', { class: 'comment-handle', href: `https://bsky.app/profile/${c.author.handle}`, target: '_blank', rel: 'noopener' }, `@${c.author.handle}`),
            );
        }
        headBits.push(el('span', { class: 'comment-time' }, relativeTime(c.createdAt)));
        const head = el('div', { class: 'comment-head' }, ...headBits);

        const body = el('div', { class: 'comment-body' });
        if (c.deleted) {
            body.append(el('em', { class: 'comment-deleted' }, 'comment deleted'));
        } else {
            body.innerHTML = renderMarkdown(c.body);
            wireLinks(body);
        }

        const actions = el('div', { class: 'comment-actions' });
        if (!c.deleted) actions.append(this.actionsMenu(c));
        if (!c.deleted && this.me.loggedIn) {
            const reply = el('button', { class: 'comment-link comment-action-reply', type: 'button', title: 'Reply', 'aria-label': 'Reply', click: () => this.openReply(c) });
            reply.append(icon(REPLY_SVG));
            actions.append(reply);
        }

        return el('li', { class: isOp ? 'comment comment-op' : 'comment', 'data-id': c.id, id: `comment-${c.id}` }, head, body, actions);
    }

    // Inline composer. parent=null for the top-level box; a comment for a reply.
    private composer(parent: Comment | null): HTMLElement {
        if (!this.me.loggedIn) return this.signInPrompt();

        const ta = el('textarea', {
            class: 'comment-input',
            rows: '3',
            placeholder: parent ? `Reply to ${parent.author.handle ?? 'comment'}…` : 'Add a comment…',
        }) as HTMLTextAreaElement;

        // Write | Preview tabs. Preview renders through the same safe pipeline the
        // posted comment will use, so what you see is what gets stored.
        const preview = el('div', { class: 'comment-body comment-preview', hidden: 'hidden' });
        const writeTab = el('button', { class: 'comment-tab comment-tab-on', type: 'button' }, 'Write');
        const previewTab = el('button', { class: 'comment-tab', type: 'button' }, 'Preview');
        const help = el('button', { class: 'comment-link comment-format-help', type: 'button', click: () => openSyntaxHelp() }, 'formatting');
        const showWrite = () => {
            preview.hidden = true;
            ta.hidden = false;
            writeTab.classList.add('comment-tab-on');
            previewTab.classList.remove('comment-tab-on');
        };
        const showPreview = () => {
            const text = ta.value.trim();
            preview.innerHTML = text ? renderMarkdown(text) : '<p class="comments-status">Nothing to preview.</p>';
            wireLinks(preview);
            ta.hidden = true;
            preview.hidden = false;
            previewTab.classList.add('comment-tab-on');
            writeTab.classList.remove('comment-tab-on');
        };
        writeTab.addEventListener('click', showWrite);
        previewTab.addEventListener('click', showPreview);
        const tabs = el('div', { class: 'comment-tabs' }, writeTab, previewTab, help);

        const error = el('p', { class: 'comment-error', hidden: 'hidden' });
        const turnstileMount = el('div', { class: 'comment-turnstile' });
        const submit = el('button', { class: 'comment-submit', type: 'button' }, parent ? 'Reply' : 'Post comment');

        let turnstileId: string | undefined;
        void loadTurnstile().then(() => {
            if (TURNSTILE_SITEKEY && window.turnstile) {
                turnstileId = window.turnstile.render(turnstileMount, { sitekey: TURNSTILE_SITEKEY });
            }
        });

        const send = async () => {
            const text = ta.value.trim();
            if (!text) return;
            error.hidden = true;
            submit.setAttribute('disabled', 'disabled');
            const token = turnstileId && window.turnstile ? window.turnstile.getResponse(turnstileId) : undefined;
            try {
                const res = await api('/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId: this.postId, parentId: parent?.id ?? null, body: text, turnstileToken: token }),
                });
                if (!res.ok) {
                    const { error: msg } = (await res.json().catch(() => ({}))) as { error?: string };
                    throw new Error(msg || 'Could not post your comment.');
                }
                await this.init(); // reload the thread
            } catch (e) {
                error.textContent = e instanceof Error ? e.message : 'Could not post your comment.';
                error.hidden = false;
                submit.removeAttribute('disabled');
                if (turnstileId && window.turnstile) window.turnstile.reset(turnstileId);
            }
        };
        submit.addEventListener('click', send);
        // Cmd/Ctrl+Enter submits from the textarea.
        ta.addEventListener('keydown', (e) => {
            const ke = e as KeyboardEvent;
            if ((ke.metaKey || ke.ctrlKey) && ke.key === 'Enter') {
                e.preventDefault();
                void send();
            }
        });

        const box = el('div', { class: parent ? 'comment-composer comment-composer-reply' : 'comment-composer' }, tabs, ta, preview, turnstileMount, error, submit);
        if (parent) {
            box.prepend(el('button', { class: 'comment-link comment-cancel', type: 'button', click: () => box.remove() }, 'dismiss'));
        }
        return box;
    }

    private openReply(c: Comment) {
        const li = this.root.querySelector(`li.comment[data-id="${c.id}"]`);
        if (!li || li.querySelector('.comment-composer-reply')) return;
        li.append(this.composer(c));
    }

    private signInPrompt(): HTMLElement {
        const handle = el('input', { class: 'comment-input comment-handle-input', placeholder: 'you.bsky.social', hidden: 'hidden' }) as HTMLInputElement;
        const go = (e?: Event) => {
            e?.preventDefault();
            const h = handle.value.trim().replace(/^@/, '');
            if (h) window.location.href = `${COMMENTS_API_URL}/oauth/login?handle=${encodeURIComponent(h)}`;
        };
        const btn = el('button', {
            class: 'comment-submit',
            type: 'button',
            click: () => {
                if (handle.hidden) {
                    handle.hidden = false;
                    handle.focus();
                } else go();
            },
        }, 'Sign in with Bluesky');
        handle.addEventListener('keydown', (e) => {
            if ((e as KeyboardEvent).key === 'Enter') go(e);
        });
        return el('div', { class: 'comment-composer comment-signin' },
            el('p', { class: 'comments-status' }, 'Sign in with your Bluesky account to comment.'),
            handle,
            btn,
        );
    }

    // Per-comment "..." menu (#13). Universal items (permalink, copy, navigate)
    // for everyone; the author's delete folds in here. Admin moderation items
    // (ban, delete-others) land with the admin modal in #14.
    private actionsMenu(c: Comment): HTMLElement {
        const wrap = el('div', { class: 'comment-menu' });
        const btn = el('button', {
            class: 'comment-link comment-menu-btn',
            type: 'button',
            title: 'More',
            'aria-label': 'More actions',
            'aria-haspopup': 'menu',
        });
        btn.append(icon(MENU_SVG));
        const pop = el('div', { class: 'comment-menu-pop', role: 'menu', hidden: 'hidden' });

        const close = () => {
            pop.hidden = true;
            document.removeEventListener('click', onDoc, true);
        };
        const onDoc = (e: Event) => {
            if (!wrap.contains(e.target as Node)) close();
        };
        const item = (label: string, onClick: () => void, cls = '') =>
            el('button', { class: `comment-menu-item ${cls}`.trim(), type: 'button', role: 'menuitem', click: () => { close(); onClick(); } }, label);

        pop.append(item('Permalink', () => this.copyPermalink(c)));
        pop.append(item('Copy markdown', () => this.copyMarkdown(c)));
        pop.append(item('Copy rich text', () => this.copyRich(c)));
        if (c.parentId) pop.append(item('View parent', () => this.gotoComment(c.parentId!)));
        if (this.comments.some((x) => x.parentId === c.id)) pop.append(item('View replies', () => this.gotoFirstChild(c.id)));
        if (this.me.loggedIn && this.me.did === c.author.did) {
            pop.append(item('Delete', () => this.delete(c), 'comment-menu-danger'));
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (pop.hidden) {
                pop.hidden = false;
                document.addEventListener('click', onDoc, true);
            } else close();
        });
        wrap.append(btn, pop);
        return wrap;
    }

    private permalink(c: Comment): string {
        return `${location.origin}${location.pathname}#comment-${c.id}`;
    }

    private async copyPermalink(c: Comment) {
        const url = this.permalink(c);
        history.replaceState(null, '', `#comment-${c.id}`);
        this.gotoComment(c.id);
        await this.copy(() => navigator.clipboard.writeText(url), 'Permalink copied');
    }

    private async copyMarkdown(c: Comment) {
        await this.copy(() => navigator.clipboard.writeText(c.body), 'Markdown copied');
    }

    // Rich copy: HTML (sanitized via the same render path) + a plain-text fallback
    // so pasting into a doc keeps formatting, but a plain target still works.
    private async copyRich(c: Comment) {
        const html = renderMarkdown(c.body);
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const text = tmp.textContent ?? c.body;
        await this.copy(async () => {
            if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([html], { type: 'text/html' }),
                        'text/plain': new Blob([text], { type: 'text/plain' }),
                    }),
                ]);
            } else {
                await navigator.clipboard.writeText(text);
            }
        }, 'Copied');
    }

    private async copy(run: () => Promise<unknown>, ok: string) {
        try {
            await run();
            this.toast(ok);
        } catch {
            this.toast('Copy failed');
        }
    }

    private gotoComment(id: string) {
        const li = this.root.querySelector<HTMLElement>(`li.comment[data-id="${id}"]`);
        if (!li) return;
        li.scrollIntoView({ behavior: 'smooth', block: 'center' });
        li.classList.remove('comment-flash');
        void li.offsetWidth; // reflow so the animation restarts on repeat clicks
        li.classList.add('comment-flash');
    }

    private gotoFirstChild(id: string) {
        const kid = this.comments.find((x) => x.parentId === id);
        if (kid) this.gotoComment(kid.id);
    }

    // On first render, if the URL targets a comment (#comment-<id>), land on it.
    private maybeApplyHash() {
        if (this.hashApplied) return;
        const m = location.hash.match(/^#comment-([A-Za-z0-9]+)$/);
        if (!m) return;
        this.hashApplied = true;
        requestAnimationFrame(() => this.gotoComment(m[1]));
    }

    private toast(msg: string) {
        const t = el('div', { class: 'comment-toast' }, msg);
        document.body.append(t);
        requestAnimationFrame(() => t.classList.add('comment-toast-show'));
        setTimeout(() => {
            t.classList.remove('comment-toast-show');
            setTimeout(() => t.remove(), 250);
        }, 1600);
    }

    private async delete(c: Comment) {
        if (!confirm('Delete this comment?')) return;
        const res = await api(`/comments/${c.id}`, { method: 'DELETE' });
        if (res.ok) await this.init();
    }
}

export function initComments() {
    const root = document.querySelector<HTMLElement>('[data-comments]');
    const postId = root?.dataset.postId;
    if (!root || !postId) return;
    new CommentsWidget(root, postId, root.dataset.opDid ?? null).init();
}
