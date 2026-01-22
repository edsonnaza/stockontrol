#!/bin/bash
set -e

echo "Running database migrations and seeding..."

# Wait for database to be ready
echo "Waiting for database connection..."
for i in {1..30}; do
    if php artisan tinker --execute="DB::connection()->getPdo()" 2>/dev/null; then
        echo "✓ Database is ready!"
        break
    fi
    echo "Attempt $i/30 - Database not ready yet..."
    sleep 2
done

# Run migrations
php artisan migrate --force 2>&1

# Seed database
php artisan db:seed --force 2>&1

echo "✓ Done!"

