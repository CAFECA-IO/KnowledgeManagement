---
date: 1691452800
title: 'mongoose: odm solution of mongoDB'
description:
  '這篇文章深入探討了 mongoose，這是一個用於 Node.js 的 MongoDB ODM（Object Document Mapper）工具。文章首先解釋了 mongoose 的基本概念、特點和主要功能。其次，文章比較了 mongoose 和其他 MongoDB 互動工具的優缺點，接著，文章探討了 mongoose 與原生 MongoDB 之間的性能差異，並提供了一套測試流程，以測試兩者在插入和聚合操作上的效能差異。'
picture: '/km/03.png'
category: ['KM_CATEGORY.DATABASE']
authorId: 'emily'
---
# mongoose: odm solution of mongoDB
## mongoose 是什麼
`mongoose` 是一個 Node.js 套件，是 MongoDB 的 ODM（Object Document Mapper，物件數據映射，解釋見下方補充說明的部分）物件模型工具，用於異步處理環境中對 MongoDB 資料庫的操作。
它提供了一個更高級的抽象層來操作數據庫。使用 `mongoose`，你可以定義模式（Schemas）和模型（Models），並且它允許你在 JavaScript 中使用類似於 OOP 的方式來處理數據庫操作。這使得 `mongoose` 在Node.js環境中與MongoDB的交互變得更加簡單，在開發速度和易用性方面非常優越。

以下是一些 `mongoose` 的主要特點：

- 模式定義 (Schema Definition)：你可以在 NoSQL 數據庫中定義模式及定義文檔的結構和屬性，包括屬性類型、預設值和驗證器。這對於確保數據一致性和進行數據驗證非常有用。
- 模型創建 (Model Creation)：模型是基於你定義的模式而建立的。一旦你有了一個模型，你就可以用它來創建、查詢、更新和刪除特定的文檔。
- 連接管理 (Connection Handling)：mongoose 能夠管理多個數據庫連接。
- 中間件 (Middleware)：允許你在某些操作（例如保存或查詢）之前或之後執行代碼。
- 靜態和實例方法 (Static and Instance Methods)：你可以為模型或文檔定義自己的方法。
- 查詢強化 (Query Enhancement)：你可以用 JavaScript 連鎖方法來構建和修改查詢。
- 虛擬屬性 (Virtuals)：允許你定義某些屬性，它們不會被保存到 MongoDB，但可以在其他屬性基礎上進行計算。
- 內置的型別轉換器 (Built-in Type Casting)：自動將資料轉換為定義的類型。
- 插件系統 (Plugin System)：你可以使用第三方插件或自己寫的插件來擴展 mongoose 的功能。

如果使用 Node.js 和 MongoDB 進行開發，`mongoose`可以提供一個更加結構化和有序的方式來管理數據存儲和操作。

## mongoose 的替代方案及優缺點比較
當考慮使用 Mongoose 或其它替代方案來與 MongoDB 互動時，每種選擇都有其特定的優缺點。以下是 Mongoose 與一些替代方案的優缺點比較：

1. **Mongoose**:
   
   **優點**:
   - 模式定義: Mongoose 讓你可以在 NoSQL 數據庫中定義模式。這對於確保數據一致性和進行數據驗證非常有用。
   - 中間件: Mongoose 提供中間件，允許在某些操作之前或之後執行特定的函數，如保存或查找。
   - 易於使用的 API: Mongoose 提供了一個直觀和鍊式的 API，使得資料庫操作更簡單且易於理解。
   - 靜態方法和實例方法: 你可以在 Mongoose 模型中添加自訂的方法，這提供了更大的靈活性。
   - 虛擬屬性: 能夠定義虛擬屬性以便進行計算，但不實際儲存在數據庫中。
   - 豐富的查詢語言: Mongoose 提供了一個功能強大的查詢語言，用於構建和執行複雜的查詢。
   - 自動化的資料庫連接管理: Mongoose 處理資料庫連接和重連的細節。
   
   **缺點**:
   - 性能開銷: 相對於直接使用 MongoDB 的原生驅動程式，Mongoose 會增加一些性能開銷，尤其是在大量操作時。
   - 學習曲線: 儘管 Mongoose 設計得相對用戶友好，但對於初學者來說，可能還是需要一些時間來學習其API和概念。
   - 靈活性: 由於 Mongoose 在背後提供了許多抽象，所以某些高級功能或特定的 MongoDB 特性可能難以使用或需要額外的配置。
   - 不總是與 MongoDB 的最新功能保持同步: 當 MongoDB 推出新功能時，Mongoose 可能需要一些時間來支援這些新特性。

