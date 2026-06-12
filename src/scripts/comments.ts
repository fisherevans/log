// Client for the native in-page comments UI (issue #5). Talks to the comments
// Worker (COMMENTS_API_URL) with credentialed fetches so the session cookie
// rides along. Bluesky is the identity layer; sign-in starts the OAuth flow on
// the Worker. No third-party iframe - this renders into the page's own DOM and
// inherits the site's styles (see Comments.astro).
import { COMMENTS_API_URL, TURNSTILE_SITEKEY } from '../consts';
import { renderMarkdown, wireLinks, openSyntaxHelp, overlay } from './markdown';

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
    editedAt: number | null;
    editCount: number;
    charsChanged: number;
}

// Mirror the Worker's edit policy so the menu only offers Edit when it'll be
// accepted (the Worker re-enforces both; this just avoids a dead menu item).
const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_EDITS = 3;

// Threading (#12): render the top level in pages, and cap inline nesting at
// MAX_DEPTH levels - deeper chains collapse to a "view replies" drill-in so the
// indentation never marches off-screen.
const PAGE_SIZE = 10;
const MAX_DEPTH = 3;
interface Me {
    loggedIn: boolean;
    isAdmin?: boolean;
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
// The Bluesky butterfly. Trusted constant, fill follows currentColor.
const BLUESKY_SVG =
    '<svg viewBox="0 0 600 530" fill="currentColor" aria-hidden="true"><path d="M135.7 44.4c71.6 53.8 148.6 162.8 176.9 221.3 28.3-58.5 105.3-167.5 176.9-221.3 51.7-38.8 135.5-68.8 135.5 26.8 0 19.1-10.9 160.4-17.3 183.3-22.3 79.6-103.4 99.9-175.5 87.6 126 21.4 158.1 92.4 88.9 163.4-131.5 134.8-188.9-33.8-203.7-77-2.7-7.9-4-11.6-4.1-8.4-.1-3.2-1.4.5-4.1 8.4-14.8 43.2-72.2 211.8-203.7 77-69.2-71-37.1-142 88.9-163.4-72.1 12.3-153.2-8-175.5-87.6C10.9 231.6 0 90.3 0 71.2 0-24.4 83.8 5.6 135.7 44.4Z"/></svg>';
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
    private topShown = PAGE_SIZE; // how many top-level comments are revealed
    private focusStack: string[] = []; // drill-in path; empty = root thread

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
        const heading = el('h2', { class: 'comments-heading' }, this.headingText());
        if (this.me.isAdmin) {
            const mod = el('button', { class: 'comment-link comment-admin-link', type: 'button', title: 'Moderation', click: () => this.openAdminModal() }, 'moderation');
            frag.append(el('div', { class: 'comments-header' }, heading, mod));
        } else {
            frag.append(heading);
        }

        if (!this.enabled) {
            frag.append(el('p', { class: 'comments-status' }, 'Comments are closed for this post.'));
            this.root.replaceChildren(frag);
            return;
        }

        // In a drill-in, the breadcrumb replaces the top-level composer (you're
        // looking at one subtree, not the root); reply still works per-comment.
        if (this.focusStack.length) frag.append(this.breadcrumb());
        else frag.append(this.composer(null));

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

    // Build the thread from the flat list (oldest-first, by parentId). The root
    // view paginates the top level; a drill-in renders one comment's subtree.
    private thread(): HTMLElement {
        const byParent = new Map<string | null, Comment[]>();
        for (const c of this.comments) {
            const arr = byParent.get(c.parentId) ?? [];
            arr.push(c);
            byParent.set(c.parentId, arr);
        }
        const list = el('ul', { class: 'comments-list' });

        if (this.focusStack.length) {
            const focusId = this.focusStack[this.focusStack.length - 1];
            const c = this.comments.find((x) => x.id === focusId);
            if (c) this.renderSubtree(byParent, c, 0, list);
            return list;
        }

        const top = byParent.get(null) ?? [];
        for (const c of top.slice(0, this.topShown)) this.renderSubtree(byParent, c, 0, list);
        const remaining = top.length - this.topShown;
        if (remaining > 0) {
            list.append(
                el('li', { class: 'comments-loadmore-row' },
                    el('button', { class: 'comment-submit comment-loadmore', type: 'button', click: () => { this.topShown += PAGE_SIZE; this.render(); } },
                        `Load ${Math.min(PAGE_SIZE, remaining)} more`),
                ),
            );
        }
        return list;
    }

    // Render a comment then its replies: inline until MAX_DEPTH, then a drill-in.
    private renderSubtree(byParent: Map<string | null, Comment[]>, c: Comment, depth: number, into: HTMLElement) {
        into.append(this.commentNode(c, depth));
        const kids = byParent.get(c.id);
        if (!kids || !kids.length) return;
        if (depth + 1 >= MAX_DEPTH) {
            const n = this.countDescendants(byParent, c.id);
            into.append(
                el('li', { class: 'comments-drillin-row' },
                    el('button', { class: 'comment-link comment-drillin', type: 'button', click: () => this.drillInto(c.id) },
                        `view ${n} ${n === 1 ? 'reply' : 'replies'} →`),
                ),
            );
            return;
        }
        const sub = el('ul', { class: 'comments-list comments-replies' });
        for (const kid of kids) this.renderSubtree(byParent, kid, depth + 1, sub);
        into.append(sub);
    }

