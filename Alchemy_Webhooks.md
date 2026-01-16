# 搭建 Alchemy Webhooks 
Alchemy Webhooks 主要用於即時推播鏈上資料通知，可追蹤多個區塊鏈上的地址活動、交易手續費等資訊。除了 GUI，Alchemy 也提供許多 Notify API 節點，讓開發者能更自由地整合其他專案，亦可根據自己的需求進行自訂。

- [申請 Alchemy 帳號](#申請-alchemy-帳號)
- [取得 Alchemy Auth Token](#取得-alchemy-auth-token)
- [Webhooks API](#webhooks-api)
    - [建立 Webhooks](#建立-webhooks)
    - [取得所有 Webhooks](#取得所有-webhooks)
    - [更新 Webhooks](#更新-webhooks)
    - [新增和刪除 Webhooks 位址](#新增和刪除-webhooks-位址)
    - [替換 Webhooks 地址](#替換-webhooks-地址)
    - [刪除 Webhooks](#刪除-webhooks)
- [參考來源](#參考來源)

## 申請 Alchemy 帳號
至 [Alchemy](https://auth.alchemy.com/?redirectUrl=https%3A%2F%2Fdashboard.alchemy.com%2Fwebhooks%3FappRedir%3D1) 註冊帳號，須通過 Captcha 、手機和電子郵件驗證。也支援 Google 登入。
<img width="634" height="853" alt="截圖 2026-01-14 下午6 44 28" src="https://github.com/user-attachments/assets/50f06cd3-06ab-434b-a7f8-e3d1513c3200" />

完成電子郵件驗證後，須填寫基本資料和選擇方案。免費版即可使用 Webhooks 和 API 等服務。

<img width="539" height="602" alt="截圖 2026-01-14 晚上7 02 17" src="https://github.com/user-attachments/assets/e950b7b2-e4ca-4eb6-a5d5-de369b236d3c" />

<img width="1161" height="761" alt="截圖 2026-01-14 晚上7 04 23" src="https://github.com/user-attachments/assets/d5365c0b-c3cd-46ff-b0bb-22e0c1f432f6" />

進入 dashboard 後會有簡單的介面導覽，可以查看一下。

<img width="1484" height="765" alt="截圖 2026-01-14 晚上7 11 27" src="https://github.com/user-attachments/assets/b256e809-958f-495c-882c-8554e5d6e481" />

## 取得 Alchemy Auth Token
[官方文檔](https://www.alchemy.com/docs/reference/webhooks-overview)有非常清楚的步驟，也有根據不同用例詳細說明。以下範例選用的是追蹤收款地址的 [Address Activity Webhook](https://www.alchemy.com/docs/reference/address-activity-webhook)。

在側欄點擊 **Data > Webhooks** 即可找到 Webhooks 服務，本例需要即時回報收款情形，所以選擇 **Real-time notifications**。
<img width="1390" height="822" alt="截圖 2026-01-14 晚上7 35 49" src="https://github.com/user-attachments/assets/ac14a502-54f9-41c5-9894-a2eb348d6403" />

選擇 webhook type ，也有現成的模板可用。這裡選用 **Address Activity**。
<img width="1323" height="814" alt="截圖 2026-01-14 晚上7 40 27" src="https://github.com/user-attachments/assets/f9998fbe-335c-4c8d-9503-eb2146724b8d" />

接下來是 webhook 配置：
- **Name**：webhook 名稱。可用預設名字就好。
- **Chain**：選擇區塊鏈。
- **Network**：選擇區塊鏈網路，這裡選擇的是測試網 Sepolia。
- **Ethereum Address**：要追蹤的地址。可加入多個地址。
- **Webhook URL**：通知發送到的 URL，可進行測試。
右側的 Example Event Payload 就是 Webhook URL 會收到的格式範例。

<img width="1474" height="819" alt="截圖 2026-01-14 晚上7 52 46" src="https://github.com/user-attachments/assets/ecd85ee0-d842-441f-b6a1-ce44ba11ee66" />

建立完成就會進到 Webhook dashboard，這裡可以看到所有 Webhooks 服務的動態。

<img width="1488" height="810" alt="截圖 2026-01-14 晚上7 57 39" src="https://github.com/user-attachments/assets/9e631a6d-95a7-4062-a1c3-0b6a759f8b71" />

## Webhooks API

### 建立 Webhooks
### 取得所有 Webhooks
### 更新 Webhooks
### 新增和刪除 Webhooks 位址
### 替換 Webhooks 地址
### 刪除 Webhooks

現在試試發送交易到收款地址，可以在 Webhook URL 看到 Alchemy Webhooks  回報的收款資訊。
<img width="942" height="720" alt="截圖 2026-01-14 晚上8 00 46" src="https://github.com/user-attachments/assets/15fd0884-f5c3-4c43-ba9f-3db8e9485ac6" />

Webhook dashboard 也會有活動紀錄，這樣就設定完成了。
<img width="1252" height="252" alt="截圖 2026-01-14 晚上8 02 41" src="https://github.com/user-attachments/assets/32e39d58-d64b-4af9-b34e-b7cdf2b8ba66" />

### 參考來源
- [Alchemy](https://www.alchemy.com/)
- [Alchemy Get Started](https://www.alchemy.com/docs/get-started)
- [Offcial Tutorial Playlist](https://www.youtube.com/playlist?list=PLMj8NvODurfEDTZiorkULaW-303EC97tG)
