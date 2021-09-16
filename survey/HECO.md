# HECO
研究 HECO 作為 Tidetime Chain 解決方案基礎適用性

## 概述

## 研究目的
- 驗證 DPoS 機制
  - 礦工改選
  - 礦工提取獎勵
- 驗證經濟生態
  - EIP-1559 手續費銷毀機制實裝
  - 元交易機制驗證
- 擴容機制

## 研究結論

## 實驗資料
### 測試新增Validator

1. 申請資格

![](/img/HECO/1_createProposal.png)

2. 複製id給活躍validator表決

![](/img/HECO/2_copyProposalID.png)

3. 檢查結果

![](/img/HECO/3_checkProposal.png)

4. 過半贊成

![](/img/HECO/4_moreThanHalfV.png)

5. 先啟動節點同步
> 此時還不能出塊，先同步避免成為validator後同步不到導致出不了塊。

![](/img/HECO/5_notValidator.png)

![](/img/HECO/5_oriActiveValidator.png)

6. 切換帳戶，建立validator

![](/img/HECO/6_changeAccount.png)

![](/img/HECO/6_createValidator.png)

7. stake 至少 32 HT

![](/img/HECO/7_32HT.png)

![](/img/HECO/7_stake.png)

![](/img/HECO/7_topValidator.png)

> 檢查是否有在topValidator

8. 等待下個epoch替換topValidator到ActivateValidator

![](/img/HECO/8_nextEpoch.png)

![](/img/HECO/8_isValidatorMining.png)
> 開始出塊了


### 更高押金替換validator

1. stake 100HT 到 0xa895D7555476041269E5ba2Eb96586F9dF8A7aE7

![](/img/HECO/10_100stack.png)

2. 等下個epoch確定進入

![](/img/HECO/11_new21Validators.png)
