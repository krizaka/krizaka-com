# krizaka.com — production image (DigitalOcean App Platform, or any container host).
# Next.js `output: "standalone"`: the runner carries server.js, the traced node_modules (sharp included, for next/image),
# public/ and .next/static — no npm install at run time.
#
#   docker build -t krizaka-com .
#   docker run --rm -p 3000:3000 --env-file .env.local krizaka-com     # contact delivery is optional (503 without it)
#
# Node 24 = the version Vercel builds production with today; Alpine (musl) = sharp's prebuilt linuxmusl binaries, and
# none of glibc's allocator fragmentation the Next self-hosting guide warns about for image optimisation.

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# 1. Dependencies — the lockfile only, so this layer is cached until package-lock.json changes. Scripts are skipped:
#    `postinstall` generates from the sources (Fumadocs, the /docs/ui examples), which are not copied yet.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# 2. Build — the same `npm run build` as CI and Vercel (it regenerates the /docs/ui examples, the org figures and the
#    registry versions, then `next build`).
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time values (App Platform passes BUILD_TIME / RUN_AND_BUILD_TIME variables as build args):
# - where every "open Orochia" link points (inlined in the pages and the client bundle);
# - where the media are served from (lib/cdn.ts; empty = https://krizaka-assets.b-cdn.net);
# - an optional read-only GitHub token so scripts/gen-org-stats.mjs is not rate-limited (the build never fails without it).
#   It stays in this stage: the runner image does not inherit it.
ARG NEXT_PUBLIC_OROCHIA_APP_URL
ARG NEXT_PUBLIC_CDN_URL
ARG GITHUB_TOKEN
ENV NEXT_PUBLIC_OROCHIA_APP_URL=$NEXT_PUBLIC_OROCHIA_APP_URL
ENV NEXT_PUBLIC_CDN_URL=$NEXT_PUBLIC_CDN_URL
ENV NODE_ENV=production
RUN npm run postinstall && GITHUB_TOKEN=$GITHUB_TOKEN npm run build

# 3. Runner — standalone server, unprivileged user.
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
