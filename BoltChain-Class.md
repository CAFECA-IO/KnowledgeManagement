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
	set script: string;
	set value: bigNumber;
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
}
```
---

```js
txoutScript(pubKey, type) {
	p2pkh(pubKey);
	p2wpkh(pubKey);
	p2sh-p2wpkh(pubKey);
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
	txins: TxinTemplate[];
	txouts: TxoutTemplate[];
	witnesses: witness[];
	data: jsonObject;
	fee: bigNumber;
	size: number;
	version: number;

	get txID;
	get txHash;

	get toJson();
	get toRaw();
}
```

