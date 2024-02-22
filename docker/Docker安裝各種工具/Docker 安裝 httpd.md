## 參考
- [httpd docker hub](https://hub.docker.com/_/httpd)
- [Setup a Basic Website with Apache HTTPD in Docker](https://noted.lol/apache-httpd-in-docker/)

# By Command
```
docker container run --name myApacheHttpd -p 8080:8080 -d httpd:latest
```

# By Compose
```yaml
version: '3.3'
services:
    httpd:
        container_name: my-apache-app
        ports:
            - '8080:80'
        volumes:
            - '/apache:/usr/local/apache2/htdocs/'
        image: 'httpd:latest'
        restart: always
    filebrowser:
        container_name: filebrowser
        ports:
            - 8081:8080
        volumes:
            - /apache:/data
            - /docker/filebrowser:/config
        environment:
            - FB_BASEURL=/f
        image: hurlenko/filebrowser
        restart: always
```
啟動：
```bash
docker-compose up -d
```

使用 `docker-compose down` 結束 ，並且刪除 container:
```bash
docker-compose down
```