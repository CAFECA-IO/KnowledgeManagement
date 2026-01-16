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
根據[官方知識庫](https://www.alchemy.com/support/what-is-alchemy-signature-and-where-to-find-the-auth-token)的說明，Alchemy Auth Token 應該可以直接在 Webhooks 版面找到。但目前看來，尚未建立 Webhooks 的情況下進入版面只會看到導覽，所以我們需要先手動建立一個 Webhooks，以取得 Token。

> [!TIP]
> 以下將講解使用 GUI 建立 Webhooks 的步驟，**已取得 Alchemy Auth Token 的讀者可直接略過**。

在側欄點擊 **Data > Webhooks** 即可找到 Webhooks 服務，本例需要即時回報收款情形，所以選擇 **Real-time notifications**。
<img width="1390" height="822" alt="截圖 2026-01-14 晚上7 35 49" src="https://github.com/user-attachments/assets/ac14a502-54f9-41c5-9894-a2eb348d6403" />

選擇 Webhooks type ，也有現成的模板可用。這裡選用 **Address Activity**。
<img width="1323" height="814" alt="截圖 2026-01-14 晚上7 40 27" src="https://github.com/user-attachments/assets/f9998fbe-335c-4c8d-9503-eb2146724b8d" />

接下來是 Webhooks 配置：
- **Name**：Webhooks 名稱。可用預設名字就好。
- **Chain**：選擇區塊鏈。
- **Network**：選擇區塊鏈網路，這裡選擇的是測試網 Sepolia。
- **Ethereum Address**：要追蹤的地址。可加入多個地址。
- **Webhooks URL**：通知發送到的 URL，可進行測試。
右側的 Example Event Payload 就是 Webhooks URL 會收到的格式範例。

<img width="1474" height="819" alt="截圖 2026-01-14 晚上7 52 46" src="https://github.com/user-attachments/assets/ecd85ee0-d842-441f-b6a1-ce44ba11ee66" />

建立完成就會進到 Webhooks dashboard，這裡可以看到所有 Webhooks 服務的動態。我們需要的 Auth token 也會顯示在右上角。

<img width="1488" height="810" alt="02" src="https://github.com/user-attachments/assets/5b395dc6-8964-4ad2-8da3-7924767764b7" />

## Webhooks API
Alchemy 提供許多便利的 Notify API 節點供開發者使用，以下內容以「追蹤指定地址（Address Activity）」的情境撰寫 API 說明。其他情境（如 NFT Activity）與更多的 API 說明請查閱[官方文檔](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/read-custom-webhook-variable)。

### [建立 Webhooks](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/create-webhook)

這個端點提供建立 Ｗebhooks 的功能。

```bash
 curl -X POST https://dashboard.alchemy.com/api/create-webhook \
     -H "X-Alchemy-Token: your-X-Alchemy-Token" \
     -H "Content-Type: application/json" \
     -d '{
  "network": "ETH_SEPOLIA",
  "webhook_type": "ADDRESS_ACTIVITY",
  "webhook_url": "your-webhook-url",
  "addresses":["your-addresses"],
  "name": "your-webhook-name"
}'
```

- **your-X-Alchemy-Token**：剛剛取得的 Auth token。
- **network**：選擇區塊鏈網路，官方有指定的 [enum](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/create-webhook#request.body.network)。這裡選擇的是測試網 Sepolia。
- **webhook_type**：Ｗebhooks 的追蹤類型，一樣有指定的 [enum](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/create-webhook#request.body.webhook_type)。這裡選擇的是 Address Activity。
- **webhook_url**：通知發送到的 URL。
- **addresses**：`Array of string`，要追蹤的地址，可加入多個地址。
- **name**：設定 Webhooks 名稱。

建立成功後應該會得到以下格式的回應：

```json
{
  "data": {
    "id": "webhook-id",
    "name": "your-webhook-name",
    "network": "ETH_SEPOLIA",
    "networks": [],
    "webhook_type": "ADDRESS_ACTIVITY",
    "webhook_url": "your-webhook-url",
    "is_active": true,
    "time_created": 0,
    "signing_key": "your-signing-key",
    "version": "version",
    "deactivation_reason": "reason"
  }
}
```

也能在 Webhooks dashboard 看到結果。

<img width="992" height="139" alt="截圖 2026-01-16 上午11 20 17" src="https://github.com/user-attachments/assets/9de5f2e1-f708-4325-93df-81bd5ebe30d1" />

現在試試發送交易到該收款地址，Webhooks URL 就會收到 Alchemy Webhooks 回報的收款資訊。

<img width="763" height="461" alt="截圖 2026-01-16 上午11 21 57" src="https://github.com/user-attachments/assets/5c9cedb2-bfcb-44b2-97b5-73b204c1d613" />

### [取得所有 Webhooks](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/team-webhooks)

這個端點提供取得團隊中所有 Webhooks 的功能。

```bash
curl https://dashboard.alchemy.com/api/team-webhooks \
     -H "X-Alchemy-Token: your-X-Alchemy-Token"
```

成功後應該會得到以下格式的回應：

```json
{
  "data": [
    {
      "id": "webhook-id",
      "name": "your-webhook-name",
      "network": "ETH_SEPOLIA",
      "networks": [],
      "webhook_type": "ADDRESS_ACTIVITY",
      "webhook_url": "your-webhook-url",
      "is_active": true,
      "time_created": 0,
      "signing_key": "your-signing-key",
      "version": "version",
      "deactivation_reason": "reason"
    }
  ]
}
```

### [更新 Webhooks](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/update-webhook)
這個端點提供更改 Ｗebhooks 名稱和啟用/停用 Ｗebhooks 的功能。

```bash
curl -X PUT https://dashboard.alchemy.com/api/update-webhook \
     -H "X-Alchemy-Token: your-X-Alchemy-Token" \
     -H "Content-Type: application/json" \
     -d '{
  "webhook_id": "your-webhook-id",
  "name": "your-new-webhook-name",
  "is_active": true
}'
```

- **your-X-Alchemy-Token**：Auth token。
- **webhook_id**：要更改的 Ｗebhooks id，可先使用[取得所有 Webhooks](#取得所有-webhooks) 這支 API 查詢。
- **name**：更改的新名稱。
- **is_active**：`boolean`，true 即啟用，false 即停用。

成功後應該會得到以下格式的回應：

```json
{
  "data": {
    "id": "webhook-id",
    "name": "your-new-webhook-name",
    "network": "ETH_SEPOLIA",
    "networks": [],
    "webhook_type": "ADDRESS_ACTIVITY",
    "webhook_url": "your-webhook-url",
    "is_active": true,
    "time_created": 0,
    "signing_key": "your-signing-key",
    "version": "version",
    "deactivation_reason": "reason"
  }
}
```

### [新增和刪除 Webhooks 位址](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/update-webhook-addresses)
這個端點提供在特定 Webhook 中新增或刪除地址的功能。且此端點具有**冪等性**，代表即使發出多次相同的請求，都只會被處理一次。

```bash
curl -X PATCH https://dashboard.alchemy.com/api/update-webhook-addresses \
     -H "X-Alchemy-Token: your-X-Alchemy-Token" \
     -H "Content-Type: application/json" \
     -d '{
  "webhook_id": "webhook-id",
  "addresses_to_add": [
    "address-you-want-to-add"
  ],
  "addresses_to_remove": [
    "address-you-want-to-remove"
  ]
}'
```

- **your-X-Alchemy-Token**：Auth token。
- **webhook_id**：要更改的 Ｗebhooks id，可先使用[取得所有 Webhooks](#取得所有-webhooks) 這支 API 查詢。
- **addresses_to_add**：`Array of string`，要加入的地址，可加入多個。**為必填項目**，如果沒有地址，請填入空數組。
- **addresses_to_remove**：`Array of string`，要移除的地址，可加入多個。**為必填項目**，如果沒有地址，請填入空數組。

成功後的回應為空集合：

```json
{}
```

### [替換 Webhooks 地址](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/replace-webhook-addresses)
這個端點提供在特定 Webhook 更改地址的功能。請注意這個 API 將會**覆蓋掉 Webhook 中所有地址**，如果只想新增或移除特定地址的話，請使用[新增和刪除 Webhooks 位址](#新增和刪除-webhooks-位址)這支 API。

```bash
curl -X PUT https://dashboard.alchemy.com/api/update-webhook-addresses \
     -H "X-Alchemy-Token: your-X-Alchemy-Token" \
     -H "Content-Type: application/json" \
     -d '{
  "webhook_id": "webhook-id",
  "addresses": [
    "address-you-want-to-update"
  ]
}'
```

- **your-X-Alchemy-Token**：Auth token。
- **webhook_id**：要更改的 Ｗebhooks id，可先使用[取得所有 Webhooks](#取得所有-webhooks) 這支 API 查詢。
- **addresses**：`Array of string`，要更改的地址，可加入多個。**為必填項目**。

成功後的回應為空集合：

```json
{}
```

### [刪除 Webhooks](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/delete-webhook)
這個端點提供刪除 Webhook 的功能。

```bash
curl -X DELETE "https://dashboard.alchemy.com/api/delete-webhook?webhook_id=webhook_id" \
     -H "X-Alchemy-Token: your-X-Alchemy-Token"
```

- **your-X-Alchemy-Token**：Auth token。
- **webhook_id**：要刪除的 Ｗebhooks id，可先使用[取得所有 Webhooks](#取得所有-webhooks) 這支 API 查詢。這個 query 須寫在 url 中。

成功後的回應為空集合：

```json
{}
```

### 參考來源

- [Alchemy](https://www.alchemy.com/)
- [Alchemy Get Started](https://www.alchemy.com/docs/get-started)
- [Offcial Tutorial Playlist](https://www.youtube.com/playlist?list=PLMj8NvODurfEDTZiorkULaW-303EC97tG)
- [Alchemy Notify API Endpoints](https://www.alchemy.com/docs/data/webhooks/webhooks-api-endpoints/notify-api-endpoints/read-custom-webhook-variable)
