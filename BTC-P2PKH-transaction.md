# P2PKH transaction

Transaction ID:
```
0d39ec39055c9ee3f7af5339dcbfe11700fc6996044ba6e3e7a20007aa51ea97
```

## Make Transaction step by step
- [example code](./file/btc-transaction)
部分參數是寫死的，需要再做調整。

### Prepare
- private key:
```javascript
const privKey = Buffer.from(
  '',
  'hex',
);
```

- public key:
```javascript
const pubKey = Buffer.from(secp256k1.publicKeyCreate(privKey));
```

### 1. create base tx
```javascript
const tx = {
  version: 2, locktime: 0, vins: [], vouts: [],
};
```

### 2. add inputs
建立3個inputs來辨識每個簽名所需要的transaction
```javascript
tx.vins.push({
  txid: Buffer('98861b26306bdf71bfdb07b20bd12ed72fc34e2f6ad8a3a92192037c2dc07c9e', 'hex'),
  vout: 1,
  hash: Buffer('98861b26306bdf71bfdb07b20bd12ed72fc34e2f6ad8a3a92192037c2dc07c9e', 'hex').reverse(),
  sequence: 0xffffffff,
  script: p2pkhScript(hash160(pubKey)),
  scriptSig: null,
});
```
```javascript
tx.vins.push({
  txid: Buffer('36766e1fde2e2fb2c4a311152b17370fd9ddfa06dd491fbd25ae6ea01746d239', 'hex'),
  vout: 1,
  hash: Buffer('36766e1fde2e2fb2c4a311152b17370fd9ddfa06dd491fbd25ae6ea01746d239', 'hex').reverse(),
  sequence: 0xffffffff,
  script: p2pkhScript(hash160(pubKey)),
  scriptSig: null,
});
```
```javascript
tx.vins.push({
  txid: Buffer('f506e4819b080c4ad63ee52465cab0b0d3f7ef8bf5d19be13a2b22f3948acc1b', 'hex'),
  vout: 1,
  hash: Buffer('f506e4819b080c4ad63ee52465cab0b0d3f7ef8bf5d19be13a2b22f3948acc1b', 'hex').reverse(),
  sequence: 0xffffffff,
  script: p2pkhScript(hash160(pubKey)),
  scriptSig: null,
});
```
- txid: 要使用的UTXO的transaction ID
- vout: txid 裡 vout 的 index
- hash: txid reverse
- sequence: 可以隨便帶，通常是0xffffffff
- script: txid 裡 vout 的script
- scriptSig: 還沒簽名所以沒有

```
{
  txid: (Buffer, hex),
  vout: (int),
  hash: (Buffer, 'hex').reverse(),
  sequence: (hex, 4 bytes),
  script: (base on txid vout),
  scriptSig: null,
};

```

### 3. add output for new address
```javascript
tx.vouts.push({
  script: p2pkhScript(fromBase58Check('mqF1Ak5Zd3v181oi5NQ97PZyA1ayej4DGf').hash),
  value: 100,
});
```

### 4. add output for change address
```javascript
tx.vouts.push({
  script: p2pkhScript(hash160(pubKey)),
  value: 27000,
});
```

### 5. now that tx is ready, sign and create script sig
將簽名後的結果替換掉vin.script
```javascript
for (let i = 0; i < tx.vins.length; i++) {
  tx.vins[i].scriptSig = p2pkhScriptSig(signp2pkh(tx, i, privKey, 0x1), pubKey);
}
```
#### 簽名的 transaction hash 製作

##### 1. 複製一份現有的transaction
```javascript
const clone = cloneTx(tx);
```

##### 2. 清除要簽名的 input 的 script
```javascript
const filteredPrevOutScript = clone.vins[vindex].script.filter((op) => op !== OPS.OP_CODESEPARATOR);
clone.vins[vindex].script = filteredPrevOutScript;
```

##### 3. 其他不是要簽名的 inputs script 補 0
```javascript
for (let i = 0; i < clone.vins.length; i++) {
  if (i === vindex) continue;
  clone.vins[i].script = Buffer.alloc(0);
}
```

##### 4. 存入 buffer
```javascript
let buffer = txToBuffer(clone);
```

##### 5. 尾端補上 hash type
```javascript
buffer = Buffer.alloc(buffer.length + 4, buffer);
```

