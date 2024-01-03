# 由淺入深，從Solidity 智能合約到系統開發
*基於Isuncloud 開發的會計審智能合約的資料串流及功能*

*不只是學會多一門的程式語言，更是智能合約系統的開發*

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/59311328/e1b855c4-749a-41bc-8e68-63221ce8df2e)


## 前言
在當今快速變化的數位世界中，區塊鏈技術已成為推動透明性、安全性和去中心化的關鍵力量。其中，智能合約在這場革命中扮演著核心角色，它們不僅重塑了我們對於交易和數據交互的理解，還為各行各業帶來了無限的可能性。在這種背景下，我們將深入探討一個獨特的智能合約系統——動態交易處理合約，旨在有效管理和記錄多樣化的交易。

在本文中，我們將深入探索這個動態交易處理合約的核心構成要素，分析其運作原理。以主題式的方式，盡量由淺入深，一步一步帶領您一同領略區塊鏈的魅力。

## 閱讀目標
在文章中，我將從基礎的solidity語法，慢慢進一步帶入系統開發的概念包括：

1. solidity的基礎語法
2. 優化智能合約的方式
3. 建立可靠性、可伸縮性和可維護性的方式
4. isuncloud的會計系統
5. 用後端與區塊鏈溝通、互動
6. 將物件轉為數位資產的方式
7. 資料串流

一方面記錄我的學習歷程，一方面分享足跡，期盼為以太坊社區做出一點點的貢獻。

## 內容
- 介紹
- 基礎
- 記錄交易的智能合約
- 模組化的功能
- 設定時間區間及報表產出
- 儲存、計算報表欄位
- 介面、繼承、覆寫、抽象
- 路由器
- 與區塊鏈互動、監聽
- 資料庫與API
- 報表與代幣
- 結論、參考與源代碼

## 介紹

本文將使用現成的智能合約系統(isuncloud auditing system)做解釋，介紹其概念、並從中提取智能合約的重點概念，包含資料密集型的包含資料密集型的系統設計概念、註冊模式、工廠模式、模組化、重入攻擊防禦(reentrancy defense)等等。目標是使讀書不僅僅是認識solidity 這種語言，更能夠透過本文有智能合約系統開發的整體概念。

#### 智能合約
在開始之前，我們先回顧傳統合約需要具備哪些基本條件：

甲、乙方資訊
合約條款：記載著大家必須遵守的商業邏輯
合約效期
不可變動性：約合簽訂後，雙方各執一份，若未來有任何修改需求，要重新定義一份新的合約，並將舊的合約作廢。
除了上面列的最基本條件外，可能還會有其他附註條件，例如付款辦法、驗收條件等資訊。

好，如果要把整個合約流程自動化，我們需要做哪些事？
我們需要一個平台，甲乙雙方都需要有帳號，帳號要具有可辨識性，並確保帳號的安全性，不容易被盜用，這樣大家才會認可這個合約的有效性。
我們需要寫一些程式邏輯，來處理合約內容的商業邏輯。
程式邏輯就如同，合約內容簽訂後，沒有人可以在任意再修改。
有一些公司會用支票支付，所以我們也必須要有類似銀行的服務，確保支票可以兌現。

基本上，這就是智能合約的基礎框架（撇除了ABI, EVM, 數位簽章演算法, 密碼學等知識）。
所以，智能合約的特點整理起來就是：
```
1. 自動化執行：智能合約能夠在沒有中介的情況下自動執行特定的操作，如計算、存儲和數據處理。
2. 數據不變性與安全性：一旦智能合約被部署到區塊鏈上，其程式碼就無法被更改，這保證了過程的透明性和數據的不可篡改性。這對會計系統來說是一個關鍵特點，因為它確保了記錄的準確性和可靠性。
3. 權限控制與報表訪問: 智能合約可以用於管理對財務報表的訪問權限，確保只有授權用戶能夠查看或修改這些報表。
4. 寫入資料需要成本：基於一些停機問題以及商業概念，部署、操作智能合約可能需要花費虛擬貨幣。
5. 不需要有固定主機：當我們需要發布程式時，普遍認知我們會將程式執行在一台永不關機的主機。但智能合約運作原理是透過以太坊網路上眾多的節點，幫我們執行程式，而不是只靠一台主機。
```
#### isuncloud會計系統

