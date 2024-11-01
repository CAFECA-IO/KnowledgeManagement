# 使用 JMeter 對遠端 Ubuntu 上的 Poxa 進行 WebSocket 壓力測試

## 1. 簡介
本指南旨在使用 JMeter 工具對 Poxa 伺服器進行 WebSocket 壓力測試。Poxa 是一個開源的 WebSocket 伺服器，特別適合進行壓力測試以模擬高併發情境下的即時消息傳輸。本文將介紹如何在 macOS 上配置 JMeter 並設置連線到遠端 Ubuntu 伺服器上的 Poxa，以便準確測試伺服器的性能極限。

### 適用範圍
- 即時聊天系統
- 股票或數據市場消息
- 遊戲伺服器的同步處理
- 物聯網裝置的即時資料上報

### 需要測試的重點
在進行 Poxa 的 WebSocket 壓力測試時，以下是具體測試項目和推薦的參數設置：

### 1. **連接數量測試**
   - **測試項目**：並發連接數。
   - **參數設置**：
     - 使用 **Thread Group** 設定多個線程（用戶），例如逐步增加從100、500、1000到最大預期連接數。
     - 每個線程開啟一個 WebSocket 連接，保持連接持續時間，觀察連接數量增長時的伺服器資源消耗。
     - **Ramp-up 時間**：根據伺服器能力逐步加載，比如 10 秒內達到預期並發。
   - **監控重點**：伺服器的 CPU 使用率、內存消耗、以及達到最大連接數時的穩定性。

### 2. **消息頻率與持續時間測試**
   - **測試項目**：消息傳輸頻率和持續時間。
   - **參數設置**：
     - 使用 **Loop Controller** 或 **Timer** 設定消息傳輸頻率（例如每秒5條、20條、100條）。
     - 設定不同持續時間的測試場景，從幾分鐘到數小時，檢查伺服器是否能持久處理高頻訊息。
     - 將每個消息設為隨機內容（例如 JSON 格式的隨機數據）以模擬實際使用情境。
   - **監控重點**：消息傳輸延遲、伺服器的吞吐量、丟失率（即消息未成功到達伺服器的比例）。

### 3. **持久連接測試**
   - **測試項目**：長時間連接穩定性。
   - **參數設置**：
     - 設定 WebSocket 連接持續打開 1 小時以上（或其他期望的長時間）。
     - 每隔固定時間傳送心跳消息（如每分鐘一條）確認連接是否仍然穩定。
     - 在 JMeter 中使用 **Constant Timer** 控制心跳訊息頻率。
   - **監控重點**：觀察是否有內存洩漏、長時間連接後的伺服器狀態、資源消耗趨勢（CPU、內存）。

### 4. **斷線與重連測試**
   - **測試項目**：斷線和重連的穩定性。
   - **參數設置**：
     - 在測試場景中隨機加入 **Interruption**，模擬意外斷線（例如每10秒有5%的連接斷線）。
     - 使用 **If Controller** 配合條件來控制某些線程重新建立連接，觀察伺服器如何處理大規模的重連情境。
   - **監控重點**：重連後的響應時間、伺服器的承載能力、重連過程中的失敗率。

### 5. **訊息大小測試**
   - **測試項目**：不同大小的訊息傳輸。
   - **參數設置**：
     - 使用 WebSocket Sampler 發送小至幾字元、大到數KB的不同消息大小。
     - 設置固定大小的 JSON 內容，例如100字元、500字元、1KB、2KB等。
     - 可以使用 **CSV Data Set Config** 導入多種消息大小以隨機選擇。
   - **監控重點**：伺服器處理大消息的延遲、內存消耗、可能的消息丟失情況。

### 6. **錯誤處理能力測試**
   - **測試項目**：伺服器的錯誤處理。
   - **參數設置**：
     - 使用 **Beanshell Sampler** 模擬非法請求，如發送格式錯誤的 JSON 或超大訊息。
     - 配合 **Response Assertion** 來檢查伺服器的回應是否符合預期（如錯誤代碼或拒絕）。
     - 每隔一定次數正常連接後加入一個錯誤訊息來觀察伺服器的反應。
   - **監控重點**：伺服器的錯誤響應時間、錯誤日誌、以及錯誤消息是否影響其他正常連接。

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


