#!/bin/bash
set -e

sudo apt-get install -y p7zip-full || true

echo "Setting up Web Admin..."
cd /var/www/developer-properti/frontend/web-admin
rm -rf standalone_app
mkdir standalone_app
mv admin_standalone.zip standalone_app/ || true
cd standalone_app
7z x admin_standalone.zip
rm admin_standalone.zip

echo "Starting admin..."
pm2 delete simdp-admin || true
PORT=3001 pm2 start server.js --name "simdp-admin"

echo "Setting up Web Public Portal..."
cd /var/www/developer-properti/frontend/web-public-portal
rm -rf standalone_app
mkdir standalone_app
mv public_standalone.zip standalone_app/ || true
cd standalone_app
7z x public_standalone.zip
rm public_standalone.zip

echo "Starting public portal..."
pm2 delete simdp-public || true
PORT=3000 pm2 start server.js --name "simdp-public"

pm2 save
