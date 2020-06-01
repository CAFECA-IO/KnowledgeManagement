```js
TxinTemplate() {
	set txID: string;
	set index: number;
	set sequence: hex number;
	set hashType: hex number;

	addresses: string[];
	value: bigNumber;
	scriptType: string;
	script: string
}
```
ex:
```js
{
	txID: 'f506e4819b080c4ad63ee52465cab0b0d3f7ef8bf5d19be13a2b22f3948acc1b',
	index: 0,
	sequence: 0xFFFFFFFF,
	hashType: 0x01,

	// 以下根據txID與index取得
	addresses: [
		'micdGEHEB6iC5Nus352GRPGH3JSov2UKQy',
	],
	value: 10000,
	script: '76a91421fafc89027872036072ba1d82271810b040713b88ac',
	scriptType: 'p2pkh',
}
```
---

```js
TxoutTemplate() {
	set addresses: string[];
	set value: bigNumber;
	set type: string;
	
	script: txoutScript(pubKey, type);
}
```
ex:
```js
{
	addresses: [
		micdGEHEB6iC5Nus352GRPGH3JSov2UKQy,
	],
	script: '76a91421fafc89027872036072ba1d82271810b040713b88ac',
	value: 27000,
	type: 'p2pkh'
}
```
---

```js
txoutScript(addresses, type) {
	p2pkh(addresses);
	p2wpkh(addresses);
	p2sh-p2wpkh(addresses);
}
```
ex:
```js
```

---
```js
witness() {
	scriptSig: string;
	pubKey: string;
}
```
ex:
```js

```

---
```js
Transaction class() {
	from;
	to;
	data: jsonObject;
	fee: bigNumber;

	get txHash;

	/*
	* for btc
	* unsignData根據txins順序與交易格式產出要被簽名hash的array
	* unsignData有個switch來呼叫p2pkh, p2wpkh, p2sh-p2wpkh class產出對應的hash
	* 每個class根據自己收到的(object? rawtx?)，根據自己的規則產出hash
	*
	* for eth
	* 回傳 rawTransaction
	*/
	get unsignedData();

	/*
	* for btc
	* setScriptSig收到的格式會像[ { r: '', s:'' }, { r: '', s:'' }, ...]
	* 組合出scriptSig[]
	* 檢查是不是segwit的格式來決定要塞到witnesses[]還是各自txins的scriptSig
	*/
	set setScriptSig();

	get toRaw();
}
```
---
```js
BtcTransaction() : Transaction {
	from: TxinTemplate[];
	to: TxoutTemplate[];
	witnesses: witness[];
	data: jsonObject;
	fee: bigNumber;
	version: number;
	flag: number;

	get txID;
	get txHash;

	/*
	* unsignData根據txins順序與交易格式產出要被簽名hash的array
	* unsignData有個switch來呼叫p2pkh, p2wpkh, p2sh-p2wpkh class產出對應的hash
	* 每個class根據自己收到的(object? rawtx?)，根據自己的規則產出hash
	*/
	get unsignedData();

	/*
	* setScriptSig收到的格式會像[ { r: '', s:'' }, { r: '', s:'' }, ...]
	* 組合出scriptSig[]
	* 檢查是不是segwit的格式來決定要塞到witnesses[]還是各自txins的scriptSig
	*/
	set setScriptSig();

	get toRaw();
}
```
---
```js
EthTransaction() : Transaction {
	from: string;
	to: string;
	data: jsonObject;
	fee: bigNumber;
	assetID: string;

	nonce: string;
	metadataHash: string;

	get txHash;
	
	/*
	* for eth
	* 回傳 rawTransaction
	*/
	get unsignedData();

	/*
	* for btc
	* setScriptSig收到的格式會像[ { r: '', s:'' }, { r: '', s:'' }, ...]
	* 組合出scriptSig[]
	* 檢查是不是segwit的格式來決定要塞到witnesses[]還是各自txins的scriptSig
	*/
	set setScriptSig();

	get toRaw();
}
```
