# Ethereum transaction

### 一般交易由以下幾個部分組成
```javascript=
From
To
Amount
Fee
Note
```

### Ethereum 的交易由以下幾個部份組成

```javascript=
nonce
From
To
Amount
gasPrice
gasUsed/gasLimit
Note
```

### 針對其中幾個部分進行說明：


#### nonce： prevent double spending[[1: what is nonce]](https://kb.myetherwallet.com/en/transactions/what-is-nonce/) 可以透過API得到，也可以透過自己錢包的交易數量推得。

#### gasPrice：每單位 Gas 願意付出多少 ETH，一般使用 Gwei(1e9 to wei) 作為單位。gasPrice * gasUsed 即為此次交易的手續費 Fee。

#### gasUsed：此次交易使用的 gas 數量。

#### gasLimit： 你願意花費在交易上的最大數量的 Gas 單位。


### 進行ETH交易

1. 取得 chainId， chainId是取決於Ethereum交易的網路


| ropsten | rinkeby | mordor | Eth mainnet | Eth based mainnet |
|:-------:|:-------:|:------:|:-----------:|:-----------------:|
|    3    |    4    |   63   |      1      |        61         |
 
2. 將上述 ETH 交易內容進行 rlp 編碼的格式排列

```javascript=
class Transaction{
    int nonce;
    BigInt gasPrice;
    int gasLimit;
    String to;
    BigInt amount;
    String note;
    
    Transaction(this.nonce, this.gasPrice, this.gasLimit, this.to, this.amount, this.note);
}

var tx = Transaction(0, 49 * 1e9 ,21000, '0x15b1a87b648384033fdca1b7656cb534b91ffe56', 0.002 * 1e18, 'This is a transaction on ropsten');

var v = chainId;
var r = BigInt.zero;
var s = BigInt.zero;

var rlpData = [nonce, gasPrice, gasLimit, to, amount, note, v, r, s];
```

3. 將rlpData 使用rlpEncode function進行rlp 編碼，得到 encodeRlpData，再進行rlp 編碼之前會將 rlpData裡面的各元素根據其型別轉為Buffer，可參考 toBuffer function。


```javascript=
Uint8List toBuffer(dynamic data) {
  if (data is Uint8List) return data;

  if (data is String) {
    if (isHexString(data)) {
      return Uint8List.fromList(hex.decode(padToEven(stripHexPrefix(data))));
    } else {
      return Uint8List.fromList(utf8.encode(data));
    }
  } else if (data is int) {
    return Uint8List.fromList(intToBuffer(data));
  } else if (data is BigInt) {
    return Uint8List.fromList(encodeBigInt(data));
  } else if (data is List<int>) {
    return Uint8List.fromList(data);
  }

  throw TypeError();
}
```


4. var hash = keccak256(encodeRlpData)
5. [r,s,v] = ECDSA(hash)
6. 最後將簽名後得到的r,s,v 替換上述的rlpData，再將進行rlp encode後得到的Buffer轉為HEX，加上前綴{0x}， 即為可用於Ethereum HEX。 


### RLP encode:
rlp 是 recursive length prefix 的縮寫，目的是用於對巢狀的陣列進行編碼[[eth wiki]](https://eth.wiki/fundamentals/rlp)[(中文)RLP 編碼規則](https://www.itread01.com/content/1541817991.html)。

規則一： 對於值在[0, 127]之間（因為基於ASCII標準表，所以超過128就處理不了啦）的單個字元，其編碼是其ASCII編碼。 比如，單個字元‘0’在ASCII標準表裡是48（十六進位制是0x30），所以在RLP這裡也是48。

規則二： 如果字串長度是0-55個位元組，那麼在前面加上（128+字串長度）作為字首。 比如，空字串編碼就是128，即128 = 128 + 0； “0”這個字串只有1個字元，編碼就是12948； “0123”在ASCII標準表是48495051，長度是4個位元組，字首為132，那麼RLP 轉換後就是13248495051。

規則三： 如果字串長度大於55， 那麼在前面加上（183+字串長度的二進位制編碼的長度）和（字串長度）做字首。（為什麼是183？因為在規則二里，最大就是183（128+55）。）

規則四： 如果列表中所有字串的總長度按規則1到3編碼後，小於等於55，那麼在前面加上（192+該長度）做字首。列表裡的字串編碼參照規則1到3（183和192之間差了9個位元組，9個位元組用來表示長度。

規則五： 如果列表中所有字串的總長度按規則1到3編碼後，超過55，那麼在前面加上（247+該長度的二進位制編碼的長度）和（該長度）做字首。列表裡的字串編碼參照規則1到3（為什麼是247？因為192+55=247）。


```javascript=
Uint8List encode(dynamic input) {
  if (input is List && !(input is Uint8List)) {
    final output = <Uint8List>[];
    for (var data in input) {
      output.add(encode(data));
    }

    final data = _concat(output);
    return _concat([encodeLength(data.length, 192), data]);
  } else {
    final data = toBuffer(input);
    // 對於值在[0x00，0x7f]範圍內的單個字節, 
    if (data.length == 1 && data[0] < 128) {
      return data;
    } else {
      return _concat([encodeLength(data.length, 128), data]);
    }
  }
}

Uint8List encodeLength(int length, int offset) {
  if (length < 56) {
    return Uint8List.fromList([length + offset]);
  } else {
    final String hexLen = _intToHex(length);
    final int lLength = hexLen.length ~/ 2;

    return _concat([
      Uint8List.fromList([offset + 55 + lLength]),
      Uint8List.fromList(hex.decode(hexLen))
    ]);
  }
}

Uint8List _concat(List<Uint8List> lists) {
  final list = <int>[];

  lists.forEach(list.addAll);

  return Uint8List.fromList(list);
}

```
