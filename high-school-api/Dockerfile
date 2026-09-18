# syntax=docker/dockerfile:1.6
# =============================================================================
# High School Management System — API
#
# Multi-stage build:
#   builder  — installs dev deps, generates Prisma client, compiles TypeScript
#   runtime  — minimal image with production deps + compiled output only
#
# Base image: node:22-slim (Debian bookworm, glibc). Chosen over alpine
# because Prisma's driver adapters and bcryptjs have fewer surprises with
# glibc, and the size difference (~40 MB) is negligible for a server image.
# =============================================================================


# -----------------------------------------------------------------------------
# Stage 1 — build
# -----------------------------------------------------------------------------
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies first so Docker caches this layer. Only the package
# manifests are copied — a change to src/ doesn't invalidate the npm cache.
#
# `npm ci` (not `npm install`) — reproducible, fails if package-lock.json
# is out of sync with package.json, and doesn't silently update the lock.
COPY package.json package-lock.json ./
RUN npm ci

# Prisma client is generated from the schema. The generator writes to
# `src/generated/prisma` (custom output path in schema.prisma), so this must
# run before the TypeScript build.
COPY prisma ./prisma
COPY prisma.config.ts ./

# prisma.config.ts calls env('DATABASE_URL') at load time, which throws if
# the variable is unset. `prisma generate` itself never connects to the
# database, but the config file is evaluated regardless — so we set a
# placeholder here. This value is NOT baked into the runtime image; it exists
# only inside this build stage.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

# Build the app. The `build` script (package.json) must include `tsc-alias`
# between `tsc` and the asset copy — see the note in this file's companion
# commit message. Without tsc-alias, the emitted JS still contains `@/*`
# aliases and Node cannot resolve them.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build


# -----------------------------------------------------------------------------
# Stage 2 — runtime
# -----------------------------------------------------------------------------
FROM node:22-slim AS runtime

# `dumb-init` (or tini) as PID 1 forwards signals to the Node process,
# reaps zombies, and handles SIGTERM correctly when the container is
# stopped. Without it, `docker stop` sends SIGTERM to a shell or to Node
# indirectly, and the graceful-shutdown path in server.ts may not fire.
RUN apt-get update \
 && apt-get install -y --no-install-recommends dumb-init \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies. `npm ci --omit=dev` is reproducible
# and excludes the devDependencies that were needed to build but aren't
# needed to run (typescript, tsc-alias, prisma CLI, tsx, vitest, etc.).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the compiled application and the generated Prisma client.
#
# The Prisma client lives at `dist/generated/prisma` because the generator
# writes to `src/generated/prisma` and `tsc` compiles it into `dist/`. The
# `copy:prisma-assets` script in package.json copies non-TS assets (WASM,
# .d.ts) alongside. Nothing is read from node_modules/.prisma because the
# Prisma 7 `prisma-client` generator produces a self-contained client.
COPY --from=builder /app/dist ./dist

# Migrations and seed. Migrations are needed at startup to apply any pending
# schema changes; the seed file is included so `prisma db seed` can be run
# inside the container (though it's not run automatically — see entrypoint).
COPY prisma ./prisma

# Entrypoint script runs `prisma migrate deploy` before starting the server.
# See docker-entrypoint.sh in the repo root for the exact logic.
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Writable directories for the app. Created here and chowned to the
# non-root user so the bind-mounted named volumes inherit the right
# ownership on first run.
RUN mkdir -p uploads logs \
 && chown -R node:node uploads logs dist prisma docker-entrypoint.sh

# Drop privileges. The `node` user ships with the official Node image
# (UID 1000). Running as non-root means a compromise of the Node process
# doesn't hand over the container's root filesystem.
USER node

EXPOSE 5000

# dumb-init is PID 1 and execs the entrypoint, which execs Node.
# The chain is: dumb-init → docker-entrypoint.sh → node dist/server.js
#
# If the entrypoint ever spawns Node as a child without `exec`, signals
# stop at the shell. The entrypoint uses `exec` explicitly — see that file.
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]