## 3. 創建 JMeter 測試計劃

### 1. 創建測試計劃
   - 在 JMeter 界面左上角點擊 "File" > "New" 創建一個新的測試計劃，並為測試計劃命名，例如「Poxa 壓力測試」。

### 2. 添加 Thread Group
   - 右鍵點擊 "Test Plan"，選擇 "Add" > "Threads (Users)" > "Thread Group"。
   - 設置以下參數：
     - **Number of Threads (users)**：設定虛擬使用者的數量，例如 100，模擬 100 個同時連線的使用者。
     - **Ramp-Up Period (in seconds)**：設置虛擬使用者啟動的時間間隔，例如 10 秒，表示在 10 秒內啟動所有使用者。
     - **Loop Count**：設定測試循環次數。選擇 "Forever" 可讓測試不間斷地運行。

<img width="988" alt="Screenshot 2024-11-01 at 3 08 50 PM" src="https://github.com/user-attachments/assets/92d7fec6-e6a0-4ee8-a4e1-c9408e9e7576">

### 3. 設置 WebSocket 連接
   - 右鍵點擊 Thread Group，選擇 "Add" > "Sampler" > "WebSocket Open Connection"。
   - 配置 WebSocket Open Connection：
     - **Server**：輸入 Poxa 伺服器的 IP 地址，例如：`pusher.tidebit-defi.com`。
     - **Port**：設置 WebSocket 端口，例如 Poxa 預設的 `443`。
     - **Path**：指定 WebSocket 的路徑，例如 `app/{app_key}?protocol=7&client=js&version=4.3.1`。
     - **Connection Timeout** 和 **Response Timeout**：分別設置為 `5000ms` 和 `3000ms`，模擬連線和回應超時條件。

### 4. 定義測試場景
   - **連線持續時間**：在 Thread Group 中的「Duration」設置固定的連線持續時間，例如 300 秒，模擬每個使用者的長期連線行為，測試伺服器穩定性。
   - **用戶數量**：通過調整 Number of Threads，在不同負載下模擬伺服器性能，例如從 10 增加到 100。

<img width="746" alt="Screenshot 2024-11-01 at 3 09 48 PM" src="https://github.com/user-attachments/assets/9e6ecd19-e9fd-460b-a45d-24f69e1c3d7a">

### 5. 在 JMeter 中，您可以在 **WebSocket Sampler** 的「Message」欄位中手動輸入 JSON 格式的測試消息。這樣可以模擬使用者向 Poxa 伺服器發送的消息，達到壓力測試的效果。

##### 添加測試消息的步驟

1. **找到 WebSocket request-response Sampler 的 Message 欄位**：
   - 在 JMeter 中打開設置的 WebSocket request-response Sampler。
   - 向下滾動至「Message」欄位。

2. **輸入測試消息**：
   - 在「Message」欄位中，輸入您要發送的 JSON 格式的消息，該消息可以模擬實際應用場景中的數據。例如，您可以使用以下 JSON：

     ```json
     {
       "event": "client-event",
       "data": {
         "message": "Test message for Poxa load test"
       }
     }
     ```

   - 這段 JSON 模擬了用戶在 WebSocket 連線中發送一個帶有「event」和「data」的消息結構，其中包含了一條測試訊息 "Test message for Poxa load test"。

3. **自定義消息內容**：
   - 可以根據測試需求修改「message」的內容，或添加其他字段來模擬更多場景中的消息結構。例如：

     ```json
     {
       "event": "update",
       "data": {
         "user_id": 12345,
         "status": "active"
       }
     }
     ```

