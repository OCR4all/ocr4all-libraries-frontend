#!/bin/sh

# Replace API_BASE_URL in the config file
sed -i "s|\${API_BASE_URL}|$API_BASE_URL|g" /app/config.js
sed -i "s|\${LAREX_URL}|$LAREX_URL|g" /app/config.js

# Start Nginx
exec nginx -g 'daemon off;'
