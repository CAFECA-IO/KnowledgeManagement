## 參考
- [MultiContainer => Start MySQL](https://docs.docker.com/get-started/07_multi_container/#start-mysql)
- [mysql docker hub](https://hub.docker.com/_/mysql)
- [How to Create a MySql Instance with Docker Compose](https://medium.com/@chrischuck35/how-to-create-a-mysql-instance-with-docker-compose-1598f3cc1bee)


# MySQL
## By Command line

記得每個 `enviroment veriable`前面都會需要`-e`

```
docker container run -p 3306:3306 --name myMySQL -e MYSQL_ROOT_PASSWORD=password -e MYSQL_USER=user -e MYSQL_PASSWORD=password -d mysql:latest
```
## By Docker Compose

使用以下 `docker-compose.yml`

```yaml
version: '3.3'
services:
  db:
    image: mysql:latest
    restart: always
    environment:
      MYSQL_DATABASE: 'db'
      # So you don't have to use root, but you can if you like
      MYSQL_USER: 'user'
      # You can use whatever password you like
      MYSQL_PASSWORD: 'password'
      # Password for root access
      MYSQL_ROOT_PASSWORD: 'password'
    ports:
      # <Port exposed> : <MySQL Port running inside container>
      - '3306:3306'
    expose:
      # Opens port 3306 on the container
      - '3306'
      # Where our data will be persisted
    volumes:
      - my-db:/var/lib/mysql
# Names our volume
volumes:
  my-db:
```

啟動：
```bash
docker-compose up -d
```

使用 `docker-compose down` 結束 ，並且刪除 container:
```bash
docker-compose down
```


# mariaDB