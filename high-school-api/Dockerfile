# --- deps + build stage ---
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY src ./src
RUN npx prisma generate
RUN npm run build

# --- runtime stage ---
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# dist/generated (compiled client + copied WASM/binary assets) comes along
# with the rest of the build — no separate node_modules/.prisma copy needed
# now that the client lives inside src/ instead of node_modules.
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

RUN mkdir -p uploads logs

EXPOSE 5000
CMD ["node", "dist/server.js"]
