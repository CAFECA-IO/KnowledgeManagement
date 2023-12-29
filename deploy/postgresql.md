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
