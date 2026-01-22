FROM php:8.2-fpm

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    netcat-openbsd \
    nodejs \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Install PHP dependencies with platform override
RUN composer install --optimize-autoloader --no-scripts --no-interaction --ignore-platform-req=php

# Build assets
RUN npm ci && npm run build

# Run migrations
CMD ["./start.sh"]
