# 在本地的 Node.js 專案中從零開始使用 Prisma 和 TypeScript

本文將介紹如何在本地的 Node.js 專案中使用 Prisma 和 TypeScript，並逐步引導你完成設置和使用 Prisma 的過程。我們將使用 PostgreSQL 作為數據庫。

## 1. 初始化 Node.js 和 TypeScript 專案

首先，創建一個新的 Node.js 專案並初始化 TypeScript：

```bash
mkdir my-prisma-project
cd my-prisma-project
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init
```

## 2. 安裝 Prisma

接下來，安裝 Prisma CLI 和 Prisma Client：

```bash
npm install prisma --save-dev
npm install @prisma/client
```

## 3. 初始化 Prisma

使用 Prisma CLI 初始化 Prisma 設置：

```bash
npx prisma init
```

這將創建一個 `prisma` 目錄，裡面有一個 `schema.prisma` 文件。

## 4. 配置 `schema.prisma`

在 `schema.prisma` 文件中，配置數據源和生成器。我們將使用 PostgreSQL 作為數據庫：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

在專案根目錄創建一個 `.env` 文件，並添加你的 PostgreSQL 連接字符串：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
```

## 5. 定義數據模型

在 `schema.prisma` 文件中，定義一個簡單的 `Post` 模型：

```prisma
model Post {
  id    Int     @id @default(autoincrement())
  title String
  body  String
}
```

> ⚠️ **注意：Prisma 命名 Model 和變數的方式與傳統 DB 不同**
在使用 Prisma 時，命名模型（Model）和變數的方式通常與傳統資料庫中的命名方式不同。這是因為 Prisma 推薦使用單數形式和 PascalCase 的命名規範，而傳統資料庫則常使用複數形式和 snake_case 的命名方式。為了在不改變底層資料庫結構的情況下，讓 Prisma Client API 的命名更符合開發者的習慣，我們可以使用 @map 和 @@map 屬性來映射名稱。

### 使用 `@map` 和 `@@map` 的原因

1. **表命名規範不同**：資料庫中表的命名通常使用複數形式和 snake_case，而 Prisma 推薦使用單數形式和 PascalCase。
2. **變數與欄位命名不同**: 資料庫中的欄位名稱通常使用 snake_case，而 Prisma 推薦使用 camelCase。
3. **保持資料庫結構不變**：在不改變底層資料庫結構的情況下，讓 Prisma Client API 的命名更符合開發者的習慣。
4. **提升代碼可讀性**：使用更符合開發者習慣的命名方式，可以提升代碼的可讀性和可維護性。

### 使用 `@map` 和 `@@map` 的方式

#### 映射表及欄位名稱

假設資料庫中的表 `my_user` 有以下欄位：

```prisma
model my_user {{  
  user_id    Int     @id @default(autoincrement())  
  first_name String?  
  last_name  String  @unique  
}}
```

我們可以使用 `@map` 屬性將其映射為符合命名規範的欄位名稱：

```prisma
model MyUser {{  
  userId    Int     @id @default(autoincrement()) @map("user_id")  
  firstName String? @map("first_name")  
  lastName  String  @unique @map("last_name")  
  @@map("my_user")  
}}
```

這樣，Prisma Client 會自動將 `MyUser` 模型映射到底層資料庫中的 `my_user` 表，並將欄位名稱映射為 `user_id`、`first_name` 和 `last_name`。

> ⚠️ **警告：Prisma 模型和 TypeScript 對於可選字段的預設回傳值不同**

在使用 Prisma 模型和 TypeScript 時，需注意兩者對於可選字段的處理方式可能不同，這可能會導致 TypeScript 代碼中出現意外行為。

### Prisma 模型定義
在 Prisma schema 中，可以使用 `?` 符號來定義可選字段。例如：

```prisma
model UserEntity {
  id            Int     @id @default(autoincrement())
  email         String  @unique
  firstName     String
  lastName      String
  emailVerified Boolean? @default(false)
  mobile        String?
}
```

### 生成的 TypeScript 類型
當 Prisma 生成 TypeScript 類型時，這些字段可能不會如預期般標記為可選字段。例如：

```ts
export type UserEntity = {
  id: number
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean | null
  mobile: string | null
}
```

在這個生成的類型中，`emailVerified` 和 `mobile` 並未標記為可選字段（`?`），而是允許它們為 `null`。

### 預期的 TypeScript 類型
你可能期望生成的類型如下所示：

```ts
export type UserEntity = {
  id: number
  email: string
  firstName: string
  lastName: string
  emailVerified?: boolean
  mobile?: string
}
```

### 影響
這種差異意味著在 TypeScript 中，你必須始終提供這些字段，即使它們是 `null`，這可能會導致問題，特別是當你期望它們是真正的可選字段時。

### 問題示例
```ts
const user: UserEntity = {
  id: 1,
  email: "example@example.com",
  firstName: "John",
  lastName: "Doe",
  // TypeScript 會報錯如果沒有提供 emailVerified 和 mobile
}
```

### 注意事項
在處理 Prisma 模型中的可選字段及其對應的 TypeScript 類型時需謹慎。請始終檢查生成的類型以確保它們符合你的預期，並適當處理 `null` 值。

## 6. 推送數據庫

運行 Prisma `push`命令根據你的 schema.prisma 來同步資料庫的結構：

```bash
npx prisma db push
```

這將創建數據庫結構並設置 `Post` 表。

## 7. 生成 Prisma Client

運行以下命令來生成 Prisma Client：

```bash
npx prisma generate
```

## 8. 使用 Prisma Client

創建一個 `index.ts` 文件，並使用 Prisma Client 來創建和檢索數據：

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 創建一個新的 Post
  const newPost = await prisma.post.create({
    data: {
      title: '我的第一篇文章',
      body: '這是文章的內容。',
    },
  });
  console.log('新文章:', newPost);

  // 獲取所有的 Post
  const allPosts = await prisma.post.findMany();
  console.log('所有文章:', allPosts);

  // 更新一個 Post
  const updatedPost = await prisma.post.update({
    where: { id: newPost.id },
    data: { title: '更新後的文章標題' },
  });
  console.log('更新後的文章:', updatedPost);

  // 刪除一個 Post
  const deletedPost = await prisma.post.delete({
    where: { id: newPost.id },
  });
    console.log('已刪除的文章:', deletedPost);
}

```