會計系統的核心是允許使用者能夠輸入資料，系統將這些資料去做計算，得到一張報表。如此而已？顯然，我們需要更嚴謹的方式去思考這樣的簡單設計存在哪些問題？

```
1. 系統如何辨別輸入的資料屬於哪些交易類型，需做什麼計算？

2. 基於第一點，區塊鏈上的智能合約，除非有程序員有將自毀系統寫入智能合約功能裡，否則，智能合約是無法竄改的。如果我們使用if else的傳統寫法告訴智能合約如果今天data type 等於 1，就是出金、 等於 2就是入金，那倘若有天我們需要實現一個新的轉帳功能，那我們就必須重寫智能合約、重新部署並且先前的資料都會被遺棄。

3. 一張報表會有時間的區間，例如科技公司的季報、年報、或甚至是從創業初始到現今的報表，我們需要有一個機制去設定這個時間區間內的財務狀況。

4. 我需要去控管能夠讀取報表的使用者
```
**因此，isuncloud會計系統的資料流如下（以下為簡化版本，在下面的章節會有更仔細的介紹）：**

```
1. 首先我們需要讓系統知道我們需要哪些交易類型，假設為「入金」，我們需要將「入金」這個功能介紹給這個系統去避免使用if else。我們姑且稱它為 "Deposit"（包含存取資料、尋找時間區間內的"Deposit"、此交易欄位的計算）。

2. 所以我們需要撰寫一個"Deposit"智能合約，然後將此合約註冊到系統上面（系統上需要先行寫好註冊功能）。

3. 接著，我們與使用者約定，輸入的資料（陣列）第一個元素為這筆交易的ID，第二個為交易的類型(“Deposit”)，其餘元素則為入金金額、手續費等等。

4. 系統判定交易類型(太好了，第二個元素為"Deposit")，完成後可以將這些數據存到剛剛部署的Deposit智能合約裡面。
```
**好了，目前為止我們的交易已經完成資料儲存了。接著，我們要進行產出報表的流程。**

```
1. 我們需要有一個機制去設定我要產出報表時的匯率（產出報表時的當前匯率與輸入資料時的交易匯率時間不同），並設定在產出報表的當下這張報表的ID（可以理解為主鍵）。

2. 系統向"Deposit"請求在"Deposit"內的所有交易，並且過濾後，將時間區間內的eventID回傳給"Deposit"，Deposit本身就擁有某個eventID下的所有資料，會去做計算，並生成一張報表（這張報表也有一個reportId方便未來權限控制、以及查詢）。
```
**很好，現在我們生產出報表了。isuncloud的系統允許我們使用幾種方式閱讀這張報表。**

```
1. 直接手動呼叫智能合約功能：若我們成功將系統部署，我們只需要這個智能合約的地址，並且在remix上，就可以直接輸入這個地址、操作讀取功能進行數據讀取。

2. isuncloud提供的後端腳本：isuncloud系統允許使用者操作他們寫好的腳本，與區塊鏈區溝通將數據抓取回本地端的資料庫。

3. 呼叫伺服器：你可以透過請求伺服器url，將已經存在本地端的資料庫的報表API，呼叫到前端頁面上。
```
到目前為止，我們先忽略了資料型態（這對gas fee的控制有關鍵影響）、權限控制、報表NFT(ERC-8017)的產生、重入攻擊的防禦等等領域。現在我們只需要知道一些基礎概念。

## 基礎

好，我們開始吧，在本章會從基礎開始，你可以在這個連結找到本章節開源碼：[Transaction Contract](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/transaction_contract.sol)

### 許可證類型

SPDX（Software Package Data Exchange）是一個用於協助表達軟件包許可證信息的標準格式。SPDX許可證標識符是一種簡短的方式，用於清晰地在源代碼文件中指定軟件許可證。

MIT許可證是一種寬鬆的許可證，允許使用者幾乎無限制地使用、複製、修改、合併、發佈、分發、再授權以及/或出售該軟件的副本。唯一的限制是在所有副本的著作權聲明和許可證聲明中必須包含版權聲明和許可聲明。

```
// SPDX-License-Identifier: MIT
```

### 設定編譯器

```
pragma solidity ^0.8.0;
```
pragma: 這是一個通用的編程術語，用於提供編譯器以特定的指令。

