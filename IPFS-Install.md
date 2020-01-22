# IPFS 架設

> source: https://www.itread01.com/content/1543400942.html

## 安裝IPFS

```
$ wget https://dist.ipfs.io/go-ipfs/v0.4.22/go-ipfs_v0.4.22_linux-amd64.tar.gz
$ tar zxvf go-ipfs_v0.4.22_linux-amd64.tar.gz
$ cd go-ipfs
$ sudo ./install.sh
$ cd ..
$ rm -rf go-ipfs go-ipfs_v0.4.22_linux-amd64.tar.gz
$ ipfs init
```

### 測試

在 A 機器

```
$ echo 'hello ipfs!' > test.txt
$ ipfs add test.txt
added QmZ5cRqiNsg1ngmzmKrv5STMoyfLaJhhHqXyMWTkre1qte test.txt
 12 B / 12 B [==============================================================================] 100.00%
```

然後需要開著 `ipfs daemon` 才會連接上 ipfs 網路

```
$ ipfs daemon
Initializing daemon...
go-ipfs version: 0.4.22-
Repo version: 7
System version: amd64/linux
Golang version: go1.12.7
Swarm listening on /ip4/10.0.2.15/tcp/4001
Swarm listening on /ip4/127.0.0.1/tcp/4001
Swarm listening on /ip4/192.168.50.5/tcp/4001
Swarm listening on /ip6/::1/tcp/4001
Swarm listening on /p2p-circuit
Swarm announcing /ip4/10.0.2.15/tcp/4001
Swarm announcing /ip4/127.0.0.1/tcp/4001
Swarm announcing /ip4/192.168.50.5/tcp/4001
Swarm announcing /ip6/::1/tcp/4001
API server listening on /ip4/127.0.0.1/tcp/5001
WebUI: http://127.0.0.1:5001/webui
Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/8080
Daemon is ready
```

然後登入 B 機器，依樣也需要先行安裝 ipfs 並開著 `ipfs daemon` 連接上 ipfs 網路

```
$ ipfs cat QmZ5cRqiNsg1ngmzmKrv5STMoyfLaJhhHqXyMWTkre1qte
hello ipfs!
```

### 建立私有 IPFS 網路

#### 產生金鑰

```
$ sudo apt-get update
$ sudo apt-get install golang-go -y
$ export GOPATH=$HOME/golang
$ go get -u github.com/Kubuxu/go-ipfs-swarm-key-gen/ipfs-swarm-key-gen
$ ~/golang/bin/ipfs-swarm-key-gen > ~/.ipfs/swarm.key
```

#### 將鑰匙放到其他節點上

```
$ sudo scp ~/.ipfs/swarm.key ubuntu@192.168.50.5:~/.ipfs
```

#### 清除預設的公有節點設定

```
$ ipfs bootstrap rm all
```

#### 設定要連結的節點位置

只需要在其中一台設定其他節點的位置即可

```
$ ipfs bootstrap add /ip4/172.16.0.113/tcp/4001/ipfs/QmV7Thb3mjuWa1xDK5UrgtG7SSYFt4PSyvo6CjcnA5gZAg
```

格式為 `/ip4/{節點 ip}/tcp/4001/ipfs/{節點 peer identity}`

節點 peer identity 在一開始 `ipfs init` 時有回傳，或者是使用ㄒ `ipfs config show` 也能找到

#### 檢查節點連接狀態

```
$ ipfs swarm peers
/ip4/192.168.50.4/tcp/4001/ipfs/QmPvL17kKegoLCjnKUr2F1XTbrSSso4cfxyHjfXV6dNUe8
```

如果下完 `ipfs swarm peers` 指令沒任何東西，就是沒有連上的意思

##### 測試

然後就跟一般在操作 ipfs 一樣，可以重複上面的測試

## IPFS private docker script

`start.sh`

```sh
#!/bin/bash

function bootIpfsPeer {
    index=$1
    hostName=ipfs_host_${index}

    ipfs_staging=/tmp/ipfs_staging_${index}
    rm -rf $ipfs_staging
    mkdir -p $ipfs_staging

    ipfs_data=/tmp/ipfs_data_${index}
    rm -rf $ipfs_data
    mkdir -p $ipfs_data

    cp ./data/swarm.key $ipfs_data

    echo "Creating ${hostName} ..."
    docker run -d --name ${hostName} \
        -v ${ipfs_staging}:/export \
        -v ${ipfs_data}:/data/ipfs \
        -p $((4001 + index)):4001 \
        -p $((5001 + index)):5001 \
        -p 127.0.0.1:$((8080 + index)):8080 \
        ipfs/go-ipfs:latest

    echo "Remove bootstrap for ${hostName} ..."
    docker exec ${hostName} ipfs bootstrap rm --all
}

function setupIpfsNetwork {
    for (( i=0; i<$1; i++ ))
    do
        bootIpfsPeer ${i}
    done
}

function createSwarmKey {
    rm -rf ./data
    mkdir -p ./data
    go get github.com/Kubuxu/go-ipfs-swarm-key-gen/ipfs-swarm-key-gen
    $GOPATH/bin/ipfs-swarm-key-gen > ./data/swarm.key
}

function rmIpfsHosts {
    dockerContainers=$(docker ps -a | awk '$2~/ipfs/ {print $1}')
    if [ "$dockerContainers" != "" ]; then
       echo "Deleting existing docker containers ..."
       docker rm -f $dockerContainers
    fi
}

function showResult {
    docker ps -a
}

function main {
    rmIpfsHosts
    createSwarmKey
    setupIpfsNetwork $1

    showResult
}

if [ "$#" -ne 1 ]; then
    echo "ERROR: Peers number must be set for private ipfs network"
    echo "usage: start.sh \${peerNumber}"
    echo "For example: Run this command"
    echo "                 ./start.sh 3"
    echo "             A private ipfs network with 3 peers will be setup locally"
    exit 1
else
    main $1
fi
```

```
./start.sh 4
```

```
CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS              PORTS                                                                                NAMES
59471fe5aa5b        ipfs/go-ipfs:latest   "/sbin/tini -- /usr/…"   6 hours ago         Up 6 hours          8081/tcp, 0.0.0.0:4004->4001/tcp, 0.0.0.0:5004->5001/tcp, 127.0.0.1:8083->8080/tcp   ipfs_host_3
87ee4e84abd1        ipfs/go-ipfs:latest   "/sbin/tini -- /usr/…"   6 hours ago         Up 6 hours          8081/tcp, 0.0.0.0:4003->4001/tcp, 0.0.0.0:5003->5001/tcp, 127.0.0.1:8082->8080/tcp   ipfs_host_2
e3aa84921b8e        ipfs/go-ipfs:latest   "/sbin/tini -- /usr/…"   6 hours ago         Up 6 hours          8081/tcp, 0.0.0.0:4002->4001/tcp, 0.0.0.0:5002->5001/tcp, 127.0.0.1:8081->8080/tcp   ipfs_host_1
c668ba44097d        ipfs/go-ipfs:latest   "/sbin/tini -- /usr/…"   6 hours ago         Up 5 hours          0.0.0.0:4001->4001/tcp, 0.0.0.0:5001->5001/tcp, 127.0.0.1:8080->8080/tcp, 8081/tcp   ipfs_host_0
```

## API 連不上

進入其中一台的加上 API CORS headers

```
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://127.0.0.1:5001"]'
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
```
