# BTC Transaction

## Get BTC Transaction Fee

```javascript
async getBTCFee() {
    try {
      const url = `https://api.blockcypher.com/v1/btc/${this.networkType}`;
      const response = await axios.get(url);
      if (!response && !response.data) throw new CodeError({ message: `remote api error(${response.data.message})`, code: Code.REMOTE_API_ERROR });
      return Promise.resolve({
        success: true,
        message: 'success',
        data: {
          high: response.data.high_fee_per_kb,
          medium: response.data.medium_fee_per_kb,
          low: response.data.low_fee_per_kb,
        },
        code: Code.SUCCESS,
      });
    } catch (e) {
      if (!Object.prototype.hasOwnProperty.call(e, 'success')) {
        this.logger.trace(`GetUserAddress server error(${e.message})`);
        return Promise.resolve({
          success: false,
          message: `server error(${e.message})`,
          data: {},
          code: Code.SERVER_ERROR,
        });
      }
      throw e;
    }
  }
```

## get unspent UTXO

```javascript
async getUTXOs(address, beforeBlock = '') {
    let beforeCondition = '';
    if (beforeBlock) beforeCondition = `&before=${beforeBlock}`;
    const url = `https://api.blockcypher.com/v1/btc/${this.networkType}/addrs/${address}?unspentOnly=true${beforeCondition}`;
    console.log('url:', url);

    const response = await axios.get(url);
    if (response && response.data && response.data.txrefs) return response.data.txrefs;
    return [];
  }
```

## get rawTransaction, merge in UTXO list

```javascript
async pushUTXOsTXHash({ utxos, address, beforeBlock = '' }) {
  const addressInfos = await this.getAddressTXsInfo(address, beforeBlock);
  utxos.forEach((item, index) => {
    const findAddressInfo = addressInfos.filter((element) => element.hash === item.tx_hash);
    if (findAddressInfo.length > 0)utxos[index].hex = findAddressInfo[0].hex;
  });
  return utxos;
}
```

## create wallet

```javascript
const bip39 = require('bip39');

const mnemonic = bip39.generateMnemonic();
const parse = 'test parse'
const seed = await bip39.mnemonicToSeed(mnemonic, parse)
const root = bip32.fromSeed(seed);
const child1 = root.derivePath("m/44'/0'/0'/0/0");
const privateKey = child1.privateKey
const publicKey = child1.publicKey
```

## make transaction and sign

```javascript
// 參考 bitcoinjs-lib 函式庫中的 transactions.spec.ts 中的
// 'can create (and broadcast via 3PBP) a Transaction, w/ a P2WPKH input using HD'

const walletPath = "m/44'/0'/0'/0/0";
const walletNode = this.hdWallet.derivePath(walletPath);
const walletNodeAddress = this.getAddress(walletNode, this.network);
const walletAddressUnspentUTXOs = await this.getUTXOs(walletNodeAddress);  // contain two UTXO
const changeAddressUnspentUTXODetails = await this.pushUTXOsTXHash({ utxos: walletAddressUnspentUTXOs, address: walletNodeAddress });
for (let j = 0; j < walletAddressUnspentUTXOs.length - 1 && toValue.isGreaterThan(count); j++) {
  walletAddressUnspentUTXOs[j].walletPath = walletPath;
}

const amountWeHave = 100000; // 0.001  BTC
const amountToKeep = 90000; // 0.0008 BTC
const transactionFee = 3967; // 0.00003967 BTC
const amountToSend = amountWeHave - amountToKeep - transactionFee;

// format transaction
const psbt = new bitcoin.Psbt({ network: this.network });

changeAddressUnspentUTXODetails.forEach((item, index) => {
  const inputData = {
    hash: item.tx_hash,
    index,
    nonWitnessUtxo: Buffer.from(item.hex, 'hex'),
  };

  const childNode = this.hdWallet.derivePath(item.walletPath);
  const pubkey = childNode.publicKey;

  const updateData = {
    bip32Derivation: [
      {
        masterFingerprint,
        path: item.walletPath,
        pubkey,
      },
    ],
  };

  Object.assign(inputData, updateData);
  psbt.addInput(inputData);
});

psbt.addOutput({
  address: 'n4gKJ9ZuWEjF8m6caLMqa1KxDXYPd1qMYH',
  value: amountToKeep,
});
psbt.addOutput({
  address: '2N8SfJFp45LBMW3fJX8anZP5nqb9FXqxyq1',
  value: amountToSend,
});

// ERROR: Can not sign for this input with the key 02bfc507b2ef651ebb6f37cfe56305bb64e3dc2d1382612ac0f4078cc6442291ae
inputUTXOs.forEach((item, index) => {
  psbt.signInputHD(index, this.hdWallet);
});

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
console.log('hex:', psbt.extractTransaction().toHex());
```

# Reference
- [Transaction Decode](https://live.blockcypher.com/btc/decodetx/)
- [Mastering Bitcoin](https://cypherpunks-core.github.io/bitcoinbook_2nd_zh/)
