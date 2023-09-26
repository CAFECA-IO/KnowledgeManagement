
# 競爭狀態 (Race Condition) 簡介：

競爭狀態發生於當多個執行緒或程序無預定順序地存取共享資料，而其結果依賴於這些執行緒的具體執行時序。這樣的情境可能導致不一致或不可預期的系統行為。

### 外部因素 ：

- **高併發的系統或應用**：在一些高要求的系統，例如網站伺服器或交易系統中，由於多個請求和操作的同時進行，競爭狀態的風險相對提高。

### 產生原因 ：

- **共享資源的同時訪問**：當多個執行緒或程序試圖同時讀取或寫入同一資源，而沒有適當的同步機制，它們的行為可能會相互干擾，導致不可預期的結果。
  
- **不足的同步控制**：沒有適當地使用鎖、信號量或其他同步工具會增加競爭狀態的發生機率。

## 用 nodeJS 模擬高併發的系統可能會出現的競爭狀態
有一家餅乾點，裡面有兩名店員，Ann 負責補貨：這意味著當店內餅乾數量減少時（例如賣出），Ann 就會增加餅乾的數量。在您的程式碼中，Ann 對 sharedCookiesCounter 增加 1 代表著這一點。 Betty 負責結帳：這意味著當有餅乾被賣出時，Betty 會減少餅乾的數量。在程式碼中，Betty 對 sharedCookiesCounter 減少 1 就是這樣的行為。店的策略是賣掉一個餅乾，才會補一個餅乾：這就是為什麼 Ann 和 Betty 的行為是互補的。每當 Betty（結帳）使餅乾數量減少 1 時，Ann 就會補上 1 個餅乾，使得總數理論上應該保持不變，始終維持一個餅乾。因為 Ann 和 Betty 可能會在相同的時間點試圖修改 sharedCookiesCounter，所以沒有恰當的同步機制的話（這裡表現了競爭狀態的核心），結果可能會不確定。例如，Betty 可能會誤認為還有餅乾可賣，但實際上 Ann 尚未補貨。

**worker.js**:

```javascript
const { parentPort, workerData } = require('worker_threads');

const sharedBuffer = workerData.sharedBuffer;
const sharedCookiesCounter = new Int32Array(sharedBuffer);

function modifyCounter(num) {
    sharedCookiesCounter[0] += num;
}

parentPort.on('message', () => {
    modifyCounter(workerData.num);
    parentPort.postMessage(true);
});
```

**main.js**:

