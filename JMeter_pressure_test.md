# 使用 JMeter 對遠端 Ubuntu 上的 Poxa 進行 WebSocket 壓力測試

## 1. 簡介
本指南旨在使用 JMeter 工具對 Poxa 伺服器進行 WebSocket 壓力測試。Poxa 是一個開源的 WebSocket 伺服器，特別適合進行壓力測試以模擬高併發情境下的即時消息傳輸。本文將介紹如何在 macOS 上配置 JMeter 並設置連線到遠端 Ubuntu 伺服器上的 Poxa，以便準確測試伺服器的性能極限。

### 適用範圍
- 即時聊天系統
- 股票或數據市場消息
- 遊戲伺服器的同步處理
- 物聯網裝置的即時資料上報

## 2. 測試環境準備

### 安裝 JMeter
1. 下載 [JMeter](https://jmeter.apache.org/download_jmeter.cgi)，並在 macOS 上安裝。
2. 解壓縮下載的安裝包，進入 `bin` 目錄，運行 `jmeter.sh` 以啟動 JMeter 圖形介面。
3. 確保 macOS 上安裝了合適的 JDK（JMeter 需要 JDK 8 以上的版本）。

### 安裝 WebSocket 插件
1. 在 [JMeter Plugins Manager](https://jmeter-plugins.org/) 下載 Plugins Manager，並安裝 WebSocket Sampler 插件。
2. 啟動 JMeter，進入 "Options" > "Plugins Manager"。
3. 搜尋 WebSocket Sampler 並安裝。完成後重啟 JMeter。

### 配置 Ubuntu 上的 Poxa 伺服器
1. 在 Ubuntu 伺服器上安裝並啟動 Poxa。
2. 確認 Poxa 伺服器已開放 WebSocket 連接端口（預設為 8080），並檢查防火牆設置允許外部訪問該端口。
3. 確認 Poxa 正在運行，並且可以透過 WebSocket 客戶端工具進行基本連接測試。

## 3. 設計 JMeter 測試腳本

### 創建測試計劃
1. 打開 JMeter，選擇 "Test Plan" > "Add" > "Threads" > "Thread Group"。
2. 在 Thread Group 中設定虛擬使用者數量（例如 100），持續時間（如 5 分鐘），以模擬真實使用者連線行為。

### 設置 WebSocket 連接
1. 在 Thread Group 下，選擇 "Add" > "Sampler" > "WebSocket Sampler"。
2. 在 WebSocket Sampler 中設定 Poxa 伺服器的 URL，例如：`ws://伺服器IP:8080/app/{app_key}?protocol=7&client=js&version=4.3.1`。
3. 設定 Header（如 Authorization token 或其他必要的驗證訊息）以模擬實際連線環境。

### 定義測試場景
1. **連線持續時間**：設置一個固定的連線保持時間，以模擬長期使用情況，並監控伺服器的連線穩定性。
2. **用戶數量**：設定虛擬使用者數目，模擬高併發情境下的連線負載。
3. **訊息頻率和大小**：在 WebSocket Sampler 中設定發送的消息頻率，並調整消息大小，以模擬不同使用負載。

### 設置消息傳送與驗證
1. 使用 WebSocket Sampler 的 "Message" 欄位定義傳送的測試消息內容，如 JSON 格式的數據。
2. 使用 Response Assertion 驗證回應內容，確保伺服器正確接收並回應消息。

## 4. 執行壓力測試

### 啟動測試計劃
1. 檢查所有設置無誤後，點擊 "Start" 開始測試。
2. 開啟監控插件以即時監控響應時間、錯誤率和其他性能指標。

### 負載調整
1. 測試中逐步增加或減少虛擬使用者數量及消息頻率，觀察伺服器在不同負載下的表現。
2. 若伺服器無法承受高頻率或大量連線，應記錄下異常數據以供後續分析。

### 即時監控
1. 在測試執行過程中，通過 JMeter 的監控面板觀察各指標，檢查伺服器在不同負載下的穩定性。
2. 紀錄錯誤率、延遲、TPS（每秒事務處理量）等關鍵指標。

## 5. 分析測試結果

### 結果分析
1. 在測試完成後，查看 "Aggregate Report" 和 "Summary Report" 中的數據。
2. 對比各指標（如延遲、TPS、錯誤率）數值，評估伺服器在不同負載下的反應。

### 瓶頸排查
1. 若發現延遲高或錯誤率增高，檢查伺服器資源（如 CPU、記憶體）的使用情況。
2. 使用數據確認伺服器的性能瓶頸，如連線數上限或 WebSocket 處理速度。

### 伺服器調整建議
根據測試結果，提出伺服器端的優化建議，例如：
   - 增加連線池的大小
   - 優化訊息處理流程
   - 增強伺服器資源（如 CPU、記憶體）配置

## 6. 常見問題及排除方法

### 無法連線
- 確認防火牆開放了 WebSocket 端口。
- 確認 Poxa 伺服器正在運行且允許來自外部的連線。

### 傳輸錯誤
- 檢查消息格式和大小是否符合伺服器要求。
- 確認 JMeter 和 Poxa 的 WebSocket 版本相容。

### 性能異常指標
- 若 TPS 停滯或延遲增高，嘗試降低虛擬使用者數量，檢查是否為負載過高導致伺服器超載。
- 分析伺服器資源使用情況，並考慮擴充硬體資源。

## 7. 小結與建議

### 測試結論
通過 JMeter 壓力測試，可以得出 Poxa 伺服器在不同負載條件下的性能表現，並評估其在高並發環境下的穩定性和可靠性。

### 後續優化
根據測試結果，對 Poxa 配置進行調整，並建議定期進行壓力測試，以持續監控伺服器的性能變化。

### 進一步學習資源
- [Apache JMeter 官方文件](https://jmeter.apache.org/usermanual/index.html)
- [JMeter WebSocket 插件文件](https://jmeter-plugins.org/)
- [Poxa GitHub](https://github.com/anycable/poxa)
