- [如何使用 Docker 安裝 PostgreSQL ?](https://old-oomusou.goodjack.tw/docker/postgres/)
- [Docker Image Postgresql](https://hub.docker.com/_/postgres)
- [# Docker - 第十二章 | 安裝PostgreSQL](https://morosedog.gitlab.io/docker-20190505-docker12/)
- [Postgre Docker YML的各種變數名稱](https://support.ptc.com/help/thingworx/platform/r9.5/zh_TW/index.html#page/ThingWorx/Help/Installation/ThingWorxDockerGuide/thingworx_docker_settings_postgresql.html)

`Docker-compose.yml`
```yml
version: "3"

services:
  postgres:
    image: postgres:latest
    container_name: dockerPostgres
    volumes:
      - ${HOST_DIR}:/var/lib/postgresql/data
    expose:
      - 5432
    ports:
      - ${POSTGRES_PORT}:5432
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

`.env`
```.env
HOST_DIR=~/Documents/docker/dockerSaveVault/Postgres
POSTGRES_PORT=5433
POSTGRES_DB=dockerPostgresDB
POSTGRES_USER=tinymurky
POSTGRES_PASSWORD=passowrd
```

```bash
cd  ~/Documents/docker/dockerFile/postgreSQL
docker-compose up -d
```

如果是用在 next js專案，`.env` 的名稱不同，用以下指令
```yaml
docker-compose --env-file ./.env.local  up -d 
```


使用 `docker-compose down` 結束 PostgreSQL，並且刪除 container:
```bash
docker-compose down
```