4. **設置訊息頻率**（可選）：
   - 若希望控制訊息發送頻率，可在 WebSocket Sampler 前加入「Constant Timer」。
   - 右鍵點擊 WebSocket Sampler，選擇 "Add" > "Timer" > "Constant Timer"，設置延遲時間控制訊息間隔（如設為 1000 毫秒，代表每秒發送一條訊息）。

通過在「Message」欄位設置 JSON 格式的消息，JMeter 將會按照您設置的負載條件不斷發送這些消息給 Poxa，進行壓力測試並記錄伺服器的響應和性能指標。

### 6. 添加回應驗證（Assertion）
   - 右鍵點擊 WebSocket Sampler，選擇 "Add" > "Assertions" > "Response Assertion"。
   - 在 Response Assertion 中，設置 "Pattern Matching Rules" 為 "Contains"，然後在 "Patterns to Test" 中輸入回應中預期的內容（如 `"status": "success"`），確保伺服器回應正確。

### 7. 設置監控報表
   - 右鍵點擊 Thread Group，選擇 "Add" > "Listener" > "Aggregate Report" 或 "View Results Tree"。
   - 這些 Listener 可以顯示每個請求的結果、錯誤數據和響應時間。

## 4. 執行壓力測試

### 1. 開始測試
   - 確認所有設置無誤後，點擊 JMeter 界面右上角的綠色 "Start" 按鈕開始測試。JMeter 將開始模擬虛擬使用者的連線並發送消息。

### 2. 逐步增加負載
   - 如果測試需要更高併發量，可以逐步增加 Thread Group 的 Number of Threads。
   - 觀察伺服器在不同負載下的表現，記錄響應時間和錯誤率等指標，以便分析伺服器的極限。

### 3. 即時監控與結果觀察
> **View Results Tree**：顯示每個請求的詳細信息，適合查看請求和回應的具體內容。
> **Summary Report**：提供每個請求的總結統計數據，包括吞吐量（TPS：每秒事務處理量）、平均響應時間等。
> **Aggregate Report**：匯總每個請求的平均響應時間、吞吐量、錯誤率等指標。
> **Graph Results**：以簡單的折線圖或柱狀圖顯示響應時間的變化。
> **Response Time Graph**：顯示響應時間的變化趨勢。

   - **Summary Report** 和 **Aggregate Report**：用來分析整體響應時間和吞吐量。
   - **Graph Results** 和 **Response Time Graph**：用於響應時間和吞吐量的圖形化展示。
   - 使用 View Results Tree 查看每個請求和回應的詳細信息，有助於排查故障並觀察伺服器在高負載下的穩定性。

#### 使用方式
1. 右鍵點擊 Thread Group，選擇 **Add** > **Listener** > 選擇以上 Listener。
2. 運行測試後，在每個 Listener 中檢查測試結果。
3. 如果需要保存結果數據，可以在每個 Listener 中右鍵選擇「Save Table Data」或「Save Graph」來保存結果。

### 4. 測試結果的保存與分析
   - 測試完成後，將結果保存為 CSV 或 XML 文件，以便後續的分析。
   - 檢查數據中的瓶頸指標，如延遲增加或錯誤率變高，為伺服器的優化提供依據。

#### 如何決定測試時長
在不同用戶數量下進行 WebSocket 壓力測試時，可以根據用戶數的多寡調整測試方案，具體建議如下：

1. **少量用戶（10-50 位）**
   - **目標**：模擬低並發環境下的響應速度和穩定性。
   - **建議運行時間**：
     - **短期測試**：3-5 分鐘即可快速驗證基本連接和響應情況。
     - **中期測試**：15-30 分鐘，用於觀察持續運行的響應時間和資源消耗。
     - **長期測試**：1-2 小時，檢查低負載下的伺服器穩定性。
   - **重點**：觀察是否有連接斷開、資源洩漏等問題，確認伺服器能在低負載時穩定運行。
