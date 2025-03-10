# Verwende das offizielle PHP-Image mit Apache
FROM php:8.2-apache

# Installiere benötigte Systempakete
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl \
    && docker-php-ext-install zip pdo pdo_mysql

# Installiere Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Setze das Arbeitsverzeichnis auf den Symfony-Ordner
WORKDIR /var/www/html/symfony-backend

# Kopiere nur composer.json & composer.lock, um Cache zu optimieren
COPY composer.json composer.lock ./

# Installiere Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installiere Abhängigkeiten (als www-data, um Root-Probleme zu vermeiden)
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs --no-scripts

# Kopiere alle restlichen Dateien
COPY symfony-backend/ ./

# 🔥 **WICHTIG: Erstelle fehlende Verzeichnisse manuell**
RUN mkdir -p var/cache var/log

# Setze Dateiberechtigungen
RUN chown -R www-data:www-data /var/www/html/symfony-backend && chmod -R 775 /var/www/html/symfony-backend/var

# Symfony läuft auf Port 80
EXPOSE 80

# Starte Apache
CMD ["apache2-foreground"]
