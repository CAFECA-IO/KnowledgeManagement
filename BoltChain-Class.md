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
}
```
```js
TxoutTemplate() {
	set addresses: string[];
	set script: string;
	set value: bigNumber;

	scriptType: string;
}
```
```js
Transaction class() {
	txins: TxinTemplate[];
	txouts: TxoutTemplate[];
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