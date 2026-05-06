# DevFusion Hub - Dockerfile for CloudBase CloudRun
FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY public ./public
COPY postcss.config.mjs next.config.ts tsconfig.json ./

ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./dev.db"

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Generate Prisma client and seed database at build time
RUN npx prisma generate
RUN npx tsx prisma/seed.ts

EXPOSE 3000

CMD ["npx", "next", "start"]
