#!/bin/bash
set -e

echo "Starting StocKontrol - Running database setup..."

# Generate app key if needed
php artisan key:generate --force 2>/dev/null || true

# Run migrations
echo "Running database migrations..."
php artisan migrate --force 2>&1 || echo "⚠ Migration warning - continuing..."

# Seed database
echo "Seeding database..."
php artisan db:seed 2>&1 || echo "⚠ Seed warning - continuing..."

# Cache config for production
if [ "$APP_ENV" = "production" ]; then
    echo "Caching configuration for production..."
    php artisan config:cache 2>/dev/null || true
fi

echo ""
echo "✓ Database setup completed!"
echo "✓ StocKontrol is ready to serve requests."