2. **中等用戶（50-100 位）**
   - **目標**：模擬一般使用情況下的伺服器性能。
   - **建議運行時間**：
     - **短期測試**：5-10 分鐘，用於初步性能驗證。
     - **中期測試**：30 分鐘至 1 小時，檢查伺服器的中期穩定性。
     - **長期測試**：2-4 小時，觀察是否存在資源不足或內存洩漏等問題。
   - **重點**：關注響應時間的波動和資源佔用情況，以確保伺服器能在一般負載下保持穩定。
3. **大量用戶（100-500 位）**
   - **目標**：模擬高並發情境，檢查伺服器的最大承載能力。
   - **建議運行時間**：
     - **短期測試**：10-15 分鐘，確定伺服器是否能承受瞬時高峰負載。
     - **中期測試**：1-2 小時，用於觀察長時間高並發下的穩定性。
     - **長期測試**：4 小時或更長時間，以確保伺服器能持續支持高負載。
   - **重點**：觀察吞吐量、錯誤率和資源消耗，確認伺服器的最大承載能力，並找出性能瓶頸。
4. **極大量用戶（500 位以上）**
   - **目標**：壓力測試極限，檢查伺服器在接近或超過最大負載時的性能行為。
   - **建議運行時間**：
     - **短期測試**：5-10 分鐘，檢查伺服器的瞬時響應和容錯能力。
     - **中期測試**：30 分鐘至 1 小時，觀察高並發下的長時間運行行為。
     - **長期測試**：視具體需求而定，通常不建議在極大量用戶下進行長期測試，以避免對伺服器造成過大負荷。
   - **重點**：關注伺服器是否會崩潰或拒絕服務，並分析系統的恢復能力和錯誤處理。

#### 簡單來說
- **少量用戶測試**適合初步驗證和低負載情境。
- **中等用戶測試**是模擬真實使用環境的理想選擇，適合大多數應用。
- **大量和極大量用戶測試**用於發掘伺服器的性能極限和瓶頸，適合高負載應用的最終驗證。

這樣的分級測試建議可以根據您的測試需求靈活選擇適當的運行時間和觀察重點。

## 5. 分析測試結果

### 結果分析
1. 在測試完成後，查看 "Aggregate Report" 和 "Summary Report" 中的數據。
2. 對比各指標（如延遲、TPS、錯誤率）數值，評估伺服器在不同負載下的反應。

#### 結果紀錄
- Number of Threads (Users)：設置為 100（模擬 100 個連接），Ramp-Up Period：設置為 10 秒，讓 100 個用戶在 10 秒內逐步連接。Loop Count：設置為 Forever 運行10分鐘。
<img width="939" alt="Screenshot 2024-11-01 at 5 36 22 PM" src="https://github.com/user-attachments/assets/6dd635ac-4233-4698-ac1b-14d953527d83">
<img width="1042" alt="Screenshot 2024-11-01 at 5 36 43 PM" src="https://github.com/user-attachments/assets/948a9b85-e775-4c55-bd9e-0747a361b62e">
<img width="1563" alt="Response Time Graph" src="https://github.com/user-attachments/assets/7d3cbef5-54b1-4bd7-b11b-24bf78eeed1d">
<img width="1563" alt="Graph Results" src="https://github.com/user-attachments/assets/f5b4af0c-2895-4212-8063-d0498ab68f2b">

- Number of Threads (Users)：設置為 500（模擬 500 個連接），Ramp-Up Period：設置為 10 秒，讓 500 個用戶在 10 秒內逐步連接。Loop Count：設置為 Forever 運行10分鐘。

<img width="1062" alt="Screenshot 2024-11-01 at 5 48 10 PM" src="https://github.com/user-attachments/assets/0e40827b-e09f-4a1e-948a-7efb05ab8635">
<img width="942" alt="Screenshot 2024-11-01 at 5 48 45 PM" src="https://github.com/user-attachments/assets/06c07f2c-36a2-4f9b-a54b-72f541227fde">
<img width="1522" alt="Screenshot 2024-11-01 at 5 49 22 PM" src="https://github.com/user-attachments/assets/65865ace-2e76-48d1-9d9a-dcc370c63220">

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