2. **原生 MongoDB 驅動程式**:
Native MongoDB Node.js Driver: 這是 MongoDB 官方提供的 Node.js 驅動程式。它提供了直接操作 MongoDB 的基本功能。
   **優點**:
   - 直接、快速且沒有額外開銷。
   - 可直接使用 MongoDB 的所有功能和最新特性。
   
   **缺點**:
   - 缺少模式驗證和其他高階特性。
   - API 可能不如其他抽象層直觀。

3. **Waterline (通常與 Sails.js 一起使用)**:
這是 Sails.js web 應用框架的一部分，是一個多資料庫的 ORM (Object-Relational Mapping) 。它支援多種資料庫系統，包括 MongoDB。
   **優點**:
   - 多數據庫支援，提供統一的 API。
   - 較為靈活且易於擴展。
   
   **缺點**:
   - 可能不如 Mongoose 那麼專門針對 MongoDB 優化。
   - 學習曲線可能較陡峭，尤其是如果你不使用 Sails.js。

4. **TypeORM**:
主要用於關聯型資料庫，但 TypeORM 也支援 MongoDB。它特別適合於 TypeScript 使用者，因為它允許使用裝飾器來定義模式和關聯。
   **優點**:
   - 支援 TypeScript 和多數據庫。
   - 提供豐富的裝飾器和高級功能。
   
   **缺點**:
   - 對 MongoDB 的支援可能不如專門的 ORM 那麼完善。
   - 可能需要更多的配置和設定。

5. **Monk**:
這是一個更輕量級的 Node.js 模塊，用於與 MongoDB 交互。它提供了更簡單的API，且不像 Mongoose 那樣有嚴格的模式定義。
   **優點**:
   - 簡單且直觀的 API。
   - 輕量級，無需模式定義。
   - 優越的性能。
   
   **缺點**:
   - 缺少高階功能，如模型驗證和中間件。

6. **Camouflage**:
是一個用 TypeScript 寫的 ODM，提供了靜態類型支援和其他 TypeScript 的好處。
   **優點**:
   - 類似 Mongoose 的接口。
   - 支援 TypeScript。
   
   **缺點**:
   - 可能不像 Mongoose 那麼成熟和廣泛使用。

7. **Connect-mongo**:
 用於 Express.js 的 session 存儲，直接與 MongoDB 交互。
   **優點**:
   - 專為將 MongoDB 用作 Express.js 會話存儲而設計。
   - 簡單易用。

   **缺點**:
   - 功能限制，只適用於 Express.js 會話管理。

8. **Caminte**:
 這個 ORM (Object-Relational Mapping) 支援多種 SQL 和 NoSQL 數據庫，包括 MongoDB。它提供了一個統一的 API 來處理各種數據庫的操作。
   **優點**:
   - 支援多種 SQL 和 NoSQL 數據庫。
   - 統一的 API 對於不同的數據庫。
   
   **缺點**:
   - 可能不如專為 MongoDB 設計的工具那麼優化。

9. **Dynamoose**:
如果你正在尋找一個類似於 Mongoose 的庫，但專門用於 Amazon DynamoDB，那麼 Dynamoose 可能是一個好選擇。
   **優點**:
   - 專為 Amazon DynamoDB 設計，提供類似 Mongoose 的體驗。
   - 支援模型驗證、中間件等。
   
   **缺點**:
   - 僅針對 Amazon DynamoDB。

總的來說，選擇哪一種工具取決於你的具體需求。例如，如果你想要一個輕量級的 MongoDB 工具，Monk 可能是個好選擇；如果你使用 Express.js 並需要處理會話存儲，Connect-mongo 是合適的；而如果你正在使用 Amazon DynamoDB，Dynamoose 將是最佳選擇；如果你希望有強大的模式驗證和中間件支援，Mongoose 可能是最佳選擇。如果你想要直接、無開銷的訪問 MongoDB，原生驅動可能更適合你；而如果你的應用程序需要支援多個數據庫或使用 TypeScript，那麼 Waterline 或 TypeORM 可能更符合你的需求。

