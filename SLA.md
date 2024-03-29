# 理解 SLA 標準
SLA(Service Level Agreement, 服務等級協定)，是服務提供商與客戶之間的承諾。服務的特定方面 ——質量、可用性、責任 ——由服務提供者和服務用戶商定。 SLA 最常見的組成部分是應按照合同約定向客戶提供服務。

SLA 通常包括許多組件，從服務定義到協議終止。為確保始終如一地滿足 SLA，這些協議通常設計有特定的界限，並且要求相關各方定期會面以創建一個開放的交流論壇。適用於提供者的獎勵和懲罰通常是明確的。大多數 SLA 還為定期（每年）重新訪問以進行更改留出空間。

## 定義明確的典型 SLA 將包含以下組件
- 要提供的服務類型：它指定服務類型和要提供的服務類型的任何其他詳細信息。
- 服務所需的性能水平，尤其是其可靠性(System Availability)和響應能力：可靠的服務將是在特定時間內遭受最少中斷並且幾乎在所有時間都可用的服務。具有良好響應能力的服務將在客戶請求後立即執行所需的操作。
- 監控流程和服務水平報告：該組件描述瞭如何監督和監控績效水平。此過程涉及收集不同類型的統計數據、收集這些統計數據的頻率以及客戶將如何訪問它們。
- 報告服務問題的步驟：此部分將指定報告問題的詳細聯繫方式以及必須報告問題詳細信息的順序。合同還將包括調查問題和解決問題的時間範圍。
- 響應和問題解決時間範圍：響應時間範圍是服務提供商開始調查問題的時間段。問題解決時間範圍是解決和修復當前服務問題的期限。
- 服務提供商未履行其承諾的後果：如果提供商無法滿足 SLA 中規定的要求，則服務提供商將不得不面對後果。這些後果可能包括客戶有權終止合同或就客戶因服務失敗而遭受的損失要求退款。

## 通用指標
服務級別協議可以跟踪多個性能指標。在這種情況下，這些指標稱為服務水平指標(SLI)。給定 SLI 的目標值稱為服務級別目標(SLO)。

在IT 服務管理中，一個常見的案例是呼叫中心或服務台。在這種情況下，SLA 通常指的是以下 SLI：

- 放棄率：等待接聽時放棄的呼叫百分比。對應的SLO可以是：最近30天所有來電的放棄率<30%。
- ASA（平均應答速度）：服務台應答呼叫所需的平均時間（通常以秒為單位）。相應的SLO可以是：過去30天內所有調用的ASA應該<20秒。
- TSF （時間服務因子）：在確定的時間範圍內應答呼叫的百分比，例如 20 秒內應答 80%。相應的 SLO 可能是：過去 30 天內 >90% 的呼叫應在 20 秒內得到答复。
- FCR（First-Call Resolution）：衡量聯絡中心座席在首次呼叫或聯繫時解決客戶詢問或問題的能力的指標。相應的 SLO 可能是：過去 30 天內所有案例的 FCR 應 > 75%。
- TAT（周轉時間）：完成某項任務所花費的時間。
- TRT（total resolution time）：完成某項任務所花費的總時間。
- MTTR（平均恢復時間）：服務中斷後恢復所需的時間。
- 正常運行時間 (uptime) 也是一個常用指標，常用於共享主機、虛擬專用服務器和專用服務器等數據服務。常見協議包括網絡正常運行時間百分比、電源正常運行時間、計劃維護窗口數等。


### 服務所需的性能水平詳細資料
主要的效能承諾通常著重於「執行時間」，或服務成功運作的時間百分比。定義服務的特定保證，以有效率、妥善率來表示。效能承諾通常是以 %(百分比) 表示。

#### 妥善率與總停機時間有何關聯？
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


### 響應和問題解決時間範圍
在平台服務提供者運服務當中，會針對問題或要求做出第一時間回應的承諾，主要分為三個層級如下：

#### 問題層級
##### 層級一：緊急的 (Level 1, Critical)
* 嚴重中斷情況，影響大量網站用戶
* 重點功能無法實現，而直接影響到網站的收益，例如：訂單交易問題、商品圖片顯示不正常
* 伺服器停機
* 資料庫無法連線
* 用戶委託或餘額錯誤
##### 層級二：主要的 (Level 2, Major)
* 顧客能夠瀏覽網站且交易流程可以進行，但有部分網站功能異常或無法使用
##### 層級三：次要的 (Level 3, Minor)
* 不影響網站用戶使用的功能錯誤
* 一般問題諮詢

#### 響應時間
<!-- | 問題層級 | 響應時間 |
| -------- | -------- |
| 層級一 |  < 1小時 |
| 層級二 |  < 4小時 |
| 層級三 |  < 8小時 | -->
* 層級一：緊急的 (Level 1, Critical): < 1小時
* 層級二：主要的 (Level 2, Major): < 4小時
* 層級三：次要的 (Level 3, Minor): < 8小時


## Ref
- [wikiwand: Service-level agreement](https://www.wikiwand.com/en/Service-level_agreement)
- [你正在開發軟體產品嗎？別忘了 SLA 協定！](https://peterpowerfullife.com/blog/service-level-agreement/#%E7%99%BE%E5%88%86%E6%AF%94%E8%88%87%E7%B8%BD%E5%81%9C%E6%A9%9F%E6%99%82%E9%96%93%E6%9C%89%E4%BD%95%E9%97%9C%E8%81%AF)
- [歐斯瑞 SLA](https://www.astralweb.com.tw/service-level-agreement/)
- [響應能力](https://azure.microsoft.com/zh-cn/support/plans/response/)
- [AWS 服務水準協議 (SLA)](https://aws.amazon.com/tw/legal/service-level-agreements/)
- [Service Level Agreements for IBM Cloud (Public Cloud)](https://www.ibm.com/support/customer/csol/terms/?id=i126-9268&lc=zh-tw#detail-document)
- [Azure 服務 SLA 摘要](https://azure.microsoft.com/zh-tw/support/legal/sla/summary/)
- [What is website availability?](https://www.uptrends.com/what-is/website-availability)
