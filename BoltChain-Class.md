```js
TxinTemplate() {
	set txID: string;
	set index: number;
	set sequence: bigNumber;
	set hashType: number;

	addresses: string[];
	value: bigNumber;
	scriptType: string;
	script: string

	get toJson();

}
```
```js
TxoutTemplate() {
	set addresses: string[];
	set script: string;
	set value: bigNumber;

	scriptType: string;

	get toJson();
}
```
```js
txoutScript(pubKey, type) {
	p2pkh(pubKey);
	p2wpkh(pubKey);
	p2sh-p2wpkh(pubKey);
}
```
```js
witness() {
	scriptSig: string;
	pubKey: string;
}
```
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