---

## 9. 進階 CRUD 操作

### 9.1 一對一關係

假設我們有一個 `User` 模型和一個 `Profile` 模型，每個用戶都有一個對應的個人資料。

#### 定義模型

在 `schema.prisma` 中定義一對一關係：

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

### 創建和連接

創建一個用戶並連接一個個人資料：

```typescript
const newUser = await prisma.user.create({
  data: {
    email: 'alice@prisma.io',
    profile: {
      create: {
        bio: 'I like turtles',
      },
    },
  },
  include: {
    profile: true,
  },
});
console.log('新用戶:', newUser);
```

假設 `newUser` 的回傳值如下：

```json
{
  "id": 1,
  "email": "alice@prisma.io",
  "profile": {
    "id": 1,
    "bio": "I like turtles",
    "userId": 1
  }
}
```


### 9.2 一對多關係

假設我們有一個 `User` 模型和一個 `Post` 模型，每個用戶可以有多篇文章。

#### 定義模型

在 `schema.prisma` 中定義一對多關係：

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id     Int    @id @default(autoincrement())
  title  String
  body   String
  userId Int
  user   User   @relation(fields: [userId], references: [id])
}
```

#### 創建和連接

創建一個用戶並連接多篇文章：

```typescript
const newUserWithPosts = await prisma.user.create({
  data: {
    email: 'bob@prisma.io',
    posts: {
      create: [
        { title: 'Post 1', body: 'Content of post 1' },
        { title: 'Post 2', body: 'Content of post 2' },
      ],
    },
  },
  include: {
    posts: true,
  },
});
console.log('新用戶及其文章:', newUserWithPosts);
```

**預期回傳值:**
```json
{
  "id": 1,
  "email": "bob@prisma.io",
    "posts": [
        {
        "id": 1,
        "title": "Post 1",
        "body": "Content of post 1",
        "userId": 1
        },
        {
        "id": 2,
        "title": "Post 2",
        "body": "Content of post 2",
        "userId": 1
        }
    ]
}
```
---
### 9.3 多對多關係

假設我們有一個 `Post` 模型和一個 `Category` 模型，每篇文章可以屬於多個分類，每個分類也可以包含多篇文章。

#### 定義模型

在 `schema.prisma` 中定義多對多關係：

```prisma
model Post {{
  id         Int         @id @default(autoincrement())
  title      String
  body       String
  categories Category[]  @relation("PostCategories")
}}

