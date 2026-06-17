#!/bin/bash
set -e

# Disable type checking and linting during build to save memory
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=512"

echo "Setting up Web Admin..."
cd /var/www/developer-properti/frontend/web-admin
npm install

echo "Creating .env.local for Web Admin..."
cat << 'EOF' > .env.local
NEXT_PUBLIC_API_URL="http://52.184.85.27:4000/api"
EOF

echo "Building Web Admin..."
npx next build

echo "Starting Web Admin with PM2..."
pm2 delete simdp-admin || true
pm2 start npm --name "simdp-admin" -- run start -- -p 3001

echo "Setting up Web Public Portal..."
cd /var/www/developer-properti/frontend/web-public-portal
npm install

echo "Creating .env.local for Web Public Portal..."
cat << 'EOF' > .env.local
NEXT_PUBLIC_API_URL="http://52.184.85.27:4000/api"
EOF

echo "Building Web Public Portal..."
npx next build

echo "Starting Web Public Portal with PM2..."
pm2 delete simdp-public || true
pm2 start npm --name "simdp-public" -- run start -- -p 3000

pm2 save
