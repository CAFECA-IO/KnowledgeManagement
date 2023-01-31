# Cypress
Cypress 是能幫助使用者直接在瀏覽器上做前端測試 npm 套件，它可以根據使用者撰寫的腳本開啟瀏覽器，並針對特定的頁面照著腳本執行動作，以達到驗證系統的目的。 Cypress 所提供的互動版面Dashboard 可以讓使用者操作想要執行的測試，以及 Time Travel 的功能，讓使用者可以退回任何動作之前，也可以藉由截圖與錄影的功能來紀錄測試的過程，使除錯更加容易。
## Install
在專案中安裝 Cypress 
```
npm install cypress
```

```
npx cypress open
```
開啟 GUI
```
npx cypress run
```
如果只需要驗證測試結果，這個指令可以讓 cypress 在終端執行測試，不另外開啟 GUI
## Write Your Testcase
### Visit a page
```
cy.visit("https://docs.cypress.io/"); //拜訪 https://docs.cypress.io/ 網頁
```
### Input data
### Click button
### Verify result

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
4. [Cypress - E2E 測試框架](https://ithelp.ithome.com.tw/articles/10282189?sc=iThomeR)
