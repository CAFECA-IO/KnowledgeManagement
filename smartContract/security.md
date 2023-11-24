## 智能合約攻擊手段與防禦措施

本篇文章探討了智能合約開發過程中常見的錯誤和疏忽，以及區塊鏈技術面臨的各種惡意攻擊手段和防範策略。旨在避免開發人員重蹈覆轍，免受過往開發者所承受的沉重損失，並強調在開發智能合約時開發人員對安全性和穩定性的重視程度。

***

### 攻擊種類


A. 惡意行為

惡意行為可能包括散布惡意軟件以欺騙用戶的行動。這種類型的利用主要是通過互聯網啟動，以侵犯用戶身份或通過使用惡意軟件或病毒進行欺詐。這類惡意活動可能嚴重影響受害者的財務狀況​​。惡意攻擊可能以任何形式出現，例如來自錢包的電子郵件，要求將賬戶與剛剛進行硬分叉的網絡同步。通過惡意攻擊對用戶錢包的利用可能允許攻擊者抽乾所有貨幣。加密挖礦、Slack和論壇攻擊是一些要求礦工通過被破壞的鏈接登錄的惡意技術​​。Glupteba是另一種利用比特幣區塊鏈進行更新的惡意軟件。因此，即使服務器連接被防病毒軟件終止，它仍然保持活動。這種惡意軟件通過腳本傳播，以竊取用戶ID、密碼、瀏覽歷史、保存的cookie等機密信息​​。

***

B. 薄弱的協議

區塊鏈技術包括一種共識協議，以保持網絡的流暢運行。不同的區塊鏈平台採用了不同的協議，其中權益證明（Proof of Stake, PoS）因其能效和安全性而日益受到青睞。儘管PoS協議在某些方面比PoW更有效率和環保，但它也有自己的安全挑戰。例如，'Nothing at Stake'問題可能鼓勵節點驗證多個區塊鏈分支，因為這樣做幾乎沒有成本。此外，PoS系統可能面臨“長範圍攻擊”和“質押集中化”的風險，後者發生在少數參與者控制大部分質押的情況。
在PoS中，攻擊者需要控制大量的質押幣才能執行51%攻擊，這使得攻擊成本高昂。然而，如果攻擊者成功，他們可以重寫交易歷史或雙重花費。除了這些，還有其他攻擊方法，如質押池的集中化可能對網絡的去中心化特性構成威脅。

***

C. 欺詐

這種利用手段欺騙商家，利用數字交易的不穩定行為謀取利益。欺詐可能會影響商家在交易完全確認之前就釋放商品。在正常情況下，一筆比特幣交易在6次交易後確認。然而，消費者可能會說服商家在等待6次交易之前就釋放商品，這樣就可以啟動像1次確認或n次確認這樣的攻擊技術來進行雙重支付。
同樣，近來，許多零售商接受加密貨幣支付，允許消費者立即收到他們的產品​​。例如，在咖啡店購買咖啡。考慮一個場景，其中一個敵手設法在短時間內花費同一加密貨幣，這將引發兩筆交易之間的競賽。如果第二筆交易被礦池礦工採納用於處理，那麼第一筆交易將被丟棄，可能導致商家未能獲得提供商品的付款。

***

D. 應用程序漏洞

當智能合約代碼中存在錯誤時，就會出現應用程序漏洞的利用。這種利用主要發生在智能合約中。當開發者未能識別去中心化應用程序中的代碼錯誤時，就會出現這種情況。攻擊者可以通過簡單的代碼錯誤從合約錢包中抽走所有的錢。智能合約應用程序類似於在區塊鏈上運行的網絡應用程序。與網絡應用程序的漏洞一樣，它們也包含錯誤，然而，這些漏洞可能導致嚴重的挑戰。例如，DAO能夠籌集1.5億美元，而攻擊者由於代碼漏洞能夠偷走約6000萬美元​​。Rubixi和GovernMental是一些由於代碼漏洞而存在缺陷的智能合約應用程序​​。應用程序漏洞不僅可能允許攻擊者偷錢，還可能影響應用程序的不同運作。

