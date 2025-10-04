# ----------- Stage 1: Build -----------
FROM node:20 AS builder

WORKDIR /dashboard

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

WORKDIR /dashboard

# Копируем файлы из builder stage
COPY --from=builder /dashboard/package.json ./
COPY --from=builder /dashboard/pnpm-lock.yaml* ./
COPY --from=builder /dashboard/node_modules ./node_modules
COPY --from=builder /dashboard/.next ./.next
COPY --from=builder /dashboard/public ./public
COPY --from=builder /dashboard/prisma ./prisma

# Устанавливаем pnpm для запуска
RUN npm install -g pnpm

# Продакшн env
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# CMD запускаем через pnpm
CMD ["pnpm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
