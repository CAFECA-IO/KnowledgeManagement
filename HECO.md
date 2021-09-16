# HECO
調查研究 HECO 作為 Tidetime Chain 解決方案基礎適用性

## 概述

## 測試新增Validator

1. 申請資格

![](/2021/w36/heco/1_createProposal.png)

2. 複製id給活躍validator表決

![](/2021/w36/heco/2_copyProposalID.png)

3. 檢查結果

![](/2021/w36/heco/3_checkProposal.png)

4. 過半贊成

![](/2021/w36/heco/4_moreThanHalfV.png)

5. 先啟動節點同步
> 此時還不能出塊，先同步避免成為validator後同步不到導致出不了塊。

![](/2021/w36/heco/5_notValidator.png)

![](/2021/w36/heco/5_oriActiveValidator.png)

6. 切換帳戶，建立validator

![](/2021/w36/heco/6_changeAccount.png)

![](/2021/w36/heco/6_createValidator.png)

7. stake 至少 32 HT

![](/2021/w36/heco/7_32HT.png)

![](/2021/w36/heco/7_stake.png)

![](/2021/w36/heco/7_topValidator.png)

> 檢查是否有在topValidator

8. 等待下個epoch替換topValidator到ActivateValidator

![](/2021/w36/heco/8_nextEpoch.png)

![](/2021/w36/heco/8_isValidatorMining.png)
> 開始出塊了


## 更高押金替換validator

1. stake 100HT 到 0xa895D7555476041269E5ba2Eb96586F9dF8A7aE7

![](/2021/w36/heco/10_100stack.png)

2. 等下個epoch確定進入

![](/2021/w36/heco/11_new21Validators.png)
