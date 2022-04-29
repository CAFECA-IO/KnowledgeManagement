# 自動化測試研究紀錄
參考資訊：
1. https://hackmd.io/@FortesHuang/S1V6jrvet
2. https://steam.oxxostudio.tw/category/python/spider/selenium.html
3. https://www.tpisoftware.com/tpu/articleDetails/1846
4. https://www.tad0616.net/modules/tad_book3/page.php?tbsn=28&tbdsn=827


## 概念 review: Selenium WebDriver With Java
練習網站: https://courses.letskodeit.com/practice
### Selenium features
* **Intro:** 
Open source tool to automate web applications across multiple platforms.
* **Platform independent:**
Windows、Linux、Mac
* **Support Multiple browsers:**
Firefox、Chrome、Safari、Edge
* **Can be used with many languages:**
Java、Python、JS、PHP、C#

### Selenium type
* Selenium IDE

* Selenium RC
    支持多種語言編寫測試案例
* Selenium WebDriver
    - A set of APIs which helps communication with browsers
* Slenium Grid - Parallel/Sequential Execution
    - Designed to run test automation on multiple systems in parallel

![](https://i.imgur.com/ePj2grW.png)
* Workflow: 
    * 當我們 run automation 時，complete automation code 會被重新轉換成 JSON
    * 產生出來的 JSON 會透過 JSON Wire Protocol over HTTP 被傳送到 browser driver
    * Browser Driver 在相對應的 Browser上 執行特定的 commands 
    * Browser Driver 拿到 Browser 給的動作回覆（送回到client)


### xpath
有關於xpath語法: http://www.w3big.com/zh-TW/xpath/xpath-syntax.html
```
$x("//input[@id='name']");
$x("//input[contains(@class,'btn-style')]");
```
![](https://i.imgur.com/VQE1ZeQ.png)


### CSS selector
css selector的寫法如下:
```
// sample1:
tagname>tagname or #id

// example1:
fieldset>table
--

// sample2:
#id name

// example2:
#product

```
### Advanced Locators

// double child and / single child

* 若要用tag裡面的內容來select的話，需要用到[text()='text details']
* `//div[@class='homepage-hero']//a[text()='Enroll now']`

* Using contains to find the elements(非完全等於，只有包含時使用。)
```
//tag[contains(@attribute,'value')]
//div[@id='navbar']//a[contains(text(),'Login')]
//div[@id='navbar']//a[contains(@class,'navbar-link') and contains(@href,'sign_in')]
```

---
## Selenium IDE 實踐測試 

### Selenium 指令驗證種類
1. **操作指令**

    用來操作瀏覽器及網頁的指令，像 input、click 等動作。
    若操作失敗、或是發生了錯誤 -> 測試中止。
2. **存取指令**

    檢查瀏覽器及網頁的狀態 -> 將結果儲存在變數中，它們也用來自動產生驗證。
3. **驗證指令**

    確認應用程式的狀態是否符合預期的結果。
    
### Selenium locator 定位指令
#### 透過過濾器按名稱定位
* 在 Selenium IDE 裡面選擇 Command, 並輸入進 Target
![](https://i.imgur.com/jCWcgmd.png)
* 格式：
`name =name_of_the_element filter=value_of_filter`

原文網址：https://kknews.cc/code/m6y6lbp.html

#### 透過 CSS Selector 定位
根據基本CSS的方式做使用
| 選擇器 | code | 
| -------- | -------- | 
| id 選擇器     |   #idname   | 
|class 類別選擇器|.cssName|
|屬性選擇器|[屬性名稱="值"]|
|標籤選擇器|tag_name[name="值"] |
#### Xpath 表達式整理


| 作用                     | Xpath |
| ------------------------ | ----- |
| 選取元素的屬性           | @     |
| 從當前節點選取所有子節點 | //    |
| 選取當前子節點           | /     |
|     選取父節點                     |    ..(兩點)   |

* 以下舉一個例子：
`//div[@id="myDivID"]/div[0]`

    說明：
    1. 選取當前 div id 為 myDivID 的子節點
    2. 選取當前子節點的第一個 div 標籤節點
----
### 實踐介面參考圖
![](https://i.imgur.com/kNYO3Fo.png)

### 使用限制
1. 在測試 trade 時可能會遇到自動 type 無法測試的問題
2. 無法自定義變數做統整（例如我今天想測試新的帳號，就必須到 test 的 step 裡面一個一個改帳號才能測試）
3. pause 或 等待 element 出現才能做的測試都需要在側錄後對 test 的 step 重新進行調整 ( insert command 之類 ）
4. 可能會有抓取特定物件但xpath需要被修改的問題（ IDE 使用了太過 hard code 的方式來生產程式碼 ）

### 自動化測試提升時間參考（純測試，不包含測試報告）：
1 hr （ 手動測試，包含遇到 bug ) -> 30 min ( 自動測試 ＋ 手動測試觀察 ）

### 未來可提升部分
1. 建議轉換工具情境：
若要設定能調整的參數，建議可以使用 Selenium RC 而非 Selenium IDE
2. 可以採用 Selenium IDE 情境：
但如果要測試的 case 不會遇到需要頻繁調整參數的問題(例如註冊），建議可以使用 Selenium IDE

### Reference: (轉換工具-> Selenium RC)
1. https://www.tad0616.net/modules/tad_book3/page.php?tbsn=28&tbdsn=827