    private countDescendants(byParent: Map<string | null, Comment[]>, id: string): number {
        const kids = byParent.get(id) ?? [];
        return kids.reduce((n, k) => n + 1 + this.countDescendants(byParent, k.id), 0);
    }

    private drillInto(id: string) {
        this.focusStack.push(id);
        this.render();
        const root = this.root.closest('section.comments') ?? this.root;
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Drill-in breadcrumb: "All comments › … › current". Each crumb pops to its
    // level; the last is the comment in focus.
    private breadcrumb(): HTMLElement {
        const bar = el('nav', { class: 'comments-breadcrumb', 'aria-label': 'Thread location' });
        bar.append(el('button', { class: 'comment-link', type: 'button', click: () => { this.focusStack = []; this.render(); } }, 'All comments'));
        this.focusStack.forEach((id, i) => {
            bar.append(el('span', { class: 'comments-crumb-sep', 'aria-hidden': 'true' }, '›'));
            const c = this.comments.find((x) => x.id === id);
            const label = c ? c.author.displayName || c.author.handle || 'comment' : 'comment';
            if (i === this.focusStack.length - 1) {
                bar.append(el('span', { class: 'comments-crumb-current' }, label));
            } else {
                bar.append(el('button', { class: 'comment-link', type: 'button', click: () => { this.focusStack = this.focusStack.slice(0, i + 1); this.render(); } }, label));
            }
        });
        return bar;
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
        if (!c.deleted && c.editCount > 0) {
            // Change-magnitude only - the old text is never exposed (resolved
            // redaction concern, #15). The tooltip carries the count + magnitude.
            const mag = c.charsChanged > 0 ? ` · ~${c.charsChanged} char${c.charsChanged === 1 ? '' : 's'}` : '';
            const tip = `edited ${c.editCount}×${c.charsChanged > 0 ? `, ~${c.charsChanged} chars changed` : ''}`;
            headBits.push(el('span', { class: 'comment-edited', title: tip }, `edited${mag}`));
        }
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
            class: 'comment-submit comment-signin-btn',
            type: 'button',
            click: () => {
                if (handle.hidden) {
                    handle.hidden = false;
                    handle.focus();
                } else go();
            },
        }, icon(BLUESKY_SVG), el('span', {}, 'Sign in with Bluesky'));
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

        // Edit: author only, within the window and under the cap (delete stays
        // available after either runs out).
        const canEdit =
            this.me.loggedIn &&
            this.me.did === c.author.did &&
            Date.now() - c.createdAt <= EDIT_WINDOW_MS &&
            c.editCount < MAX_EDITS;
        if (canEdit) pop.append(item('Edit', () => this.openEdit(c)));