## Mongoose vs MongoDB 效能差異
- 原生 MongoDB 驅動程式: 由於直接與數據庫通訊，通常來說原生驅動會提供較佳的性能。它沒有額外的抽象層，因此操作通常更快。
- Mongoose: Mongoose 在背後添加了一個抽象層，這意味著在資料進入和離開數據庫時會有一些額外的處理，例如模式驗證、數據轉換等。這些操作可能導致某些情況下的性能輕微下降。

### 測試 mongoose 跟原生 mongoDB 的效能差異
安裝必要的 npm 包：
```shell=
npm install mongoose mongodb
```
#### 測試一： insert data
insert 10萬筆 trade，trade 含有 auto increase ID 、timstamp、price、amount等屬性，每筆 trade 的 timestamp 間隔為 100ms，在 insert 的迴圈外部用 `console.time("NativeMongoInsert");`
包住來計算時間。
**撰寫原生MongoDB測試用例:**
```typescript=
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'testDB';

async function nativeMongoTest() {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('trades');

    let autoIncrementID = 1;
    const startTime = Date.now();

    console.time("NativeMongoInsert");
    for (let i = 0; i < 100000; i++) {
        await collection.insertOne({
            id: autoIncrementID++,
            timestamp: startTime + i * 100,
            price: Math.random() * 1000,
            amount: Math.random() * 10
        });
    }
    console.timeEnd("NativeMongoInsert");
    
    await client.close();
}

nativeMongoTest();
```
**撰寫Mongoose測試用例:**
```typescript=
const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });

    id: Number,
    timestamp: Number,
    price: Number,
    amount: Number
});

const Trade = connection.model('Trade', tradeSchema);

async function getLastTradeID() {
    const lastTrade = await Trade.findOne().sort({ id: -1 }).select('id');
    return lastTrade ? lastTrade.id : 0;
}

async function mongooseTest() {
    const currentID = await getLastTradeID();
    const startTime = Date.now();

    console.time("MongooseInsert");
    for (let i = 0; i < 100000; i++) {
        await Trade.create({
            id: +currentID + i,
            timestamp: startTime + i * 100,
            price: Math.random() * 1000,
            amount: Math.random() * 10
        });
    }
    console.timeEnd("MongooseInsert");

    await connection.close();
}

mongooseTest();
```
#### 測試二： aggregation
加總price*amount的測試，加上時間區間的條件，至少加總10萬筆資料的值。在測試一中我們 insert 了至少 50萬筆(因為是測五次 insert 10萬筆資料的平均時間，所以至少 insert 5次 10萬筆)，所以選定一個起始時間或是結束時間，時間跨度為100000 * 100，這邊用當下時間作為結束時間，起始時間則為結束時間減去時間跨度（可以這樣做的原因是，這是在 insert 測試完之後就馬上測試 aggregation，更保險的做法應該是取得最新一筆紀錄的 timestamp 然後減去時間跨度）。計算耗時的方法一樣是用 `console.time()`
**原生 MongoDB 測試用例:**
```typescript=
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'testDB';

async function nativeMongoSumTest() {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('trades');

    const endTime = Date.now();
    const startTime = endTime - (100000 * 100);

    console.time("NativeMongoSum");
    
    const aggregation = [
        {
            $match: {
                timestamp: {
                    $gte: startTime,
                    $lte: endTime
                }
            }
        },
        {
            $project: {
                product: {
                    $multiply: ["$price", "$amount"]
                }
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$product"
                }
            }
        }
    ];
    
    const result = await collection.aggregate(aggregation).toArray();
    console.log("Total (Native MongoDB):", result[0].total);
    
    console.timeEnd("NativeMongoSum");
    
    await client.close();
}

nativeMongoSumTest();
```
**撰寫Mongoose測試用例:**
```typescript=
const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });

const tradeSchema = new mongoose.Schema({
    id: Number,
    timestamp: Number,
    price: Number,
    amount: Number
});

const Trade = connection.model('Trade', tradeSchema);

async function mongooseSumTest() {
    const endTime = Date.now();
    const startTime = endTime - (100000 * 100);

    console.time("MongooseSum");
    
    const aggregation = [
        {
            $match: {
                timestamp: {
                    $gte: startTime,
                    $lte: endTime
                }
            }
        },
        {
            $project: {
                product: {
                    $multiply: ["$price", "$amount"]
                }
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$product"
                }
            }
        }
    ];
    
    const result = await Trade.aggregate(aggregation).exec();
    console.log("Total (Mongoose):", result[0].total);
    
    console.timeEnd("MongooseSum");
    
    await connection.close();
}

mongooseSumTest();
```
### 測試結果