```javascript
const { Worker } = require('worker_threads');

const sharedBuffer = new SharedArrayBuffer(4);  // 4 bytes for an Int32
const sharedCookiesCounter = new Int32Array(sharedBuffer);
sharedCookiesCounter[0] = 1;

const ann = new Worker('./worker.js', { workerData: { num: 1, sharedBuffer } });
const betty = new Worker('./worker.js', { workerData: { num: -1, sharedBuffer } });

setInterval(() => {
    ann.postMessage('modify');
    betty.postMessage('modify');

    console.log(`John's total: ${sharedCookiesCounter[0]}`);
}, 10);
```

主程式碼會每10毫秒發送訊息到 `ann` 和 `betty` 這兩個 workers，要求它們修改 `sharedCookiesCounter`。由於我們連續地發送這些訊息而不等待它們完成，所以應該會觸發 race condition，使 `sharedCookiesCounter[0]` 的值有機會偏離1。這個範例同時犯了下列錯誤：共享資源的同時訪問、不足的同步控制。

## 如何避免競爭狀態：
- **鎖定 (Locking)**：通常使用 Mutex（互斥鎖）或 Read-Write Lock（讀寫鎖）來實現，它確保在某一時刻，只有單一執行緒可以存取共享資源。
    - **樂觀鎖 (Optimistic Locking)**
    樂觀鎖主要基於這樣的假設：資源大部分時間不會有衝突，因此不用事先鎖定。當要提交更改時，會檢查在獲取資源和試圖提交修改之間是否有其他變更。如果有，則重試或放棄。

    假設我們有一個數據庫項目帶有版本號：
    ```javascript
    let record = { value: 'data', version: 1 };

    function updateData(newValue) {
        let originalVersion = record.version;
        // Do some operation
        if (originalVersion == record.version) {
            record.value = newValue;
            record.version++;
        } else {
            console.log("Data has changed since we last read it, retry or handle conflict");
        }
    }
    ```
    - **讀寫鎖 (Read-Write Lock)**

    讀寫鎖允許多個讀取者同時訪問資源，但在寫入者訪問時，其他所有讀取者和寫入者都必須等待。

    這是一個非常簡化的範例，實際的實現通常會更複雜：
    ```javascript
    let data = 'shared data';
    let readCount = 0;
    let writeLock = false;

    function read() {
        while(writeLock) { /* wait */ }
        readCount++;
        console.log(data);
        readCount--;
    }

    function write(newData) {
        while(writeLock || readCount > 0) { /* wait */ }
        writeLock = true;
        data = newData;
        writeLock = false;
    }
    ```
    - **互斥鎖 (Mutex Lock)**

    互斥鎖確保同一時刻只有一個執行緒可以執行某段程式碼。以下是一個簡單的互斥鎖示範：

    ```javascript
    let mutexLock = false;
    let data = 'shared data';

    function criticalSection(newData) {
        while(mutexLock) { /* wait */ }
        mutexLock = true;
        // Critical section
        data = newData;
        console.log(data);
        mutexLock = false;
    }
    ```
在真實世界的應用中，直接使用基本的語言結構來實現這些鎖定策略可能不是最佳選擇，因為可能會導致效率問題或其他潛在問題。可以考慮使用專為這些目的而設計的第三方函式庫，它們通常提供了更加優化和安全的鎖定策略。 **Mutex Libraries**: 有些第三方庫提供了互斥鎖功能。例如，[async-mutex](https://www.npmjs.com/package/async-mutex) 是一個在 Node.js 中提供這功能的庫。這允許你在多個異步操作之間同步進行，確保一次只有一個操作可以訪問共享資源。 **Database Locks**: 當競爭狀態涉及到資料庫存取時，許多資料庫系統提供鎖定機制，例如 SQL 的 `SELECT ... FOR UPDATE` 語法。**Atomics**: 在 Node.js 的 Worker 環境中，可以使用 `Atomics.wait` 和 `Atomics.wake` 或 `Atomics.notify` 來模擬鎖的行為。使用這些函數，我們可以將一個執行緒阻塞，直到某些條件被滿足。例如，當一個 worker 想要修改數據時，它可以先進行"加鎖"操作，如果鎖已被另一個 worker 持有，那麼這個 worker 將會被阻塞，直到鎖被釋放。

- **信號量 (Semaphore)**：它可以看作是一種“可計數”的鎖。當多個執行緒需要訪問一定數量的資源實例時，信號量是非常有用的。
  - 第三方庫，如 [semaphore](https://www.npmjs.com/package/semaphore) 可以在 Node.js 中提供信號量機制。這有助於當您需要多於一個但少於"無窮多"的執行緒或程序可以同時訪問資源時。

- **原子操作 (Atomic Operations)**：由硬體直接支援，確保特定操作（例如加法或交換）在沒有中斷的情境下連續完成。
  - `Atomics` 是 ECMAScript（JavaScript）語言中提供的一個對象，用於在 SharedArrayBuffer 上執行原子操作。
  - **C/C++**: 在 C++11 與後續版本中，有提供 `<atomic>` 標頭檔，內含原子型別如 `std::atomic<int>` 及相關操作。
  - **Java**: 在 Java 的 `java.util.concurrent.atomic` 套件中，提供了一系列的原子類別，如 `AtomicInteger`、`AtomicLong` 等。
  - **.NET (C#)**: .NET 平台提供了 `System.Threading.Interlocked` 類別，其中包含了一系列的原子操作方法。
  - **Go**: Go 語言中的 `sync/atomic` 套件提供了一些原子操作函數。
  - **Python**: Python 沒有內建的原子操作，但在某些特定的操作，例如增加或減少整數值，它是原子的。然而，當面對更複雜的操作時，Python 需要使用鎖來確保原子性。
  - **資料庫**: 許多關聯式資料庫，如 PostgreSQL、MySQL 等，提供了原子操作來確保資料一致性。這在處理交易（transactions）時尤其重要。
除了上述的平台和工具，還有許多其他的環境和語言提供了原子操作支援。原子操作在各種多執行緒或並行計算環境中都是非常重要的概念，用以保證資料的安全性和一致性。

- **序列化 (Serialization)**：經由確保操作按照特定順序執行，來避免任何可能的競爭。
  - **Message Queues (消息隊列)**：使用消息隊列，如 RabbitMQ 或 Amazon SQS，確實是一種流行的方法來避免競爭狀態。當多個請求試圖修改同一資料時，它們可以發送一個消息到隊列。有一個或多個消費者從隊列中取出消息並逐一處理它們，這樣確保了在同一時間只有一個消息被處理。這個方法的好處是它可以輕易地擴展到多個消費者和分佈式系統。
  - **Event Emitters (事件發射器)**：在 Node.js 中的 EventEmitter 也可以用來實現序列化，但它通常用於單一進程中。當事件被觸發，它們會按照觸發的順序被處理。然而，如果你在多個Node.js進程或實例中運行應用程序，單純依賴 EventEmitter 可能不足以避免競爭狀態，因為每個進程有其自己的事件循環。
  - **Batch Processing (批量處理)**：將請求分組並在特定的時間間隔內一次性處理它們也是一種避免競爭狀態的方法。這可以用於減少資料庫的寫操作或其他需要同步的操作。

- **避免共享資源**：當可能時，考慮使用專屬於單一執行緒或程序的資料結構，如 thread-local 或 process-local 資料結構，以減少共享資源的需要，從而降低競爭狀態的機率。
  - Message Passing: 在 Node.js 的 Worker 環境中，不直接共享資源，而是透過消息傳遞來進行數據交換和同步。這樣可以減少需要同步的點和降低競爭狀態的機率。
  - Immutable Data Structures: 使用不可變的數據結構可以確保一旦數據被創建，它就不會被修改，這可以避免在多線程環境下的數據競爭。


### 這裡以上面的範例使用 `Atomics` 來避免競爭狀態：
我們可以使用`Atomics.load`: 可以用來讀取 `SharedArrayBuffer` 中的數值，`Atomics.store`: 可以用來設置 `SharedArrayBuffer` 中的數值， `Atomics.add`: 可以用來修改 `SharedArrayBuffer` 中的數值，確保這些操作是原子的。以上操作可以確保對 SharedArrayBuffer 的讀取和寫入是不可分割的，避免在多線程環境下的數據不一致問題。這保證了，當一個 worker 在修改數據時，其他的 worker 不會干擾這個操作。以下是更根據上述範例同時使用原子操作: `Atomics.add`、`Atomics.store` 及使用 `Atomics.wait` 和 `Atomics.wake` 或 `Atomics.notify` 來模擬鎖進行修改後的版本：

**worker.js**:
```javascript
const { parentPort, workerData } = require('worker_threads');

