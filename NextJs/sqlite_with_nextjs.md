# Using SQLite with Next.js
## 安裝 Prisma
`Prisma` 是一套可以透過 `JavaScript` 或 `TypeScript` 來操作資料庫套件，幫助開發人員更輕鬆地管理資料庫。能夠串接 `PostgreSQL`、`MySQL`、`SQLite`、`MongoDB` 等資料庫，並且提供 GUI 介面。

- 透過 npm 安裝 Prisma
```shell
npm i -D prisma
```

- 安裝 Prisma cilent
```shell
npm i @prisma/client
```

## 設置 schema.prisma 
- 初始化 Prisma
```shell
npx prisma init
```
- 完成後可以看到專案裡自動建立好的 `prisma/schema.prisma`，這個文件將定義資料庫的結構和模型，並通過 Prisma CLI 來生成相關的程式碼和工具

<img width="1023" alt="image" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/b40be2cd-6f2b-4c86-8d9e-69a5e16df66a">

- 如果使用的是 VS Code ，可以安裝 `Prisma` 套件讓文件自動標色，提升可讀性
<img width="984" alt="image" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/fac794ce-aa94-4aa6-86f2-73926701d7b7">

- 另外，在 `.env` 也會出現預設的 PostgreSQL url ，不過在本次範例中我們要使用的是 SQLite ，所以不會用到這裡的 database url

<img width="1045" alt="image" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/d4a5b659-f540-474a-a00e-3e373a795bc4">

## 撰寫 Prisma Schema
### 設定 Data Source
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

- 這裡定義資料庫種類是 SQLite ，並指定 URL 為當前目錄下的 `dev.db`

### 設定 Data Modal
```prisma
model KnowledgeManagement {
  id          String   @id @unique
  title       String
  description String
  categories  String
  picture     String
  authorId    String
  content     String
  date        DateTime @default(now())
}
```

- 這裡定義資料表的欄位、屬性和關聯。

參考來源
- [Prisma](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Using SQLite with Next.js 13](https://javascript.plainenglish.io/using-sqlite-with-next-js-13-cfa270e1d7ba)
- [The Easiest Way to Work with a Database in Next.js](https://www.youtube.com/watch?v=FMnlyi60avU)
- [仿Trello - Prisma 安裝與 Schema 建立](https://ithelp.ithome.com.tw/articles/10250424)
- [【Prisma】JavaScript 的資料庫工具 安裝](https://izo.tw/prisma/)
