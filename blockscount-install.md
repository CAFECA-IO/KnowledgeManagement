# BlockScout - Ethereum network Explore 安裝

> source: [BlockScout 浏览器搭建教程](https://www.jianshu.com/p/40bbc588058f)

## 環境

- swap
```shell
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab
```

- install erlang 21.0.4
```shell
sudo apt-get install libncurses5-dev libncursesw5-dev -y
mkdir ~/workspace
cd ~/workspace
wget http://erlang.org/download/otp_src_21.0.tar.gz
tar -xvzf otp_src_21.0.tar.gz
sudo chmod -R 777 otp_src_21.0
cd otp_src_21.0
sudo ./configure
sudo make
sudo make install
```

- install library
```shell
wget -O- https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | sudo apt-key add -
wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb && sudo dpkg -i erlang-solutions_2.0_all.deb
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
echo "deb https://packages.erlang-solutions.com/ubuntu bionic contrib" | sudo tee /etc/apt/sources.list.d/rabbitmq.list
sudo apt update
sudo apt-get install erlang-dev erlang-parsetools elixir nodejs automake libtool inotify-tools build-essential libgmp3-dev g++ -y
echo -ne '\n' | curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
mkdir ~/workspace
cd ~/workspace
git clone https://github.com/blockscout/blockscout.git
```

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
git clone https://github.com/blockscout/blockscout.git
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
