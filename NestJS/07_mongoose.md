# ODM, OEM, OBM, ORM  在數據庫代表什麼
在數據庫中，ODM、OEM、OBM和ORM代表了不同的映射技術，用於處理應用程序中的對象（Object）和數據庫中的不同數據形式之間的映射。這些技術在數據庫和軟體開發中被使用，以便於以面向物件的方式操作數據庫，而無需直接處理數據庫的底層細節。

### ODM (Object-Document Mapping)：物件-文件映射
- ODM 含義：
    - ODM是一種用於將應用程序中的物件（Object）映射到文檔型數據庫中的文檔（Document）的技術。常見的文檔型數據庫包括MongoDB。ODM工具允許開發人員使用面向物件的方式處理數據庫操作，並且提供了對數據庫文檔的抽象。
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

# 在 NestJS 專案中 Mongoose vs MongoDB 效能差異
在 NestJS 專案中，你可以使用 Mongoose 或者原生 MongoDB 來與 MongoDB 數據庫進行交互。這兩種方法在效能上有一些差異，這取決於你的應用程序的需求和資料庫操作的複雜性。下面我們來分析一下：

### Mongoose 是 MongoDB 的一個 ODM（物件數據映射）
它提供了一個更高級的抽象層來操作數據庫。使用Mongoose，你可以定義模式（Schemas）和模型（Models），並且它允許你在JavaScript中使用類似於OOP的方式來處理數據庫操作。這使得Mongoose在開發速度和易用性方面非常優越。

### MongoDB 是直接使用 MongoDB 提供的官方Node.js驅動程序（例如mongodb-native-driver）來操作數據庫
需要直接使用 MongoDB 提供的低階 API 進行數據操作，這樣的寫法通常比較接近底層，更靠近 MongoDB 的運行方式。原生 MongoDB 驅動的效能較高，因為它消除了 Mongoose 提供的額外抽象層。當你需要對數據庫進行高度自定義的操作時，這將給你更多控制權，使用原生驅動會更有優勢。

## Mongoose vs MongoDB 效能差異
Mongoose 和原生 MongoDB 驅動程式的效能差異可能會在不同的使用情境中有所變化。然而，通常而言，以下幾個因素可能會影響到你在使用 NestJS 專案時兩者之間的效能：
1. **數據模型化（Data Modeling）**：Mongoose 提供了強大的數據模型化工具，允許你定義數據的結構、驗證、預設值等等。這些工具可以使你的代碼更乾淨、更易於維護，但這可能會導致一些額外的效能開銷。

2. **數據驗證（Data Validation）**：Mongoose 提供了內建的數據驗證機制，這意味著在數據到達 MongoDB 之前就會進行驗證。這可以避免在數據庫層級保存無效的數據，但這種驗證過程可能會增加一些額外的處理時間。

3. **中間件（Middleware）**：Mongoose 支持在執行操作前後使用中間件，這允許你很方便地實現例如日誌記錄、數據修改等功能。然而，如同所有中間件一樣，如果沒有妥善地使用，它們可能會成為效能瓶頸。

4. **更多抽象化（Higher Level of Abstraction）**：Mongoose 提供了一個更高層次的抽象化，使得開發者能更方便地進行數據操作。然而，這樣的便利性可能會以某些程度的效能為代價。

MongoDB 原生驅動提供了對 MongoDB 數據庫的直接操作。它比較底層，因此在處理特殊的查詢或需要完全控制的情況下可能會更加有用。在極度關注效能的情況下，使用原生驅動可能會稍微快一些，因為它少了 Mongoose 提供的數據模型和驗證等額外功能的開銷。Mongoose 是一個在 MongoDB 原生驅動之上的數據建模工具，提供了許多功能，如模型驗證、中間件、查詢構建等。這些功能使得使用 MongoDB 變得更加方便且安全。但是，這些額外的功能可能會對效能造成一些影響，特別是在處理大量請求或大型數據集的情況下。

## 結論
整體來說，原生 MongoDB 驅動程式在效能上可能會稍微優於 Mongoose，因為它提供了更直接、更少抽象的數據庫操作。然而，Mongoose 提供的數據模型化、驗證和中間件功能可以極大地提升開發效率和代碼的可維護性，這些優勢可能會抵銷它在效能上的微小劣勢。最終哪種方法更適合你，將取決於你的具體需求和優先考慮的因素。所以在我看看這兩者之間的主要差別不在於效能，而是在於它們提供的特性和便利性。
- 選擇使用 Mongoose 還是原生 MongoDB 需要考慮你的項目需求和優先事項。如果你更關心快速開發和模型驗證，而對於性能較為寬鬆，那麼 Mongoose 是個不錯的選擇。如果你需要追求極致的性能，並且願意犧牲一些開發便利性，那麼原生 MongoDB 驅動可能更適合你。最好根據項目的實際需求進行選擇。
- 最佳方法是根據你的專案需求和預期的使用情況來選擇適合的方法。你也可以根據不同的場景結合使用兩者，例如在開發階段使用Mongoose，而在性能要求較高的生產環境中使用原生MongoDB。


# 在 mongoose 中如何使用 transaction
在 MongoDB 4.0 以後的版本中，引入了事務（transaction）的概念，可以讓你在一個單一的 session 中執行多個操作，並且這些操作可以一起被提交或者被回滾。在 NestJS 與 Mongoose 中，你可以使用以下方式來實現這種需求：