const sharedBuffer = workerData.sharedBuffer;
const sharedCookiesCounter = new Int32Array(sharedBuffer);
const LOCKED = 1;
const UNLOCKED = 0;
const lockStatus = new Int32Array(sharedBuffer, 4, 1); // Additional Int32 to serve as our lock

function modifyCounter(num) {
    // Attempt to acquire the lock
    while (Atomics.compareExchange(lockStatus, 0, UNLOCKED, LOCKED) !== UNLOCKED) {
        Atomics.wait(lockStatus, 0, LOCKED);
    }
    // Critical section begins
    sharedCookiesCounter[0] += num;
    // Critical section ends
    Atomics.store(lockStatus, 0, UNLOCKED);
    Atomics.notify(lockStatus, 0, 1); // Wake a single waiting worker, if any
}

parentPort.on('message', () => {
    modifyCounter(workerData.num);
    parentPort.postMessage(true);
});
```

**main.js**:
```javascript
const { Worker } = require('worker_threads');

const sharedBuffer = new SharedArrayBuffer(8);  // 4 bytes for the counter and 4 bytes for the lock
const sharedCookiesCounter = new Int32Array(sharedBuffer);
const lockStatus = new Int32Array(sharedBuffer, 4, 1);
sharedCookiesCounter[0] = 0;
lockStatus[0] = 0; // Initialize lock as UNLOCKED

const ann = new Worker('./worker.js', { workerData: { num: 1, sharedBuffer } });
const betty = new Worker('./worker.js', { workerData: { num: -1, sharedBuffer } });

setInterval(() => {
    ann.postMessage('modify');
    betty.postMessage('modify');
    
    console.log(`Cookies total: ${sharedCookiesCounter[0]}`);
}, 10);
```

在上述修改後的版本中，我增加了一個 `lockStatus` 來代表一個簡單的鎖，並使用 `Atomics.compareExchange` 來嘗試獲取鎖。如果鎖已經被持有，那麼 worker 會使用 `Atomics.wait` 進行阻塞，直到鎖被釋放。
`Atomics` 和 `SharedArrayBuffer` 是 JavaScript 的內建特性，提供了一套低階、多執行緒的共享記憶體操作方式。這些特性主要是為 Web Workers 在瀏覽器中而設計的，使得多個 Web Workers 可以共用和操作同一塊記憶體。但除了 Web Workers，只要是JavaScript的環境都可以使用它們，在 NestJS 中也是。

**下面是在 NestJS 中實作上述範例的示範**

```javascript
import { Controller, Get } from '@nestjs/common';

