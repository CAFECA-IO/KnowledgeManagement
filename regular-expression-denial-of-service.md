# ReDoS 正規表達式阻斷服務攻擊
[Notion 好讀版](https://www.notion.so/ReDoS-20d7ebc1186680dba5f8c51283667598?source=copy_link)
- [什麼是 ReDoS 攻擊？](#什麼是-redos-攻擊)
- [災難性回溯](#災難性回溯)
- [如何避免](#如何避免)
- [測試工具](#測試工具)

## 什麼是 ReDoS 攻擊？
正規表達式阻斷服務攻擊（regular expression denial of service），簡稱 **ReDoS**。為了理解 ReDoS 的成因，我們先分別說明「正規表達式」與「阻斷服務攻擊」。

### 正規表達式
是一種使用簡單字串描述「指定語法格式」的模型，可以用來查找或驗證符合指定格式的文本。正規表達式被多種程式語言所支援，在字串處理、資料驗證等情境中被廣泛應用，是現今軟體開發不可或缺的一部份。

雖然正規表達式提供極大的彈性與便利性，其背後的匹配邏輯在某些情況下會變得非常複雜，可讀性與維護性也相對較差。若撰寫不當，甚至可能導致效能問題或安全風險。

> [!TIP]
> 關於正規表達式的詳細介紹與用法，請參考我過去寫的[新手指南](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/newbie/regular-expression.md)。

### 阻斷服務攻擊
簡稱 **DoS 攻擊**，是一種網路攻擊手段。攻擊者透過大量或特製的請求佔用處理資源，使目標系統過載、當機或無法回應正常使用者請求。

相較於分散式阻斷服務攻擊（DDoS），DoS 攻擊通常來自單一來源。雖然規模較小，但若系統存在易受攻擊的設計，也可能造成嚴重影響。

### ReDoS
顧名思義，ReDoS 就是由不完善的正規表達式所造成的阻斷服務攻擊。

透過精心設計的輸入，觸發設計不良的正規表達式進行高成本匹配運算，進而消耗大量 CPU 資源。這類攻擊不需要大量請求，僅需一次請求即可導致系統效能下降或無法回應，屬於極具隱蔽性與破壞力的應用層攻擊。

這種問題通常與正規表達式內部的「災難性回溯（Catastrophic Backtracking）」行為有關，後續章節將深入說明其原理與成因。

## 災難性回溯
以下是一個會導致災難性回溯的正規表達式範例：

<img width="393" alt="image" src="https://github.com/user-attachments/assets/a3ed2033-929c-4c10-a79a-9c2ea2bba996" />

如上例所示，這條正規表達式花了超過 7 秒才匹配完畢，明顯發生了效能問題。

造成這種延遲的主因在於，多數程式語言中的正規表達式解析器採用**非確定有限狀態自動機（NFA）** 演算法。這種機制會讓解析器在匹配過程中嘗試所有可能的路徑，直到匹配成功或完全失敗為止。

以 `^(a+)+$` 為例，其巢狀重複的結構會導致解析器在遇到無法匹配的最後字元（`X`）時，不斷回溯並嘗試各種可能的 `a` 組合。

下圖是其對應的 NFA 狀態圖：

![NFA](https://github.com/user-attachments/assets/bf98f0e8-6b55-48b2-8c13-b73208a22766)

> （圖片來源：[Regular expression Denial of Service - ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)）
> 

針對輸入 `aaaaX`，解析器會嘗試多達 16 條不同的路徑。每新增一個 `a`，可能的路徑數量便呈指數級上升。當遇到最後字元的 `X` 匹配失敗時 ，系統就會回頭，重複嘗試其他的 `a` 組合，直到匹配成功或試完所有結果：

- `(a)(a)(a)...X` → 匹配失敗
- `(aa)(aa)(aa)...X` → 匹配失敗
- `(aaaaa)...X` → 匹配失敗
- …成千上萬種組合

這種情況稱為**災難性回溯**。當正規表達式設計不當，又碰到特定的輸入字串，系統就會花費過多時間在探索路徑上。占用大量 CPU 資源，導致伺服器回應變慢甚至拒絕服務。

這是個經常被忽略，卻可能帶來嚴重後果的漏洞，對開發者而言不容小覷。

## 如何避免
### 越具體越好
從前述案例可見，`^(a+)+$` 中出現了巢狀的 `+` ，這會讓正規表達式嘗試用**各種可能的 a 組合**來比對字串，如 `a` 、`aa` ，甚至 `aaaaa` 。這類設計會導致大量回溯，因此應避免巢狀重複的使用。

改寫為 `^a+$`，即可避免此問題：

<img width="331" alt="image" src="https://github.com/user-attachments/assets/7425f239-1bd2-4515-8bb7-04e524ad3f61" />

這段改寫取消了括號群組，正規表達式引擎就不再需要嘗試多種 `a` 組合，也就不會進行災難性的回溯。

進一步來說，具體地描述條件能更有效控制匹配行為，例如：

- 使用明確次數：`^a{10}$`（指定匹配 10 次 `a`）
- 使用惰性量詞（lazy quantifier）：`^(a+)?$`（限制群組最多出現一次）
- 使用原子群組（atomic group）：`^(?>a+)+$` （不對群組的內容進行回溯）

> [!Warning]
> 目前 JavaScript 不支援 Atomic Group 語法。

總結來說，應盡量減少括號群組 `()` 的使用，並避免寫出肉眼難以直觀解讀的正規表達式。

### 限制回溯上限
某些語言的正規表達式引擎允許設定最大回溯次數，或在逾時時自動中斷。例如：

- **Java** 可以搭配 `Thread` 控制匹配時間。
- **.NET** 提供 `Regex.MatchTimeout` 屬性。
- **Python** 可透過執行緒 + timeout 包裝 regex 執行。
- **RE2**（Google 開發）天生不允許回溯超時，設計上就避免了 ReDoS。

#### Java 範例（設定逾時時間）：
```java
Pattern pattern = Pattern.compile("^(a+)+$");
Matcher matcher = pattern.matcher("aaaaaaaaaaaaaaaaaaaaaaaX");

try {
    boolean result = matcher.matches(); // 可放入限時 thread 中運行
} catch (Exception e) {
    System.out.println("Regex timeout or interrupted!");
}
```

#### .NET 範例：

```csharp
var regex = new Regex("^(a+)+$", RegexOptions.None, TimeSpan.FromMilliseconds(100));
var result = regex.IsMatch("aaaaaaaaaaaaaaaaaaaaaaaX");
```

這類手段適合**防禦型程式設計**，即便有錯誤表達式，系統也不會因回溯而卡死。

### 使用 DFA 型 Regex 引擎（若可行）
DFA（確定有限狀態自動機）和 NFA 相比，有以下差異：

| 特性 | NFA | DFA |
| --- | --- | --- |
| 回溯 | 會 | 不會 |
| 記憶體用量 | 少 | 多 |
| 支援反向引用等複雜語法 | 支援 | 不支援 |
| ReDoS 風險 | 高 | 幾乎沒有 |

### 常見 DFA 引擎：
- **RE2（Google）**：被設計為永不回溯。
- **Rust 的 `regex` crate**：基於 DFA，安全且高效。
- **Go 語言內建的 `regexp`**：預設採用 RE2。

### 使用建議：
- 如果要處理使用者輸入、網路資料等**不可信來源**，請考慮使用 DFA 為基礎的引擎。
- 若是 JavaScript 這類使用 NFA 的語言，則應更加注意正規表達式的設計方式。

## 測試工具
開發者可以使用一些線上工具來驗證正規表達式是否存在 ReDoS 風險：

### ReDoS Checker
<img width="580" alt="image" src="https://github.com/user-attachments/assets/1b71cd1e-0902-4665-9bd3-08b4e044ca97" />

[ReDoS Checker](https://devina.io/redos-checker) 會對輸入的正規表達式進行風險評估，產生可能的攻擊字串，並標示出容易造成效能問題的區段，有助於開發者及早修正潛在漏洞。

### Regex101
雖然 [Regex101](https://regex101.com/) 不是專為 ReDoS 檢測而設計，但開啟 `Regex Debugger` 模式後就可以看到網頁模擬的匹配過程與嘗試次數。

如果匹配步驟呈現**指數級成長**時，就要小心 ReDoS 風險。

<img width="516" alt="image" src="https://github.com/user-attachments/assets/6e3e1334-a2c8-4a17-945f-c4471ae4b8d9" />

點擊 `Regular Expression` 左側的按鈕。

<img width="1420" alt="image" src="https://github.com/user-attachments/assets/e40c714f-ef09-4553-b335-16cd98ac067a" />

點擊播放鍵，即可逐步檢視匹配流程與回溯次數。

### ESLint 插件：eslint-plugin-security

[eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security) 是一款可為 ESLint 加入資安檢查的套件，能偵測潛在的 ReDoS 弱點，例如風險較高的 RegExp 使用方式。非常建議在 Node.js 或 React 專案中加入使用。

---

然而，這類工具仍無法涵蓋所有潛在的攻擊情境。開發人員可以先用工具進行初步驗證，再針對實際應用撰寫單元測試，模擬特定輸入情境，以確保正規表達式在生產環境中具備良好效能與安全性。

## 參考資料
- [ReDoS - Wikipedia](https://en.wikipedia.org/wiki/ReDoS)
- [阻斷服務攻擊 - 維基百科](https://zh.wikipedia.org/zh-tw/%E9%98%BB%E6%96%B7%E6%9C%8D%E5%8B%99%E6%94%BB%E6%93%8A)
- [DoS 與 DDoS攻擊：有什麼區別](https://www.fortinet.com/tw/resources/cyberglossary/dos-vs-ddos)
- [【從做中學】 一不小心就重做(ReDoS)？淺談 ReDoS 與 RegExp 攻擊](https://medium.com/@JammsL/%E5%BE%9E%E5%81%9A%E4%B8%AD%E5%AD%B8-%E4%B8%80%E4%B8%8D%E5%B0%8F%E5%BF%83%E5%B0%B1%E9%87%8D%E5%81%9A-redos-%E6%B7%BA%E8%AB%87-redos-%E8%88%87-regexp-%E6%94%BB%E6%93%8A-1062690202c7)
- [正規表達式沒寫好會怎樣？淺談 ReDoS：利用 regexp 的攻擊](https://blog.huli.tw/2023/06/12/redos-regular-expression-denial-of-service/)
- [深入淺出：理解ReDoS By Regex Injection的弱點、威脅與修補策略](https://www.securityverse.tw/index.php/2023/06/02/elementor-1063/)
- [我们需要更愚蠢的代码【让编程再次伟大#15】](https://www.youtube.com/watch?v=7WwvdLbMocE&t=345s)
- [Regular expression Denial of Service - ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [Avoiding Catastrophic Backtracking in Regular Expressions](https://dev.to/thdr/avoiding-catastrophic-backtracking-in-regular-expressions-29lp)
