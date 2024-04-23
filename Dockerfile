# Dockerfile
FROM node:hydrogen-alpine AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run build

FROM node:hydrogen-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./ 
COPY --from=builder /app/bin/healthcheck.cjs ./
COPY --from=builder /app/bin/seed.cjs ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

HEALTHCHECK --interval=3s --timeout=3s --start-period=15s CMD node /healthcheck.cjs && node /seed.cjs

CMD [ "npm", "run", "start:dockerized" ]
