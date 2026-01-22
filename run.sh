#!/bin/bash
set -e

# Si estamos en Railway, construir la URL desde el dominio público
if [ ! -z "$RAILWAY_PUBLIC_DOMAIN" ]; then
    export APP_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
    export ASSET_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
fi

# Limpiar y cachear configuración
php artisan config:clear
php artisan config:cache

# Ejecutar migraciones y seeders en cada reinicio
php artisan migrate --force
php artisan db:seed --force

# Iniciar PHP-FPM en background
php-fpm -D

# Iniciar Nginx en foreground
nginx -c /var/www/html/nginx.conf -g 'daemon off;'
