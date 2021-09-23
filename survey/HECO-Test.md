## 準備

1. `https://github.com/HuobiGroup/huobi-eco-contracts/tree/master/contracts` 取得contract

需要以下檔案

- library/SafeMath.sol
- Validators.sol
- Params.sol
- Proposal.sol
- Punish.sol

2. `http://remix.ethereum.org/` 建立專案

按照結構建立

![](/img/HECO/workspace.png)

3. 編譯Validators，Proposal，Punish

切換至編譯器，remix會根據目前開啟的檔案決定編譯項目。調整編譯器版本到`0.6.12`

![](/img/HECO/compile.png)

4. 開啟MetaMask，建立網路

![](/img/HECO/createNetwork_1.png)

![](/img/HECO/createNetwork_2.png)

5. 透過metamask連線

選擇`Injected web3`

![](/img/HECO/connect_1.png)

![](/img/HECO/connect_2.png)

6. 連接合約

- Validators: 0x000000000000000000000000000000000000F000
- Punish: 0x000000000000000000000000000000000000F001
- Proposal: 0x000000000000000000000000000000000000F002

![](/img/HECO/publish.png)


## 測試新增Validator

1. 申請資格

![](/img/HECO/1_createProposal.png)

```
"createProposal(address,string)": "1f4f7d29"
```

ex:
```
address: 0xa895D7555476041269E5ba2Eb96586F9dF8A7aE7
detail: ""

input:
0x1f4f7d29000000000000000000000000a895d7555476041269e5ba2eb96586f9df8a7ae700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000
```

2. 複製id給活躍validator表決

![](/img/HECO/2_copyProposalID.png)

```
"voteProposal(bytes32,bool)": "a4c4d922"
```

ex:
```
id: 0x128b52f12b6f6a3e1fc4a92a181f19b7b9cfc1ded9132faec23d544b9f8a82ab

auth: true
input:
0xa4c4d922128b52f12b6f6a3e1fc4a92a181f19b7b9cfc1ded9132faec23d544b9f8a82ab0000000000000000000000000000000000000000000000000000000000000001

auth: false
input:
0xa4c4d922128b52f12b6f6a3e1fc4a92a181f19b7b9cfc1ded9132faec23d544b9f8a82ab0000000000000000000000000000000000000000000000000000000000000000
```

3. 檢查結果

![](/img/HECO/3_checkProposal.png)

```
"proposals(bytes32)": "32ed5b12"
```

ex:
```
id: 0x128b52f12b6f6a3e1fc4a92a181f19b7b9cfc1ded9132faec23d544b9f8a82ab

0x32ed5b12128b52f12b6f6a3e1fc4a92a181f19b7b9cfc1ded9132faec23d544b9f8a82ab
```

4. 過半贊成

![](/img/HECO/4_moreThanHalfV.png)

5. 先啟動節點同步
> 此時還不能出塊，先同步避免成為validator後同步不到導致出不了塊。

![](/img/HECO/5_notValidator.png)

![](/img/HECO/5_oriActiveValidator.png)

6. 切換帳戶，建立validator

![](/img/HECO/6_changeAccount.png)

![](/img/HECO/6_createValidator.png)

```
"createOrEditValidator(address,string,string,string,string,string)": "a406fcb7"
```

ex:
```
(必填) feeAddress: 0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a
moniker: 0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a
idendity: 0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a


input:
0xa406fcb7000000000000000000000000a50ec5c6e4c315b43dc7a605fb7f705dd7a61a2a00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000002a30784135306543356336453463333135623433444337613630354642376637303544443761363161326100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a30784135306543356336453463333135623433444337613630354642376637303544443761363161326100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

7. stake 至少 32 HT

![](/img/HECO/7_32HT.png)

![](/img/HECO/7_stake.png)

```
"stake(address)": "26476204"
```

ex:
```
validator: 0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a

input:
0x26476204000000000000000000000000a50ec5c6e4c315b43dc7a605fb7f705dd7a61a2a
```

![](/img/HECO/7_topValidator.png)

> 檢查是否有在topValidator

```
"getTopValidators()": "afeea115"
```

8. 等待下個epoch替換topValidator到ActivateValidator

![](/img/HECO/8_nextEpoch.png)

![](/img/HECO/8_isValidatorMining.png)
> 開始出塊了


### 更高押金替換validator

1. stake 100HT 到 0xa895D7555476041269E5ba2Eb96586F9dF8A7aE7

![](/img/HECO/10_100stack.png)

2. 等下個epoch確定進入

![](/img/HECO/11_new21Validators.png)

## 提取獎勵

withdrawProfits(address)
>執行會消耗gas，且每個address提領後需間隔28800 blocks(1天)。

測試地址`0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a`自己提領

```
"withdrawProfits(address)": "00362a77",
```

```
input:
0x00362a77000000000000000000000000a50ec5c6e4c315b43dc7a605fb7f705dd7a61a2a
```

receipt log
```
[ { "from": "0x000000000000000000000000000000000000f000", "topic": "0x51a69b4502f660774c9339825c7b5adbf0b8622289134647e29728ec5d9b3bb9", "event": "LogWithdrawProfits", "args": { "0": "0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a", "1": "0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a", "2": "144831000000000", "3": "1631867384", "val": "0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a", "fee": "0xA50eC5c6E4c315b43DC7a605FB7f705DD7a61a2a", "hb": "144831000000000", "time": "1631867384" } } ]
```

- 金額變化: 273918967.999855169 -> 273918967.999954461
- 因為自己提領，手續費被燒掉，只多了0.000098292，而非0.000144831

- (待驗證) 間隔2天以上是否會增加
