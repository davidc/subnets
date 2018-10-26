FROM php:5.6-apache

COPY index.php gennum.php subnets.html /var/www/html/
COPY img/* /var/www/html/img/
