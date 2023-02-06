# 理解 SLA 標準
SLA(Service Level Agreement, 服務等級協定)，是服務提供商與平台服務使用者之間定義的正式承諾。服務提供商與受服務用戶之間具體達成了承諾的服務指標：品質、可用性，責任。SLA最常見的組成部分是以合同約定向客戶提供的服務，如擬定平台QoS(Quality of Services, 服務質量)、服務品質效能、責任歸屬及賠償事項，藉此保障購買人的權益及可預期的保證。

## SLA 的內容有哪些？
一般來說 SLA 的合約內容會包含以下這幾點，但賣方與購買商之間是有協商空間的：

### 簡介
說明 SLA 應包含的事項，包括其範圍及訂閱續約對條款的影響。

### 一般條款
在整個 SLA 中使用的條款，讓雙方 (平台服務提供者與平台服務使用者) 都具有一致的詞彙。例如，閃退、交易金額錯誤、資料錯誤及功能失常等。

定義協議的一般條款，包括如何提交索賠請求、取得任何效能或可用性問題的退費，以及協定的限制。

### 詳細資料
主要的效能承諾通常著重於「執行時間」，或產品服務成功運作的時間百分比。部分 SLA 也會著重於其他因素，包括「延遲」或服務回應要求的必要速度。

定義服務的特定保證，以有效率、妥善率來表示。效能承諾通常是以 %(百分比) 表示，該百分比的涵蓋範圍表示方式。

## SLA 計算方式＆百分比與總停機時間

通常 SLA 一定會有幾個衡量 Index(指標)，像是：

* 可用性(System Availability)
* 客服支援時段(Customer service support period)
* 回應時間(Incident Response)
* 服務中斷補償((Service interruption compensation)
* 復原點目標(Recovery Point Objective, RPO)


### 百分比與總停機時間有何關聯？
為了能夠客觀地評估服務水準，雲端服務一般把 「能夠提供服務的時間」稱為 Uptime(正常運行時間) 或 Web Availability(網站可用性)，這是指用戶使用網站連續不中斷服務的程度。而 「無法提供服務的時間」稱為 Downtime。

| 妥善率 | 一年當中必須提供服務的時間 | 一年當中無法提供服務的時間，不得高於 |
| -------- | -------- | -------- |
| 兩個 9     | 99%     | 3 天 15 小時 36 分     |
| 三個 9     | 99.9%     | 8 小時 45 分 36 秒     |
| 四個 9     | 99.99%     | 52分 33.6秒     |
| 五個 9     | 99.999%     | 5 分 15.36秒     |

**計算方式，以妥善率為兩個 9為例**

表示一年之中必須要有 99% 的時間正常營運：

`(60秒 * 60分 * 24小時 * 365天 ) * 99%  = 31220640 秒`

換言之，無法提供服務的時間為 (60秒 * 60分 * 24小時 * 365天 ) * 1% = 315360 秒 = 5256 分 = 87 小時 36 分 = 3 天 15 小時 36 分。


### 問題三個層級
在平台服務提供者運服務當中，會針對問題或要求做出第一時間回應的承諾，主要分為三個層級如下：

#### 層級一：緊急的 (Level 1, Critical)
* 嚴重中斷情況，影響大量網站用戶
* 重點功能無法實現，而直接影響到網站的收益，例如：訂單交易問題、商品圖片顯示不正常
* 伺服器停機
* 資料庫無法連線
#### 層級二：主要的 (Level 2, Major)
* 顧客能夠瀏覽網站且交易流程可以進行，但有部分網站功能異常或無法使用
#### 層級三：次要的 (Level 3, Minor)
* 不影響網站用戶使用的功能錯誤
* 一般問題諮詢


## Ref
- [你正在開發軟體產品嗎？別忘了 SLA 協定！](https://peterpowerfullife.com/blog/service-level-agreement/#%E7%99%BE%E5%88%86%E6%AF%94%E8%88%87%E7%B8%BD%E5%81%9C%E6%A9%9F%E6%99%82%E9%96%93%E6%9C%89%E4%BD%95%E9%97%9C%E8%81%AF)
- [歐斯瑞 SLA](https://www.astralweb.com.tw/service-level-agreement/)

--- 
- [wikiwand: Service-level agreement](https://www.wikiwand.com/en/Service-level_agreement)
- [google cloud: Compute Engine Service Level Agreement (SLA)](https://cloud.google.com/compute/sla)
- [AWS 服務水準協議 (SLA)](https://aws.amazon.com/tw/legal/service-level-agreements/)
- [Service Level Agreements for IBM Cloud (Public Cloud)](https://www.ibm.com/support/customer/csol/terms/?id=i126-9268&lc=zh-tw#detail-document)
- [Azure 服務 SLA 摘要](https://azure.microsoft.com/zh-tw/support/legal/sla/summary/)
- [What is website availability?](https://www.uptrends.com/what-is/website-availability)
