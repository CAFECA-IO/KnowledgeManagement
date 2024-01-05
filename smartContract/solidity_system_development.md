# 由淺入深，從Solidity 智能合約到系統開發

作者：Chen, Pin-Yang(@YangIsCoding)

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

另外如果你想玩玩看：[這是整個系統](https://github.com/CAFECA-IO/auditing_system/tree/feature/auto_test)的源碼，你可以按照README.md的使用說明書，操作這個系統。

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

好，我們開始吧，在本章會從基礎開始，你可以在這個連結找到這個章節的開源碼：[Transaction Contract](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/transaction_contract.sol)，點開它，並且參照程式碼，一步一步閱讀吧！

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
這使智能合約知道這是一個modifier，並且開始執行被修飾的函示。

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

重入性被認為是智能合約中最災難性的攻擊技術之一​​（例如2016年以太坊上的DAO攻擊事件）。這種攻擊技術能夠完全破壞合約或竊取有價值的信息。當一個函數通過外部調用調用另一個合約時，可能會發生重入性攻擊。下面的清單1展示了一個代碼片段，該代碼片段可以被利用來執行重入性攻擊。這種利用允許攻擊者執行主函數的遞歸回調，形成一個意外的循環，多次重複。例如，當一個容易受攻擊的合約包含一個撤銷函數時，合約可能多次非法調用撤銷函數，以排空合約包含的任何可用餘額。單一函數重入性攻擊和跨函數重入性攻擊是兩種不同的類型，可以被攻擊者利用。這種利用允許攻擊者使用外部調用來執行期望的任務。

讓我們舉個例子，參考以下有漏洞的合約，它可以作為保險箱使用，讓使用者每週提取1乙太幣。

```solidity
contract EtherStore{
        uint256 public withdrawalLimit = 1ether;
        mapping(address => uint256) public lastWithdraTime;
        mapping(address => uint256) public balances;
    
        function depositFunds() public payable{
            balances[msg.sender] += msg.value;
        }
    
        function withdrawFunds(uint256 _weiToWithdraw) public {
            require(balances[msg.sender] >= _weiToWithdraw);
            //limit the withdrawal
            require(_weiToWithdraw <= withdrawalLimit);
            //下面這一行有漏洞，請試著思考哪裡不合理
            require(now >= lastWithdrawTime[msg.sender] + 1 weeks);
            balances[msg.sender] -= _weiToWithdraw;
            lastWithdrawTime[msg.sender] = now;
        }
    
    }
```

如果一個攻擊者創建了一個惡意合約如下

```solidity
import "EtherStore.sol";
    
    contract Attack{
        EtherStore public etherStore;
    
        constructor( address _etherStoreAddress) {
            etherStore = EtherStore(_etherStoreAddress);
        }
    
        function attackEtherStore() public payable{
        
            //attack to the nearest ether
            require(msg.value >= 1 ether);
            
            //send eth to the depositFunds() function
            etherStore.depositFunds.value(1 ether)();
    
            //遊戲開始！
            etherStore.withdrawFunds(1 ether);
        
        }
    
        function collectEther() public{
            msg.sender.transfer(this.balance);
        }
    
        //fallback function - 魔術發生的地方
        function() payable{
            if(etherStore.balance > 1 ether){
                etherStore.withdrawFunds(1 ether);
            }
        
        }
    
    }
```

讓我們一步一步來看：
```
1. 攻擊者首先部署EtherStore合約。然後，攻擊者部署Attack合約，並在構造函數中指定EtherStore合約的地址。這樣，Attack合約就可以與EtherStore合約進行交互。


2.攻擊者通過調用Attack合約的attackEtherStore()函數來啟動攻擊。這個函數首先要求攻擊者發送至少1個以太幣到Attack合約。attackEtherStore()函數接著調用EtherStore合約的depositFunds()方法，將這1個以太幣存入EtherStore合約。緊接著，attackEtherStore()函數調用EtherStore的withdrawFunds()方法，嘗試從EtherStore合約提取1個以太幣。


3. 當EtherStore合約處理提款請求時，它將1個以太幣發送回Attack合約。由於是以太幣的轉移，這自動觸發了Attack合約的回調函數（fallback函數）。


4. 回調函數中的重入攻擊：在Attack合約的回調函數中，如果檢測到EtherStore合約的餘額仍然大於1個以太幣，它會再次調用EtherStore合約的withdrawFunds()方法。重點是，在EtherStore合約更新用戶的餘額和最後提款時間之前，就發送了以太幣。這意味著Attack合約可以在同一個交易中多次提取資金。


5.每次Attack合約的回調函數被觸發時，它都會檢查EtherStore的餘額，並再次嘗試提款。這個循環會持續進行，直到EtherStore的餘額降至不足以繼續提款為止。


6. 一旦EtherStore的餘額不足以繼續提款，Attack合約的回調函數停止執行。攻擊者可以通過調用Attack合約的collectEther()函數，將從EtherStore合約中提取的所有資金轉移到自己的賬戶。
```

現在，我們針對這個攻擊合約有三種防範方法：

```
1. 使用solidity原生的transfer函數向外部合約發送以太幣，因為transfer函數會給外部調用附加額外的 2300 gas，所以不足以支持目標合約再次調用其他合約。

2. 使用 "檢查 - 生效 - 交互" 的模式確保所有對狀態的修改都在向其他合約發送以太幣之前執行。

3.  引入互斥鎖，新增一個狀態變量來在代碼執行中鎖定合約，避免重入調用。
```

好，回到我們的系統來舉例，我們利用互斥鎖來增強合約的防禦能力。

```solidity
 bool private locked;

 modifier noReentrancy() {
        require(!locked, "Reentrancy not allowed");
        locked = true;
        _;
        locked = false;
    }

function addRecord(bytes32[] memory data) public noReentrancy{
    ...
}
```

細節如下：

```
1. locked 狀態變量： 合約中有一個名為 locked 的私有布林變量。這個變量用於追蹤合約是否處於被鎖定狀態。

2. noReentrancy 修飾符： 這個修飾符首先檢查 locked 是否為 false（即合約目前不處於鎖定狀態）。如果已經鎖定，則拒絕執行並顯示錯誤信息 "Reentrancy not allowed"。如果未鎖定，則將 locked 設為 true，執行修飾符修飾的函數，然後再次將 locked 設為 false。

3. 使用修飾符： 在這個合約中，addRecord 函數使用了 noReentrancy 修飾符。這意味著，當 addRecord 被調用時，會首先檢查合約是否已經被鎖定。這預防了在 addRecord 執行過程中，由於外部呼叫或事件觸發而再次進入（重入）該函數。

4. 通過在函數執行期間鎖定合約，它防止了在呼叫外部合約並有可能再次呼叫原合約函數的情況下，合約的重入調用。這樣可以確保合約狀態的一致性，並防止可能的攻擊。
```
### 可靠性、可伸縮性和可維護性

在這個章節（一樣繼續參考[Transaction Contract](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/transaction_contract.sol)），我們將提到一些系統設計的概念，然後開始使用具體的程式碼做解釋。
#### 可靠性

討論軟體的可靠性時，特別是在面對錯誤和失效時。可靠的程式碼應該具備的特點包括正確執行預期功能，允許使用者錯誤或不尋常的使用方式，或是在負載和數據量下保持性能。此外，它應防止未授權的訪問和濫用。可靠性可被理解為**即使出現問題，系統仍能正常運行，或是即時阻止更嚴重的錯誤發生。** 最後，我們都知道，預防還是勝於治療啊。

好，在我們的智能合約中，使用以下方法來達成這個特性：
```solidity

1. NoReentrancy Modifier（防重入修飾符）：剛才提過，你已經會了！

2. 條件檢查: 使用許多"require"語法，例如，在addRecord中檢查數據長度和事件ID的唯一性，在registerHandler中確保處理程序未被註冊等等。這些檢查有助於防止無效或惡意的輸入導致的問題。

3. 事件日誌: 通過使用event（如transactionAdded），合約可以為關鍵操作提供透明度，並幫助在出現問題時進行調試和追蹤。

4. 數據封裝: 通過使用private和public關鍵字，合約明確了哪些狀態變量和函數是內部的，哪些是外部可訪問的。這種封裝有助於保護關鍵數據，減少外部干擾的風險。

5. 處理未找到的情況: 在findTransaction函數中，如果沒有找到匹配的交易，合約會使用revert來撤銷操作並產生一個錯誤。這種做法有助於避免錯誤數據的使用或處理。

6. 地址驗證(isContract):通過檢查地址是否是合約，這有助於避免某些類型的惡意行為，例如防止與非合約實體互動時的潛在風險。

7. 構造函數初始化: 合約在構造函數中初始化了關鍵狀態變量（如Iparser），這有助於確保合約從一開始就處於一致和預期的狀態。
```

#### 可伸縮性


可伸縮性是系統、網絡或程序在面對負載增加時能夠適當調整並維持或提升性能的特性。這涵蓋了從硬體資源的增加，如增強CPU或記憶體，到軟體架構設計的改進，以支援更多用戶或更大數據量。可伸縮性可以具體表現為垂直和水平兩種形式。垂直可伸縮性，又稱為Scaling Up，指的是通過增強單一節點（例如一台伺服器）的性能來實現擴展，如提升其處理器速度或記憶體容量。相對地，水平可伸縮性，或稱Scaling Out，涉及增加更多的節點，例如添加更多儲存結構，從而分散負載並提高整體系統性能。

我們如何實現的：

```solidity
struct Transaction {
        bytes32 eventId;
        bytes32 transactionType;
        address recorder;
        mapping(bytes32 => int256) params;
    }

Transaction[] public transactions;

function addProcessedTransaction(
        ...
    ) external {
        ...
        uint256 index = transactions.length;
        transactions.push();
        Transaction storage transaction = transactions[index];
        ...
    }
```

```
使用動態數據結構：使用動態數組（如transactions）來存儲交易數據，這種結構可以隨著交易數量的增加而擴展。
```

### 可維護性

眾所周知，軟體的大部分開銷並不在最初的開發階段，而是在持續的維護階段，包括修復漏洞、保持系統正常執行、調查失效、適配新的平臺、為新的場景進行修改、償還技術債和新增新的功能。

不幸的是，許多從事軟體系統行業的人不喜歡維護所謂的 遺留（legacy） 系統，—— 也許因為涉及修復其他人的錯誤、和過時的平臺打交道，或者系統被迫使用於一些份外工作。每一個遺留系統都以自己的方式讓人不爽，所以很難給出一個通用的建議來和它們打交道。

但是我們可以，也應該以這樣一種方式來設計軟體：在設計之初就儘量考慮儘可能減少維護期間的痛苦，從而避免自己的軟體系統變成遺留系統。

接下來我將解釋兩種方式來提高可維護性。

#### 註冊模式

想像一下，有一台電玩主機，你在購買時就必須要先將遊戲手把登入在主機內，使未來的日子可以使用這個遊戲手把進行遊玩。但是這個登入功能只能執行一次，意味著你買回家後就無法將新的遊戲手把登入進去進行雙人遊玩。所以如果你執意要進行雙人遊玩，唯一的做法就是在買一台電玩主機一次將兩個手把登入進去。

有感覺嗎？這個就是區塊鏈的特性，智能合約（主機）一但部署後，就無法修改了，如果之後這個智能合約想要串接其他的智能合約，我們就必須將整個系統重新部署一次。

這顯然不符合邏輯，邏輯錯就在這個主機沒有設計註冊模式，我們要設計一個讓智能合約擁有註冊其他合約的功能。這樣子如果我們想要擴展功能，只需要將這個新合約部署至區塊鏈上，得到一個合約地址，將這個地址註冊在原本的智能合約裡進行連動。

我們來看看程式碼：

```solidity
function registerHanlder(bytes32 transactionType, ITransactionHandler handler) external {
        require(handlers[transactionType] == ITransactionHandler(address(0)), "Handler already registered");
        handlers[transactionType] = handler;
    }

function addRecord(bytes32[] memory data) public noReentrancy{
        ...
        bytes32 transactionType = data[1];
        ITransactionHandler handler = handlers[transactionType];
        require(address(handler) != address(0), "Transaction type handler not registered");
        handler.processTransaction(data, msg.sender);
        emit transactionAdded(transactionType);
        ...
    }
```

```
1. registerHandler函數:實現：通過調用registerHandler函數，我們可以為一個特定的transactionType（交易類型）指定一個handler（處理程序）。合約內部使用一個映射(handlers)來存儲這些信息，映射的鍵是交易類型的bytes32標識符，值是對應的ITransactionHandler接口實例。

2. 有了上面的註冊，我們將handler合約與交易類型做起了關聯，當未來調用addrecord時，系統會讀取交易類型，例如：假設讀取到(Deposit)我們就可以將接下來的任務交給DepositHandler.sol(handler.processTransaction(data, msg.sender);這一行)這個智能合約，進行儲存資料或是計算入金的報表欄位。
```

#### 工廠模式

再想像一下，你有一間玩具工廠（這裡就是智能合約的「工廠合約」），而這間工廠可以製造很多相同的玩具車（這些玩具車就是「實例合約」）。這間玩具工廠有一個特殊的機器，每當你按下一個按鈕，它就會製造出一個全新的玩具車。在這個例子中，按鈕就像是工廠合約中的一個函數，你每按一次，就創建一個新的智能合約（玩具車）。每個玩具車都是一樣的，都有輪子、方向盤和座位。在智能合約中，這意味著每個創建的實例合約都有相同的基本特性和功能。並且只有工廠老闆或是其他授權的人可以對單獨的玩具車進行改裝。


```solidity
contract InstanceContract {
    uint public data;
    address public owner;

    event DataChanged(uint newData);

    constructor(uint _data) {
        owner = msg.sender;
        data = _data;
    }

    function setData(uint _data) public {
        require(msg.sender == owner, "Only owner can change data");
        data = _data;
        emit DataChanged(_data);
    }
}

contract FactoryContract {
    event ContractCreated(address contractAddress);

    function createInstanceContract(uint _data) public {
        InstanceContract newInstance = new InstanceContract(_data);
        emit ContractCreated(address(newInstance));
    }
}

```

在這個例子中，InstanceContract 合約包括數據管理邏輯和權限控制，確保只有合約的創建者可以修改數據。FactoryContract 除了創建實例合約之外，還會發出一個事件，這在區塊鏈上記錄了每次創建合約的地址，有助於追蹤和驗證系統中的活動。

## 設定時間區間及報表產出

本章代碼：[set time span contract](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/get_transaction_time_span.sol)

在isuncloud的會計系統中，我們可以將儲存在區塊鏈上的交易數據整合成報表，我們要先設定我們要的時間區間，接著設定我們的報表名稱（主鍵）。

### 設定當下匯率與報表主鍵（與交易主鍵不同）

```solidity
 function setRate(bytes32 _SP002, bytes32 _SP003, bytes32 _SP004, bytes32 _reportName)external {
        require(!usedReportIDs[_reportName], "Report ID already used");
        Settlement memory newRate = Settlement({
            SP001 : int256(block.timestamp),
            SP002: _SP002,
            SP003: _SP003,
            SP004: _SP004,
            reportName: _reportName
        });
        usedReportIDs[_reportName] = true;
        rateHistory.push(newRate);
    }
```

我們都知道，一個報表內的欄位可能包含數個交易的總和，每種交易又都有自己的一個主鍵，所以我們必須為報表也設計一個主鍵（假設為：the_first_report），那我們之後才可以利用這個主鍵查找the_first_report這張報表。（這邊查詢報表的功能涉及客戶端與開發端，利用nft的功能造成兩者權限不同，稍後的章節會提到）

那，為什麼要設定當下匯率的同時設定主鍵呢？

1. 我們輸入交易數據時會有一個匯率(t1)，（假設 1 以太幣 : 70000 台幣），但是當一週後(t2)匯率變動為(1 以太幣 : 80000 台幣)
那我們的報表到底要使用哪個匯率呢？

2. 顯然是設定當下匯率(t2)時產生報表，並且最好報表還能算出這段時間因為會率所賺到的、 賠到的匯差。

### 設定時間區間，進行交易主鍵查詢

```solidity

struct Settlement {
        int256 SP001;
        bytes32 SP002;
        bytes32 SP003;
        bytes32 SP004;
        bytes32 reportName;
    }

function filterTransactionsInRange(int256 startTime, int256 endTime, bytes32 _reportName)
        external
        returns (FilteredData memory)
    {
       ...

        uint256 resultCount = 0;
        for (uint256 i = 0; i < count; i++) {
            int256 transTime = transactionContract.getTransactionTime(i);
            if (transTime >= startTime && transTime <= endTime) {
                types[resultCount] = transactionContract.getTransactionType(i);
                eventIds[resultCount] = transactionContract.getTransactionEventId(i);
                transTimes[resultCount] = transTime;
                resultCount++;
            }
        }

        bytes32[] memory filteredTypes = new bytes32[](resultCount);
        bytes32[] memory filteredEventIds = new bytes32[](resultCount);
        int256[] memory filteredTransTimes = new int256[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            filteredTypes[i] = types[i];
            filteredEventIds[i] = eventIds[i];
            filteredTransTimes[i] = transTimes[i];
        }

        FilteredData memory data = FilteredData({
            types: filteredTypes,
            eventIds: filteredEventIds,
            transTimes: filteredTransTimes,
            reportCreater: reportCreater,
            reportName: _reportName
        });

        processFilteredTransactions(data);
        return data;
    }

    function processFilteredTransactions(FilteredData memory data) internal {
        Settlement memory latestRate = rateHistory[rateHistory.length - 1];

        for (uint256 i = 0; i < data.types.length; i++) {
            ITransactionHandler handler = transactionContract.getHandler(data.types[i]);
            require(address(handler) != address(0),"handler not exist");

            handler.getEventIdAndRate(data.eventIds[i], data.reportName ,latestRate.SP002, latestRate.SP003, latestRate.SP004);
            emit TransactionProcessed(data.reportName, data.types[i]);

        }
    }
```

可以看到：
```
handler.getEventIdAndRate(data.eventIds[i], data.reportName ,latestRate.SP002, latestRate.SP003, latestRate.SP004);
```
在這段程式碼中，我們只需要將eventId傳給處理器即可，原因是我們不需要將整筆資料（可能包含入金金額、手續費、當下匯率(t1)）等等資料傳給處理器，我們一但有了eventId隨時回頭查看eventId下的數據即可，這樣的設計可以避免太大筆的資料在智能合約之間傳來傳去加大gas fee成本。

另外我們還傳入了reportName（也就是報表主鍵），處理器計算過後的欄位，就可以儲存在這張報表下。以供日後查詢。
## 儲存、計算報表欄位（handler）

本章節代碼：[handler](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/e00010001_handler.sol)

isuncloud 的 handler 有兩個主要功能。
1. 儲存event與儲存設定的當下匯率
2. 計算報表

儲存event:
```solidity
 function processTransaction(bytes32[] memory data, address recorder) external override {

        require(data.length == 6, "Data length for E00010001 must be 6");

        bytes32[] memory paramKeys = new bytes32[](5);
        int256[] memory paramValues = new int256[](5);

        paramKeys[0] = Iparser.stringToBytes32("EP001");
        paramValues[0] = int256(uint256(data[2]));
        paramKeys[1] = Iparser.stringToBytes32("EP002");
        paramValues[1] = int256(uint256(data[3]));
        paramKeys[2] = Iparser.stringToBytes32("EP003");
        paramValues[2] = int256(uint256(data[4]));
        paramKeys[3] = Iparser.stringToBytes32("trans_time");
        paramValues[3] = int256(block.timestamp);
        paramKeys[4] = Iparser.stringToBytes32("EP005");
        paramValues[4] = int256(uint256(data[5]));


        transactionContract.addProcessedTransaction(data[0], data[1], recorder, paramKeys, paramValues);
    }
```

上面的功能將數據存取在陣列中。

 ```solidity
 int256 A001 = int256(((EP001 + EP003) * latestSP002) / 10**18);
 report.addValue(reportName, "balanceSheet", "assets.details.cryptocurrency.totalAmountFairValue", A001);
 ```
上面的report是指以下合約的實例化，我們將計算結果存在Reports智能合約下。
 ```solidity
 contract Reports {
    mapping(string => mapping(string => mapping(string => int256))) public data;

    function addValue(string memory reportName, string memory reportType, string memory reportColumn, int256 value) external {
        data[reportName][reportType][reportColumn] += value;
    }

    function getValue(string memory reportName, string memory reportType, string memory reportColumn) external view returns (int256) {
        int256 result;
        result = data[reportName][reportType][reportColumn];
        return result;
    }

}
 ```

## 介面、繼承、覆寫、抽象

這幾個概念經常被一起提到，並且對solidity大型專案開發有關鍵性的地位。我們將這些概念彙整一下。

### 介面
稍早提過這個概念，讓我們簡單複習一下。


介面是一種定義合約外部可見功能的方式，但不提供這些功能的實現。介面類似於合約，但不能包含任何狀態變數和實現函數的內容。它確保合約遵循某個特定的API。

### 繼承

繼承是一種從另一個合約獲得屬性和行為的方式。在Solidity中，一個合約可以繼承另一個合約的方法和變數，這是通過在合約定義中使用is關鍵字來實現的。
繼承允許代碼重用和多態性。子合約繼承父合約的所有非私有成員。 

注意若A合約要引用A介面，還必須覆寫A介面提供的所有功能、事件、報錯提示(error)等等進行介面實例化，否則，只要有一個功能沒有實現，這個合約就必須被定義成抽象，沒辦法直接部署。

### 覆寫

覆寫是指在子合約中改變從父合約繼承的函數的行為。在Solidity中，要覆寫(override)父合約的函數，子合約中的函數必須有相同的名稱、返回類型和參數。

### 抽象

一個抽象合約是一種不能直接部署的合約，因為它包含至少一個沒有實現的函數。在Solidity中，抽象合約是使用關鍵字abstract來定義的。
抽象合約通常用於作為其他合約的基礎，這些子合約必須實現所有未實現的函數才能部署。

## 路由器

本章源碼：[router](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/router.sol)

在isuncloud的設計中，使用者事實上不需要接觸那麼多的智能合約，只需要操作一個路由器，就可以完成註冊合約、寫入資料、設定匯率、設定時間區間、查看報表欄位等功能。這是基於“抽象化(abstraction)”這個設計原則而生的。

### 抽象化

抽象化是一種將複雜性隱藏於用戶視野之外，只向用戶展示最關鍵和最相關信息的方法。這種原則使得用戶能夠更容易地與系統互動，而不需要理解底層的複雜實現細節。在抽象化的過程中，系統的內部工作方式被封裝起來，用戶通過一個簡化的界面與系統交互。這使得軟體或系統更加用戶友好，降低了學習和使用的難度。

我們來看看怎麼實現的：
```solidity
import "./transaction_contract.sol";
import "./get_transaction_time_span.sol";
import "./reports.sol";
import "../interfaces/i_transaction_handler.sol";

//Info:(20231115-Yang){This contract provides a clean interface for users to manipulate}
contract RouterContract {

    TransactionContract private transactionContract;
    GetTransactionTimeSpan private timeSpanReport;
    Reports private reports;

    constructor(address _transactionContract, address _timeSpanReport, address _reports) {
        transactionContract = TransactionContract(_transactionContract);
        timeSpanReport = GetTransactionTimeSpan(_timeSpanReport);
        reports = Reports(_reports);
    }
    //Info:(20231115-Yang){User should first input transaction type and handler addresses in order to register handlers}
    function registerHandler(bytes32 transactionType, address handlerAddress) external {
        ITransactionHandler handler = ITransactionHandler(handlerAddress);
        transactionContract.registerHanlder(transactionType, handler);
    }
    //Info:(20231115-Yang){After registering handlers, users can use this funtion to record event data}
    function addTransactionRecord(bytes32[] memory data) external {
        transactionContract.addRecord(data);
    }
    //Info:(20231115-Yang){If users never set rates, they should first set rates before providing time span}
    function setRate(bytes32 _SP002, bytes32 _SP003, bytes32 _SP004, bytes32 _reportName) external {
        timeSpanReport.setRate(_SP002, _SP003, _SP004, _reportName);
    }
    //Info:(20231115-Yang){Users can set a time span and reportName to get events within the time span}
    function generateReport(int256 startTime, int256 endTime, bytes32 reportName) external {
        timeSpanReport.filterTransactionsInRange(startTime, endTime, reportName);
    }
    //Info:(20231115-Yang){Users can read the latest transaction time}
    function getLatestTransactionTime() external view returns (int256) {
        return transactionContract.getLatestTransactionTime();
    }
    //Info:(20231201-Yang){User can read reports columns}
    function getValue(string memory reportName, string memory reportType, string memory reportColumn)external view returns(int256){
        return reports.getValue(reportName, reportType, reportColumn);
    }
```

利用建構子去實例化互動的合約，在接下來的功能導入外部合約的功能，就完成啦！

## 與區塊鏈互動、監聽

好的，現在智能合約的部分告一段落，不過，有什麼方法我們可以更輕鬆地與智能合約互動、甚至寫出一段自動化以上流程的程式。就可能就需要撰寫本地端的腳本了。而node.js是與以太坊溝通的常見腳本。我們將以node.js來實現，與智能合約溝通的過程，甚至擴展功能。

### 測試鏈

本節代碼：[config](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/hardhat.config.ts)

我們要了解，在以太坊上的操作，很大一部分都需要花費以太幣作為gas fee，因此將智能合約預先部署在測試鏈上，利用測試鏈上的測試幣先測試我的智能合約是否完成預期的功能是一個重要的智能合約開發流程。

我們可以在config檔案中設定我們想用的測試鏈，例如，sepolia測試鏈、goerli測試鏈等等，在這個系統中是使用isuncloud自主開發的區塊鏈，isuncloud。

```typescript
const config: HardhatUserConfig = {
  defaultNetwork: 'iSunCoin',
  networks: {
    iSunCoin: {
      url: `https://isuncoin.baifa.io`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
```
設定想用的區塊鏈時，可以按上上面的範例進行設定，其中包含：

```
1. url: 'https://isuncoin.baifa.io' 指定了 iSunCoin 網路的節點URL。這是連接到特定區塊鏈網路的入口。通常，你可以向infura這個網站請求一個節點URL。例如: http://infura/[後面是infura提供給你的節點]。

2. accounts: [process.env.PRIVATE_KEY] 指定了用於進行交易的賬戶私鑰，你可以使用EOA（也就是錢包）中提供的斯要進行設定，以便讓區塊鏈知道是哪個帳戶正在與區塊鏈進行交互。注意，要將private key保管好！你可以將private key設定在.env檔案中，並且如果你想要將程式碼公之於眾時，記得忽略上傳你的.env檔案。
```

### hardhat

市面上，很多的IDE，REMIX, TRUFFLE, GANACHE等等都提供了我們與區塊鏈互動的套件。舉例來說，Hardhat是一個專為以太坊開發者設計的開發環境和框架，用於促進智能合約的開發、部署、測試和調試。它提供了一系列的工具和功能，使得與以太坊區塊鏈的互動更加容易。

具體的安裝細節及操作你可以參考：[系統說明書](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test)或是hardhat 官網。

### ethers

本節源碼：[ethers](https://github.com/CAFECA-IO/auditing_system/tree/feature/auto_test/src/services/blockchain/scripts)

Ethers.js是一個流行的JavaScript庫，用於與以太坊區塊鏈進行交互。開發者可以使用Ethers.js創建和管理以太坊錢包，進行以太幣和代幣的發送和接收。Ethers.js支持多種類型的以太坊節點提供者，包括JSON-RPC、Infura、Alchemy等。

在isuncloud中，我們用ehters來完成自動部署、自動寫入、自動設定匯率、等等上述提到的功能。

我們使用ethers去訪問存在reports.sol智能合約的報表欄位，並且去比對數據看看計算的公式是否符合預期。
### ABI

仔細查閱代碼，你會發現有個abi的字眼，那是什麼呢？

“應用程序二進制接口”（Application Binary Interface）。它是一種數據接口標準，用於智能合約和外部調用者（如用戶端應用程序或其他合約）之間的交互。ABI本質上是一個合約公開函數的JSON格式描述，它使得外部應用程序能夠知道如何編碼和解碼與該合約的交互，ABI包含合約中所有公開函數的描述，包括它們的名稱、參數類型、返回類型等。另外，ABI指定了如何將調用參數（輸入）編碼為區塊鏈可理解的格式，以及如何將交易或函數調用的輸出解碼為可讀格式。

總之，當外部應用（ethers）需要與智能合約互動時，ABI用於告訴該應用如何構造調用和解讀回應。
## 資料庫與API

本章節源碼：[prisma](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/auditing_system_api/pages/api/v1/balance_sheet_prisma.js)與[api](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/auditing_system_api/pages/api/v1/balance_sheet_api.js)

在isuncloud的系統中，系統會先將report.sol上的資料獲取到本地端的變數、寫入一個標準化的報表格式（以API的形式）、然後將這張報表存入資料庫裡。在未來我們可以呼叫伺服器將資料庫(schema model)裡的資料傳送到前端頁面上。

事實上，請伺服器直接呼叫區塊鏈也是可以的但是與區塊鏈的互動通常都會需要一些時間，使用者可沒空等待你慢慢請求區塊鏈，我們可以在沒人使用系統的時間預先執行請求區塊鏈的動作。等有人要使用時直接從資料庫拿取顯然更加合理。

## 報表與代幣

還記得，我們曾提到nft權限控制嗎？沒錯，這個系統其實有分客戶端（前台）與開發端（後台），利用nft的功能造成兩者權限不同，我們總不能讓我們的客戶互相知道彼此的報表對吧。

### 將報表與nft關聯

我們將報表的元數據(reportName,startTime,endTime等等)當作是nft的參數，基於這個參數鑄造一個nft，每個nft都有自己不重複的tokenID。在你擁有這個nft時才有權限請求伺服器給於你整張報表。我們可以將這個tokenID當作是客戶端的report主鍵。

例如，有Alice, Bob, Cindy 三人，Alice是這個系統的開發者、Bob是一位使用系統的客戶、Cindy是另一客戶。現在Bob生產出一張報表 "X" 了，所以Bob 擁有名為 "X" 的報表token，tokenId為 "1"。Bob有權限向伺服器請求整報表的內容。而因為資料都存在資料庫，所以Alice事實上也可以夠過資料庫去管理客戶的報表，因此Alice也可以看到，但是Cindy就沒辦法了。


### 製作一個新的代幣標準

本章代碼:[report_nft](https://github.com/CAFECA-IO/auditing_system/blob/feature/auto_test/src/services/blockchain/contracts/report_nft.sol)

isuncloud即將發布一個基於ERC721的新的以太坊提案，新的功能主要是，允許使用者分享報表，卻不會將自己的token權限轉移。

```solidity
function share(uint256 tokenId, address targetWallet) override external returns (uint256) {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can share this report");
        require(targetWallet != address(0), "Target wallet cannot be zero");

        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;

        Report memory originalReport = _reports[tokenId];
        _reports[newTokenId] = Report(originalReport.name, originalReport.startTime, originalReport.endTime);

        _mint(targetWallet, newTokenId);

        emit ReportNFTShared(msg.sender, targetWallet, newTokenId);

        return newTokenId;
    }
```

如果Bob向Cindy分享了 "X"報表，Cindy將得到 名為"X"、tokenId = 2的一個新token。這樣Cindy就可以，查看"X"的完整報表。

## 結論、參考與源代碼

*It's not about the destination, it's all about the journey*

辛苦了！恭喜你看完了，我們深入了解了動態交易處理合約，並體會到了區塊鏈技術在當今數位時代的強大影響力。從對Solidity基礎語法的初步瞭解，到深入探討智能合約如何塑造我們的交易和數據交互方式，這一路走來既充滿挑戰，也充滿啟發。

文章中，我們不僅探討了技術層面的細節，如優化智能合約和建立堅固的系統架構，還深入了解了iSunCloud會計系統如何實現，以及如何在後端與區塊鏈進行高效的溝通和互動。將對象轉換成數位資產的過程不僅是技術上的突破，更是對我們認知世界方式的革新。

在未來，區塊鏈的技術一定會繼續成熟茁壯，投票機制、金融、大數據等等領域都會承蒙其惠，希望讀者閱讀完成本篇後，可以對實現區塊鏈技術有一定的想法，透過想法、計畫、實現、除錯一步一步向偉大邁進。

### 參考
1. [alincode的2019 iT 邦幫忙鐵人賽](https://ithelp.ithome.com.tw/articles/10204079)

2. [資料密集型系統設計](https://github.com/Vonng/ddia/blob/master/zh-tw/README.md)

### 源代碼

1. [Isuncloud auditing system](https://github.com/CAFECA-IO/auditing_system/tree/feature/auto_test)