### 攻擊技術


#### 重入性

重入性被認為是智能合約中最災難性的攻擊技術之一​​。這種攻擊技術能夠完全破壞合約或竊取有價值的信息。當一個函數通過外部調用調用另一個合約時，可能會發生重入性攻擊。下面的清單1展示了一個代碼片段，該代碼片段可以被利用來執行重入性攻擊。這種利用允許攻擊者執行主函數的遞歸回調，形成一個意外的循環，多次重複。例如，當一個容易受攻擊的合約包含一個撤銷函數時，合約可能多次非法調用撤銷函數，以排空合約包含的任何可用餘額。單一函數重入性攻擊和跨函數重入性攻擊是兩種不同的類型，可以被攻擊者利用。這種利用允許攻擊者使用外部調用來執行期望的任務。

讓我們舉個例子，參考以下有漏洞的合約，它可以作為保險箱使用，讓使用者每週提取1乙太幣。


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

如果一個攻擊者創建了一個惡意合約如下

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

讓我們一步一步來看：

1. 攻擊者首先部署EtherStore合約。然後，攻擊者部署Attack合約，並在構造函數中指定EtherStore合約的地址。這樣，Attack合約就可以與EtherStore合約進行交互。


2.攻擊者通過調用Attack合約的attackEtherStore()函數來啟動攻擊。這個函數首先要求攻擊者發送至少1個以太幣到Attack合約。attackEtherStore()函數接著調用EtherStore合約的depositFunds()方法，將這1個以太幣存入EtherStore合約。緊接著，attackEtherStore()函數調用EtherStore的withdrawFunds()方法，嘗試從EtherStore合約提取1個以太幣。


3. 當EtherStore合約處理提款請求時，它將1個以太幣發送回Attack合約。由於是以太幣的轉移，這自動觸發了Attack合約的回調函數（fallback函數）。


4. 回調函數中的重入攻擊：在Attack合約的回調函數中，如果檢測到EtherStore合約的餘額仍然大於1個以太幣，它會再次調用EtherStore合約的withdrawFunds()方法。重點是，在EtherStore合約更新用戶的餘額和最後提款時間之前，就發送了以太幣。這意味著Attack合約可以在同一個交易中多次提取資金。


5.每次Attack合約的回調函數被觸發時，它都會檢查EtherStore的餘額，並再次嘗試提款。這個循環會持續進行，直到EtherStore的餘額降至不足以繼續提款為止。


6. 一旦EtherStore的餘額不足以繼續提款，Attack合約的回調函數停止執行。攻擊者可以通過調用Attack合約的collectEther()函數，將從EtherStore合約中提取的所有資金轉移到自己的賬戶。

***

**針對這個攻擊合約有三種防範方法：**

1. 使用內置的transfer函數向外部合約發送以太幣，因為transfer函數會給外部調用附加額外的 2300 gas，所以不足以支持目標合約再次調用其他合約。

2. 使用 "檢查 - 生效 - 交互" 的模式確保所有對狀態的修改都在向其他合約發送以太幣之前執行。

3.  引入互斥鎖，新增一個狀態變量來在代碼執行中鎖定合約，避免重入調用。

        contract EtherStore {
    
        //initialize the mutex
        bool reEntrancyMutex = false;
        uint256 public withdrawalLimit = 1 ether;
        mapping(address=>uint256) public lastWithdrawTime;
        mapping(address=>uint256) public balances;
    
        function depositFunds() public payable{
            balances[msg.sender] + = msg.value;
        }
    
        function withdrawFunds(uint256 _weiToWithdraw) public{
            require(!reEntrancyMutex);
            require(balances[msg.sender] >= _weiToWithdraw);
            //limit the withdrawal
            require(_weiToWithdraw <= withdrawalLimit);
            //limit the time allowed to withdraw
            require(now>=lastWithdrawTime[msg.sender]+1weeks);
            balances[msg.sender] - = _weiToWithdraw;
            lastWithdrawTime[msg.sender] = now;
            // set the reEntrancy mutex before the external call
            reEntrancyMutex = true;
            msg.sender.transfer(_weiToWithdraw);
            //release the mutex after the external call
            reEntrancyutex = false;
        }
    
        }