        // Delete: the author always, or any admin. Ban: admins only, never your
        // own comment. Backend re-enforces both via requireAdmin / the delete gate.
        const canDelete = this.me.loggedIn && (this.me.did === c.author.did || !!this.me.isAdmin);
        if (canDelete) pop.append(item('Delete', () => this.delete(c), 'comment-menu-danger'));
        if (this.me.isAdmin && c.author.did && c.author.did !== this.me.did) {
            pop.append(item('Ban author', () => this.ban(c, null), 'comment-menu-danger'));
            pop.append(item('Ban author · 10 days', () => this.ban(c, 10), 'comment-menu-danger'));
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

    // On first render, if the URL targets a comment (#comment-<id>), reveal it
    // (expand pagination / drill in to its subtree) and land on it.
    private maybeApplyHash() {
        if (this.hashApplied) return;
        const m = location.hash.match(/^#comment-([A-Za-z0-9]+)$/);
        if (!m) return;
        this.hashApplied = true; // set before re-render so the nested call no-ops
        const id = m[1];
        if (this.comments.some((c) => c.id === id) && this.revealPathTo(id)) {
            this.render();
        }
        requestAnimationFrame(() => this.gotoComment(id));
    }

    // Make a comment visible: page in enough top-level comments, and if it sits
    // deeper than MAX_DEPTH, focus the ancestor that brings it onto the deepest
    // visible row. Returns true if anything changed.
    private revealPathTo(id: string): boolean {
        const byId = new Map(this.comments.map((c) => [c.id, c]));
        const chain: string[] = [];
        for (let cur = byId.get(id); cur; cur = cur.parentId ? byId.get(cur.parentId) : undefined) {
            chain.unshift(cur.id);
        }
        if (!chain.length) return false;
        let changed = false;

        const rootAncestor = chain[0];
        const top = this.comments.filter((c) => c.parentId === null);
        const idx = top.findIndex((c) => c.id === rootAncestor);
        if (idx >= 0 && idx + 1 > this.topShown) {
            this.topShown = top.length; // simplest: reveal all top-level
            changed = true;
        }

        const depth = chain.length - 1;
        const wantFocus = depth >= MAX_DEPTH ? [chain[depth - (MAX_DEPTH - 1)]] : [];
        if (JSON.stringify(wantFocus) !== JSON.stringify(this.focusStack)) {
            this.focusStack = wantFocus;
            changed = true;
        }
        return changed;
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

    // Inline edit (#15). Replaces the rendered body with a prefilled textarea;
    // on save it PATCHes and reloads. Cancel restores the body untouched.
    private openEdit(c: Comment) {
        const li = this.root.querySelector<HTMLElement>(`li.comment[data-id="${c.id}"]`);
        if (!li || li.querySelector('.comment-editor')) return;
        const bodyEl = li.querySelector<HTMLElement>('.comment-body');

        const ta = el('textarea', { class: 'comment-input', rows: '4' }) as HTMLTextAreaElement;
        ta.value = c.body;
        const error = el('p', { class: 'comment-error', hidden: 'hidden' });
        const save = el('button', { class: 'comment-submit', type: 'button' }, 'Save');
        const restore = () => {
            editor.remove();
            if (bodyEl) bodyEl.hidden = false;
        };
        const cancel = el('button', { class: 'comment-link comment-cancel', type: 'button', click: restore }, 'cancel');

        const doSave = async () => {
            const text = ta.value.trim();
            if (!text) return;
            error.hidden = true;
            save.setAttribute('disabled', 'disabled');
            try {
                const res = await api(`/comments/${c.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ body: text }),
                });
                if (!res.ok) {
                    const { error: msg } = (await res.json().catch(() => ({}))) as { error?: string };
                    throw new Error(msg || 'Could not save your edit.');
                }
                await this.init();
            } catch (e) {
                error.textContent = e instanceof Error ? e.message : 'Could not save your edit.';
                error.hidden = false;
                save.removeAttribute('disabled');
            }
        };
        save.addEventListener('click', doSave);
        ta.addEventListener('keydown', (e) => {
            const ke = e as KeyboardEvent;
            if ((ke.metaKey || ke.ctrlKey) && ke.key === 'Enter') {
                e.preventDefault();
                void doSave();
            }
        });

        const editor = el('div', { class: 'comment-composer comment-editor' }, ta, error, el('div', { class: 'comment-editor-actions' }, save, cancel));
        if (bodyEl) {
            bodyEl.hidden = true;
            bodyEl.after(editor);
        } else {
            li.append(editor);
        }
        ta.focus();
    }

    // Admin: ban the comment's author DID (permanent or temp). Backend gated.
    private async ban(c: Comment, days: number | null) {
        const who = c.author.handle ? `@${c.author.handle}` : 'this user';
        const prompt = days ? `Ban ${who} for ${days} days?` : `Permanently ban ${who}?`;
        if (!confirm(prompt)) return;
        try {
            const res = await api('/admin/ban', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'did', subject: c.author.did, days: days ?? undefined, reason: `via comment ${c.id}` }),
            });
            if (!res.ok) throw new Error();
            this.toast(days ? `Banned ${who} for ${days} days` : `Banned ${who}`);
        } catch {
            this.toast('Ban failed');
        }
    }

    // Admin: per-post + site-wide comment switches. Fetches current state, then
    // each toggle writes immediately. requireAdmin gates the reads and writes.
    private openAdminModal() {
        overlay((close) => {
            const box = el('div', { class: 'comment-modal' });
            const note = el('p', { class: 'comment-modal-note' }, 'Loading…');
            const rows = el('div', { class: 'comment-admin-toggles' });
            const done = el('button', { class: 'comment-modal-btn', type: 'button', click: close }, 'Done');
            box.append(el('h3', {}, 'Moderation'), note, rows, done);

            void api(`/admin/status?post_id=${encodeURIComponent(this.postId)}`)
                .then((r) => (r.ok ? (r.json() as Promise<{ global: boolean; post: boolean }>) : Promise.reject()))
                .then((st) => {
                    note.textContent = 'Turning comments off hides the composer and rejects new comments.';
                    rows.replaceChildren(
                        this.toggleRow('This post', st.post, (v) =>
                            api(`/admin/posts/${encodeURIComponent(this.postId)}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ enabled: v }),
                            }),
                        ),
                        this.toggleRow('Site-wide', st.global, (v) =>
                            api('/admin/global', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ enabled: v }),
                            }),
                        ),
                    );
                })
                .catch(() => {
                    note.textContent = 'Could not load moderation status.';
                });
            return box;
        });
    }

    private toggleRow(label: string, initial: boolean, write: (enabled: boolean) => Promise<Response>): HTMLElement {
        const input = el('input', { type: 'checkbox' }) as HTMLInputElement;
        input.checked = initial;
        input.addEventListener('change', async () => {
            input.disabled = true;
            try {
                const res = await write(input.checked);
                if (!res.ok) throw new Error();
                this.toast('Saved');
            } catch {
                input.checked = !input.checked; // revert on failure
                this.toast('Save failed');
            }
            input.disabled = false;
        });
        return el('label', { class: 'comment-admin-toggle' }, input, el('span', {}, label));
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