^0.8.0: 這個部分指定了編譯器的版本。在這裡，^符號表示“相容於”。所以，這行代碼意味著該合約應該被編譯使用的Solidity版本至少是0.8.0，但小於下一個主要版本0.9.0。這樣做是為了確保合約可以利用0.8.x版本的新特性和修正，同時避免由於使用更高主要版本號可能引入的不相容變化。

### 事件
在以太坊中，事件用於合約內部的狀態變更通知。這些事件會被區塊鏈的日誌記錄(logs)下來，且可以被外部監聽器（例如Web3.js, ethers.js）監聽和處理。簡單來說，就是一種自定義的報錯語法。
你可以先用以下語法定義一個事件：

```solidity
event transactionAdded(bytes32 transactionType);
```

在線程執行到預想的位置時，將事件寫入日誌。

```solidity
function addRecord(bytes32[] memory data) public noReentrancy{
        ...
        emit transactionAdded(transactionType);
        ...
    }
```

### 映射
映射是一種將鍵（keys）關聯到值（values）的數據結構。在這個合約中，它用於存儲每筆交易的參數。他很大一部分取代了傳統的陣列，他可以直接獲取到keys關聯的value不在需要向陣列那樣尋找，類似於python裡的dictionary。他在solidity中很常見，但是要注意solidity不支援將struct（結構）當作參數（無論是keys或是values）。你可以先用以下語法定義一個映射（我先用string代替bytes32比較好理解）：

```solidity
 mapping(string => bool) private recordedEvents;
```

```solidity
function addRecord(string[] memory data) public noReentrancy{
        ...
        recordedEvents[eventId] = true;
    }
```

如果某個交易被添加了，系統就將這個交易設定為true，以免未來有重複的eventId再度被添加。

### 結構體
結構體允許開發者創建包含多個不同數據類型的自定義數據類型。在這個合約中，Transaction結構體用於表示一個交易。有時，結構體會被定義在interface之下，這個我們之後再談。你可以先用以下語法定義一個結構體：

 ```solidity
  struct Transaction {
        bytes32 eventId;
        bytes32 transactionType;
        address recorder;
        mapping(bytes32 => int256) params;
    }
 ```

 ### 可見性修飾符 Visibility Modifier
 可見性修飾符是非常重要的概念，他用於指定合約中的函數和變量能夠被訪問的範圍。包括public、private、internal和external。

 1. public: 這是最開放的可見性級別。被標記為public的函數和變量可以在合約內部被訪問，也可以通過合約外部的交易或調用來訪問。對於變量，Solidity自動為公共變量創建一個getter函數，允許外部訪問這些變量的值。

 2. private: 這是最受限的可見性級別。被標記為private的函數和變量僅能在它們被定義的合約中訪問。即使是該合約的衍生合約也無法訪問私有函數和變量。

 3. internal: 這個修飾符類似於private，但它允許衍生合約訪問internal函數和變量。這在合約繼承時非常有用，因為它允許衍生合約訪問和重用基礎合約中的函數和變量。

 4. external: 這個修飾符專為外部調用設計。external函數只能從合約外部調用，不能從合約內部調用（除非是通過this關鍵字）。這通常用於減少某些類型的調用所需的gas費用，因為外部函數可以直接訪問calldata，這是一種與記憶體相比更加gas高效的數據存儲方式。

 你可以在定義函數時添加這些修飾：

 ```solidity
 function registerHanlder(params) external {
        ...
    }
 ```


### 接口/ 介面 interface

interface是一種特殊的合約類型，用於定義合約之間的交互方式。接口類似於傳統編程語言中的抽象類，它只定義函數的外部，而不包括實現細節。這些函數隨後在其他合約中實現。通過接口，Solidity允許創建松散耦合（未來會提到）的系統，這樣不同的合約可以互相交互而不需要知道彼此的內部細節。注意，interface是不能定義建構子的。

他通常長得類似像 [i_transaction_handler.sol](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/interfaces/i_transaction_handler.sol):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITransactionHandler {
    function processTransaction(bytes32[] memory data, address recorder) external;
    function getEventIdAndRate(bytes32 _eventId,bytes32 _reportID ,bytes32 _SP002, bytes32 _SP003, bytes32 _SP004) external;
}
```
所以當我們要導入這個接口時：
```solidity
import "../interfaces/i_transaction_handler.sol";
```

導入接口的智能合約。

```solidity
mapping(bytes32 => ITransactionHandler) private handlers;
```

將這個接口定義為某映射的值（意味著不同的鍵將對應不同實例化的接口）。

```solidity
function addRecord(bytes32[] memory data) public noReentrancy{
        ...
        ITransactionHandler handler = handlers[transactionType];
        ...
    }
