# dcrm-walletService

## Prerequisites
1. VPS server with 1 CPU and 2G mem
2. Static public IP
3. Golang ^1.12

### Clone

```sh
git clone https://github.com/fsn-dev/dcrm-walletService.git
```

### Build

```sh
cd dcrm-walletService && make
```

### Run

First generate the node key:

```sh
cd bin/cmd
./gdcrm --genkey node1.key
```

then run the dcrm node 7x24 in the background:

```sh
nohup ./gdcrm --nodekey node1.key &
```

### json rpc

default port: 4449

example `dcrm_getEnode()`
```sh
curl --location --request POST 'http://52.78.219.113:4449' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc":"2.0",
    "method":"dcrm_getEnode",
    "params":[],
    "id":67
}'

# return
# {
#     "jsonrpc": "2.0",
#     "id": 67,
#     "result": {
#         "Data": {
#             "Enode": "enode://7d55f2cf654d5d8ab52158ac3513c132160969c5608c8cc5e4d9dae889d1d10cfb6ad963727cb36b93b8f18718f8d9da6aaad5bb5df32eeae62b2a4165c37b27@172.31.29.222:4441",
#             "Status": "OnLine"
#         },
#         "Error": "",
#         "Status": "Success",
#         "Tip": ""
#     }
# }
```

see more [json rpc api](https://github.com/fsn-dev/dcrm-walletService/wiki/walletService-RPC-API)

## reference
- https://github.com/fsn-dev/dcrm-walletService
- https://github.com/fsn-dev/dcrm-walletService/wiki/walletService-RPC-API
- https://github.com/anyswap/CrossChain-Bridge

