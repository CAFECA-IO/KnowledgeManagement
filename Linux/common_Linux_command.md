## 常見的 Linux 指令

本文以 BAIFA-WEB-CRAWLING 為例, 說明常使用的 Linux 指令
可使用 outline 直接點擊欲瀏覽的該指令
- cd
- mkdir
- git clone
- ls
- cp
- vim
- /xx 
- dd
- i
- :wq
- rm -rf
- pm2
  - start
  - stop
  - restart
  - list
  - delete
  - kill
  - log
  - 查看log
- sh


 
### :star: cd 前往路徑
當前位置 `baifa@isunfa-crawler-001:/`

- cd [資料夾名稱] --> 前往該資料夾

  前往 workspace 資料夾：`cd workspace/`, 路徑變成 `baifa@isunfa-crawler-001:/workspace`

- cd .. --> 返回前一個路徑

  `cd ..`, 返回前一個路徑, 路徑變回 `baifa@isunfa-crawler-001:/`

![CleanShot 2024-03-29 at 14 11 25@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/b9aff5ca-043c-49ef-b95e-3de260be59d9)

### :star: mkdir 創建資料夾
- mkdir [資料夾名稱]

  `mkdir 0329ver`, 建立 0329ver 資料夾
  
![CleanShot 2024-03-29 at 14 22 44@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/d6d3baee-e7f7-4892-9224-4233b5ac5381)

### :star: git clone 下載 github 專案
- git clone [github 專案 https] --> 下載某 github 專案
- git clone -b [分支名稱] [github 專案 https] --> 下載某 github 專案中的特定分支

  `git clone -b feature/volume_holder https://github.com/CAFECA-IO/BAIFA-web-crawling.git`, 下載 github 專案 BAIFA-web-crawling 專案中 feature/volume_holder 分支
  
![CleanShot 2024-03-29 at 14 35 55@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/dbda58d1-d73e-4167-a10d-4257d47b5593)

### ⭐ ls 顯示檔案
- ls --> 顯示資料夾內的所有檔案
- ls -al --> 顯示資料夾內含隱藏的所有檔案

![CleanShot 2024-03-29 at 14 43 47@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/05716721-cf51-4a60-9d11-2c54f0aaf78e)

### :star: cp 複製檔案
- cp [要複製的檔案名稱] [複製出來的檔案名稱]

  `cp .env.sample .env`, 複製 .env.sample 檔案, 並取名為 .env, `.`表示此檔案為隱藏檔案
  
![CleanShot 2024-03-29 at 14 54 44@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/410ce5f9-56c7-46b2-b364-1fbf5f20622e)

### :star: vim 編輯檔案
- vim [要編輯的檔案名稱]

    `vim .env`, 要編輯 .env 檔案, 輸入完按下 enter 進入編輯畫面

![CleanShot 2024-03-29 at 14 58 30@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/e6697505-b52f-4b3b-a7a8-73afdbda8227)
![CleanShot 2024-03-29 at 14 59 46@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/c16c7400-1b4f-46a8-88b2-2088f0115d09)

### :star: /[內容] 搜尋內容
- 在 vim 環境中, 輸入 /[想要查詢內容] 之後按下 enter, 查詢該文件中想要查詢的內容

  輸入 `/HTTP`, 按下 enter 來搜尋 HTTP

- 若有不止一個 HTTP, 可以按 `n` 來搜尋下一筆, 直到文件底部
- 再按一次 `/` 離開搜尋功能

![CleanShot 2024-03-29 at 17 09 30@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/f0101e8c-a306-4697-a2d2-9ebd0c1192e7)
![CleanShot 2024-03-29 at 17 14 59@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/3a359919-eae7-4d5f-b929-1d781df0c870)


### :star: dd 刪除整行
- 在 vim 環境中, 按方向鍵來到想要整行刪除的地方, 按下 `dd` 刪除整行

![CleanShot 2024-03-29 at 17 03 59@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/28874dd1-e700-4925-b33a-ca554ac0b248)
![CleanShot 2024-03-29 at 17 07 02@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/8ee37e13-3d18-47da-9428-1caa40ababb8)