model Category {{
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[] @relation("PostCategories")
}}

model _PostToCategory {{
  A      Int
  B      Int
  Post   Post     @relation(fields: [A], references: [id])
  Category Category @relation(fields: [B], references: [id])
  @@id([A, B])
}}
```

#### 創建和連接

創建一篇文章並連接多個分類：

```typescript
const newPostWithCategories = await prisma.post.create({{
  data: {{
    title: 'Prisma 多對多關係',
    body: '這是一篇關於 Prisma 多對多關係的文章。',
    categories: {{
      create: [
        {{ name: '技術' }},
        {{ name: '數據庫' }},
      ],
    }},
  }},
  include: {{
    categories: true,
  }},
}});
console.log('新文章及其分類:', newPostWithCategories);
```

**預期回傳值:**
```json
{
  "id": 1,
  "title": "Prisma 多對多關係",
  "body": "這是一篇關於 Prisma 多對多關係的文章。",
  "categories": [
    {
      "id": 1,
      "name": "技術"
    },
    {
      "id": 2,
      "name": "數據庫"
    }
  ]
}
```

---

### 9.4 Prisma 獨有的特性

#### 使用 `select` 選擇特定字段

有時你可能只需要獲取模型中的某些字段。你可以使用 `select` 來選擇特定字段：

```typescript
const selectedPost = await prisma.post.findUnique({{
  where: {{ id: newPostWithCategories.id }},
  select: {{
    title: true,
    body: true,
  }},
}});
console.log('選擇的文章字段:', selectedPost);
```

**預期回傳值:**
```json
{
  "title": "Prisma Introduction",
  "body": "This is a post about Prisma."
}
```

#### 使用 `include` 包含關聯數據

使用 `include` 可以在查詢時包含關聯數據，如下例所示。這在需要獲取關聯數據時非常有用：

```typescript
const posts = await prisma.user.findUnique({{
  where: {{ id: 2 }},
  include: {{
    post: true,
  }},
}});
console.log('包含關聯數據的用戶:', posts);
```

**預期回傳值:**
```json
{
  "id": 2,
  "name": "Alice",
  "email": "alice@prisma.io",
  "post": [
    {
      "id": 1,
      "title": "Prisma Introduction",
      "body": "This is a post about Prisma."
    },
    {
      "id": 2,
      "title": "Advanced Prisma",
      "body": "This is a post about advanced Prisma features."
    }
  ]
}
```

**`select` 和 `include` 的區別:**

- `select`：僅返回明確指定的字段。這對於需要精確控制返回數據的情況非常有用。
- `include`：包含額外的字段，例如關聯或延遲加載的屬性。這對於需要獲取關聯數據的情況非常有用。

#### 使用 `where` 過濾數據

你可以使用 `where` 條件來過濾數據。例如，獲取所有標題包含 "Prisma" 的文章：

```typescript
const filteredPosts = await prisma.post.findMany({
  where: {
    title: {
      contains: 'Prisma',
    },
  },
});
console.log('標題包含 "Prisma" 的文章:', filteredPosts);
```

**預期回傳值:**
```json
[
  {
    "id": 1,
    "title": "Prisma Introduction",
    "body": "This is a post about Prisma."
  },
  {
    "id": 3,
    "title": "Prisma vs TypeORM",
    "body": "This is a comparison post between Prisma and TypeORM."
  }
]
```

### 使用 `orderBy` 排序數據

`orderBy` 是 Prisma 中用來排序查詢結果的功能。你可以根據一個或多個字段來排序數據，並且可以指定升序（`asc`）或降序（`desc`）排序。

#### 單字段排序

你可以根據單個字段來排序數據。例如，按創建時間排序文章：

```typescript
const orderedPosts = await prisma.post.findMany({
  orderBy: {
    createdAt: 'desc',
  },
});
console.log('按創建時間排序的文章:', orderedPosts);
```

#### 多字段排序

Prisma 也支持多字段排序。這意味著你可以根據多個字段來排序數據，類似於 SQL 中的多列排序。例如，先按姓氏排序，再按名字排序：

```typescript
const sortedUsers = await prisma.user.findMany({
  orderBy: [
    {{ lastName: 'asc' }},
    {{ firstName: 'asc' }},
  ],
});
console.log('按姓氏和名字排序的用戶:', sortedUsers);
```

**預期回傳值:**
```json
[
  {
    "id": 1,
    "firstName": "Alice",
    "lastName": "Smith"
  },
  {
    "id": 2,
    "firstName": "Bob",
    "lastName": "Smith"
  },
  {
    "id": 3,
    "firstName": "Charlie",
    "lastName": "Brown"
  }
]
```

#### 嵌套排序

你還可以對嵌套的關聯數據進行排序。例如，按用戶的電子郵件排序，並對每個用戶的文章按標題排序：

```typescript
const usersWithPosts = await prisma.user.findMany({
  orderBy: {
    email: 'asc',
  },
  include: {
    posts: {
      select: {
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    },
  },
});
console.log('按電子郵件排序的用戶及其按標題排序的文章:', usersWithPosts);
```

**預期回傳值:**
```json
[
  {
    "id": 1,
    "email": "alice@prisma.io",
    "posts": [
      {
        "title": "Advanced Prisma"
      },
      {
        "title": "Prisma Introduction"
      }
    ]
  },
  {
    "id": 2,
    "email": "bob@prisma.io",
    "posts": [
      {
        "title": "Getting Started with Prisma"
      },
      {
        "title": "Prisma vs TypeORM"
      }
    ]
  }
]
```

#### 使用 `orderBy` 排序關聯數據的聚合結果

在 Prisma 2.19 中，引入了一個新功能，允許用戶根據關聯數據的聚合結果進行排序。例如，根據作者的文章數量來排序作者：

```typescript
const authors = await prisma.author.findMany({
  orderBy: {
    posts: {
      _count: 'desc',
    },
  },
});
console.log('按文章數量排序的作者:', authors);
```

**預期回傳值:**
```json
[
  {
    "id": 1,
    "name": "Author A",
    "postsCount": 10
  },
  {
    "id": 2,
    "name": "Author B",
    "postsCount": 5
  },
    {
        "id": 3,
        "name": "Author C",
        "postsCount": 3
    }
]
```

#### 排序複合類型

Prisma 也支持對複合類型進行排序。例如，根據運送地址中的城市名稱來排序訂單：

```typescript
const orders = await prisma.order.findMany({{
  orderBy: {{
    shippingAddress: {{
      city: 'asc',
    }},
  }},
}});
console.log('按運送地址中的城市名稱排序的訂單:', orders);
```

**預期回傳值:**
```json
[
  {{
    "id": 1,
    "shippingAddress": {{
      "city": "New York",
      "street": "123 Main St"
    }}
  }},
  {{
    "id": 2,
    "shippingAddress": {{
      "city": "San Francisco",
      "street": "456 Market St"
    }}
  }}
]
```

#### 排序並限制結果數量

你可以結合 `orderBy` 和 `take` 來排序並限制返回的結果數量。例如，按創建時間排序並只返回最新的 5 篇文章：

```typescript
const latestPosts = await prisma.post.findMany({
  orderBy: {
    createdAt: 'desc',
  },
  take: 5,
});
console.log('最新的5篇文章:', latestPosts);
```

**預期回傳值:**
```json
[
  {
    "id": 10,
    "title": "Latest Post 1",
    "createdAt": "2023-10-10T12:00:00.000Z"
  },
  {
    "id": 9,
    "title": "Latest Post 2",
    "createdAt": "2023-10-09T12:00:00.000Z"
  },
  {
    "id": 8,
    "title": "Latest Post 3",
    "createdAt": "2023-10-08T12:00:00.000Z"
  },
]
```

#### 排序並跳過部分結果

你可以結合 `orderBy` 和 `skip` 來排序並跳過部分結果。例如，按標題排序並跳過前 200 條記錄：

```typescript
const skippedPosts = await prisma.post.findMany({{
  skip: 200,
  orderBy: {{
    title: 'asc',
  }},
}});
console.log('按標題排序並跳過前200條記錄的文章:', skippedPosts);
```

**預期回傳值:**
```json
[
  {{
    "id": 201,
    "title": "Post 201"
  }},
  {{
    "id": 202,
    "title": "Post 202"
  }},
  {{
    "id": 203,
    "title": "Post 203"
  }}
]
```

### 9.5 一對多關係的更多操作

#### 創建多個關聯數據

創建一個用戶並同時創建多篇文章：

```typescript
const newUserWithPosts = await prisma.user.create({
  data: {
    email: 'bob@prisma.io',
    posts: {
      create: [
        { title: 'Post 1', body: 'Content of post 1' },
        { title: 'Post 2', body: 'Content of post 2' },
      ],
    },
  },
  include: {
    posts: true,
  },
});
console.log('新用戶及其文章:', newUserWithPosts);
```

#### 更新關聯數據

更新用戶的同時更新其文章：

```typescript
const updatedUserWithPosts = await prisma.user.update({
  where: { id: newUserWithPosts.id },
  data: {
    email: 'bob_updated@prisma.io',
    posts: {
      update: [
        { where: { id: newUserWithPosts.posts[0].id }, data: { title: 'Updated Post 1' } },
      ],
    },
  },
  include: {
    posts: true,
  },
});
console.log('更新後的用戶及其文章:', updatedUserWithPosts);
```

#### 刪除關聯數據

刪除用戶的同時刪除其文章：

```typescript
const deletedUserWithPosts = await prisma.user.delete({
  where: { id: newUserWithPosts.id },
  include: {
    posts: true,
  },
});
console.log('刪除的用戶及其文章:', deletedUserWithPosts);
```

---

### 9.6 多對多關係的更多操作

#### 創建多個關聯數據

創建一篇文章並同時創建多個分類：

```typescript
const newPostWithCategories = await prisma.post.create({
  data: {
    title: 'Prisma 多對多關係',
    body: '這是一篇關於 Prisma 多對多關係的文章。',
    categories: {
      create: [
        { name: '技術' },
        { name: '數據庫' },
      ],
    },
  },
  include: {
    categories: true,
  },
});
console.log('新文章及其分類:', newPostWithCategories);
```

#### 更新關聯數據

更新文章的同時更新其分類：

```typescript
const updatedPostWithCategories = await prisma.post.update({
  where: { id: newPostWithCategories.id },
  data: {
    title: '更新後的 Prisma 多對多關係',
    categories: {
      update: [
        { where: { id: newPostWithCategories.categories[0].id }, data: { name: '更新後的技術' } },
      ],
    },
  },
  include: {
    categories: true,
  },
});
console.log('更新後的文章及其分類:', updatedPostWithCategories);
```

#### 刪除關聯數據

刪除文章的同時刪除其分類：

```typescript
const deletedPostWithCategories = await prisma.post.delete({
  where: { id: newPostWithCategories.id },
  include: {
    categories: true,
  },
});
console.log('刪除的文章及其分類:', deletedPostWithCategories);
```

### 9.7 使用自定義多對多關係表

以下是使用複合主鍵的 `UserToPostToGame` 表的詳細教學，以及優缺點分析。

#### 9.7.1 定義 Prisma Schema

首先，您需要在 `schema.prisma` 文件中定義多對多關係，並使用複合主鍵。以下是一個範例：

```prisma
// schema.prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  posts UserToPostToGame[]
}

