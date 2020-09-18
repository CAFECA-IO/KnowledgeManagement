# Pocket Bank Contract Protocol
## How to Use
- Transaction with Data
- Data Format
  - function name = keccak256(name.toLowerCase()).split(0, 8)
  - arguments = RLP

## Blockchain function List
- deposit (0x48c73f68)
- withdraw (0x855511cc)
- transfer (0xb483afd3)
- swap (0x695543c3)
- donate (0x86ba0d37)

## BOLT JSON-RPC
Personal:
- deposit (0x48c73f68)
- withdraw (0x855511cc)
- transfer (0xb483afd3)
- swap (0x695543c3)
- donate (0x86ba0d37)

- borrow (0x4f943907)
- return (0x7459b956)

Personal readonly:
- myAssets
- myBalance

System:
- address
- balance
- exchangeRate
- minAmount
- maxAmount
- totalAmount
- syncStatus

### deposit (0x48c73f68)
- no data

### withdraw (0x855511cc)
- cointype
  - 0x80000000 to 0x 0x8fffffff
  - [reference](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- amount
  - number x 10**18
- address (optional)
  - hexstring

```
withdraw 1 BTC to 3LhS2MWhJC5vJwV1CtmHz3EzV4MNA1w65A

function name: 855511cc
cointype: 84 80000000
amount: 88 0de0b6b3a7640000
address: 99 05d07e81f97923b57ceed458c6fa493511545397537a73e5f5

0x855511cc800000000de0b6b3a764000005d07e81f97923b57ceed458c6fa493511545397537a73e5f5
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

```
transfer 1 BTC to 3LhS2MWhJC5vJwV1CtmHz3EzV4MNA1w65A

function name: b483afd3
cointype: 84 80000000
amount: 88 0de0b6b3a7640000
address: 99 05d07e81f97923b57ceed458c6fa493511545397537a73e5f5
withdraw: 1

0xb483afd3800000000de0b6b3a764000005d07e81f97923b57ceed458c6fa493511545397537a73e5f501
```

### swap (0x695543c3)
- from cointype
  - 0x80000000 to 0x 0x8fffffff
  - [reference](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- from amount
  - number x 10**18
- to cointype
  - 0x80000000 to 0x 0x8fffffff
  - [reference](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- to expect amount
  - number x 10**18
- to address
  - hexstring
- withdraw
  - boolean

```
swap 1 BTC to 29.35 ETH to 0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8

function name: 695543c3
from cointype: 84 80000000
from amount: 88 0de0b6b3a7640000
to cointype: 84 8000003c
to expect amount: 89 019750257f3db70000
address: a8 ea674fdde714fd979de3edf0f56aa9716b898ec8
withdraw: 1

0x695543c38480000000880de0b6b3a7640000848000003c89019750257f3db70000a8ea674fdde714fd979de3edf0f56aa9716b898ec801
```

### donate (0x86ba0d37)
- no data

### borrow (0x4f943907)


### return (0x7459b956)
