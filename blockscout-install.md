# BlockScout - Ethereum network Explore 安裝

> source: [BlockScout 浏览器搭建教程](https://www.jianshu.com/p/40bbc588058f)

## centos 環境個套件版本

- Erlang/OTP 23 [erts-11.1.5]
- Elixir 1.10.0
- node v15.8.0
- npm 7.5.1
- rust 1.52.0
- inotify-tools 3.14-19.el8
- libtool 2.4.6-25.el8.x86_64
- gcc-c++ 8.4.1-1.el8.x86_64
- gmp-devel-1 6.1.2-10.el8.x86_64
- make-1 4.2.1-10.el8.x86_64

## 環境

- swap
```shell
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab
```

## Ubuntu 安裝流程

- erlang

  - step 1

  ```
  wget -O- https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | sudo apt-key add -
  ```
  
  - step 2

  
  ```
  Ubuntu 20.04:
  echo "deb https://packages.erlang-solutions.com/ubuntu focal contrib" | sudo tee /etc/apt/sources.list.d/rabbitmq.list
  
  
  Ubuntu 18.04:
  echo "deb https://packages.erlang-solutions.com/ubuntu bionic contrib" | sudo tee /etc/apt/sources.list.d/rabbitmq.list
  ```
  
  - step 3

  ```
  sudo apt update
  sudo apt install erlang -y
  sudo apt-get install erlang-dev erlang-parsetools -y
  ```
  
  - step 4

  ```
  erl
  ```
- elixir

  ```
  wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb && sudo dpkg -i erlang-solutions_2.0_all.deb
  sudo apt-get update
  sudo apt-get install esl-erlang -y
  sudo apt-get install elixir -y
  ```

- Node.js

  ```
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt-get install nodejs -y
  ```

- Automake

  ```
  sudo apt-get install automake -y
  ```
  
- Libtool

  ```
  sudo apt-get install libtool -y
  ```
  
- Lnotify-tools

  ```
  sudo apt-get install inotify-tools -y
  ```
  
- Make

  ```
  sudo apt-get install build-essential -y
  ```
  
- GMP

  ```
  sudo apt-get install libgmp3-dev -y
  ```

- g++

  ```
  sudo apt-get install g++ -y
  ```
  
- rust 裝完後需重啟

  ```
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

## Install

```
git clone https://github.com/BOLT-Protocol/blockscout.git
```

產生 secret_key_base

```
mix deps.get
mix phx.gen.secret
```

安装Mix依赖和编译应用程序

```
mix do deps.get
mix do local.rebar --force
mix do deps.compile
mix do compile
```

db 刪除、新建、遷移

```
mix do ecto.drop, ecto.create, ecto.migrate
```

安裝 Node.js dependency

```
cd apps/block_scout_web/assets
npm install && node_modules/webpack/bin/webpack.js --mode production


如果出錯可以改用
sudo npm install && node_modules/webpack/bin/webpack.js --mode production -g --unsafe-perm
```

部署靜態檔

```
cd ..
mix phx.digest
```

啟動 HTTPS

```
cd apps/block_scout_web/
mix phx.gen.cert blockscout blockscout.local
```

Start

```
cd ../..
mix phx.server
```

## 可能遇到的問題

- Error: ENOSPC: System limit for number of file watchers reached, watch '/home/foldername/abcrypto/static'

  https://github.com/gatsbyjs/gatsby/issues/11406
  
  `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`


## cleaning instance env

```
rm -rf _build
rm -rf deps
rm -rf logs/dev


rm -rf apps/block_scout_web/assets/node_modules
rm -rf apps/explorer/node_modules
```

# 部署至 AWS
硬體需求
- Explorer: centOS 8 r5a.xlarge 200GB SSD
- DB: ubuntu 20.04 m2.medium 200GB SSD

## DB
### 環境準備
### 部署流程

1. 安裝 postgresql

```
sudo apt update
sudo apt install postgresql postgresql-contrib
```

2. 啟動 postgresql

```
sudo pg_ctlcluster 12 main start
```

3. 檢查狀態

```
sudo pg_ctlcluster 12 main status
```

此時會看到

```
pg_ctl: server is running (PID: 6120)
/usr/lib/postgresql/12/bin/postgres "-D" "/var/lib/postgresql/12/main" "-c" "config_file=/etc/postgresql/12/main/postgresql.conf"
```

4. 接下來要修改設定檔，使其他機器可以連上，先關閉 postgresql

```
sudo pg_ctlcluster 12 main stop
```

5. 編輯設定檔
 
```
sudo vim /etc/postgresql/12/main/postgresql.conf
```

找到 `listen_addresses`

改成 `listen_addresses = '*'`

6. 編輯連線設定檔

```
sudo vim /etc/postgresql/12/main/pg_hba.conf
```

將所有欄位後方都改成 `md5`

然後新增連線限制設定

```
host    all             all             172.31.0.1/16           md5
```

7. 重啟 postgresql

```
sudo pg_ctlcluster 12 main restart
```

8. 修改 postgresql 密碼

```
sudo su postgres
psql

ALTER USER postgres with encrypted password 'your password';
```

9. 驗證連線

```
psql -h 172.31.18.32 -p 5432 -U postgres -W
```

然後輸入密碼，就會看到

```
psql (12.7 (Ubuntu 12.7-0ubuntu0.20.04.1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=#
```

### 注意事項

## Explorer

### 環境準備

- Epel 擴充資料庫

```
sudo yum -y install epel-release
```

- Erlang 安装

```
wget https://packages.erlang-solutions.com/erlang/rpm/centos/7/x86_64/esl-erlang_23.2.1-1~centos~7_amd64.rpm
sudo yum install -y wxGTK-devel unixODBC-devel
sudo yum install -y esl-erlang_23.2.1-1~centos~7_amd64.rpm
```

成功畫面如下：

```
[root@test]# erl
Erlang/OTP 21 [erts-10.0.5] [source] [64-bit] [smp:4:4] [ds:4:4:10] [async-threads:1] [hipe]

Eshell V10.0.5  (abort with ^G)
```

- Elixir 安装

```
wget https://github.com/elixir-lang/elixir/releases/download/v1.10.0/Precompiled.zip
unzip Precompiled.zip -d /opt/elixir
```

之後更新環境變數

```
sudo vi /etc/profile
```

在末行加入

```
export PATH="$PATH:/opt/elixir/bin"
```

然後讀取更新後的環境變數

```
source /etc/profile
```

成功之後可以這樣驗證

```
[root@test]# elixir -v
Erlang/OTP 21 [erts-10.0.5] [source] [64-bit] [smp:4:4] [ds:4:4:10] [async-threads:1] [hipe]

Elixir 1.9.4 (compiled with Erlang/OTP 20)
```

- nodejs

```
wget https://nodejs.org/dist/v15.8.0/node-v15.8.0-linux-x64.tar.xz

tar -xf node-v15.8.0-linux-x64.tar.xz

mv node-v15.8.0-linux-x64 nodejs

mkdir .bin

mv nodejs .bin/
```

之後更新環境變數

```
vi ~/.bashrc
```

在末行加入

```
export PATH="/home/centos/.bin/nodejs/bin:$PATH"
```

然後讀取更新後的環境變數

```
source ~/.bashrc
```

成功之後可以這樣驗證

```
node -v
npm -v
```

- 安裝 Automake

```
sudo yum --enablerepo=epel group install -y "Development Tools"
```

- 安装Libtool

```
sudo yum install -y libtool
```

- 安装Inotify-tools

```
sudo yum install inotify-tools
```

- 安装GCC Compiler

```
sudo yum install -y gcc-c++
```

- 安装GMP

```
sudo yum --enablerepo=epel install -y gmp-devel
```

- 安装Make

```
sudo yum install make -y
```

- 安装Rust

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

- git

```
sudo yum install git -y
```

### 部署流程

1. git clone 程式碼

```
git clone https://github.com/BOLT-Protocol/blockscout.git
```

2. 移動到專案內

```
cd blockscout
```

3. 安裝相依套件

```
mix deps.get
```

4. 產生 `secret_key_base`

等等第 5. 步設成 `SECRET_KEY_BASE` 變數

```
mix phx.gen.secret
```

5. 節點設定參數

```
sudo /usr/bin/geth --rpc --rpcaddr 0.0.0.0 --port 30303 --rpcport 8545 --rpcapi debug,net,eth,shh,web3,txpool --wsapi "eth,net,web3,network,debug,txpool" --ws --wsaddr 0.0.0.0 --wsport 8546 --wsorigins "*" --rinkeby --datadir=/rinkeby --syncmode=full --gcmode=archive --rpcvhosts=*
```

6. 添加環境變數

```
# 資料庫 URL: `{{ 資料庫protocol }}://{{資料庫帳號}}:{{資料庫密碼}}@{資料庫 IP 位置}}/blockscout`
export DATABASE_URL="postgresql://postgres:postgres@172.31.18.32:5432/blockscout"

## 使用上面方式設定連線資訊，或是使用下面方式分開設定
# 資料庫 ip / domain
export DB_HOST=172.31.18.32
# 資料庫密碼
export DB_PASSWORD=172.31.18.32
# 資料庫連接阜
export DB_PORT=5432
# 資料庫帳號
export DB_USERNAME=postgres

# step.4 產生的 `secret_key_base`
export SECRET_KEY_BASE="lpVoOiUyVn8xwOXGz0/V+l4lPQKgw5wJUgiM4WEw03SzbjGTUg5L0uxzR3LORoQO"

# ETH 節點架設軟體
export ETHEREUM_JSONRPC_VARIANT=geth
# ETH 節點 ip 連線位置
export ETHEREUM_JSONRPC_HTTP_URL="https://rpc.tidebit.network"
# ETH 節點 ws 連線位置
export ETHEREUM_JSONRPC_WS_URL="ws://rpc.tidebit.network"

# 沒用到，不過要留著
export SUBNETWORK=MAINNET

# blockscout 瀏覽器連接阜
export PORT=80
# 沒用到，不過要留著
export COIN="TideBit"

# blockscout 瀏覽器 logo，出現在 banner, footer
export LOGO=https://raw.githubusercontent.com/BOLT-Protocol/blockscout/tidebit/apps/block_scout_web/assets/static/images/blockscout_logo.svg
# 節點 chain id
export CHAIN_ID=8017

# 關掉價格顯示
export SHOW_PRICE_CHART=false
# 啟動 txs/day 圖表
export SHOW_TXS_CHART=true
# 啟動 txs/day 圖表
export ENABLE_TXS_STATS=true

# 檢查服務是否還開啟著的頻率
export HEART_BEAT_TIMEOUT=20
# 服務崩潰後執行的指令
export HEART_COMMAND="cd /home/centos/blockscout; screen -d -m mix phx.server"
```

7. 授權 erlang 使用 80 port

```
sudo setcap cap_net_bind_service=+ep /usr/lib/erlang/erts-11.1.5/bin/beam.smp
```

8. 讀取環境變數

```
source ~/.bashrc
```

9. 安装 Mix 依赖和編譯應用程式

```
mix do deps.get
mix do local.rebar --force
mix do deps.compile
mix do compile
```

10. db 刪除、新建、遷移

```
mix do ecto.drop, ecto.create, ecto.migrate
```

11. 安装Node.js依賴

```
cd apps/block_scout_web/assets
npm install && node_modules/webpack/bin/webpack.js --mode production
```

12. 部署靜態檔

```
cd apps/block_scout_web/
mix phx.digest
```

13. 啟用HTTPS

```
cd apps/block_scout_web/
mix phx.gen.cert blockscout blockscout.local
```

14. 設定 /etc/hosts

在兩行後面添加 `blockscout blockscout.local`

```
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4 blockscout blockscout.local
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6 blockscout blockscout.local
```

15. 背景取用程式

安裝

```
sudo yum install screen -y
```

執行

```
screen mix phx.server
```

此時按下 Ctrl + a 後，再按下 d 鍵（detach），這時候整個 screen 就會被卸離


16. 檢查

打開瀏覽器開啟 `http://{{ip}}`

### 注意事項
