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
git clone https://github.com/CAFECA-IO/isuncoin
cd isuncoin
make isuncoin
```

### Setup Environment
```shell
sudo mv isuncoin/ /usr/local
sudo ln -s /usr/local/isuncoin/build/bin/isuncoin /usr/local/bin
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
geth init --datadir /workspace/chaindata ~/isuncoin/genesis.json
```

### Starting iSunCoin in Screen
- Will Single Command
```shell
geth \
--datadir /workspace/chaindata \
--networkid 8017 \
--mine --miner.threads=1 --miner.etherbase 0x048Adee1B0E93b30f9F7b71f18b963cA9bA5dE3b \
--http --http.api eth,net,web3 \
--http.port 8545 --port 30303 --authrpc.port 8551
```

- Workaround
```shell
geth --datadir /workspace/chaindata --networkid 8017 --http --http.api eth,net,web3 --http.port 8545 --port 30303 --authrpc.port 8551 console
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

### Official Peers
```shell
enode://2004dc269b65e4fd977f506fce9b6db88fa1f026bcc2199bafdb840a5295690eca644547743b22fb0a0da8b28964455bfc3aad15cff01bf4159918674393b74d@190.92.241.227:30303
enode://4838786bd67360db00dde1a3933887e2fc26b265c36034dad8c0b8adfdfd59348d654c8847d98dcc0670304c8227968b5a93ed179095e86cec9347059d79c94a@119.12.165.90:30303
enode://199e1fc79824ee7df1164c30427481ba0f0c42de3b3270860619cada6780ebe34edbe76251bf30326f007c1bc82b774eb7e86f4672ce41b2974823fcc4fccbaa@49.0.255.11:30303

enode://2004dc269b65e4fd977f506fce9b6db88fa1f026bcc2199bafdb840a5295690eca644547743b22fb0a0da8b28964455bfc3aad15cff01bf4159918674393b74d@192.168.0.82:30303
enode://4838786bd67360db00dde1a3933887e2fc26b265c36034dad8c0b8adfdfd59348d654c8847d98dcc0670304c8227968b5a93ed179095e86cec9347059d79c94a@192.168.0.36:30303
enode://199e1fc79824ee7df1164c30427481ba0f0c42de3b3270860619cada6780ebe34edbe76251bf30326f007c1bc82b774eb7e86f4672ce41b2974823fcc4fccbaa@192.168.0.238:30303
```

```shell
admin.addPeer("enode://2004dc269b65e4fd977f506fce9b6db88fa1f026bcc2199bafdb840a5295690eca644547743b22fb0a0da8b28964455bfc3aad15cff01bf4159918674393b74d@190.92.241.227:30303")
admin.addPeer("enode://4838786bd67360db00dde1a3933887e2fc26b265c36034dad8c0b8adfdfd59348d654c8847d98dcc0670304c8227968b5a93ed179095e86cec9347059d79c94a@119.12.165.90:30303")
admin.addPeer("enode://199e1fc79824ee7df1164c30427481ba0f0c42de3b3270860619cada6780ebe34edbe76251bf30326f007c1bc82b774eb7e86f4672ce41b2974823fcc4fccbaa@49.0.255.11:30303")

admin.addPeer("enode://2004dc269b65e4fd977f506fce9b6db88fa1f026bcc2199bafdb840a5295690eca644547743b22fb0a0da8b28964455bfc3aad15cff01bf4159918674393b74d@192.168.0.82:30303")
admin.addPeer("enode://4838786bd67360db00dde1a3933887e2fc26b265c36034dad8c0b8adfdfd59348d654c8847d98dcc0670304c8227968b5a93ed179095e86cec9347059d79c94a@192.168.0.36:30303")
admin.addPeer("enode://199e1fc79824ee7df1164c30427481ba0f0c42de3b3270860619cada6780ebe34edbe76251bf30326f007c1bc82b774eb7e86f4672ce41b2974823fcc4fccbaa@192.168.0.238:30303")
```
