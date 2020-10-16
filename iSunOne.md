# iSunOne

## Deploy Database
- install PostgreSQL
```shell
# update library
sudo apt update

# install PostgreSQL
sudo apt install postgresql postgresql-contrib

# check DB status
systemctl status postgresql.service

# Create DB
sudo -u postgres createdb blobvault_staging
```
