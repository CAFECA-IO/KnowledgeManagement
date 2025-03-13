# **基於 Docker Compose 與 Nginx Proxy Manager 的單機多網站管理與高可用性實現**

## **💡 這篇文章適合誰？**

這篇文章是我在學習 **Docker Compose 與 Nginx Proxy Manager** 來管理 **單機多網站** 的筆記。

如果你和我一樣，對 DevOps 不太熟悉，但想要在一台伺服器上管理多個網站，那麼這篇文章會幫助你：
- **理解單機多網站管理的概念**
- **了解傳統方式的限制與問題**
- **學會使用 Docker Compose 讓網站管理更簡單**
- **透過 Nginx Proxy Manager 提供 SSL、流量管理**

這不是一篇專業 DevOps 教學，而是適合新手入門的記錄，希望讓你少走彎路，避免常見錯誤 🚀。


## **1️⃣ 什麼是「單機多網站管理」？**
**單機多網站管理（Multi-Website Management on a Single Machine）**，指的是在**同一台伺服器（單機）上同時運行多個獨立的網站**，這些網站可能使用不同的技術（PHP、Node.js、Python 等），但共用相同的硬體資源，如 **CPU、記憶體、磁碟、網絡**。

### **🔹 應用場景舉例**
假設你擁有一台伺服器，想同時架設：
1. **個人部落格** `blog.example.com`
2. **公司內部系統** `crm.company.com`
3. **線上商城** `shop.example.com`

👉 **但你不想為每個網站分開買伺服器，而是希望在同一台機器上同時運行這些網站！**  
這就是 **「單機多網站管理」** 的概念 🎯

💡 **簡單比喻**：「這就像是在同一棟大樓裡開設不同的辦公室，每個辦公室（網站）都有自己的用途，但共用同一個建築物（伺服器）。」


## **2️⃣ 傳統上如何管理單機多網站？為什麼有問題？**

### **🔹 為什麼傳統方式使用 Nginx / Apache Virtual Hosting？**
在沒有 Docker 之前，最常見的方式是使用 **Nginx 或 Apache** 來設定「虛擬主機（Virtual Hosting）」。
這種方法讓一台伺服器可以透過 **不同的域名或端口號** 來區分網站流量，並將請求導向對應的網站目錄。

**🔸 Nginx 設定範例**
```nginx
server {
    listen 80;
    server_name blog.example.com;
    root /var/www/blog;
}

server {
    listen 80;
    server_name shop.example.com;
    root /var/www/shop;
}
```
📌 **這種方式的優勢：**
- **節省成本**：同一台機器可以承載多個網站，不需要每個網站獨立一台伺服器。
- **靈活性**：可以根據請求的域名或端口將流量導向不同網站。
- **適合小型應用**：如果網站數量不多且變動不大，管理起來相對簡單。

但當網站數量增加，或者應用程式使用不同技術棧（如 PHP 和 Node.js）時，這種方式就會遇到挑戰。

📌 **傳統方式的問題：**
1. **環境共享** → 所有網站共用同一個作業系統環境，可能發生技術衝突（如 PHP、Node.js 版本不匹配）。
2. **難以擴展** → 每新增一個網站，都需要手動修改 Nginx 設定，並重啟伺服器。
3. **維護成本高** → 一個網站出錯，可能影響其他網站的運行。
4. **缺乏隔離性** → 如果一個網站發生安全問題，可能影響整個伺服器。






### **🔹 什麼是「反向代理（Reverse Proxy）」？為什麼需要它？**

📌 **什麼是反向代理？**
> 反向代理是一種 **代理伺服器（Proxy Server）**，位於客戶端（使用者瀏覽器）和後端伺服器之間，負責**接收來自客戶端的請求，然後轉發到後端的適當服務**，再將後端的回應返回給客戶端。
💡 **簡單比喻**：「反向代理就像餐廳的櫃檯，客戶點餐（請求），櫃檯將訂單轉交給廚房（後端伺服器），然後將餐點（回應）送回給客戶。」
**為了更好地管理多個網站並提升靈活性，Nginx / Apache 通常會作為「反向代理（Reverse Proxy）」來管理網站流量。**

📌 **反向代理的主要功能**
✅ **流量分配** → 集中控制所有請求，確保網站可以動態分配資源，根據請求的 URL，將請求導向不同的服務  
✅ **SSL 終端（SSL Termination）** → 反向代理可以統一處理 SSL 憑證，避免每個網站都需要獨立配置 HTTPS，讓後端只需處理 HTTP  
✅ **負載平衡** → 當有多台後端伺服器時，將請求平均分配  
✅ **安全性強化** → 隱藏後端伺服器的真實 IP，降低攻擊風險  


