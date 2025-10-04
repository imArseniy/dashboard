# ----------- Stage 1: Build -----------
FROM node:20 AS builder

WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json и lockfile
COPY package.json pnpm-lock.yaml* ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем весь проект
COPY . .

# Build-time env для Next.js
ARG NEXT_PUBLIC_CLERK_FRONTEND_API
ARG CLERK_API_KEY
ARG SENTRY_AUTH_TOKEN

ENV NEXT_PUBLIC_CLERK_FRONTEND_API=$NEXT_PUBLIC_CLERK_FRONTEND_API
ENV CLERK_API_KEY=$CLERK_API_KEY
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Генерация Prisma Client
RUN pnpm prisma generate

# Сборка Next.js
RUN pnpm build

# ----------- Stage 2: Production -----------
FROM node:20 AS runner

WORKDIR /app

# Копируем только нужные файлы из билд стадии
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Продакшн env
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Запуск приложения
CMD ["pnpm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
