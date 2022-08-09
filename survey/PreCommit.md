# Pre commit 前的準備

## Summary:
為了確保 Commit 前的 code 是乾淨、符合 coding style 且能通過測試的，我們需要經過 format 、 eslint 、 test 等環節，以確認在 commit 前我們的 code 是符合規範的，而此研究就是針對 Pre Commit 的檢查步驟進行整理，並且提供一個比較方便查閱的檢查步驟。

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

2. Coding style 檢查 - 安裝使用 Prettier 

    為了自動檢查排版相關的 coding style 問題，我們可以使用 npm 安裝 prettier 套件，而此套件可以幫我們揪出不符合 coding style 的排版問題。
    
    ```
    npm install --dev-dependency prettier
    ```
    接著，我們可以使用以下指令來針對特定檔案使用 prettier 來檢查並自動更新
    ```
    // it will print the formatted code
    npx prettier --write src/file_you_want_to_test.js
    ```
    若想要使用一個指令讓 prettier 自動檢查所有檔案並且更新，我們可以修改 package.json 中的 script
    ```
    "scripts": {
        ...
        "format": "prettier --write \"**/*.+(js|ts|json)\""
    },
    ```


## eslint 

## test


## Reference
