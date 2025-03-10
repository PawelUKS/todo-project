# Verwende ein offizielles PHP-Image mit Apache
FROM php:8.2-apache

# Installiere PHP-Erweiterungen
RUN apt-get update && apt-get install -y libzip-dev unzip && docker-php-ext-install zip pdo pdo_mysql

# Setze das Arbeitsverzeichnis
WORKDIR /var/www/html

# Kopiere das Projekt in den Container
COPY . .

# Installiere Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Installiere Abhängigkeiten
RUN composer install --no-dev --optimize-autoloader

# Setze Dateiberechtigungen
RUN chown -R www-data:www-data /var/www/html && chmod -R 775 /var/www/html/var

# Symfony nutzt Port 80
EXPOSE 80

# Starte Apache
CMD ["apache2-foreground"]
