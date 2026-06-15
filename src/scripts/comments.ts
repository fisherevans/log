// Client for the native in-page comments UI (issue #5). Talks to the comments
// Worker (COMMENTS_API_URL) with credentialed fetches so the session cookie
// rides along. Bluesky is the identity layer; sign-in starts the OAuth flow on
// the Worker. No third-party iframe - this renders into the page's own DOM and
// inherits the site's styles (see Comments.astro).
import { COMMENTS_API_URL, TURNSTILE_SITEKEY } from '../consts';
import { renderMarkdown, wireLinks, openSyntaxHelp, overlay } from './markdown';
import { loadTurnstile } from './turnstile';

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
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>';
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

// ---- widget -----------------------------------------------------------------

class CommentsWidget {
    private me: Me = { loggedIn: false };
    private comments: Comment[] = [];
    private enabled = true;
    private hashApplied = false;
    private hashBound = false;
    private headerWired = false;
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
        await this.load(false);
    }

    // Silent refetch after a post/edit/delete/logout. Re-renders in place without
    // blanking the whole section to "Loading…" first - that flash made a
    // successful post look like it failed whenever the reload was even slightly
    // slow, and a transient hiccup wiped the just-posted comment entirely. On a
    // quiet failure we keep the current DOM and just toast.
    private async reload() {
        await this.load(true);
    }

    private async load(quiet: boolean) {
        if (!quiet) this.setStatus('Loading comments…');
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
            if (quiet) this.toast('Could not refresh comments.');
            else this.setStatus('Comments are unavailable right now.');
        }
    }

    private setStatus(msg: string) {
        this.root.replaceChildren(el('p', { class: 'comments-status' }, msg));
    }

    private render() {
        this.updateHeaderLink();
        const frag = document.createDocumentFragment();
        const heading = el('h2', { class: 'comments-heading' }, this.headingText());
        const tools: HTMLElement[] = [];
        if (this.me.isAdmin) {
            tools.push(el('button', { class: 'comment-link comment-admin-link', type: 'button', title: 'Moderation', click: () => this.openAdminModal() }, 'moderation'));
        }
        if (this.me.loggedIn) {
            const who = this.me.handle ? `@${this.me.handle}` : 'your account';
            tools.push(el('button', { class: 'comment-link comment-logout-link', type: 'button', title: `Sign out ${who}`, click: () => this.logout() }, 'log out'));
        }
        if (tools.length) {
            frag.append(el('div', { class: 'comments-header' }, heading, el('div', { class: 'comments-tools' }, ...tools)));
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
        this.maybeFocusCompose();
    }

    private headingText(): string {
        const live = this.comments.filter((c) => !c.deleted).length;
        return live === 0 ? 'Comments' : live === 1 ? '1 comment' : `${live} comments`;
    }

    // The post-header count link (BlogPost.astro) lives outside this widget's
    // root. Populate it from the loaded thread: "N comments" jumps to the
    // section; "Add a comment" (empty + open) jumps and focuses the composer.
    // Hidden until populated so the number never flickers, and hidden entirely
    // when comments are closed with none to show.
    private updateHeaderLink() {
        const link = document.querySelector<HTMLElement>('[data-comment-count]');
        if (!link) return;
        const live = this.comments.filter((c) => !c.deleted).length;
        if (live === 0 && !this.enabled) {
            link.hidden = true;
            return;
        }
        const label = link.querySelector('.cc-label') ?? link;
        label.textContent = live === 0 ? 'Add a comment' : live === 1 ? '1 comment' : `${live} comments`;
        link.classList.toggle('zero', live === 0);
        link.hidden = false;
        if (!this.headerWired) {
            this.headerWired = true;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const empty = this.comments.filter((c) => !c.deleted).length === 0;
                this.jumpToComments(empty && this.enabled);
            });
        }
    }

    private jumpToComments(focusCompose: boolean) {
        const section = this.root.closest('section.comments');
        if (section instanceof HTMLElement) {
            const rect = section.getBoundingClientRect();
            window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 24), behavior: 'smooth' });
        }
        if (focusCompose) {
            requestAnimationFrame(() =>
                this.root.querySelector<HTMLTextAreaElement>('textarea.comment-input')?.focus(),
            );
        }
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
            if (c) {
                this.renderSubtree(byParent, c, 0, list);
                list.querySelector(`li.comment[data-id="${c.id}"]`)?.classList.add('comment-focused');
            }
            return list;
        }

        const top = byParent.get(null) ?? [];
        for (const c of top.slice(0, this.topShown)) this.renderSubtree(byParent, c, 0, list);
        const remaining = top.length - this.topShown;
        if (remaining > 0) {
            list.append(
                el('li', { class: 'comments-loadmore-row' },
                    el('button', { class: 'comment-submit comment-loadmore', type: 'button', click: () => { this.topShown += PAGE_SIZE; this.render(); } },
                        'Load more'),
                ),
            );
        }
        return list;
    }

    // Render a comment then its replies: inline until MAX_DEPTH, then a drill-in.
    // The reply group nests *inside* the comment's <li> so the connector spine
    // (Comments.astro) reads as one continuous tree per branch.
    private renderSubtree(byParent: Map<string | null, Comment[]>, c: Comment, depth: number, into: HTMLElement) {
        const node = this.commentNode(c, depth);
        into.append(node);
        const kids = byParent.get(c.id);
        if (!kids || !kids.length) return;
        if (depth + 1 >= MAX_DEPTH) {
            const n = this.countDescendants(byParent, c.id);
            node.append(
                el('ul', { class: 'comments-list comments-replies' },
                    el('li', { class: 'comments-drillin-row' },
                        el('button', { class: 'comment-link comment-drillin', type: 'button', click: () => this.drillInto(c.id) },
                            `view ${n} ${n === 1 ? 'reply' : 'replies'} →`),
                    ),
                ),
            );
            return;
        }
        const sub = el('ul', { class: 'comments-list comments-replies' });
        for (const kid of kids) this.renderSubtree(byParent, kid, depth + 1, sub);
        node.append(sub);
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
            // Visible marker is just "edited"; the magnitude (chars + % of the
            // comment that churned) lives in the tooltip so it isn't shouty.
            const pct = c.charsChanged > 0 ? Math.max(1, Math.round((c.charsChanged / (c.charsChanged + c.body.length)) * 100)) : 0;
            const tip = c.charsChanged > 0
                ? `edited ${c.editCount}× · ~${c.charsChanged} char${c.charsChanged === 1 ? '' : 's'} (${pct}%)`
                : `edited ${c.editCount}×`;
            headBits.push(el('span', { class: 'comment-edited', title: tip }, 'edited'));
        }
        const head = el('div', { class: 'comment-head' }, ...headBits);

        const body = el('div', { class: 'comment-body' });
        if (c.deleted) {
            body.append(el('em', { class: 'comment-deleted' }, 'comment deleted'));
        } else {
            body.innerHTML = renderMarkdown(c.body);
            wireLinks(body);
        }

        // Reply + "..." menu both sit at the end of the head row, after the
        // timestamp, so the action affordances read as belonging to THIS comment
        // rather than floating down near the next one. Reply goes between the time
        // and the menu; the body runs full-width and the comment bottom stays tight.
        if (!c.deleted && this.me.loggedIn) {
            const reply = el('button', { class: 'comment-link comment-action-reply', type: 'button', title: 'Reply', 'aria-label': 'Reply', click: () => this.openReply(c) });
            reply.append(icon(REPLY_SVG));
            head.append(reply);
        }
        const menu = this.actionsMenu(c);
        if (menu) head.append(menu);

        return el('li', { class: isOp ? 'comment comment-op' : 'comment', 'data-id': c.id, id: `comment-${c.id}` }, head, body);
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
        const turnstileMount = el('div', { class: 'comment-turnstile', hidden: 'hidden' });
        const submit = el('button', { class: 'comment-submit', type: 'button' }, parent ? 'Reply' : 'Post comment');

        let turnstileId: string | undefined;

        const fail = (msg: string) => {
            error.textContent = msg;
            error.hidden = false;
            submit.removeAttribute('disabled');
            turnstileMount.hidden = true;
            if (turnstileId !== undefined && window.turnstile) window.turnstile.reset(turnstileId);
        };

        // Submit once we have a Turnstile token (or none, when Turnstile is off).
        const doPost = async (token: string | undefined) => {
            try {
                const res = await api('/comments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId: this.postId, parentId: parent?.id ?? null, body: ta.value.trim(), turnstileToken: token, pageUrl: location.href }),
                });
                if (!res.ok) {
                    const { error: msg } = (await res.json().catch(() => ({}))) as { error?: string };
                    throw new Error(msg || 'Could not post your comment.');
                }
                const created = (await res.json().catch(() => null)) as Comment | null;
                await this.reload(); // refresh the thread in place (no blank-out)
                if (created?.id) this.focusComment(created.id); // center + flash your new comment
            } catch (e) {
                fail(e instanceof Error ? e.message : 'Could not post your comment.');
            }
        };

        // The human-check stays hidden until Post comment is clicked: then it
        // appears in place and a passing token submits (mirrors the subscribe form),
        // so no Turnstile widget sits in the page on load.
        const send = async () => {
            const text = ta.value.trim();
            if (!text) return;
            error.hidden = true;
            submit.setAttribute('disabled', 'disabled');
            if (!TURNSTILE_SITEKEY) return void doPost(undefined);
            turnstileMount.hidden = false;
            await loadTurnstile();
            if (!window.turnstile) return void doPost(undefined);
            turnstileMount.innerHTML = '';
            turnstileId = window.turnstile.render(turnstileMount, {
                sitekey: TURNSTILE_SITEKEY,
                size: 'flexible',
                callback: (token) => void doPost(token),
                'error-callback': () => fail('Verification failed - try again.'),
                'expired-callback': () => fail('Verification expired - try again.'),
            });
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

        const box = el('div', { class: parent ? 'comment-composer comment-composer-reply' : 'comment-composer' }, tabs, ta, preview, turnstileMount, error);
        const actions = el('div', { class: 'comment-composer-actions' }, submit);
        if (parent) {
            actions.append(el('button', { class: 'comment-link comment-cancel', type: 'button', click: () => box.remove() }, 'dismiss'));
        }
        box.append(actions);
        return box;
    }

    private openReply(c: Comment) {
        const li = this.root.querySelector(`li.comment[data-id="${c.id}"]`);
        // :scope > so an open composer on a *nested* reply doesn't block this one.
        if (!li || li.querySelector(':scope > .comment-composer-reply')) return;
        li.append(this.composer(c));
    }

    private signInPrompt(): HTMLElement {
        // Straight to Bluesky - no handle to type (autocomplete never filled it
        // anyway). The Worker starts the OAuth flow at the Bluesky entryway when no
        // handle is given; return_to brings the reader back to this post with the
        // composer focused.
        const returnTo = `${location.origin}${location.pathname}#comment-compose`;
        const btn = el('button', {
            class: 'comment-submit comment-signin-btn',
            type: 'button',
            click: () => {
                window.location.href = `${COMMENTS_API_URL}/oauth/login?return_to=${encodeURIComponent(returnTo)}`;
            },
        }, icon(BLUESKY_SVG), el('span', {}, 'Sign in with Bluesky'));
        return el('div', { class: 'comment-composer comment-signin' },
            el('p', { class: 'comments-status' }, 'Sign in with your Bluesky account to comment.'),
            btn,
        );
    }

    // Drop the session (POST /oauth/logout clears the cookie), then reload so the
    // composer reverts to the sign-in prompt.
    private async logout() {
        try {
            await api('/oauth/logout', { method: 'POST' });
        } catch {
            // best-effort; we still re-init below to reflect the cleared cookie
        }
        this.me = { loggedIn: false };
        this.focusStack = [];
        await this.reload();
    }

    // Per-comment "..." menu (#13). Returns null when there's nothing to offer
    // (e.g. a deleted tombstone you can't moderate). Soft delete keeps the row so
    // reply chains survive; "& remove" / "Remove" hard-delete a leaf (no replies).
    private actionsMenu(c: Comment): HTMLElement | null {
        const pop = el('div', { class: 'comment-menu-pop', role: 'menu', hidden: 'hidden' });
        const close = () => {
            pop.hidden = true;
            document.removeEventListener('click', onDoc, true);
        };
        const item = (label: string, onClick: () => void, cls = '') =>
            pop.append(el('button', { class: `comment-menu-item ${cls}`.trim(), type: 'button', role: 'menuitem', click: () => { close(); onClick(); } }, label));

        const canModerate = this.me.loggedIn && (this.me.did === c.author.did || !!this.me.isAdmin);
        const hasReplies = this.comments.some((x) => x.parentId === c.id);

        if (c.deleted) {
            // A tombstone: the only useful action is purging it, and only if it's
            // a leaf (removing one with replies would orphan them).
            if (canModerate && !hasReplies) item('Remove', () => this.delete(c, true), 'comment-menu-danger');
        } else {
            item('Permalink', () => this.copyPermalink(c));
            item('Copy markdown', () => this.copyMarkdown(c));
            item('Copy rich text', () => this.copyRich(c));
            if (c.parentId) item('View parent', () => this.gotoComment(c.parentId!));
            if (hasReplies) item('View replies', () => this.gotoFirstChild(c.id));

            const canEdit =
                this.me.loggedIn &&
                this.me.did === c.author.did &&
                Date.now() - c.createdAt <= EDIT_WINDOW_MS &&
                c.editCount < MAX_EDITS;
            if (canEdit) item('Edit', () => this.openEdit(c));

            if (canModerate) {
                item('Delete', () => this.delete(c, false), 'comment-menu-danger');
                if (!hasReplies) item('Delete & remove', () => this.delete(c, true), 'comment-menu-danger');
            }
            if (this.me.isAdmin && c.author.did && c.author.did !== this.me.did) {
                item('Ban author', () => this.ban(c, null), 'comment-menu-danger');
                item('Ban author · 10 days', () => this.ban(c, 10), 'comment-menu-danger');
            }
        }

        if (!pop.childElementCount) return null;

        const wrap = el('div', { class: 'comment-menu' });
        const btn = el('button', { class: 'comment-link comment-menu-btn', type: 'button', title: 'More', 'aria-label': 'More actions', 'aria-haspopup': 'menu' });
        btn.append(icon(MENU_SVG));
        const onDoc = (e: Event) => {
            if (!wrap.contains(e.target as Node)) close();
        };
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
        try {
            await navigator.clipboard.writeText(url);
            this.toast('Permalink copied');
        } catch {
            // Clipboard blocked (common on mobile / non-secure contexts): give the
            // URL in a modal so there's always a way to grab it.
            this.shareModal(url);
        }
    }

    // Fallback for a blocked clipboard: show the URL selectable with a Copy button.
    private shareModal(url: string) {
        overlay((close) => {
            const box = el('div', { class: 'comment-modal' });
            const input = el('input', { class: 'comment-modal-urlinput', type: 'text', readonly: 'readonly', 'aria-label': 'Permalink' }) as HTMLInputElement;
            input.value = url;
            input.addEventListener('focus', () => input.select());
            const copy = el('button', { class: 'comment-modal-btn', type: 'button' }, 'Copy');
            copy.addEventListener('click', async () => {
                input.select();
                try {
                    await navigator.clipboard.writeText(url);
                    copy.textContent = 'Copied';
                } catch {
                    copy.textContent = 'Select the text above';
                }
            });
            const done = el('button', { class: 'comment-modal-btn comment-modal-btn-ghost', type: 'button', click: close }, 'Close');
            box.append(
                el('h3', {}, 'Copy this link'),
                el('p', { class: 'comment-modal-note' }, 'Your browser blocked the clipboard. Copy it manually:'),
                input,
                el('div', { class: 'comment-modal-row' }, copy, done),
            );
            setTimeout(() => input.select(), 0);
            return box;
        });
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

    private gotoComment(id: string, center = false) {
        const li = this.root.querySelector<HTMLElement>(`li.comment[data-id="${id}"]`);
        if (!li) return;
        if (center) this.scrollCenter(li);
        else this.scrollSoft(li);
        li.classList.remove('comment-flash');
        void li.offsetWidth; // reflow so the animation restarts on repeat clicks
        li.classList.add('comment-flash');
    }

    // Posting your own comment: always bring it to the middle of the viewport so
    // the splash is unmissable. If it's taller than (most of) the screen,
    // top-align it instead so you land on its first line, not its middle.
    private scrollCenter(target: HTMLElement) {
        const rect = target.getBoundingClientRect();
        const vh = window.innerHeight;
        const top =
            rect.height >= vh * 0.9
                ? window.scrollY + rect.top - vh * 0.12
                : window.scrollY + rect.top - (vh - rect.height) / 2;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }

    // Scroll only when needed: if the target already sits in the top two-thirds of
    // the viewport, leave the page where it is; otherwise bring it up near the top
    // (above the bottom third). Mirrors the post "Continue reading" jump so landing
    // on a permalink or your freshly-posted comment never jolts the page.
    private scrollSoft(target: HTMLElement) {
        const rect = target.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < 0 || rect.top > vh * (2 / 3)) {
            window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - vh * 0.22), behavior: 'smooth' });
        }
    }

    // Reveal a comment (page it in / drill to it) then scroll + flash it. Shared by
    // the permalink hash handler and the post-a-comment flow.
    private focusComment(id: string) {
        if (this.revealPathTo(id)) this.render();
        requestAnimationFrame(() => this.gotoComment(id, true));
    }

    // After an OAuth round-trip that returned to #comment-compose, bring the
    // composer into view and focus it (runs once; clears the sentinel so a refresh
    // doesn't re-trigger).
    private composeFocused = false;
    private maybeFocusCompose() {
        if (this.composeFocused || location.hash !== '#comment-compose') return;
        this.composeFocused = true;
        const section = this.root.closest('section.comments');
        const ta = this.root.querySelector<HTMLTextAreaElement>('textarea.comment-input');
        requestAnimationFrame(() => {
            if (section instanceof HTMLElement) this.scrollSoft(section);
            history.replaceState(null, '', location.pathname + location.search);
            ta?.focus();
        });
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
                await this.reload();
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

    // Soft delete leaves a "comment deleted" tombstone (keeps the reply chain).
    // Hard delete removes the row entirely; the Worker refuses it if there are
    // replies, so we only offer it on leaves.
    private async delete(c: Comment, hard = false) {
        const prompt = hard
            ? c.deleted
                ? 'Permanently remove this deleted comment? This cannot be undone.'
                : 'Delete and permanently remove this comment? This cannot be undone.'
            : 'Delete this comment?';
        if (!confirm(prompt)) return;
        const res = await api(`/comments/${c.id}${hard ? '?hard=1' : ''}`, { method: 'DELETE' });
        if (res.ok) {
            await this.reload();
        } else {
            const { error: msg } = (await res.json().catch(() => ({}))) as { error?: string };
            this.toast(msg || 'Could not remove the comment.');
        }
    }
}

export function initComments() {
    const root = document.querySelector<HTMLElement>('[data-comments]');
    const postId = root?.dataset.postId;
    if (!root || !postId) return;
    new CommentsWidget(root, postId, root.dataset.opDid ?? null).init();
}
