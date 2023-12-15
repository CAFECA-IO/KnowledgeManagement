# Deploy iSunCoin
last updated on 2023-12-13

## Environment
- Ubuntu 22.04

## Step
- [Setup User](/linux/create_sudoer_user_in_ubuntu.md)
- [Setup SWAP](/linux/setup_swap.md)
- Setup Compilation Environment
- Building From Source Code
- Setup Environment
- Creating Genesis
- Initial iSunCoin
- Starting iSunCoin in Screen
- Starting ecProxy
- Final Check

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

### Setup Environment
```shell
sudo mv go-ethereum/ /usr/local
sudo ln -s /usr/local/go-ethereum/build/bin/geth /usr/local/bin
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
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0
  },
  "alloc"      : {},
  "coinbase"   : "0x0000000000000000000000000000000000000000",
  "difficulty" : "0x20000",
  "extraData"  : "",
  "gasLimit"   : "0xffffff",
  "nonce"      : "0x0000000000001f51",
  "mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp"  : "0x65692200"
}
```

### Initial iSunCoin
```shell
geth init ~/isuncoin/genesis.json
geth account new
vi ~/isuncoin/pw.txt
```

### Starting iSunCoin in Screen
- Not Working, to be fixed
```shell
geth \
--networkid 8017 \
--mine --miner.etherbase 0x048Adee1B0E93b30f9F7b71f18b963cA9bA5dE3b \
--http --http.api eth,net,web3 \
```

- Workaround
```shell
geth --http --http.api eth,net,web3 console
> admin.nodeInfo.enode
> miner.setEtherbase("0x048Adee1B0E93b30f9F7b71f18b963cA9bA5dE3b")
> miner.start(1)
> eth.getBalance("0x048Adee1B0E93b30f9F7b71f18b963cA9bA5dE3b")
```

### Starting ecProxy
```shell
bash <(curl https://raw.githubusercontent.com/Luphia/ecProxy/master/shell/install-lite.sh -kL)
```

### Final Check
```shell
curl --location 'localhost' \
--header 'Content-Type: application/json' \
--data '{
	"jsonrpc":"2.0",
	"method":"eth_blockNumber",
	"params":[],
	"id":83
}'
```
