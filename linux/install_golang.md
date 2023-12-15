# Install Golang
- Install Ubuntu Updates
- Download Go Binary
- Setup Environment
- Renewing Current Shell Sessions
- Final Check
  
## Install Ubuntu Updates
```shell
sudo apt-get -y upgrade
```

## Download Go Binary and Setup
```shell
sudo mkdir /workspace
sudo chown -R ${user} /workspace
cd /workspace
mkdir temp
cd temp
wget https://dl.google.com/go/go1.21.0.linux-amd64.tar.gz
tar -xvf go1.21.0.linux-amd64.tar.gz
sudo mv go /usr/local
sudo ln -s /usr/local/go/bin/go /usr/local/bin
```

## Setup Environment
```shell
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
```

## Renewing Current Shell Sessions
```shell
source ~/.profile
```

## Final Check
```shell
go version
```
