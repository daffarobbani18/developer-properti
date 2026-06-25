#!/bin/bash
set -e

cd /var/www/developer-properti/backend

echo "Installing backend dependencies..."
npm install

echo "Creating .env..."
cat << 'EOF' > .env
DATABASE_URL="postgresql://simdp_user:password123@localhost:5432/simdp?schema=public"
JWT_SECRET="supersecretkey123"
PORT=4000
EOF

echo "Generating Prisma Client and Pushing Schema..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "Seeding database..."
npx tsx prisma/seed.ts

echo "Building backend..."
npm run build

echo "Starting backend with PM2..."
pm2 start dist/server.js --name "simdp-backend"
pm2 save
