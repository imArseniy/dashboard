# ---------- Stage 1: deps ----------
FROM node:20 AS deps
WORKDIR /app

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# Копируем package.json и lock-файл
COPY package.json pnpm-lock.yaml* ./

# Устанавливаем зависимости (без dev — для prod-сборки)
RUN pnpm install --frozen-lockfile

# ---------- Stage 2: builder ----------
FROM node:20 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерируем Prisma Client (важно до билда Next.js)
RUN pnpm prisma generate

# Билдим Next.js
RUN pnpm build

# ---------- Stage 3: runner ----------
FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Добавляем только нужное из builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Запуск в продакшене
CMD ["pnpm", "start"]
