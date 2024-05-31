# 簡介

本文以 high-level 的視角了解權限管理的系統實作跟不同認證與授權方法適用的場景，未來技術選型跟系統設計時可作為參考。

# 權限管理

服務需要區分用戶的身份並且給予對應的權限時，就需要導入身份認證跟授權的系統實作，確保用戶安心地使用服務之外，也須將惡意用戶、不合格的用戶隔絕在服務之外。

本文將身份認證跟授權統稱為權限管理。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/65d86732-3b52-47b0-b4cf-88adfe7aab83)


# 身份認證（Authentication）

身份驗證：確認使用者或服務的身份，現代應用常見的做法有以下：

| 區塊 | 方法 | 說明 | 舉例 |
| --- | --- | --- | --- |
| 身份認證 | 密碼認證（Password Authentication） | 用戶通過輸入用戶名和密碼來驗證身份 | 大多數網站的登錄界面 |
|  | 多因素認證（Multi-Factor Authentication, MFA） | 用戶需要提供多個身份驗證因素，如密碼和一次性驗證碼（OTP） | Google 的雙重驗證 |
|  | 生物識別認證（Biometric Authentication） | 使用用戶的生物特徵（如指紋、臉部識別）來驗證身份 | 蘋果的 Face ID 或 Touch ID |
|  | 單點登錄（Single Sign-On, SSO） | 用戶可以通過一個帳號登錄多個應用系統 | Google 或 Facebook 登錄 |

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/70b77033-5d1a-4bac-b124-b143bfc5c784)


# 授權（Authorization）

授權：使用者在服務裡的存取權限，現代應用常見的做法有以下：

| 訪問控制類型 | 實際作法 | 角色配置方式 | 權限配置方式 |
| --- | --- | --- | --- |
| 強制訪問控制（MAC） | 1. 設置安全標籤和權限  2. 管理員控制權限變更  3. 使用中間件驗證安全標籤 | 由管理員分配特定的安全標籤，角色相對固定 | 權限由管理員設置和管理，用戶無法更改 |
| 基於角色的訪問控制（RBAC） | 1. 定義角色和權限  2. 分配多個角色給用戶  3. 使用中間件驗證角色 | 用戶可以擁有多個角色，每個角色有特定權限組合 | 根據角色分配權限，用戶可以繼承多個角色的權限 |
| 自由訪問控制（DAC） | 1. 設置對象所有者  2. 對象所有者管理其數據的訪問權限  3. 使用中間件驗證對象所有者 | 對象所有者管理自己的數據 | 由對象所有者設置和管理權限，靈活性高但安全性相對較低 |
| 基於規則的訪問控制（RuBAC） | 1. 設置訪問規則  2. 使用中間件驗證訪問規則 | 不使用固定角色，根據規則動態控制訪問 | 根據預定規則管理訪問權限，如時間段、操作類型等 |
| 基於屬性的訪問控制（ABAC） | 1. 設置用戶屬性和環境屬性  2. 使用中間件驗證屬性 | 根據用戶屬性（如角色、部門）配置訪問權限 | 根據屬性動態分配權限，提供更精細的控制 |

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/690406c0-0c73-4b00-b8b8-49913b752214)

# 權限管理實作

可分為 session-based 跟 token-based 的實作

## **實作方法拆解與說明**

### **JWT（JSON Web Token）**

1. **流程**：
    - 用戶發送登錄請求，提交用戶名和密碼。
    - 伺服器驗證用戶的憑證。
    - 伺服器生成一個 JWT，並使用私鑰簽名。
    - JWT 發送給客戶端，通常存儲在本地存儲（Local Storage）。
    - 之後的請求都會帶上 JWT，通常放在 Authorization 標頭中，前綴 "Bearer"。

2. **特點**：
    - **存儲位置**：客戶端（本地存儲）。
    - **狀態管理**：無狀態。
    - **優點**：適合分散式系統，無需伺服器端儲存會話數據，效能高。
    - **缺點**：可能被劫持，難以在有效期內使之失效。
    - **使用情境**：需要高度擴展性、效能要求高的分散式應用程序。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/97179645-88e4-42ed-a5d6-5ea0159923d1)


### **Cookie-Session**

1. **流程**：
    - 用戶發送登錄請求，提交用戶名和密碼。
    - 伺服器驗證用戶的憑證。
    - 伺服器在數據庫中創建會話並生成會話 ID。
    - 伺服器將會話 ID 返回並存儲在客戶端的 Cookie 中。
    - 之後的請求都會帶上這個會話 ID，存儲在 Cookie 中。
2. **特點**：
    - **存儲位置**：伺服器端（數據庫或內存）。
    - **狀態管理**：有狀態。
    - **優點**：易於實作，對傳統 Web 應用友好。
    - **缺點**：受限於 CSRF 攻擊，需要存儲會話數據，橫向擴展困難。
    - **使用情境**：傳統的 Web 應用，會話管理簡單且不需要高度擴展性的應用程序。

session 存在 DB:
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/9c8c4303-bda0-4bab-9b66-ad25a9602439)

session 存在內存:
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/4a8ac949-027c-4126-9955-db92eae276f7)


### **OAuth2.0**

1. **流程**：
    - 用戶請求第三方服務的訪問許可（例如 Google 登錄）。
    - 用戶被重定向到第三方提供者進行授權（例如，Google 授權頁面）。
    - 用戶授權後，第三方提供者返回一個授權碼給客戶端。
    - 客戶端使用這個授權碼向第三方提供者請求訪問令牌。
    - 第三方提供者返回訪問令牌給客戶端。
    - 客戶端使用訪問令牌訪問第三方資源。
2. **特點**：
    - **存儲位置**：客戶端與第三方提供者。
    - **狀態管理**：通常無狀態，但可能需要保持一些狀態以管理訪問令牌的生命周期。
    - **優點**：允許第三方應用訪問用戶資源而無需透露用戶憑證，增強了安全性。
    - **缺點**：實作相對複雜，需要處理訪問令牌的有效期與刷新。
    - **使用情境**：需要第三方授權的應用，例如社交登錄，允許應用程序安全地訪問用戶資源。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/06a1f8ce-e14a-4f17-a407-1afd3644002b)


### **總結表格**

| 方法 | 存儲位置 | 狀態管理 | 優點 | 缺點 | 使用情境 |
| --- | --- | --- | --- | --- | --- |
| JWT | 客戶端（本地存儲） | 無狀態 | 高效能，適合分散式系統 | 可能被劫持，難以失效 | 分散式應用，高度擴展性需求 |
| Cookie-Session | 伺服器端（數據庫或內存） | 有狀態 | 易於實作，對傳統 Web 應用友好 | 受限於 CSRF 攻擊，橫向擴展困難 | 傳統 Web 應用，會話管理簡單 |
| OAuth2.0 | 客戶端與第三方提供者 | 無狀態 | 安全地訪問第三方資源，無需透露用戶憑證 | 實作複雜，需要管理訪問令牌 | 第三方授權應用，社交登錄 |

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/970fd559-b48b-4298-875d-00aeb787dd32)


# Reference

- [https://www.onelogin.com/learn/authentication-vs-authorization#:~:text=Authentication and authorization are two,authorization determines their access rights](https://www.onelogin.com/learn/authentication-vs-authorization#:~:text=Authentication%20and%20authorization%20are%20two,authorization%20determines%20their%20access%20rights).
- https://www.youtube.com/watch?v=GhrvZ5nUWNg
- https://www.linkedin.com/pulse/comprehensive-overview-access-control-models-rbac-abac-jay-
- https://techgenix.com/5-access-control-types-comparison/