| insert         | 測試 1 耗時  | 測試 2 耗時  | 測試 3 耗時  | 測試 4 耗時  | 測試 5 耗時  | 平均耗時  |
| -------------- | ----------- | ---------- | ---------- | ----------- | ---------- | ---------- |
| native mongodb |     24.242s |    24.301s |    24.257s |    24.377s |    24.203s |     24.276s | 
| mongoose       |     39.737s |    40.052s |    40.124s |    39.996s |    39.994s |    39.9806s | 

| aggregation    | 測試 1 耗時  | 測試 2 耗時  | 測試 3 耗時  | 測試 4 耗時  | 測試 5 耗時  | 平均耗時  |
| -------------- | ----------- | ---------- | ---------- | ----------- | ---------- | ----------  |
| native mongodb |   481.365ms |   487.539ms |   485.882ms |   478.156ms |   475.872ms |   481.7628ms |
| mongoose       |   488.866ms |   489.436ms |   496.954ms |    486.99ms |   488.727s |   490.1946ms |

### 結論
這些測試結果展示了在插入和聚合操作上，native mongodb和mongoose之間的效能差異。

1. **insert(插入)操作**:

根據您的測試結果，當使用原生的MongoDB進行插入操作時，效能明顯優於Mongoose。原生MongoDB的插入速度平均快了大約15.7秒。Mongoose提供了許多方便的功能和工具，但這些額外的功能可能在某些情況下導致效能上的損耗。

2. **aggregation(聚合)操作**:

在聚合操作上，效能差異相對較小。不過，原生的MongoDB在此方面仍然較快，與Mongoose的差異約為8.4ms。

**結論**:
原生的MongoDB在這兩種操作上都有更好的效能。然而，選擇使用Mongoose還是原生MongoDB並不僅僅基於效能考量。Mongoose為開發者提供了許多方便的功能，如模型驗證、中間件和插件，這可以簡化開發過程並增加代碼的可讀性和維護性。

對於那些對效能有嚴格要求的應用程序，或是需要大量數據操作的情境，使用原生的MongoDB可能是更好的選擇。對於其他多數情境，Mongoose的方便性可能會優於其較低的效能。

# 在 mongoose 中如何使用 transaction
在 MongoDB 4.0 以後的版本中，引入了事務（transaction）的概念，可以讓你在一個單一的 session 中執行多個操作，並且這些操作可以一起被提交或者被回溯。在 NestJS 與 Mongoose 中，你可以使用以下方式來實現這種需求：

### 1.將 MongoDB 從單機模式（standalone）轉換為副本集（replica set）
將 MongoDB 從單機模式（standalone）轉換為副本集（replica set）可以實現數據的高可用性和數據安全性。當主節點出現問題時，副本集可以自動選舉出一個新的主節點來提供服務，進而保證數據庫的可用性。另外，副本集模式還支持在多個節點上保存數據的副本，從而提高數據的安全性。

將單機模式的 MongoDB 轉換為副本集需要以下步驟([ref:](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/))：
1. DB 備份

```shell=
mongodump -d tidebit-defi -o /home/tidebit/tidebit-defi.backup
```

2. 關閉 database
  2.1. 使用 `mongosh` 連線進入 `mongod` 實體
  2.2. 使用 admin `use admin`
  2.3. 使用下列語句關閉 database
   
```shell=
   db.adminCommand(
     {
        shutdown: 1,
        comment: "Convert to cluster"
     }
   )
```

