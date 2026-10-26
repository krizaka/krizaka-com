# krizaka.com — production image (DigitalOcean App Platform, or any container host).
# Next.js `output: "standalone"`: the runner carries server.js, the traced node_modules (sharp included, for next/image),
# public/ and .next/static — no npm install at run time.
#
#   docker build -t krizaka-com .
#   docker run --rm -p 3000:3000 --env-file .env.local krizaka-com     # contact delivery is optional (503 without it)
#
# Node 24 = the production runtime; Alpine (musl) = sharp's prebuilt linuxmusl binaries, and
# none of glibc's allocator fragmentation the Next self-hosting guide warns about for image optimisation.

FROM node:24-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# 1. Dependencies — the lockfile only, so this layer is cached until package-lock.json changes. Scripts are skipped:
#    `postinstall` generates from the sources (the registry versions), which are not copied yet.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# 2. Build — the same `npm run build` as CI (it regenerates the org figures and the
#    registry versions, then `next build`).
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time values (App Platform passes BUILD_TIME / RUN_AND_BUILD_TIME variables as build args):
# - where the media are served from (lib/cdn.ts; empty = https://krizaka-assets.b-cdn.net);
# No secret goes through a build argument (it would stay in the image history): scripts/gen-org-stats.mjs reads the public
# GitHub API anonymously here and keeps the previous list when it is rate-limited (the build never fails for it).
ARG NEXT_PUBLIC_MEDIA_CDN_URL
ARG NEXT_PUBLIC_ABUSE_CAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_MEDIA_CDN_URL=$NEXT_PUBLIC_MEDIA_CDN_URL
ENV NEXT_PUBLIC_ABUSE_CAPTCHA_SITE_KEY=$NEXT_PUBLIC_ABUSE_CAPTCHA_SITE_KEY
ENV NODE_ENV=production
RUN npm run postinstall && npm run build

# 3. Runner — standalone server, unprivileged user.
FROM node:24-alpine@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
# The runtime starts `node` only: npm and corepack (and the dependencies they bundle, flagged by the image scan) are not shipped.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
