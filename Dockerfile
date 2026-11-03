# Multi-stage: build client, run API that can also serve static files later if needed.
# Default compose runs API + separate Vite-built static via nginx-like simple static server pattern:
# For MVP we expose the API container; client is built as an artifact in CI.

FROM node:22-alpine AS client-build
WORKDIR /client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:22-alpine AS server
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=client-build /client/dist ./public
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["npm", "start"]
