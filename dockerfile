# Этап 1: билд
FROM node:20-alpine AS builder

# Рабочая директория
WORKDIR /app

# Установим зависимости
COPY package*.json ./
COPY pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Скопировать исходники
COPY . .

# Сборка Next.js (production build)
RUN pnpm build

# Этап 2: production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Добавляем только нужное из билдера
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

EXPOSE 3000

# Запуск приложения
CMD ["pnpm", "start"]
