#!/bin/bash
set -e

# Si estamos en Railway, construir la URL desde el dominio público
if [ ! -z "$RAILWAY_PUBLIC_DOMAIN" ]; then
    export APP_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
    export ASSET_URL="https://${RAILWAY_PUBLIC_DOMAIN}"
fi

# Iniciar la app con artisan serve (compatible con Nixpacks)
php artisan serve --host=0.0.0.0 --port=$PORT
