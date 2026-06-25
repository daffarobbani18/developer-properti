#!/bin/bash
set -e

echo "Checking current swap..."
swapon --show

echo "Allocating 2GB Swap file..."
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

echo "Making swap permanent..."
if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "Swap configuration applied:"
swapon --show
