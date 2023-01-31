# Cypress
Cypress 是能幫助使用者直接在瀏覽器上做前端測試 npm 套件，它可以根據使用者撰寫的腳本開啟瀏覽器，並針對特定的頁面照著腳本執行動作，以達到驗證系統的目的。 Cypress 所提供的互動版面讓使用者能檢視每個動作的執行結果，有利於使用者進行除錯和優化，另外 Cypress 也有截圖與錄影紀錄測試過程的功能。
## Install
```
npm install cypress
```
- 在專案中安裝 Cypress 
```
npx cypress open
```
- 這個指令能開啟圖形介面，撰寫測試案例時可以直接看到目前的狀態
```
npx cypress run
```
- 如果只需要驗證測試結果，這個指令可以讓 cypress 在終端執行測試，不另外開啟 GUI

## Write Your Testcase
- 撰寫測試案例時，會以 'it' 為測試的最小單位，需要將多組測試案例組合在一起時，可以使用 'describe'。
- Cypress 的基本結構為命令 (command) 跟斷言 (assertion) ， command 用來告訴 Cypress 該執行的命令，讓它模擬使用者操作網頁的行為。 assertion 則是指定每個動作的預期結果。
```
describe("Todo List", () => { // Test Group
  it("Does do much!", () => { // Test Item
    expect(true).to.equal(true); // Assertion
  });

  it("create 2 items", () => {
    // Test Item
    cy.visit("https://todomvc.com/examples/vue"); // Command

    cy.get(".new-todo") // Command
      .type("todo A{enter}") // Command
      .type("todo B{enter}"); // Command

    cy.get(".todo-list li") // Command
      .should("have.length", 2); // Assertion
  });
});
```
- Cypress 提供了兩種方法讓取得 DOM 元素的方法： contains() 和 get() 。 contains() 可以取得與傳入的字串相同的元素， get() 則是依 CSS 選擇器取得元素。
```
cy.contains('Button'); //找到顯示為 "Button" 的 element
cy.get('.btn'); //找到 className 為 "btn" 的 element
```
- 相較起來 contains() 只要知道畫面上出現名稱就可以使用，是蠻方便的方法，但要注意可能發生多國語系或抓到重複字詞的問題。
### Visit a page
```
cy.visit(url);
```
- visit() 是 Cypress 提供了預設的斷言之一，透過這個語法可以造訪特定網址。
### Input data
- 使用 .type() 方法輸入文字
```
cy.get('.input').type('Hello, World'); //找到 className 為 input 的 element，並輸入 Hello, World
```
### Click button
```
cy.contains('Button').click(); //找到顯示為 "Button" 的 element 並點擊
```
### Verify result
```
cy.get('#button').should('exist') //檢查 #button 是否存在 DOM 中
cy.get('#form-submit').should('be.visible') //檢查 #form-submit 是否在 DOM 中是否可見
cy.get(".title").should("have.text", "Hello"); //找到 className 為 title 的 element ，檢查應含有 'Hello' 的 text 
```
- assertion 的方法有很多，這裡列出幾項範例，詳細請參考[官方文件](https://docs.cypress.io/guides/references/assertions#docusaurus_skipToContent_fallback)
### Custom Commands
- Cypress 也提供讓使用者自訂命令的方法，透過 Custom Commands 將使用者的操作流程自定成一個命令，並能在不同的測試案例中做使用。
- 首先在 cypress/support/e2e.js 中引入 commands.js
```
import './commands'
```
- 在 cypress/support/commands.js 檔案中以 Cypress.Commands 內的 add() 方法來新增自訂命令
```
// 登入 TideBit
Cypress.Commands.add("login", (id, password) => {
  cy.contains("登入").click();
  cy.get("#identity_email").type(id);
  cy.get("#identity_password").type(password);
  cy.contains("提交").click();
});
```
- 設定完成後就可以在測試案例的檔案中使用了
```
cy.visitTideBit();
cy.login("xxx@gmail.com", "mypassword");
```

### 困難點
1. 信箱驗證
2. 機器人驗證
3. 抓不到 elements 的問題

### Tips
- 使用 .invoke() 方法跳過開新視窗
```
cy.get(".elementClass").invoke("removeAttr", "target").click(); //抓取 className 為 elementClass 之 element ，移除 target 後點擊
```
- 如果 cypress 監測到應用程式拋出的異常，測試會直接以失敗狀態終止。可以透過以下方法禁用 Uncaught exceptions
```
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
```
## Reference
1. [Cypress Docs](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test)
2. [來開始介紹Cypress](https://ithelp.ithome.com.tw/articles/10278402)
3. [Cypress 別名與自訂命令](https://ithelp.ithome.com.tw/articles/10305878)
4. [Cypress - E2E 測試框架](https://ithelp.ithome.com.tw/articles/10282189)
5. [端對端測試 - 利用 Cypress 描述使用者操作](https://ithelp.ithome.com.tw/articles/10304373)
6. [看官方文件學習 Command & Assertion](https://medium.com/hannah-lin/cypress-2-%E7%9C%8B%E5%AE%98%E6%96%B9%E6%96%87%E4%BB%B6%E5%AD%B8%E7%BF%92%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95-76606c4420be)
7. [Cypress 基本結構](https://ithelp.ithome.com.tw/articles/10279503)
