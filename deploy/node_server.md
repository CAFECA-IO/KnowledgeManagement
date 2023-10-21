# Deploy Node Server
last updated on 2023-10-21

## Environment
- Ubuntu 22.04

### Setup SWAP
Create a Swap File
```shell
sudo fallocate -l 4G /swapfile
```
Enabling the Swap File
```shell
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab
```

### Install Libraries
```
sudo apt-get update
sudo apt-get install openssl libtool autoconf automake uuid-dev build-essential gcc g++ software-properties-common unzip make git libcap2-bin -y
```

### Install Node
```
bash <(curl https://raw.githubusercontent.com/Luphia/SIMPLE/master/shell/install-env.sh -kL)
```
