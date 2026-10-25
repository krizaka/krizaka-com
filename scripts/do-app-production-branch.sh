#!/usr/bin/env bash
# Switch the DigitalOcean App Platform app of krizaka.com from deploying `main` to deploying `production`
# (the release train, krizaka/krizaka-com#389): after it, a merge on main deploys nothing; a published release
# (production.yml fast-forwards `production` to its tag) deploys.
#
# Run it ONCE, by hand, AFTER the first release exists (the `production` branch is on GitHub) — before, the app would
# point to a branch that does not exist and the site would stop deploying. The script refuses in that case.
#
# It reads the LIVE spec (`doctl apps spec get`, so the secrets the repository's copy has no value for are kept as
# they are), changes only `branch: main` → `branch: production` under `repo: krizaka/krizaka-com`, and applies it.
# Idempotent: an app already on `production` is left alone. `--dry-run` prints the change and applies nothing.
#
# Usage: scripts/do-app-production-branch.sh [--dry-run] [--app <APP_ID>]
set -euo pipefail

APP_ID="5070cde0-f34d-439d-a2f9-6375dccdf5b2" # krizaka-com
REPO="krizaka/krizaka-com"
DRY_RUN=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --app) APP_ID="$2"; shift ;;
    -h|--help) sed -n '2,13p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
  shift
done

command -v doctl >/dev/null || { echo "doctl is not installed" >&2; exit 1; }
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

doctl apps spec get "$APP_ID" --format yaml > "$tmp/live.yaml"

# Only the `branch:` line of a `github:` block whose `repo:` is this repository (the keys come in any order: the live
# spec sorts them, branch before repo). A block is the lines indented deeper than its `github:` line.
awk -v repo="$REPO" '
  function indent(l) { match(l, /^[[:space:]]*/); return RLENGTH }
  function flush(   i, hit) {
    hit = 0
    for (i = 1; i <= n; i++) if (buf[i] ~ /^[[:space:]]*repo:[[:space:]]*/ && buf[i] ~ ("repo:[[:space:]]*" repo "[[:space:]]*$")) hit = 1
    for (i = 1; i <= n; i++) {
      if (hit && buf[i] ~ /^[[:space:]]*branch:[[:space:]]*main[[:space:]]*$/) { sub(/main/, "production", buf[i]); changed++ }
      print buf[i]
    }
    n = 0; ingh = 0
  }
  {
    if (ingh && $0 !~ /^[[:space:]]*$/ && indent($0) <= ghindent) flush()
    if (ingh) { buf[++n] = $0; next }
    if ($0 ~ /^[[:space:]]*github:[[:space:]]*$/) { print; ingh = 1; ghindent = indent($0); n = 0; next }
    print
  }
  END { if (ingh) flush(); if (!changed) exit 3 }
' "$tmp/live.yaml" > "$tmp/new.yaml" || status=$?

if [[ "${status:-0}" = 3 ]]; then
  if grep -Eq '^[[:space:]]*branch:[[:space:]]*production[[:space:]]*$' "$tmp/live.yaml"; then
    echo "The app $APP_ID already deploys from production: nothing to do."
    exit 0
  fi
  echo "No 'branch: main' under 'repo: $REPO' in the live spec of $APP_ID: look at it by hand." >&2
  exit 1
elif [[ "${status:-0}" != 0 ]]; then
  exit "$status"
fi

echo "The change to the live spec of $APP_ID:"
diff -U1 "$tmp/live.yaml" "$tmp/new.yaml" | sed -n '3,$p' || true

if [[ "$DRY_RUN" = 1 ]]; then
  echo "[dry-run] nothing applied."
  exit 0
fi

# Never point the app to a branch that does not exist: the site would stop deploying.
if ! git ls-remote --exit-code --heads "https://github.com/$REPO.git" production >/dev/null; then
  echo "The branch 'production' does not exist on $REPO yet: publish the first release (merge « chore: release »), then run this again." >&2
  exit 1
fi

doctl apps spec validate "$tmp/new.yaml" --schema-only >/dev/null
doctl apps update "$APP_ID" --spec "$tmp/new.yaml" >/dev/null
echo "The app $APP_ID now deploys from production."
