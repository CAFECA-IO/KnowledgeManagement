## 參考
- [Nginx docker hub](https://hub.docker.com/_/nginx)
- [Day-12 煉成 Docker-Compose YAML](https://ithelp.ithome.com.tw/articles/10244961)

# By Command
```
docker container run --name myNginx -p 80:80 -d nginx:latest
```

# By Compose

```yaml
version: '3'
services:
    nginx:
      container_name: nginx
      image: nginx
      ports:
        - "80:80"
      volumes:
        - ./nginx/nginx.conf:/etc/nginx/nginx.conf
        - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      restart: always
      networks:
        - ironman-net

networks:
  ironman-net:
    driver: bridge
```

啟動：
```bash
docker-compose up -d
```

使用 `docker-compose down` 結束 ，並且刪除 container:
```bash
docker-compose down
```