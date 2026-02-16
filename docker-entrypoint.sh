#!/bin/sh
# Docker entrypoint that injects runtime environment variables into config.js
# This allows configuration changes without rebuilding the image

set -e

CONFIG_FILE="/usr/share/nginx/html/config.js"

# Only inject if runtime env vars are set
if [ -n "$RUNTIME_API_URL" ] || [ -n "$RUNTIME_AUTH0_DOMAIN" ]; then
  echo "Injecting runtime configuration..."

  cat > "$CONFIG_FILE" << EOF
window.__RUNTIME_CONFIG__ = {
  API_URL: '${RUNTIME_API_URL:-}' || undefined,
  AUTH0_DOMAIN: '${RUNTIME_AUTH0_DOMAIN:-}' || undefined,
  AUTH0_CLIENT_ID: '${RUNTIME_AUTH0_CLIENT_ID:-}' || undefined,
  AUTH0_AUDIENCE: '${RUNTIME_AUTH0_AUDIENCE:-}' || undefined,
  AUTH0_CALLBACK_URL: '${RUNTIME_AUTH0_CALLBACK_URL:-}' || undefined,
  AUTH_BYPASS: ${RUNTIME_AUTH_BYPASS:-false},
  DEFAULT_TENANT_ID: '${RUNTIME_DEFAULT_TENANT_ID:-}' || undefined,
};
EOF

  echo "Runtime configuration injected:"
  cat "$CONFIG_FILE"
fi

# Start nginx
exec nginx -g 'daemon off;'
