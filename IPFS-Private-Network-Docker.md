# IPFS Private Network Docker

> source: https://www.itread01.com/content/1543400942.html

## IPFS docker

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
