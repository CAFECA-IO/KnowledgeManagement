<!-- - [EIP 712 簽名原理](#eip-712-簽名原理)
- [EIP 712 簽名規範/格式](#eip-712-簽名規範格式)
- [EIP 712 簽名實作 (`ethers.js`)](#eip-712-簽名實作-ethersjs)
- [參考資料](#參考資料) -->

## EIP 712 簽名原理


## EIP 712 簽名規範/格式
`EIP712Domain` 格式應照以下順序，但可跳過任何不需要的資料欄位

- `string name` 簽名域 (signing domain) 的用戶可讀名稱，即 DApp 或協議的名稱。
- `string version` 簽名域的當前主要版本。來自不同版本的簽名不兼容。
- `uint256 chainId` [EIP-155](https://eips.ethereum.org/EIPS/eip-155) chain id.
- `address verifyingContract` 用於驗證簽名的合約地址。
- `bytes32 salt`


<!-- ## EIP 712 簽名實作

### `ethers.js`

- sign

```jsx

```

- Verified

```jsx

``` -->

## 參考資料

- **[EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712#signatures-and-hashing-overview)**
- ****[Ethereum EIP712 Signature 2021](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/#bib-eip712)****
