<!-- - [EIP 712 簽名原理](#eip-712-簽名原理)
- [EIP 712 簽名規範/格式](#eip-712-簽名規範格式)
- [EIP 712 簽名實作 (`ethers.js`)](#eip-712-簽名實作-ethersjs)
- [參考資料](#參考資料) -->

## EIP 712 簽名原理


## EIP 712 簽名規範/格式
`EIP712Domain` 格式應照以下順序，但可省略不填 `salt`, `verifyingContract` 跟 `chainId`

- `string name` 簽名域 (signing domain) 的用戶可讀名稱，即 DApp 或協議的名稱。
- `string version` 簽名域的當前主要版本。來自不同版本的簽名不兼容。
- `uint256 chainId` [EIP-155](https://eips.ethereum.org/EIPS/eip-155) chain id.
- `address verifyingContract` 用於驗證簽名的合約地址。
- `bytes32 salt`

<!-- Public key: 0xb54898DB1250A6a629E5B566367E9C60a7Dd6C30

name, version, chainId, verifyingContract and salt all set, get signature:
0x0b38434b938c769857a43c6c46815693e00cef60a6a1198e9e0ea1cf3960de1776b13683ad25c285b3e86abffc0ace7e2136a5f1cbacb848fb266689bad4f6411b

salt: '0x' + '0000000000000000000000000000000000000000000000000000000000000002',

salt removed, get signature:
0xb8aa52fe06aea74f816836a12667a09613d8292135203bf57a7347bb483eed2b767a472a26480ea4381fdada58cfefdba27c07bf79b19c58212ae9d718a9744d1b

verifyingContract removed, get signature:
EIP 712 Signature: 0xad07587ebb531a4f9440e8777b4b135994ee92acbd38d55b59eb1258868882ce421637228d8d296fbf44139ff29b7a8ca647f430d55c7dadb0d6c3961d068ef81c

chainId removed, get signature:
0x02181b3d8d29332130106f12e25b7029452e9882d21a77e625b52405dfbfb1072f681f6e437f2960678149d5c49dfd0086f898c01ced34a9c65b463ca38073bb1b

version removed, get signature:
0x02181b3d8d29332130106f12e25b7029452e9882d21a77e625b52405dfbfb1072f681f6e437f2960678149d5c49dfd0086f898c01ced34a9c65b463ca38073bb1b

name removed, get signature:
0x5d585ca2eb454e00ef14f2c07a749bccf80cadff68717531b1b9ddd6058ff8885b38e00a3f401c7bf82345fe2c6ecd9df33556f7ba6876ed16294e9d4953dfe91b -->



### 必填、選填

## EIP 712 中 Hash 的原理跟產生的方法


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
