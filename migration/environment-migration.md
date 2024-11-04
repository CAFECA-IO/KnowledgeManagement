文章目錄

- [**遷移環境的理論與實作**](#遷移環境的理論與實作)
  - [**1. 前言**](#1-前言)
    - [**什麼是環境遷移**](#什麼是環境遷移)
    - [**為什麼需要環境遷移**](#為什麼需要環境遷移)
    - [**常見的遷移場景**](#常見的遷移場景)
  - [**2. 遷移前的準備工作**](#2-遷移前的準備工作)
    - [**系統現況評估**](#系統現況評估)
    - [**風險評估**](#風險評估)
    - [**遷移計劃制定**](#遷移計劃制定)
    - [**資源盤點**](#資源盤點)
    - [**備份策略**](#備份策略)
  - [**3. 遷移策略**](#3-遷移策略)
    - [**大爆炸式遷移 (Big Bang Migration)**](#大爆炸式遷移-big-bang-migration)
    - [**漸進式遷移 (Phased Migration) / 增量遷移 (Incremental Migration)**](#漸進式遷移-phased-migration--增量遷移-incremental-migration)
    - [**平行運行策略 (Parallel Running)**](#平行運行策略-parallel-running)
    - [**各策略的優缺點比較**](#各策略的優缺點比較)
  - [**4. 技術實作重點 (以 isunfa 為例)**](#4-技術實作重點-以-isunfa-為例)
    - [**從雲端遷移到本地機器並容器化相關服務**](#從雲端遷移到本地機器並容器化相關服務)
    - [**遷移流程總覽**](#遷移流程總覽)
    - [**回滾流程概覽**](#回滾流程概覽)
    - [**4.1 環境配置管理**](#41-環境配置管理)
      - [**使用 Docker/容器化**](#使用-docker容器化)
      - [**配置文件管理**](#配置文件管理)
    - [**4.2 資料庫遷移**](#42-資料庫遷移)
      - [**資料備份**](#資料備份)
      - [**資料還原**](#資料還原)
      - [**Schema 遷移**](#schema-遷移)
    - [**資料庫遷移驗證**](#資料庫遷移驗證)
      - [**1. Schema 驗證**](#1-schema-驗證)
      - [**2. 資料驗證**](#2-資料驗證)
      - [**3. 效能驗證**](#3-效能驗證)
      - [**4. 驗證結果處理**](#4-驗證結果處理)
    - [**4.3 媒體文件遷移**](#43-媒體文件遷移)
      - [**媒體文件備份**](#媒體文件備份)
      - [**媒體文件還原**](#媒體文件還原)
    - [**4.3 程式碼部署**](#43-程式碼部署)
      - [**CI/CD 調整**](#cicd-調整)
      - [**回滾機制**](#回滾機制)
  - [**5. 測試與驗證**](#5-測試與驗證)
    - [**單元測試策略**](#單元測試策略)
    - [**整合測試計劃**](#整合測試計劃)
    - [**效能測試**](#效能測試)
    - [**用戶驗收測試 (UAT)**](#用戶驗收測試-uat)
  - [**6. 遷移執行**](#6-遷移執行)
    - [**遷移時間規劃**](#遷移時間規劃)
    - [**執行清單 (Checklist)**](#執行清單-checklist)
    - [**監控機制**](#監控機制)
    - [**問題處理流程**](#問題處理流程)
  - [**7. 遷移後續**](#7-遷移後續)
    - [**效能監控**](#效能監控)
    - [**問題追蹤**](#問題追蹤)
    - [**文件更新**](#文件更新)
    - [**維護計劃**](#維護計劃)
  - [參考資料](#參考資料)

# **遷移環境的理論與實作**

在軟體開發與運維的過程中，環境遷移是一項關鍵且複雜的任務。無論是從本地環境遷移到雲端，或是在不同的伺服器之間轉移服務，成功的遷移都能確保系統的穩定性與持續性。本指南將從理論基礎到實作細節，全面介紹環境遷移的各個方面，並以容器化服務的遷移為實例，提供具體的操作步驟與最佳實踐。

## **1. 前言**

### **什麼是環境遷移**

環境遷移指的是將應用程式、資料庫、配置文件及相關資源從一個運行環境轉移到另一個運行環境的過程。這可能涉及從開發環境到生產環境的遷移，或是跨平台、跨雲服務供應商的轉移。

### **為什麼需要環境遷移**

隨著業務需求的變化與技術的進步，原有的運行環境可能無法滿足新的要求。例如，提高系統性能、擴展服務、降低成本或增強安全性，都是促使環境遷移的常見原因。此外，遷移到更先進的基礎設施也能提升開發與運維效率。

### **常見的遷移場景**

- **平台升級**：從舊版本的作業系統或應用伺服器升級到新版本。
- **雲端遷移**：將本地部署的服務遷移到雲端，如 AWS、Azure 或 GCP。
- **回流遷移 (Cloud repatriation)**：將原先部署在雲端的應用或服務遷移回本地或內部數據中心。
- **服務轉移**：將服務從一個伺服器群轉移到另一個，如從單一伺服器遷移到 Docker Swarm 或 Kubernetes 集群。
- **數據中心搬遷**：將整個數據中心的資源移至新的位置或供應商。

## **2. 遷移前的準備工作**

### **系統現況評估**

在進行環境遷移前，需全面了解現有系統的架構、依賴關係與資源使用情況。這包括：

- **應用架構**：單體應用(monolithic architecture)或微服務架構(microservices architecture)。
- **依賴項目**：第三方服務、資料庫、API 等。
- **資源使用**：CPU、記憶體、存儲與網路資源的使用情況。

### **風險評估**

評估遷移過程中可能遇到的風險，例如：

- **停機時間**：遷移過程中系統可能無法使用，需評估可接受的停機時間。
- **數據丟失**：在數據轉移過程中確保不會丟失或損壞數據。
- **功能中斷**：確保所有功能在新環境中正常運行。

### **遷移計劃制定**

制定詳細的遷移計劃，包括：

- **時間表**：遷移的開始與結束時間。
- **步驟與流程**：每個遷移步驟的具體操作與負責人。
- **回滾方案**：若遷移失敗，如何快速恢復到原有環境。

### **資源盤點**

確保新環境具備遷移所需的所有資源，包括：

- **硬體資源**：伺服器、存儲設備等。
- **軟體資源**：操作系統、應用程式、依賴庫等。
- **網路資源**：IP 位址、網域名稱、SSL 憑證等。

### **備份策略**

在遷移前，盤點所有需要備份的數據，包含但不限於資料庫、媒體文件、配置文件。

## **3. 遷移策略**

### **大爆炸式遷移 (Big Bang Migration)**

**定義**：在短時間內將所有服務與數據一次性遷移到新環境。

**優點**：

- 簡單直接，易於管理。
- 遷移過程短，降低長期遷移引發的風險。

**缺點**：

- 風險較高，若遷移過程中出現問題，將影響整個系統。
- 難以逐步驗證每個部分的正常運行。

![1](https://github.com/user-attachments/assets/abffb9bd-ca9b-4e07-aa98-0e687c55eb46)

### **漸進式遷移 (Phased Migration) / 增量遷移 (Incremental Migration)**

**定義**：分階段逐步將服務與數據遷移到新環境，每次遷移部分功能。

**優點**：

- 風險較低，易於發現與修復問題。
- 可逐步驗證新環境的穩定性。

**缺點**：

- 遷移時間較長，需要更細緻的計劃與管理。
- 需要在舊環境與新環境間保持同步。

![2](https://github.com/user-attachments/assets/636a96d0-05aa-46fa-ad0d-88586594532d)

### **平行運行策略 (Parallel Running)**

**定義**：新舊環境同時運行一段時間，逐步將流量轉移到新環境。

**優點**：

- 可即時比較新舊環境的運行情況。
- 降低系統中斷風險。

**缺點**：

- 增加資源成本，需同時維護兩套環境。
- 複雜的流量管理與同步機制。

![3](https://github.com/user-attachments/assets/be85ec66-465f-4104-a1b2-6b65d4a22ff7)

### **各策略的優缺點比較**

| 策略         | 優點                   | 缺點                     |
| ------------ | ---------------------- | ------------------------ |
| 大爆炸式遷移 | 簡單直接、遷移時間短   | 風險高、難以回滾         |
| 漸進式遷移   | 風險低、易於驗證       | 遷移時間長、計劃複雜     |
| 平行運行策略 | 即時比較、降低中斷風險 | 資源成本高、流量管理複雜 |

## **4. 技術實作重點 (以 [isunfa](https://github.com/CAFECA-IO/ServerSwarm/tree/develop/isunfa) 為例)**

### **從雲端遷移到本地機器並容器化相關服務**

在將服務從雲端遷移到本地機器時，容器化是一項關鍵技術，能夠確保應用程式及其依賴環境在不同平台上的一致性與可移植性。本節將探討容器化的實作重點，並提供通用的操作步驟。以資料庫為 Postgres 舉例實作。實作方法是大爆炸式遷移加上漸進式遷移，一口氣備份舊環境的資料，在另一台機器上驗證每一步的遷移，最後透過 DNS 切換，將流量導向新環境。

![1](https://github.com/user-attachments/assets/d72187dd-ec8b-4a7f-8e03-87021caa3865)
![2](https://github.com/user-attachments/assets/f17e6830-7d24-4b99-b6fb-e9afd966fa8c)

### **遷移流程總覽**

```mermaid
graph TB
    Start[開始遷移] --> Prep[準備階段]

    %% 準備階段
    Prep --> EnvConfig[環境配置管理]
    Prep --> DBPrep[資料庫準備]
    Prep --> MediaPrep[媒體文件準備]

    %% 環境配置管理
    EnvConfig --> Docker[容器化服務]
    EnvConfig --> Config[配置文件管理]
    Docker --> DockerCompose[編寫 Docker Compose]
    Docker --> BuildImage[建立映像檔]
    Config --> EnvFile[環境變數設定]
    Config --> Secrets[機密資訊管理]

    %% 資料庫遷移
    DBPrep --> Backup[資料庫備份]
    DBPrep --> Schema[Schema 遷移]
    DBPrep --> DataMigrate[資料遷移]
    Backup --> BackupVerify[備份驗證]
    Schema --> SchemaDiff[Schema 差異比對]
    DataMigrate --> DataVerify[資料驗證]

    %% 媒體文件遷移
    MediaPrep --> MediaBackup[媒體檔案備份]
    MediaPrep --> MediaTransfer[媒體檔案傳輸]
    MediaBackup --> MediaVerify[備份驗證]

    %% 部署階段
    DockerCompose --> Deploy[部署服務]
    EnvFile --> Deploy
    BackupVerify --> Deploy
    MediaVerify --> Deploy

    %% 驗證階段
    Deploy --> Testing[測試與驗證]
    Testing --> UnitTest[單元測試]
    Testing --> IntegTest[整合測試]
    Testing --> UAT[使用者驗收測試]

    %% 結果判斷
    Testing --> Success{測試通過?}
    Success -->|是| Done[完成遷移]
    Success -->|否| Rollback[執行回滾]
    Rollback --> Prep

    %% 完成後監控
    Done --> Monitor[持續監控]
    Monitor --> Performance[效能監控]
    Monitor --> ErrorTracking[錯誤追蹤]
    Monitor --> Maintenance[維護管理]
```

### **回滾流程概覽**

```mermaid
graph TB
    Start[開始回滾] --> DetectIssue[問題偵測]

    %% 問題偵測
    DetectIssue --> Auto[自動偵測]
    DetectIssue --> Manual[人工回報]
    Auto --> Alert[告警觸發]
    Manual --> Report[問題回報]

    %% 評估階段
    Alert --> Evaluate[問題評估]
    Report --> Evaluate
    Evaluate --> Decision{需要回滾?}

    %% 回滾執行
    Decision -->|是| StopService[停止服務]
    Decision -->|否| Monitor[持續監控]

    StopService --> Backup[執行備份]
    Backup --> RollbackType{回滾類型}

    %% 不同類型的回滾
    RollbackType -->|資料庫| DBRollback[資料庫回滾]
    RollbackType -->|檔案系統| FSRollback[檔案系統回滾]
    RollbackType -->|容器服務| ContainerRollback[容器回滾]
    RollbackType -->|程式碼| CodeRollback[程式碼回滾]

    %% 程式碼回滾細節
    CodeRollback --> GitRollback[Git 版本回退]
    GitRollback --> UpdateDeps[更新相依套件]
    UpdateDeps --> RebuildImage[重新建立映像檔]

    %% 回滾後處理
    DBRollback --> Verify[驗證回滾結果]
    FSRollback --> Verify
    ContainerRollback --> Verify
    RebuildImage --> Verify

    %% 結果確認
    Verify --> Success{回滾成功?}
    Success -->|是| Restart[重啟服務]
    Success -->|否| StopService

    %% 完成流程
    Restart --> Test[功能測試]
    Test --> Done[完成回滾]
    Done --> PostMortem[事後檢討]
    PostMortem --> Update[更新文件與回滾腳本]
```

### **4.1 環境配置管理**

#### **使用 Docker/容器化**

容器化技術能夠將應用程式及其依賴環境封裝在一起，確保在不同環境中一致運行。透過 Docker Compose，可以管理多個容器，使得部署與遷移更加簡便。具體步驟如下：

1. **安裝 Docker 與 Docker Compose**

   - 確保本地機器上已安裝最新版本的 Docker 及 Docker Compose。
   - 使用以下指令檢查安裝版本：

     ```bash
     docker --version
     docker-compose --version

     ```

2. **編寫 Docker Compose 文件**
   - 根據應用程式的需求，編寫 `docker-compose.yml` 文件，定義各個服務的配置、網路與卷（Volumes）。
   - 例如：
     ```yaml
     version: "3.8"
     services:
       app:
         image: your-app-image
         ports:
           - "80:80"
         environment:
           - DATABASE_URL=postgres://user:password@db:5432/app_db
       db:
         image: postgres:13
         volumes:
           - db-data:/var/lib/postgresql/data
         environment:
           - POSTGRES_USER=user
           - POSTGRES_PASSWORD=password
           - POSTGRES_DB=app_db
     volumes:
       db-data:
     ```
3. **啟動容器**

   - 使用以下指令啟動所有定義的服務：

     ```bash
     docker-compose up -d

     ```

#### **配置文件管理**

配置文件（如 `.env` 文件）存儲了應用程式的各項參數，如資料庫連接資訊、服務域名等。在遷移過程中，需確保這些配置文件在新環境中正確設定。

1. **建立與修改 `.env` 文件**

   - 根據本地環境的需求，修改 `.env` 文件中的參數。
   - 例如：

     ```
     DATABASE_URL=postgres://user:password@localhost:5432/app_db
     APP_ENV=production

     ```

2. **環境變數處理**

   - 確保所有必要的環境變數在容器啟動時正確載入。
   - 可以在 `docker-compose.yml` 中引用 `.env` 文件：
     ```yaml
     services:
       app:
         env_file:
           - .env
     ```

3. **掛載文件**

   - 將 docker 容器運行的數據導出到機器裡，避免 docker 重啟造成遺失數據
   - 在 docker-compose.yml 編寫 volumes:

     - `<主機路徑>:<容器路徑>:<選項>`

     ```yaml
     services:
       web:
         image: nginx
         volumes:
           - ./src:/var/www/html:ro # 唯讀掛載到主機的 `./src` 下
           - logs:/var/log/nginx # 命名卷
           - /etc/localtime:/etc/localtime:ro # 同步主機時間
           - ./nginx.conf:/etc/nginx/nginx.conf:delegated # 優化性能的掛載

     volumes:
       logs:
     ```

### **4.2 資料庫遷移**

資料庫是應用程式的核心，遷移資料庫需特別謹慎。

#### **資料備份**

使用適當的工具進行資料庫備份，確保在遷移過程中不會遺失任何數據。例如，使用 PostgreSQL 的 `pg_dump` 工具：

```bash
pg_dump -U <your_username> -h <cloud_db_host> -p <port> -F c -b -v -f backup.dump <database_name>
```

#### **資料還原**

將備份的資料庫恢復到本地機器上的新資料庫中：

```bash
pg_restore -U <local_username> -h localhost -p <local_port> -d <local_database_name> -v backup.dump
```

#### **Schema 遷移**

確保新環境中的資料庫 schema 與舊環境一致，以避免不兼容問題。可以使用資料庫遷移工具如 Flyway 或 Liquibase 來管理 schema 版本控制。

### **資料庫遷移驗證**

#### **1. Schema 驗證**

1. **表格結構比對**

   ```sql
   -- 比對表格結構
   SELECT
       table_schema,
       table_name,
       column_name,
       data_type,
       character_maximum_length,
       is_nullable
   FROM information_schema.columns
   WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
   ORDER BY table_schema, table_name, ordinal_position;
   ```

2. **索引檢查**

   ```sql
   -- 檢查索引資訊
   SELECT
       schemaname,
       tablename,
       indexname,
       indexdef
   FROM pg_indexes
   WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
   ORDER BY schemaname, tablename;
   ```

3. **約束條件檢查**
   ```sql
   -- 檢查約束條件
   SELECT
       tc.constraint_name,
       tc.constraint_type,
       tc.table_name,
       kcu.column_name
   FROM information_schema.table_constraints tc
   JOIN information_schema.key_column_usage kcu
       ON tc.constraint_name = kcu.constraint_name
   WHERE tc.table_schema NOT IN ('pg_catalog', 'information_schema')
   ORDER BY tc.table_name;
   ```

#### **2. 資料驗證**

1. **資料量檢查**

   ```sql
   -- 檢查各表資料量
   SELECT
       schemaname,
       relname as table_name,
       n_live_tup as row_count
   FROM pg_stat_user_tables
   ORDER BY schemaname, relname;

   -- 比對來源與目標資料庫的資料量差異
   WITH source_counts AS (
       -- 來源資料庫的計數
   ), target_counts AS (
       -- 目標資料庫的計數
   )
   SELECT
       s.table_name,
       s.row_count as source_count,
       t.row_count as target_count,
       s.row_count - t.row_count as difference
   FROM source_counts s
   JOIN target_counts t ON s.table_name = t.table_name
   WHERE s.row_count != t.row_count;
   ```

2. **資料完整性檢查**

   ```sql
   -- 檢查空值分佈
   SELECT
       column_name,
       COUNT(*) as total_rows,
       COUNT(*) FILTER (WHERE column_name IS NULL) as null_count,
       ROUND(COUNT(*) FILTER (WHERE column_name IS NULL)::numeric / COUNT(*) * 100, 2) as null_percentage
   FROM your_table
   GROUP BY column_name;

   -- 檢查外鍵完整性
   SELECT
       tc.table_schema,
       tc.table_name,
       kcu.column_name,
       ccu.table_name AS foreign_table_name,
       ccu.column_name AS foreign_column_name
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu
       ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
       ON ccu.constraint_name = tc.constraint_name
   WHERE constraint_type = 'FOREIGN KEY';
   ```

3. **抽樣資料比對**
   ```sql
   -- 對大表進行抽樣比對
   WITH sample_data AS (
       SELECT *
       FROM your_table
       ORDER BY random()
       LIMIT 1000
   )
   -- 進行來源和目標資料庫的比對
   ```

#### **3. 效能驗證**

1. **查詢效能測試**

   ```sql
   -- 開啟查詢計時
   \timing

   -- 執行常用查詢並比較執行計畫
   EXPLAIN ANALYZE
   SELECT /* 您的查詢 */;

   -- 檢查查詢統計資訊
   SELECT
       schemaname,
       relname,
       seq_scan,
       seq_tup_read,
       idx_scan,
       idx_tup_fetch
   FROM pg_stat_user_tables;
   ```

2. **索引使用情況**
   ```sql
   -- 檢查索引使用統計
   SELECT
       schemaname,
       relname,
       indexrelname,
       idx_scan,
       idx_tup_read,
       idx_tup_fetch
   FROM pg_stat_user_indexes;
   ```

#### **4. 驗證結果處理**

1. **問題記錄**

   - 建立問題追蹤表格記錄發現的問題
   - 標記問題的嚴重程度和優先順序
   - 指派負責人進行修復

2. **可能的修正流程舉例**

   ```sql
   -- 建立修正腳本範本
   BEGIN;
   -- 進行必要的修正
   -- 例如：更新錯誤的資料
   UPDATE table_name
   SET column_name = correct_value
   WHERE condition;

   -- 驗證修正結果
   SELECT * FROM table_name
   WHERE condition;

   -- 確認無誤後提交
   COMMIT;
   ```

3. **驗證報告**
   - 記錄驗證過程和結果
   - 製作驗證報告，包含：
     - Schema 驗證結果
     - 資料完整性檢查結果
     - 效能測試結果
     - 發現的問題和解決方案
     - 建議的後續改進事項

### **4.3 媒體文件遷移**

除了資料庫，媒體文件（如圖片、視頻等）也是應用程式的重要組成部分，遷移時需特別注意其完整性與可用性。

#### **媒體文件備份**

確保所有媒體文件都已妥善備份。可以使用 `rsync` 或其他備份工具將媒體文件從雲端存儲轉移至本地。

在傳輸時，推薦使用壓縮檔進行傳輸，可透過解壓縮判斷傳書過來的檔案是否有破損。

```bash
rsync -avz user@cloud_server:/path/to/media /local/path/to/media

```

#### **媒體文件還原**

將備份的媒體文件還原到本地機器上的指定目錄。確保目錄結構與應用程式配置一致。

```bash
rsync -avz /local/path/to/media user@local_server:/path/to/media

```

### **4.3 程式碼部署**

將程式碼存放在如 GitHub 等遠端倉庫上備份，方便在多個地方部署跟追蹤版本。

#### **CI/CD 調整**

透過排程工具（如 ofelia）在容器環境中執行定時任務，實現自動化部署與更新。

1. **設定自動更新參數**

   - 在各服務的環境變數文件中設定必要參數：
     - Git 倉庫資訊（repository URL、branch）
     - 部署路徑
     - 更新腳本路徑
     - 環境變數配置
   - 在排程配置文件中設定更新頻率與執行條件

2. **配置自動化部署**
   ```yaml
   services:
     scheduler: # 排程服務，可使用 ofelia、jenkins 等工具
       image: <scheduler-image>
       restart: always
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock:ro # 如需操作 Docker
         - ./scheduler/config:/etc/scheduler/config # 排程配置
       environment:
         - TZ=Asia/Taipei # 時區設定
       depends_on: # 確保依賴服務已啟動
         service1:
           condition: service_healthy
         service2:
           condition: service_healthy
       deploy:
         resources:
           limits:
             memory: 1G # 根據需求調整
   ```

#### **回滾機制**

當部署或遷移過程中出現問題時，可以透過以下步驟進行回滾：

1. **服務停止與清理**

   ```bash
   # 停止特定服務
   docker compose stop <service-name>

   # 或停止所有服務
   docker compose down

   # 需要時清理容器和資料
   docker system prune -f  # 清理未使用的容器、網路等
   ```

2. **重新部署服務**

   ```bash
   # 基本部署
   docker compose up -d

   # 使用特定配置檔案
   docker compose -f docker-compose.yml -f docker-compose.<env>.yml up -d

   # 部署特定服務
   docker compose up -d <service-name>
   ```

3. **資料回滾**

   - 暫停相關服務：
     ```bash
     docker compose stop <database-service>
     ```
   - 清理受影響的資料（謹慎操作）：
     ```bash
     rm -rf ./data/<service-data-path>
     ```
   - 重啟服務：
     ```bash
     docker compose up -d <database-service>
     ```
   - 還原資料備份：

     ```bash
     # 資料庫還原（以 PostgreSQL 為例）
     pg_restore -U <username> -h <host> -p <port> -d <database> -v <backup-file>

     # 檔案系統還原
     rsync -avz <backup-path> <restore-path>
     ```

4. **驗證回滾結果**

   - 檢查服務連接：

     ```bash
     # 資料庫連接字串範例
     DATABASE_URL = <database-type>://<username>:<password>@<host>:<port>/<database>

     # 檢查服務狀態
     docker compose ps
     docker logs <container-name>
     ```

   - 資料完整性驗證：

     ```sql
     -- 檢查資料表結構與記錄數
     SELECT
         schemaname as schema,
         tablename as table,
         n_live_tup as rows
     FROM pg_stat_user_tables
     ORDER BY schemaname, tablename;

     -- 檢查特定表格資料量
     SELECT COUNT(*) FROM <schema>.<table>;
     ```

   - 功能測試：
     - 執行關鍵功能的測試案例
     - 驗證 API 端點的可用性
     - 確認資料的一致性

## **5. 測試與驗證**

遷移完成後，需進行全面的測試與驗證，確保新環境運行正常。

### **單元測試策略**

對應用程式的各個模組進行單元測試，確保每個部分獨立運行正常。

1. **撰寫與執行單元測試**

   - 使用測試框架如 Jest、JUnit 來撰寫測試案例。
   - 執行測試指令：

     ```bash
     npm test

     ```

### **整合測試計劃**

進行整合測試，確認不同模組之間的協作不受影響。例如，前端與後端的交互是否順暢。

1. **設計整合測試案例**
   - 測試 API 端點的正確性與穩定性。
   - 確認資料流與功能流程的完整性。
2. **執行整合測試**
   - 使用工具如 Postman、Selenium 進行自動化測試。

### **效能測試**

評估新環境的效能表現，確保其達到預期的性能指標。

1. **進行壓力測試**
   - 使用工具如 Apache JMeter、Locust 來模擬高負載情況。
   - 評估系統在高並發下的穩定性與響應時間。
2. **性能基準比較**
   - 將本地環境的效能數據與雲端環境進行對比，確保遷移後系統表現不低於預期。

### **用戶驗收測試 (UAT)**

邀請實際用戶參與測試，確保系統在新環境下滿足用戶需求。

1. **設計 UAT 案例**
   - 根據真實使用情境，設計用戶操作流程。
   - 確認關鍵功能的可用性與穩定性。
2. **收集用戶反饋**
   - 透過問卷或訪談收集用戶的使用體驗與問題反饋。
   - 根據反饋進行必要的調整與優化。

## **6. 遷移執行**

### **遷移時間規劃**

選擇合適的時間窗口進行遷移，避免高峰時段對用戶造成影響。通常選擇用戶活動較少的時間段，如夜間或週末。

### **執行清單 (Checklist)**

制定詳細的遷移執行清單，確保每個步驟都有條不紊地完成。範例如下：

1. **前置作業**
   - 完成系統現況評估與風險評估。
   - 確認新環境的資源準備就緒。
   - 執行完整的數據備份。
2. **遷移步驟**
   - 將應用程式與資料庫備份下載至本地。
   - 在本地機器上配置 Docker 與 Docker Compose。
   - 部署容器並還原資料庫。
   - 停止雲端上的相關服務。
   - 配置網路與域名設定。
3. **後置作業**
   - 執行測試與驗證。
   - 監控系統運行狀況。
   - 收集並處理用戶反饋。

### **監控機制**

設置全面的監控機制，實時監控系統的運行情況，及時發現並處理問題。可以使用工具如 Prometheus、Grafana 進行資源監控與視覺化。

1. **配置監控工具**
   - 安裝並配置 Prometheus 以收集系統指標。
   - 使用 Grafana 創建監控儀表板，實時展示關鍵指標。
2. **設置告警規則**
   - 根據預設的閾值設置告警，當系統異常時及時通知相關人員。

### **問題處理流程**

建立問題處理流程，確保在遷移過程中出現問題時，能夠迅速響應並解決。

1. **問題識別**
   - 透過監控工具及用戶反饋識別問題。
2. **問題分類與優先級設定**
   - 根據問題嚴重性與影響範圍，進行分類與優先級設定。
3. **問題解決**
   - 指派相應的技術人員進行問題排查與修復。
4. **問題回顧**
   - 在問題解決後，進行回顧分析，防止類似問題再次發生。

## **7. 遷移後續**

### **效能監控**

持續監控新環境的效能，確保系統運行穩定。定期檢視監控數據，進行性能優化與資源調整。

1. **定期檢查監控儀表板**
   - 確認 CPU、記憶體、存儲與網路的使用情況。
2. **性能優化**
   - 根據監控數據，調整容器資源限制與服務配置，提升系統效能。

### **問題追蹤**

建立問題追蹤系統，記錄並解決在遷移後出現的問題。使用工具如 Jira、Trello 、GitHub issues 來管理問題追蹤。

1. **記錄問題**
   - 將所有發現的問題記錄在問題追蹤系統中，詳細描述問題現象與影響範圍。
2. **分配與解決**
   - 指派相關人員負責解決問題，並追蹤進度。
3. **關閉問題**
   - 在問題解決並確認後，將其標記為已解決。

### **文件更新**

更新所有相關的技術文件與使用手冊，確保與新環境保持一致。

1. **更新遷移文檔**
   - 詳細記錄遷移過程中的步驟、遇到的問題與解決方案。
2. **更新使用手冊**
   - 根據新環境的配置與操作流程，更新應用程式的使用手冊。

### **維護計劃**

制定長期的維護計劃，定期檢查系統狀態，進行必要的優化與升級。

1. **定期系統檢查**
   - 每月進行一次系統健康檢查，確保所有服務運行正常。
2. **安全性更新**
   - 定期更新操作系統與應用程式的安全補丁，防止潛在的安全威脅。
3. **資源優化**
   - 根據系統使用情況，調整資源配置，提升資源利用率。

透過上述步驟，確保從雲端遷移到本地機器並容器化相關服務的過程順利進行，並在遷移後保持系統的正常運行與持續優化。

## 參考資料

- [Monolith Architecture](https://tech.tamara.co/monolith-architecture-5f00270f384e)
- [How to Set up Docker Compose: Step-By-Step Tutorial](https://medium.com/@kaaiot/how-to-set-up-docker-compose-step-by-step-tutorial-9c339df67a2d)
- [Docker Compose Tutorial: How to Use It Effectively](https://medium.com/@vishwasacharya/docker-compose-tutorial-how-to-use-it-effectively-59c1146af97f)
- [Introduction to monitoring with Prometheus & Grafana](https://medium.com/@dineshmurali/introduction-to-monitoring-with-prometheus-grafana-ea338d93b2d9)
- [pg_dump — extract a PostgreSQL database into a script file or other archive file](https://www.postgresql.org/docs/current/app-pgdump.html#:~:text=pg_dump%20is%20a%20utility%20for,only%20dumps%20a%20single%20database.)
