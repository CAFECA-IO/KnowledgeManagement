# Deploy PostgreSQL
last updated on 2023-12-29

## Environment
- Ubuntu 22.04

## Step
- [Setup User](/linux/create_sudoer_user_in_ubuntu.md)
- [Setup SWAP](/linux/setup_swap.md)
- Setup Compilation Environment
- Install PostgreSQL
- Generate User
- Generate Database
- Grant Privileges to User
- Allow Remote Connection
- Final Check

### Setup Compilation Environment

### Install PostgreSQL
```shell
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### Generate User
```shell
sudo su - postgres -c "createuser aha"
```
- Update User Password (Optional)
```shell
sudo -u postgres psql
> ALTER USER aha WITH PASSWORD 'sayaha';
```

### Generate Database
```shell
sudo su - postgres -c "createdb ahadb"
```

### Grant Privileges to User
```shell
sudo -u postgres psql
> grant all privileges on database ahadb to aha;
```

### Allow Remote Connection
- listen to IP
```shell
sudo vi /etc/postgresql/14/main/postgresql.conf
```
```conf
listen_addresses = '*'                  # what IP address(es) to listen on;
```
- allow remote access IP
```shell
sudo vi /etc/postgresql/14/main/pg_hba.conf
```
```conf
host    aha           ahadb           0.0.0.0/0       scram-sha-256
```
- restart database
```shell
sudo /etc/init.d/postgresql restart
```

### Final Check
```shell
sudo -u postgres psql -c "SELECT version();"
```
| version |
| --- |
| PostgreSQL 14.10 (Ubuntu 14.10-0ubuntu0.22.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0, 64-bit |

### Use PostgreSQL Docker
1. List all docker
```shell
docker ps -a
```
```
CONTAINER ID   IMAGE                     COMMAND                   CREATED        STATUS                      PORTS                                                                      NAMES
e0a31d62b37d   nginx:1.26.2              "/docker-entrypoint.…"   3 weeks ago    Up 3 weeks                  0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   nginx
d3341c36d3c8   mcuadros/ofelia:latest    "/usr/bin/ofelia dae…"   3 weeks ago    Up 3 weeks                                                                                             ofelia
cb0c1c77f97c   node:20                   "docker-entrypoint.s…"   3 weeks ago    Up 3 weeks (healthy)        5567/tcp                                                                   faith
01f1cdb13a73   node:20                   "docker-entrypoint.s…"   3 weeks ago    Up 3 weeks (healthy)        5566/tcp                                                                   isunfa
67db9ba66d1b   node:20                   "docker-entrypoint.s…"   3 weeks ago    Up 3 weeks (healthy)        5568/tcp                                                                   aich
78d2b331b55d   postgres:16               "docker-entrypoint.s…"   3 weeks ago    Up 3 weeks                  0.0.0.0:5432->5432/tcp, :::5432->5432/tcp                                  postgres
```

2. Enter docker
```shell
# Container NAME = postgres for example
docker exec -it postgres bash
```

3. Enter postgresql
```shell
# user = dba, database = basic for example
psql -U dba -d basic
```

4. Create User
```shell
CREATE USER new_user WITH PASSWORD 'secret_password';
```

5. Create Database
```shell
CREATE DATABASE new_database;
```

6. Assign new_database owner to new_user
```
ALTER DATABASE new_database OWNER TO new_user;
```

7. Try with [TablePlus](https://tableplus.com/)
