# Bitcoin based addresss

## coinType
* Bitcoin
* Litecoin
* Doge
* Dash
* Bitcoin Cash

```javascript=
int get coinType {
  switch (CryptocurrencyType) {
      case Bitcoin:
        return 0x80000000;
      case Litecoin:
        return 0x80000002;
      case Doge:
        return 0x80000003;
      case Dash:
        return 0x80000005;
      case Bitcoin Cash:
        return 0x80000091;
    }
}
```
## OP Code
https://en.bitcoin.it/wiki/Script#Opcodes
```javascript=
const int OP_0 = 0x00;
const int OP_PUSHDATA1 = 0x4c;
const int OP_PUSHDATA2 = 0x4d;
const int OP_PUSHDATA4 = 0x4e;
const int OP_1NEGATE = 0x4f;
const int OP_1 = 0x51;
const int OP_16 = 0x60;
const int OP_DUP = 0x76;
const int OP_EQUAL = 0x87;
const int OP_EQUALVERIFY = 0x88;
const int OP_HASH160 = 0xa9;
const int OP_CHECKSIG = 0xac;
```

## purpose
P2PKH: Legacy
P2WPKH-nested-in-P2SH: SegWit
P2WPKH: Native SegWit
```javascript=
  int get purpose {
    switch (CryptocurrencyType) {
      case nonSegWit: return (0x80000000 | 44);
      case segWit: return (0x80000000 | 49);
      case nativeSegWit: return (0x80000000 | 84);
    }
  }
```

## Each coinType support purpose
```javascript=
  Map<String, int> get supportedPurpose {
    switch (CryptocurrencyType) {
      case Bitcoin:
        return {"Legacy": (0x80000000 | 44), "SegWit": (0x80000000 | 49), "Native SegWit": (0x80000000 | 84)};
      case Litcoin:
        return {"Legacy": (0x80000000 | 44), "SegWit": (0x80000000 | 49), "Native SegWit": (0x80000000 | 84)};
      case Doge:
        return {"Legacy": (0x80000000 | 44), "SegWit": (0x80000000 | 49)};
      case Dash:
        return {"Legacy": (0x80000000 | 44), "SegWit": (0x80000000 | 49)};
      case Bitcoin Cash:
        return {"Legacy": (0x80000000 | 44), "SegWit": (0x80000000 | 49)};
    }
  }
```

## Pubkey To P2PKH Address
#### prefix
```javascript=
  int get p2pkhAddressPrefix {
    switch (CryptocurrencyType) {
      case Bitcoin:
        return isTestnet ? 0x6F : 0;
      case Litecoin:
        return isTestnet ? 0x6F : 0x30;
      case Doge:
        return isTestnet ? 0x71 : 0x1E;
      case Dash:
        return isTestnet ? 0x8C : 0x4C;
      case Bitcoin Cash:
        return isTestnet ? 0x6F : 0;
    }
  }
```
#### compressedPubkicKey
```javascript=
Uint8List compressedPubKey(List<int> uncompressedPubKey) {
  //**https://bitcoin.stackexchange.com/questions/69315/how-are-compressed-pubkeys-generated
  //https://bitcointalk.org/index.php?topic=644919.0
  if (uncompressedPubKey.length % 2 == 1) {
    uncompressedPubKey =
        uncompressedPubKey.sublist(1, uncompressedPubKey.length);
  }
  List<int> x = uncompressedPubKey.sublist(0, 32);
  List<int> y = uncompressedPubKey.sublist(32, 64);
  BigInt p = BigInt.parse(
      'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
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
#### pubkeyToP2PKHAddress
```javascript=
import 'package:bs58check/bs58check.dart' as bs58check;

String pubkeyToP2PKHAddress(CryptocurrencyType type, List<int> pubKey) {
  final List<int> fingerprint =
      ripemd160(sha256(pubKey.length > 33 ? compressedPubKey(pubKey) : pubKey));
  final List<int> hashPubKey =
      Uint8List.fromList([type.p2pkhAddressPrefix] + fingerprint);
  // bs58check library 會幫加checksum
  final String address = bs58check.encode(hashPubKey);
  return address;
}
```
### Bitcoin Cash Legacy Address
### [code reference](https://github.com/tomasforgacbch/bitbox-flutter/blob/master/lib/src/address.dart)

#### Human readable part
```javascript=
  String get cashAddrHRP {
    return isTestnet ? "bchtest" : "bitcoincash";
  }
