#!/bin/bash
set -e

echo "Starting StocKontrol application..."

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env from .env.example"
    cp .env.example .env
fi

# Configure database environment variables from Railway
echo "Configuring database connection..."

# Railway provides these variables
# Use RAILWAY_PRIVATE_DOMAIN for internal communication (inside Railway)
DB_HOST="${MYSQLHOST:-${RAILWAY_PRIVATE_DOMAIN}}"
DB_PORT="${MYSQLPORT:-3306}"
DB_NAME="${MYSQLDATABASE:-railway}"
DB_USER="${MYSQLUSER:-root}"
DB_PASS="${MYSQLPASSWORD:-}"

echo "Database settings:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"

# Update .env with correct database configuration
sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|" .env
sed -i "s|DB_PORT=.*|DB_PORT=$DB_PORT|" .env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_NAME|" .env
sed -i "s|DB_USERNAME=.*|DB_USERNAME=$DB_USER|" .env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=$DB_PASS|" .env

# Wait for MySQL to be ready
echo "Waiting for MySQL connection..."
max_attempts=60
attempt=1
while [ $attempt -le $max_attempts ]; do
    if nc -z $DB_HOST $DB_PORT 2>/dev/null; then
        echo "MySQL is ready!"
        break
    fi
    echo "Attempt $attempt/$max_attempts - MySQL not ready yet... ($DB_HOST:$DB_PORT)"
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "ERROR: Could not connect to MySQL after $max_attempts attempts"
    exit 1
fi

# Set APP_URL and ASSET_URL if Railway public domain is available
if [ ! -z "$RAILWAY_PUBLIC_DOMAIN" ]; then
    export APP_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
    export ASSET_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
    
    # Update .env file with HTTPS URLs
    sed -i "s|^APP_URL=.*|APP_URL=https://${RAILWAY_PUBLIC_DOMAIN}|" .env
    sed -i "s|^ASSET_URL=.*|ASSET_URL=https://${RAILWAY_PUBLIC_DOMAIN}|" .env
    
    echo "APP_URL set to: $APP_URL"
fi

# Generate app key if needed
php artisan key:generate --force 2>/dev/null || true

# Run migrations
echo "Running database migrations..."
php artisan migrate --force 2>&1 || echo "Migration warning - continuing..."

# Clear cache AFTER migrations (so config is loaded first)
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true

# Seed database
echo "Seeding database..."
php artisan db:seed 2>&1 | tee seed.log || echo "Seed warning - continuing...
Check seed.log for details"

# Cache config for production
if [ "$APP_ENV" = "production" ]; then
    php artisan config:cache 2>/dev/null || true
fi

# Start the application
echo "Starting application on port ${PORT:-8000}..."
php -S 0.0.0.0:${PORT:-8000} -t public/ -d display_errors=1

