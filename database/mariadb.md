# MariaDB
MariaDB is a community-developed, commercially supported fork of the MySQL RDBMS, intended to remain free and open-source software under the GNU General Public License. Development is led by some of the original developers of MySQL, who forked it due to concerns over its acquisition by Oracle Corporation in 2009.

## Environment
- [Deploy MariaDB](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/linux/lemp-solution.md#mariadb)

## Create User with Database
- Access MariaDB
```shell
mysql -u root -p <<!
${password}
!
```
- Create Account
```shell
MariaDB> CREATE USER '${User}'@'host' IDENTIFIED BY 'password';
```
- Check Users
```shell
MariaDB> SELECT User FROM mysql.user;
```
- Create Database
```shell
MariaDB> CREATE DATABASE ${DBName};
```
- Check Databases
```shell
MariaDB> SHOW DATABASES;
```
- Grant Privileges to New User
```shell
MariaDB> GRANT ALL PRIVILEGES ON ${DBName}.* TO '${User}'@'host';
```
- Allow User Access from Every Where
```shell
MariaDB> UPDATE mysql.user SET Host='%' WHERE User='${User}';
MariaDB> FLUSH PRIVILEGES;
```