***


#### 溢出

這種漏洞相對容易引發，並且發生在接受未經授權的輸入數據或值的交易中​​。智能合約溢出主要發生在提供的值超過最大值時​​。這些合約主要用Solidity編寫，Solidity可以處理高達256位的數字，因此增加1將導致溢出。傳統的測試方法不足以確定智能合約中的溢出漏洞。
例如以下包含漏洞的智能合約代碼

    function batchTransfer(address[] _acceptors, uint256 _value) public whenNotPaused returns (bool) {
        uint cnt = _acceptors.length;
        uint256 total = uint256(cnt) * _value;
        require(cnt > 0 && cnt <= 20);
        require(_value > 0 && balances[msg.sender] >= total);
        balances[msg.sender] = balances[msg.sender].sub(total);
        for (uint i = 0; i < cnt; i++) {
            balances[_acceptors[i]] = balances[_acceptors[i]].add(_value);
            Transfer(msg.sender, _acceptors[i], _value);
        }
        return true;
    }

​​，攻擊者可以使用參數調用此函數
來利用這個漏洞。例如，下面的代碼total = value * _2 = 0將檢查移至balances[msg.sender] >= total。攻擊者可以在接收方函數中輸入2個地址，以便讓代幣智能合約將以太幣轉給這兩個地址。
智能合約下溢（underflow）發生在與溢出相反的情況​​。然而，下溢攻擊更容易執行，因為對於攻擊者來說，獲得引起溢出所需的代幣通常具有挑戰性。

***

#### 短地址攻擊

這種漏洞是由於以太坊虛擬機（EVM）的薄弱性而發生的​​。EVM允許不精確的填充參數，使得對手能夠發送特製的地址，從而導致利用。短地址攻擊遵循與SQL注入漏洞類似的攻擊策略​​。當檢測到下溢時，EVM會在地址的末尾添加一個零，以確保它包含256位數據類型。然而，敵手可以利用這個漏洞，通過省略以太地址的最後一個零來進行攻擊。這種漏洞是一個輸入驗證漏洞，主要發生在發送方，由於交易生成代碼薄弱。

***

#### DELEGATECALL

智能合約開發人員利用CALL和DELEGATECALL指令來模塊化編寫的代碼​​。DELEGATE操作碼的功能與消息CALL類似，然而，除了被執行以調用合約的代碼之外，msg.sender和msg.value並不會被改變。這一特性允許開發者生成可重用的代碼，通過使用DELEGATECALL增加了突然代碼執行的機會。DELEGATECALL功能表明，在構建自定義庫時可能引入漏洞，同時也可能導致新的漏洞。DELEGATECALL漏洞可以通過觀察庫合約和調用合約的失誤來避免，另外，盡可能開發無狀態庫。

***

#### 默認可見性
Solidity函數中的可見性指定符控制著函數的調用方式​​。當允許用戶通過派生合約調用外部函數時，可見性指定符也起到控制作用。可見性指定符的不當實現可能對智能合約造成嚴重影響。函數的默認可見性總是設置為公共的，允許外部合約在函數未明確提及時調用可見性。當開發人員忽略將可見性指定符設置為私有時，就會出現這種漏洞。


        contract GuessAddress {
            function gainEther() {
              // Winner while the last 8 hex
              // characters of the address are 0.
              require(uint32(msg.sender) == 0);
              _sendEther();
            }
          
            function _sendEther() {
              msg.sender.transfer(this.balance);
            }
      }



