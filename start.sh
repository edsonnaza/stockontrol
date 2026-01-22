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
# RAILWAY_PRIVATE_DOMAIN for internal communication
# RAILWAY_TCP_PROXY_DOMAIN as fallback
DB_HOST="${MYSQLHOST:-${RAILWAY_PRIVATE_DOMAIN}}"
DB_PORT="${MYSQLPORT:-3306}"
DB_NAME="${MYSQLDATABASE:-railway}"
DB_USER="${MYSQLUSER:-root}"
DB_PASS="${MYSQLPASSWORD:-}"

# If primary host is not set, try TCP proxy
if [ -z "$DB_HOST" ] && [ ! -z "$RAILWAY_TCP_PROXY_DOMAIN" ]; then
    DB_HOST="$RAILWAY_TCP_PROXY_DOMAIN"
    DB_PORT="${RAILWAY_TCP_PROXY_PORT:-3306}"
    echo "Using Railway TCP Proxy for database connection"
fi

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
max_attempts=90
attempt=1

# Try using mysqladmin first, then fallback to PHP
while [ $attempt -le $max_attempts ]; do
    # Try mysqladmin ping (most reliable)
    if command -v mysqladmin &> /dev/null; then
        if mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" --silent 2>/dev/null; then
            echo "✓ MySQL is ready (mysqladmin)!"
            break
        fi
    fi
    
    # Fallback: try direct PHP connection
    if php -r "
    set_error_handler(function() {});
    try {
        \$mysqli = new mysqli('$DB_HOST', '$DB_USER', '$DB_PASS', '$DB_NAME', $DB_PORT);
        if (!\$mysqli->connect_error) {
            \$mysqli->close();
            exit(0);
        }
    } catch (Throwable \$e) {
        exit(1);
    }
    exit(1);
    " 2>/dev/null; then
        echo "✓ MySQL is ready (PHP connection)!"
        break
    fi
    
    # Calculate remaining time
    remaining=$((($max_attempts - $attempt) * 2))
    echo "Attempt $attempt/$max_attempts - Waiting... ($DB_HOST:$DB_PORT) [~${remaining}s remaining]"
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "✗ ERROR: Could not connect to MySQL after $max_attempts attempts ($((max_attempts * 2)) seconds)"
    echo ""
    echo "Database configuration:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""
    echo "Attempting to show detailed error..."
    php -r "
    try {
        \$mysqli = new mysqli('$DB_HOST', '$DB_USER', '$DB_PASS', '$DB_NAME', $DB_PORT);
        if (\$mysqli->connect_error) {
            echo 'MySQL Error: ' . \$mysqli->connect_error;
        } else {
            echo 'Connected OK but not detected earlier (timing issue)';
            \$mysqli->close();
        }
    } catch (Throwable \$e) {
        echo 'Exception: ' . \$e->getMessage();
    }
    "
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

