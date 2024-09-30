# 應援科技金流 API 串接指南

## 1. 介紹

在支付系統整合中，選擇適合的付款方式至關重要，尤其當涉及信用卡資訊的處理時，風險與安全性更是我們關注的核心。應援科技金流提供了兩種付款方式：「跳轉支付」和「直連支付」。這兩種方式各有其優勢，根據不同的應用情境，能滿足不同平台對於交易體驗與資訊安全的需求。

「跳轉支付」是指將用戶導向至應援科技所提供的支付頁面，由他們負責收集與處理信用卡資訊，交易完成後再將用戶導回我們的平台。這種方式的優點是我們無需自行處理或儲存信用卡資料，降低 PCI-DSS 合規的壓力與資安風險，並讓應援科技金流負責處理敏感資訊，提升用戶支付時的安全性。

相對而言，「直連支付」則讓用戶在我們的平台上直接輸入信用卡資訊，然後透過 API 傳送至應援科技進行交易。這種方式能提供更順暢的付款流程，但我們需要自行負責信用卡資料的安全性與合規問題，對系統的安全防護與支付流程的處理要求較高。

基於我們對用戶資料安全的重視，以及對 PCI-DSS 合規成本的考量，我們最終選擇了跳轉支付的方式來進行整合，並將 token 作為後續交易的憑證。透過這樣的流程，用戶首先在應援科技的支付頁面完成信用卡資訊的輸入與驗證，獲取一組唯一的 token，然後我們在平台上儲存該 token，作為後續訂閱或重複交易的支付憑證。這種架構不僅簡化了我們對支付資訊安全的處理，也確保在後續交易中，敏感資訊依然受到應援科技的保護，達到一個更高效且安全的支付環境。

## 2. 應援金流 API 串接準備

在進行應援科技金流 API 的串接之前，完整的準備工作能確保整合流程順利進行，並減少因環境或設定不當而產生的問題。以下是我們在串接前必須完成的準備步驟：

1. 確認金流串接環境
應援科技提供 Sandbox（測試環境）與正式環境兩種模式。我們應先在 Sandbox 環境中測試整個串接流程，以確保所有功能正確運作，待測試無誤後再切換至正式環境進行實際交易。通常，Sandbox 環境會模擬實際交易流程，但不會真正扣款，這有助於我們在開發階段進行完整測試。

<img width="1000" alt="截圖 2024-09-30 下午5 15 08" src="https://github.com/user-attachments/assets/38ae1814-c2d3-485d-aebc-1d330f886109">

