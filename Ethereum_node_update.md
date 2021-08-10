# Ethereum Node Update

## 進入節點aws
Ethereum mainnet
```
ssh -i Baliv.pem ubuntu@ec2-13-52-247-229.us-west-1.compute.amazonaws.com
```

## 停止geth
geth目前使用screen做控制。 輸入`screen -ls`列出screen。
```
screen -ls
There is a screen on:
	20184..ip-172-31-5-250	(08/10/21 02:57:44)	(Detached)
```

`screen -r`切換screen。
```
screen -r 20184..ip-172-31-5-250
```

切換後會看到畫面一直刷類似的訊息，使用`control+C`停止。
```
INFO [08-10|02:56:49.379] Looking for peers                        peercount=1 tried=33 static=0
WARN [08-10|02:56:50.249] Served parity_netPeers                   conn=193.56.29.33:55190 reqid=3 t="14.352µs" err="the method parity_netPeers does not exist/is not available"
WARN [08-10|02:56:50.251] Served parity_netPeers                   conn=127.0.0.1:41186    reqid=3 t="7.536µs"  err="the method parity_netPeers does not exist/is not available"
INFO [08-10|02:56:52.649] Imported new chain segment               blocks=1 txs=259 mgas=30.025 elapsed=10.863s mgasps=2.764 number=12,965,000 hash=9b83c1..9eee71 age=4d14h23m dirty=2.76MiB
INFO [08-10|02:56:52.654] Unindexed transactions                   blocks=1 txs=196 tail=10,615,001 elapsed=2.953ms
```

## geth更新

確認目前版本：
```
geth version check
```

更新指令：
```
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
sudo apt-get upgrade geth
```

## 啟動geth

先測試確定有沒有問題，先輸入下面的指令啟動節點。
```
geth --rpc --cache 8192 --http --http.addr 0.0.0.0 --http.api admin,debug,web3,eth,txpool,personal,ethash,miner,net --ws --ws.addr 0.0.0.0 --ws.origins "*" --ws.port 8545 --ws.api admin,debug,web3,eth,txpool,personal,ethash,miner,net --mainnet --datadir /home/ubuntu/.ethereum
```

可以使用json rpc確認是否正常執行，確認無誤後再使用screen來執行。
```
screen -m -d -L geth --rpc --cache 8192 --http --http.addr 0.0.0.0 --http.api admin,debug,web3,eth,txpool,personal,ethash,miner,net --ws --ws.addr 0.0.0.0 --ws.origins "*" --ws.port 8545 --ws.api admin,debug,web3,eth,txpool,personal,ethash,miner,net --mainnet --datadir /home/ubuntu/.ethereum
```
