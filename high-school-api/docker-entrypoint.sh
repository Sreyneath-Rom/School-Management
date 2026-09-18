#!/bin/sh
# =============================================================================
# Container entrypoint
#
# Runs pending Prisma migrations, then execs the Node process.
#
# Why migrations run here rather than as a separate step:
#   - On first boot against an empty database, the app 500s on every request
#     because no tables exist. Running migrations before the server starts
#     avoids that.
#   - On subsequent boots, `migrate deploy` is a no-op if there's nothing
#     pending, so this is safe to run every time.
#
# Why `exec` on the final command:
#   - Without it, Node runs as a child of this shell. Signals from
#     `docker stop` reach the shell, not Node, and the graceful-shutdown
#     path in server.ts never fires. `exec` replaces the shell process with
#     Node, so PID 1's child (dumb-init) forwards SIGTERM directly.
# =============================================================================

set -e

echo "[entrypoint] applying Prisma migrations…"
npx prisma migrate deploy

# To seed on first boot only, uncomment this block. It's off by default
# because re-running the seed on every container restart can clobber data
# an admin has edited — the seed uses `update: {}` on most upserts, but
# `grantAll` does a full replace of role permissions.
#
# if [ "${SEED_ON_BOOT:-false}" = "true" ]; then
#   echo "[entrypoint] seeding database…"
#   npx prisma db seed
# fi

echo "[entrypoint] starting API…"
exec node dist/server.js