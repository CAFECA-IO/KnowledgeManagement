# BlockScout - Ethereum network Explore 安裝

> source: [BlockScout 浏览器搭建教程](https://www.jianshu.com/p/40bbc588058f)

## 環境

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
  sudo apt install erlang
  ```
  
  - step 4

  ```
  erl
  ```
- elixir

  ```
  wget https://packages.erlang-solutions.com/erlang-solutions_2.0_all.deb && sudo dpkg -i erlang-solutions_2.0_all.deb
  sudo apt-get update
  sudo apt-get install esl-erlang
  sudo apt-get install elixir
  ```

- Node.js

  ```
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- Automake

  ```
  sudo apt-get install automake
  ```
  
- Libtool

  ```
  sudo apt-get install libtool
  ```
  
- Lnotify-tools

  ```
  sudo apt-get install inotify-tools
  ```
  
- Make

  ```
  sudo apt-get install build-essential
  ```
  
- GMP

  ```
  sudo apt-get install libgmp3-dev
  ```

- g++

  ```
  sudo apt-get install g++
  ```
  
- rust

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
