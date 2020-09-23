# Bitcoin 節點架設

## download

```
curl https://bitcoin.org/bin/bitcoin-core-0.20.1/bitcoin-0.20.1-x86_64-linux-gnu.tar.gz --output bitcoin-0.20.1-x86_64-linux-gnu.tar.gz 
```

下載下來解壓縮的資料夾內有執行檔

## 設定執行檔路徑

```
vim ~/.bashrc`
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

-rpcpassword: rpc 密碼

-daemon: 背景執行
