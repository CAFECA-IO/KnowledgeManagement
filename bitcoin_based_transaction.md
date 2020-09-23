# Bitcoin transaction



### 一般交易由以下幾個部分組成
```javascript=
From
To
Amount
Fee
Note
```

### Bitcoin 的交易由以下幾個部份組成

> 原本的交易格式
#### `nVersion`|`txins`|`txouts`|`nLockTime`
```javascript=
version[4 bytes]: 取決於此筆交易的網路[testnet or mainnet]
Txins Count[1+ bytes]: input 數量，即用來銷毀打造新幣的幣的數量，一般來說總得Txins的amount 會大於output amount，等於output amount 加上fee。
Txins[41+ bytes]： Txins[index].reversedId + Txins[index].vout(in little Endian Buffer)+ script(script.length + ...script)+ sequence.
Txouts Count[1+ bytes]: Output 數量.
Txouts[9+ bytes]:，由交易金額（in little Endian Buffer）及由其目的地(交易對象地址，找零地址或交易訊息note)轉化成的script組成
LockTime： default 0， (in little Endian Buffer)
```
> segwit的交易格式
#### `nVersion`|`marker`|`flag`｜`txins`|`txouts`|`witness`｜`nLockTime`

其中：
nVersion, txins, txouts, 及 nLockTime 的格式和原本格式相同
* marker必須是 0x00
* flag必須是 0x01

若為 p2wpk 格式的交易則會有witness script，作用是取代原本包含在txin中的script，用來解鎖對應的input，但同樣會保留原script的位置，帶入0，以表示script is null。
```javascript=
witness script[1+ bytes]： 從transaction中分離出來的unlocking script 用來解鎖對應到的input
```


### 拆解其中幾個部分的組成：

#### Txin：[txid.reserved + vout.littleEndianBuffer + script + sequence]
1. 首先Txin從何而來，從你的錢包所收到的幣並且還沒有花掉的幣而來（可以從交易紀錄中解析出來，也可以直接問api）稱為為utxo。
2. utxo的組成amount，txid，vout：
    * amount： 收到的金額
    * txid： 此筆交易的id
    * vout： 此筆交易中的第幾筆output

為了方便起見，我會在utxo的class中額外加入幾個資訊：
* 收到此筆交易地址的chain index及key index(用於解鎖此utxo，utxo要解鎖成功才可以使用)
* type(用於解鎖此utxo)：
    * pubkey
    * pubkeyhash
    * witness_v0_keyhash
    * scripthash
    * p2wpkhNestedInP2sh
    
*  HashType(用於解鎖此utxo)：
    *  ALL
    *  NONE
    *  SINGLE
    *  ANYONECANPAY
3. 如何決定Txin的數量，這取決於交易金額及交易手續費，Total amount of Txins 要大於等於交易金額加上交易手續費，多的部份則可以打到你自己的找零錢包裡。