🔸 **Nginx Proxy Manager** 本質上就是一個 **反向代理管理工具**，它的主要作用是：
- **接收來自用戶的請求**
- **根據域名（如 `isunfa.com`）轉發到對應的應用服務**
- **提供 SSL、存取控制等功能**
在傳統方式下，這些都需要手動配置 `nginx.conf` 或 `apache.conf`，並且當新增網站或修改設定時，必須重新啟動伺服器，管理起來相當麻煩。

## **3️⃣ Docker Compose 如何簡化多網站管理？**
在介紹 Docker Compose 之前，我們需要先了解 **Docker**。

### **🔹 Docker 是什麼？**
Docker 是一種**容器化技術（Containerization Technology）**，它能夠將應用程式及其所有的依賴環境**打包到一個獨立的單元（容器）**，確保應用程式可以在任何環境下運行，而不會受到系統環境的影響。

💡 **簡單比喻**：「如果傳統伺服器管理方式就像是在不同的房間裡安裝應用程式，那麼 Docker 就像是貨櫃（Container），每個應用都被封裝在自己的貨櫃裡，並且可以在任何地方運行，無論是本地、伺服器，還是雲端環境。」

### **🔹 Docker 的優勢**
✅ **環境一致性**：無論在哪個平台上運行，Docker 容器內的應用程式環境都不會變。
✅ **輕量化**：與傳統虛擬機（VM）相比，Docker 不需要完整的作業系統，只需共享宿主機內核，因此佔用資源更少。
✅ **快速部署**：Docker 可以快速啟動、關閉和複製應用程式，提升開發與運行效率。
✅ **易於擴展**：透過 Docker，可以輕鬆擴展應用程式，並與 CI/CD（持續整合/持續部署）流程整合。

### **🔹 Docker 工作流程**
1. **撰寫 Dockerfile**：
   - Dockerfile 是描述如何構建容器映像的文件。
2. **建立 Docker 映像**：
   - 執行 `docker build` 命令，將應用程式與其依賴打包成 Docker 映像。
3. **運行 Docker 容器**：
   - 執行 `docker run` 命令，根據映像啟動一個或多個容器。
4. **管理 Docker 容器**：
   - 使用 `docker ps` 查看運行中的容器，`docker stop` 停止容器，`docker rm` 刪除容器。
  
### **🔹 Docker Compose 是什麼？**

Docker Compose 是 **Docker 提供的工具**，用來定義和管理**多個容器應用**。它透過 **YAML 格式的設定檔（`docker-compose.yml`）** 來描述應用的各個部分，然後可以**一鍵啟動或關閉整個應用**，無需逐個啟動每個容器。

💡 **簡單比喻**：「如果 Docker 是貨櫃（容器），那麼 Docker Compose 就是一個完整的貨運管理系統，你可以一次性安排多個貨櫃（容器）一起運行，而不用手動逐個搬運。」

### **🔹 Docker Compose 的核心概念**
Docker Compose 主要解決了在 **單機環境** 下管理多個容器的問題，並且提供了以下功能：

✅ **服務定義（Service Definition）**：可以在 `docker-compose.yml` 檔案中定義多個服務，例如 Web 伺服器、資料庫、快取系統等。
✅ **單指令管理（Single Command Management）**：可以使用 `docker-compose up -d` 啟動所有定義的容器，並且可以用 `docker-compose down` 一次關閉它們。
✅ **環境隔離（Isolation）**：每個應用在自己的容器中運行，確保不會影響到其他應用。
✅ **網路管理（Networking）**：自動建立內部網路，讓不同的容器彼此溝通，而不需要手動設定。
✅ **持久化存儲（Volumes）**：可以設定資料庫等服務的資料儲存位置，避免容器刪除時數據丟失。

### **🔹 Docker Compose 工作流程**
1. **撰寫 `docker-compose.yml` 檔案**：
   - 定義多個服務，例如 WordPress、MySQL、Nginx 代理等。
2. **使用 `docker-compose up -d` 啟動應用**：
   - Docker Compose 會根據 YAML 檔案，下載所需的 Docker 映像並啟動容器。
3. **管理容器應用**：
   - 透過 `docker-compose ps` 查看運行中的容器。
   - 透過 `docker-compose logs` 檢視日誌來排查錯誤。
   - 透過 `docker-compose down` 停止並刪除所有相關容器。

