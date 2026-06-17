#!/bin/bash
set -e

echo "Setting up PostgreSQL..."
sudo -u postgres psql -c "CREATE USER simdp_user WITH PASSWORD 'password123';" || true
sudo -u postgres psql -c "CREATE DATABASE simdp OWNER simdp_user;" || true
sudo -u postgres psql -c "ALTER USER simdp_user CREATEDB;" || true

echo "Installing PM2..."
sudo npm install -g pm2

echo "Cloning repository..."
sudo mkdir -p /var/www
sudo chown -R testing:testing /var/www
cd /var/www
if [ -d "developer-properti" ]; then
    echo "Repository already cloned, pulling latest..."
    cd developer-properti
    git pull
else
    git clone https://github.com/daffarobbani18/developer-properti.git
fi
