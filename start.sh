#!/bin/bash
set -e

echo "Running database migrations and seeding..."

# Run migrations
php artisan migrate --force 2>&1

# Seed database
php artisan db:seed --force 2>&1

echo "✓ Done!"

