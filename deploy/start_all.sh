#!/bin/bash
set -e

pm2 delete all || true

echo "Starting backend..."
cd /var/www/developer-properti/backend
PORT=4000 pm2 start dist/server.js --name "simdp-backend"

echo "Starting admin..."
cd /var/www/developer-properti/frontend/web-admin/standalone_app
PORT=3001 pm2 start server.js --name "simdp-admin"

echo "Starting public portal..."
cd /var/www/developer-properti/frontend/web-public-portal/standalone_app
PORT=3000 pm2 start server.js --name "simdp-public"

pm2 save