model Post {
  id    Int    @id @default(autoincrement())
  title String
  games UserToPostToGame[]
}

model Game {
  id    Int    @id @default(autoincrement())
  title String
  posts UserToPostToGame[]
}

model UserToPostToGame {
  userId Int
  postId Int
  gameId Int

  user   User @relation(fields: [userId], references: [id])
  post   Post @relation(fields: [postId], references: [id])
  game   Game @relation(fields: [gameId], references: [id])

  @@id([userId, postId, gameId])
}
```

#### 9.7.2 生成 Prisma Client

在終端機中運行以下命令來生成 Prisma Client：

```sh
npx prisma generate
```

#### 9.7.3 操作多對多關係

以下是一些操作多對多關係的範例代碼：

#### 創建新記錄並關聯

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 創建新用戶、帖子和遊戲並關聯
  const newUserToPostToGame = await prisma.userToPostToGame.create({
    data: {
      user: {
        create: {
          name: 'Alice'
        }
      },
      post: {
        create: {
          title: 'Post 1'
        }
      },
      game: {
        create: {
          title: 'Game 1'
        }
      }
    }
  });
  console.log(newUserToPostToGame);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### 9.7.4 查詢關聯數據

```javascript
async function main() {
  const userToPostToGameData = await prisma.userToPostToGame.findMany({
    include: {
      user: true,
      post: true,
      game: true
    }
  });
  console.log(userToPostToGameData);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 預期回傳值

#### 創建新記錄並關聯

```json
{
  "userId": 1,
  "postId": 1,
  "gameId": 1,
  "user": {
    "id": 1,
    "name": "Alice"
  },
  "post": {
    "id": 1,
    "title": "Post 1"
  },
  "game": {
    "id": 1,
    "title": "Game 1"
  }
}
```

#### 使用複合主鍵的好處

1. **數據完整性**：複合主鍵確保了 `UserToPostToGame` 表中的每一行都是唯一的，這樣可以防止重複的關聯記錄。
2. **查詢效率**：複合主鍵可以提高查詢效率，特別是在需要同時匹配多個列的情況下。
3. **簡化關聯**：在多對多關係中，使用複合主鍵可以簡化關聯表的設計和操作。
4. **增加彈性** :在需要存儲額外的元數據時提供了靈活性。

## 10. 最佳實踐

### Singleton 模式的 Prisma Client

在使用 Prisma Client 時，為了避免多次實例化帶來的資源浪費和潛在的連接問題，建議使用 Singleton 模式來管理 Prisma Client 的實例。以下是如何在 TypeScript 中設置 Prisma Client Singleton 的步驟。

### 10.1.1 創建 `client.ts` 文件
在專案的根目錄下創建一個名為 `client.ts` 的文件，並添加以下代碼。這將實例化一個 Prisma Client 實例。

```ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
```

### 10.1.2 在其他文件中使用 Prisma Client
在需要使用 Prisma Client 的文件中，導入並使用這個單例實例。

```ts
import prisma from './client'

async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}
```

### 為什麼要使用 Singleton 模式？
1. **資源管理**：避免多次實例化 Prisma Client，節省資源。
2. **連接管理**：減少資料庫連接數量，避免潛在的連接問題。
3. **一致性**：確保應用程式中使用的是同一個 Prisma Client 實例，避免狀態不一致的問題。
   
## 10.2 使用交易

在 Prisma 中使用交易（transaction）可以確保多個資料庫操作在一個原子操作中執行，如果其中任何一個操作失敗，所有的變更都會被回滾。以下是如何使用交易的說明：

### 使用交易的範例

假設你有以下的 CRUD 操作方法：

```js
const prisma = require('./db');

async function createUser(data) {
  return await prisma.user.create({
    data,
  });
}

async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}
```

你可以在一個交易中使用這些方法來鏈接多個操作：

```js
async function performTransaction() {
  let result;

  try {
    result = await prisma.$transaction(async (tx) => {
      const user = await createUser({ name: 'John' });
      const updatedUser = await updateUser(user.id, { name: 'Jane' });

      // 你可以在交易中執行更多操作

      return updatedUser;
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }

  console.log('Transaction completed:', result);
}

performTransaction()
  .catch((error) => {
    // 在這裡處理錯誤
  })
  .finally(async () => {
    await prisma.$disconnect(); 
  });
```

在這個範例中，`performTransaction` 使用 `createUser` 和 `updateUser` 方法在一個交易中執行多個操作。如果交易中的任何一個操作失敗，所有的變更都會被回滾。

## 結論

恭喜你！你已經成功地從零開始在本地的 Node.js 專案中使用 Prisma 和 TypeScript，並且使用 PostgreSQL 作為數據庫。你現在應該能夠：

- 定義數據模型並進行遷移
- 使用 Prisma Client 進行 CRUD 操作
- 處理一對一、一對多和多對多的關係
- 利用 Prisma 獨有的特性如 `select` 和 `include` 來優化查詢

Prisma 不僅讓你的數據庫操作變得簡單直觀，還提供了強大的工具來確保你的應用程序高效且安全。現在，你可以專注於編寫更有趣的應用邏輯，而不是糾結於數據庫查詢的細節。

現在，去創建一些令人驚嘆的應用吧！Prisma 讓數據庫操作變得如此簡單，你會發現自己有更多的時間來實現那些瘋狂的創意。Happy coding! 🚀

## 參考資料和網址

1. **Prisma 官方文件**
   - [Prisma Schema 參考](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#fields)
   - [Prisma ORM 概述](https://www.prisma.io/docs/orm/overview)
   - [Prisma Data Platform](https://www.prisma.io/docs/platform)
   - [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment/deployment-guides)
   - [Prisma 測試最佳實踐](https://www.prisma.io/docs/guides/testing)

2. **Prisma 博客文章**
   - [End-To-End Type-Safety with GraphQL, Prisma & React: API Prep](https://www.prisma.io/blog/e2e-type-safety-graphql-react-2-j9mEyHY0Ej#summary--whats-next)
   - [The Ultimate Guide to Testing with Prisma: End-To-End Testing](https://www.prisma.io/blog/testing-series-4-OVXtDis201#technologies-you-will-use)
   - [Fullstack App With TypeScript, PostgreSQL, Next.js, Prisma & GraphQL: Data Modeling](https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-oklidw1rhw#summary-and-next-steps)
   - [Fullstack App With TypeScript, PostgreSQL, Next.js, Prisma & GraphQL: Deployment](https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-5-m2fna60h7c#summary)

3. **GitHub 問題**
   - [如何知道更改數據庫時需要修改哪部分代碼](https://github.com/prisma/prisma/discussions/19066)
   - [PostgreSQL 擴展管理支持](https://github.com/prisma/prisma/issues/12308)

4. **YouTube 教學影片**
   - [Setting up a PostgreSQL database](https://www.youtube.com/watch?v=7ihvEtBAjRY)
   - [Set up a local PostgreSQL Database on macOS](https://www.youtube.com/watch?v=wTqosS71Dc4)
   - [Introspect a database with Prisma (2/5)](https://www.youtube.com/watch?v=NK2p6WNs7EY)
  
5. **其他資源**
   - [GitHub 討論關於可選字段](https://github.com/prisma/prisma/discussions/18360)
   - [GitHub 問題關於可選字段](https://github.com/prisma/prisma/issues/11927)
   - [如何在交易中返回 Prisma Promise](https://github.com/prisma/prisma/discussions/21225)
