# Using SQLite with Next.js
## 什麼是嵌入式資料庫
不需另外安裝，就能和系統程式語言整合到應用程式中的輕量級資料庫。由於資料庫就儲存在應用程式的本地文件中，無須網路連線，資料的存取可以更快速。嵌入式資料庫通常不需要複雜的配置過程，應用程式在運行時即可自動創建和管理資料庫。沒有額外的伺服器，所以部署和安裝也相對簡單，通常只須將資料庫文件和應用程式一起打包即可。而且大多數嵌入式資料庫都支持標準的 SQL 查詢語言，使得資料操作更便利，特別適合使用手機應用程式、桌面應用程式、嵌入式系統和遊戲開發等。

## 常見的嵌入式資料庫
1. SQLite：輕量級、零配置、支持標準 SQL 查詢語言和跨平台（包括移動設備和桌面應用程式），符合 ACID(Atomicity, Consistency, Isolation, Durability)。但是 SQLite 在多個使用者同時寫入操作時可能會受到一些限制，因此不適用於高流量的場景；如果應用程式為單用戶取向，未來也不會需要支援多用戶訪問，那麼 SQLite 提供了最簡單和高效的本地資料儲存解決方案。
2. Firebird：輕量級、支持跨平台和 ACID ，確保資料一致性。與 SQLite 不同的是，Firebird 能支援多個使用者同時訪問，特別適用於多用戶、伺服器端的場景。另外，Firebird 是完全開源的，可以自由使用和修改。
3. H2 Database：使用 Java 開發的輕量級嵌入式資料庫，支援 SQL 和 JDBC（Java Database Connectivity，是Java語言中用來規範客戶端程式如何來訪問資料庫的應用程式介面）。可以在本地快速啟動，並支援瀏覽器的 Console 介面。但由於其主要針對 Java，所以不太適用於非 Java 的應用程式。
4. Realm：適用於移動應用程式，特別是需要離線儲存和同步功能的場景，支援 iOS 和 Android，並提供跨平台的同步功能。Realm 還提供物件映射（ORM）API，避免讓使用者直接接觸 SQL 語法，簡化了程式語言的複雜度。但缺點是其關聯式查詢需求可能受限，相對不如其他嵌入式資料庫靈活。

分析以上多種嵌入式資料庫，我們選擇在本次專案中使用**SQLite**。

## Prisma
`Prisma` 是一套可以透過 `JavaScript` 或 `TypeScript` 來操作資料庫套件，幫助開發人員更輕鬆地管理資料庫。能夠串接 `PostgreSQL`、`MySQL`、`SQLite`、`MongoDB` 等資料庫，並且提供 GUI 介面。

其他類似功能的工具有：
1. Sequelize：用於 Node.js 的 ORM，支援多種關聯式數據庫，如 MySQL、PostgreSQL 和 SQLite。它提供類似 Prisma 的映射功能。
2. TypeORM：也是 Node.js 的 ORM，專注於 TypeScript，同樣支援多種關聯式數據庫，且具有良好的類型安全性。
3. SQLAlchemy：Python 的 ORM，支援多種關聯式數據庫。它提供了豐富的映射和查詢功能，並支援多種 SQL 表達式。
4. Hibernate：Java 的 ORM，專注於 Java 語言，支援多種關聯式數據庫。它提供了強大的映射和查詢功能，並廣泛用於 Java 開發領域。

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

- 另外，在 `.env` 也會出現預設的 darabase url ，將 DATABASE_URL 改為 `file:./dev.db`

<img width="1014" alt="image" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/29661cf2-b0cc-40dc-bff9-0df3bf7b7b52">

## 撰寫 Prisma Schema
### 設定 Data Source
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

- 這裡定義資料庫種類是 SQLite ，並指定 URL 為 `.env` 中的 DATABASE_URL 參數

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

// Get all
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

### Delete
```jsx
const deletePosts = await prisma.post.deleteMany({
  where: {
    author: {
      contains: 'julian',
    },
  },
})
```

## 應用實例
- API 內容
```ts
// /api/addPosts.ts
import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Info (20230818 - Julian) Check if the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed'});
  }

  const contactData = JSON.parse(req.body);
  // Info (20230818 - Julian) Create a new contact in the database
  const saveContact = await prisma.post.create({
    data: contactData,
  });

  res.status(200).json(saveContact);
}
```

- Form component (節錄)
```jsx
const FormComponent  = () => {
  {...}
  // Info: (20230818 - Julian) Call API to add new post
  const addPost = async (kmData: IKMData) => {
    const response = await fetch('/api/addPost', {
      method: 'POST',
      body: JSON.stringify(kmData),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  };

  // Info: (20230818 - Julian) Click submit button
  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    const newData: IKMData = {
      id: kmId,
      author: inputAuthorId,
      title: inputTitle,
      description: inputDescription,
      picture: inputPicture,
      categories: inputCategory,
      content: inputContent,
    };

    try {
      event.preventDefault();

      await addPost(newData);
      ...
    } catch (error) {
      console.log(error);
    }
  };

  return(...)
}
```


### 參考來源
- [嵌入式資料庫SQLite實務初探](https://www.syscom.com.tw/ePaper_Content_EPArticledetail.aspx?id=191&EPID)
- [在 Spring boot 開發中使用 H2 Database](https://ithelp.ithome.com.tw/articles/10309099)
- [維基百科 - Java資料庫連接](https://zh.wikipedia.org/zh-tw/Java%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5)
- [Realm 簡介](https://medium.com/appmaster-developers/realm-%E7%B0%A1%E4%BB%8B-ece4c4a76244)
- [Prisma](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Using SQLite with Next.js 13](https://javascript.plainenglish.io/using-sqlite-with-next-js-13-cfa270e1d7ba)
- [The Easiest Way to Work with a Database in Next.js](https://www.youtube.com/watch?v=FMnlyi60avU)
- [仿Trello - Prisma 安裝與 Schema 建立](https://ithelp.ithome.com.tw/articles/10250424)
- [【Prisma】JavaScript 的資料庫工具 安裝](https://izo.tw/prisma/)