**🔸 優勢**
✅ 環境隔離：每個網站運行於獨立容器，互不影響。
✅ 快速部署：只需 `docker-compose up -d` 一鍵啟動所有網站。
✅ 易於擴展：新增網站只需修改 `docker-compose.yml`。

### **🔹為什麼可以讓傳統方式變容易？**
**🔸 傳統方式 vs. Docker Compose**

| **比較項目** | **傳統 Virtual Hosting** | **Docker Compose** |
|--------------|----------------------|----------------------|
| **環境獨立性** | 共用 OS，可能發生衝突 | **每個網站獨立運行於容器，無環境衝突** |
| **部署難度** | 需手動安裝與配置 | **一鍵 `docker-compose up` 啟動所有網站** |
| **擴展性** | 新增網站需修改 Nginx 設定 | **新增網站只需修改 `docker-compose.yml`** |


## **4️⃣ Nginx Proxy Manager 如何簡化多網站管理？**

### **🔹 Nginx 是什麼？**
Nginx（讀音為「Engine-X」）是一個高效能的 **Web 伺服器（Web Server）**，它可以用來處理 HTTP 請求、作為反向代理（Reverse Proxy）、負載平衡器（Load Balancer）以及快取伺服器（Cache Server）。

💡 **簡單比喻**：「如果一個網站是餐廳，Nginx 就像是一位高效的服務生，負責將顧客（用戶請求）引導到正確的座位（後端伺服器），並確保服務快速且流暢。」

### **🔹 為什麼使用 Nginx？**
✅ **高效能**：支援高併發請求，適合大規模網站。
✅ **靈活的反向代理功能**：可以幫助管理多個應用程式，並提供負載平衡。
✅ **內建快取**：減少對後端伺服器的請求，提高網站效能。
✅ **輕量化**：相較於 Apache，Nginx 的記憶體使用量較低，適合高效能環境。

### **🔹 Nginx Proxy Manager 是什麼？**
Nginx Proxy Manager（簡稱 NPM）是一個 **基於 Docker** 的 **反向代理工具**，它提供了一個易於使用的圖形介面，讓使用者可以管理多個網站的流量、SSL 憑證、自動反向代理，而不需要手動編寫 nginx.conf。

### **🔹 為什麼使用 Nginx Proxy Manager？**
✅ **簡化 Nginx 設定**：透過 Web UI 管理反向代理，不需要手動編寫 Nginx 配置檔。
✅ **內建 SSL 管理**：自動整合 Let's Encrypt，輕鬆申請與續約 HTTPS 憑證。
✅ **存取控制**：可以設定密碼保護、IP 限制等安全機制。
✅ **動態管理**：新增或刪除網站無需手動修改 `nginx.conf`，立即生效。

### **🔹 如何在 Docker Compose 中整合 Nginx Proxy Manager？**

#### **🔹 isunfa 應用的 Docker Compose 設定解析**
假設 `docker-compose.yml` 設定。

```yaml
version: '3.8'

services:
  npm:
    image: 'jc21/nginx-proxy-manager:latest'  # 使用官方 Nginx Proxy Manager 映像
    container_name: nginx_proxy_manager
    restart: always  # 確保容器在異常關閉時自動重啟
    ports:
      - '80:80'   # 將主機的 80 端口（HTTP）映射到容器內的 80 端口
      - '443:443' # 將主機的 443 端口（HTTPS）映射到容器內的 443 端口
      - '81:81'   # Nginx Proxy Manager Web UI 介面（登入管理）
    volumes:
      - npm_data:/data  # 儲存 Nginx Proxy Manager 設定檔案
      - npm_letsencrypt:/etc/letsencrypt  # 儲存 SSL 憑證資料
    networks:
      - proxy_network  # 讓所有服務共用相同的 Docker 網路

  isunfa:
    image: isunfa/app:latest  # isunfa 主要應用，使用 Next.js
    restart: always
    environment:
      DATABASE_URL: postgres://user:password@db:5432/isunfa
    networks:
      - proxy_network

  ai_service:
    image: isunfa/ai-service:latest  # AI 服務
    restart: always
    environment:
      API_KEY: your_api_key
    networks:
      - proxy_network

  db:
    image: postgres:14  # PostgreSQL 資料庫
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: isunfa
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - proxy_network

networks:
  proxy_network:
    driver: bridge  # 建立橋接網路，確保不同容器可以相互通訊

volumes:
  npm_data:
  npm_letsencrypt:
  db_data:
```