```

#### pubkeyToP2PKHCashAddress
```javascript=
/// Derives an array from the given prefix to be used in the computation of the address' checksum.
static Uint8List _prefixToUint5List(String prefix) {
    Uint8List result = Uint8List(prefix.length);
    for (int i = 0; i < prefix.length; i++) {
      result[i] = prefix.codeUnitAt(i) & 31;
    }
    return result;
}

/// Returns the bit representation of the length in bits of the given hash within the version byte.
static int _getHashSizeBits(hash) {
    switch (hash.length * 8) {
      case 160:
        return 0;
      case 192:
        return 1;
      case 224:
        return 2;
      case 256:
        return 3;
      case 320:
        return 4;
      case 384:
        return 5;
      case 448:
        return 6;
      case 512:
        return 7;
      default:
        throw Exception('Invalid hash size: ' + hash.length + '.');
    }
}

 /// Converts a list of integers made up of 'from' bits into an  array of integers made up of 'to' bits.
  /// The output array is zero-padded if necessary, unless strict mode is true.
  static Uint8List _convertBits(List data, int from, int to,
      [bool strictMode = false]) {
    final length = strictMode
        ? (data.length * from / to).floor()
        : (data.length * from / to).ceil();
    int mask = (1 << to) - 1;
    var result = Uint8List(length);
    int index = 0;
    Int32 accumulator = Int32(0);
    int bits = 0;
    for (int i = 0; i < data.length; ++i) {
      var value = data[i];
      accumulator = (accumulator << from) | value;
      bits += from;
      while (bits >= to) {
        bits -= to;
        result[index] = ((accumulator >> bits) & mask).toInt();
        ++index;
      }
    }

    if (!strictMode) {
      if (bits > 0) {
        result[index] = ((accumulator << (to - bits)) & mask).toInt();
        ++index;
      }
    } else {
      if (bits < from && ((accumulator << (to - bits)) & mask).toInt() != 0) {
        throw FormatException(
            "Input cannot be converted to $to bits without padding, but strict mode was used.");
      }
    }
    return result;
  }
  
/// Returns a list representation of the given checksum to be encoded within the address' payload.
 static Uint8List _checksumToUint5Array(int checksum) {
    Uint8List result = Uint8List(8);
    for (int i = 0; i < 8; i++) {
      result[7 - i] = checksum & 31;
      checksum = checksum >> 5;
    }

    return result;
}

static const _CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

static _base32Encode(List data) {
    String base32 = '';
    for (int i = 0; i < data.length; ++i) {
      var value = data[i];
      //validate(0 <= value && value < 32, 'Invalid value: ' + value + '.');
      base32 += _CHARSET[value];
    }
    return base32;
}

String pubkeyToP2PKHCashAddress(List<int> pubKey) {
  final List<int> fingerprint =
      ripemd160(sha256(pubKey.length > 33 ? compressedPubKey(pubKey) : pubKey));
      
  final List<int> prefixData = _prefixToUint5List(isTestnet ? "bchtest" : "bitcoincash") + Uint8List(1);
  
  final int versionByte = _getHashSizeBits(fingerprint);
  
  final Uint8List payloadData =
        _convertBits(Uint8List.fromList([versionByte] + fingerprint), 8, 5);
        
  final List<int> checksumData = prefixData + payloadData + Uint8List(8);
  
  final List<int> payload = payloadData + _checksumToUint5Array(_polymod(checksumData));
  
  return "$prefix:" + _base32Encode(payload);
}
```

## Pubkey To P2SH Address

#### prefix
```javascript=
  int get p2pkhAddressPrefix {
    switch (CryptocurrencyType) {
      case Bitcoin:
        return isTestnet ? 0xC4 : 0x05;
      case Litecoin:
        return isTestnet ? 0x3A : 0x32;
      case Doge:
        return isTestnet ? 0xC4 : 0x16;
      case Dash:
        return isTestnet ? 0x13 : 0x10;
      case Bitcoin Cash:
        return isTestnet ? 0xC4 : 0x05;
    }
  }
