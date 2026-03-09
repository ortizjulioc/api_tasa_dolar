# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Solo instalamos dependencias de producción
RUN npm install --omit=dev
# Copiamos solo la carpeta dist del builder
COPY --from=builder /app/dist ./dist

# Exponemos el puerto
EXPOSE 3004
CMD ["node", "dist/index.js"]