4. script: 
    *    首先每一個txin(utxo)都會有對應的script，這個script是用來解鎖該utxo的資料稱為 unlocking script (簡稱scriptSig)。
    *    由script的長度加上script本身組成，在還沒簽名前並未得到script所以交易前的 Raw Transaction中，script的長度為0且script為null，所以直接帶 buffer 0。
    *    script是根據此utxo的utxo type及此txin的 hashtype所對應的特定交易格式排列後，做double sha256 去簽名，再用 DER 的格式排列r,s,v所得到的。簽名的鑰匙則是這筆utxo的交易的地址所對應的私鑰。
    *    其中這個要被簽名的具有特定的格式交易分兩種一種是原來的交易格式，另一種則是隔離見證的格式（會在下面做說明更具體的說明）由utxo type決定及ScriptSig 決定。

    *    得到script後，會根據其是否為隔離見證交易格式所得到的script來決定其擺放的位置。
        *  若為一個交易的隔離見證交易格式所得到的script 稱其為 witness script ，根據[Bip 143](https://en.bitcoin.it/wiki/BIP_0143#Abstract) 所制定的規則， witness script，是從transaction格式中將unlocking script 分離出來，所以放在上述的segwit的交易格式中witness欄位中。
        *   所有的txin都連到一個witness欄位，所以並沒有再規劃一個欄位來指定有幾個witness欄位。
        *   如果在整筆交易中同時有witness script跟原本的script，沒有witness script的txin對應到的witness欄位就是0（0x00）。
        *   有witness script就不會有script(P2wpkh Nested In P2sh 除外，其script 為[BIP16](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki) redeemScript)，所有對應的欄位也填0（0x00）。
        *   如果在整筆交易中沒有witness script則必須使用原本的交易格式，若有則必須使用segwit的交易格式。
        

5. sequcence： 一般設置為0xffffffff(可設置區間為 //TODO)，轉為4 bytes little Endian Buffer。

#### Txout： [Output amount + Output script]
對應於一般交易格式，txout 就是用來紀錄，amount，change 及其轉帳地址，若交易有note的話，也紀錄在這裡。
1. amount 及 change 的格式：
    * amount/change to smallest unit in BigInt type, ex.bitcoin is satosi。
    * encode amount in 8 bytes little endian buffer

2. amount Script 格式：
    先判斷地址是否為 CashAddress，如果是的話，要先將cashAddress 轉回Bitcoin的Address，如果不是這直接使用，再根據地址的類型可以分為以下幾種情況：
    *   P2pkhAddress
        *   對地址進行 base58 decode ,取後20bytes 得到publickey hash(可從 compressed publicKey 做OP_HASH160得到)
        *  script： OP_DUP OP_HASH160 < PublicKey Hash Length> < PublicKey Hash> OP_EQUALVERIFY OP_CHECKSIG [[script]](https://en.bitcoin.it/wiki/Script#Opcodes)

    *   P2shAddress
        *  [同上的第一步] 對地址進行 base58 decode ,取後20bytes 得到publickey hash(可從 compressed publicKey 做OP_HASH160得到)
        *  script： OP_HASH160 < PublicKey Hash Length> < PublicKey Hash> OP_EQUAL 
        
    *   SegWitAddress 
        *   Extract Script Pubkey from SegWit Address

3. change Script 格式：
    確定要收找零錢地址的key Index(及chain Index 為1)，根據KeyIndex & Chain Index 可以推出零錢地址的 publicKey，再對publicKey 做Hash 160，根據錢包的purpose可以分為以下幾種情況
    *   nativeSegWit (bip 84)
        *  script： OP_0  < PublicKey Hash Length> < PublicKey Hash>
    *   SegWit (bip 49)
        *   script： OP_HASH160 < PublicKey Hash Length> < PublicKey Hash> OP_EQUAL 
    *   Non SegWit (bip 44）
        *    script： OP_DUP OP_HASH160 < PublicKey Hash Length> < PublicKey Hash> OP_EQUALVERIFY OP_CHECKSIG 

4. 不用定義fee， fee 等於 total txins amount 減去 total txouts amount。


### 如何獲得Txin中的script
交易的簽名格式。可以分為以下幾種格式


| SIGHASH flag | Value    | Description|
| ------------ | -------- | ---------- |
| ALL          | 0x01     | 簽名應用於所有輸入和輸出。     |
| NONE         | 0x02     | 簽名應用於所有輸入，不包括任何輸出     |
| SINGLE       | 0x03     | 簽名應用於所有輸入，但僅應用於與簽名輸入具有相同索引編號的一個輸出。     |

另外，還有一個修飾符標誌 SIGHASH_ANYONECANPAY，它可以與前面的每個標誌結合使用。當設置了 ANYONECANPAY 時，只有一個輸入被簽名，剩下的（及其序列號）保持開放可以修改。 ANYONECANPAY 的值為 0x80，並按位OR應用，生成組合的標誌，如 SIGHASH types with modifiers and their meanings 所示。[[1]](https://cypherpunks-core.github.io/bitcoinbook_2nd_zh/%E7%AC%AC%E5%85%AD%E7%AB%A0.html)

| SIGHASH flag        | Value      | Description|
| ------------------- | ---------- | ---------- |
| ALL\|ANYONECANPAY   | 0x80 \| 0x01| 簽名應用於一個輸入和輸出。     |
| NONE\|ANYONECANPAY  | 0x80 \| 0x02| 簽名應用於一個輸入，不包括任何輸出     |
| SINGLE\|ANYONECANPAY| 0x80 \| 0x03| 簽名應用於一個輸入，但僅應用於與簽名輸入具有相同索引編號的一個輸出。     |
    

有兩種用於簽名的特殊交易格式，在不同情況中使用，一種是原本的交易格式，另一種則是Segwit交易格式，只有兩種情況會觸發使用Segwit交易格式：
1. 一種是utxo type 為 witness_v0_keyhash(並且對應的txin script要是空的，不然會導致驗證失敗)。*("native witness program")*
2. 另一種則是p2wpkhNestedInP2sh(並且對應的txin script要為[BIP16](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki) 的redeemScript，不然會導致驗證失敗)。*("P2SH witness program")*

### Key Term 
* `scriptPubKey = the locking script of an output`

* `scriptSig = the unlocking script to resolve an scriptPubKey`

* `redeemScript = A script similar in function to a scriptPubKey. One copy of it is hashed to create a P2SH address and another copy is placed in the spending signature script to enforce its conditions.`

下面為引用[[Bip141]](https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki#P2WPKH_nested_in_BIP16_P2SH)的例子
#### P2WPKH
The following example is a version 0 pay-to-witness-public-key-hash (P2WPKH):

    witness:      <signature> <pubkey>
    scriptSig:    (empty)
    scriptPubKey: 0 <20-byte-key-hash>
                  (0x0014{20-byte-key-hash})
The HASH160 of the pubkey in witness must match the witness program.

The signature is verified as

    <signature> <pubkey> CHECKSIG


#### P2WPKH nested in BIP16 P2SH
The following example is the same P2WPKH, but nested in a BIP16 P2SH output.

    witness:      <signature> <pubkey>
    scriptSig:    <0 <20-byte-key-hash>>
                  (0x160014{20-byte-key-hash})
    scriptPubKey: HASH160 <20-byte-script-hash> EQUAL
                  (0xA914{20-byte-script-hash}87)
The only item in scriptSig is hashed with HASH160, compared against the 20-byte-script-hash in scriptPubKey, and interpreted as:

    0 <20-byte-key-hash>
The public key and signature are then verified as described in the previous example.

### redeem script
P2SH交易是在2012年創建的，是因為有的收款方會希望付款方在交易中使用特定的腳步而，自定義pubkey腳本不如簡短的比特幣地址方便使用，並且在稍後討論的BIP70支付協議的廣泛實施之前，沒有標準的方法可以在程序之間進行通信。所以P2SH基本上就是允許你自訂腳本，並且當你要解鎖這筆腳本時，則要提供該腳本的原始版本以解鎖，使支出者可以創建包含第二個腳本（即贖回腳本）的哈希值的scriptPubKey(HASH160 原始腳本即可得到scriptPubKey)。[[p2sh]](https://btcinformation.org/en/developer-guide#p2sh-scripts)

以單一簽名交易(one-signature-required transaction)為例[[BIP16]](https://github.com/bitcoin/bips/blob/master/bip-0016.mediawiki)：

    scriptSig: [signature] {[pubkey] OP_CHECKSIG}
    scriptPubKey: OP_HASH160 [20-byte-hash of {[pubkey] OP_CHECKSIG} ] OP_EQUAL

{序列化腳本}中的簽名操作應允許每個區塊最大構成的數量為（20,000），如下所示：
1. OP_CHECKSIG和OP_CHECKSIGVERIFY計為1個簽名操作。
2. OP_1至OP_16緊隨其後的OP_CHECKMULTISIG和OP_CHECKMULTISIGVERIFY被計為1到16簽名。
3. 所有其他OP_CHECKMULTISIG和OP_CHECKMULTISIGVERIFY都計為20個簽名操作。

Examples:[[script]](https://en.bitcoin.it/wiki/Script)
+3 signature operations:

    {2 [pubkey1] [pubkey2] [pubkey3] 3 OP_CHECKMULTISIG}
    
補充：


| Word| Opcode | Hex | Input |Output |Description |
| -------- | -------- | -------- |-------- | -------- |-------- |
| N/A     | 1-75     | 0x01-0x4b     | (special)     |data     | The next opcode bytes is data to be pushed onto the stack     |


+22 signature operations

    {OP_CHECKSIG OP_IF OP_CHECKSIGVERIFY OP_ELSE OP_CHECKMULTISIGVERIFY OP_ENDIF}







### 原本的交易格式
references: [bitcoin](https://github.com/bitcoin/bitcoin) | [white paper](https://bitcoincore.org/bitcoin.pdf) | [bitcoincore](https://doxygen.bitcoincore.org/index.html)



根據上述的原本交易格式`nVersion`|`txins`|`txouts`|`nLockTime`將交易序列化， 每個 txin 都需要根據其 scriptPubKey 來解鎖，一次解鎖一個txin，要解鎖的txin， 根據要解鎖的txin的 utxo type 可以得出它的 scriptPubKey(在下面會做詳細說明)，將 scriptPubKey 帶入到 解鎖的txin 的 script的位置，其餘txin 的 script 帶 0 (0x00)，再根據 sigHash 決定output的是否全部留下交易裡，還是只留下與簽名輸入具有相同索引編號的一個輸出，還是都不留，double sha256 後用ECDSA 簽名得到 r，s，v 再以DER 排列即為改txin的scriptSig。

```javascript=
version[4 bytes]: 取決於此筆交易的網路[testnet or mainnet]
Txins Count[1+ bytes]: input 數量。
Txins[41+ bytes]： Txins[index].reversedId + Txins[index].vout(in little Endian Buffer)+ script(script.length + ...script)+ sequence.
Txouts Count[1+ bytes]: Output 數量.
Txouts[9+ bytes]:，由交易金額（in little Endian Buffer）及由其目的地(交易對象地址，找零地址或交易訊息note)轉化成的script組成
LockTime： default 0， (in little Endian Buffer)
```
#### 如何的到 txin 的 scriptCode
#### 若果  utxo type 是 pubkeyhash：
```javascript=
scriptPubKey: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
scriptSig: <sig> <pubKey>
```
#### 若果  utxo type 是 pubkey：
```javascript=
scriptPubKey: <pubKey> OP_CHECKSIG
scriptSig: <sig>
```
#### 若果  utxo type 是 scriptHash：
scriptPubKey is redeemScript, value of hash value can defined by receiver
```javascript=
scriptPubKey:  OP_HASH160 [20-byte-hash-value] OP_EQUAL
scriptSig: <sig> <20-byte-key-hash>
```


### Segwit 交易格式

根據[Bip 143](https://en.bitcoin.it/wiki/BIP_0143#Abstract) 所制定的規則

```javascript=
 Double SHA256 of the serialization of:
    1. nVersion of the transaction (4-byte little endian)
    2. hashPrevouts (32-byte hash)
    3. hashSequence (32-byte hash)
    4. outpoint (32-byte hash + 4-byte little endian) 
    5. scriptCode of the input (serialized as scripts inside CTxOuts)
    6. value of the output spent by this input (8-byte little endian)
    7. nSequence of the input (4-byte little endian)
    8. hashOutputs (32-byte hash)
    9. nLocktime of the transaction (4-byte little endian)
   10. sighash type of the signature (4-byte little endian)
```

##### 根據 SIGHASH flag 可以分成幾種情況：
1. ALL：
    * hashPrevouts:
        * [if ANYONECANPAY is set]`is a uint256 of 0x0000......0000 (即長度為32byte值為零的Buffer )`
        * [else] `double SHA256 of the serialization of all input outpoints（outpoint即為txid.reservedId+ vout.in4ByteLittleIndexBuffer）`
    * hashSequence:
        * [if ANYONECANPAY ]`is a uint256 of 0x0000......0000 (即長度為32byte值為零的Buffer )`
        * [else]`hashSequence is the double SHA256 of the serialization of nSequence of all inputs`
    * outpoint: 
        * `outpoint即為要被簽名的utxo 的txid.reservedId+ vout.inLittleIndexBuffer(4 byte)`
    * scriptCode:
        * P2WPKH： < script length > < script >
        `script = OP_DUP OP_HASH160 < PublicKey Hash Length> < PublicKey Hash> OP_EQUALVERIFY OP_CHECKSIG`
        * P2WSH： // TODO
    * value of the output spent by this input:
        * 要被簽名的utxo 的 amount in 8 byte little endian buffer
    * hashOutputs:
        * `is the double SHA256 of the serialization of all output amount (8-byte little endian) with scriptPubKey`
    * sighash type of the signature: (4-byte little endian)

2. NONE：
    * hashPrevouts:
        * 同上
    * hashSequence:
        * `is a uint256 of 0x0000......0000 (即長度為32byte值為零的Buffer )`
    * outpoint:
        * 同上
    * scriptCode:
        * 同上
    * value of the output spent by this input:
        * 同上
    * hashOutputs:
        * `is a uint256 of 0x0000......0000 (即長度為32byte值為零的Buffer )`
    * sighash type of the signature:
        * 同上

3. SINGLE：
    * hashPrevouts:
        * 同上
    * hashSequence:
        * `is a uint256 of 0x0000......0000 (即長度為32byte值為零的Buffer )`
    * outpoint:
        * 同上
    * scriptCode:
        * 同上
    * value of the output spent by this input:
        * 同上
    * hashOutputs:
        * [ input index is smaller than the number of outputs] `is the double SHA256 of the output amount with scriptPubKey of the same index as the input;`
        * [else]`is a uint256 of 0x0000......0000 (即長度為32byte值為零的Buffer )`
    * sighash type of the signature:
        * 同上


將上述data 進行 double sha256 得到 dataHash ，再進行ECDSA數位簽章即可得到signature 的 s,r,v，再根據 DER規則將s,r,v即可得到ScriptSig，最後根據所用的交易格式將script 放置到對應的位置，witness 欄位由兩部份組成<ScriptSig><publicKey>。



### 如何得到Txid
Bitcoin 定義了一個 transaction 的 txID 是整個 transaction 的資料做兩次 sha256 出來的結果，再 BIP141 的出現後，因為把 transaction 的 input script 給移出 transaction 的架構中了，但 txID 的算法仍然保持不變，另外因為 witness 的出現，產生了另一種 transaction ID 去涵蓋 witness program，稱做 wtxID。

txID:         `nVersion`|`txins`|`txouts`|`nLockTime`
wtxID / hash: 
`nVersion`|`marker`|`flag`|`txins`|`txouts`|`nLockTime`|`witness`


### 參考資料補充

https://bitcoincore.org/en/segwit_wallet_dev/


[Segregated Witness Wallet Development Guide
(英文版)](https://bitcoincore.org/en/segwit_wallet_dev/3)
[隔离验证钱包开发指南(中文翻譯)](https://zhuanlan.zhihu.com/p/33617033)


### Faucet

* [most of testnet cryptocurrency's faucet](https://testnet.help/en/dashfaucet/testnet#log)
* [Bitcoin testnet faucet 1](https://tbtc.bitaps.com/)
* [Bitcoin testnet faucet 2](https://coinfaucet.eu/en/btc-testnet/?__cf_chl_jschl_tk__=79a7f0c8b34f7458433e76a799db4339062fc89f-1599016779-0-AdX_EWn0hT7-PRnTLNYuEOab0pq3iUzZeLDTbZxHczOtyoQOhzUpiappDOwPGuZhYMwAvaZjuxhTO5vliL6PoVTDfNXh1CDd3L-tX6P2SkcZ0I4Lukp8peIQiW_OGqI7ST7DSsTwEWUXRNKQKAdvaky4zM0_6uZZLvrRXif4uhi-ARnc3DgySu31FubQiVOqpdBZ6unMuWmTuywuk5CIfUi2pkymogA8x82LBTiUM4B_hxXGYQ8CmFRtK7MFo11JY4GgICh5a3h2pMqt9_ZpijyEwZ8T2Hd3SN1Wdye_art0)
* ~~[Bitcoin Cash testnet faucet](https://developer.bitcoin.com/faucets/bch/)~~
* [BCH Testnet Faucet](https://faucet.fullstack.cash)
* [ETH Ropsten Faucet](https://faucet.dimensions.network/)
* [ETC Mordor Faucet](http://mordor.etherdrip.net/)
* [Litcoin testnet faucet 1](https://tltc.bitaps.com/)
* [Litcoin testnet faucet 2](https://kuttler.eu/en/bitcoin/ltc/faucet/)
* [Doge testnet faucet](https://testnet-faucet.com/doge-testnet/)