```

```javascript=
String pubkeyToP2SHAddress(
    CryptocurrencyType type, List<int> compressedPubKey) {
  List<int> redeemScript = [OP_0, 0x14, ...ripemd160(sha256(compressedPubKey)];
  List<int> fingerprint = ripemd160(sha256(redeemScript));
  // List<int> checksum = sha256(sha256(fingerprint)).sublist(0, 4);
  // bs58check library 會幫加checksum
  String address = bs58check
      .encode(Uint8List.fromList([type.p2shAddressPrefix] + fingerprint));
  return address;
}
```

## Pubkey To P2WPKH Address

#### Bech32 Human readable part
```javascript=
String get bech32HRP {
    if (this != ATCryptocurrencyType.btc && this != ATCryptocurrencyType.ltc)
      ATLog.error("Not BTC nor LTC");
    switch (this) {
      case Bitcoin:
        return ATConstants().isTestnet ? "tb" : "bc";
      case Litecoin:
        return ATConstants().isTestnet ? "tltc" : "ltc";
      default:
        return "";
    }
  }
```
#### Bech32 Seperator
```javascript=
String get bech32Separator {
    if (this != ATCryptocurrencyType.btc && this != ATCryptocurrencyType.ltc)
      ATLog.error("Not BTC nor LTC");
    switch (this) {
      case Bitcoin:
        return "1";
      case Litecoin:
        return "1";
      default:
        return "";
    }
  }
```

#### Bip32Type
```javascript=
  int get bip32Type {
    switch (CryptocurrencyType) {
      case Bitcoin:
        return isTestnet
            ? isPublic ? 0x043587cf : 0x04358394
            : isPublic ? 0x0488b21e : 0x0488ade4;
      case Litecoin:
        return isTestnet
            ? isPublic ? 0x019da462 : 0x019d9cfe
            : isPublic ? 0x019da462 : 0x019d9cfe;
    }
  }
```

#### wif
```javascript=
  int get wif {
    switch (CryptocurrencyType) {
      case Bitcoin:
        return isTestnet ? 0xef : 0x80;
      case Litecoin:
        return isTestnet ? 0xb0 : 0xb0;
    }
  }
```

```javascript=
class Segwit {
  Segwit(this.hrp, this.separator,this.version, this.program);

  final String hrp;
  final String separator;
  final int version;
  final List<int> program;

  String get scriptPubKey {
    var v = version == 0 ? version : version + 0x50;
    return ([v, program.length] + program)
        .map((c) => c.toRadixString(16).padLeft(2, '0'))
        .toList()
        .join('');
  }
}

static const _CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

String bech32Encode(Segwit input, List<int> data){
    int _polymod(List<int> values) {
      var chk = 1;
      values.forEach((int v) {
        var top = chk >> 25;
        chk = (chk & 0x1ffffff) << 5 ^ v;
        for (int i = 0; i < generator.length; i++) {
          if ((top >> i) & 1 == 1) {
            chk ^= generator[i];
          }
        }
      });

      return chk;
    }

    List<int> _hrpExpand(String hrp) {
      var result = hrp.codeUnits.map((c) => c >> 5).toList();
      result = result + [0];

      result = result + hrp.codeUnits.map((c) => c & 31).toList();

      return result;
    }

    List<int> _createChecksum(String hrp, List<int> data) {
      var values = _hrpExpand(hrp) + data + [0, 0, 0, 0, 0, 0];
      var polymod = _polymod(values) ^ 1;

      List<int> result = List<int>(6);

      for (int i = 0; i < result.length; i++) {
        result[i] = (polymod >> (5 * (5 - i))) & 31;
      }
      return result;
    }

    var checksummed = data + _createChecksum(input.hrp, data);
    return input.hrp + input.separator + checksummed.map((i) => _CHARSET[i]).join();
}

String segwitEncode(Segwit input){
    var version = input.version;
    var program = input.program;
    var data = _convertBits(program, 8, 5, true);
    return bech32Encode(input, [version] + data));
}

String pubkeyToP2WPKHAddress(CryptocurrencyType type, List<int> publicKey) {
    final List<int> hash =
      ripemd160(sha256(pubKey.length > 33 ? compressedPubKey(pubKey) : pubKey));
      
    final String address = segwitEncode(Segwit(bech32HRP, bech32Separator,0, hash));
  return address;
}
```