3. 修改 MongoDB 配置文件
MongoDB 的配置文件通常為 mongod.conf 或 mongodb.conf。在該配置文件中，需要添加或修改以下行來指定副本集名稱：

```shell=
replication:
  replSetName: "rs0"
```

"rs0" 是副本集的名稱，你可以根據需要來修改。
**注意，這需要在你打算加入副本集的每一台機器上都進行。**

4. 重新啟動 MongoDB
我們是是使用 screen 啟動 mongoDB

```shell=
sudo screen mongod --config /etc/mongod.conf --replSet
```

5. 初始化副本集
在任何一台你打算加入副本集的機器上，使用 `mongosh` 連線進入 `mongod` 實體，然後執行以下命令來初始化副本集

```shell=
rs.initiate()
```

6. 添加節點到副本集
使用以下命令來將其他機器添加到副本集：

```shell=
rs.add("mongodb://otherhost:27017")
```

"otherhost" 應該替換為你打算添加的機器的主機名或 IP 地址。如果 MongoDB 服務不是運行在標準端口（27017）上，也需要修改端口號。

7. 確認副本集狀態
使用以下命令來檢查副本集的狀態：

```shell=
rs.status()
```

這將顯示副本集的狀態，包括所有節點的狀態和選舉狀態等。

8. 如果更新失敗要將 DB 復原

```shell=
mv /var/lib/mongodb  /var/lib/mongodb.backup
mkdir /var/lib/mongodb 
mongorestore --drop /home/tidebit/tidebit-defi.backup/ --nsInclude=tidebit-defi.*
```

