# Cypress

## Install
```
npm install cypress

npx cypress open //開啟 GUI
npx cypress run //在終端執行測試
```

## Write Your Testcase
### Visit a page
### Input data
### Click button
### Verify result

### 困難點
1. 信箱驗證
2. 機器人驗證

### 技巧
- 跳過開新視窗的語法
```
.invoke("removeAttr", "target")
```
## Reference
1. [Cypress Docs](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test)
