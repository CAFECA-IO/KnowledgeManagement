# BOLT Protocol
## How to Use
- Transaction with Data
- Data Format
  - function name = sha3-256(name.toLowerCase()).split(0, 8)
  - arguments = RLP

## Blockchain function List
- deposit (0x48c73f68)
- withdraw (0x855511cc)
- transfer (0xb483afd3)
- swap (0x695543c3)
- donate (0x86ba0d37)

## BOLT JSON-RPC
- deposit (0x48c73f68)
- withdraw (0x855511cc)
- transfer (0xb483afd3)
- swap (0x695543c3)
- donate (0x86ba0d37)
- agentAddress
- balance
- exchangeRate
- minAmount
- maxAmount
- totalAmount
- syncStatus

### deposit (0x48c73f68)
(no input)

### withdraw (0x855511cc)
- cointype
  - 0x80000000 to 0x 0x8fffffff
  - [reference](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- amount
  - number x 10**18
- address (optional)
  - hexstring

```
transfer 1 BTC to 3LhS2MWhJC5vJwV1CtmHz3EzV4MNA1w65A
0x855511cc8480000000880de0b6b3a76400009905d07e81f97923b57ceed458c6fa493511545397537a73e5f5
```

### transfer (0xb483afd3)
- cointype
  - 0x80000000 to 0x 0x8fffffff
  - [reference](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- amount
  - number x 10**18
- address
  - hexstring
- withdraw
  - boolean

### swap (0x695543c3)
- from cointype
  - 0x80000000 to 0x 0x8fffffff
  - [reference](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- amount
  - number x 10**18
- to cointype
  - 0x80000000 to 0x 0x8fffffff
  - [reference](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- to address
  - hexstring
- withdraw
  - boolean
