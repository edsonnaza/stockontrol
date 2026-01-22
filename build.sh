#!/bin/bash
set -e

echo "Installing PHP dependencies..."
composer install --optimize-autoloader --no-scripts --no-interaction --ignore-platform-req=php

echo "Generating optimized configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Build complete!"
