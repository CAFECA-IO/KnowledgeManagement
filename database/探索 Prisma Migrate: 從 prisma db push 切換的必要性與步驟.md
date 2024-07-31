# 探索 Prisma Migrate: 從 `prisma db push` 切換的必要性與步驟

## 1. 介紹

在使用 Prisma 進行資料庫管理時，`prisma db push` 和 `prisma migrate` 是兩個關鍵命令，它們在不同情境下提供不同的功能。

### `prisma db push`

`prisma db push` 是一個快速原型設計工具，主要用於將 Prisma schema 的變更直接應用到資料庫中。它不會生成遷移文件，也不會記錄變更歷史，適合用於以下場景：

- **快速開發和測試**：在開發初期階段，當你快速迭代模型並驗證變更時，`prisma db push` 可以快速更新資料庫結構，而不必每次都生成遷移文件。
- **小型專案或個人專案**：對於一些不需要複雜版本控制的專案，使用 `prisma db push` 可以簡化流程。

但由於 `prisma db push` 不記錄變更歷史，這意味著你不能在正式環境中使用它，因為它缺乏遷移文件管理和版本控制，無法保證資料庫模式的變更可追溯和可恢復。

### `prisma migrate`

`prisma migrate` 是 Prisma 的遷移管理工具，適合在正式環境中使用，並支持以下功能：

- **生成遷移文件**：`prisma migrate` 會根據 Prisma schema 生成 SQL 遷移文件，這些文件記錄了資料庫結構的變更，包括新增表格、欄位、索引等。
- **應用和追蹤變更**：生成的遷移文件可以應用到資料庫中，並且 Prisma 會追蹤遷移歷史，確保資料庫與 Prisma schema 保持同步。
- **版本控制**：遷移文件可以被加入版本控制系統（如 Git），這樣可以追蹤和管理資料庫變更歷史，適合團隊合作和生產環境。

`prisma migrate` 提供了強大的版本管理功能，適合在正式環境中使用，可以自定義 SQL 語法，並支持在不同環境（開發、測試、生產）中一致地應用資料庫變更。

### 為什麼從 `prisma db push` 切換到 `prisma migrate`

- **變更可追溯性**：`prisma migrate` 生成的遷移文件提供了清晰的變更歷史，使得資料庫變更的過程可以被追蹤和回溯。
- **協作與版本控制**：對於多開發者團隊，`prisma migrate` 的遷移文件可以被加入版本控制系統，確保所有人都能夠同步到最新的資料庫結構變更。
- **生產環境的穩定性**：`prisma migrate` 可以確保生產環境的資料庫變更是可控的，不會直接修改資料庫結構，避免了因為快速原型設計造成的潛在風險。

## 2. 切換到 Prisma Migrate 的步驟

如果你之前一直使用 `prisma db push` 來更新資料庫，但現在準備進入正式版並需要使用 Prisma 不支援的 SQL 語法，那麼你需要切換到 `prisma migrate`。若資料庫在雲端，無法直接使用 `migrate dev`，以下是詳細的步驟教學，教你如何進行基線（baseline）並在本地或雲端進行遷移。

### 步驟 1：建立基線遷移

首先，我們需要為現有的資料庫建立基線遷移。這樣可以讓 Prisma 知道目前資料庫的狀態，並從這個基線開始進行後續的遷移。

1. **創建基線遷移目錄**：
   創建 `migrations` 目錄並在其中添加一個目錄，命名為 `0_init`：
   ```bash
   mkdir -p prisma/migrations/0_init
   ```

2. **生成基線遷移文件**：
   使用 `prisma migrate diff` 生成遷移文件：
   ```bash
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
   ```

3. **檢查遷移文件**：
   檢查生成的遷移文件，確保一切正確。

4. **標記基線遷移為已應用**：
   使用 `prisma migrate resolve` 將遷移標記為已應用：
   ```bash
   npx prisma migrate resolve --applied 0_init
   ```

### 步驟 2：在本地進行遷移開發

在本地開發環境中進行資料庫遷移開發時，你需要確保所有變更都能順利應用並達到預期效果。這裡將介紹如何創建並應用遷移，包括一般的遷移開發和需要手動添加 SQL 的特殊情況。

#### 2.1 一般遷移開發

1. **更新 Prisma Schema**

   首先，更新你的 Prisma schema 文件（`schema.prisma`）以反映你想要的變更。例如，添加新的模型、修改現有模型或更新欄位。

   ```prisma
   model User {
     id    Int    @id @default(autoincrement())
     name  String
     email String @unique
   }
   ```

