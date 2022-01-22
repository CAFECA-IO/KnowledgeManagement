# Solona
研究並評估 TideBitEx 加入 Solona 所需綱要

## 研究目的
- TPS
  - 平均數據
  - 峰值
- Transaction struct
- smart contract

## 研究結果

### TPS
from [explorer](https://explorer.solana.com/)
  - average: 1466
  - peak: (2036txs/block) / (0.7sec / block) = 2908

### Transaction struct
一個交易包含下面幾個區段
1. Signatures
2. Message
3. Instructions

#### 1. Signatures
為一個array。

這個交易包含了多個公鑰（地址），每個參與到的公鑰都需要簽名。類似bitcoin的UTXO都需要有簽名才能使用的概念。

每個簽名簽名採用 ed25519 二進制格式，長64byte。

#### 2. Message
包含一個header，帳號地址的array，Recent Blockhash(防止重複並賦予交易生命週期)，Instructions array。

#### 3. Instructions
整筆交易由一或多個Instruction組成，也是交易的核心。

每個Instruction指定一個program來完成一件事，事件結果會回傳成功或失敗。

一但其中一個Instruction回傳失敗，整筆交易都會失敗並捨棄變更。

每個Instruction都包含幾個重要部分：
1. 正在使用的帳戶array以及每個帳戶是否是簽名者(isSigner)和/或可寫的(isWritable)
2. 呼叫的programID
3. 帶入program的資料

### smart contract
[Solana Tutorial | Building Smart Contracts & dApps For The Solana Hackathon](https://jamesbachini.com/solana-tutorial/)

## Reference
1. [explorer](https://explorer.solana.com/)

2. [transaction](https://docs.solana.com/developing/programming-model/transactions)

3. [Solana Transactions in Depth](https://medium.com/@asmiller1989/solana-transactions-in-depth-1f7f7fe06ac2)

4. [Solana Tutorial | Building Smart Contracts & dApps For The Solana Hackathon](https://jamesbachini.com/solana-tutorial/)