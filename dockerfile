# 1. Базовый образ
FROM node:20-alpine AS base

# 2. Устанавливаем необходимые пакеты
RUN apk add --no-cache libc6-compat bash

WORKDIR /app

# 3. Устанавливаем pnpm
RUN npm install -g pnpm

# 4. Копируем package.json и lockfile
COPY package.json pnpm-lock.yaml* ./

# 5. Устанавливаем зависимости (devDeps нужны для ts-node, если будем использовать TS seed)
RUN pnpm install

# 6. Копируем весь проект
COPY . .

# 7. Генерируем Prisma Client
RUN pnpm prisma generate

# 8. Билдим Next.js
RUN pnpm build

# 9. Запуск приложения
CMD ["pnpm", "start"]
