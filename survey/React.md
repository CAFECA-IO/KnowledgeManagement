# React-redux / Jest / 前端效能優化 研究
## Summary
為了讓未來開發網站前端更為順利，以下針對 React-redux 做了複習，除此之外，也稍微研究了一下如何使用 Jest 來撰寫單元測試。之所以在此處選擇研究 Jest 作為研究目標，是因為 Jest 本身和 react 的結合度較好，所以在此使用 Jest 作為單元測試研究的方向。最後，除了上述兩種研究外，此篇報告還針對前端效能優化做了一個文章整理，希望能有助於未來提升網站客戶端的效能。

---
## React-redux
### props
一個用來從 父 compoenent pass data 到 子 component 的 system
* 目標
目標是用來將客製化、configure
### Class Component and Function Component
**Class Component:**
    
    可以在裡面使用jsx
    使用Lifecycle method來在某些特別的時間點run code
    使用state來更新螢幕上的畫面
    
**Function Component:**

    可以在裡面使用jsx
    使用Hooks來在某些特別的時間點run code
    使用Hooks來access state system，並 update 螢幕上的畫面

參考:
https://ithelp.ithome.com.tw/articles/10234746
### State 
1. 當 component 被創建時，State 必須被初始化
2. 更新 state 時，會讓 Component 被 render
3. 用 SetState 來 update state 

* Lifecycle:
    - constructor
    - render
    - componentDidMount會在第一次render後被呼叫
    - 在state被update時，會呼叫componentDidupdate
    - componentDidUpdate被呼叫時，會呼叫render

### Hooks

**useState**
```
const [activeIndex,setIndex] = useState(null);
//set index
setIndex(2)
```

**useEffect**

```
// second argument
// 會在一開始 render 時 run
[]
// nothing 時，會在一開始 rerender 和往後 render 時 run

// 有 data 時，會在 相較上一次render值 data 被改變的時候 rerender後 run
[data]
```

### Redux

#### Redux cycle: 
- Action creator -> action(type、payload) -> dispatch -> reducer(prev state,action) pure funciton -> store
#### Redux 細節詳述
- Reducer:
描述發生什麼的動作的一般物件
- Action:
State 如何應對改變，只負責計算下一個 State
定義 type（動作形式）, payload (處理資料)
- Store:
不同 Reducers 和 Action creator 的 assembly 
#### Redux 範例
- Action 的使用範例：
```
const createPolicy = (name, amount) =>{
    return {
        type: 'CREATE_POLICY',
        payload:{
         name: name,
         amount: amount
        }
    }
}
```
- 以下為 Reducer 的使用範例：
```
const claimsHistory = (oldListOfClaims = [], action) =>{
    if(action.type==='CREATE_CLIAM'){
        oldListOfClaims.push(action.payload);
        return [...oldListOfClaims, action.payload];
    }
    return oldListOfClaims;
}
```

- 以下為 Reducer 和 store 的綜合使用的使用範例：

    範例一、
    ```
    const {createStore, combineReducers} = Redux;
    
    const ourDepartments = combineReducers({
        accounting: accounting,
        claimsHistory: claimsHistory,
        policies: policies
    })
    
    const store = createStore(ourDepartments);
    
    store.dispatch(createPolicy('Alex',20));
    
    // console.log(store.getState());
    ```
    範例二、
    ```
    import {createStore} from 'redux';

    const Areducer =  (state={num:0},action) =>{

        if (action.type==='d'){
            return { counter: state.num - 1 };
        }
    
    return state;

    }

    const store = createStore(Areducer);

    export default store;
    ```

---
## Jest
### 下載與環境設定
1. 下載 Jest 進環境裡:
`npm install jest --save-dev`

2. 在 package.json 確認 devDependencies:
![](https://i.imgur.com/tCnyTws.png)

3. 更改 script 的 test
![](https://i.imgur.com/UH7ZRhy.png)

4. Jest 會在執行程式前先去會尋找專案中副檔名為 .test.js 結尾的檔案
撰寫的模板：
    ```
    test('test_name',()=>{
        expect(要導入的測試函式).toBe(result)
    })
    ```

    範例：
    ```
    // build page_name.test.js 並撰寫測試方式：
    test('Check the result of 5 + ', () => {
        expect(5 + 2).toBe(7)
    })
    ```
5. 並且 run test
    `npm run test`

6. [Optional-加速測試開發] 在使用 VScode 時，可搭配使用 Jest Snippet 插件，實行測試快速撰寫的功能（tab+commands)
    ```
    tb -> expect().toBe();
    tblt -> expect().toBeLessThan();
    tblte -> expect().toBeLessThanOrEqual();
    ```
### 相關語法
#### 驗證方式- matchers
除了 toBe 外，還有其他 matchers:
```
.toBeNull();
.toBeUndefined();
.toBeNaN();
.toBeFalsy();
.toBeTruthy();
```
其餘可參考 Reference: Jest 官方文件
#### 物件比對問題
在 JS 中，因為他傳的是參考而不是傳值，在使用 .toBe() 來確認物件是否與值相同時，測試結果會出現 Fail

[Solution] 使用 .toEqual() 來解決比較物件的值的問題

##### toBe() 和 toEqual() 的比較


| matcher | 比較 | 
| -------- | -------- | 
| toBe()     | 使用 Object.is 做判斷，而非使用 ===     | 
| toEqual() | 使用深度比對（deep equality),使用 Object.is 比對物件或陣列內的純值；deep quality 如同在物件內將值取出一一比對|

