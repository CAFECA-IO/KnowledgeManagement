# LEMP Solution
- [Linux](#linux)
- [Nginx](#nginx)
- [MariaDB](#mariadb)
- [PHP](#php)

## Linux
- Ubuntu 20.04 Upddate Library
```shell
sudo apt-get update
```

## Nginx
- Install Nginx
```shell
sudo apt-get install nginx -y
```
- Version Check
```shell
nginx -v
```
```shell
nginx version: nginx/1.18.0 (Ubuntu)
```

## MariaDB
- Install MariaDB
```shell
sudo apt install mariadb-server mariadb-client -y
```
- Setup MariaDB
```shell
sudo mysql_secure_installation <<!

Y
${password}
${password_check}
Y
Y
Y
Y
!
```

## PHP
- Install PHP
```shell
sudo apt install php php-fpm php-common php-mysql php-gd php-cli php-xml php-json php-mbstring -y
```
- Check PHP Version
```shell
php -v
```
```shell
PHP 7.4.3 (cli) (built: Aug 17 2022 13:29:56) ( NTS )
Copyright (c) The PHP Group
Zend Engine v3.4.0, Copyright (c) Zend Technologies
    with Zend OPcache v7.4.3, Copyright (c), by Zend Technologies
```
- Check PHP fpm
```shell
sudo systemctl status php7.4-fpm
```
```shell
● php7.4-fpm.service - The PHP 7.4 FastCGI Process Manager
     Loaded: loaded (/lib/systemd/system/php7.4-fpm.service; enabled; vendor pr>
     Active: active (running) since Tue 2022-11-08 15:12:11 CST; 2min 54s ago
       Docs: man:php-fpm7.4(8)
    Process: 23590 ExecStartPost=/usr/lib/php/php-fpm-socket-helper install /ru>
   Main PID: 23576 (php-fpm7.4)
     Status: "Processes active: 0, idle: 2, Requests: 0, slow: 0, Traffic: 0req>
      Tasks: 3 (limit: 2274)
     Memory: 8.0M
     CGroup: /system.slice/php7.4-fpm.service
             ├─23576 php-fpm: master process (/etc/php/7.4/fpm/php-fpm.conf)
             ├─23588 php-fpm: pool www
             └─23589 php-fpm: pool www

Nov 08 15:12:11 isuntv-0002 systemd[1]: Starting The PHP 7.4 FastCGI Process Ma>
Nov 08 15:12:11 isuntv-0002 systemd[1]: Started The PHP 7.4 FastCGI Process Man>
```
- Setup PHP
```shell
sudo vim /etc/php/7.4/fpm/php.ini
```
```shell
cgi.fix_pathinfo=0
```
- Enable PHP for Nginx
```shell
sudo vim /etc/nginx/sites-available/default
```
```shell
        # Add index.php to the list if you are using PHP
        index index.php index.html index.htm index.nginx-debian.html;
```
```shell
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
        #
        #       # With php-fpm (or other unix sockets):
                fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        #       # With php-cgi (or other tcp sockets):
        #       fastcgi_pass 127.0.0.1:9000;
        }
```
- Restart Nginx and PHP
```shell
sudo systemctl restart php7.4-fpm
sudo systemctl restart nginx 
```
