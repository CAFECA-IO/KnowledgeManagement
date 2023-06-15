# 部署
## 現在本地端啟動模擬 fantom testnet 的節點
```sh
export RPC_URL=https://rpc.testnet.fantom.network/  
anvil --fork-url=$RPC_URL
```
## 使用forge部署
使用的是 [git repo](https://github.com/CAFECA-IO/Vault)
```sh
export PRIVATE_KEY=<YOUR_PRIVATE_KEY> 
forge script script/Vault.s.sol:VaultScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY  --broadcas
```
* 部署結果
<img width="1286" alt="Screenshot 2023-06-15 at 3 52 25 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/414ea70c-7391-494c-a4cb-bf124a2197c6">
* 到 [fantom testnet](https://testnet.ftmscan.com/) 上查看
<img width="1440" alt="Screenshot 2023-06-15 at 3 54 28 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/17acca24-e459-4c44-8fb8-be2282d74461">

# 入金到我們的 Vault 合約
## 使用我們的 USDT contract 鑄金(mint) 1 vUSDT
可以使用 `cast --to-wei <vault>` 知道對應的 wei
<img width="471" alt="Screenshot 2023-06-15 at 3 58 53 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/79f63b4d-2fdc-433d-86e0-05fe2fa5cdaa">

```sh
export ERC20_CONTRACT=0x32bad9d42f62a3c5aa373905b13ece56add9b682
export ERC4626_CONTRACT=0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed
export MY_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
cast send $ERC20_CONTRACT "mint(address,uint256)" $MY_ADDRESS 1000000000000000000 --private-key $PRIVATE_KEY --rpc-url $RPC_URL
```
### 結果
#### txhash
```sh
cast receipt 0x2974cf935ebb39f341806541e7ac0161baad5814e4e03ba56056cc24fe6bab17 --rpc-url $RPC_URL --json|jq
```
<img width="1285" alt="Screenshot 2023-06-15 at 4 04 17 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/a5d75b97-1632-483a-a78f-87ff400e13d4">
<img width="1680" alt="Screenshot 2023-06-15 at 4 05 00 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/8ef30ace-8814-4e41-978d-d49c0fb1d600">

## approval 1 vUSDT 給我們的 Vault contract
```sh
export ERC20_CONTRACT=0x32bad9d42f62a3c5aa373905b13ece56add9b682
export ERC4626_CONTRACT=0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed
export MY_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
cast send $ERC20_CONTRACT "approve(address,uint256)" $ERC4626_CONTRACT 1000000000000000000 --private-key $PRIVATE_KEY --rpc-url $RPC_URL
```
### 結果
#### txhash
```sh
cast receipt 0x8c8c9fb817bd72f00e4f33513e036c9bb78046c6364dae095f0f7d97c488391b --rpc-url $RPC_URL --json|jq
```
<img width="1289" alt="Screenshot 2023-06-15 at 4 07 37 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/2e40c9ce-275b-4c53-bcca-50f82a10c5e6">
<img width="1680" alt="Screenshot 2023-06-15 at 4 07 55 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/adc78002-2009-4372-9628-4ed38c9b0fe8">

## 入金(deposit) 1 vUSDT 到我們的 Vault contract
```sh
export ERC20_CONTRACT=0x32bad9d42f62a3c5aa373905b13ece56add9b682
export ERC4626_CONTRACT=0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed
export MY_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
cast send $ERC4626_CONTRACT "deposit(uint256)" 1000000000000000000 --private-key $PRIVATE_KEY --rpc-url $RPC_URL
```
### 結果
#### txhash
```sh
cast receipt 0xc9d7631de444897b936b807f7cb541bac1a629b886d4d4ed2b700dfdc9966576 --rpc-url $RPC_URL --json|jq
```
```json=
{
  "transactionHash": "0xc9d7631de444897b936b807f7cb541bac1a629b886d4d4ed2b700dfdc9966576",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cc4000021e163b444211b0d514db8a4f76c82d5b1ea33731b6fd217f8bd",
  "blockNumber": "0xff1edc",
  "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "to": "0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed",
  "cumulativeGasUsed": "0x1e08d",
  "gasUsed": "0x1e08d",
  "contractAddress": null,
  "logs": [
    { /** approval on ERC20_CONTRACT, owner: 0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266(MY_ADDRESS), spender: 0x000000000000000000000000aeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed(ERC4626_CONTRACT)*/
      "address": "0x32bad9d42f62a3c5aa373905b13ece56add9b682",
      "topics": [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x000000000000000000000000aeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "blockHash": "0x00004cc4000021e163b444211b0d514db8a4f76c82d5b1ea33731b6fd217f8bd",
      "blockNumber": "0xff1edc",
      "transactionHash": "0xc9d7631de444897b936b807f7cb541bac1a629b886d4d4ed2b700dfdc9966576",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    },
    { /** transfer on ERC20_CONTRACT, from: 0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266(MY_ADDRESS), to: 0x000000000000000000000000aeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed(ERC4626_CONTRACT)*/
      "address": "0x32bad9d42f62a3c5aa373905b13ece56add9b682",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x000000000000000000000000aeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockHash": "0x00004cc4000021e163b444211b0d514db8a4f76c82d5b1ea33731b6fd217f8bd",
      "blockNumber": "0xff1edc",
      "transactionHash": "0xc9d7631de444897b936b807f7cb541bac1a629b886d4d4ed2b700dfdc9966576",
      "transactionIndex": "0x0",
      "logIndex": "0x1",
      "removed": false
    },
    { /** mint on ERC4626_CONTRACT */
      "address": "0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // ""
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266"
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockHash": "0x00004cc4000021e163b444211b0d514db8a4f76c82d5b1ea33731b6fd217f8bd",
      "blockNumber": "0xff1edc",
      "transactionHash": "0xc9d7631de444897b936b807f7cb541bac1a629b886d4d4ed2b700dfdc9966576",
      "transactionIndex": "0x0",
      "logIndex": "0x2",
      "removed": false
    },
    { /** deposit on ERC4626_CONTRACT, sender: 0x000000000000000000000000aeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed(ERC4626_CONTRACT), owner: 0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266(MY_ADDRESS) 這邊我不確定 sender 跟 owner 有沒有寫反*/
      "address": "0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed",
      "topics": [
        "0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7", // keccak(Deposit(address,address,uint256,uint256))
        "0x000000000000000000000000aeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed", sender
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266"  owner
      ],
      "data": "0x0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000",
      "blockHash": "0x00004cc4000021e163b444211b0d514db8a4f76c82d5b1ea33731b6fd217f8bd",
      "blockNumber": "0xff1edc",
      "transactionHash": "0xc9d7631de444897b936b807f7cb541bac1a629b886d4d4ed2b700dfdc9966576",
      "transactionIndex": "0x0",
      "logIndex": "0x3",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000200000000000400000000000000008001200040000000000000000000000000000000000000000020000000000000100000800000000000004000000000010000000000000000000000800000000000000000000100000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000002000000200000000000000000000000002008000000000000000020000010000000200000000000000000000000000000000000000000000000080000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d3d2f60"
}
```
### 檢查
1. check `balanceOf(address)` my address on ERC20_CONTRACT，expect: 0 vUSDT
```sh
cast call $ERC20_CONTRACT "balanceOf(address)" $MY_ADDRESS --rpc-url $RPC_URL
```
<img width="847" alt="Screenshot 2023-06-15 at 4 20 30 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/24cf3b84-0321-4aad-a516-08791cafecde">

2. check `balanceOf(address)` my address on ERC4626，expect: 1 vUSDT
```sh
cast call $ERC4626_CONTRACT "balanceOf(address)" $MY_ADDRESS --rpc-url $RPC_URL
```
<img width="889" alt="Screenshot 2023-06-15 at 4 20 53 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/1370fe10-8881-4082-bad6-ffc8c70ee159">
3. 到 [fantom testnet](https://testnet.ftmscan.com/) 上查看
<img width="1680" alt="Screenshot 2023-06-15 at 4 28 31 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/d2442a19-243e-4bba-ab77-a72edfdb0613">
<img width="1680" alt="Screenshot 2023-06-15 at 4 29 44 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/aaa0b57a-cc46-4119-a7d6-9c86558deb1c">

## 轉 0.5 vUSDT (shares) 到其他錢包
可以使用 `cast --to-wei <vault>` 知道 0.5 vUSDT 對應的 wei
<img width="477" alt="Screenshot 2023-06-15 at 4 33 41 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/81e98c15-fd4b-4494-8b8d-8c17332632f3">
```sh
export ERC20_CONTRACT=0x32bad9d42f62a3c5aa373905b13ece56add9b682
export ERC4626_CONTRACT=0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed
export MY_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export ANOTHER_ADDRESS=0xfc657dAf7D901982a75ee4eCD4bDCF93bd767CA4
cast send $ERC4626_CONTRACT "transfer(address,uint256)" $ANOTHER_ADDRESS 500000000000000000 --rpc-url $RPC_URL --private-key $PRIVATE_KEY  
```
### 結果
#### txhash
```sh
cast receipt 0x59f3b0c35f21470ce411117fec980d200b0409c882e7df83bdb1bf6af11d0cdd --rpc-url $RPC_URL --json|jq
```
```json=
{
  "transactionHash": "0x59f3b0c35f21470ce411117fec980d200b0409c882e7df83bdb1bf6af11d0cdd",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cc4000034e2710f74cefd0351acc165fed20a5eac5900ae55ce6801ed82",
  "blockNumber": "0xff214b",
  "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "to": "0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed",
  "cumulativeGasUsed": "0xc8f5",
  "gasUsed": "0xc8f5",
  "contractAddress": null,
  "logs": [
    {
      "address": "0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x000000000000000000000000fc657daf7d901982a75ee4ecd4bdcf93bd767ca4"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cc4000034e2710f74cefd0351acc165fed20a5eac5900ae55ce6801ed82",
      "blockNumber": "0xff214b",
      "transactionHash": "0x59f3b0c35f21470ce411117fec980d200b0409c882e7df83bdb1bf6af11d0cdd",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000008001000004000000000000000000000000000000000000000000000000000000100000000000000000000000000000010000000000000000000000800000000000000000000000020000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000002000000200000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d3d75b0"
}
```
### 檢查
1. check `balanceOf(address)` my address on ERC4626_CONTRACT，expect: 0.5 vUSDT
```sh
cast call $ERC4626_CONTRACT "balanceOf(address)" $MY_ADDRESS --rpc-url $RPC_URL
```
<img width="866" alt="Screenshot 2023-06-15 at 4 37 36 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/fe45ea4a-4772-4058-8803-5642b7f1de6f">

2. check `balanceOf(address)` another address on ERC4626_CONTRACT，expect: 0.5 vUSDT
```sh
cast call $ERC4626_CONTRACT "balanceOf(address)" $ANOTHER_ADDRESS --rpc-url $RPC_URL
```
<img width="896" alt="Screenshot 2023-06-15 at 4 38 07 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/14f98737-004e-42c6-b8bf-c7c7f88a4bc8">

3. 到 [fantom testnet](https://testnet.ftmscan.com/) 上查看
<img width="1680" alt="Screenshot 2023-06-15 at 4 38 21 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/ee2b6ca6-bcad-45f4-8511-1571af314759">
<img width="1680" alt="Screenshot 2023-06-15 at 4 38 34 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/6991f335-e1c6-4809-b621-1e06931189b8">

## MY_ADDRESS 取款 0.5 vUSDT (shares) 到自己的錢包
```sh
cast send $ERC4626_CONTRACT "withdraw(uint256,address)" 500000000000000000 $MY_ADDRESS --rpc-url $RPC_URL --private-key $PRIVATE_KEY  
```
### 結果
#### txhash
```sh
cast receipt 0xb13e654d293b31131c09f7615acf6fc05b35170deb260507046aad676e0028a9 --rpc-url $RPC_URL --json|jq
```
```json=
{
  "transactionHash": "0xb13e654d293b31131c09f7615acf6fc05b35170deb260507046aad676e0028a9",
  "transactionIndex": "0x0",
  "blockHash": "0x00004cc400003be9b3935c4fcaee097e04b555a0e9caa31cf9d186e6e5a94989",
  "blockNumber": "0xff2224",
  "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "to": "0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed",
  "cumulativeGasUsed": "0x11180",
  "gasUsed": "0x11180",
  "contractAddress": null,
  "logs": [
    { /** 對應 burn */
      "address": "0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed",
      "topics": [ 
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // keccak(Transfer(address,address,uint256))
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cc400003be9b3935c4fcaee097e04b555a0e9caa31cf9d186e6e5a94989",
      "blockNumber": "0xff2224",
      "transactionHash": "0xb13e654d293b31131c09f7615acf6fc05b35170deb260507046aad676e0028a9",
      "transactionIndex": "0x0",
      "logIndex": "0x0",
      "removed": false
    },
    { 
      "address": "0xaeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed",
      "topics": [
        "0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db", // keccak(Withdraw(address,address,address,uint256,uint256))
        "0x000000000000000000000000aeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed", // sender
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266", // owner
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266"  // receiver
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b2000000000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cc400003be9b3935c4fcaee097e04b555a0e9caa31cf9d186e6e5a94989",
      "blockNumber": "0xff2224",
      "transactionHash": "0xb13e654d293b31131c09f7615acf6fc05b35170deb260507046aad676e0028a9",
      "transactionIndex": "0x0",
      "logIndex": "0x1",
      "removed": false
    },
    {
      "address": "0x32bad9d42f62a3c5aa373905b13ece56add9b682",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", // keccak(Transfer(address,address,uint256))
        "0x000000000000000000000000aeefb85c5a863bb42c3f5e291d2f56be7b1cc1ed", // from
        "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266"  // to
      ],
      "data": "0x00000000000000000000000000000000000000000000000006f05b59d3b20000",
      "blockHash": "0x00004cc400003be9b3935c4fcaee097e04b555a0e9caa31cf9d186e6e5a94989",
      "blockNumber": "0xff2224",
      "transactionHash": "0xb13e654d293b31131c09f7615acf6fc05b35170deb260507046aad676e0028a9",
      "transactionIndex": "0x0",
      "logIndex": "0x2",
      "removed": false
    }
  ],
  "status": "0x1",
  "logsBloom": "0x00000000000000400000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000008001200040000000000000000000000000000000000000000020000000000000100000800000000000000000000000010000000000000000000000800000000000000000000100000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000002000000200000000000000000000000002000000000000000000020000000000000200000000000000000000000000000000000000000000000080000",
  "type": "0x0",
  "effectiveGasPrice": "0x3d387c40"
}
```
### 檢查
1. check `balanceOf(address)` my address on ERC20_CONTRACT，expect: 0.5 vUSDT
```sh
cast call $ERC20_CONTRACT "balanceOf(address)" $MY_ADDRESS --rpc-url $RPC_URL
```
<img width="837" alt="Screenshot 2023-06-15 at 4 53 10 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/921d6a5e-4876-43b6-bd91-74750e8f2aed">

2. check `balanceOf(address)` my address on ERC4626_CONTRACT，expect: 0 vUSDT
```sh
cast call $ERC4626_CONTRACT "balanceOf(address)" $MY_ADDRESS --rpc-url $RPC_URL
```
<img width="851" alt="Screenshot 2023-06-15 at 4 53 21 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/99bc54ce-f7a8-4dab-9654-0f7bf16c9b94">

3. 到 [fantom testnet](https://testnet.ftmscan.com/) 上查看
<img width="1680" alt="Screenshot 2023-06-15 at 4 44 37 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/c0794265-390e-4275-a1c4-4d6c4e76449c">
<img width="1680" alt="Screenshot 2023-06-15 at 4 45 32 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/188db1f4-5c45-490b-809b-e1975e54513b">
<img width="1680" alt="Screenshot 2023-06-15 at 4 45 40 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/604337ca-3130-4108-9246-f267eed9fd44">

## ANOTHER_ADDRESS 取款 0.5 vUSDT (shares) 到自己的錢包
```sh
export ANOTHER_PRIVATE_KEY=<ANOTHER_PRIVATE_KEY>
cast send $ERC4626_CONTRACT "withdraw(uint256,address)" 500000000000000000 $ANOTHER_ADDRESS --rpc-url $RPC_URL --private-key $ANOTHER_PRIVATE_KEY  
```
### 結果
<img width="1287" alt="Screenshot 2023-06-15 at 4 57 40 PM" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/17249354/991c6011-7708-4365-8bac-a35ed3091e1d">
