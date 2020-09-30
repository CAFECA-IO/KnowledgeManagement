# Bitcoin 節點架設

## 新增 swap

```
sudo swapon -s
free -m
df -h
sudo fallocate -l 16G /data/swapfile
sudo chmod 600 /data/swapfile
sudo mkswap /data/swapfile
sudo swapon /data/swapfile
free -m
sudo vim /etc/fstab
最後加這行即可開機自動掛載
/swapfile   none swap    sw 0 0
```

## download

```
curl https://bitcoin.org/bin/bitcoin-core-0.20.1/bitcoin-0.20.1-x86_64-linux-gnu.tar.gz --output bitcoin-0.20.1-x86_64-linux-gnu.tar.gz 
```

下載下來解壓縮的資料夾內有執行檔

## 設定執行檔路徑

```
vim ~/.bashrc
```

後添加路徑 

`export PATH="/home/ubuntu/bitcoin-0.20.1/bin:$PATH"`

存檔後

```
source ~/.bashrc
```

## 啟動節點

```
bitcoind -logtimestamps -datadir=./data -rest -rpcuser=xxxx -rpcpassword=xxxx -daemon
```

-logtimestamps: log + 時間戳

-datadir: 指定存放位置

-rest: 允許外部存取 rpc

-rpcuser: rpc 帳號

-daemon: 背景執行

-testnet: 測試鏈

-rpcport: Listen for JSON-RPC connections on <port> (default: 8332, testnet: 18332, regtest: 18443)

## 停止節點

```
bitcoin-cli -rpcuser=xxxx -rpcpassword=xxxx -rpcport=xxxx stop
```

## 節點檢查

`vim checkNode.sh`

> 注意須填絕對路徑，如果是 testnet 記得補上參數

```shell
#!/bin/sh
if ! /home/ubuntu/bitcoin-0.20.1/bin/bitcoin-cli -rpcuser=xxxx -rpcpassword=xxxx -rpcport=xxxx getrpcinfo; then
  /home/ubuntu/bitcoin-0.20.1/bin/bitcoind -logtimestamps -datadir=/data -rest -rpcuser=xxxx -rpcpassword=xxxx -rpcport=xxxx -daemon
fi
```

變成執行檔

`chmod +x /data/checkNode.sh`

設定排程

`crontab -e`

```
@reboot /data/checkNode.sh
* * * * * /data/checkNode.sh
```

## RPC API Reference

[RPC API Reference](https://developer.bitcoin.org/reference/rpc/)