此時的 raw transaction 分別長這樣
```
{
  // vin[0]
  02000000039e7cc02d7c039221a9a3d86a2f4ec32fd72ed10bb207dbbf71df6b30261b8698010000001976a91421fafc89027872036072ba1d82271810b040713b88acffffffff39d24617a06eae25bd1f49dd06faddd90f37172b1511a3c4b22f2ede1f6e76360100000000ffffffff1bcc8a94f3222b3ae19bd1f58beff7d3b0b0ca6524e53ed64a0c089b81e406f50100000000ffffffff0264000000000000001976a9146aad0062d403b7b5a417e608b20b45a7e5a210e988ac78690000000000001976a91421fafc89027872036072ba1d82271810b040713b88ac0000000001000000

  // vin[1]
  02000000039e7cc02d7c039221a9a3d86a2f4ec32fd72ed10bb207dbbf71df6b30261b86980100000000ffffffff39d24617a06eae25bd1f49dd06faddd90f37172b1511a3c4b22f2ede1f6e7636010000001976a91421fafc89027872036072ba1d82271810b040713b88acffffffff1bcc8a94f3222b3ae19bd1f58beff7d3b0b0ca6524e53ed64a0c089b81e406f50100000000ffffffff0264000000000000001976a9146aad0062d403b7b5a417e608b20b45a7e5a210e988ac78690000000000001976a91421fafc89027872036072ba1d82271810b040713b88ac0000000001000000

  // vin[2]
  02000000039e7cc02d7c039221a9a3d86a2f4ec32fd72ed10bb207dbbf71df6b30261b86980100000000ffffffff39d24617a06eae25bd1f49dd06faddd90f37172b1511a3c4b22f2ede1f6e76360100000000ffffffff1bcc8a94f3222b3ae19bd1f58beff7d3b0b0ca6524e53ed64a0c089b81e406f5010000001976a91421fafc89027872036072ba1d82271810b040713b88acffffffff0264000000000000001976a9146aad0062d403b7b5a417e608b20b45a7e5a210e988ac78690000000000001976a91421fafc89027872036072ba1d82271810b040713b88ac0000000001000000
}
```

##### 6. double-sha256
```javascript
const hash = sha256(sha256(buffer));
```

此時每個 hash
```
  // vin[0]
  7f775c7951d1836f50e073eb743ceb59367139059245cba2027aaf6766a2fb37
  
  // vin[1]
  adc905dd57b6aff0d298eb2bf9893cb143096cb22981550c8eadcc59a67ca9cd
  
  // vin[2]
  c0234706bbf4bde686b8b1b8c7ea9bfe583e3832ad4d2bd8583832ed3ea72c3d
```

##### 7. sign input
```javascript
const sig = secp256k1.ecdsaSign(hash, privKey);
```

### 最後的 raw transaction
```
02000000039e7cc02d7c039221a9a3d86a2f4ec32fd72ed10bb207dbbf71df6b30261b8698010000006a47304402201319297575c1f9e7151f51a2740c68463e8fd427d45347f098992f9cb9f7cb3802205dff79ea44f41721edbe98b86c0198e5318a8f860d99356d505e48e8902f23660121025304b56dc81a65d5513b0ff6a33651433735ecb5066f9d58a8902cb1a056459cffffffff39d24617a06eae25bd1f49dd06faddd90f37172b1511a3c4b22f2ede1f6e7636010000006b48304502210081e883453bf3c68a43a3a6905ecf8b3398215d7ee7ac239eac6b2d3e183128190220028a232419e70b0ea0c0862261f66e44d1b221e7936625e911e7d27102a1e0820121025304b56dc81a65d5513b0ff6a33651433735ecb5066f9d58a8902cb1a056459cffffffff1bcc8a94f3222b3ae19bd1f58beff7d3b0b0ca6524e53ed64a0c089b81e406f5010000006a4730440220645ac5f96ab95244df439ffbd5e82bfc50a6dad553bc93a3708172f0a4c8c795022026742fb4c88696e0cce687a6da67b66599a7b1964ea2de218942cc83ff8902160121025304b56dc81a65d5513b0ff6a33651433735ecb5066f9d58a8902cb1a056459cffffffff0264000000000000001976a9146aad0062d403b7b5a417e608b20b45a7e5a210e988ac78690000000000001976a91421fafc89027872036072ba1d82271810b040713b88ac00000000
```

## Reference
- [Bitcoin P2PKH Transaction Building with Node.js](http://derpturkey.com/bitcoin-p2pkh-exploration/)
