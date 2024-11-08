# RESTful API 設計指南

本指南提供公司內部 RESTful API 設計的最佳實踐，旨在幫助開發團隊保持 API 的一致性、可讀性和可維護性。遵循這些原則能夠確保 API 更具擴展性，並且符合 RESTful 標準。

## 基本原則

1. **資源命名**：路徑應該反映資源，而非動作。使用名詞表示資源，並保持路徑單數。
   - 例如：`/user/{userId}/company`，而非 `/users/{userId}/companies` 或 `/users/{userId}/create-company`。

2. **HTTP 方法**：
   - `GET`：獲取資源或集合。
   - `POST`：創建新資源。
   - `PUT`：更新現有資源。
   - `DELETE`：刪除資源。

3. **路徑層級**：使用層級結構表示資源之間的從屬關係。例如，用戶擁有公司，則應使用 `/user/{userId}/company`。

4. **單一資源**：路徑應指向具體的資源而非集合，每個路徑都代表一個唯一資源。
   - 在 RESTful 設計中，「單一資源」是指具體的、唯一的資源項目，這意味著即使該資源可能會出現多個實例（例如公司或報告），每個路徑應指向一個單獨的、確定的實例。
   - 例如，`/company/67890` 表示一個唯一公司，而 `GET /report/98765` 表示該唯一報告。
   - 單一資源的命名應該保持清晰簡潔，避免使用多數或動詞，這樣設計能確保資源的唯一性和 API 的可讀性。

5. **使用單數**：資源路徑使用單數形式，表示一個具體的資源。
   - 例如：`/user/{userId}/company`，而非 `/users/{userId}/companies`。

6. **避免動詞**：避免在路徑中使用動詞，因為 HTTP 方法已經定義了動作。

這些基本原則有助於維持 API 設計的一致性和可擴展性，使 API 更加符合 RESTful 標準並提高其可讀性和易用性。

## 常見路徑設計示例

### 1. 用戶 (User)

#### 1.1 獲取用戶資訊
- 路徑：`GET /user/{userId}`
- 用途：根據 `userId` 獲取指定用戶的詳細資訊。

範例：
```http
GET /user/12345
```

#### 1.2 創建用戶
- 路徑：`POST /user`
- 用途：創建新用戶。

範例：
```http
POST /user
Content-Type: application/json

{
  "name": "新用戶",
  "email": "user@example.com"
}
```

#### 1.3 更新用戶資料
- 路徑：`PUT /user/{userId}`
- 用途：更新指定用戶的資訊。

範例：
```http
PUT /user/12345
Content-Type: application/json

{
  "name": "更新後的用戶名"
}
```

#### 1.4 刪除用戶
- 路徑：`DELETE /user/{userId}`
- 用途：刪除指定用戶。

範例：
```http
DELETE /user/12345
```

### 2. 公司 (Company)

#### 2.1 獲取公司資訊
- 路徑：`GET /company/{companyId}`
- 用途：根據 `companyId` 獲取公司詳細資訊。

範例：
```http
GET /company/67890
```

#### 2.2 創建公司
- 路徑：`POST /user/{userId}/company`
- 用途：創建新公司並關聯至特定用戶。

範例：
```http
POST /user/12345/company
Content-Type: application/json

{
  "name": "新公司名稱",
  "address": "公司地址"
}
```

#### 2.3 更新公司資訊
- 路徑：`PUT /company/{companyId}`
- 用途：更新公司詳細資訊。

範例：
```http
PUT /company/67890
Content-Type: application/json

{
  "name": "更新後的公司名稱"
}
```

#### 2.4 刪除公司
- 路徑：`DELETE /company/{companyId}`
- 用途：刪除指定公司。

範例：
```http
DELETE /company/67890
```

#### 2.5 更改公司狀態
- 路徑：`PUT /company/{companyId}/status`
- 用途：更新公司狀態，例如設置為「啟用」或「停用」。

範例：
```http
PUT /company/67890/status
Content-Type: application/json

{
  "status": "active"
}
```

### 3. 報告 (Report)

#### 3.1 獲取公司報告
- 路徑：`GET /company/{companyId}/report`
- 用途：獲取公司下的所有報告。

範例：
```http
GET /company/67890/report
```

#### 3.2 獲取單一報告
- 路徑：`GET /report/{reportId}`
- 用途：根據 `reportId` 獲取報告詳細資訊。

範例：
```http
GET /report/98765
```

#### 3.3 創建報告
- 路徑：`POST /company/{companyId}/report`
- 用途：為公司創建新報告。

範例：
```http
POST /company/67890/report
Content-Type: application/json

{
  "title": "新報告",
  "content": "報告內容"
}
```

#### 3.4 更新報告
- 路徑：`PUT /report/{reportId}`
- 用途：更新指定報告。

範例：
```http
PUT /report/98765
Content-Type: application/json

{
  "title": "更新後的報告標題"
}
```

#### 3.5 刪除報告
- 路徑：`DELETE /report/{reportId}`
- 用途：刪除指定報告。

範例：
```http
DELETE /report/98765
```

### 4. 用戶選擇當前公司

#### 4.1 設置當前選擇的公司
- 路徑：`PUT /user/{userId}/selected-company`
- 用途：設置用戶的當前選擇公司，該公司將成為用戶後續操作的預設公司。

範例：
```http
PUT /user/12345/selected-company
Content-Type: application/json

{
  "companyId": "67890"
}
```

## 路徑設計總結

- **資源層級**：資源應按層級結構排列，便於表示資源之間的從屬關係。
- **資源命名**：使用單數形式來表示資源，例如 `user`、`company`、`report`，避免使用複數形式。
- **HTTP 方法**：遵循 HTTP 標準方法來執行 CRUD 操作：
  - `GET`：獲取資源。
  - `POST`：創建資源。
  - `PUT`：更新資源。
  - `DELETE`：刪除資源。
- **操作明確性**：避免在路徑中使用動詞，將操作交給 HTTP 方法來表示。

這個指南是為公司內部 API 設計所制定的，涵蓋了常見的資源操作並強調了 RESTful 設計的最佳實踐，適用於多種場景並能夠隨著業務發展輕鬆擴展。
