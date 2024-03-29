## 常見的 Linux 指令

本文以 BAIFA-WEB-CRAWLING 為例, 說明常使用的 Linux 指令

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

- pm2
  - start
  - log
  - stop
  - kill
  - delete
  - restart 
- rm -rf
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



