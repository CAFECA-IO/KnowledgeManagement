# BTC Unsigned Data

## Mapping
BIP-44 : legacy : p2pkh  
BIP-49 : witness : p2sh - p2wpkh  
BIP-84 : witness : p2wpkh  

## Legacy
```
Double SHA256 of the serialization of:
1. version
2. inputData.sha256().sha256()
3. sequenceData.sha256().sha256()
4. outpoint
5. scriptCode
6. UnsafeBufferPointer<UInt64>(start: &amount, count: 1)
7. nSequence
8. outputData.sha256().sha256()
9. locktime
10.UnsafeBufferPointer<UInt32>(start: &hashType, count: 1)
```

## Withness
```
Double SHA256 of the serialization of:
1. nVersion of the transaction (4-byte little endian)
2. hashPrevouts (32-byte hash)
3. hashSequence (32-byte hash)
4. outpoint (32-byte hash + 4-byte little endian) 
5. scriptCode of the input (serialized as scripts inside CTxOuts)
6. value of the output spent by this input (8-byte little endian)
7. nSequence of the input (4-byte little endian)
8. hashOutputs (32-byte hash)
9. nLocktime of the transaction (4-byte little endian)
10.sighash type of the signature (4-byte little endian)
```

## Refference
- [BIP-0143](https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki)
