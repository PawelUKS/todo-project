# Verwende das offizielle PHP-Image mit Apache
FROM php:8.2-apache

# Installiere PHP-Erweiterungen und Composer
RUN apt-get update && apt-get install -y libzip-dev unzip && docker-php-ext-install zip pdo pdo_mysql

# Setze das Arbeitsverzeichnis auf symfony-backend/
WORKDIR /var/www/html/symfony-backend

# Kopiere nur composer.json und composer.lock, um den Cache zu optimieren
COPY symfony-backend/composer.json symfony-backend/composer.lock ./

# Installiere Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installiere Symfony-Abhängigkeiten
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Danach alle restlichen Dateien kopieren
COPY symfony-backend/ ./

# Setze Dateiberechtigungen
RUN chown -R www-data:www-data /var/www/html/symfony-backend && chmod -R 775 /var/www/html/symfony-backend/var

# Setze Apache DocumentRoot auf Symfony "public/"
RUN sed -i 's|/var/www/html|/var/www/html/symfony-backend/public|g' /etc/apache2/sites-available/000-default.conf

# Symfony läuft auf Port 80
EXPOSE 80

# Starte Apache
CMD ["apache2-foreground"]
