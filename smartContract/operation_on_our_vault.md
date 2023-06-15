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
