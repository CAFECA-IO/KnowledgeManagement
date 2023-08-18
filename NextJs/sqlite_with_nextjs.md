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
model Post {
  id          String   @id
  title       String
  description String
  categories  String
  picture     String
  author      String
  content     String
  date        DateTime @default(now())
}
```

- 這裡定義資料表的欄位、屬性和關聯。以下為標籤的說明
  -  `@id`：主鍵
  -  `@unique`：表示欄位不能重覆
  -  `@default`：設定欄位預設值，例如 `@default(autoincrement())` 自動遞增、`@default(now())` 預設為目前時間等...
  -  `@relation`：描述不同 model 的欄位關聯性，詳細的說明可參考[官方文件](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

## 生成 Migration
```shell
npx prisma migrate dev --name init
```

- 在 `migration.sql` 中記錄了要放入資料庫的 Table 。在本例中只有一個 `Post` Table
<img width="886" alt="image" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/46b5c0c3-34e1-484c-8392-aa9c3306a5fa">

接下來執行 Prisma Studio：

```shell
npx prisma studio
```

- 執行後就可以在瀏覽器上透過 GUI 操作剛才生成的 Table

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/cb7a3a7b-d1f7-4b6b-bd0a-a85c5ac9d0a7)

## 連接 Next.js
```jsx
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```
完成資料庫的設定後，就可以在 Next.js 中進行 CRUD

### Create
```jsx
  const saveContact = await prisma.post.create({
    data: {
      id: 'km-20230818001',
      title: 'I am a title',
      description: "I'm a description",
      categories: 'category',
      picture: '/picture_src',
      author: 'julian',
      content: 'I am content',
    },
  });
```

### Read 
```jsx
// Filter by a single value
const post = await prisma.post.findMany({
  where: {
    id: {
      endsWith: '001',
    },
  },
})

// Read all
const allPosts = await prisma.post.findMany()
```

### Update
```jsx
const updatePost = await prisma.post.update({
  where: {
    id: 'km-20230818001',
  },
  data: {
    categories: 'newbie',
  },
})
```


### 參考來源
- [Prisma](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Using SQLite with Next.js 13](https://javascript.plainenglish.io/using-sqlite-with-next-js-13-cfa270e1d7ba)
- [The Easiest Way to Work with a Database in Next.js](https://www.youtube.com/watch?v=FMnlyi60avU)
- [仿Trello - Prisma 安裝與 Schema 建立](https://ithelp.ithome.com.tw/articles/10250424)
- [【Prisma】JavaScript 的資料庫工具 安裝](https://izo.tw/prisma/)
