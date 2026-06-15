#!/usr/bin/env bash
# One-command local dev for the blog + comments worker, wired together correctly.
#
# The whole point of this script is the gotcha it hides: the comments worker's
# dev CORS (comments/.dev.vars ALLOWED_ORIGIN) must match the exact origin the
# blog is served from, and the session cookie must be same-site between the two.
# So the blog AND the worker have to share one host. We pick a single HOST (your
# Tailscale IP by default, so it also works from your phone) and point both at
# it. Loading the blog from localhost while the worker allows the Tailscale IP =
# CORS failure = "Comments are unavailable" with no obvious cause.
#
# Usage:
#   tools/dev.sh up [--seed] [HOST]   # start worker + astro, optionally seed a demo thread
#   tools/dev.sh seed [HOST] [POSTID] # (re)seed a nested demo thread on a post
#   tools/dev.sh stop                 # stop both servers
#
# After `up`, log in without Bluesky via the printed /oauth/dev-login link
# (DEV_AUTH shim -> a @fisher.sh admin session), then open the printed post URL.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKER_PORT=8787
BLOG_PORT=4321
SEED_POST="InTq4USBbA"   # calsync-it-syncs-calendars (a post with a stable id)

resolve_host() {
    if [ -n "${1:-}" ]; then echo "$1"; return; fi
    local ip
    ip="$(tailscale ip -4 2>/dev/null | head -1 || true)"
    [ -z "$ip" ] && ip="$(/Applications/Tailscale.app/Contents/MacOS/Tailscale ip -4 2>/dev/null | head -1 || true)"
    [ -z "$ip" ] && ip="127.0.0.1"
    echo "$ip"
}

seed() {
    local host="$1" post="$2"
    python3 - "$host" "$WORKER_PORT" "$post" <<'PY'
import json, sys, urllib.request, urllib.error
host, port, post = sys.argv[1], sys.argv[2], sys.argv[3]
W = f"http://{host}:{port}/comments"
ORIGIN = f"http://{host}:4321"
ADMIN = "did:plc:auevmn4wzowwhiuq6jo3ysl6"
def post_c(did, handle, parent, body):
    data = json.dumps({"postId": post, "parentId": parent, "body": body}).encode()
    req = urllib.request.Request(W, data=data, method="POST", headers={
        "content-type": "application/json", "Origin": ORIGIN,
        "x-dev-did": did, "x-dev-handle": handle})
    try:
        return json.load(urllib.request.urlopen(req)).get("id")
    except urllib.error.HTTPError as e:
        print("  seed error:", e.read().decode()[:120]); return None
a = post_c(ADMIN, "fisher.sh", None, "Top-level comment from the post author. Anyone hit this?")
b = post_c("did:plc:ada", "ada.dev", a, "A reply - this should sit under the spine with an elbow.")
post_c(ADMIN, "fisher.sh", b, "A nested reply, one level deeper.")
post_c("did:plc:jules", "jules.art", a, "A second reply to the top comment (sibling of ada).")
post_c("did:plc:mira", "mira.dev", None, "A second top-level comment.")
print("  seeded a nested demo thread on", post)
PY
}

wait_http() { # url label
    for _ in $(seq 1 30); do
        if curl -s -m3 -o /dev/null "$1"; then echo "  ready: $2"; return 0; fi
        sleep 1
    done
    echo "  TIMEOUT waiting for $2 ($1)"; return 1
}

case "${1:-up}" in
up)
    DO_SEED=0; HOST_ARG=""
    shift || true
    for a in "$@"; do [ "$a" = "--seed" ] && DO_SEED=1 || HOST_ARG="$a"; done
    HOST="$(resolve_host "$HOST_ARG")"
    echo "host: $HOST  (blog :$BLOG_PORT, worker :$WORKER_PORT)"

    cat > "$ROOT/comments/.dev.vars" <<EOF
DEV_AUTH=1
ALLOWED_ORIGIN=http://$HOST:$BLOG_PORT
IP_HASH_SALT=local-sandbox-salt
EOF
    cat > "$ROOT/.env" <<EOF
PUBLIC_COMMENTS_API_URL=http://$HOST:$WORKER_PORT
PUBLIC_TURNSTILE_SITEKEY=
EOF

    echo "applying local D1 migrations..."
    (cd "$ROOT/comments" && npm run migrate:local >/dev/null 2>&1) || true

    echo "starting worker + blog..."
    (cd "$ROOT/comments" && nohup npx wrangler dev --ip 0.0.0.0 --port "$WORKER_PORT" >/tmp/log-dev-worker.log 2>&1 &)
    (cd "$ROOT" && nohup npm run dev -- --host 0.0.0.0 --port "$BLOG_PORT" >/tmp/log-dev-blog.log 2>&1 &)

    wait_http "http://$HOST:$WORKER_PORT/comments?post_id=$SEED_POST" "comments worker"
    wait_http "http://$HOST:$BLOG_PORT/" "blog"

    [ "$DO_SEED" = "1" ] && { echo "seeding..."; seed "$HOST" "$SEED_POST"; }

    echo ""
    echo "  ----------------------------------------------------------------"
    echo "  log in (no Bluesky):  http://$HOST:$WORKER_PORT/oauth/dev-login"
    echo "  demo post:            http://$HOST:$BLOG_PORT/posts/2026/06/12/calsync-it-syncs-calendars/"
    echo "  blog home:            http://$HOST:$BLOG_PORT/"
    echo "  logs:  /tmp/log-dev-worker.log  /tmp/log-dev-blog.log"
    echo "  stop:  tools/dev.sh stop"
    echo "  ----------------------------------------------------------------"
    echo "  NOTE: open the blog via the host above, NOT localhost - the worker's"
    echo "        dev CORS is pinned to it."
    ;;
seed)
    HOST="$(resolve_host "${2:-}")"
    seed "$HOST" "${3:-$SEED_POST}"
    ;;
stop)
    for p in "$WORKER_PORT" "$BLOG_PORT"; do
        pids="$(lsof -ti tcp:"$p" 2>/dev/null || true)"
        [ -n "$pids" ] && { echo "killing :$p ($pids)"; echo "$pids" | xargs kill 2>/dev/null || true; }
    done
    echo "stopped"
    ;;
*)
    echo "usage: tools/dev.sh up [--seed] [HOST] | seed [HOST] [POSTID] | stop"; exit 1
    ;;
esac