- 備註：Object.is()方法

    Object.is()方法用於確定兩個值是否相同
以下為相同的情況：

    1. 如果兩個值都未定義/null/true或false/
    2. 如果兩個字符串的長度相同，且字符相同且順序相同
    3. 如果兩個值均為數字，並且均為“NaN”或均為非零且均為非NaN且值均相同
    4. 不相等：數字值“+0”和“-0”視為不相等

#### toMatch 正規表達式比對
```
test('測試 email 格式是否正確', () => {
  expect('gres@gmail.com').toMatch(
    /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  );
});
```
##### 正規表達式複習

常用正規表達式：


| 功能 | regex | 
| -------- | -------- | 
| 從文本裡找出 YYYY-MM-DD 格式的日期字串    | \d{4}-\d{2}-\d{2}     | 
|從文本裡找出所有字首是大寫的英文字|[A-Z]\w+|
|驗證字串是否是台灣身份證字號| ^ [A-Za-z]\d{9}$|

正規表達式細項說明：

**1. quantifier**
接在字符串或群組後面，表示某個條件應該出現幾次 
| quantifier  | 表示 | 
| -------- | -------- | 
|  ?    |  表示連續出現 0 次或 1 次    | 
|*|表示連續出現 0 次或多次|
|+|表示連續出現 1 次或多次|
|{min,max}|表示至少連續出現 min 次，但最多連續出現 max 次|