### 1.將 MongoDB 從單機模式（standalone）轉換為副本集（replica set）
將 MongoDB 從單機模式（standalone）轉換為副本集（replica set）可以實現數據的高可用性和數據安全性。當主節點出現問題時，副本集可以自動選舉出一個新的主節點來提供服務，進而保證數據庫的可用性。另外，副本集模式還支持在多個節點上保存數據的副本，從而提高數據的安全性。

將單機模式的 MongoDB 轉換為副本集需要以下步驟([ref:](https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/))：
1. DB 備份
```
mongodump -d tidebit-defi -o /home/tidebit/tidebit-defi.backup
```
2. 關閉 database
  2.1. 使用 `mongosh` 連線進入 `mongod` 實體
  2.2. 使用 admin `use admin`
  2.3. 使用下列語句關閉 database
```
   db.adminCommand(
     {
        shutdown: 1,
        comment: "Convert to cluster"
     }
   )
```
3. 修改 MongoDB 配置文件
MongoDB 的配置文件通常為 mongod.conf 或 mongodb.conf。在該配置文件中，需要添加或修改以下行來指定副本集名稱：
```
replication:
  replSetName: "rs0"
```
"rs0" 是副本集的名稱，你可以根據需要來修改。
**注意，這需要在你打算加入副本集的每一台機器上都進行。**
4. 重新啟動 MongoDB
我們是是使用 screen 啟動 mongoDB
```
sudo screen mongod --config /etc/mongod.conf --replSet
```
5. 初始化副本集
在任何一台你打算加入副本集的機器上，使用 `mongosh` 連線進入 `mongod` 實體，然後執行以下命令來初始化副本集
```
rs.initiate()
```
6. 添加節點到副本集
使用以下命令來將其他機器添加到副本集：
```
rs.add("mongodb://otherhost:27017")
```
"otherhost" 應該替換為你打算添加的機器的主機名或 IP 地址。如果 MongoDB 服務不是運行在標準端口（27017）上，也需要修改端口號。
7. 確認副本集狀態
使用以下命令來檢查副本集的狀態：
```
rs.status()
```
這將顯示副本集的狀態，包括所有節點的狀態和選舉狀態等。
8. 如果更新失敗要將 DB 復原
```
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
  // 如果有任何操作失敗，則回滾事務
  await session.abortTransaction();
  throw error;  // 傳播錯誤以供處理
} finally {
  // 無論成功或失敗，最後都需要結束 session
  session.endSession();
}
```
在上述代碼中，{ $inc: { balance: amount } } 用於將餘額增加特定的數量。如果該操作導致餘額變為負數，則該操作將拋出一個錯誤，事務將被回滾，並且之前在此事務中所做的所有操作都將被撤銷。

注意，MongoDB 的事務功能需要在同一個 replica set 中的多個伺服器之間進行協調，因此在使用該功能時可能會有一些效能的開銷。

### 4. 在 NestJS 修改 DB 連線資訊
要在 NestJS 中連接到 MongoDB 副本集，你需要在 MongooseModule 中提供適當的連接字串和選項。

在副本集的連接字串中，你需要列出副本集中的所有節點，並指定副本集的名稱。一個典型的 MongoDB 副本集連接字串如下：
```
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
```
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

1. 原子性（Atomicity）: 原子性意味著事務中的所有操作要麼全都執行，要麼全都不執行。例如，假設一個事務涉及將資金從帳戶 A 轉到帳戶 B，這兩個操作（從 A 扣款和將款項加到 B）必須一起完成。如果其中一個操作失敗，則整個事務都會回滾，就好像從未發生過一樣。
2. 一致性（Consistency）: 一致性確保事務將數據從一種一致的狀態轉換為另一種一致的狀態。一致性規則通常由業務規則確定。例如，銀行可能有一條規則說一個帳戶的餘額不能變為負數。一致性確保了即使在事務執行中發生錯誤或系統故障，數據庫也必須保持一致狀態。
3. 隔離性（Isolation）: 隔離性確保同時進行的事務彼此獨立，即一個事務的執行不應該影響其他事務。隔離性防止了多個事務並行執行時可能發生的問題，例如讀取未提交的數據（髒讀）或者讀取到其他事務已經修改但未提交的數據（不可重複讀）。
4. 持久性（Durability）: 持久性確保一旦事務被提交，其結果就會永久地保存在數據庫中，即使在此後發生故障（例如系統崩潰或電源中斷），事務的結果也不會丟失。通常，這是通過將事務日誌寫入磁盤來實現的。

這些特性確保了資料庫在處理交易時的可靠性和穩定性，並且可以防止數據損壞和丟失。

# Mongoose 中更複雜的數據操作
下面我將介紹一些你可能會遇到的高級查詢，例如聚合(aggregation)、連接(join)不同的 collection 等。
1. 可以使用聚合(aggregation)進行數據的加總（Sum）等：
你可以使用 Mongoose 的 aggregate 方法來進行數據的加總。例如，如果你想加總所有貓咪的年齡，你可以使用以下代碼：
```
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
```
const owners = await this.ownerModel.find()
  .populate('cats')  // assuming 'cats' is a field in Owner model that refers to Cat model
  .exec();
```
