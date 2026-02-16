# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Build-time arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_AUTH0_CALLBACK_URL
ARG VITE_AUTH_BYPASS=false
ARG VITE_DEFAULT_TENANT_ID

# Make args available as env vars during build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE
ENV VITE_AUTH0_CALLBACK_URL=$VITE_AUTH0_CALLBACK_URL
ENV VITE_AUTH_BYPASS=$VITE_AUTH_BYPASS
ENV VITE_DEFAULT_TENANT_ID=$VITE_DEFAULT_TENANT_ID

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:1.27-alpine

# Nginx config selection: "cloud-run" (default) or "local" (for docker-compose)
ARG NGINX_CONFIG=cloud-run

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the appropriate nginx config based on environment
COPY nginx.conf /etc/nginx/nginx-local.conf
COPY nginx.cloud-run.conf /etc/nginx/nginx-cloud-run.conf
RUN if [ "$NGINX_CONFIG" = "local" ]; then \
      cp /etc/nginx/nginx-local.conf /etc/nginx/conf.d/default.conf; \
    else \
      cp /etc/nginx/nginx-cloud-run.conf /etc/nginx/conf.d/default.conf; \
    fi && \
    rm /etc/nginx/nginx-local.conf /etc/nginx/nginx-cloud-run.conf

# Entrypoint for runtime config injection
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
