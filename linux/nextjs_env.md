# Nextjs Env

- Setup Account
- Setup SWAP
- Setup NodeJs

## Setup Account
- [Setup Account](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/linux/create_sudoer_user_in_ubuntu.md)

## Setup SWAP
- [Setup SWAP](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/linux/setup_swap.md)

## Setup Nodejs
```shell
vi install_nodejs.sh
```
```shell
#!/bin/bash

# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# reload shell configuration file
source ~/.bashrc
# download and install Node.js (you may need to restart the terminal)
nvm install 20
# verifies the right Node.js version is in the environment
node -v # should print `v20.14.0`
# verifies the right NPM version is in the environment
npm -v # should print `10.7.0`

### assign 80 & 443 port ###
sudo setcap cap_net_bind_service=+ep $(which node)

### Install PM2
npm install -g pm2
```
```shell
sh install_nodejs.sh
```