以上展示了一個基於地址猜測遊戲的智能合約​​。參與者可以通過產生一個以太坊地址來贏得獎勵，該地址的最後8個十六進制字符中必須包含零。一旦滿足要求，就可以執行gainEther()函數來接收獎勵。由於易受攻擊的代碼沒有指定可見性，並且_sendEther()函數設置為公共的，攻擊者將能夠竊取獎勵。

所以確保function可見性都有設置定位，或使用較新的編譯器來提醒我們未設置可見性。


***

#### 交易排序依賴（TOD）

交易排序依賴（TOD）是一種可能允許腐敗礦工對智能合約產生嚴重影響的漏洞​​。這種漏洞是智能合約中非常常見的安全漏洞，依賴交易執行的順序​​。例如，一個新生成的區塊包含了2個執行相同智能合約的交易。這樣的情節不提供足夠的信息給用戶，以確定合約的狀態或個別調用何時啟動。因此，當兩個交易的輸出依賴於順序時，該合約就存在TOD漏洞。

在以太坊區塊鏈中，礦工負責控制交易的順序，優先處理具有更高Gas的交易。因此，任何關閉區塊的礦工都可以影響交易的順序。潛在礦工能夠影響交易順序以進行非法活動是交易排序依賴（TOD）的結果。

***

#### 時間戳依賴

時間戳依賴是另一個可能被腐敗礦工利用的漏洞​​。為了獲得利益，礦工可以重新調整時間戳，相差幾秒鐘。時間戳依賴漏洞源於對時間記錄的誤解​​。它使以太坊網絡脫離了同步的全球時鐘。例如，智能合約使用當前的時間戳生成隨機數以確定彩票結果。由於智能合約允許礦工在區塊驗證後的30秒內提交時間戳，這為礦工提供了更多的機會進行利用。因此，隨機數生成器的結果可以被修改以獲得利益。

***

### 真實案例


#### 2016年，The DAO

2016年的以太坊DAO攻擊是區塊鏈歷史上一個重要且具有爭議的事件。這次攻擊對以太坊網絡產生了深遠的影響，最終導致了以太坊網絡的“硬分叉”。

DAO（去中心化自治組織）是在以太坊區塊鏈上建立的一個智能合約系統，旨在創建一個去中心化的投資基金。它通過公開募集以太幣（ETH）籌集了大量資金。

不幸的是，DAO智能合約中存在一個漏洞。2016年6月，一個未知的攻擊者利用這個漏洞，從DAO合約中提取了約360萬個以太幣，當時價值約5000萬美元。

這個漏洞是由於代碼中的錯誤，開發者沒有考慮到遞歸調用的可能性。因此，它使得攻擊者能夠在最初幾小時內偷走價值數百萬美元的以太幣。DAO攻擊情境展示了一個簡單的智能合約漏洞可能有多麼具破壞性。

這次攻擊引起了以太坊社區的廣泛關注和爭論。一方面，有人認為應該尊重“代碼即法律”的原則，即使這意味著接受損失。另一方面，有人主張應該逆轉交易，以恢復資金給原始持有者。

經過激烈的討論和投票後，以太坊社區決定執行一次硬分叉，以逆轉DAO合約中的交易，並將資金退還給原來的投資者。這次硬分叉在區塊鏈上創建了一個新分支，並恢復了被盜的資金。

硬分叉創建了兩個獨立的區塊鏈和兩個獨立的貨幣：以太坊（ETH）和以太坊經典（ETC）。以太坊（ETH）是硬分叉後的新鏈，而以太坊經典（ETC）則繼續沿用原有的區塊鏈。

***

#### 2018年，PoWHC

這個項目起源於4chan的/biz/板塊，它以一種獨特的方式出現：作為一個公開宣布的龐氏騙局。這可能聽起來不可思議，但它的價值在非常短的時間內暴漲至一百萬美元以上，涉及超過一千個以太幣。

但有趣的是，這個項目的代碼實際上是基於Jochen Hoenicke的原始龐氏代幣概念，並且只是勉強符合以太坊的ERC-20代幣標準。這裡的問題是，雖然它符合基本規範，但代碼中存在一些嚴重的漏洞。

