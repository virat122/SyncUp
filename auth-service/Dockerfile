# ---------- Builder Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npx prisma generate

# ---------- Production Stage ----------
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 4001

CMD ["node", "src/server.js"]