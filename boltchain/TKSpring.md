# Layer 2 說明文件

## Deposit tsToken
### 流程圖
![](https://i.imgur.com/AfP1Iw3.png)


原圖：
https://lucid.app/lucidchart/90bf1827-b09c-46af-9038-bee407b46041/edit?viewport_loc=-1918%2C-2364%2C2368%2C1014%2C0_0&invitationId=inv_79d72a54-03b0-4db7-8b7c-99d4cb962251#

### 流程說明
1. 使用者提出轉帳至合約 (Deposit) 的請求
2. Operator 監聽轉帳事件後更新 off chain data 
3. 過程經過 Auction Server，並由 Auction Server 與 ITM Server 進行溝通
4. 最後由前端要求 receipt，並由 Auction Server 回傳 receipt 和 proof token 給前端提供給使用者查看


## Withdraw
### 流程圖
![](https://i.imgur.com/qbHTzRS.png)

原圖：
https://lucid.app/lucidchart/f767b08f-a6f5-4d8d-bdcd-8e14757f0fc5/edit?view_items=9VTnwv78t2qd&invitationId=inv_67889ae9-a45d-4f7b-8d70-87d4824c614f#

### 流程說明
1. 使用者向 Operator 提交 Withdraw 申請 
2. Operator 透過 Auction Server 經由與 ITM Server 的互動取得 proof token，接著取得 redeem code 
3. User 使⽤ Withdraw 加上 redeem code 提交合約出⾦ 

## Place Bid
### 流程圖
![](https://i.imgur.com/yPmh4FX.png)

原圖：
https://lucid.app/lucidchart/9cfcef02-1aee-484a-9c31-260c376622af/edit?viewport_loc=-1875%2C491%2C2470%2C1058%2C0_0&invitationId=inv_93719b62-48e6-4348-91dc-cbfe59abad07#

### 流程說明
1. 使用者提出 Place Bid 申請
2. 完成 Place Bid 後，由 Auction Server 回傳 proof token，最後回傳 receipt 給使用者

## Cancel Bid
### 流程圖
![](https://i.imgur.com/zLcpx50.png)

原圖：
https://lucid.app/lucidchart/2eb65c73-673e-49e9-b1c5-de1b5294509b/edit?viewport_loc=-2117%2C94%2C2368%2C1076%2C0_0&invitationId=inv_ab71347b-9062-4cdc-97cb-fd789870bb1a#


### 流程說明
1. 使用者提出 Cancel Bid 申請
2. 完成 Cancel Bid 後，由 Auction Server 回傳 proof token ，最後回傳 receipt 給使用者

## Auction
### 流程圖
![](https://i.imgur.com/7pl81IA.png)

原圖：
https://lucid.app/lucidchart/df39e756-edce-423e-a661-9825e861149a/edit?viewport_loc=-2216%2C-1101%2C2670%2C1213%2C0_0&invitationId=inv_a33b5047-57ec-473f-8b17-2780967beb33#

### 流程說明
1. 由 Auction Server 進行 Ｍatch 和 Settle，並且將最終的媒合分成 Unmatched、Lend 和 Borrow
2. 將計算完成的 merkle tree 傳送給 Auction Server 
3. 由 AuctionRouter upload merkle root
4. 由 Auction Server 向 ITM Server update result
5. 最後從 ITM Server 取得 proof token 

## Mint
### 流程圖
![](https://i.imgur.com/3ucHlXG.png)

原圖：
https://lucid.app/lucidchart/ba251927-3c48-48d4-9d3c-c22d56e32d05/edit?viewport_loc=-2076%2C-1433%2C2841%2C1291%2C0_0&invitationId=inv_385743f7-7ed7-47e5-8da4-790e9088befc#

### 流程說明
1. 使用者提出 Mint 要求
2. Auction Server 接收需求後回傳 receipt 和 merkle proof data
3. 智能合約檢查 merkle proof data 並 Mint a request 

## Repay
### 流程圖
![](https://i.imgur.com/ZTGLhIy.png)

### 流程說明
1. 使用者提出 repay debt 的要求
2. Auction Server 監聽 repay 事件，並且update database
3. 由 Auction Server 通知 ITM Server 回傳 proof token

## Redeem
### 流程圖
![](https://i.imgur.com/3yx53Rs.png)

### 流程說明

## Claim
### 流程圖
![](https://i.imgur.com/hJxWOBK.png)

### 流程說明