### :star: i 編輯模式
- 在 vim 環境中, 在要編輯處按下 `i` 進入編輯模式
- 編輯完後按 `esc` 離開編輯模式  
- 接著按 `:wq` 存檔並離開該檔案

![CleanShot 2024-03-29 at 17 21 56@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/263e2117-4cb2-437c-b082-bf162c44e5f8)
![CleanShot 2024-03-29 at 17 24 50@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/6af5cc27-3608-41c6-a876-b97b428faf38)
![CleanShot 2024-03-29 at 17 27 53@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/320f1f8d-5cdf-4840-b9c4-0fca2569beed)

### :star: rm 刪除資料夾、檔案
- rm [資料夾名稱] -rf
- -r：當 檔案 參數是目錄時，允許遞迴移除目錄及其內容
- -f：在移除防寫檔案之前不提示，如果指定的檔案不存在，則不顯示錯誤訊息或傳回錯誤狀態

  輸入 `rm 0322gibbstest -rf` 強制刪除此資料夾及其中檔案
  
![CleanShot 2024-03-29 at 18 06 15@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/f964dccc-962d-4b19-baf4-66364acd6e01)

### :star: pm2 管理
- 安裝pm2：`npm install pm2 -g`
- 進到包含有效的 "package.json" 文件（需包含一個 "start" 腳本）路徑中執行指令：

  `pm2 start npm --name 0329ver -- start`

  - `pm2 start`：PM2 的基本命令, 啟動一個新的應用程序
  - `npm`：指定了要啟動的應用程序是一個 Node.js 應用程序
  - `--name 0329ver`：給應用程序命名, 這裡名稱被指定為 "0329ver"
  - `-- start`：告訴 PM2 要運行 npm 的 "start" 腳本來啟動應用程序

- pm2 stop [id 或是 name] --> 停止該應用程序
![CleanShot 2024-04-01 at 11 08 04@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/414697dc-b54b-421a-90d0-e7310f20e59d)
![CleanShot 2024-04-01 at 11 13 18@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/8f0a3983-ecdf-4e87-b6d7-97c7969b0f53)

- pm2 restart [id 或是 name] --> 重新啟動該應用程序
![CleanShot 2024-04-01 at 11 28 57@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/f63a0d42-b467-4465-83ae-ace1c6bd2ad3)

- pm2 list --> 列出目前所有的應用程序
![CleanShot 2024-04-01 at 11 33 34@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/95d610f7-dab6-46ec-9ced-b5ad792dd2b7)

- pm2 delete [id 或是 name] --> 刪除指定應用程序
- 若想刪除目前所有應用程序, 直些輸入 `pm2 kill`
![CleanShot 2024-04-01 at 11 35 25@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/ddc4ab25-ff36-47c2-94f9-b731fa2aef20)

- pm2 log [id 或是 name] --> 顯示指定應用程序最新15筆log (out log 及 error log)
![CleanShot 2024-04-01 at 11 50 29@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/4912185c-f1df-4c2c-9126-fa1a283b267e)

### :star: 查詢 log 檔案
- `cd ~` --> 前往根目錄
- `ls -al` --> 顯示含隱藏的所有檔案
- `cd .pm2` --> 前往隱藏資料夾 .pm2
- `cd logs` --> 前往 logs 資料夾
![CleanShot 2024-04-01 at 13 48 13@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/825ffc6a-8976-4705-a93e-bfa6d4934371)

### :star: du 查詢目錄及檔案使用空間大小
- `du` --> 檢視檔案與目錄的使用空間狀態
- `-h` --> 將檔案大小以易讀方式呈現
- `-a` --> 列出所有檔案及資料夾, 包含隱藏檔
![CleanShot 2024-04-01 at 14 01 40@2x](https://github.com/CAFECA-IO/KnowledgeManagement/assets/73210852/11798b53-6e3d-43cd-95ad-8085b6592d54)