#### 陣列是否包含特定值
可以使用 toEqual() / toContain()
```
test('陣列是否包含 Clemmy', () => {
  const newArray = ['Clemmy', 'Stacy', 'Yoyo'];
  expect(newArray).toContain('Clemmy');
});
```
#### describe 群組描述
簡易範例：
index.test.js:
![](https://i.imgur.com/1wOtspK.png)
output:
![](https://i.imgur.com/tM9pbPy.png)

---
## 前端效能研究
### Web Client Side 效能優化的技巧：
#### 效能評析工具與指標
1. 網頁效能分析 Devtool - LightHouse
此處以 TideBit Legecy 的 Account 頁面為例：
![](https://i.imgur.com/bKdXg6G.png)

![](https://i.imgur.com/ziN1FAI.png)

由上圖我們可以發現：

針對 TideBit 的 Account 頁面做效能分析後，發現 Perfromance的分數偏低，其工具建議可以減少沒有使用到的 Javascript，並且減少 render-blocking resources 等來優化網站效能

2. Google 效能評比三大指標： Core Web Vital
![](https://i.imgur.com/aPUJ1j5.png)
- LCP: 顯示最大內容元素所需時間 (Speed)

    計算網頁可視區 (viewport) 中最大元件的載入時間 (也就是頁面的主要內容被使用者看到的時間) -> 其為 **“速度的指標”**

    不過 viewport 最大的元素會隨著畫面滾動而有所變化
    
    - 如何優化 LCP ?
     

        減少伺服器回應時間
        
        針對主機效能優化
        
        使用較近的 CDN
        
        Cache
        
        提早載入第三方資源
        
    - 避免 Blocking Time
        
        降低 JavaScript blocking time
        
        降低 CSS blocking time
        
    - 加快資源載入的時間 

        圖片大小優化
        
        預先載入重要資源
        
        將文字檔案進行壓縮
        
        根據使用者的網路狀態提供不同的內容
        
        使用 service worker

    - 避免使用客戶端渲染(CSR)
        
        若必須使用 CSR ，建議優化 JavaScript ，避免渲染時使用太多資源
        
        盡量在伺服器端完成頁面渲染，讓用戶端取得已渲染好的內容

- FID — First Input Delay 首次輸入延遲/封鎖時間總計 (與網站的互動性)

    輸入延遲 (Input Delay) 通常發生於瀏覽器的主執行序過度繁忙，而導致頁面內容無法正確地與使用者進行互動。( Example: 可能瀏覽器正在載入一支相當肥大的 JavaScript 檔案，導致其他元素不能被載入而延遲可互動的時間。)

    - 如何優化 FID ？
        
        減少 JavaScript 運作的時間
        
        降低網站的 request 數並降低檔案大小
        
        減少主執行序的工作
        
        降低第三方程式碼的影響
        
- CLS — Cumulative Layout Shift 累計版面配置轉移 (View 的穩定性)

    在網站中，突然一個廣告被插入，讓我們不小心點開別的網站，這就是 CLS 這個指標想要避免的使用者體驗

    - 如何避免 CLS ？
        
        給予會比較慢載入的元素一個預設的寬度與高度

#### Code Splitting
即便會透過如 webpack 等 bundler 來 uglify、minimize、打包程式碼，當專案成長到一定程度時，程式 bundle size 仍然會變得過於肥大，導致 client side 的網頁載入時間變長，嚴重影響使用者體驗。

##### 解決：
解決單一 JS Bundle 過於肥大的問題，將原本單一的 bundle 切分成數個小 chunk，可以搭配平行載入，或者是有需要時才載入某些特定的 chunk，又或是對一些不常變動的 chunk 個別做快取，來達到載入效能的優化。

較常見的 Code Splitting 又分為兩種方式 :

- 動態載入功能模組 Dynamic Import
- 抽離第三方套件：
    - 將所有第三方套件打包為單一檔案
    - 將第三方套件打包為多個檔案

以下為詳細說明：

#### 動態載入功能模組 Dynamic Import

- 大多數狀態:

    會在檔案的開頭引入需要用到的模組，這些模組通常在網頁載入時就被引入進來(static import)，然而當有以下兩種狀況的需求時，static import 卻不能滿足我們：

    - 模組名稱為動態變數時
    - 需依照特定邏輯或特定時機引入時

- Solution:

    - 運用 Dynamic Import。所謂 Dynamic Import 代表的即是 "需要用到某段程式碼時才透過網路載入 JS bundle"

    - 要實現 Dynamic Import 需要靠 ESM import 語法：
    ![](https://i.imgur.com/vjp0bjc.png)


- 實現方式：

    - webpack 等打包工具來幫助我們實現 Dynamic Import。

##### 抽離第三方套件

1. 將所有第三方套件打包為單一檔案

    關於 webpack 的 bundle，可以先做一個最大的拆分：

    - Application Bundle (經常變動的部分)：UI 與商業邏輯，跟我們寫的程式有關。
    - Vendor Bundle (不太會變動) ：第三⽅套件 / node_modules
        
        因為通常它變動的頻率相對較低，因此比較適合被 cache，而在 Vendor Bundle 被 cache 的狀況下由於減少了 Application Bundle 的⼤⼩ -> 因此加快了再訪者的載入速度。
        
        優點: 邏輯簡單
        
        缺點: 為更新任何第三方套件都會使快取失效

2. 將第三方套件打包為多個檔案

    優點: 可以根據套件關聯性打包，減少套件更新時造成的延遲。

    缺點: 相較前面打包成單一檔案的方式，這種方式需要處理的邏輯較複雜。

    ex.  webpack 的 CommonsChunkPlugin 實作類似下圖的 config 可以達成這個效果


###### 以上為根據下方 Reference 所做的整理

---
## Reference:

Regex:
https://www.fooish.com/regex-regular-expression/

Testing 簡介：
https://medium.com/hannah-lin/%E5%89%8D%E7%AB%AF%E6%B8%AC%E8%A9%A6%E5%8E%9F%E4%BE%86%E6%B2%92%E9%80%99%E9%BA%BC%E5%96%AE%E7%B4%94-%E6%90%9E%E6%87%82-unit-testing-integration-e2e-snapshop-dc26d164bd6b

Jest:
https://medium.com/enjoy-life-enjoy-coding/%E8%AE%93-jest-%E7%82%BA%E4%BD%A0%E7%9A%84-code-%E5%81%9A%E5%96%AE%E5%85%83%E6%B8%AC%E8%A9%A6-%E5%9F%BA%E7%A4%8E%E7%94%A8%E6%B3%95%E6%95%99%E5%AD%B8-d898f11d9a23

Jest 官方文件：
https://jestjs.io/docs/

React-redux:
https://medium.com/hannah-lin/jest-enzyme-%E9%81%8B%E7%94%A8%E5%9C%A8%E7%9C%9F%E5%AF%A6%E4%B8%96%E7%95%8C%E4%B8%AD%E7%9A%84-react-redux-project-%E5%B0%88%E6%A1%88%E8%AC%9B%E8%A7%A3%E7%AF%87-ca370c22f745

前端效能大補貼：
https://medium.com/starbugs/%E4%BB%8A%E6%99%9A-%E6%88%91%E6%83%B3%E4%BE%86%E9%BB%9E-web-%E5%89%8D%E7%AB%AF%E6%95%88%E8%83%BD%E5%84%AA%E5%8C%96%E5%A4%A7%E8%A3%9C%E5%B8%96-e1a5805c1ca2