### **🔹 逐步解析設定內容**
1. **服務（services）**
   - `npm`：這是 **Nginx Proxy Manager**，作為反向代理來管理多個網站流量。
   - `isunfa`：這是 isunfa 主要應用，基於 **Next.js**，透過 `proxy_network` 來與 Nginx Proxy Manager 互通。
   - `ai_service`：這是 **AI 應用服務**，獨立運行，透過 API 供其他應用調用。
   - `db`：這是 **PostgreSQL 資料庫**，供 isunfa 主要應用使用。

2. **網路（networks）**
   - `proxy_network`：這是一個 **自訂的 Docker 網路**，確保 Nginx Proxy Manager、isunfa 應用、AI 服務、PostgreSQL 之間可以通訊。

3. **存儲卷（volumes）**
   - `npm_data` & `npm_letsencrypt`：分別用來 **儲存 Nginx Proxy Manager 的設定與 SSL 憑證**，確保重啟容器後設定不會遺失。
   - `db_data`：用來存放 PostgreSQL 數據，確保資料庫不會因為容器刪除而丟失。

---

### **🔹 部署與使用步驟**

#### **步驟 1️⃣：啟動 Docker Compose**
執行以下指令來啟動 Nginx Proxy Manager 及其他網站服務：
```sh
docker-compose up -d
```
這將會下載並啟動所有服務，並在背景執行。

#### **步驟 2️⃣：訪問 Nginx Proxy Manager 管理介面**
- 打開瀏覽器，輸入 `http://伺服器IP:81`
- 預設登入帳號：
  - **Email**: `admin@example.com`
  - **Password**: `changeme`

#### **步驟 3️⃣：新增 Proxy Host（代理主機）**
1. **進入 Proxy Hosts 頁面**，點擊 **Add Proxy Host**。
2. 設定 **Domain Name**（例如 `isunfa.com`）。
3. 在 **Forward Hostname / IP** 欄位輸入 **isunfa**（對應 `docker-compose.yml` 中的服務名稱）。
4. 在 **Forward Port** 欄位輸入 **3000**（對應 Next.js 的 Web 服務端口）。
5. 勾選 **Block Common Exploits** 來加強安全性。
6. （可選）勾選 **SSL**，並點擊 **Request a new SSL Certificate** 來自動申請 HTTPS 憑證。
7. 點擊 **Save**，完成代理設定。

### **🔹 為什麼可以讓傳統方式變容易？**
| **比較項目** | **傳統方式（手動 Nginx 配置）** | **Nginx Proxy Manager** |
|--------------|-----------------------------|---------------------------|
| **網站流量管理** | 手動修改 `nginx.conf` | **Web UI 可視化管理 Proxy Host** |
| **HTTPS/SSL** | 需手動安裝 `certbot` | **內建 Let's Encrypt 自動簽發 SSL** |
| **存取控制** | 需手動設定 Basic Auth | **Web UI 設定密碼保護、IP 限制** |

## **5️⃣ 為什麼 Docker 與 Nginx Proxy Manager 讓服務具備高可用性？**

高可用性（High Availability, HA）是指系統能夠在最少的停機時間內持續運行，即使部分元件發生故障，服務仍然可用。
儘管我們使用 **Docker Compose** 來管理應用程式，這仍然是一種 **單機（Single Host）模式** 的高可用性解決方案。這與 **多機高可用性（Multi-Host HA）**（例如 Kubernetes 或 Docker Swarm）不同，但仍然能在單機環境中提供穩定性與可靠性。

### **🔹 什麼是「高可用需求」？**
**高可用性（High Availability, HA）** 指的是 **確保網站在伺服器崩潰時仍然可用**，通常涉及：
1. **負載平衡**（Load Balancing）：分配請求到不同伺服器
2. **故障恢復**（Failover）：伺服器崩潰時，自動切換到備援伺服器
3. **自動擴展**（Auto Scaling）：當流量增加時，自動新增伺服器


### **🔹 Docker Compose 提供的高可用性**
1. **單機內部容器隔離**
   - 每個服務（`isunfa`、`ai_service`、`db`）都運行在自己的容器中，當某個容器崩潰時，不會影響其他容器。
   - 例如：如果 `isunfa` 當機，`ai_service` 仍然可以繼續提供服務。

