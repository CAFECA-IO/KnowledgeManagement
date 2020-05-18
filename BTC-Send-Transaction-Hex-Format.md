BTC 【Pay to public key hash】交易 Hex 格式

###  Byte-map of a transaction with each type of TxIn and TxOut serialization.

![Image of Yaktocat](https://en.bitcoin.it/w/images/en/e/e1/TxBinaryMap.png)

### Transaction Hex before signed
```
020000000393d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd9810000000000ffffffff7dbd03383a240f27c
7735af707e823da894e11732c5fe5919adff1672b817be00100000000ffffffff7dbd03383a240f27c7735af707e823da894e11732c5f
e5919adff1672b817be00200000000ffffffff0320bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac0
8c60000000000001976a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac0c8c0000000000001976a914481e003d23566c1789
dc9362085c3a0876570c7c88ac00000000
```

### Transaction Hex after signed
```
020000000393d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd981000000006a47304402202769801183cd50e
b2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807d
db299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af
707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d
2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c92
3001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff167
2b817be0020000006a473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef9098838
d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22d
a3c6dc0b28c7ffffffff0320bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac08c6000000000000197
6a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac0c8c0000000000001976a914481e003d23566c1789dc9362085c3a087657
0c7c88ac00000000
```

### Decode Transaction Hex
```
{
    "addresses": [
        "1CGZ4Ry37WHfdQgMzyAnNX6m3QCLbvRSTM",
        "1DjbWPixe2GqH3UATeaMNpScno6REjF71H",
        "17aKbKASav6dj1Uh7i9nqhXnPbu6Y3rDmA"
    ],
    "block_height": -1,
    "block_index": -1,
    "confirmations": 0,
    "double_spend": false,
    "fees": 0,
    "hash": "2109b6873980e425920fd07c844aae8eb7eeeea996a00f89175078f6e385f8b9",
    "inputs": [
        {
            "age": 0,
            "vout": 0,
            "txid": "81d98bb1d434077c800bdcfa66f7b49e07479219ed794e498b97fd021abad393",
            "scriptSig": "47304402202769801183cd50eb2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469",
            "script_type": "empty",
            "sequence": 4294967295
        },
        {
            "age": 0,
            "vout": 1,
            "txid": "e07b812b67f1df9a91e55f2c73114e89da23e807f75a73c7270f243a3803bd7d",
            "scriptSig": "47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469",
            "script_type": "empty",
            "sequence": 4294967295
        },
        {
            "age": 0,
            "vout": 2,
            "txid": "e07b812b67f1df9a91e55f2c73114e89da23e807f75a73c7270f243a3803bd7d",
            "scriptSig": "473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef9098838d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22da3c6dc0b28c7",
            "script_type": "empty",
            "sequence": 4294967295
        }
    ],
    "outputs": [
        {
            "addresses": [
                "1CGZ4Ry37WHfdQgMzyAnNX6m3QCLbvRSTM"
            ],
            "scriptPubKey": "76a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac",
            "script_type": "pay-to-pubkey-hash",
            "value": 180000
        },
        {
            "addresses": [
                "1DjbWPixe2GqH3UATeaMNpScno6REjF71H"
            ],
            "scriptPubKey": "76a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac",
            "script_type": "pay-to-pubkey-hash",
            "value": 50696
        },
        {
            "addresses": [
                "17aKbKASav6dj1Uh7i9nqhXnPbu6Y3rDmA"
            ],
            "scriptPubKey": "76a914481e003d23566c1789dc9362085c3a0876570c7c88ac",
            "script_type": "pay-to-pubkey-hash",
            "value": 35852
        }
    ],
    "preference": "low",
    "received": "2020-05-13T08:36:41.702871659Z",
    "relayed_by": "54.152.208.149",
    "size": 553,
    "total": 266548,
    "ver": 2,
    "vin_sz": 3,
    "vout_sz": 3
}
```

#### 版本號 4 bytes
> Transaction version number (note, this is signed); currently version 1 or 2. Programs creating transactions using newer consensus rules may use higher version numbers. Version 2 means that BIP 68 applies.

**02000000**0393d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd981000000006a47304402202769801183cd50eb2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0020000006a473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef9098838d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22da3c6dc0b28c7ffffffff0320bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac08c60000000000001976a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac0c8c0000000000001976a914481e003d23566c1789dc9362085c3a0876570c7c88ac00000000

#### Input 數量
02000000**03**93d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd981000000006a47304402202769801183cd50eb2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0020000006a473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef9098838d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22da3c6dc0b28c7ffffffff0320bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac08c60000000000001976a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac0c8c0000000000001976a914481e003d23566c1789dc9362085c3a0876570c7c88ac00000000

### Inputs
0200000003**93d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd981000000006a47304402202769801183cd50eb2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff**
**7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff**
**7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0020000006a473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef9098838d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22da3c6dc0b28c7ffffffff**0320bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac08c60000000000001976a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac0c8c0000000000001976a914481e003d23566c1789dc9362085c3a0876570c7c88ac00000000

以第二個Inputs為例
```
7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff
```
##### txid 以反向位元組順序序列化
**7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0**010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff

##### 輸出索引（ vout ），標識使用來自該交易的哪個UTXO（第一個從0開始）4 bytes (同樣是反向位元組順序序列化)
7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0**01000000**6a47304402202769801183cd50eb2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff

##### script Signature 長度 106 bytes
> The number of bytes in the signature script. Maximum is 10,000 bytes.

7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be001000000**6a**47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff

##### script Signature 
> A script-language script which satisfies the conditions placed in the outpoint’s pubkey script. Should only contain data pushes

7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a**47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469**ffffffff


**Pay-to-Script-Hash transaction**
```
scriptSig: ..signatures... <serialized script>
```

**Pay-to-Script-Hash m-of-n multi-signature transaction:**
```
scriptSig: 0 <sig1> ... <script>
```
**pay-to-pubkey transaction**
```
scriptSig: <sig>
```

**Pay-to-PubkeyHash transaction 可以分為兩部份**
```
scriptSig: <sig> <pubKey>
```

1.  簽名的序列化 (DER)
```
47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a27290901
```
> **簽名的序列化 (DER)**

> 0x47 ..................................... Push 71 bytes as data

> 0x30 —— 標識 DER 序列的開始

> 0x44 —— 序列長度 (68 bytes)

> 0x02 —— 接下來是一個整數

> 0x20 —— 整數的長度 (32 bytes)

> R —— 4a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2
     
> 0x02 —— 接下來是另一個整數

> 0x20 —— 另一個整數的長度 (32 bytes)

> S —— 47a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909

> 0x01 —— 一個後綴標識使用的雜湊類型 (SIGHASH_ALL)

2. Public Key (對應signature Key 的公鑰，可以是也可以不是compressedKey )

```
2102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469
```

> 0x21 —— 序列長度 (33 byte)

> 02275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469 —— compressed PublicKey


**Compressed Key**

> A compressed key is just a way of storing a public key in fewer bytes (33 instead of 65). There are no compatibility or security issues because they are precisely the same keys, just stored in a different way.

```
Uint8List compressedPubKey(List<int> uncompressedPubKey) {
  if (uncompressedPubKey.length % 2 == 1) {
    uncompressedPubKey = uncompressedPubKey.sublist(1, uncompressedPubKey.length);
  }
  
  List<int> x = uncompressedPubKey.sublist(0, 32);
  List<int> y = uncompressedPubKey.sublist(32, 64);
  BigInt p = BigInt.parse(
      ‘fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f’,
      radix: 16);

  BigInt xInt = BigInt.parse(hex.encode(x), radix: 16);
  BigInt yInt = BigInt.parse(hex.encode(y), radix: 16);
  BigInt check = (xInt.pow(3) + BigInt.from(7) - yInt.pow(2)) % p;
 
  if (check == BigInt.zero) {
    List<int> prefix =
        BigInt.parse(hex.encode(y), radix: 16).isEven ? [0x02] : [0x03];
    return Uint8List.fromList(prefix + x);
  }
}
```

##### 序列號設置為 FFFFFFFF
> Sequence number. Default for Bitcoin Core and almost all other programs is 0xffffffff.

7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469**ffffffff**

#### Outputs 數量
020000000393d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd981000000006a47304402202769801183cd50eb2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0020000006a473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef9098838d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22da3c6dc0b28c7ffffffff**03**20bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac08c60000000000001976a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac0c8c0000000000001976a914481e003d23566c1789dc9362085c3a0876570c7c88ac00000000

#### Output locktime 4 bytes
> A time (Unix epoch time) or block number. See the locktime parsing rules.

020000000393d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd981000000006a47304402202769801183cd50eb2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0020000006a473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef9098838d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22da3c6dc0b28c7ffffffff0320bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac08c60000000000001976a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac0c8c0000000000001976a914481e003d23566c1789dc9362085c3a0876570c7c88ac**00000000**

#### Outputs
020000000393d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd981000000006a47304402202769801183cd50eb2bd6c316a55add49fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0020000006a473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef9098838d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22da3c6dc0b28c7ffffffff03**20bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac**
**08c60000000000001976a9148bafc8dad0c87025278b4cc1c80ac8d402cb59eb88ac**
**0c8c0000000000001976a914481e003d23566c1789dc9362085c3a0876570c7c88ac**00000000

突出顯示的部分有三個輸出，每個輸出按照 Transaction output serialization 所示進行了序列化。


以第一個Outputs為例
```
20bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac
```
##### Output amount 8 位元組(小端序） 以聰（satoshis = 10^-8 bitcoin) 為單位的比特幣價值
> 在序列化的交易中,以小端序（低位位元組在前）編碼

**20bf020000000000**1976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac

<00 00 00 00 00 02 bf 20> == 180000 satoshis

##### Output 1——9 位元組 (VarInt) 後面的鎖定腳本的位元組數
20bf020000000000**19**76a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac

##### Output scriptPubKey 
20bf02000000000019**76a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac**

> 76a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac

> is equal to

> OP_DUP OP_HASH160 OP_PUSHBYTES_20 7b9a627a184897f10d31d73d87c2eea191d8f501 OP_EQUALVERIFY OP_CHECKSIG

**76a914**7b9a627a184897f10d31d73d87c2eea191d8f501**88ac**

| | 76 ..................................... OP_DUP

| | a9 ..................................... OP_HASH160

| | 14 ..................................... OP_PUSHBYTES_20

| | 88 ..................................... OP_EQUALVERIFY

| | ac ..................................... OP_CHECKSIG

76a914**7b9a627a184897f10d31d73d87c2eea191d8f501**88ac

| | 7b9a627a184897f10d31d73d87c2eea191d8f501 ..................................... PubKey hash


**Get PubKey hash from receiver bitcoin address**
```
base58 decode receiver address, then remove the first byte of prefix, finally according to scriptPubKey prefix 0x14 only take 20 byte of PubKey hash.

For example: 
receiver address: 1CGZ4Ry37WHfdQgMzyAnNX6m3QCLbvRSTM
base58 decode receiver address: 007B9A627A184897F10D31D73D87C2EEA191D8F501BF4B030C
remove prefix 0x00: 7B9A627A184897F10D31D73D87C2EEA191D8F501BF4B030C
    - 0x00 for P2PKH addresses on the main Bitcoin network (mainnet)
    - 0x6f for P2PKH addresses on the Bitcoin testing network (testnet)
    - 0x05 for P2SH addresses on mainnet
    - 0xc4 for P2SH addresses on testnet
take 20 byte of PubKey : 7B9A627A184897F10D31D73D87C2EEA191D8F501B

```
Online base58 encoder/decoder [http://lenschulwitz.com/base58]

**Get PubKey hash from receiver bitcoin public key**
```
1. PubKey hash = RIPEMD-160(SHA256(uncompressed public key [64 bytes])) [20 bytes]
```

Here’s a full list of Opcodes: [https://en.bitcoin.it/wiki/Script#Opcodes].

```
Warning icon Signature script modification warning: Signature scripts are not signed, so anyone can modify them. This means signature scripts should only contain data and data-pushing opcodes which can’t be modified without causing the pubkey script to fail. Placing non-data-pushing opcodes in the signature script currently makes a transaction non-standard, and future consensus rules may forbid such transactions altogether. (Non-data-pushing opcodes are already forbidden in signature scripts when spending a P2SH pubkey script.)

```
#### 有用的連結 🔗

Bitcoin 有用的參考文件
BIP0143 wiki: [https://en.bitcoin.it/wiki/BIP_0143#Abstract]

BIP0143 github: [https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki]

[https://bitcoin.org/en/developer-reference#serialized-blocks]

[https://en.bitcoin.it/wiki/Transaction#Input]

[https://learnmeabitcoin.com/guide/script]

[https://cypherpunks-core.github.io/bitcoinbook_2nd_zh/]

testnet txid detail
[https://blockstream.info/testnet/tx/c8cb07b095ada727b31b5adaaf5b44094f618657af432f4474cee5447c6b612e?expand]

online hash
[https://modulovalue.com/bird_cryptography/#/]

0nline base58 encoder & decoder
[http://lenschulwitz.com/base58]

Online transaction hex Decoder
[https://live.blockcypher.com/btc/decodetx/]
