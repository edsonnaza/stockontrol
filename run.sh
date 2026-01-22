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

# Iniciar la app
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
