# Verwende das offizielle PHP-Image mit Apache
FROM php:8.2-apache

# Installiere PHP-Erweiterungen und Composer
RUN apt-get update && apt-get install -y libzip-dev unzip && docker-php-ext-install zip pdo pdo_mysql

# Setze das Arbeitsverzeichnis auf den Symfony-Ordner
WORKDIR /var/www/html

# Kopiere NUR composer.json und composer.lock zuerst (für Caching)
COPY composer.json composer.lock ./symfony-backend/

# Installiere Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader --working-dir=symfony-backend

# Danach alle restlichen Dateien kopieren
COPY . ./ 

# Setze Dateiberechtigungen
RUN chown -R www-data:www-data /var/www/html/symfony-backend && chmod -R 775 /var/www/html/symfony-backend/var

# Symfony läuft auf Port 80
EXPOSE 80

# Starte Apache
CMD ["apache2-foreground"]
