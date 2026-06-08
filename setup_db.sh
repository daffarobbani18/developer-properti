#!/bin/bash
sudo -u postgres psql -c "CREATE USER simdp_user WITH PASSWORD 'SimdpPassword123!';"
sudo -u postgres psql -c "CREATE DATABASE simdp_db OWNER simdp_user;"
