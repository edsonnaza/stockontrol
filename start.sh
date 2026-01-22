#!/bin/bash
set -e

# Copy .env.example if .env doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Set environment variables from Railway
if [ ! -z "$MYSQL_HOST" ]; then
    sed -i "s/DB_HOST=.*/DB_HOST=$MYSQL_HOST/" .env
    sed -i "s/DB_PORT=.*/DB_PORT=${MYSQL_PORT:-3306}/" .env
    sed -i "s/DB_DATABASE=.*/DB_DATABASE=$MYSQL_DATABASE/" .env
    sed -i "s/DB_USERNAME=.*/DB_USERNAME=$MYSQL_USER/" .env
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$MYSQL_ROOT_PASSWORD/" .env
fi

# Set other production variables
sed -i "s/APP_ENV=.*/APP_ENV=production/" .env
sed -i "s/APP_DEBUG=.*/APP_DEBUG=false/" .env

# Generate app key if not set
if ! grep -q "^APP_KEY=base64:" .env; then
    php artisan key:generate --force
fi

# Run migrations
php artisan migrate --force

# Start the application
php -S 0.0.0.0:${PORT:-8000} -t public/
