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

**為了更好地管理多個網站並提升靈活性，Nginx / Apache 通常會作為「反向代理（Reverse Proxy）」來管理網站流量。**

📌 **什麼是反向代理？**
> 這就像是一家公司的「前台接待員」，當訪客進來時，前台會根據需求將他們引導到正確的辦公室（網站）。

具體來說，當用戶請求 `blog.example.com`，反向代理伺服器會判斷這個請求應該轉發給 **WordPress 容器**；當請求 `shop.example.com`，則將請求轉發到 **Node.js 容器**。

📌 **為什麼需要反向代理？**
- **提升安全性**：隱藏內部伺服器，減少攻擊風險。
- **流量管理**：集中控制所有請求，確保網站可以動態分配資源。
- **HTTPS 管理**：反向代理可以統一處理 SSL 憑證，避免每個網站都需要獨立配置 HTTPS。

在傳統方式下，這些都需要手動配置 `nginx.conf` 或 `apache.conf`，並且當新增網站或修改設定時，必須重新啟動伺服器，管理起來相當麻煩。

這時候，**Docker Compose 與 Nginx Proxy Manager 就能讓這一切變簡單！**


## **3️⃣ Docker Compose 如何簡化多網站管理？**

### **🔹 Docker Compose 是什麼？**
Docker Compose 是 **Docker 提供的工具**，用來定義和管理**多個容器**的應用。

它使用 **YAML 配置文件（docker-compose.yml）**，讓你**一鍵啟動、管理多個網站環境**。

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

**🔸 Docker Compose 設定範例**
```yaml
version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    networks:
      - proxy_network

  shop:
    image: node:18
    networks:
      - proxy_network

networks:
  proxy_network:
    driver: bridge
```

## **4️⃣ Nginx Proxy Manager 如何簡化多網站管理？**
### **🔹 Nginx Proxy Manager 是什麼？**
Nginx Proxy Manager 是一個 **基於 Docker** 的 **反向代理工具**，**提供 Web UI 來管理多網站流量與 SSL 憑證**，不需要手動編寫 Nginx 配置。

**🔸 優勢**
✅ **不需要手動寫 Nginx 配置**
✅ **透過 Web UI 管理網站流量**
✅ **內建 Let's Encrypt，SSL 憑證自動續約**


### **🔹 為什麼可以讓傳統方式變容易？**
| **比較項目** | **傳統方式（手動 Nginx 配置）** | **Nginx Proxy Manager** |
|--------------|-----------------------------|---------------------------|
| **網站流量管理** | 手動修改 `nginx.conf` | **Web UI 可視化管理 Proxy Host** |
| **HTTPS/SSL** | 需手動安裝 `certbot` | **內建 Let's Encrypt 自動簽發 SSL** |
| **存取控制** | 需手動設定 Basic Auth | **Web UI 設定密碼保護、IP 限制** |


## **5️⃣ 什麼是高可用需求？Docker Compose + Nginx Proxy Manager 怎麼實現高可用性？**
### **🔹 什麼是「高可用需求」？**
**高可用性（High Availability, HA）** 指的是 **確保網站在伺服器崩潰時仍然可用**，通常涉及：
1. **負載平衡**（Load Balancing）：分配請求到不同伺服器
2. **故障恢復**（Failover）：伺服器崩潰時，自動切換到備援伺服器
3. **自動擴展**（Auto Scaling）：當流量增加時，自動新增伺服器

### **🔹 Docker Compose + Nginx Proxy Manager 如何提供高可用性**
✅ **1. Docker Restart Policy**
```yaml
restart: always
```
📌 **當網站崩潰時，Docker 會自動重新啟動網站容器**

✅ **2. Nginx Proxy Manager 反向代理**
📌 **如果一個網站掛掉，可以自動導向備援網站**

✅ **3. 可搭配 Cloudflare Tunnel**
📌 **讓網站流量經過 Cloudflare，減少 DDoS 攻擊影響**

---
---

## **6️⃣ 最小學習範圍：如果要 Debug 需要了解哪些 Docker 與 Nginx 技術？**
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

---



## **7️⃣ 總結**
| **技術** | **取代傳統做法的哪些部分？** |
|----------|----------------------------|
| **Docker Compose** | 取代 Virtual Hosting，讓每個網站獨立運行 |
| **Nginx Proxy Manager** | 取代手動 Nginx 配置，讓網站流量與 SSL 更易管理 |
| **Docker Restart Policy** | 讓網站具備自動恢復能力，提高可用性 |
| **Cloudflare Tunnel** | 為網站提供全球 DDoS 防禦與流量優化 |

