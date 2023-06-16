# Git clone 我們的 Vault 專案
[Git repo](https://github.com/CAFECA-IO/Vault)

```sh
  git clone https://github.com/CAFECA-IO/Vault.git
```

切換到 <latest> branch 

```sh
  cd Vault
  git fetch origin featrue/transfer:featrue/transfer
  git checkout featrue/transfer
```

# 安裝 dependency
```sh
  forge install
```

# 部署
## 現在本地端啟動模擬 fantom testnet 的節點
```sh
export RPC_URL=https://rpc.testnet.fantom.network/  
anvil --fork-url=$RPC_URL
```
<img width="1680" alt="Screenshot 2023-06-16 at 1 10 19 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/eea75787-763b-46f7-bae0-ed781de58cda">

## 使用forge部署
  
* 可以把常用到的參數寫道 `~/.bash_profile` 然後再 `source ~/.bash_profile`，我把 private key 及 address 還有 rpc url 都寫在裡面，在下面的 command 中可以直接使用。
  
使用的是 [git repo](https://github.com/CAFECA-IO/Vault)
```sh
export PRIVATE_KEY_1=<YOUR_PRIVATE_KEY> 
forge script script/Vault.s.sol:VaultScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY_1  --broadcast
```
* 部署結果
<img width="1680" alt="Screenshot 2023-06-16 at 1 16 28 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/3d510a16-c9cd-4c0b-96ed-62deefc3892e">

```sh
export CONTRACT_ERC20=0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168
export CONTRACT_ERC4626=0x2a2c39e89589336c2a7d68c95ec84f4e3755db66
```
* 到 [fantom testnet](https://testnet.ftmscan.com/) 上查看
<img width="1393" alt="Screenshot 2023-06-16 at 1 20 29 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/b050c806-cf0d-479c-a670-8281a729581c">

# 入金到我們的 Vault 合約
## 使用我們的 USDT contract 鑄金(mint) 1 tbUSDT
可以使用 `cast --to-wei <value>` 知道對應的 wei
  
<img width="471" alt="Screenshot 2023-06-15 at 3 58 53 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/79f63b4d-2fdc-433d-86e0-05fe2fa5cdaa">

可以使用 `cast --to-unit ether` 轉回來
```sh
cast send $CONTRACT_ERC20 "mint(address,uint256)" $ADDRESS_1 1000000000000000000 --private-key $PRIVATE_KEY_1 --rpc-url $RPC_URL
```
### 結果
#### txhash
<img width="1680" alt="Screenshot 2023-06-16 at 1 23 31 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/738b6351-276b-432a-b3b4-cb68126c047b">

#### 查看 receipt  
```sh
cast receipt 0xa4e840d98b451d97fb42ca70b4d79bd44346bfbb3fd07ef66c8526a054635e88 --rpc-url $RPC_URL --json|jq
```

```json
{
  "transactionHash": "0xa4e840d98b451d97fb42ca70b4d79bd44346bfbb3fd07ef66c8526a054635e88",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cd4000032fd10d0e9e8c45b0a3fe44fbc1e3f43a2c03f01cab780586e59",
  "blockNumber": "0xffa707",
  "from": "0xfc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
  "to": "0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168",
  "cumulativeGasUsed": "0x10aa4",
  "gasUsed": "0x10aa4",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockHash": "0x00004cd4000032fd10d0e9e8c45b0a3fe44fbc1e3f43a2c03f01cab780586e59",
      "blockNumber": "0xffa707",
      "transactionHash": "0xa4e840d98b451d97fb42ca70b4d79bd44346bfbb3fd07ef66c8526a054635e88",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000008000000004000000000000000000000000000000000000000020000000000000000000800000000000000000000000010400000000000000000000000000000000000000000000020000000000000000000000000000040000000000000000000000000000000000010000000000000000000000000000002000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d36a398"
}
```  
  
* topics[0]: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef 是 `Transfer(address,address,uint256)` 的 keccak hash （Transfer(address from, address to, uint256 value)）
* topics[1]: 是 Transfer: address from
* topics[2]: 是 Transfer: address to  

#### 到 [ftmscan](https://testnet.ftmscan.com/tx/0xa4e840d98b451d97fb42ca70b4d79bd44346bfbb3fd07ef66c8526a054635e88) 上查看
  
<img width="1680" alt="Screenshot 2023-06-16 at 1 33 59 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/530f1c79-20bb-42c6-aa13-e5bf14b30e99">

### 檢查
<img width="1680" alt="Screenshot 2023-06-16 at 1 46 58 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/041f8da0-0359-49d3-a3bc-c06d4c07f157">

1. check `balanceOf(address)` my address on ERC20_CONTRACT，expect: 1 tbUSDT
  
```sh
cast call $CONTRACT_ERC20 "balanceOf(address)" $ADDRESS_1 --rpc-url $RPC_URL
```
  
<img width="859" alt="Screenshot 2023-06-16 at 1 50 57 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/311b4eae-e927-439f-933b-338781108770">

## approval 1 tbUSDT 給我們的 Vault contract
```sh
cast send $CONTRACT_ERC20 "approve(address,uint256)" $CONTRACT_ERC4626 1000000000000000000 --private-key $PRIVATE_KEY_1 --rpc-url $RPC_URL
```
### 結果
#### txhash
<img width="1678" alt="Screenshot 2023-06-16 at 1 54 19 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/620dff77-f078-406f-a29a-ded0a7d66b7f">

#### 查看 receipt  
```sh
export TXHASH=0x456b5a9b8c9b3d976a1577d123d3994ac53374c0dddfcfb3955d229d1a354c5f
cast receipt $TXHASH --rpc-url $RPC_URL --json|jq
```

```json
{
  "transactionHash": "0x456b5a9b8c9b3d976a1577d123d3994ac53374c0dddfcfb3955d229d1a354c5f",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cd4000046be1bd13dcbcf4e633edf0041810811363f53dde183f34f2be1",
  "blockNumber": "0xffa97c",
  "from": "0xfc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
  "to": "0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168",
  "cumulativeGasUsed": "0xb4b5",
  "gasUsed": "0xb4b5",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168",
      "topics": [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x0000000000000000000000002a2c39e89589336c2a7d68c95ec84f4e3755db66"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockHash": "0x00004cd4000046be1bd13dcbcf4e633edf0041810811363f53dde183f34f2be1",
      "blockNumber": "0xffa97c",
      "transactionHash": "0x456b5a9b8c9b3d976a1577d123d3994ac53374c0dddfcfb3955d229d1a354c5f",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400200000000000000000000000000000000000004200000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000020000000000000000000000000020040000000000000000000000000000000000010000000000000000000000000000000000000000000040000000000000000000000000000000000000000000010000000004000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d312d28"
}
```

* topics[0]: 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925 是 `Approval(address,address,uint256)` 的 keccak hash，對應的 Abi `Approval(address owner, address spender, uint256 value)`。
* topics[1]: 是 Transfer: address owner
* topics[2]: 是 Transfer: address address  
  
#### 到 [ftmscan](https://testnet.ftmscan.com/tx/0x456b5a9b8c9b3d976a1577d123d3994ac53374c0dddfcfb3955d229d1a354c5f) 上查看
  
<img width="1680" alt="Screenshot 2023-06-16 at 1 56 41 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/73a78de9-0404-42dd-9686-8faf8e020f61">

## 入金(deposit) 1 tbUSDT 到我們的 Vault contract ，得到 1 vUSDT
```sh
cast send $CONTRACT_ERC4626 "deposit(uint256)" 1000000000000000000 --private-key $PRIVATE_KEY_1 --rpc-url $RPC_URL
```
### 結果
#### txhash
  
<img width="1680" alt="Screenshot 2023-06-16 at 2 00 22 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/a3b9ce87-8e79-4a5b-864c-ca22e20816ff">

#### 查看 receipt  
```sh
export TXHASH=0xae29be2e789be550af094fd6e8455248468b93b822321124c66668e68a5d68cb
cast receipt $TXHASH --rpc-url $RPC_URL --json|jq
```

```json
{
  "transactionHash": "0xae29be2e789be550af094fd6e8455248468b93b822321124c66668e68a5d68cb",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cd400004b3993fbfee270fa30d2d7b22127024267fa7cd682a95d4b0e04",
  "blockNumber": "0xffaa11",
  "from": "0xfc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
  "to": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
  "cumulativeGasUsed": "0x1e09a",
  "gasUsed": "0x1e09a",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168",
      "topics": [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x0000000000000000000000002a2c39e89589336c2a7d68c95ec84f4e3755db66"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "blockHash": "0x00004cd400004b3993fbfee270fa30d2d7b22127024267fa7cd682a95d4b0e04",
      "blockNumber": "0xffaa11",
      "transactionHash": "0xae29be2e789be550af094fd6e8455248468b93b822321124c66668e68a5d68cb",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    },
    {
      "address": "0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x0000000000000000000000002a2c39e89589336c2a7d68c95ec84f4e3755db66"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockHash": "0x00004cd400004b3993fbfee270fa30d2d7b22127024267fa7cd682a95d4b0e04",
      "blockNumber": "0xffaa11",
      "transactionHash": "0xae29be2e789be550af094fd6e8455248468b93b822321124c66668e68a5d68cb",
      "transactionIndex": "0x0",
      "logIndex": "0x1",
      "removed": false
    },
    {
      "address": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockHash": "0x00004cd400004b3993fbfee270fa30d2d7b22127024267fa7cd682a95d4b0e04",
      "blockNumber": "0xffaa11",
      "transactionHash": "0xae29be2e789be550af094fd6e8455248468b93b822321124c66668e68a5d68cb",
      "transactionIndex": "0x0",
      "logIndex": "0x2",
      "removed": false
    },
    {
      "address": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
      "topics": [
        "0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockHash": "0x00004cd400004b3993fbfee270fa30d2d7b22127024267fa7cd682a95d4b0e04",
      "blockNumber": "0xffaa11",
      "transactionHash": "0xae29be2e789be550af094fd6e8455248468b93b822321124c66668e68a5d68cb",
      "transactionIndex": "0x0",
      "logIndex": "0x3",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400200000000000400000000000000008000000004200000000000000000000000000000000000000020000000000000000000800000000000004000000000010400000000000000000000000000000000000000000000020000000000000400000000000020040000000000000000010000000000000000010000000000000000000000000000002000000000000840000000000000000000008000000000000000020000010000000004000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d305a38"
}
```
  
#### 其中有四個 logs 分別對應:
  * reset approve: CONTRACT_ERC4626 can use 0 tbUSDT of ADDRESS_1
  * transfer 1 tbUSDT to CONTRACT_ERC4626
  * mint 1 vUSDT to ADDRESS_1
  * ADDRESS_1 deposit 1 tbUSDT get 1 vUSDT
  
  logs[3][topics][0]: 0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7 是 `Deposit(address,address,uint256,uint256)` 的 keccak256 hash，對應的 Abi `event Deposit(address sender, address owner, uint256 assets, uint256 shares)`。
  
#### 到 [ftmscan](https://testnet.ftmscan.com/tx/0xae29be2e789be550af094fd6e8455248468b93b822321124c66668e68a5d68cb) 上查看
  
<img width="1680" alt="Screenshot 2023-06-16 at 2 09 07 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/b9d2c1c3-aadb-4402-8965-507d53268a07">

### 檢查
1. check `balanceOf(address)` my address on ERC20_CONTRACT，expect: 0 tbUSDT
```sh
cast call $CONTRACT_ERC20 "balanceOf(address)" $ADDRESS_1 --rpc-url $RPC_URL
```
  
<img width="860" alt="Screenshot 2023-06-16 at 2 34 16 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/6ff749f2-6498-41b7-9f75-cbda8ff82f46">

或是可以用我們 vault 合約提供的 `totalAssetsOfUser(address)`
  
```sh
cast call $CONTRACT_ERC4626 "totalAssetsOfUser(address)" $ADDRESS_1 --rpc-url $RPC_URL
```
  
<img width="900" alt="Screenshot 2023-06-16 at 2 34 38 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/4a950612-ef98-4469-869f-a6a175011001">

2. check `balanceOf(address)` my address on ERC4626，expect: 1 vUSDT
```sh
cast call $CONTRACT_ERC4626 "balanceOf(address)" $ADDRESS_1 --rpc-url $RPC_URL
```

<img width="866" alt="Screenshot 2023-06-16 at 2 36 11 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/1a519480-bc9b-47a8-8df3-f2e5fee668fb">

3. check `totalSharesOfUser(address)` my address on ERC4626，expect: 1 vUSDT
```sh
cast call $CONTRACT_ERC4626 "totalSharesOfUser(address)" $ADDRESS_1 --rpc-url $RPC_URL
```
  
<img width="901" alt="Screenshot 2023-06-16 at 2 36 31 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/248e10be-8b24-49f8-a797-ea72d2010bb4">

#### 其中要特別注意的是
在目前的版本(SHA1: a4edd69f8f0bf5a92349f8a4a140d061d9674a4a)， 2，3 都是問某個 address 擁有多少 vUSDT，但 3 問到的才是真正擁有的 shares，因為直接使用 ERC20 提供的 `transfer(address to, uint256 value)` 也可以將我們的 vUSDT 轉給別人，但這個收到 vUSDT 的用戶只是得到了我們合約的 token 但不代表 shares，不會紀錄在我們的合約裡紀錄 shares 的變更，所以是沒有辦法出金的，同樣如果 Address 1 把自己所有的 vUSDT 給別人也可以出金。要使用我們提供的 `transferShares(uint256 shares, address receiver)` 才可以轉讓 shares。
  
不確定這是不是一個 BUG，是不是應該繼承 ERC20 的 transfer ，使得直接使用 `transfer(address to, uint256 value)` 就可以轉讓 shares。
  

## 轉 0.5 vUSDT (shares) 到其他錢包
可以使用 `cast --to-wei <vault>` 知道 0.5 vUSDT 對應的 wei
<img width="477" alt="Screenshot 2023-06-15 at 4 33 41 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/81e98c15-fd4b-4494-8b8d-8c17332632f3">
### 使用 `transferShares(uint256,address)` 
```sh
cast send $CONTRACT_ERC4626 "transferShares(uint256,address)" 500000000000000000 $ADDRESS_2 --private-key $PRIVATE_KEY_1 --rpc-url $RPC_URL
```
### 結果
#### txhash
  <img width="1680" alt="Screenshot 2023-06-16 at 2 49 46 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/3b139c0c-eea2-4390-ae9d-c88d0fb12cbe">

#### 查看 receipt  
  
```sh
export TXHASH=0x3e71526f4c594c1a0351231ec13d217fc8f679150f39d555c31acb765ee73eed
cast receipt $TXHASH --rpc-url $RPC_URL --json|jq
```
  
```json=
{
  "transactionHash": "0x3e71526f4c594c1a0351231ec13d217fc8f679150f39d555c31acb765ee73eed",
  "transactionIndex": "0x1",
  "blockHash": "0x00004cd500002891a127cea168ad9b454bb92e187b1407eed4a0b36bbd1366ef",
  "blockNumber": "0xffaf5a",
  "from": "0xfc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
  "to": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
  "cumulativeGasUsed": "0x18d38",
  "gasUsed": "0x13b30",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x000000000000000000000000ca81510e16faee783d8d3e7944525a148b9a6224"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cd500002891a127cea168ad9b454bb92e187b1407eed4a0b36bbd1366ef",
      "blockNumber": "0xffaf5a",
      "transactionHash": "0x3e71526f4c594c1a0351231ec13d217fc8f679150f39d555c31acb765ee73eed",
      "transactionIndex": "0x1",
      "logIndex": "0x0",
      "removed": false
    },
    {
      "address": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
      "topics": [
        "0x9d9c909296d9c674451c0c24f02cb64981eb3b727f99865939192f880a755dcb",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x000000000000000000000000ca81510e16faee783d8d3e7944525a148b9a6224"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cd500002891a127cea168ad9b454bb92e187b1407eed4a0b36bbd1366ef",
      "blockNumber": "0xffaf5a",
      "transactionHash": "0x3e71526f4c594c1a0351231ec13d217fc8f679150f39d555c31acb765ee73eed",
      "transactionIndex": "0x1",
      "logIndex": "0x1",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000200000000000000000008000800004000000000000000000000000000000000000000000000000000008000000000000000000000000000000010000000000000000000000000000000000000000000000020000000800000400000000000000040000000000000000010000000000000800000000000000000000000000000000002000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d3b2bc0"
}
```
  
#### 其中有兩個 logs 分別對應:
  * transfer 1 vUSDT from ADDRESS_1 to ADDRESS_2
  * event transferShares 1 vUSDT from ADDRESS_1 to ADDRESS_2
  
  logs[2][topics][0]: 0x9d9c909296d9c674451c0c24f02cb64981eb3b727f99865939192f880a755dcb 是 `TransferShares(address,address,uint256)` 的 keccak256 hash，對應的 Abi `event TransferShares(address indexed from, address indexed to, uint256 value)`。
  
### 到 [ftmscan](https://testnet.ftmscan.com/tx/0x3e71526f4c594c1a0351231ec13d217fc8f679150f39d555c31acb765ee73eed) 上查看  
<img width="1680" alt="Screenshot 2023-06-16 at 2 50 19 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/b4960c33-3b0d-48ef-8217-118fd08f32a3">

### 檢查
1. check `balanceOf(address)` my address on ERC4626_CONTRACT，expect: 0.5 vUSDT
```sh
cast call $CONTRACT_ERC4626 "balanceOf(address)" $ADDRESS_1 --rpc-url $RPC_URL
```

<img width="859" alt="Screenshot 2023-06-16 at 2 54 25 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/b28de8f0-6de8-446d-ba6a-dc2c394f6832">

check `totalSharesOfUser(address)` my address on CONTRACT_ERC4626，expect: 0.5 vUSDT
```sh
cast call $CONTRACT_ERC4626 "totalSharesOfUser(address)" $ADDRESS_1 --rpc-url $RPC_URL
```  

<img width="912" alt="Screenshot 2023-06-16 at 2 55 17 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/16a32919-21cb-46a1-81df-16fc8845f706">

2. check `balanceOf(address)` another address on CONTRACT_ERC4626，expect: 0.5 vUSDT
```sh
cast call $CONTRACT_ERC4626 "balanceOf(address)" $ADDRESS_2 --rpc-url $RPC_URL
```
  
 <img width="859" alt="Screenshot 2023-06-16 at 2 56 09 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/bc155717-636f-4eb1-8049-5776be47554f">

check `totalSharesOfUser(address)` another address on CONTRACT_ERC4626，expect: 0.5 vUSDT
```sh
cast call $CONTRACT_ERC4626 "totalSharesOfUser(address)" $ADDRESS_2 --rpc-url $RPC_URL
```  
<img width="902" alt="Screenshot 2023-06-16 at 2 56 29 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/de5e41ff-2a44-4ab8-812c-13810e5618b5">

  
3. 從這個收到 shares 的 address 取款 0.5 tbUSDT (shares --> assets) 到自己的錢包
```sh
cast send $CONTRACT_ERC4626 "withdraw(uint256)" 500000000000000000  --rpc-url $RPC_URL --private-key $PRIVATE_KEY_2
```
#### txhash
<img width="1679" alt="Screenshot 2023-06-16 at 2 58 21 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/6b44e792-09ca-4e94-bf8d-7d61c0eee373">

#### 查看 receipt  
  
```sh
export TXHASH=0x3df2f69038d897a79bb27f5cd5d17f1566e1a83b09dc11505e199967903886dd
cast receipt $TXHASH --rpc-url $RPC_URL --json|jq
```

```json=
{
  "transactionHash": "0x3df2f69038d897a79bb27f5cd5d17f1566e1a83b09dc11505e199967903886dd",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cd500002e591c809a7332320053b859df612ee5b439fba809d9d46a8d2b",
  "blockNumber": "0xffb024",
  "from": "0xca81510e16faee783d8d3e7944525a148b9a6224",
  "to": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
  "cumulativeGasUsed": "0xfcbf",
  "gasUsed": "0xfcbf",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000ca81510e16faee783d8d3e7944525a148b9a6224",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cd500002e591c809a7332320053b859df612ee5b439fba809d9d46a8d2b",
      "blockNumber": "0xffb024",
      "transactionHash": "0x3df2f69038d897a79bb27f5cd5d17f1566e1a83b09dc11505e199967903886dd",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    },
    {
      "address": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
      "topics": [
        "0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db",
        "0x000000000000000000000000ca81510e16faee783d8d3e7944525a148b9a6224",
        "0x000000000000000000000000ca81510e16faee783d8d3e7944525a148b9a6224",
        "0x000000000000000000000000ca81510e16faee783d8d3e7944525a148b9a6224"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b2000000000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cd500002e591c809a7332320053b859df612ee5b439fba809d9d46a8d2b",
      "blockNumber": "0xffb024",
      "transactionHash": "0x3df2f69038d897a79bb27f5cd5d17f1566e1a83b09dc11505e199967903886dd",
      "transactionIndex": "0x0",
      "logIndex": "0x1",
      "removed": false
    },
    {
      "address": "0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000002a2c39e89589336c2a7d68c95ec84f4e3755db66",
        "0x000000000000000000000000ca81510e16faee783d8d3e7944525a148b9a6224"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cd500002e591c809a7332320053b859df612ee5b439fba809d9d46a8d2b",
      "blockNumber": "0xffb024",
      "transactionHash": "0x3df2f69038d897a79bb27f5cd5d17f1566e1a83b09dc11505e199967903886dd",
      "transactionIndex": "0x0",
      "logIndex": "0x2",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000400000000000000000000000000000008000800000200000000000000000000000000000000000000020000000000000000000800000000000000000000000010400000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000010000000020000800010000000000000000000000000000002000000000000840000000000000000000000000000000000000020000000000000004000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d3aca18"
}
```
#### 其中有三個 logs 分別對應:
  * burn 1 vUSDT 
  * ADDRESS_2 withdraw 1 vUSDT， sender: ADDRESS_2, receiver: ADDRESS_2, owner: ADDRESS_2
  * CONTRACT_ERC4626 transfer 1 tbUSDT to ADDRESS_2
  
  logs[1][topics][0]: 0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db 是 `Withdraw(address,address,address,uint256,uint256)` 的 keccak256 hash，對應的 Abi `event Withdraw(address sender, address receiver, address owner, uint256 assets, uint256 shares)`。
  
#### 到 [ftmscan](https://testnet.ftmscan.com/tx/0x3df2f69038d897a79bb27f5cd5d17f1566e1a83b09dc11505e199967903886dd) 上查看  
<img width="1680" alt="Screenshot 2023-06-16 at 2 59 50 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/95f586a9-15ca-4394-8683-0f87a31864b3">

#### 檢查
1. check `balanceOf(address)` another address on CONTRACT_ERC4626，expect: 0 vUSDT
```sh
cast call $CONTRACT_ERC4626 "balanceOf(address)" $ADDRESS_2 --rpc-url $RPC_URL
```

<img width="872" alt="Screenshot 2023-06-16 at 3 05 24 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/2ae05819-7161-4be4-80ab-d6feae87c14e">

check `totalSharesOfUser(address)` another address on CONTRACT_ERC4626，expect: 0 vUSDT
```sh
cast call $CONTRACT_ERC4626 "totalSharesOfUser(address)" $ADDRESS_2 --rpc-url $RPC_URL
```  
  
<img width="902" alt="Screenshot 2023-06-16 at 3 05 57 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/11c80133-948c-45d4-94ef-32e779fdf46b">

2. check `balanceOf(address)` another address on CONTRACT_ERC20，expect: 0.5 vUSDT
```sh
cast call $CONTRACT_ERC20 "balanceOf(address)" $ADDRESS_2 --rpc-url $RPC_URL
```

<img width="858" alt="Screenshot 2023-06-16 at 3 06 57 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/e5d1c16d-f06f-4d73-8ddf-11a642cf2281">
<img width="1680" alt="Screenshot 2023-06-16 at 3 08 11 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/b3722cae-d16a-489a-aabc-c9d7dd290523">

## My Address 取款 0.5 tbUSDT (shares --> assets) 到自己的錢包
```sh
cast send $CONTRACT_ERC4626 "withdraw(uint256)" 500000000000000000  --rpc-url $RPC_URL --private-key $PRIVATE_KEY_1
```
### 結果
#### txhash
<img width="1680" alt="Screenshot 2023-06-16 at 3 17 56 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/e057b5da-1de3-4150-832b-0b232e9ae7b8">

  
#### 查看 receipt  
```sh
export TXHASH=0x9c75d3c23fe006ee33663eb3e6182cc10c29ee5776f1a8b4e11476377e5d375d
cast receipt $TXHASH --rpc-url $RPC_URL --json|jq
```

```json
{
  "transactionHash": "0x9c75d3c23fe006ee33663eb3e6182cc10c29ee5776f1a8b4e11476377e5d375d",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cd500003d6b39328b5e6f311dcc57b15199815490581ae76faac6ceedd0",
  "blockNumber": "0xffb202",
  "from": "0xfc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
  "to": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
  "cumulativeGasUsed": "0xe833",
  "gasUsed": "0xe833",
  "contractAddress": null,
  "logs": [
    {
      "address": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cd500003d6b39328b5e6f311dcc57b15199815490581ae76faac6ceedd0",
      "blockNumber": "0xffb202",
      "transactionHash": "0x9c75d3c23fe006ee33663eb3e6182cc10c29ee5776f1a8b4e11476377e5d375d",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    },
    {
      "address": "0x2a2c39e89589336c2a7d68c95ec84f4e3755db66",
      "topics": [
        "0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b2000000000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cd500003d6b39328b5e6f311dcc57b15199815490581ae76faac6ceedd0",
      "blockNumber": "0xffb202",
      "transactionHash": "0x9c75d3c23fe006ee33663eb3e6182cc10c29ee5776f1a8b4e11476377e5d375d",
      "transactionIndex": "0x0",
      "logIndex": "0x1",
      "removed": false
    },
    {
      "address": "0x74a8a6cd1ce9e6cfdf1a0d0f43b6b55fe0441168",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x0000000000000000000000002a2c39e89589336c2a7d68c95ec84f4e3755db66",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cd500003d6b39328b5e6f311dcc57b15199815490581ae76faac6ceedd0",
      "blockNumber": "0xffb202",
      "transactionHash": "0x9c75d3c23fe006ee33663eb3e6182cc10c29ee5776f1a8b4e11476377e5d375d",
      "transactionIndex": "0x0",
      "logIndex": "0x2",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000008000000004200000000000000000000000000000000000000020000000000000000000800000000000000000000000010400000000000000000000000000000000000000000000020000000000000400000000000000040000000000000000010000000020000000010000000000000000000000000000002000000000000840000000000000000000000000000000000000020000000000000004000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d38ce48"
}

```

* logs[1]  
    * topics[0]: 0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db 是 `Withdraw(address,address,address,uint256,uint256)` 的 keccak hash，對應的 Abi `event Withdraw(address sender, address receiver, address owner, uint256 assets, uint256 shares)`。
    * topics[1]: 是 Withdraw: address sender
    * topics[2]: 是 Withdraw: receiver address
    * topics[3]: 是 Withdraw: owner address  

#### 到 [ftmscan](https://testnet.ftmscan.com/tx/0x9c75d3c23fe006ee33663eb3e6182cc10c29ee5776f1a8b4e11476377e5d375d) 上查看
  
<img width="1680" alt="Screenshot 2023-06-16 at 3 18 27 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/cd4f9fb7-64ca-436a-aed1-8f2a7e92887a">

### 檢查  
  
1. check `balanceOf(address)` my address on CONTRACT_ERC4626，expect: 0 vUSDT
```sh
cast call $CONTRACT_ERC4626 "balanceOf(address)" $ADDRESS_1 --rpc-url $RPC_URL
```

<img width="876" alt="Screenshot 2023-06-16 at 3 20 17 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/a65eea12-1b48-4b42-b66c-91e6f66b37ca">

check `totalSharesOfUser(address)` my address on CONTRACT_ERC4626，expect: 0 vUSDT
```sh
cast call $CONTRACT_ERC4626 "totalSharesOfUser(address)" $ADDRESS_1 --rpc-url $RPC_URL
```  
  
<img width="902" alt="Screenshot 2023-06-16 at 3 20 25 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/8bc0a9e3-1110-42e0-aadd-85cefb2c8fae">

2. check `balanceOf(address)` my address on CONTRACT_ERC20，expect: 0.5 vUSDT
```sh
cast call $CONTRACT_ERC20 "balanceOf(address)" $ADDRESS_1 --rpc-url $RPC_URL
```
<img width="871" alt="Screenshot 2023-06-16 at 3 20 58 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/cc46eeb7-310e-4874-9d2e-03491de1d5f9">
<img width="1680" alt="Screenshot 2023-06-16 at 3 21 14 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/9774160b-68f7-456b-8dd8-803d59e4d3f0">

# 綜上在我們 Vault 合約上的所有操作
<img width="1680" alt="Screenshot 2023-06-16 at 3 21 48 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/70d74feb-9edc-4e28-8903-e2d80e4834f6">
