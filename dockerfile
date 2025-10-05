# ----------- Stage 1: Build -----------
FROM node:20-alpine AS builder

WORKDIR /app

# Оптимизация для CI/CD
RUN npm install -g pnpm

# Копируем package.json и lockfile
COPY package.json pnpm-lock.yaml* ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем весь проект
COPY . .

# Build-time ARG (будут переданы через CI/CD)
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

# ----------- Stage 2: Runner -----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем артефакты из builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Запуск
CMD ["pnpm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
