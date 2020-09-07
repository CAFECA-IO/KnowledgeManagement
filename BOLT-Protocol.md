# BOLT Protocol
## How to Use
- Transaction with Data
- Data Format
  - function name = sha3-256(name).split(0, 8)
  - arguments = RLP

## Blockchain function List
- deposit
- withdraw
- transfer
- swap
- donate

## BOLT JSON-RPC
- deposit
- withdraw
- transfer
- swap
- donate
- agentAddress
- balance
- exchangeRate
- minAmount
- maxAmount
- totalAmount
- syncStatus

### deposit
- address

### withdraw
- cointype
- amount
- address

### transfer
- cointype
- amount
- address
- withdraw

### swap
- from cointype
- amount
- to cointype
- to address
- withdraw
