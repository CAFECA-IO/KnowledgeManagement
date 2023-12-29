![image](https://user-images.githubusercontent.com/20677913/202692524-b5cf99a7-82a2-4992-a80b-f8c449b94cea.png)

# Pre commit 前的準備

## Summary:
為了確保 Commit 前的 code 是乾淨、符合 coding style 且能通過測試的，我們需要經過 test 、 format 、 eslint  等環節，以確認在 commit 前我們的 code 是符合規範的，而此研究就是針對 Pre Commit 的檢查步驟進行整理，並且提供一個比較方便查閱的檢查步驟。

## 環境
目前測試是針對 node.js 後端，支援 js、ts (備註： unit test 以 ts 為例），若要使用 react、vue 等前端框架需要加上一些 plugin，詳細資訊可以參考 reference 的 React eslint settings、Vue eslint settings。在使用 Git hook 前，請確保有下載 eslint 和 prettier，若有出現 eslint 與 prettier 衝突的情形可以參考此文件的 eslint 和 prettier 設定。
（前端專案：[補充 Tailwind CSS 設置](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/survey/PreCommit.md#tailwind-css-%E7%9A%84%E8%A8%AD%E7%BD%AE)、[補充 Airbnb ESLint config](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/survey/PreCommit.md#eslint-config-of-airbnb)）

[注意]：以下步驟會直接進行 pre-commit，若只是需要檢驗目前程式碼是否符合 coding style，請查閱以下的 Format 和 eslint 內容並執行 All pre-commit test 的 step 2 ~ step 5
## Git Hook 
為了要讓檢查時機點和對應腳本有個明確的管控，我們可以使用 Git Hooks 來針對以下三種測試（ Test、Format、 eslint ) 進行對應腳本的註冊，而 Git 觸發這些 hooks 時就會執行這些腳本去做對應的處理。

### lint-staged 整合 format 、 lint
在 pre-commit 的時候，lint-staged 可以幫我們針對這次想要 commit 的檔案做 format 或 lint，故此處我們先安裝 lint-staged
```
npm install --save-dev lint-staged
```
在 root 新增 .lintstagedrc 檔案，配置設定 prettier 、 eslint (以下為說明用所以使用 comment，記得去除 comment)
```
{
  "**/*.{js,jsx,ts,tsx,css}": [
    // 會直接 format
    "prettier --write",
    // eslint check
    "eslint ."
  ]
}
```

### Husky - Node.js 的 Git Hooks 工具
```
npm install -D husky@4
npm install -D husky
```
在 package.json 新增 husky property，並在 hook 裡面新增 "pre-commit" (包含 unit test & coding-style check and "不符合 coding style 的 code format")
```
  ...
  "husky": {
    "hooks": {
      "pre-commit": "npm run test && lint-staged"
    }
  },
  ...
```
接著在輸入 git add . 和 git commit -m "your comment" 後，會出現 husky：
![](https://i.imgur.com/A96Qq52.png)

[可能會遇到的問題]
如果在 commit 時並未出現 husky ， 需要卸載並重新下載 husky@4 和 husky ，以確保可以取得更新後可以使用的 husky
```
npm uninstall husky
npm install -D husky@4
npm install -D husky
```
若再次 commit 後看到 husky 被啟動並執行 pre-commit 指令，表示有執行成功

## Test
在正式 commit 之前，我們需要針對 code 去撰寫我們的 unit test 檔案，此處以 Jest 為例：

我們先安裝 jest ：
```
npm install -D jest
```

若要測試 typescript，我們需要安裝 ts 相關的所有 jest 檔案
```
npm install -D jest ts-jest @types/jest
```

接著，我們在專案 root 資料夾內建立一個 tests folder，然後在 folder 內建立對應的測試檔案 （前端放在前端 root 資料夾，後端放在後端 root 資料夾)

[此處以 ts 為例子] 
在 run 測試以前，我們先在 root 資料夾裡面建立一個 jest.config.js 檔案，並且修改設置 (若沒有需要使用 ts 請參閱 [jest config 官網](https://jestjs.io/docs/configuration))
```
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  coverageDirectory: 'coverage',
  // for ts
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

    為了自動檢查排版相關的 coding style 問題，我們可以使用 npm 安裝 prettier 套件，而此套件可以幫我們找出不符合 coding style 的 code
    
    ```
    npm install --dev-dependency prettier
    ```
    接著，因為我們的 coding style 與 prettier 所預設的排版不同，我們可以在 root 建立 .prettierrc 來設定我們所要的 coding style 規則，我們目前是參考 airbnb 的規則，以下附上 airbnb 的 prettier 設定檔
    ```
	{
	    "$schema": "http://json.schemastore.org/prettierrc",
	    "arrowParens": "avoid",
	    "bracketSpacing": true,
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
    如果未來有做大幅的 coding style 調整，我們想要自定義規則，我們可以使用 [prettier playground](https://prettier.io/playground/)，並勾選頁面左方的 options 來產出符合我們所要的 coding style 的 .prettierrc 檔案
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
        "format": "prettier --ignore-path .gitignore --write \"**/*.+(js|ts|json)\""
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

如果要使用 ts，需要安裝 ts 相關的 plugin
```
 npm install @typescript-eslint/eslint-plugin@latest --save-dev
 npm install @typescript-eslint/parser --save-dev
```

接著，在 root 新增 .eslintrc.js 檔案

承上，我們需要來修改 .eslintrc.js 檔案內容為以下的 code 來讓 eslint support es6 語法 和 ts
```
module.exports = {
  parserOptions: {
    ecmaVersion: 2020, // 支援 ECMAScript2020
    sourceType: 'module', // 使用 ECMAScript ****module
    ecmaFeatures: {
      jsx: true, // 支援 JSX
      experimentalObjectRestSpread: true,
    },
  },
  // 加上 ts 相關規則
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
    },
  ],
  extends: ['plugin:import/typescript'],
  // 加上 no console log 規則
  rules: {
    'no-console': 'error'
  },
  // 整合 prettier 和解決 prettier 衝突問題
  plugins: ['prettier'],
};


```
此時我們可以再輸入以下指令來檢查目前的檔案
```
npx eslint .
```
這時可能會發現 terminal 顯示缺乏 pkg

因此我們需要再下以下指令
```
npm install eslint-plugin-import@latest --save-dev
npm install eslint-plugin-prettier@latest --save-dev
```
然而，我們需要整理指令將其歸納到 package.json 中以方便統一管理，讓其他開發者在開發同樣的專案時能夠以相同的指令進行 eslint 檢查，故我們在 script 中新增 lint
```
  "scripts": {
		...
    "lint": "eslint --ignore-path .gitignore ."
  }
```
最後，為了方便可以一次使用 check-format 、 eslint ，我們可以在 package.json 中將其整合成一個 validate 指令
```
  "scripts": {
		...
    "validate": "npm run test && npm run check-format && npm run lint"
  }
```

## All pre-commit test
1. Git branch 檢查
   - 檢查目前的 branch 為何？
      ```
      git branch -a
      ```
   - switch 到正確的分支
      ```
      git checkout feature/your_branch
      ``` 
   - 確認 pull 成最新版本（ branch 為 develop or main ）
      ```
      git pull origin develop
      ```
      or
      ```
      git pull origin main
      ```
2. 檢查 Naming covention
    參考 [Naming covention](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/technology/coding-convention/naming-convention.md)

3. 確保 console.log 有正確刪除，若要 print 出結果來檢查，我們可以使用 Logger

   若使用 vscode，可以使用左方的 search 功能搜尋所有 console.log

    ![](https://i.imgur.com/YijGFdH.png)

4. 先進行檢驗 - unit-test & check-format & eslint
    ```
    // 確保你的 unit test 會通過，且測試覆蓋率有維持一定標準
    // 確保你的 coding style 沒問題
    npm run validate
    ```
5. 若有出現 prettier 報錯，可以使用以下 command 一次修正
    ```
    npm run format
    ```
6. 進行 Pre-commit (unit test & prettier & eslint)
    ```
    git add .
    git commit -m "your comment"
    ```
7. git hook 執行 pre-commit 檢查拼字、型別錯誤、console.log 
8. 若未看到出錯警訊，即完成 commit

## Tailwind CSS 的設置

為了讓 Tailwind CSS 能通過 pre-commit 需做以下設置，讓 `.css` 跟 `.js` `.ts` 依照各自的規則檢查

需設置 lint-staged 跟 eslint 跟 prettier

- 安裝 eslint 跟 prettier plugin

`npm install -D eslint-plugin-tailwindcss prettier-plugin-tailwindcss`

- 在 `.eslintrc.js`

```
...
extends: [..., 'plugin:tailwindcss/recommended'],
...
rules: {
  ...
  'tailwindcss/no-contradicting-classname': 'error',
  'tailwindcss/classnames-order': 'off',
  'tailwindcss/enforces-negative-arbitrary-values': 'error',
  'tailwindcss/enforces-shorthand': 'off',
  'tailwindcss/migration-from-tailwind-2': 'error',
  'tailwindcss/no-arbitrary-value': 'error',
  'tailwindcss/no-custom-classname': 'error',
},
...
settings: {
  tailwindcss: {
    // These are the default values but feel free to customize
    callees: ['classnames', 'clsx', 'ctl'],
    config: 'tailwind.config.js',
    cssFiles: ['**/*.css', '!**/node_modules', '!**/.*', '!**/dist', '!**/build'],
    cssFilesRefreshRate: '5_000',
    removeDuplicates: true,
    whitelist: [],
  },
},
...
```

- 把 `.lintstagedrc` 改成 `.lintstagedrc.json` 並更改內容，讓 lint-staged 依照副檔名分開檢查

```
{
  "/*.+(js|jsx|ts|tsx)": [
  "./node_modules/.bin/eslint --fix",
  "./node_modules/.bin/prettier --write",
  "git add"
  ],
  "/*.+(css)": [
  "./node_modules/.bin/eslint/tailwindcss --fix",
  "./node_modules/.bin/prettier --write",
  "git add"
  ]
}
```
- 設置完成，可以執行指令 `npm run lint` 或 `npx eslint .` 看是否符合 eslint 規則 
- 若有 error ，修掉 error 後，使用vs code source control plugin，需 unstage 已經 staged 的檔案變化後再 pre-commit；使用 CLI 則直接 `git add .` 將新檔案變化 staged 就能 pre-commit
- 備註: [enforces-negative-arbitrary-values](https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/enforces-negative-arbitrary-values.md) 不是檢查是否使用 negative value (e.g. margin) ，而是檢查是否依照格式使用 negative value 
  - `m-[-5px]` ✅ 
  - `-m-[5px]` ❌ 


## ESLint config of Airbnb

- Airbnb ESLint config 本身只有 Javascript 版本，Typescript 版本的是民間高手維護的
- 以下為 React with Typescript 專案設置 Airbnb ESLint config 的流程跟注意事項，指令都在專案的根目錄下執行
- 安裝 eslint-config-airbnb-typescript 跟相關 dependencies，需注意 package.json 裡面標注的版本是否與 [eslint-config-airbnb-typescript](https://github.com/iamturns/eslint-config-airbnb-typescript) 推薦的相符，如果前面已經裝過一樣的 dependencies ，需執行以下步驟；如果沒有跟前面步驟重複，則直接跳到第三步
    1. 需要先刪除 package.json 的對應 dependencies 
    2. 刪掉 node_modules 資料夾後，重新安裝，執行指令 `npm install`
    3. 執行以下指令
    
    ```jsx
    npm install eslint-config-airbnb-typescript \
                @typescript-eslint/eslint-plugin@^6.0.0 \
                @typescript-eslint/parser@^6.0.0 \
                --save-dev
    ```
    
- 接下來執行 `npx eslint . --ext .js,.jsx,.ts,.tsx` 看是否安裝成功
- 若出現以下錯誤，則執行 `npm i eslint-config-airbnb` ，然後再執行一次 `npx eslint . --ext .js,.jsx,.ts,.tsx`
    
    ```jsx
    Oops! Something went wrong! :(
    
    ESLint: 8.56.0
    
    ESLint couldn't find the config "airbnb" to extend from. Please check that the name of the config is correct.
    
    The config "airbnb" was referenced from the config file in "/Users/shirley/programming/cafeca/ASICEX/.eslintrc.js".
    
    If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.
    ```
    
- 如果專案是透過 `npx create-next-app folder_name` 創建的，可能會有地方不符合 Airbnb ESLint 規則（除錯過程可以參考 [issue](https://github.com/CAFECA-IO/ASICEX/issues/28#issuecomment-1869395533) 跟 [PR](https://github.com/CAFECA-IO/ASICEX/pull/84)），其中根據開發經驗，關閉兩條規則
    1. React JSX props 不准用 spread operator 的規則，理由是 Next.js 專案中的 _app.tsx 需要用這個方式處理 components，並且 spread operator 用在元件上可以避免“因為傳入意料之外的資料而引起的網站 crash”
    2. { } 需要換行的規則，理由若需符合此規則，需將 `printWidth` 改成 50，為了沿用之前 `.pretterrc` 的程式碼寬度 100 的設定，而關掉此規則

### .eslintrc.js (加上 TailwindCSS 相關設定)

```jsx
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020, 
    sourceType: 'module', 
    ecmaFeatures: {
      jsx: true, 
      experimentalObjectRestSpread: true,
    },
    project: './tsconfig.eslint.json',
  },
  // 加上 ts 相關規則
  overrides: [
    {
      files: ['*.ts', '*.tsx', '**/*.ts', '**/*.tsx'],
      extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        'object-curly-newline': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-console': 'error',
        'tailwindcss/no-contradicting-classname': 'error',
        'tailwindcss/classnames-order': 'off',
        'tailwindcss/enforces-negative-arbitrary-values': 'error',
        'tailwindcss/enforces-shorthand': 'off',
        'tailwindcss/migration-from-tailwind-2': 'error',
        'tailwindcss/no-arbitrary-value': 'error',
        'tailwindcss/no-custom-classname': 'warn',
      },
    },
  ],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:tailwindcss/recommended',
    'plugin:@next/next/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'no-console': 'error',
    'tailwindcss/no-contradicting-classname': 'error',
    'tailwindcss/classnames-order': 'off',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'off',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-arbitrary-value': 'error',
    'tailwindcss/no-custom-classname': 'warn',
    'object-curly-newline': 'off',
    'react/jsx-props-no-spreading': 'off',
  },

  // 整合 prettier 和解決 prettier 衝突問題
  plugins: ['tailwindcss', '@babel', 'prettier', 'react'],
  settings: {
    tailwindcss: {
      // These are the default values but feel free to customize
      callees: ['classnames', 'clsx', 'ctl'],
      config: 'tailwind.config.ts',
      cssFiles: ['**/*.css', '!**/node_modules', '!**/.*', '!**/dist', '!**/build'],
      cssFilesRefreshRate: '5_000',
      removeDuplicates: true,
      whitelist: [],
    },
    react: {
      version: 'detect',
    },
  },
  // 讓 eslint 知道我們在使用 jest ，這樣在跑 test.js 時 eslint 就不會報 jest 關鍵字的錯誤了
  env: { browser: true, node: true, es6: true, jest: true },
};
```

### .tsconfig.json

```jsx
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### .tsconfig.eslint.json

```jsx
{
  "extends": ["./tsconfig.json"],
  "include": ["**/*.ts", "**/*.tsx", "*.ts", "**/*.js", "**/*.jsx", "*.js"]
}
```

## 搭配 Work Guidelines 的 pre-commit 

- 依照 [development-environment](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/newbie/development-environment.md) 另外設置 pre-commit，需做以下調整來避免衝突

- 把 `.prettierrc` 改成 `.prettierrc.yaml`
    
    ```jsx
    $schema: http://json.schemastore.org/prettierrc
    arrowParens: avoid
    bracketSpacing: true
    jsxSingleQuote: false
    printWidth: 100
    proseWrap: always
    quoteProps: as-needed
    semi: true
    singleQuote: true
    tabWidth: 2
    trailingComma: es5
    useTabs: false
    plugins:
      - prettier-plugin-tailwindcss
    ```
    
- 更改 `.pre-commit-config.yaml` ，讓我們自己的排版規則取代 `pretty-format-json`
```jsx
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: check-yaml
      - id: check-json
      - id: check-xml
      - id: end-of-file-fixer
      - id: trailing-whitespace
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: 'v4.0.0-alpha.8'
    hooks:
      - id: prettier
        args: ['--config', '.prettierrc.yml']
```
- 之後每次開發，在更改檔案之後，執行指令 `pre-commit run --all-files` ，如果排版不符合規定，會先出現提示訊息代表 pre-commit 透過 yaml 幫忙排版，之後再執行一次 `pre-commit run --all-files` 確保所有步驟都成功，就能 commit 


## Reference

jest 官網： https://jestjs.io/docs/configuration

jest: https://titangene.github.io/article/jest-typescript.html

eslint and prettier: https://ithelp.ithome.com.tw/users/20130284/ironman/3612

airbnb config: https://www.npmjs.com/package/prettier-airbnb-config

eslint settings: https://pjchender.dev/webdev/note-eslint/

React eslint settings: https://ithelp.ithome.com.tw/articles/10215259

Vue eslint settings: https://pjchender.blogspot.com/2019/07/vue-vue-style-guide-eslint-plugin-vue.html

husky: https://typicode.github.io/husky/#/

airbnb ESLint config: https://github.com/iamturns/eslint-config-airbnb-typescript




