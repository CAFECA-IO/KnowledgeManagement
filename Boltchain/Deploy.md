# Boltchain Deployment
Boltchain is an Ethereum like Blockchain

## Hardward requirement
AWS EC2 t2.medium
```
2 vCPU
4 GiB Memory
200 GiB SSD
5K Disk IOPs
```

## Network Port
```
TCP 80
TCP 443
TCP 32668

UDP 32668
```

## config.toml
```toml
[Eth]
SyncMode = "full" #[snap, full]
TrieCleanCacheRejournal= 300000000000

[Eth.Miner]
GasFloor = 8000000
GasCeil = 8000000
GasPrice = 0
Recommit = 3000000000
Noverify = false

[Eth.Ethash]
CacheDir = "ethash"
CachesInMem = 2
CachesOnDisk = 3
CachesLockMmap = false
DatasetDir = "/blockchain/bolt/data/.ethash"
DatasetsInMem = 1
DatasetsOnDisk = 2
DatasetsLockMmap = false
PowMode = 0

[Eth.TxPool]
Locals = []
NoLocals = false
Journal = "transactions.rlp"
Rejournal = 3600000000000
PriceLimit = 1
PriceBump = 10
AccountSlots = 16
GlobalSlots = 4096
AccountQueue = 64
GlobalQueue = 1024
Lifetime = 10800000000000

[Node]
DataDir = "/blockchain/bolt/data"
InsecureUnlockAllowed = true
NoUSB = true
IPCPath = "geth.ipc"
HTTPHost = "0.0.0.0"
HTTPPort = 8545
HTTPCors = ["*"]
HTTPVirtualHosts = ["*"]
HTTPModules = ['eth', 'net', 'web3']

WSHost = "0.0.0.0"
WSPort = 8546
WSModules = ['eth', 'net', 'web3']

GraphQLVirtualHosts = ["localhost"]


[Node.P2P]
MaxPeers = 50
NoDiscovery = false

ListenAddr = ":32668"
EnableMsgEvents = false

[Node.HTTPTimeouts]
ReadTimeout = 30000000000
WriteTimeout = 30000000000
IdleTimeout = 120000000000
```

## System Config
```
[Unit]
Description=boltchain service

[Service]
Type=simple
ExecStart=/bin/sh /blockchain/bolt/run.sh

Restart=on-failure
RestartSec=5s

LimitNOFILE=65536

[Install]
```

## Start
run.sh
```shell
#!/usr/bin/env bash
/blockchain/bolt/geth-linux-amd64 \
--config /blockchain/bolt/config.toml  \
--logpath /blockchain/bolt/logs \
--verbosity 3  >> /blockchain/bolt/logs/systemd_chain_console.out 2>&1
```
