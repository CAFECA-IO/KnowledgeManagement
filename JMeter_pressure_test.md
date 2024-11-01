# 使用 JMeter 對遠端 Ubuntu 上的 Poxa 進行 WebSocket 壓力測試

## 1. 簡介
本指南旨在使用 JMeter 工具對 Poxa 伺服器進行 WebSocket 壓力測試。Poxa 是一個開源的 WebSocket 伺服器，特別適合進行壓力測試以模擬高併發情境下的即時消息傳輸。本文將介紹如何在 macOS 上配置 JMeter 並設置連線到遠端 Ubuntu 伺服器上的 Poxa，以便準確測試伺服器的性能極限。

### 適用範圍
- 即時聊天系統
- 股票或數據市場消息
- 遊戲伺服器的同步處理
- 物聯網裝置的即時資料上報

## 2. 測試環境準備

### 使用 Homebrew 在 macOS 上安裝 JMeter
確保 macOS 上安裝了合適的 JDK（JMeter 需要 JDK 8 以上的版本）。

#### 1. 安裝 Homebrew（如果尚未安裝）
Homebrew 是 macOS 上的一個包管理工具，可以用來安裝 JMeter。打開終端並執行以下命令安裝 Homebrew：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. 安裝 JMeter
安裝完成後，透過 Homebrew 安裝 JMeter：

```bash
brew install jmeter
```

安裝成功後，可以在終端輸入以下命令檢查 JMeter 是否安裝成功：

```bash
jmeter -v
```

這將顯示 JMeter 的版本，確認安裝完成。

#### 3. 啟動 JMeter
在終端輸入以下命令啟動 JMeter：

```bash
jmeter
```

這會打開 JMeter 的圖形化界面，便於後續操作。

### 安裝 WebSocket 插件
JMeter 需要 WebSocket Sampler 插件來進行 WebSocket 測試，以下是具體安裝步驟：

#### 1. 下載 JMeter Plugins Manager
在 [JMeter Plugins Manager 網站](https://jmeter-plugins.org/get/)下載 `Plugins Manager`，下載的文件為 `JMeterPlugins-Manager.jar`。

#### 2. 將 Plugins Manager 添加到 JMeter
將下載的 `JMeterPlugins-Manager.jar` 文件放置到 JMeter 的 `lib/ext` 目錄中，通常路徑為 `/usr/local/Cellar/jmeter/{version}/libexec/lib/ext`。

可以使用以下命令將插件管理器 JAR 文件下載到正確的 lib/ext 路徑中：

```bash
wget -P /usr/local/Cellar/jmeter/5.6.3/libexec/lib/ext/ https://jmeter-plugins.org/get/
```

#### 3. 重啟 JMeter
重啟 JMeter，然後進入 JMeter 圖形介面中的 "Options" 菜單，選擇 "Plugins Manager"。

#### 4. 安裝 WebSocket Sampler 插件
在 Plugins Manager 中，搜索 "WebSocket Sampler" 並點擊 "Apply Changes and Restart JMeter"。這會自動下載並安裝 WebSocket 插件，安裝後 JMeter 會自動重啟。


### 配置 Ubuntu 上的 Poxa 伺服器
1. 在 Ubuntu 伺服器上安裝並啟動 Poxa。
2. 確認 Poxa 伺服器已開放 WebSocket 連接端口（預設為 8080），並檢查防火牆設置允許外部訪問該端口。
3. 確認 Poxa 正在運行，並且可以透過 WebSocket 客戶端工具進行基本連接測試。


## 3。創建 JMeter 測試計劃

### 1. 創建測試計劃
   - 在 JMeter 界面左上角點擊 "File" > "New" 創建一個新的測試計劃，並為測試計劃命名，例如「Poxa 壓力測試」。

### 2. 添加 Thread Group
   - 右鍵點擊 "Test Plan"，選擇 "Add" > "Threads (Users)" > "Thread Group"。
   - 設置以下參數：
     - **Number of Threads (users)**：設定虛擬使用者的數量，例如 100，模擬 100 個同時連線的使用者。
     - **Ramp-Up Period (in seconds)**：設置虛擬使用者啟動的時間間隔，例如 10 秒，表示在 10 秒內啟動所有使用者。
     - **Loop Count**：設定測試循環次數。選擇 "Forever" 可讓測試不間斷地運行。

### 3. 設置 WebSocket 連接
   - 右鍵點擊 Thread Group，選擇 "Add" > "Sampler" > "WebSocket Sampler"。
   - 配置 WebSocket Sampler：
     - **Server**：輸入 Poxa 伺服器的 IP 地址，例如：`192.168.0.1`。
     - **Port**：設置 WebSocket 端口，例如 Poxa 預設的 `8080`。
     - **Path**：指定 WebSocket 的路徑，例如 `app/{app_key}?protocol=7&client=js&version=4.3.1`。
     - **Connection Timeout** 和 **Response Timeout**：分別設置為 `5000ms` 和 `3000ms`，模擬連線和回應超時條件。

### 4. 定義測試場景
   - **連線持續時間**：在 Thread Group 中的「Duration」設置固定的連線持續時間，例如 300 秒，模擬每個使用者的長期連線行為，測試伺服器穩定性。
   - **用戶數量**：通過調整 Number of Threads，在不同負載下模擬伺服器性能，例如從 10 增加到 100。
   - **訊息頻率和大小**：在 WebSocket Sampler 的「Message」欄位中設置測試消息內容（如 JSON 格式），並加入「Constant Timer」以設置訊息間隔（如每秒一條）。

### 5. 添加回應驗證（Assertion）
   - 右鍵點擊 WebSocket Sampler，選擇 "Add" > "Assertions" > "Response Assertion"。
   - 在 Response Assertion 中，設置 "Pattern Matching Rules" 為 "Contains"，然後在 "Patterns to Test" 中輸入回應中預期的內容（如 `"status": "success"`），確保伺服器回應正確。

### 6. 設置監控報表
   - 右鍵點擊 Thread Group，選擇 "Add" > "Listener" > "Aggregate Report" 或 "View Results Tree"。
   - 這些 Listener 可以顯示每個請求的結果、錯誤數據和響應時間。

## 4. 執行壓力測試

### 1. 開始測試
   - 確認所有設置無誤後，點擊 JMeter 界面右上角的綠色 "Start" 按鈕開始測試。JMeter 將開始模擬虛擬使用者的連線並發送消息。

### 2. 逐步增加負載
   - 如果測試需要更高併發量，可以逐步增加 Thread Group 的 Number of Threads。
   - 觀察伺服器在不同負載下的表現，記錄響應時間和錯誤率等指標，以便分析伺服器的極限。

### 3. 即時監控與結果觀察
   - 使用 Aggregate Report 監控平均響應時間、TPS（每秒事務處理量）和錯誤率。
   - 使用 View Results Tree 查看每個請求和回應的詳細信息，有助於排查故障並觀察伺服器在高負載下的穩定性。

### 4. 測試結果的保存與分析
   - 測試完成後，將結果保存為 CSV 或 XML 文件，以便後續的分析。
   - 檢查數據中的瓶頸指標，如延遲增加或錯誤率變高，為伺服器的優化提供依據。

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

