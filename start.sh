#!/bin/bash
set -e

echo "Starting StocKontrol application..."

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env from .env.example"
    cp .env.example .env
fi

# Wait for MySQL to be ready
echo "Waiting for MySQL connection..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if [ ! -z "$MYSQL_HOST" ]; then
        if nc -z $MYSQL_HOST ${MYSQL_PORT:-3306} 2>/dev/null; then
            echo "MySQL is ready!"
            break
        fi
    fi
    echo "Attempt $attempt/$max_attempts - MySQL not ready yet..."
    sleep 2
    attempt=$((attempt + 1))
done

# Set APP_URL if not already set (Railway will provide RAILWAY_PUBLIC_DOMAIN)
if [ -z "$APP_URL" ] || [ "$APP_URL" = "" ]; then
    if [ ! -z "$RAILWAY_PUBLIC_DOMAIN" ]; then
        export APP_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
        sed -i "" "s|^APP_URL=.*|APP_URL=https://${RAILWAY_PUBLIC_DOMAIN}|" .env
    fi
fi

# Generate app key if needed
php artisan key:generate --force 2>/dev/null || true

# Clear any cached config
php artisan config:clear 2>/dev/null || true

# Run migrations
echo "Running database migrations..."
php artisan migrate --force 2>&1 || echo "Migration warning - continuing..."

# Seed database
echo "Seeding database..."
php artisan db:seed 2>&1 || echo "Seed warning - continuing..."

# Start the application
echo "Starting application on port ${PORT:-8000}..."
php -S 0.0.0.0:${PORT:-8000} -t public/ -d display_errors=1