2. **自動重啟與恢復**
   - `restart: always` 確保容器在崩潰或伺服器重啟後會自動啟動，減少服務中斷的時間。
   - 例如：如果 `db`（PostgreSQL）當機，Docker 會自動重新啟動它，確保資料庫仍然可用。

3. **數據持久化**
   - 透過 **Volumes**（如 `db_data`、`npm_data`），確保即使容器重啟，數據仍然保持完整，不會遺失。

4. **內部網路隔離**
   - `proxy_network` 讓所有應用透過 Docker 網路安全地互相通訊，並避免傳統單機架構下的網路衝突與端口管理問題

### **🔹 Nginx Proxy Manager 如何提升高可用性？**

1. **反向代理（Reverse Proxy）機制**：
   - 當用戶請求 `isunfa.com` 時，Nginx Proxy Manager 會自動將流量導向 `isunfa` 服務。
   - 如果 `isunfa` 服務當機，可以配置**備援機制（Failover）**，讓流量轉向其他服務。

2. **自動 SSL 管理（Let's Encrypt）**：
   - 透過內建的 Let's Encrypt，確保網站的 HTTPS 憑證自動續約，避免憑證過期導致的服務中斷。

3. **負載平衡（Load Balancing）**（可進一步擴展）：
   - 如果在單機內部啟動多個 `isunfa` 實例（使用 `docker-compose scale` 或手動定義多個服務），Nginx Proxy Manager 也可以設定**負載平衡**，將請求平均分配給不同的實例，減少單一服務壓力。

4. **動態配置（Hot Reload）**：
   - **新增或修改網站時，不需要重啟 Nginx**，所有更改立即生效，減少系統停機時間。

## **6️⃣ 跟傳統做法比較**
| **技術** | **取代傳統做法的哪些部分？** |
|----------|----------------------------|
| **Docker Compose** | 取代 Virtual Hosting，讓每個網站獨立運行 |
| **Nginx Proxy Manager** | 取代手動 Nginx 配置，讓網站流量與 SSL 更易管理 |
| **Docker Restart Policy** | 讓網站具備自動恢復能力，提高可用性 |
| **Cloudflare Tunnel** | 為網站提供全球 DDoS 防禦與流量優化 |


## **7️⃣ 這樣的架構與真正的分散式高可用性（如 Kubernetes 或 Swarm）有何不同？**
| **比較項目** | **單機高可用性（Docker Compose）** | **分散式高可用性（Kubernetes / Docker Swarm）** |
|--------------|--------------------------------|--------------------------------|
| **適用場景** | 單台伺服器運行多個應用 | 多台伺服器負載均衡，自動擴展 |
| **自動修復** | 只在單機內部自動重啟 | 可跨多機管理並分配流量 |
| **負載平衡** | 透過 Nginx Proxy Manager 代理 | 內建負載均衡機制 |
| **可擴展性** | 需手動啟動額外的應用容器 | 可自動動態擴展服務 |


## **8️⃣ 結論**
🚀 **Docker Compose + Nginx Proxy Manager 是「單機模式」下的高可用性解決方案**：
- 透過 Docker **自動重啟、容器隔離、數據持久化**，讓應用不易崩潰。
- 透過 Nginx Proxy Manager **反向代理、自動 SSL、負載平衡**，確保流量管理靈活。
- 雖然不能像  **Docker Swarm 或 Kubernetes** 那樣自動擴展到多台伺服器，但在**單機環境下已經提供足夠的穩定性**。


## **9️⃣ 最小學習範圍：如果要 Debug 需要了解哪些 Docker 與 Nginx 技術？**
**最少需要了解的內容**
1. **Docker Compose**
   - 會寫 `docker-compose.yml`
   - 會執行 `docker-compose up -d`、`docker-compose logs`
2. **Nginx Proxy Manager**
   - 了解反向代理（Reverse Proxy）的概念
   - 知道如何在 Web UI 設定 Proxy Host、SSL
3. **基本 Nginx 配置**
   - 知道 `proxy_pass` 是如何運作的
   - 會檢查 Nginx 設定 `nginx -t`
4. **錯誤排查**
   - 使用 `docker logs` 查看容器日誌
   - 使用 `systemctl status nginx` 檢查 Nginx 是否運行

**學習資源**
- **Docker 官方文檔**：[https://docs.docker.com/compose/](https://docs.docker.com/compose/)
- **Nginx Proxy Manager 官方文檔**：[https://nginxproxymanager.com/](https://nginxproxymanager.com/)
- **Let's Encrypt 教學**：[https://letsencrypt.org/](https://letsencrypt.org/)