[add user to DB](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/deploy/mongodb.md#add-a-user-to-a-database)

請注意，副本集需要至少三個節點才能正常工作。在只有兩個數據節點的情況下，建議添加一個仲裁節點（arbiter），仲裁節點不持有數據，但可以參與選舉過程。

**在 replica set 的環境中，只有一台伺服器（即 primary 伺服器）可以接受寫入操作，包括事務（transaction）。**

### 2. session 並開始一個事務：
```typescript=
const session = await this.model.startSession();
session.startTransaction();
```
### 3. 在此 session 中執行數據庫操作：

```typescript=
try {
  const opts = { session };

  // 假設 balanceModel, transactionModel, orderModel 分別為你的餘額、交易和訂單的 Mongoose 模型
  await this.balanceModel.updateOne({ userId }, { $inc: { balance: amount } }, opts);
  await this.transactionModel.create([transactionData], opts);
  await this.orderModel.create([orderData], opts);

  // 如果所有操作都成功，則提交事務
  await session.commitTransaction();

} catch (error) {
  // 如果有任何操作失敗，則回溯事務
  await session.abortTransaction();
  throw error;  // 傳播錯誤以供處理
} finally {
  // 無論成功或失敗，最後都需要結束 session
  session.endSession();
}
```
在上述代碼中 `{ $inc: { balance: amount } }` 用於將餘額增加特定的數量。如果該操作導致餘額變為負數，則該操作將拋出一個錯誤，事務將被回溯，並且之前在此事務中所做的所有操作都將被撤銷。

注意，MongoDB 的事務功能需要在同一個 replica set 中的多個伺服器之間進行協調，因此在使用該功能時可能會有一些效能的開銷。

### 4. 在 NestJS 修改 DB 連線資訊
要在 NestJS 中連接到 MongoDB 副本集，你需要在 MongooseModule 中提供適當的連接字串和選項。

在副本集的連接字串中，你需要列出副本集中的所有節點，並指定副本集的名稱。一個典型的 MongoDB 副本集連接字串如下：

```shell=
mongodb://host1:27017,host2:27017,host3:27017/mydatabase?replicaSet=myReplicaSet
```
在上面的連接字串中，host1、host2 和 host3 是副本集中的節點，27017 是他們的端口，mydatabase 是你的數據庫名稱，myReplicaSet 是副本集的名稱。

在實際的應用中，你應該將 MongoDB 連接字串存放在一個環境變數或者配置文件中，並在需要的地方讀取這個值，而不是將它直接寫在代碼中。這樣可以提高應用的安全性和可維護性。

# 在 NestJS 使用事務（transaction）遇到的問題
1. 目前我們在**第四步（在 NestJS 修改 DB 連線資訊）**的嘗試是失敗的，我們將 DB 轉為副本集（replica set）後，無法在 nestJS 連上DB，tableplus 卻可以，應該是還有些設定需要微調。
2. 再來是實際上我們只會使用一台伺服器，轉為副本集也只有使用一台server，處理效能上會有一些損失，可能會有一些潛在的風險。

# 思考：如何在單機（standalone）使用應用層面的一些方法來模擬事務的行為？
在單機 MongoDB 環境下，使用 Mongoose 的 middleware，你可以定義在保存、更新或刪除 document 之前或之後要執行的操作。這在某些情況下可以模擬事務的行為，以下面的例子來說明，假設我們有 User 和 Order 兩個模型，一個用戶想要創建一個訂單，這需要在 Order 集合中新增一個文檔並從 User 集合中的對應用戶餘額中扣除訂單金額。

下面的程式碼展示了如何在 Order 模型的 save 方法被調用之前，先檢查用戶餘額是否足夠並做扣款的操作：

```typescript=
import { Schema } from 'mongoose';
import { User } from './models/user.model';

const OrderSchema = new Schema({
  userId: Schema.Types.ObjectId,
  amount: Number,
  // ...其他欄位
});

OrderSchema.pre('save', async function(next) {
  // `this` 指向要保存的訂單文檔
  const order = this;

  // 獲取用戶信息
  const user = await User.findById(order.userId);

  // 檢查用戶餘額是否足夠
  if (user.balance < order.amount) {
    throw new Error('Insufficient balance');
  }

  // 扣除用戶餘額
  user.balance -= order.amount;
  await user.save();

  next();
});
```

在這個例子中，如果用戶餘額不足以支付訂單金額，則會拋出一個錯誤，並且訂單不會被保存。如果餘額充足，則會從用戶餘額中扣除訂單金額，然後保存訂單。

不過這個過程並不是原子性的，也就是說，如果在扣款和保存訂單之間系統出現錯誤或崩潰，那麼用戶餘額可能已經被扣除，但是訂單並未保存。在一個真正的事務中，這些操作要麼全部成功，要麼全部不執行，但在單機 MongoDB 中，我們無法確保這一點。這也是為什麼在處理涉及到多個文檔的複雜操作時，應該考慮使用支持事務的數據庫系統，或者在應用層面設計其他方式來確保數據的一致性和完整性。

## 資料庫事務的四個主要特性

資料庫事務的四個主要特性通常被稱為 ACID 特性，其中每個字母代表一種特性：

1. 原子性（Atomicity）: 在資料庫管理系統（DBMS）中，原子性確保事務（一系列操作）被視為一個單一的不可分割的工作單位，這意味著事務中的所有操作都必須成功完成，否則都不會執行。換句話說，如果事務的一部分失敗，整個事務都會失敗，並且系統將返回到事務開始之前的狀態。這確保了資料的一致性。例如，在銀行轉帳的情境中，從一個帳戶扣除金額和將金額加到另一個帳戶應該被視為一個單一的不可分割的事務。如果在這兩個操作中的任何一個失敗，事務應該完全回溯，以確保資料的一致性。總結來說，原子性是確保一系列操作作為一個整體完整執行的屬性，要么所有操作都成功執行，要么都不執行。
2. 一致性（Consistency）: 一致性確保事務將數據從一種一致的狀態轉換為另一種一致的狀態。一致性規則通常由業務規則確定。例如，銀行可能有一條規則說一個帳戶的餘額不能變為負數。一致性確保了即使在事務執行中發生錯誤或系統故障，數據庫也必須保持一致狀態。
3. 隔離性（Isolation）: 隔離性確保同時進行的事務彼此獨立，即一個事務的執行不應該影響其他事務。隔離性防止了多個事務並行執行時可能發生的問題，例如讀取未提交的數據（髒讀）或者讀取到其他事務已經修改但未提交的數據（不可重複讀）。
4. 持久性（Durability）: 持久性確保一旦事務被提交，其結果就會永久地保存在數據庫中，即使在此後發生故障（例如系統崩潰或電源中斷），事務的結果也不會丟失。通常，這是通過將事務日誌寫入磁盤來實現的。

這些特性確保了資料庫在處理交易時的可靠性和穩定性，並且可以防止數據損壞和丟失。

# Mongoose 中更複雜的數據操作
下面我將介紹一些你可能會遇到的高級查詢，例如聚合(aggregation)、連接(join)不同的 collection 等。
1. 可以使用聚合(aggregation)進行數據的加總（Sum）等：
你可以使用 Mongoose 的 aggregate 方法來進行數據的加總。例如，如果你想加總所有貓咪的年齡，你可以使用以下代碼：

```typescript=
async sumAge(): Promise<number> {
  const result = await this.catModel.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$age' },
      },
    },
  ]);
  return result.length > 0 ? result[0].total : 0;
}
```

2. 連接（Join）不同的 Collection：
Mongoose 的 populate 方法可以用來連接不同的 collection。例如，如果你有一個 Owner model 和 Cat model，你可以使用以下代碼將它們連接起來：

```typescript=
const owners = await this.ownerModel.find()
  .populate('cats')  // assuming 'cats' is a field in Owner model that refers to Cat model
  .exec();
```

## 補充內容
### ODM, OEM, OBM, ORM  在數據庫代表什麼
在數據庫中，ODM、OEM、OBM和ORM代表了不同的映射技術，用於處理應用程序中的對象（Object）和數據庫中的不同數據形式之間的映射。這些技術在數據庫和軟體開發中被使用，以便於以面向物件的方式操作數據庫，而無需直接處理數據庫的底層細節。

- ODM (Object-Document Mapping)：物件-文件映射
    - 含義：ODM是一種用於將應用程序中的物件（Object）映射到文檔型數據庫中的文檔（Document）的技術。常見的文檔型數據庫包括MongoDB。ODM工具允許開發人員使用面向物件的方式處理數據庫操作，並且提供了對數據庫文檔的抽象。
- ODM 效能損失：
    - 它提供了一個高級的抽象層來處理數據庫操作。由於提供了更多功能和抽象層，當處理大量數據或需要高效率的查詢時，ODM 可能比原生 MongoDB 驅動程序慢，因為它需要處理額外的抽象和轉換。 
### OEM (Object-Entity Mapping)：物件-實體映射
- OEM 含義：
    - OEM是一種用於將應用程序中的物件（Object）映射到關聯型數據庫中的實體（Entity）的技術。常見的關聯型數據庫包括MySQL、PostgreSQL等。OEM工具允許開發人員使用面向物件的方式處理數據庫操作，並將物件映射到數據庫中的表格。
- OEM 效能損失：
    - 當處理大量複雜的表關聯時，OEM 可能會導致效能降低，因為它需要處理物件和關聯型數據庫之間的轉換。
### ORM (Object-Relational Mapping)：物件-關聯型映射
- ORM 含義：
    - ORM 是用於關聯型數據庫的映射技術，類似於 OEM，ORM是一種用於將應用程序中的物件（Object）映射到關聯型數據庫中的表格（Relation）的技術。常見的關聯型數據庫包括MySQL、PostgreSQL等。ORM工具允許開發人員使用面向物件的方式處理數據庫操作，並將物件映射到數據庫中的表格。
- ORM 效能損失：
    - 然而，ORM 可能在處理複雜查詢或高度優化的情況下效能下降，因為它需要將物件和關聯型數據庫之間進行轉換。
### OBM (Object-Bucket Mapping)：物件-存儲桶映射
- OBM 含義：
    - OBM是一種用於將應用程序中的物件（Object）映射到分佈式文件系統或對象存儲服務的存儲桶（Bucket）的技術。這種映射在一些雲端存儲場景中比較常見，用於將應用程序數據映射到雲端存儲服務（如Amazon S3、Google Cloud Storage等）。
- OBM 效能損失：
    - 當處理大型文件或需要高度併發時，OBM 可能導致效能損失，這取決於雲端存儲服務的性能和設計。
總的來說，映射技術通常會增加一定的效能損失，特別是在處理大量數據或需要高效率的情況下。在選擇使用哪種映射技術時，需要根據應用程序的需求和預期的性能來權衡利弊。在性能要求較高的情況下，可以考慮使用原生的數據庫驅動程序或針對特定情況進行優化。