const sharedBuffer = new SharedArrayBuffer(8); // 4 bytes for the counter and 4 bytes for the lock
const sharedCounter = new Int32Array(sharedBuffer, 0, 1);
const lockStatus = new Int32Array(sharedBuffer, 4, 1);

const LOCKED = 1;
const UNLOCKED = 0;

sharedCounter[0] = 0;  // Initialize the counter
lockStatus[0] = UNLOCKED; // Initialize lock as UNLOCKED

@Controller('counter')
export class CounterController {

  @Get('increment')
  increment(): string {
    this.modifyCounter(1);
    return `Counter incremented. New value: ${sharedCounter[0]}`;
  }

  @Get('decrement')
  decrement(): string {
    this.modifyCounter(-1);
    return `Counter decremented. New value: ${sharedCounter[0]}`;
  }

  private modifyCounter(num: number) {
    while (Atomics.compareExchange(lockStatus, 0, UNLOCKED, LOCKED) !== UNLOCKED) {
      Atomics.wait(lockStatus, 0, LOCKED);
    }
    sharedCounter[0] += num;
    Atomics.store(lockStatus, 0, UNLOCKED);
    Atomics.notify(lockStatus, 0, 1);
  }
}
```

**虛擬貨幣交易所的問題解決方案:**
一筆訂單被取消兩次，這確實是一個典型的競態條件。以下是一些建議的解決方案：

1. **使用鎖定機制**: 確保同一時間只有一個操作可以取消訂單。例如，當一個操作正在取消訂單時，其他操作應該等待，直到第一個操作完成。
2. **使用資料庫的事務 (Transaction)**: 確保取消訂單的操作是原子的，如果在取消過程中出現問題，可以回滾事務。
3. **狀態檢查**: 在取消訂單之前，先檢查訂單的狀態。如果訂單已經被取消，則不再進行取消操作。
4. **限制操作頻率**: 對於同一用戶，可以設定一個時間間隔，例如1秒，確保在這段時間內不允許對同一訂單進行多次操作。

```javascript
// 資料庫模擬
const orders = {
    '123': { status: 'active' }
};

// 鎖定機制
let orderLock = false;

// 上次取消的時間記錄
const lastCancelled = {};

// 檢查訂單狀態
function orderIsActive(orderId) {
    return orders[orderId] && orders[orderId].status === 'active';
}

// 取消訂單
function doCancel(orderId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            orders[orderId].status = 'cancelled';
            resolve();
        }, 100); // 模擬資料庫延遲
    });
}

// 主要的取消訂單函數
async function cancelOrder(userId, orderId) {
    const currentTime = Date.now();

    // 限制操作頻率
    if (lastCancelled[userId] && (currentTime - lastCancelled[userId] < 1000)) {
        console.log("Please wait before cancelling again.");
        return;
    }

    // 使用鎖定機制
    if (orderLock) {
        console.log("Another operation is in progress. Please wait.");
        return;
    }

    orderLock = true;

    // 檢查訂單狀態
    if (orderIsActive(orderId)) {
        await doCancel(orderId);
        lastCancelled[userId] = currentTime;
        console.log("Order cancelled successfully.");
    } else {
        console.log("Order is already cancelled or not active.");
    }

    orderLock = false;
}

// 測試
cancelOrder('user1', '123');
setTimeout(() => {
    cancelOrder('user1', '123'); // 應該會顯示 "Please wait before cancelling again."
}, 500);
setTimeout(() => {
    cancelOrder('user1', '123'); // 應該會顯示 "Order is already cancelled or not active."
}, 1500);

```

## 結論
避免競爭狀態是多執行緒和分佈式系統設計中的一個核心議題。通過理解和適當地應用上述策略和工具，開發者可以在各種應用和系統中確保資料的一致性和安全性。隨著技術的不斷進步，可能還會出現更多的工具和策略來幫助我們避免這些問題，但基本的原則仍然不變：始終注意同步，確保在多個操作中只有一個可以訪問共享資源，並且盡量減少或避免共享資源的需求。
