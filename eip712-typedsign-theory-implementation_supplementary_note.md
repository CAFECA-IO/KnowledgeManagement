## EIP-712 簽名數據的格式
EIP-712 簽名數據的格式必須有一個 EIP712Domain 和要簽名的數據。

#### signature:
```
// using ethereumjs-util 7.1.3
const ethUtil = require('ethereumjs-util');

// using ethereumjs-abi 0.6.9
const abi = require('ethereumjs-abi');

function signHash() {
    return ethUtil.keccak256(
        Buffer.concat([
            Buffer.from('1901', 'hex'),
            structHash('EIP712Domain', typedData.domain),
            structHash(typedData.primaryType, typedData.message),
        ]),
    );
}
const signature = ethUtil.ecsign(signHash(), privateKey);
```

#### structHash:
```
function structHash(primaryType, data) {
    return ethUtil.keccak256(encodeData(primaryType, data));
}
```


## 簽名驗證
```
function verify(Mail memory mail, address signer, uint8 v, bytes32 r, bytes32 s) public view returns (bool) {

    // Note: we need to use `encodePacked` here instead of `encode`.
    // 這裡是固定格式，套用即可
    bytes32 digest = keccak256(abi.encodePacked(
        "\x19\x01",
        DOMAIN_SEPARATOR,
        hashStruct(mail)
    ));
    
    return ecrecover(digest, v, r, s) == signer;
    
}
```
verify 函數接收三個參數，分別是待簽名結構體，簽名地址，v，r，s。其中 v，r，s 是構成簽名的三部分，簽名一共有 65 個字節，前 32 個字節是 r，接下來 32 個字節是 s，最後一個字節是 v。 ecrecover 是 Solidity 內置函數，可以用於驗證簽名，它會根據 digest 以及簽名內容 v，r，s 來計算出簽名人的地址。如果結果等於傳入的簽名地址，則說明驗證簽名正確。


## 規格

### Signatures and Hashing overview

簽名由哈希算法及簽名算法組成，Ethereum 使用的簽名算法為 secp256k1，選擇的哈希算法為 keccak256。

## 規格

可簽名的消息集合由交易 (Transactions) 和字節串 (bytestrings) 𝕋 ∪ 𝔹⁸ⁿ擴展而來，還包含了結構化數據𝕊。可簽名消息集合的最新表示就是`𝕋 ∪ 𝔹⁸ⁿ ∪ 𝕊`。他們都被編碼成適合哈希和簽名的字節串，如下所示：  
 - encode(transaction, T) = RLP_encode(transaction)

 - encode(message, 𝔹⁸ⁿ) = "\x19Ethereum Signed Message:\n" ‖ len(message) ‖ message，其中len(message)是message中字節數的非零填充的ascii十進制編碼(non-zero-padded ascii-decimal)。 

 - encode(domainSeparator : 𝔹²⁵⁶, message : 𝕊) = "\x19\x01" ‖ domainSeparator ‖ hashStruct(message)，其中domainSeparator和hashStruct(message)如下定義。

這種編碼滿足確定性，因為單獨的組件都滿足確定性。同時編碼也是單射的，因為在上面三種情況下，第一個字節永遠不一樣。 (RLP_encode(transaction))並不會以\x19作為開頭。這種編碼同時也和EIP-191兼容。其中的`vertion byte`固定是0x01。 `version specific data`這裡就是32字節的域名分隔符domainSeparator，`data to sign`在這裡就是hashStruct(message)。

### 類型化的結構數據𝕊的定義(Definition of typed structured data)
```
struct Mail {
    address from;
    address to;
    string contents;
}
```
 - 定義：一個struct類型，具有有效的標識符作為名稱並包含零個或多個成員（member）變量。成員（member）變量由成員（member）類型和名稱組成。

 - 定義：一個成員（member）類型可以是一個原子（atomic）類型，動態 (dynamic) 類型或者引用 (reference) 類型。

 - 定義：原子（atomic）類型有：bytes1到bytes32，uint8到uint256，int8到int256，bool和address。

 - 定義：動態 (dynamic) 類型有bytes和string。這些在聲明時和原子類型一樣，但是它們在編碼中的處理是不同的。

- 定義：引用 (reference) 引用類型有arrays和structs。 arrays可以是固定長度的，也可以是動態長度的，分別用Type[n]和Type[]表示。 structs是由其名稱引用的其他結構體。該標準支持嵌套的struct。

- 定義：結構化的類型數據𝕊的集合包含所有struct類型的實例。

### hashStruct的定義
hashStruct方法如下定義：

hashStruct(s : 𝕊) = keccak256(typeHash ‖ encodeData(s)) ，其中 typeHash = keccak256(encodeType(typeOf(s)))
注意：typeHash對於給定結構類型來說是一個常量，並不需要運行時再計算。

### encodeType的定義
一個結構的類型用name ‖ "(" ‖ member₁ ‖ "," ‖ member₂ ‖ "," ‖ … ‖ memberₙ ")"來編碼，其中每個成員（member）都用type ‖ " " ‖ name來表示。舉個例子，上面的Mail結構體，就用Mail(address from,address to,string contents)來編碼。

