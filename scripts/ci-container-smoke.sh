#!/usr/bin/env bash
# Smoke test of the production image (run by the shared node-ci.yml `container-smoke`, with CI_IMAGE = the image just built):
# the routes, the redirects, the SEO contracts on the HTML the server really sends, a real browser on the real container.
set -euo pipefail
IMAGE="${CI_IMAGE:-krizaka-com:ci}"
docker run -d --name site -p 3000:3000 "$IMAGE"
trap 'docker logs site | tail -20' EXIT
for _ in $(seq 1 30); do curl -fsS http://localhost:3000/api/health && break; sleep 1; done
check() { code=$(curl -s -o /dev/null -w '%{http_code}' "$@"); echo "$code $*"; [ "$code" = "$EXPECT" ]; }
EXPECT=200 check http://localhost:3000/en
EXPECT=308 check http://localhost:3000/fr/docs/ui
EXPECT=308 check http://localhost:3000/docs/ui/button
EXPECT=200 check http://localhost:3000/en/open-source
# Two views (2026-10-17): /products merged into the home, 308 to its products section.
EXPECT=308 check http://localhost:3000/en/products
# The products live on their own sites: their old addresses answer 308 (lib/product-redirects.ts).
EXPECT=308 check http://localhost:3000/en/products/orochia
EXPECT=308 check http://localhost:3000/docs/orazaka/cli
EXPECT=200 check http://localhost:3000/sitemap.xml
EXPECT=200 check http://localhost:3000/llms.txt
EXPECT=307 check http://localhost:3000/
EXPECT=404 check http://localhost:3000/en/this-page-does-not-exist
# No delivery channel configured: the contact API fails closed.
EXPECT=503 check -X POST http://localhost:3000/api/contact -H 'content-type: application/json' \
  -d '{"name":"CI","email":"ci@example.com","company":"","topic":"other","message":"Container smoke test.","locale":"en"}'
# The SEO contract on the HTML the server really sends (canonical www, hreflang, JSON-LD, robots, llms.txt).
node scripts/check-seo.mjs --base http://localhost:3000
# The family contract shared by every Krizaka site (robots, AI crawlers, sitemap, llms.txt, JSON-LD back to the Organization).
node scripts/check-seo-family.mjs --base http://localhost:3000 --host https://www.krizaka.com --organization --types Organization,WebSite
# 360–1440 px, dark and light: no page scrolls sideways (a real browser on the real container).
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
node scripts/check-overflow.mjs --base http://localhost:3000
# The engine flow's dots travel and the engine breathes (reduced motion OFF; at rest when ON): check-overflow runs
# under reduced motion and could not see a frozen figure.
node scripts/check-motion.mjs --base http://localhost:3000
# A footer link lands at the top of its page, heading focused; one footer landmark per page (/story peer review).
node scripts/check-arrival.mjs --base http://localhost:3000
