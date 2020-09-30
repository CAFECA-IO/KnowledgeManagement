
## 新增 swap

官網建議 production servers 記憶體開到 32G, test servers. 開到 8G 就好，預設則是吃 16G

```
sudo swapon -s
free -m
df -h
sudo fallocate -l 32G /data/swapfile
sudo chmod 600 /data/swapfile
sudo mkswap /data/swapfile
sudo swapon /data/swapfile
free -m
sudo vim /etc/fstab
最後加這行即可開機自動掛載
/swapfile   none swap    sw 0 0
```

## 安裝 Ripple

```
sudo apt -y update
sudo apt -y install apt-transport-https ca-certificates wget gnupg
wget -q -O - "https://repos.ripple.com/repos/api/gpg/key/public" | sudo apt-key add -
```

### Check the fingerprint of the newly-added key: 

```
apt-key finger
```

你會看到

```
pub   rsa3072 2019-02-14 [SC] [expires: 2021-02-13]
      C001 0EC2 05B3 5A33 10DC 90DE 395F 97FF CCAF D9A2
uid           [ unknown] TechOps Team at Ripple <techops+rippled@ripple.com>
sub   rsa3072 2019-02-14 [E] [expires: 2021-02-13]
```

### 安裝 apt sources

先查看系統資訊

```
lsb_release -a
```

The above example is appropriate for Ubuntu 20.04 Focal Fossa. For other operating systems, replace the word focal with one of the following:

bionic for Ubuntu 18.04 Bionic Beaver
xenial for Ubuntu 16.04 Xenial Xerus
stretch for Debian 9 Stretch
buster for Debian 10 Buster

安裝的機器為 Ubuntu 18.04 Bionic Beaver

因此需將 focal 替換成 bionic

```
$ echo "deb https://repos.ripple.com/repos/rippled-deb focal stable" | \
    sudo tee -a /etc/apt/sources.list.d/ripple.list
```

繼續安裝步驟

```
sudo apt -y update
sudo apt -y install rippled


檢查是否成功安裝並成功運行
systemctl status rippled.service
```

## stop service

`sudo systemctl stop rippled.service`

## 改設定

```
mkdir -p $HOME/.local/ripple/
cp /etc/opt/ripple/rippled.cfg $HOME/.local/ripple/rippled.cfg
vim $HOME/.local/ripple/rippled.cfg
```

```
[port_grpc]
port = 50051
ip = 0.0.0.0

[node_size]
huge

[node_db]
type=NuDB
path=/data/nudb
online_delete=2000
advisory_delete=0

[database_path]
/data

[validators_file]
/etc/opt/ripple/validators.txt
```

#### testnet 多做以下步驟

```
vim $HOME/.local/ripple/validators.txt
```

```
[validator_list_sites]
https://vl.altnet.rippletest.net

[validator_list_keys]
ED264807102805220DA0F312E71FC2C69E1552C9C5790F6C25E3729DEB573D5860
```

編輯設定檔 `$HOME/.local/ripple/rippled.cfg`

> validators_file 為絕對路徑

```
[node_size]
medium

[ips]
r.altnet.rippletest.net 51235

[validators_file]
/home/ubuntu/.local/ripple/validators.txt
```

然後註解掉設定檔中的 [validator_list_sites], [validator_list_keys], [validators] 

[doc](https://xrpl.org/connect-your-rippled-to-the-xrp-test-net.html)

## 重啟服務

```
sudo systemctl restart rippled.service

檢查服務是否成功重啟
sudo systemctl status rippled.service
```

## get server info

```
rippled server_info
```

## 驗證節點是否 sync

```
rippled server_info | grep seq
```

的數字應該會跟鏈上節點相同

```
testnet
rippled --rpc_ip 35.158.96.209:51234 server_info | grep seq

mainnet
rippled --rpc_ip 34.201.59.230:51234 server_info | grep seq
```

ip 可能會更動，可以從 [public-servers](https://xrpl.org/get-started-with-the-rippled-api.html#public-servers) 取得新的 ip