如果結構類型引用其他的結構體類型（並且這些結構類型又引用更多的結構類型），那麼就會收集被引用的的結構類型集合，按名稱排序並附加到編碼中。一個編碼的例子就是，Transaction(Person from,Person to,Asset tx)Asset(address token,uint256 amount)Person(address wallet,string name)。

### encodeData的定義
一個結構體實例的編碼：enc(value₁) ‖ enc(value₂) ‖ … ‖ enc(valueₙ)，也就是說，成員值的編碼按照他們在類型中出現的順序連接在一起，每個編碼後的成員值長度是確定的32字節。

原子類型的值按照如下方法編碼：

 - 布爾值false和value都分別編碼成uint256類型的0或者1。
 - 地址都編碼成uint160類型
 - 整數(Integer)類型值都符號擴展成256位，並按大端順序編碼。
 - bytes1到bytes31是從索引0開始到索引length - 1的數組，它們從自身結束到bytes32的位置都用0填充，並且按照從開始到結束的順序編碼。這對應了她們在ABI v1和v2中的編碼。
 - 動態值bytes和string用他們內容的哈希值來編碼。 （哈希用keccak256方法）
 - 數組值的編碼則是把其內容的encodedData連接起來，再對整體進行keccak256。 （例如，對someType[5]進行編碼，和對包含5個類型為someType的成員的結構體進行編碼，是完全一樣的）。
 - 結構體值被遞歸編碼成hashStruct（value），對於循環數據不能採用這種定義。

### domainSeparator的定義
domainSeparator = hashStruct(eip712Domain)
其中eip712Domain的類型是一個名為EIP712Domain的結構體，並帶有一個或多個以下字段。協議設計者只需要包含對其簽名域名有意義的字段，未使用的字段不在結構體類型中。

 - string name：用戶可讀的簽名域名的名稱。例如Dapp的名稱或者協議。
 - string version：簽名域名的目前主版本。不同版本的簽名不兼容。
 - uint256 chainId：EIP-155中的鏈id。用戶代理應當拒絕簽名如果和目前的活躍鏈不匹配的話。
 - address verifyContract：驗證簽名的合約地址。用戶代理可以做合約特定的網絡釣魚預防。
 - bytes32 salt：對協議消除歧義的加鹽。這可以被用來做域名分隔符的最後的手段。

此標準的未來擴展可以添加具有新用戶代理行為約束的新字段。用戶代理可以自由使用提供的信息來通知/警告用戶或者直接拒絕簽名。

### 對eth_signTypedData JSON RPC的詳細說明
`eth_signTypedData`方法已經添加進了Ethereum JSON-RPC中。這個方法與`eth_sign`相似。

#### eth_signTypedData
這個簽名方法用`sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`計算一個以太坊特定的簽名。

通過給消息加上前綴，可以將計算出的簽名識別為以太坊特定的簽名。這可以防止惡意DApp簽署任意數據（例如交易），並使用簽名來冒充受害者的情況。

注意：用來簽名的地址必須解鎖。

參數：

 1. Address - 20字節 - 對消息簽名的賬戶地址.
 2. TypedData - 需要被簽名的類型化的結構數據。

類型化的數據是一個JSON對象，它包含類型信息，域名分割參數和消息對象。以下是一個TypedData參數的JSON-schema定義：

```
{
  type: 'object',
  properties: {
    types: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            type: {type: 'string'}
          },
          required: ['name', 'type']
        }
      }
    },
    primaryType: {type: 'string'},
    domain: {type: 'object'},
    message: {type: 'object'}
  }
}
```

#### Request
```
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_signTypedData","params":["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826", {"types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Person":[{"name":"name","type":"string"},{"name":"wallet","type":"address"}],"Mail":[{"name":"from","type":"Person"},{"name":"to","type":"Person"},{"name":"contents","type":"string"}]},"primaryType":"Mail","domain":{"name":"Ether Mail","version":"1","chainId":1,"verifyingContract":"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"},"message":{"from":{"name":"Cow","wallet":"0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},"to":{"name":"Bob","wallet":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},"contents":"Hello, Bob!"}}],"id":1}'
```

#### Result
```
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c"
}
```


在[Example.js](https://eips.ethereum.org/assets/eip-712/Example.js)eth_signTypedData中可以找到如何使用 Solidity ecrecover 來驗證計算出的簽名的示例。該合約部署在測試網 Ropsten 和 Rinkeby 上。

personal_signTypedData
還應該有一個相應的personal_signTypedData方法，它接受一個帳戶的密碼作為最後一個參數。


## 參考資料

- **[EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712#signatures-and-hashing-overview)**
- **[EIP-712 使用详解](https://mirror.xyz/xyyme.eth/cJX3zqiiUg2dxB1nmbXbDcQ1DSdajHP5iNgBc6wEZz4)**
- **[Example.js](https://eips.ethereum.org/assets/eip-712/Example.js)**
- ****[Ethereum EIP712 Signature 2021](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec/#bib-eip712)****