2. **創建並應用遷移**

   使用 `prisma migrate dev` 命令來創建並應用遷移。這個命令會根據你的 schema 變更生成遷移文件，並將這些變更應用到本地資料庫中。

   ```bash
   npx prisma migrate dev --name your-migration-name
   ```

   例如，若你的遷移名稱為 `add-user-model`，你可以這樣運行：

   ```bash
   npx prisma migrate dev --name add-user-model
   ```

   該命令會創建一個新的遷移文件（在 `prisma/migrations` 目錄中）並立即應用到你的本地資料庫。這是最常見的情況，適用於大多數標準遷移需求。

#### 2.2 需要手動添加 SQL 的遷移

有時候，你可能需要在遷移中進行特殊的 SQL 操作，例如設定自增 ID 的起始數字。對於這些情況，你需要手動編輯遷移文件。

1. **生成遷移文件**

   使用 `prisma migrate dev --create-only` 來僅生成遷移文件，而不立即應用。這樣可以讓你有機會手動編輯遷移文件。

   ```bash
   npx prisma migrate dev --create-only --name custom-sql-migration
   ```

   這條命令會生成遷移文件，但不會將其應用到資料庫中。生成的遷移文件將存儲在 `prisma/migrations` 目錄中。

2. **編輯遷移文件**

   打開生成的遷移文件，根據需要添加自訂的 SQL 語句。例如，如果你想設置自增 ID 開始的數字，可以在遷移文件中添加以下 SQL 語句：

   ```sql
   ALTER TABLE your_table AUTO_INCREMENT = 1000;
   ```

   確保你編輯的 SQL 語句符合你的資料庫系統的語法要求。

3. **重新生成並應用遷移**

   編輯完成後，再次使用 `prisma migrate dev` 來應用修改過的遷移文件。這樣可以確保所有變更被正確應用到本地資料庫中。

   ```bash
   npx prisma migrate dev
   ```

4. **部署遷移**

   如果需要將遷移應用到生產環境，使用 `prisma migrate deploy` 來確保遷移被應用到雲端資料庫中。

   ```bash
   npx prisma migrate deploy
   ```

這樣的流程能夠確保你在編輯遷移文件後，能夠進行測試並最終將變更應用到資料庫中。

## 3. 遷移的注意事項

### 為什麼 `prisma migrate dev` 不能直接在雲端資料庫使用

`prisma migrate dev` 主要設計用於本地開發環境，其核心功能包括生成和應用遷移、檢測資料庫模式的漂移，並在影子資料庫中重建資料庫模式。這些操作在本地環境中是安全的，但在雲端環境中可能會帶來以下問題：

