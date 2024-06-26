# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app/backend

COPY apps/backend/package*.json ./

RUN npm install

COPY apps/backend .

RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app/backend

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules

CMD ["node", "dist/main"]
