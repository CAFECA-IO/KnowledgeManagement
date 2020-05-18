# BTC 交易比對表

## P2SH-P2WPKH

```javascript
const bs58check = require('bs58check');


const utxo_txid = '30a68e29b9dd29fe6986536114ae4129c667cde404e5384359107554a4734fba'

const outputAddress = '2N8SfJFp45LBMW3fJX8anZP5nqb9FXqxyq1'
const payload = bs58check.decode(outputAddress);
const redeemScript = Buffer.from(`a914${payload.toString('hex').substr(2)}87`, 'hex')

let rawTX = ''
// version
rawTX += '02000000'
// Flag

// Input Count
rawTX += '01'
// Input 1 Previous Output Hash
rawTX += new Buffer(utxo_txid, 'hex').reverse().toString('hex')
// Input 1 Previous Output Index:
rawTX +=  '00000000'
// Input 1 script length: 00 (empty for now)
rawTX += '00'
// Input 1 scriptSig:

// Input 1 sequence: 
rawTX += 'ffffffff'
// Output Count:
rawTX += '01'
// Output 1 Value: 0.00090000
rawTX += '8038010000000000'
// Output 1 public key script length:
rawTX += '17'
// Output 2 public key script:
rawTX += redeemScript.toString('hex')
// Locktime
rawTX += '00000000'

console.log('rawTX:', rawTX);
```

unsign rawTransaction: `0200000001ba4f73a4547510594338e504e4cd67c62941ae1461538669fe29ddb9298ea6300000000000ffffffff01803801000000000017a914a6b39706de2d740f756213f0d59978ed5e70d9fb8700000000`

sign rawTransaction: `0200000001ba4f73a4547510594338e504e4cd67c62941ae1461538669fe29ddb9298ea630000000006a473044022008002dc411142a575abf845dc682838625cab7b7fc1414029a483872c745cee9022017dfdeff384f7273de5844526d2a432c5bbaf3e64d9ad3242b99ed4b4381e61a012102bfc507b2ef651ebb6f37cfe56305bb64e3dc2d1382612ac0f4078cc6442291aeffffffff01803801000000000017a914a6b39706de2d740f756213f0d59978ed5e70d9fb8700000000`

explore: https://blockstream.info/testnet/tx/ec6e8453422d6c1f680b888bb6f93b8f755676af353fa4119f500a5ab98d7f86