其中最顯著的一個漏洞出現在實現ERC-20標準的部分，它允許用戶授權他人代表自己轉移代幣。這聽起來可能沒什麼問題，但實際上，這個漏洞使得惡意用戶可以利用第二個賬戶來出售第一個賬戶的代幣。最終，這導致第二個賬戶因為整數下溢而擁有了極大數量的PoWH幣。

那麼，這個漏洞是怎樣被利用的呢？實際上，當第二個賬戶嘗試轉移一個PoWH幣時，由於編碼錯誤，其餘額下溢到了一個極大的數值，幾乎等於2的256次方減去1。隨後，這個賬戶就可以輕鬆將這些虛假的PoWH幣轉換為真實的以太幣。

***

#### 2017年，Parity 多重簽名錢包(2nd attack)

Parity多重簽名錢包的第二次攻擊發生在2017年導致大約3億美元的以太幣被凍結。

Parity多重簽名錢包是一個基於智能合約的以太坊錢包，允許多個用戶共同控制和管理資金。多重簽名機制意味著進行任何重要的資金轉移需要多個簽名，這是為了增強安全性。

2017年7月，Parity錢包首次遭遇安全漏洞，導致3000萬美元的以太幣被盜。在此之後，Parity嘗試修復這個漏洞，但不幸的是，新的代碼中引入了另一個漏洞。

在修復第一次漏洞的過程中，Parity意外地使其錢包庫合約成為了一個沒有所有者的合約。由於這個錯誤，任何人都可以成為該合約的所有者並有權執行任何操作，包括自毀合約。

2017年11月，一名未知攻擊者發現了這個漏洞，並錯誤地或惡意地觸發了合約的自毀功能，這導致所有依賴該庫合約的錢包被凍結。這意味著包含大量以太幣的錢包變得無法訪問，估計損失約3億美元。

這次事件對於Parity和整個以太坊社區都是一個巨大的打擊。它引起了對智能合約安全性和以太坊平台可靠性的廣泛關注。此外，這也引發了關於是否應該通過硬分叉來解凍資金的辯論，但這種方法也存在爭議。

***

#### Parity 多重簽名錢包(1st attack)，默認的可見性

Parity多重簽名錢包的第一次重大安全漏洞發生在2017年7月，這次事件導致約3000萬美元的以太幣被盜竊。

2017年7月，黑客發現了Parity多重簽名錢包合約中的一個漏洞。這個漏洞位於合約的一個特定函數中，該函數允許一名未經授權的用戶成為合約的擁有者。

攻擊者首先利用這個漏洞取得了合約的控制權，然後從多個由該合約控制的錢包中轉移走了大量的以太幣。這次攻擊導致價值約3000萬美元的以太幣被盜。

***

#### GovernMental

智能合約中使用時間戳的問題是，它們可能不是完全可靠的。在以太坊區塊鏈中，時間戳是由礦工設置的，這意味著它們有潛在的被操縱的風險。在某些情況下，礦工可能會出於自身利益而輕微調整時間戳，這可能對依賴精確時間戳的智能合約造成影響。

對於像"GovernMental"這樣的遊戲，如果遊戲結果嚴重依賴於交易的精確時間，那麼時間戳的這種潛在不可靠性就會成為一個問題。這可能導致不公平的遊戲結果或被操縱的可能性，引起參與者的不滿和爭議。

***

### 參考資料

1. [Smart Contract: Attacks and Protections](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8976179) by SARWAR SAYEED , HECTOR MARCO-GISBERT , (Senior Member, IEEE), AND TOM CAIRA
2. [Master in Ethereum](https://github.com/ethereumbook/ethereumbook) by Gavin Wood, Antonopoulos Andreas
3. [How $800k Evaporated from the PoWH Coin Ponzi Scheme Overnight](https://medium.com/@ebanisadr/how-800k-evaporated-from-the-powh-coin-ponzi-scheme-overnight-1b025c33b530)






