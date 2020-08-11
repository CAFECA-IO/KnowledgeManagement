# Deploy Filecoin

## Prepare Environment
Ubuntu 18.04
```shell
sudo apt update
sudo apt install mesa-opencl-icd ocl-icd-opencl-dev
sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update
sudo apt install golang-go gcc git bzr jq pkg-config mesa-opencl-icd ocl-icd-opencl-dev
sudo apt install llvm
sudo apt install clang
curl https://sh.rustup.rs -sSf | sh
```

## Download Source Code and Install Lotus
```shell
git clone https://github.com/filecoin-project/lotus.git
cd lotus
make clean && make all

# Install client
sudo make install
```

## Run Service
```shell
# Run service in the background
screen lotus daemon
Ctrl + A + D

# Check sync progress
lotus sync wait

# Create new wallet
lotus wallet new bls

# Check wallet balance
lotus wallet balance t3qywg7fr66p6ujjtyocv47exxfke55io4kz5jecdrfr32v57ipg5c6goi4q3hxuwdxktiv7qvwqmxeuqccwqq

# Regist miner
# Testnet https://faucet.testnet.filecoin.io/
# Get actor = bafy2bzacebjehhiysmlllbmfhifgtrjkcyhjzo2jz5dziecmyynqeruhs5hls

# Start mining
lotus-storage-miner init --actor=bafy2bzacebjehhiysmlllbmfhifgtrjkcyhjzo2jz5dziecmyynqeruhs5hls --owner= t3qywg7fr66p6ujjtyocv47exxfke55io4kz5jecdrfr32v57ipg5c6goi4q3hxuwdxktiv7qvwqmxeuqccwqq
screen lotus-storage-miner run
Ctrl + A + D
```