```
將handlers[transactionType]的值傳給一個實例化的接口handler。

這樣一來我們只需要實現handler的功能即可。這邊的實現的方式是直接導入某個handler("Deposit")智能合約。例如:[Deposit](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/e00010001_handler.sol)，可以看到這個合約實現了processTransaction(),與getEventIdAndRate兩種功能，繼承了這個ITransactionHandler並使用override去覆寫這個接口。

### 條件檢查

當然，我們需要一些檢查機制，來確保智能合約從運行之始到結束都符合我們的預期。require語句將判斷參數條件是是否為真，若為真，則往下繼續運行線程。若為否則撤回（revert）整筆交易，但是消耗的gas fee將不會撤回，特別注意，引發revert是相對費用高昂的。
```solidity
require(data.length >= 3, "Data must have at least three elements");
```

### 自定義修飾符 modifier

我們可以將自己定義的修飾符加入到函式中，例如（以下例子沒有在[Transaction Contract](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/transaction_contract.sol)裡）：

```solidity
modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
```
其中msg.sender為呼叫這個含式的地址，owner為這個合約的擁有者（可以簡單理解為部署者，但是部署者可以另外設定誰也有擁有這個合約的權限）。
所以這句話的意思就是，若你不是合約擁有者就不能使用這個函式。注意，modifier還需要一個：
```
_;
```
這使智能合約知道這是一個modifier。

```solidity
function restrictedFunction() public onlyOwner {
        // 僅擁有者可執行的代碼
    }
```
在自定義的function中添加這個修飾，就可以實現這個權限控制的功能。

### 建構子 constructor

constructor 是一個特殊類型的函數，它在合約部署到以太坊區塊鏈時執行一次並且僅此一次。constructor 的主要用途是進行合約的初始化設置，比如設定初始變量值、執行啟動邏輯或進行某些必要的狀態配置。
一個合約可以包含最多一個 constructor。如果沒有明確定義 constructor，則默認合約沒有初始化過程。
在 constructor 中進行的操作通常包括設置合約擁有者、初始化合約的狀態變量、進行一些基本的配置檢查等。
另外，constructor 是唯一一個不需要可見性修飾符（如 public 或 private）的函數，因為它們本質上是公開的。它們在合約部署過程中自動執行。
constructor 只在合約部署時被執行一次。一旦合約被部署到區塊鏈上，constructor 就不能再被調用或訪問。

```solidity
  constructor(address _parser) {
        Iparser = IParser(_parser);
    }
```
在以上例子中，我們透過建構子來實例化Iparer，這種方式通常用來建立智能合約與智能合約的依賴。
我們將已經部署在區塊鏈上的parser 智能合約地址，並建立起依賴，可以簡單理解為，我要使用這個地址的合約的功能，因此我要提供地址來使用。

### bytes32

如果你仔細檢閱這個智能合約會看見使用許多bytes32的資料型態。原因是bytes32 是一種常用的數據類型，用於存儲固定長度的字節序列。這個數據類型在多種場合下非常有用，尤其是當你需要高效地存儲和傳遞簡短的數據時，例如狀態碼、標識符、密鑰哈希等。使用 bytes32 相較於使用動態大小的 bytes/string 類型，可以更節省 Gas，因為它占用的存儲空間是固定的。


## 記錄交易的智能合約

### 防止重入攻擊
### 可靠性、可伸縮性和可維護性
### 註冊模式
### 工廠模式

## 模組化功能
### Parser
### Report

## 設定時間區間及報表產出

### 設定當下匯率與報表主鍵（與交易主鍵不同）
### 設定時間區間，進行交易主鍵查詢

## 介面、繼承、覆寫、抽象
### 介面
### 繼承
### 覆寫
### 抽象

## 與區塊鏈互動、監聽 
### 測試鏈
### hardhat
### ethers
### ABI

## 資料庫與API
### prisma
### next.js

## 報表與代幣
### 將報表與nft關聯
### 製作一個新的代幣標準
### 權限控制

## 結論
