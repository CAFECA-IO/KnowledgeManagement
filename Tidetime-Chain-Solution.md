# TideTime Chain Solution
Based on HECO

## Requirement
heco官方推薦

### 最低
- CPU 8core
- Memory 16g
- ssd iops>5k

### 推薦
- CPU 16core
- Memory 32g
- ssd iops>5k

### 其他
- Disk (5 year) 約2.5TB (ETH 每年約488.58GB)
- Network ??
- port: 32668

## DPoS

validator共識

1. 呼叫proposal合約的createProposal，帶入地址。建立proposal後會有這個proposal的id。

2. 現在的活躍validator呼叫proposal合約的voteProposal進行投票，帶入id和true/false，贊成超過半數即可有資格

3. 通過表決的address`自行`呼叫validators合約的createOrEditValidator，填入資訊。

4. 呼叫validators合約的stake進行質押，每次至少32eth

5. 前21名可以在下次的epoch(每200 block, 約10分鐘)成為活躍validator，可呼叫validators合約的getTopValidators查看前21名是否有自己的address。

6. getActiveValidators可以查看現在活躍的validator。
> 成為活躍validator持續不出塊會受到懲罰。

## Genesis

[genesis.json](./file/Tidetime-Chain/genesis.json)

- chainId: 不能是128(heco mainnet), 256(heco testnet)

- timestamp: 鏈啟動時間

- extraData(初始validator): 將`8cc5a1a0802db41db826c2fcb72423744338dcb0`提換成自己的地址，如果有多個地址只需直接接在後面即可。規則: 0x前32 bytes 0(64個0)；每個address 20 bytes；65 bytes 0(130個0)

- alloc`0xa50ec5c6e4c315b43dc7a605fb7f705dd7a61a2a`: 初始給出的eth。

- alloc `000000000000000000000000000000000000f000`, `000000000000000000000000000000000000f001`, `000000000000000000000000000000000000f002`這三個地址為系統合約。如果希望自己編譯的話，將編譯後的結果`deployedBytecode`放到code。

- `000000000000000000000000000000000000f000`: ValidatorContractAddress

- `000000000000000000000000000000000000f001`: PunishContractAddress

- `000000000000000000000000000000000000f002`: ProposalAddress

## config.toml

[config.toml](./file/Tidetime-Chain/config.toml)

- `yourPath` 請替換成自己的路徑

- `StaticNodes` 可以放第一個node的連線資訊，如`"enode://6127d06afff6002cb6cd2b3b58ec18d1bb5bff9a905dabfea79e59021cc843f0b3874e282627f8401b0b137d55a55dc2eeb31140a0d7427232fe537283e6b11e@127.0.0.1:32668?discport=0"`

## Deploy

1. 安裝git, cmake

2. 安裝golang
  
    https://golang.org/doc/install

3. 下載source code

```sh
git clone https://github.com/HuobiGroup/huobi-eco-chain.git
```

4. 編譯

會自動根據自己的環境選擇編譯的版本

```sh
cd /path/to/hecochain
make geth
```
> 官方文件可以進行跨平台編譯，例如用mac編譯linux，只要下`make geth-linux`。但我失敗了，可能還需要些東西輔助？

編譯的結果會在專案資料夾底下的build/bin。

5. 建立創世區塊

準備好上面的`genesis.js`，修改好extraData跟要給的address。假設我們要存放chain的目錄是`/data/Tidetime`

```
./build/bin/geth --datadir /data/Tidetime/ init genesis.json
```

6. 匯入私鑰

礦工私鑰，一定要第一個匯入。

>為了避免私鑰洩漏，先存在key.txt(開頭不要0x)

```sh
./build/bin/geth account import key.txt --datadir /data/Tidetime/
```

然後會問你密碼，輸入兩次密碼即可得到私鑰地址。

> 可以將密碼存在pw.txt中，日後鏈重啟要解鎖私鑰會比較方便，但相對比較危險。

之後便可移除key.txt。

7. 啟動script

準備好上面的config.toml，替換`yourPath`成`/data/Tidetime`。

SyncMode預設是fast，可以改成full。archive一定要full sync。

如果有存pw.txt，可以在啟動script就解鎖。

```sh
./build/bin/geth \
--config config.toml \
--logpath /data/Tidetime/logs \
--unlock "0x9d6889702faffee1beec1968585f1411c7a98388" \
--password pw.txt \
--mine
```

不然就只能在節點啟動後，連進去解鎖。

第一個終端機啟動節點
```sh
./build/bin/geth \
--config config.toml \
--logpath /data/Tidetime/logs \
--mine
```

第二個終端機進入節點
```sh
./geth attach /data/Tidetime/geth.ipc
```

啟動私鑰，假設密碼是123456，0為無限期
```sh
personal.importRawKey("9d6889702faffee1beec1968585f1411c7a98388","123456", 0)
```

如果節點需要做archive，可以加入
```sh
--syncmode full \
--gcmode archive \
```

完整的`start.sh`
```sh
./build/bin/geth \
--config config.toml \
--logpath /data/Tidetime/logs \
--unlock "0x9d6889702faffee1beec1968585f1411c7a98388" \
--password pw.txt \
--syncmode full \
--gcmode archive \
--mine
```

8. 查詢節點連線資訊

方便之後其他validator連線用。

節點啟動後，連線到節點。

```sh
./geth attach /data/Tidetime/geth.ipc
```

連線後輸入
```
admin.nodeInfo
```

將enode完整複製下來，連`雙引號"`也要
```
"enode://6127d06afff6002cb6cd2b3b58ec18d1bb5bff9a905dabfea79e59021cc843f0b3874e282627f8401b0b137d55a55dc2eeb31140a0d7427232fe537283e6b11e@127.0.0.1:32668?discport=0"
```
>`127.0.0.1`這裡通常是顯示對外ip

然後將enode貼在config.toml的[Node.P2P]裡的`StaticNodes` array裡。