1. **影子資料庫的創建與刪除**：`prisma migrate dev` 需要創建影子資料庫來檢測模式漂移，影子資料庫是一個臨時資料庫。在雲端環境中，這會增加資源成本並且影子資料庫的刪除通常需要手動操作，可能會造成額外的管理負擔或資源浪費。
   - 慘痛案例：[沒有刪除影子資料庫，導致收費暴增](https://github.com/prisma/prisma/issues/6371#issuecomment-813448293)

2. **資料庫鎖定**：頻繁的遷移操作可能會導致資料庫鎖定，影響其他應用程序對資料庫的訪問。在生產環境中，這樣的鎖定可能會對用戶造成影響，因此需要特別小心。

3. **潛在資料丟失**：在生產環境中執行不完全測試過的遷移可能會導致資料丟失或資料庫狀態不一致。這在本地環境中可以接受，但在雲端環境中是不可接受的。

4. **權限限制**：在雲端環境中創建影子資料庫可能需要特定的權限，如果資料庫服務提供商對資料庫的創建和刪除有嚴格的權限控制，可能會導致創建或刪除影子資料庫的操作失敗。

5. **性能問題**：在生產環境中進行模式漂移檢測和影子資料庫的創建會佔用大量資源，影響系統的性能和穩定性。

因此，建議在本地環境中使用 `prisma migrate dev` 進行遷移生成和測試，並在雲端環境中使用 `prisma migrate deploy` 來應用已經測試過的遷移文件，確保資料庫的安全性和穩定性。

### 如何處理遷移衝突

當多個開發者同時進行遷移時，可能會發生遷移衝突。為了避免這種情況，請遵循以下最佳實踐：

1. **頻繁同步**：經常從版本控制系統中拉取最新的遷移文件，並在本地應用它們。
2. **小步快跑**：將大的變更拆分成多個小的遷移，這樣可以減少衝突的機會。
3. **溝通協作**：與團隊成員保持良好的溝通，確保大家了解彼此的變更。
4. **回滾策略**：設計和實施回滾策略，以便在遷移過程中出現問題時，可以迅速恢復到先前的資料庫狀態。

### `prisma migrate` 的最佳實踐

1. **測試遷移**：在將遷移應用到生產環境之前，先在測試環境中運行遷移，確保遷移過程不會引發錯誤。
2. **備份資料庫**：在執行遷移之前，確保已經備份了資料庫，以防萬一遷移過程中出現問題，可以恢復到之前的狀態。
3. **回滾遷移**：如果遷移失敗或造成了問題，了解如何回滾到先前的狀態，並確保能夠迅速處理遷移過程中的問題。

### 配置和設置建議

1. **環境變數管理**：
   - 使用 `.env` 文件來管理 Prisma 的環境變數，確保資料庫連接字串和其他敏感信息不會硬編碼在代碼中。
   - 確保 `.env` 文件被正確加載，並在不同環境（開發、測試、生產）中使用不同的配置。

2. **配置最佳實踐**：
   - 確保 Prisma 配置檔（`schema.prisma`）的版本與資料庫結構保持一致，並經常更新以反映最新的變更。
   - 在進行資料庫遷移時，檢查 Prisma 的配置是否正確，以避免因配置錯誤導致的問題。

## 4. 限制與已知問題

### MongoDB 支援

目前，Prisma Migrate 不支援 MongoDB 提供者。如果你使用的是 MongoDB，則需要使用其他工具來管理資料庫模式變更。

### 無法自動切換資料庫提供者

Prisma Migrate 目前不支援自動切換資料庫提供者。如果你需要從一個資料庫提供者切換到另一個（例如從 PostgreSQL 切換到 MySQL），你需要手動處理這些變更。

## 5. 結論

在使用 Prisma Migrate 管理資料庫遷移時，了解並遵循正確的步驟是確保資料庫結構一致性和版本控制的關鍵。以下是詳細的遷移步驟總結：

### 總結遷移步驟

1. **生成遷移文件**
   - 使用 `prisma migrate dev --create-only` 命令僅生成遷移文件，而不立即應用。這樣可以讓你有機會手動檢查和編輯遷移文件。此命令會根據 Prisma schema 的變更生成 SQL 遷移腳本，並將其儲存在 `prisma/migrations` 目錄中。
   - 命令示例：
     ```bash
     npx prisma migrate dev --create-only --name custom-sql-migration
     ```
   - 生成的遷移文件會以時間戳和遷移名稱命名的目錄形式存在，便於管理和版本控制。

2. **編輯生成的 SQL 遷移文件**
   - 打開生成的遷移文件，根據需要手動添加或修改 SQL 語句。這些變更可能包括設置自增 ID 開始數字、添加索引、調整欄位屬性等。例如，設置自增 ID 開始數字的 SQL 語句如下：
     ```sql
     ALTER TABLE your_table AUTO_INCREMENT = 1000;
     ```
   - 編輯時應確保 SQL 語句符合你的資料庫系統要求，並檢查語法是否正確。

3. **應用遷移到本地資料庫**
   - 編輯完成後，使用 `prisma migrate dev` 命令將遷移應用到本地資料庫中。此命令會執行所有尚未應用的遷移文件，並更新資料庫結構。這一步驟確保本地資料庫與 Prisma schema 保持同步。
   - 命令示例：
     ```bash
     npx prisma migrate dev
     ```
   - 執行此命令後，你可以在本地環境中檢查資料庫結構是否符合預期，並確保所有變更正確應用。

4. **推送遷移文件到版本控制系統**
   - 一旦遷移文件經過測試並確保正確，將遷移文件推送到版本控制系統（如 Git）。這樣可以確保團隊成員之間同步資料庫變更歷史，並便於協作和版本控制。
   - 執行以下命令來將遷移文件加入版本控制系統：
     ```bash
     git add prisma/migrations
     git commit -m "Add migration for custom SQL changes"
     git push
     ```

5. **在雲端環境中部署遷移**
   - 最後，使用 `prisma migrate deploy` 命令將遷移應用到生產環境的資料庫中。這個命令會檢查並應用所有尚未部署的遷移文件，確保生產環境的資料庫結構更新到最新狀態。
   - 命令示例：
     ```bash
     npx prisma migrate deploy
     ```
   - 在部署之前，請確保資料庫已經備份，以防萬一遷移過程中發生問題可以恢復到先前狀態。

這些步驟可以幫助你在使用 Prisma Migrate 時有效地管理和應用資料庫遷移，確保資料庫結構的穩定性和一致性。

## 6. 參考網址

- [Schema prototyping with `db push`](https://www.prisma.io/blog/pearly-plan-customer-success-pdmdrRhTupve#schema-prototyping-with-db-push)
- [Prototype your schema](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model#prototype-your-schema)
- [Prisma CLI reference - db push](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#examples-6)
- [Understanding Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model#prototype-your-schema)
- [Database migrations with Prisma Migrate](https://www.prisma.io/blog/prisma-the-complete-orm-inw24qjeawmb#prisma--the-complete-orm-for-nodejs--typescript)
- [Using Prisma Client and Prisma Migrate](https://www.prisma.io/docs/orm/overview/introduction/data-modeling#using-prisma-client-and-prisma-migrate)
- [Prisma GitHub](https://github.com/prisma/prisma)
