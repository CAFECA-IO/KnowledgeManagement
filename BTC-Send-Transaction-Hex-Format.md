BTC 【Pay to public key hash】交易 Hex 格式

### Transaction Hex after signed
```
020000000393d3ba1a02fd978b494e79ed199247079eb4f766fadc0b807c0734d4b18bd981000000006a47304402202769801183cd50eb2bd6c316a55add49
fa4c0fd7216b523f394b97fe410b582d02205c76f4009b38b82a20f88b5f6af45f09220ba43d7e1c2064fa74807ddb299d7f012102275753690ab58df3c923
001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da894e11732c5fe5919adff1672b817be0010000006a
47304402204a24a1de4b4e552d1f53121825d139b1d1739d149df5a01d2ead760b865635c2022047a9b8f4d29dac29e9eacff6aea67249dcf716d576a00dbe
24cf92c34a272909012102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469ffffffff7dbd03383a240f27c7735af707e823da
894e11732c5fe5919adff1672b817be0020000006a473044022057a3fa58744fffebcb8a1bea4a99bd61049678d4ee9250c5f66ea17198ebd97a022078abef
9098838d06e9a51099ce010f0dc74c6b1284de03a929bcdabab8fd4cd40121039299b5f32a4834e27662397b7ade9cacdd9cd7243b83c039c22da3c6dc0b28
c7ffffffff0320bf0200000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac08c60000000000001976a9148bafc8dad0c87025278b4c
c1c80ac8d402cb59eb88ac0c8c0000000000001976a914481e003d23566c1789dc9362085c3a0876570c7c88ac00000000
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

script Signature 可以分為兩部份
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

> 2102275753690ab58df3c923001e94d407e30b03e60b1f2461729a1dd4f37ebe2469 —— compressed PublicKey


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
**20bf0200**000000001976a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac
<00 02 bf 20> == 180000 satoshis

##### Output 1——9 位元組 (VarInt) 後面的鎖定腳本的位元組數
20bf0200**0000000019**76a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac

##### Output scriptPubKey (應該可以從block上得到？)
20bf02000000000019**76a9147b9a627a184897f10d31d73d87c2eea191d8f50188ac**

**76a914**7b9a627a184897f10d31d73d87c2eea191d8f501**88ac**

| | 76 ..................................... OP_DUP

| | a9 ..................................... OP_HASH160

| | 14 ..................................... Push 20 bytes as data

| | 88 ..................................... OP_EQUALVERIFY

| | ac ..................................... OP_CHECKSIG

76a914**7b9a627a184897f10d31d73d87c2eea191d8f501**88ac

| | 7b9a627a184897f10d31d73d87c2eea191d8f501 ..................................... PubKey hash

```
Warning icon Signature script modification warning: Signature scripts are not signed, so anyone can modify them. This means signature scripts should only contain data and data-pushing opcodes which can’t be modified without causing the pubkey script to fail. Placing non-data-pushing opcodes in the signature script currently makes a transaction non-standard, and future consensus rules may forbid such transactions altogether. (Non-data-pushing opcodes are already forbidden in signature scripts when spending a P2SH pubkey script.)

```

#### OpCodes

The opcodes used in the pubkey scripts of standard transactions are:

* Various data pushing opcodes from 0x00 to 0x4e (1--78). These aren't
  typically shown in examples, but they must be used to push
  signatures and public keys onto the stack. See the link below this list
  for a description.

* `OP_TRUE`/`OP_1` (0x51) and `OP_2` through `OP_16` (0x52--0x60), which
  push the values 1 through 16 to the stack.

* [`OP_CHECKSIG`][op_checksig]{:#term-op-checksig}{:.term} consumes a signature and a full public key, and pushes
  true onto the stack if the transaction data specified by the SIGHASH flag was
  converted into the signature using the same ECDSA private key that
  generated the public key.  Otherwise, it pushes false onto the stack.

* [`OP_DUP`][op_dup]{:#term-op-dup}{:.term} pushes a copy of the topmost stack item on to the stack.

* [`OP_HASH160`][op_hash160]{:#term-op-hash160}{:.term} consumes the topmost item on the stack,
  computes the RIPEMD160(SHA256()) hash of that item, and pushes that hash onto the stack.

* [`OP_EQUAL`][op_equal]{:#term-op-equal}{:.term} consumes the top two items on the stack, compares them, and
  pushes true onto the stack if they are the same, false if not.

* [`OP_VERIFY`][op_verify]{:#term-op-verify}{:.term} consumes the topmost item on the stack.
  If that item is zero (false) it terminates the script in failure.

* [`OP_EQUALVERIFY`][op_equalverify]{:#term-op-equalverify}{:.term} runs `OP_EQUAL` and then `OP_VERIFY` in sequence.

* [`OP_CHECKMULTISIG`][op_checkmultisig]{:#term-op-checkmultisig}{:.term} consumes the value (n) at the top of the stack,
  consumes that many of the next stack levels (public keys), consumes
  the value (m) now at the top of the stack, and consumes that many of
  the next values (signatures) plus one extra value.

    The "one extra value" it consumes is the result of an off-by-one
    error in the Bitcoin Core implementation. This value is not used, so
    signature scripts prefix the list of secp256k1 signatures with a
    single OP_0 (0x00).

    `OP_CHECKMULTISIG` compares the first signature against each public
    key until it finds an ECDSA match. Starting with the subsequent
    public key, it compares the second signature against each remaining
    public key until it finds an ECDSA match. The process is repeated
    until all signatures have been checked or not enough public keys
    remain to produce a successful result.

    Because public keys are not checked again if they fail any signature
    comparison, signatures must be placed in the signature script using
    the same order as their corresponding public keys were placed in
    the pubkey script or redeem script. See the `OP_CHECKMULTISIG` warning
    below for more details.

* [`OP_RETURN`][op_return]{:#term-op-return}{:.term} terminates the script in failure when executed.

A complete list of opcodes can be found on the Bitcoin Wiki [Script
Page][wiki script], with an authoritative list in the `opcodetype` enum
of the Bitcoin Core [script header file][core script.h]
