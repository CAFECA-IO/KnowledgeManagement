# Pre commit 前的準備

## Summary:
為了確保 Commit 前的 code 是乾淨、符合 coding style 且能通過測試的，我們需要經過 test 、 format 、 eslint  等環節，以確認在 commit 前我們的 code 是符合規範的，而此研究就是針對 Pre Commit 的檢查步驟進行整理，並且提供一個比較方便查閱的檢查步驟。

## test
在正式 commit 之前，我們需要針對 code 去撰寫我們的 unit test 檔案，此處以 Jest 為例：

我們先安裝 jest ：
```
npm install -D jest
```

若要測試 typescript，我們需要安裝 ts 相關的所有 jest 檔案
```
npm install -D jest ts-jest @types/jest
```

接著，我們在 root 資料夾內建立一個 tests folder，然後在 folder 內建立對應的測試檔案

在 run 測試以前，我們先在 root 資料夾裡面建立一個 jest.config.json 檔案，並且修改設置
```
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
};
```
為了使用 test 指令讓我們可以方便進行測試，需要修改 package.json 檔案中的 script 並新增一個 test 指令
```
  "scripts": {
    ...
    "test": "jest --coverage"
  },
```

在撰寫完成所有測試後，輸入以下指令並確保 test output 為 all pass
```
npm run test
```

最後確認一下測試覆蓋率：

![](https://i.imgur.com/TAZ2t7q.png)

以 js-Keccak-Laria 為例，library test branch 需要均為 100 %

## Format
### 目標： 
在進行 Format 時，我們需要確認我們的程式碼是符合命名規則且符合 coding style 的。
### 檢查步驟和方法：
1. 檢查命名規則
參考 [Naming covention](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/technology/coding-convention/naming-convention.md)

    - 在此處列出比較常用的幾個命名規則：
        ```
          // 檔案、Class、命名規則 
          
          Folder、File: snake_case
          
          Class: UpperCamelCase (注意： 此處的第一個字母為大寫）
          
          Function: lowerCamelCase （注意： 此處的第一個字母為小寫） 
          
          // 變數命名規則 
          
          Parameter (Public): lowerCamelCase
          
          Parameter (Private): _lowerCamelCase

          Static Constant: UPPER_SNAKE_CASE
        ```

2. Coding style 自動檢查與更新 - 安裝使用 Prettier 

    為了自動檢查排版相關的 coding style 問題，我們可以使用 npm 安裝 prettier 套件，而此套件可以幫我們找出不符合 coding style 的 code。
    
    ```
    npm install --dev-dependency prettier
    ```
    接著，因為我們的 coding style 與 prettier 所預設的排版不同，我們可以在 root 建立 .prettierrc 來設定我們所要的 coding style 規則，以下附上 airbnb 的 prettier 設定檔
    ```
    {
        "$schema": "http://json.schemastore.org/prettierrc",
        "arrowParens": "avoid",
        "bracketSpacing": false,
        "jsxBracketSameLine": false,
        "jsxSingleQuote": false,
        "printWidth": 100,
        "proseWrap": "always",
        "quoteProps": "as-needed",
        "semi": true,
        "singleQuote": true,
        "tabWidth": 2,
        "trailingComma": "es5",
        "useTabs": false
    }
    ```   
    如果想要自定義規則，我們可以使用 [prettier playground](https://prettier.io/playground/)，並勾選頁面左方的 options 來產出符合我們所要的 coding style 的 .prettierrc 檔案
    ![](https://i.imgur.com/KyK4pKS.png)
    
    [coding style 規則檢查指令設定] 
    
    我們需要將 package.json 檔案中的 script 增加一個 check-format 的設定，以找出目前不符合 coding style 的程式碼
    ```
    "scripts": {
        ...
        "check-format": "prettier --ignore-path .gitignore --list-different \"**/*.+(js|ts|json)\"",
    },
    ```
    
    接著，我們可以使用以下指令來針對特定檔案使用 prettier 來自動更新不符合 coding style 的 code
    ```
    npx prettier --write src/file_you_want_to_test.js
    ```
    若想要使用一個指令讓 prettier 自動檢查所有檔案並且更新，我們可以修改 package.json 中的 script 並增加一個 format 的指令
    ```
    "scripts": {
        ...
        "format": "prettier --write \"**/*.+(js|ts|json)\""
    },
    ```

    最後執行以下指令，prettier 就會自動把 code 更新成符合我們所要的 coding style 的 code
    ```
    npm run format
    ```
 
## eslint 
### 目標： 
在進行 eslint check 以確認我們的程式碼沒有「錯字」和「型別錯誤」。

針對「錯字」跟「型別錯誤」，我們可以安裝 eslint，透過使用它來自動檢查我們的程式碼
```
npm install --dev-dependency eslint
```
接著，在 root 新增 .eslintrc 檔案

承上，我們需要來修改 .eslintrc 檔案內容為以下的 code 來讓 eslint support es6 語法
```
"parserOptions": {
    "ecmaVersion": 2019, // 支援 ECMAScript2019
    "sourceType": "module", // 使用 ECMAScript ****module 
    "ecmaFeatures": {
      "jsx": true // 支援 JSX
    }
}
```
此時我們可以再輸入以下指令來檢查目前的檔案
```
npx eslint .
```


## All pre-commit test
1. 檢查 unit test 測試結果
```
npm run test
```
測試項結果需要為 all pass
2. 檢查 Naming covention
參考 [Naming covention](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/technology/coding-convention/naming-convention.md)

3. 檢查 coding style 並修正
```
npm run check-format
```
修正 code 讓全部檔案都符合 coding style
```
npm run format
```
4. 檢查拼字和型別錯誤
```
npx eslint .
```
5. 確保 console.log 有正確刪除，若要 print 出結果來檢查，我們可以使用 Logger

![](https://i.imgur.com/YijGFdH.png)

## Reference
jest: https://titangene.github.io/article/jest-typescript.html
eslint and prettier: https://ithelp.ithome.com.tw/users/20130284/ironman/3612
airbnb config: https://www.npmjs.com/package/prettier-airbnb-config
