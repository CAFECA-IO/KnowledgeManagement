# Squashing Migrations
以 iSunFA with Prisma 為例

![squashing_migrations_02_42_36](https://github.com/user-attachments/assets/d8ef1cd2-4e03-412f-8072-324a9162371d)

## 什麼是 Database Migration
Database Migration 指當應用程式的 DB Schema 有變動時，將這些結構變更以「可完全再現流程的程式碼」記錄並套用到資料庫。每一次 schema 的新增、刪除或修改，都會對應產生一份 migration 檔案，這樣可以保證整個團隊及所有部署環境的資料庫在任何時間的版本，都能在保留資料完整的情況下更新至最新版本的資料庫結構。

### Database Migration 是資料庫世界的「版本控制」
簡單來說，Database Migration 它解決了以下問題：
1. 讓資料庫從 A 狀態可靠地變更成 B
2. 讓不同開發環境、測試環境、正式環境都套用一樣的資料庫變更
3. 追蹤誰在什麼時候對資料庫做了什麼變動

### 以 iSunFA 資料庫為例
截至 2025-05-14 iSunFA 資料庫承襲自 [Beta](https://github.com/CAFECA-IO/iSunFA/releases/tag/v0.9.0) 版本的資料庫結構，初始版本共有 39 張資料表，在更新至 [RC1](https://github.com/CAFECA-IO/iSunFA/releases/tag/v0.10.0) 版本的歷程中，共經歷了 77 次以上的資料表變更，包含：
1. 新增資料表數：34 張
2. 刪除資料表數：3 張
3. 新增欄位操作次數：33 次
4. 刪除欄位操作次數：19 次
5. 欄位型別調整次數：5 次
6. 索引新增或刪除操作次數：52 次
這表示當你完成 iSunFA v0.9.0 部署並成功啟動後，將程式碼更新至 v0.10.0 再次啟動時，系統將因為資料庫版本差異而無法正常運作。

### 快速建立自己的資料庫環境來實驗吧
#### Step 0：使用 Docker 啟動本地資料庫容器
啟動 PostgreSQL 容器，對應 Prisma 預設參數
```shell
docker run --rm \
  --name isunfa-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=isunfa \
  -p 5432:5432 \
  -d postgres:15
```
```shell
docker ps
# 應可看到 postgres:15 容器運行中
```

#### Step 1：部署 Beta (v0.9.0) 版本與資料庫
```shell
# 下載 iSunFA
git clone https://github.com/CAFECA-IO/iSunFA
cd iSunFA

# 切換至指定版本
git checkout v0.9.0

# 安裝相依套件
npm install
```
```shell
# 設置資料庫環境
vi .env
```
```shell
# Database
DATABASE_URL = postgresql://postgres:postgres@127.0.0.1:5432/isunfa
```
```shell
# 執行 migration，建立 39 張表格
npx prisma migrate deploy

# 啟動應用（或可使用 docker-compose / dev 指令）
npm run start
```
此時應會正常啟動並連線至本地 PostgreSQL，此時資料庫為 Beta Schema（39 張資料表）。

#### Step 2：直接切換至 RC1（v0.10.0），模擬未執行 Migration
```shell
git checkout v0.10.0
npm install
npm run start
```
此時應會出現錯誤，例如：
```shell
PrismaClientInitializationError: Table 'certificate_rc2' has no column named 'note'
```
```shell
Invalid enum value for column 'direction'
```

#### Step 3：執行對應的 Migration 再次啟動
```shell
# 確保在 v0.10.0 分支下
npx prisma migrate deploy
npm run start
# 應用成功啟動
```

#### Step 4: 試著建立一個新的 DB Migration 吧
那麼當我在開發過程需要更新資料庫結構該怎麼做？是時候來進行一次新的 migration 實驗了！
讓我們模擬開發新功能時需要建立一張新的資料表的情境，此時打開 `schema.prisma` 加入一張新的測試資料表：
```shell
model Test {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
}
```
然後執行以下指令產生新的 migration，請注意以下指令會**清空資料庫**，必須在**自己的測試環境**中執行：
```shell
npx prisma migrate dev --name 029_create-test-table
```
Prisma 會根據你剛剛新增的 Test 資料表，自動產生一份新的 migration SQL 並存放至 prisma/migrations/ 目錄。

#### Extra Step：重置實驗環境資料庫
執行以下指令可以將本地實驗用資料庫清空，重複進行實驗
```shell
# 停止容器
docker stop isunfa-db

# 重新啟動乾淨資料庫
docker run --rm \
  --name isunfa-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=isunfa \
  -p 5432:5432 \
  -d postgres:15
```

### 「我們已經有 28 份 migration 檔案了！」「怎麼了嗎？」
隨著 iSunFA 專案演進，Migration 檔案已經累積來到 28 份，由於過多的遷移歷史會帶來以下的問題，因此我們需要定期阻止事態惡化：
1. 部署與設置變慢：新的環境（如新同事的本機、測試伺服器）需要從頭執行大量遷移腳本才能建立最新 schema，隨著文件數量增加，初次建立資料庫所花時間變長。
2. 部署流程負擔：每次部署到正式環境時，都必須重放所有歷史遷移步驟，中間許多步驟其實最終狀態可能被後續修改覆蓋，但仍然得執行，導致部署耗時且可能有不必要的資料變動風險。
3. 版本衝突與管理複雜：當 Migration 檔案非常多，團隊在不同分支上修改 schema 時更容易產生衝突。許多歷史遷移可能包含重複或無效的中間步驟（例如先新增欄位又在之後移除）。維護長串的遷移記錄增加了理解成本，開發者需要花時間理清每個 Migration 做了什麼變更。
4. 執行風險累積：部分舊遷移腳本可能包含資料修正且耗時操作，在新的環境運行時，耗時愈長過程中發生不可預期的問題（晚上保全伯伯巡邏打瞌睡不小心踢到總電源開關）風險將愈高。隨著時間推進，資料庫有可能發生版本更新，早期的遷移腳本可能已不適用甚至造成錯誤。
5. CI/CD 時間變長：在 CI 測試流程中，如果每次跑測試都重建資料庫 schema，太多的遷移檔案會讓這個步驟變慢（目前 Vercel 一次 commit 需要 4 分鐘以上才能完成全部檢驗），影響整體整合速度。

## 什麼是 Squashing Migrations
所謂 Squashing Migrations（合併遷移），是指將多個歷史遷移檔案合併為一個或少數遷移，重建一個「壓縮」後的資料庫變更歷史。簡單來說，就是把過去許多次的資料庫變更整合成最終結果的一次變更，讓遷移記錄更簡潔，也就是說讓 iSunFA 將 000 至 028 的 migration.sql 重新壓縮成一個 000_init/migration.sql。

### 何時適合執行 Squashing Migrations
1. 開發一個大型功能或重構時產生了很多臨時的遷移。在功能完成準備合併回主幹分支前，可以將該分支上的多次遷移壓縮成一個，避免正式環境需要執行不必要的中間步驟。
2. 專案上線一段時間後，累積了大量遷移檔案（例如數十個以上），此時可以考慮定期（如每隔幾個版本）合併遷移，建立新的基準，減少未來新環境部署的負擔。
3. 當發現遷移歷史中有許多已經被取代的變更（如先加後刪的欄位）或繁瑣的資料轉換步驟，這些中間狀態對最終結果沒有意義時，可以透過合併來移除冗餘。
iSunFA RC1 版本新增了團隊機制，大量功能合併與統一名稱，同時大幅度改良憑證管理功能，涉及大量資料表變動，v0.10.1 整體 migration 檔案數提升了一倍以上，因此是迫切需要執行 Squashing Migrations 的時機。

### 為 Squashing Migrations 畫大餅
完成資料庫合併遷移後可以帶來以下好處：
1. 加速部署與建置：新的資料庫只需套用一個遷移檔案即可達到最新結構，顯著縮短建置系統時間。
2. 簡化維護：團隊成員只需關注當前的遷移檔案，過往變更已被整合，Migration 文件更精簡，減少理解成本。也降低了不同分支之間產生遷移衝突的可能性。
3. 降低風險：避免在正式環境執行可能耗時或具風險的舊遷移步驟。合併後的遷移檔案直接反映最終架構，省略了中途的資料操作，減少出錯機會。
4. 維持歷史可追溯：即使合併刪除了舊的遷移檔案，這些歷史仍可在版本控制中找到，需要時仍有依據。只是日常運行中不再需要逐一執行它們。
值得注意的是，合併遷移通常在確認目前資料庫狀態穩定且所有環境都已套用舊有遷移後進行。也就是說，所有環境的資料庫都應該事先更新至 [v0.10.1+8](https://github.com/CAFECA-IO/iSunFA/commit/148519d7ca1adedea2660c52c02eed5c82dc2ed3)，以免現有環境資料庫更新流程變得更複雜。

## 來動手做吧
### Prisma 對 Squashing Migration 的支援
Prisma 提供了相應的工具來實現遷移合併，儘管沒有一鍵式的 prisma migrate squash 指令，但可以透過 CLI 的幾個命令達成合併效果。Prisma 的遷移機制會在專案中保存一系列 migration 檔案與資料庫的 _prisma_migrations 版本紀錄表。合併遷移的關鍵在於：產生新的遷移 SQL 並讓 Prisma 知道舊的都已應用。
Prisma Migrate 提供了兩個關鍵指令來支援上述流程：
1. `prisma migrate diff`：比較兩個資料庫狀態之間的差異，輸出對應的 SQL 腳本。我們可以利用這個指令來產生「從基準狀態到目前最新 schema」的合併遷移腳本。一種典型用法是在合併所有歷史遷移時，將空資料庫做為起點，將目前 Prisma Schema 描述的最終資料庫結構做為目標，產生一份完整建構 schema 的 SQL。
2. `prisma migrate resolve`：用於調整 Prisma 在資料庫中的遷移記錄狀態。例如，可以標記某個遷移為已應用（applied）或已捨棄（rolled back）。在合併遷移時，這允許我們告訴 Prisma 某些遷移（如新的合併遷移）在特定環境已經手動套用或不需再執行，以維持狀態一致。

### 兩種典型的合併情境
1. 開發分支的遷移合併：在功能分支上產生了多個遷移，且還未部署到正式環境時，可以在合併回主線前進行 squash。開發者可刪除或移動掉該分支的歷史 migrations，利用 prisma migrate diff 產生一個涵蓋所有變更的新遷移，取代多個零碎的遷移檔案。如此主線只保留一筆乾淨的變更紀錄。這通常搭配 `prisma migrate dev --name <migration_name>` 等指令在本機重新生成單一遷移。
2. 正式環境的遷移歷史合併：當正式環境累積許多遷移紀錄，考慮全面壓縮時，步驟是在版本控制中整合所有舊遷移為一個新的 migration 檔案。使用 prisma migrate diff 從空白到現有 schema 生出完整腳本，然後在正式環境使用 prisma migrate resolve 將此新的遷移標記為已執行（因為正式庫其實已經是最新狀態）。新的環境則只需執行這一個合併後的遷移檔案即可得到所需的結構。
值得注意的是，Prisma 合併遷移仍需由開發者手動執行上述步驟，審核自動生成的 SQL。

### from BETA to RC1: Prisma Migration 歷程回顧
簡單回顧專案歷來的遷移操作涵蓋的內容，大家可以在未來開發新功能時參考，或在未來優化資料庫遷移計劃：
1. 建立資料表：新增新的資料表結構。例如建立 email_login 表，用於儲存使用電子郵件登入的驗證碼資訊。
2. 刪除資料表：移除不再需要的資料表。例如在遷移中刪除了 user_certificate 和 user_voucher 兩個表，清理舊有的關聯紀錄表。
3. 新增欄位：在既有表中增加新的欄位。例如在 certificate_rc2 表中新增了 description（TEXT）、incomplete（BOOLEAN，預設 true）以及 note（JSONB）等欄位，以擴充憑證資料。
4. 刪除欄位：從資料表中移除欄位。例如將 certificate_rc2 表原有的 input_or_output 欄位刪除，因需求變更而不再使用。
5. 欄位修改：調整現有欄位的結構或約束，包括資料型別、預設值、是否允許 NULL 等變更。例如將 certificate_rc2 表中 direction 欄位的型別從文字改為新的 Enum 型別（並確保其非空），以及設定時間欄位如 created_at 的預設值為 NOW()（當前時間）。
6. 新增索引：為了優化查詢或強制約束，新增索引或唯一鍵。例如替 invoice_rc2 表的 certificate_id 欄位建立唯一索引，避免重複關聯。
7. 關聯（外鍵）新增/移除：增加新的外鍵約束來維持參考完整性，或移除舊的外鍵以解除關聯限制。例如新增 file.thumbnail_id 欄位後，為其加上引用 file.id 的外鍵關聯（自身關聯），設定為當對應檔案刪除時設為 NULL。又如在重構時移除了 user_certificate 表對 user 和 certificate 的外鍵約束，為刪除整張表做準備。
8. Enum（列舉類型）新增/變更：建立新的 Enum 型別，或修改既有 Enum 的可選值集合。例如創建 DeductionType 列舉以表示扣抵類別；又例如在既有 CertificateType 列舉中加入新的值 'OUTPUT_33' 和 'OUTPUT_34' 以因應新的業務類型。當某些 Enum 值不再使用時，遷移中也會透過替換 Enum 型別的方式來移除舊值（先建立新 Enum、遷移資料後刪除舊 Enum）以避免直接刪值的限制。
9. 資料遷移：除了結構上的變更，部分遷移檔案也包含對現有資料的批次修改，以符合新的結構要求。例如將 user_role 表中舊有的角色名稱 'BOOKKEEPER'、'EDUCATIONAL_TRIAL_VERSION' 等更新為新的 'INDIVIDUAL'先行調整資料以配合後續 Role 枚舉值的變更）。又例如在調整 certificate_rc2 的欄位型別時，新增臨時欄位並將舊欄位資料轉存至新欄位，再移除舊欄位以完成型別更換。

### 如何在 Prisma 中執行 Squash
接下來說明如何執行 Squashing Migration（合併遷移），我們的目標是將現有所有遷移合併為「一個」新的遷移，代表當前最新的資料庫 schema。
#### Step 1: 刪除舊有 migration 檔案
```shell
rm -rf ./prisma/migrations/*
```
#### Step 2: 建立新 migration 檔案
我們使用 Prisma 提供的 migrate diff 指令來比較一個「起點」與「目標」之間的 schema 差異，直接生成完整的變更 SQL。我們希望從空白資料庫作為起點，遷移到目前 schema.prisma 所定義的結構，可以執行以下指令：
```shell
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > ./prisma/migrations/000_init/migration.sql
```
上述指令說明：
1. `--from-empty` 表示起點為一個空資料庫；
2. `--to-schema-datamodel ./prisma/schema.prisma` 表示目標為 Prisma Schema 文件描述的結構；
3. `--script` 則要求輸出 SQL 腳本，結果重新導向寫入我們指定的新遷移檔案路徑中。
4. `000_init` 是我們新建的遷移資料夾名稱。執行後，應產生一個包含建立整套目前資料庫架構的 `migration.sql` 檔案。

#### Step 3: 初始化所有 id 的流水號從 10000000 開始
為了資訊安全治理，在 iSunFA 的環境中，id < 10000000 屬於可以任意捨棄的測試用資料，所有資料 id 都應該 > 10000000，因此我們必須在 `000_init/migration.sql` 檔案底部加入以下內容：
```shell
vi ./prisma/migrations/000_init/migration.sql
```
```shell
ALTER SEQUENCE account_id_seq RESTART WITH 10000000;
ALTER SEQUENCE accounting_setting_id_seq RESTART WITH 10000000;
ALTER SEQUENCE admin_id_seq RESTART WITH 10000000;
ALTER SEQUENCE asset_id_seq RESTART WITH 10000000;
ALTER SEQUENCE asset_voucher_id_seq RESTART WITH 10000000;
ALTER SEQUENCE associate_line_item_id_seq RESTART WITH 10000000;
ALTER SEQUENCE associate_voucher_id_seq RESTART WITH 10000000;
ALTER SEQUENCE audit_report_id_seq RESTART WITH 10000000;
ALTER SEQUENCE authentication_id_seq RESTART WITH 10000000;
ALTER SEQUENCE certificate_id_seq RESTART WITH 10000000;
ALTER SEQUENCE client_id_seq RESTART WITH 10000000;
ALTER SEQUENCE company_id_seq RESTART WITH 10000000;
ALTER SEQUENCE company_kyc_id_seq RESTART WITH 10000000;
ALTER SEQUENCE company_setting_id_seq RESTART WITH 10000000;
ALTER SEQUENCE contract_id_seq RESTART WITH 10000000;
ALTER SEQUENCE counterparty_id_seq RESTART WITH 10000000;
ALTER SEQUENCE country_id_seq RESTART WITH 10000000;
ALTER SEQUENCE customer_vendor_id_seq RESTART WITH 10000000;
ALTER SEQUENCE department_id_seq RESTART WITH 10000000;
ALTER SEQUENCE employee_id_seq RESTART WITH 10000000;
ALTER SEQUENCE employee_project_id_seq RESTART WITH 10000000;
ALTER SEQUENCE event_id_seq RESTART WITH 10000000;
ALTER SEQUENCE file_id_seq RESTART WITH 10000000;
ALTER SEQUENCE income_expense_id_seq RESTART WITH 10000000;
ALTER SEQUENCE invitation_id_seq RESTART WITH 10000000;
ALTER SEQUENCE invoice_id_seq RESTART WITH 10000000;
ALTER SEQUENCE journal_id_seq RESTART WITH 10000000;
ALTER SEQUENCE kyc_bookkeeper_id_seq RESTART WITH 10000000;
ALTER SEQUENCE kyc_role_id_seq RESTART WITH 10000000;
ALTER SEQUENCE line_item_id_seq RESTART WITH 10000000;
ALTER SEQUENCE milestone_id_seq RESTART WITH 10000000;
ALTER SEQUENCE news_id_seq RESTART WITH 10000000;
ALTER SEQUENCE ocr_id_seq RESTART WITH 10000000;
ALTER SEQUENCE order_id_seq RESTART WITH 10000000;
ALTER SEQUENCE payment_id_seq RESTART WITH 10000000;
ALTER SEQUENCE payment_record_id_seq RESTART WITH 10000000;
ALTER SEQUENCE plan_id_seq RESTART WITH 10000000;
ALTER SEQUENCE project_id_seq RESTART WITH 10000000;
ALTER SEQUENCE report_id_seq RESTART WITH 10000000;
ALTER SEQUENCE role_id_seq RESTART WITH 10000000;
ALTER SEQUENCE salary_record_id_seq RESTART WITH 10000000;
ALTER SEQUENCE salary_record_project_hour_id_seq RESTART WITH 10000000;
ALTER SEQUENCE sale_id_seq RESTART WITH 10000000;
ALTER SEQUENCE shortcut_id_seq RESTART WITH 10000000;
ALTER SEQUENCE subscription_id_seq RESTART WITH 10000000;
ALTER SEQUENCE todo_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_action_log_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_agreement_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_certificate_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_payment_info_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_role_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_setting_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_todo_company_id_seq RESTART WITH 10000000;
ALTER SEQUENCE user_voucher_id_seq RESTART WITH 10000000;
ALTER SEQUENCE value_id_seq RESTART WITH 10000000;
ALTER SEQUENCE voucher_certificate_id_seq RESTART WITH 10000000;
ALTER SEQUENCE voucher_id_seq RESTART WITH 10000000;
ALTER SEQUENCE voucher_salary_record_folder_id_seq RESTART WITH 10000000;
ALTER SEQUENCE voucher_salary_record_id_seq RESTART WITH 10000000;
ALTER SEQUENCE work_rate_id_seq RESTART WITH 10000000;
```

#### Step 4: 讓既有環境識別新的基準
```shell
npx prisma migrate resolve --applied 000_init
```
此指令會將 Prisma 資料庫中的遷移紀錄更新，標記我們新生成的合併遷移已被視為已執行。換言之，它在 _prisma_migrations 表中登記了此遷移的版本，但不會真正執行其中的 SQL（因為該環境的資料庫本身已是最新架構）。執行成功後，Prisma 就不會嘗試在這些已有資料的環境重跑新的遷移腳本。 對於需要保留資料的開發環境，如果本機資料庫已套用過所有舊遷移且有測試資料，也可以使用相同的 migrate resolve 方式來避免重置資料庫。若不需要保留本機資料，更簡單的方式是直接刪除本機資料庫或其資料表，確保空庫後重新執行 prisma migrate dev；由於本地 migrations 資料夾現在只有新的合併遷移，此命令會直接執行新的 migration.sql，在本機重建完整 schema。

## 結語
至此，我們即完成了 iSunFA 一次遷移記錄的合併。合併後的單一遷移檔案代表了目前的資料庫 Schema 狀態，舊有的遷移歷史則可在 [Github](https://github.com/CAFECA-IO/iSunFA) 版本控制中查閱。藉此，團隊在後續開發中能夠享有更輕量的遷移流程，更快的資料庫部署，以及更簡潔清晰的結構變更紀錄。
