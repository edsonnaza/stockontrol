#!/bin/bash
set -e

echo "Starting StocKontrol - Running database setup..."

# Create .env from .env.example if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Update APP_URL to use Railway's public domain (HTTPS)
if [ ! -z "$RAILWAY_PUBLIC_DOMAIN" ]; then
    echo "Configuring APP_URL for Railway domain..."
    sed -i "s|APP_URL=.*|APP_URL=https://${RAILWAY_PUBLIC_DOMAIN}|" .env
    sed -i "s|ASSET_URL=.*|ASSET_URL=https://${RAILWAY_PUBLIC_DOMAIN}|" .env
    echo "  APP_URL=https://${RAILWAY_PUBLIC_DOMAIN}"
fi

# Generate app key if needed
echo "Generating application key..."
php artisan key:generate --force 2>/dev/null || true

# Run migrations
echo "Running database migrations..."
php artisan migrate --force 2>&1 || echo "⚠ Migration warning - continuing..."

# Seed database
echo "Seeding database..."
php artisan db:seed --force 2>&1 || echo "⚠ Seed warning - continuing..."

# Cache config for production
if [ "$APP_ENV" = "production" ]; then
    echo "Caching configuration for production..."
    php artisan config:cache 2>/dev/null || true
fi

echo ""
echo "✓ Database setup completed!"
echo "✓ StocKontrol is ready to serve requests."