2. 取得 API token 與相關文件 [Oen Tech Payment API](https://documenter.getpostman.com/view/26859697/2s9YsQ7VJA#bb2c0c40-3467-44fb-9a25-844e21f9e84a)
首先，我們需要向應援科技申請帳戶，並在總設定取得一組 API token(如下圖)。這組 token 是與應援科技 API 溝通的憑證，必須妥善保管，避免洩露。此外，建議閱讀並熟悉應援科技提供的 API 文件，了解各個端點的使用方式、參數格式，以及交易流程。

<img width="1000" alt="截圖 2024-09-30 下午5 17 23" src="https://github.com/user-attachments/assets/6f57f122-938a-4eaa-b235-79fe5c2fdc84">

3. 設置伺服器與安全憑證接收交易回呼
為確保金流資料的傳輸安全，我們的網站必須使用 HTTPS，並安裝有效的 SSL 憑證，這是確保所有交易資料在傳輸過程中被加密的重要一步。此外，確認您的伺服器設定能夠處理應援科技 API 的請求和回應，並準備好用於接收交易回呼通知的 URL (callbackUrl)，以便後續對交易狀態進行確認。


## 3. 跳轉方式取得 Token

應援金流提供之流程圖

<img width="1000" alt="應援流程" src="https://content.pstmn.io/7002c5b8-e29c-4a79-ac9d-b8cfb5f66d8d/VW50aXRsZWQucG5n">

在選擇跳轉支付方式後，整個交易流程的第一步是引導用戶至應援科技的支付頁面，並在完成交易後取得 token 作為後續的交易憑證。這個過程涉及以下幾個關鍵步驟：

1. 產生跳轉連結
我們需要透過應援科技的 API 來產生一個跳轉 URL，該 URL 將包含我們所指定的商戶 ID、成功與失敗的 redirect URL，以及一個自訂的交易 ID。透過這個 URL，用戶將被引導至應援科技的支付頁面，並在該頁面完成信用卡資訊的輸入。

Example Request

```curl
curl --location 'https://payment-api.testing.oen.tw/checkout-token' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer yourToken' \
--data '{
    "merchantId": "oentech",
    "successUrl": "https://www.google.com",
    "failureUrl": "https://www.google.com"
    "customId": "yourCustomId",
}'
```

Example Response

```json
{
  "code": "S0000",
  "data": {
    "id": "2eqe6kF33wbq9Dy1UNoMPzY7tal"
  },
  "message": ""
}
```

取得 Response 後由伺服器端轉址至

Production：https://{merchantId}.oen.tw/checkout/subscription/create/{data.id}
Testing：https://{merchantId}.testing.oen.tw/checkout/subscription/create/{data.id}

綁定信用卡頁面
<img width="920" alt="截圖 2024-09-30 下午5 32 57" src="https://github.com/user-attachments/assets/a55ef004-5f05-451b-8eb6-2f7f56eeb02f">


2. 完成支付流程與回呼
用戶被引導至應援科技的綁定信用卡頁面後，將在該頁面輸入信用卡資訊並完成 token 申請。交易成功或失敗後，應援科技會將用戶導回我們預先設定的 redirectUrl，同時也會將交易結果以 POST 請求的方式回傳至我們指定的 callbackUrl。我們需要在伺服器端處理這個回呼請求，以確認交易狀態並取得對應的 token。

Webhook Request Body

```json
{
  "success": true,
  "purpose": "token",
  "merchantId": "exampleMerchant",
  "transactionId": "123abc456def789ghi",
  "message": null,
  "customId": "{\"orderId\": 9999, \"subPlan\": \"premium\", \"subPeriod\": 60}",
  "token": "xyz123456789token",
  "id": "123abc456def789ghi"
}
```

## 4. 儲存 Token 進行後續交易

取得 token 後，該 token 將作為用戶的交易憑證，用於未來的訂閱或重複支付。為確保資料安全，我們必須以合適的方式儲存 token，並在進行交易時正確使用它。

1. Token 的安全儲存
建議將 token 存儲於加密的資料庫中，避免未經授權的存取。同時，應確保只有需要使用 token 的交易流程能夠取得該資訊，並對存取 token 的操作進行日誌記錄，以便於未來的安全稽核。

2. 使用 Token 進行交易
在後續的訂閱或交易中，我們可以直接使用儲存的 token 來完成扣款。透過應援科技的 API，將 token 與交易金額、描述等資訊一併傳送，即可完成支付。建議您在此加入完整的 API 請求範例，說明如何使用 token 進行交易。

Example Request

```curl
curl --location 'https://payment-api.trista.oen.tw/token/transactions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer yourToken' \
--data '{
  "merchantId": "oentech",
  "amount": 500,
  "currency": "TWD",
  "token": "2etM3aQSCMWv7OGYQ6gDWtcOJaR",
  "orderId": "ORDER00001"
}'```

Example Response

```json
{
  "code": "S0000",
  "data": {
    "id": "P202210139EKASEJ7",
    "authCode": "831000"
  },
  "message": ""
}
```

## 5. 常見問題與處理方式

在金流整合過程中，可能會遇到各種情況，以下是一些常見問題及建議處理方式：

1. **Token 過期或失效**
Token 有效期可能受限於應援科技的設定，當 token 過期或因其他原因失效時，後續交易將無法完成。在此情況下，我們需要重新引導用戶至支付頁面獲取新的 token。為避免交易中斷，建議在訂閱或定期扣款時，提前確認 token 的有效性，並建立通知機制，提醒用戶更新支付資訊。

2. **API 請求錯誤與異常處理**
在與應援科技金流 API 通訊時，可能會遇到網路延遲、伺服器錯誤等問題。為了提高交易的成功率，建議在 API 請求失敗時實施重試機制，並根據應援科技 API 回傳的錯誤代碼，採取對應的處理措施。例如，若錯誤代碼為「E0001」（表示金額不足），應引導用戶確認支付卡片的可用餘額，或使用其他支付方式。

3. **安全性注意事項**
除了確保 token 的安全儲存外，應避免在前端硬編碼 API 金鑰或其他敏感資訊，並限制伺服器對應援科技 API 的請求來源 IP，以防止未經授權的存取。同時，定期檢查和更新伺服器的 SSL 憑證，確保與應援科技的通訊始終使用 HTTPS 加密傳輸，防止敏感資訊外洩。

## 6. 結論

整合應援科技金流 API 為平台提供了一個安全、可靠且彈性的支付解決方案。藉由選擇跳轉支付方式，有效避免了自行處理信用卡資訊的風險，並在交易過程中使用 token 作為憑證，確保用戶的支付資料始終受到保護。在實際的開發與整合中，務必遵循應援科技提供的 API 文件和安全指引，並在不同的測試環境中充分驗證支付流程。

透過本指南，我們希望您能順利完成應援科技金流 API 的串接，並在實際運營中提供用戶一個流暢且安全的支付體驗。隨著未來支付技術的發展，持續關注最新的支付趨勢與安全標準，將有助於我們平台在數位經濟中保持競爭力與信賴度。
