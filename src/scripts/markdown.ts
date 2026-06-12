// Safe, restricted markdown for comments (issues #17 + #18).
//
// Security model: a vetted parser (marked) with gfm OFF (no autolinking of raw
// URLs, no tables), then a strict DOMPurify allowlist. We never build HTML from
// user input by hand. The only interactive surface is links, and those are
// rewired so a `[label](url)` can't silently navigate off-site (anti-phishing):
// clicking shows the real URL in a modal instead.
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Allowed output tags. Headings are allowed through here only so we can collapse
// them to bold below; img/table/script/etc. are dropped (content kept as text).
const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'del', 'code', 'pre', 'a', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const ALLOWED_ATTR = ['href'];

export function renderMarkdown(raw: string): string {
    const dirty = marked.parse(raw ?? '', { gfm: false, breaks: true, async: false }) as string;
    const clean = DOMPurify.sanitize(dirty, { ALLOWED_TAGS, ALLOWED_ATTR, ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false });
    const tmp = document.createElement('div');
    tmp.innerHTML = clean;
    // Headings render as bold paragraphs - no heading levels in comments.
    tmp.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
        const p = document.createElement('p');
        const s = document.createElement('strong');
        s.textContent = h.textContent ?? '';
        p.append(s);
        h.replaceWith(p);
    });
    return tmp.innerHTML;
}

// Rewire rendered links so clicking opens a confirm modal showing the true URL
// (no silent navigation). Call after setting a container's innerHTML.
export function wireLinks(container: HTMLElement): void {
    container.querySelectorAll('a[href]').forEach((node) => {
        const a = node as HTMLAnchorElement;
        const url = a.getAttribute('href') || '';
        a.setAttribute('href', '#');
        a.removeAttribute('target');
        a.classList.add('comment-mdlink');
        a.title = url;
        a.append(linkIcon());
        a.addEventListener('click', (e) => {
            e.preventDefault();
            openLinkModal(url);
        });
    });
}

function linkIcon(): HTMLElement {
    const s = document.createElement('span');
    s.className = 'comment-linkicon';
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 10 10 6M7 4h5v5"/><path d="M11 9v3H4V5h3"/></svg>';
    return s;
}

// ---- modals -----------------------------------------------------------------

function overlay(build: (close: () => void) => HTMLElement): void {
    const back = document.createElement('div');
    back.className = 'comment-modal-back';
    const close = () => back.remove();
    back.addEventListener('click', (e) => {
        if (e.target === back) close();
    });
    document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', esc);
        }
    });
    back.append(build(close));
    document.body.append(back);
}

export function openLinkModal(url: string): void {
    overlay((close) => {
        const box = document.createElement('div');
        box.className = 'comment-modal';
        const h = document.createElement('h3');
        h.textContent = 'External link';
        const p = document.createElement('p');
        p.className = 'comment-modal-note';
        p.textContent = 'This link goes to:';
        const u = document.createElement('div');
        u.className = 'comment-modal-url';
        u.textContent = url;
        const row = document.createElement('div');
        row.className = 'comment-modal-row';
        const copy = document.createElement('button');
        copy.className = 'comment-modal-btn';
        copy.textContent = 'Copy link';
        copy.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(url);
                copy.textContent = 'Copied';
            } catch {
                copy.textContent = 'Copy failed';
            }
        });
        const dismiss = document.createElement('button');
        dismiss.className = 'comment-modal-btn comment-modal-btn-ghost';
        dismiss.textContent = 'Close';
        dismiss.addEventListener('click', close);
        row.append(copy, dismiss);
        box.append(h, p, u, row);
        return box;
    });
}

export function openSyntaxHelp(): void {
    overlay((close) => {
        const box = document.createElement('div');
        box.className = 'comment-modal';
        box.innerHTML = `
            <h3>Formatting</h3>
            <ul class="comment-syntax">
              <li><code>**bold**</code> &rarr; <strong>bold</strong></li>
              <li><code>*italic*</code> &rarr; <em>italic</em></li>
              <li><code>\`inline code\`</code> &rarr; <code>inline code</code></li>
              <li><code>\`\`\`</code> on their own lines wrap a <strong>code block</strong></li>
              <li><code>&gt; quote</code> &rarr; a blockquote</li>
            </ul>
            <p class="comment-modal-note">Links: a plain pasted URL stays as text (copy it). A <code>[label](url)</code> link is clickable but opens a window showing the real address first - so links can't be disguised. No images, tables, or HTML.</p>`;
        const dismiss = document.createElement('button');
        dismiss.className = 'comment-modal-btn';
        dismiss.textContent = 'Got it';
        dismiss.addEventListener('click', close);
        box.append(dismiss);
        return box;
    });
}
