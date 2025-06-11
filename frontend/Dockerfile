# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Build with ESLint checks disabled
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build -- --no-lint

EXPOSE 3000

CMD ["npm", "start"]

