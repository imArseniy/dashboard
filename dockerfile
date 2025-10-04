# Используем Node.js 20 (Alpine для лёгкости)
FROM node:20-alpine AS base

# Устанавливаем зависимости для билда
RUN apk add --no-cache libc6-compat bash

WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json и lockfile
COPY package.json pnpm-lock.yaml* ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY . .

# Билдим проект
RUN pnpm build

# Запуск production версии
CMD ["pnpm", "start"]
