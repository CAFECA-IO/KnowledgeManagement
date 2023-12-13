# Deploy iSunCoin
last updated on 2023-12-13

## Environment
- Ubuntu 22.04

## Step
- [Setup User](/linux/create_sudoer_user_in_ubuntu.md)
- [Setup SWAP](/linux/setup_swap.md)
- Setup Compilation Environment
- Building From Source Code
- Creating Genesis
- Initial iSunCoin
- Starting iSunCoin in Screen

### Setup Compilation Environment
- Git
- [Install Golang](/linux/install_golang.md)

### Building From Source Code
```shell
cd /workspace
git clone -b v1.11.6 https://github.com/ethereum/go-ethereum
cd go-ethereum
make geth
```

### Creating Genesis
```shell
mkdir ~/isuncoin
cd ~/isuncoin
vi genesis.json
```
```json
{
  "config": {
        "chainId": 8017,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },
  "alloc"      : {},
  "coinbase"   : "0x0000000000000000000000000000000000000000",
  "difficulty" : "0x20000",
  "extraData"  : "",
  "gasLimit"   : "0xffffff",
  "nonce"      : "0x0000000000001f51",
  "mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp"  : "0x00"
}
```

### Initial iSunCoin
### Starting iSunCoin in Screen
