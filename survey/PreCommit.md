![image](https://user-images.githubusercontent.com/20677913/202692524-b5cf99a7-82a2-4992-a80b-f8c449b94cea.png)
![CleanShot 2024-08-29 at 17 30 38](https://github.com/user-attachments/assets/9816b7cf-53eb-4cc2-8db3-c7f3152ca92e)


# **簡介**

## **目的**

為確保在 Typescript 專案每次 commit 前的程式碼是乾淨、符合 coding style 且能通過測試的，我們需要經過 test、format、eslint 等環節。本指南旨在提供一個完整的 pre-commit 檢查流程，確保程式碼品質和一致性。

## **檢查項目**

- 單元測試
- 程式碼格式化
- 語法和型別檢查
- 命名規則檢查

## 指南使用方法

根據專案性質選擇後端設置或前端設置，擇一即可，全端專案則依照前端設置，設置完畢後，依循完整的 pre-commit 檢查流程 ，執行過程沒有出錯就大功告成。

# 環境準備

區分為後端專案跟前端專案。前端專案以 Next.js 為例，後端專案以 Node.js 為例，但兩者有一些相通的環境設置。

確保安裝以下工具：

1. Node.js
2. npm
3. git

# Jest 單元測試設置

安裝跟 ts 相關的所有 jest 檔案：

```bash
npm install -D jest ts-jest @types/jest
```

接著，我們在專案 root 資料夾內建立一個 tests folder，然後在 folder 內建立對應的測試檔案，檔案命名需包含 test: `FILENAME.test.ts` （前端放在前端 root 資料夾，後端放在後端 root 資料夾)

在 root 資料夾裡面建立 `jest.config.js` 檔案

```jsx
/** @type {import('jest').Config} */
const config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
};

module.exports = config;

```

為了使用 test 指令讓我們可以方便進行測試，需要修改 package.json 檔案中的 script 並新增一個 test 指令

```jsx
  "scripts": {
    ...
    "test": "jest --coverage"
  },
```

在撰寫完成所有測試後，輸入以下指令並確保 test output 為 all pass

```jsx
npm run test
```

最後確認一下測試覆蓋率：

![testcoverage](https://i.imgur.com/TAZ2t7q.png)

以 js-Keccak-Laria 為例，library test branch 需要均為 100 %

# 後端 (Node.js) 設置

## **lint-staged 設置**

在 pre-commit 的時候，lint-staged 可以幫我們針對這次想要 commit 的檔案做 format 或 lint，故此處我們先安裝 lint-staged

```bash
npm install -D lint-staged
```

在 root 新增 `.lintstagedrc.json` 檔案，配置設定 prettier 、 eslint (以下為說明用所以使用 comment，記得去除 comment)

```bash
{
  "**/*.{js,jsx,ts,tsx,css}": [
    // 會直接 format
    "prettier --write",
    // eslint check
    "eslint ."
  ]
}
```

## Prettier 設置

1. 檢查命名規則，參考 [Naming covention](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/technology/coding-convention/naming-convention.md)
    1. 列出常用的命名規則
        
        ```jsx
          // 檔案、Class、命名規則 
          
          Folder、File: snake_case
          
          Class: UpperCamelCase (注意： 此處的第一個字母為大寫）
          
          Function: lowerCamelCase （注意： 此處的第一個字母為小寫） 
          
          // 變數命名規則 
          
          Parameter (Public): lowerCamelCase
          
          Parameter (Private): #lowerCamelCase
        
          Static Constant: UPPER_SNAKE_CASE
        ```
        
2. Coding style 自動檢查與更新 - 安裝使用 Prettier
    
    ```jsx
    npm install -D prettier
    ```
    
3. 依照專案性質，設置後端或前端對應的 coding style 檢驗規則之後，將「檢查特定檔案的 coding style 並更新」跟「檢查所有檔案的 coding style 並更新」加入 package.json 的 script 之後，便可執行指令將專案內所有 code 調整為符合 coding style
    
    ```jsx
    {
      "$schema": "http://json.schemastore.org/prettierrc",
      "arrowParens": "always",
      "bracketSpacing": true,
      "jsxSingleQuote": false,
      "printWidth": 100,
      "proseWrap": "always",
      "quoteProps": "as-needed",
      "semi": true,
      "singleQuote": true,
      "tabWidth": 2,
      "trailingComma": "es5",
      "useTabs": false,
    }
    
    ```
    

## ESLint 設置

在進行 eslint check 以確認我們的程式碼沒有「錯字」和「型別錯誤」。

針對「錯字」跟「型別錯誤」，我們可以安裝 eslint，透過使用它來自動檢查我們的程式碼

```jsx
npm install -D eslint eslint-plugin-prettier eslint-plugin-import @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

接著，在 root 新增 `.eslintrc.js` 檔案，如果原本有`.eslintrc.json`，則需要將檔案內容移植到 `.eslintrc.js`

```jsx
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020, // 支援 ECMAScript2020
    sourceType: 'module', // 使用 ECMAScript ****module
    ecmaFeatures: {
      jsx: true, // 支援 JSX
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
        camelcase: ['error', { properties: 'never' }],
        'object-curly-newline': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-console': 'error',
        'no-restricted-imports': ['error', { patterns: ['..*'] }],
        'tailwindcss/no-contradicting-classname': 'error',
        'tailwindcss/classnames-order': 'off',
        'tailwindcss/enforces-negative-arbitrary-values': 'error',
        'tailwindcss/enforces-shorthand': 'off',
        'tailwindcss/migration-from-tailwind-2': 'error',
        'tailwindcss/no-arbitrary-value': 'error',
        'tailwindcss/no-custom-classname': 'warn',
        'react/react-in-jsx-scope': 'off',
        'max-len': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'operator-linebreak': 'off',
        'prefer-template': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'jsx-a11y/control-has-associated-label': 'off',
        // 'arrow-parens': 'off',
        'react/self-closing-comp': 'off',
        'react/function-component-definition': 'off',
        'arrow-body-style': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        'react/jsx-curly-brace-presence': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/quotes': 'off',
        // 關閉 Airbnb 排版相關的規則
        'react/jsx-closing-bracket-location': 'off',
        'react/jsx-closing-tag-location': 'off',
        'react/jsx-curly-spacing': 'off',
        'react/jsx-equals-spacing': 'off',
        'react/jsx-first-prop-new-line': 'off',
        'react/jsx-indent': 'off',
        'react/jsx-indent-props': 'off',
        'react/jsx-max-props-per-line': 'off',
        'react/jsx-tag-spacing': 'off',
        'react/jsx-wrap-multilines': 'off',
        'no-else-return': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: false, optionalDependencies: false, peerDependencies: false },
        ],
        'no-nested-ternary': 'off',
        'react/require-default-props': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'allow',
          },
        ],
        'implicit-arrow-linebreak': 'off',
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
    camelcase: ['error', { properties: 'never' }],
    'object-curly-newline': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-console': 'error',
    'no-restricted-imports': ['error', { patterns: ['..*'] }],
    'tailwindcss/no-contradicting-classname': 'error',
    'tailwindcss/classnames-order': 'off',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'off',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-arbitrary-value': 'error',
    'tailwindcss/no-custom-classname': 'warn',
    'react/react-in-jsx-scope': 'off',
    'max-len': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'operator-linebreak': 'off',
    'prefer-template': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    // 'arrow-parens': 'off',
    'react/self-closing-comp': 'off',
    'react/function-component-definition': 'off',
    'arrow-body-style': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/quotes': 'off',
    // 關閉 Airbnb 排版相關的規則
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-equals-spacing': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-nested-ternary': 'off',
    'react/require-default-props': 'off',
    'no-eval': 'error',
    'no-new-func': 'error',
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
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: 'tsconfig.json',
      },
    },
  },
  // 讓 eslint 知道我們在使用 jest ，這樣在跑 test.js 時 eslint 就不會報 jest 關鍵字的錯誤了
  env: { browser: true, node: true, es6: true, jest: true },
};

```

此時我們可以再輸入以下指令來檢查目前的檔案

```jsx
npx eslint .
```

我們需要整理指令將其歸納到 package.json 中以方便統一管理，讓其他開發者在開發同樣的專案時能夠以相同的指令進行 eslint 檢查，故我們在 script 中新增 lint

```jsx
  "scripts": {
		...
    "lint": "eslint --ignore-path .gitignore ."
  }
```

最後，為了方便可以一次使用 check-format 、 eslint ，我們可以在 package.json 中將其整合成一個 validate 指令

```jsx
  "scripts": {
		...
    "validate": "npm run test && npm run check-format && npm run lint"
  }
```

## **Husky 設置**

將 husky 安裝到 package.json 的 devDependencies，並且 init，然後透過指令將檢查加入 pre-commit 裡 (包含 unit test & coding-style check and "不符合 coding style 的 code format")

```bash
npm install -D husky@latest
```

```jsx
npx husky init

echo "npm run test && lint-staged" > .husky/pre-commit
```

接著在輸入 git add . 和 git commit -m "your comment" 後，會出現 husky：
![husky](https://i.imgur.com/A96Qq52.png)



# 前端 (Next.js) 設置

## lint-staged 設置

在 pre-commit 的時候，lint-staged 可以幫我們針對這次想要 commit 的檔案做 format 或 lint，故此處我們先安裝 lint-staged

```bash
npm install -D lint-staged
```

- 在 root 資料夾下建立 `.lintstagedrc.json` ，讓 lint-staged 依照副檔名分開檢查

```jsx
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

在 package.json 加上 script:

```jsx
"scripts": {
    ...
    "lint": "next lint && eslint --fix --ext .js,.jsx,.ts,.tsx .",
},
```

## Prettier 設置

1. 檢查命名規則，參考 [Naming covention](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/technology/coding-convention/naming-convention.md)
    1. 列出常用的命名規則
        
        ```jsx
          // 檔案、Class、命名規則 
          
          Folder、File: snake_case
          
          Class: UpperCamelCase (注意： 此處的第一個字母為大寫）
          
          Function: lowerCamelCase （注意： 此處的第一個字母為小寫） 
          
          // 變數命名規則 
          
          Parameter (Public): lowerCamelCase
          
          Parameter (Private): #lowerCamelCase
        
          Static Constant: UPPER_SNAKE_CASE
        ```
        
2. Coding style 自動檢查與更新 - 安裝使用 Prettier
    
    ```jsx
    npm install -D prettier prettier-plugin-tailwindcss
    ```
    
3. 依照專案性質，設置後端或前端對應的 coding style 檢驗規則之後，將「檢查特定檔案的 coding style 並更新」跟「檢查所有檔案的 coding style 並更新」加入 package.json 的 script 之後，便可執行指令將專案內所有 code 調整為符合 coding style
4. Prettier 規則
    
    接著，因為我們的 coding style 與 prettier 所預設的排版不同，我們可以在 root 建立 .prettierrc 來設定我們所要的 coding style 規則，我們目前是參考 airbnb 的規則，以下附上 airbnb 的 prettier 設定檔
    
    ```jsx
    {
      "$schema": "http://json.schemastore.org/prettierrc",
      "arrowParens": "always",
      "bracketSpacing": true,
      "jsxSingleQuote": false,
      "printWidth": 100,
      "proseWrap": "always",
      "quoteProps": "as-needed",
      "semi": true,
      "singleQuote": true,
      "tabWidth": 2,
      "trailingComma": "es5",
      "useTabs": false,
      "plugins": ["prettier-plugin-tailwindcss"]
    }
    
    ```
    
    [coding style 規則檢查指令設定]
    
    我們需要將 package.json 檔案中的 script 增加一個 check-format 的設定，以找出目前不符合 coding style 的程式碼
    
    ```jsx
    "scripts": {
        ...
        "check-format": "prettier --ignore-path .gitignore --list-different \"**/*.+(js|jsx|ts|tsx|json)\"",
    },
    ```
    
    接著，我們可以使用以下指令來針對特定檔案使用 prettier 來自動更新不符合 coding style 的 code
    
    ```jsx
    npx prettier --write src/file_you_want_to_test.js
    ```
    
    若想要使用一個指令讓 prettier 自動檢查所有檔案並且更新，我們可以修改 package.json 中的 script 並增加一個 format 的指令
    
    ```jsx
    "scripts": {
        ...
        "format": "prettier --ignore-path .gitignore --write \"**/*.+(js|jsx|ts|tsx|json)\"",
    },
    ```
    
    最後執行以下指令，prettier 就會自動把 code 更新成符合我們所要的 coding style 的 code
    
    ```jsx
    npm run format
    ```
    
    

## ESLint 設置

在進行 eslint check 以確認我們的程式碼沒有「錯字」和「型別錯誤」。

針對「錯字」跟「型別錯誤」，我們可以安裝 eslint，透過使用它來自動檢查我們的程式碼

安裝 Airbnb 的 eslint 規則、跟 typescript, tailwindcss 相關的檔案

- Airbnb ESLint config 本身只有 Javascript 版本，Typescript 版本由民間([eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript))維護

```jsx
npm install -D eslint eslint-config-airbnb-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import eslint-plugin-prettier eslint-plugin-tailwindcss
```

- 接下來執行 `npx eslint . --ext .js,.jsx,.ts,.tsx` 看是否安裝成功
- 若出現以下錯誤，則執行 `npm i eslint-config-airbnb` ，然後再執行一次 `npx eslint . --ext .js,.jsx,.ts,.tsx`
    
    ```jsx
    Oops! Something went wrong! :(
    
    ESLint: 8.56.0
    
    ESLint couldn't find the config "airbnb" to extend from. Please check that the name of the config is correct.
    
    The config "airbnb" was referenced from the config file in "/Users/shirley/programming/cafeca/ASICEX/.eslintrc.js".
    
    If you still have problems, please stop by <https://eslint.org/chat/help> to chat with the team.
    
    ```
    
- 如果專案是透過 `npx create-next-app folder_name` 創建的，可能會有地方不符合 Airbnb ESLint 規則（除錯過程可以參考 [issue](https://github.com/CAFECA-IO/ASICEX/issues/28#issuecomment-1869395533) 跟 [PR](https://github.com/CAFECA-IO/ASICEX/pull/84)）

接著，在 root 新增 `.eslintrc.js` 檔案，如果原本有`.eslintrc.json`，則需要將檔案內容移植到 `.eslintrc.js`

```jsx
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020, // 支援 ECMAScript2020
    sourceType: 'module', // 使用 ECMAScript ****module
    ecmaFeatures: {
      jsx: true, // 支援 JSX
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
        camelcase: ['error', { properties: 'never' }],
        'object-curly-newline': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-console': 'error',
        'no-restricted-imports': ['error', { patterns: ['..*'] }],
        'tailwindcss/no-contradicting-classname': 'error',
        'tailwindcss/classnames-order': 'off',
        'tailwindcss/enforces-negative-arbitrary-values': 'error',
        'tailwindcss/enforces-shorthand': 'off',
        'tailwindcss/migration-from-tailwind-2': 'error',
        'tailwindcss/no-arbitrary-value': 'error',
        'tailwindcss/no-custom-classname': 'warn',
        'react/react-in-jsx-scope': 'off',
        'max-len': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'operator-linebreak': 'off',
        'prefer-template': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'jsx-a11y/control-has-associated-label': 'off',
        // 'arrow-parens': 'off',
        'react/self-closing-comp': 'off',
        'react/function-component-definition': 'off',
        'arrow-body-style': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        'react/jsx-curly-brace-presence': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/quotes': 'off',
        // 關閉 Airbnb 排版相關的規則
        'react/jsx-closing-bracket-location': 'off',
        'react/jsx-closing-tag-location': 'off',
        'react/jsx-curly-spacing': 'off',
        'react/jsx-equals-spacing': 'off',
        'react/jsx-first-prop-new-line': 'off',
        'react/jsx-indent': 'off',
        'react/jsx-indent-props': 'off',
        'react/jsx-max-props-per-line': 'off',
        'react/jsx-tag-spacing': 'off',
        'react/jsx-wrap-multilines': 'off',
        'no-else-return': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: false, optionalDependencies: false, peerDependencies: false },
        ],
        'no-nested-ternary': 'off',
        'react/require-default-props': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'allow',
          },
        ],
        'implicit-arrow-linebreak': 'off',
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
    camelcase: ['error', { properties: 'never' }],
    'object-curly-newline': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-console': 'error',
    'no-restricted-imports': ['error', { patterns: ['..*'] }],
    'tailwindcss/no-contradicting-classname': 'error',
    'tailwindcss/classnames-order': 'off',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'off',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-arbitrary-value': 'error',
    'tailwindcss/no-custom-classname': 'warn',
    'react/react-in-jsx-scope': 'off',
    'max-len': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'operator-linebreak': 'off',
    'prefer-template': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    // 'arrow-parens': 'off',
    'react/self-closing-comp': 'off',
    'react/function-component-definition': 'off',
    'arrow-body-style': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/quotes': 'off',
    // 關閉 Airbnb 排版相關的規則
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-equals-spacing': 'off',
    'react/jsx-first-prop-new-line': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-max-props-per-line': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-nested-ternary': 'off',
    'react/require-default-props': 'off',
    'no-eval': 'error',
    'no-new-func': 'error',
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
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: 'tsconfig.json',
      },
    },
  },
  // 讓 eslint 知道我們在使用 jest ，這樣在跑 test.js 時 eslint 就不會報 jest 關鍵字的錯誤了
  env: { browser: true, node: true, es6: true, jest: true },
};

```

**調整 tsconfig.json 內容：**

```jsx
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "downlevelIteration": true, // Info: (20240710 - Murky) for Map<T, U> loop
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
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*", "prisma/*"],
      "@package": ["package.json"],
      "@next/third-parties/*": ["node_modules/@next/third-parties/dist/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "tailwind.config.ts",
    "scripts/update_version.js"
  ],
  "exclude": ["node_modules"]
}

```

**在 root 資料夾底下新增檔案 .tsconfig.eslint.json**

```jsx
{
  "extends": ["./tsconfig.json"],
  "include": ["**/*.ts", "**/*.tsx", "*.ts", "**/*.js", "**/*.jsx", "*.js"]
}
```

此時我們可以再輸入以下指令來檢查目前的檔案

```jsx
npx eslint .
```

我們需要整理指令將其歸納到 package.json 中以方便統一管理，讓其他開發者在開發同樣的專案時能夠以相同的指令進行 eslint 檢查，故我們在 script 中新增 lint

```jsx
  "scripts": {
		...
	  "lint": "next lint && eslint --fix --ext .js,.jsx,.ts,.tsx .",
  }
```

最後，為了方便可以一次使用 check-format 、 eslint ，我們可以在 package.json 中將其整合成一個 validate 指令

```jsx
  "scripts": {
		...
    "validate": "npm run test && npm run check-format && npm run lint"
  }
```

- 檢驗是否設置成功
    - 設置完成，可以執行指令 `npm run lint` 或 `npx eslint .` 看是否符合 eslint 規則
    - 若有 error ，修掉 error 後，使用vs code source control plugin，需 unstage 已經 staged 的檔案變化後再 pre-commit；使用 CLI 則直接 `git add .` 將新檔案變化 staged 就能 pre-commit
    - 備註: [enforces-negative-arbitrary-values](https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/docs/rules/enforces-negative-arbitrary-values.md) 不是檢查是否使用 negative value (e.g. margin) ，而是檢查是否依照格式使用 negative value
        - `m-[-5px]` ✅
        - `m-[5px]` ❌

## **Husky 設置**

將 husky 安裝到 package.json 的 devDependencies，並且 init，然後透過指令將檢查加入 pre-commit 裡 (包含 unit test & coding-style check and "不符合 coding style 的 code format")

```bash
npm install -D husky@latest
```

```jsx
npx husky init

echo "npm run test && lint-staged" > .husky/pre-commit
```

接著在輸入 git add . 和 git commit -m "your comment" 後，會出現 husky：

![husky](https://i.imgur.com/A96Qq52.png)


[可能會遇到的問題] 如果在 commit 時並未出現 husky ， 需要卸載並重新下載 husky@4 和 husky ，以確保可以取得更新後可以使用的 husky

```bash
npm uninstall husky
npm install -D husky
```

# 完整的 pre-commit 檢查流程

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
    or
        
        ```
        git pull origin develop
        
        ```
        
        ```
        git pull origin main
        
        ```
        
2. 檢查 Naming covention，參考 [Naming covention](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/technology/coding-convention/naming-convention.md)
3. 確保 console.log 有正確刪除，若要 print 出結果來檢查，我們可以使用 Logger
    
    若使用 vscode，可以使用左方的 search 功能搜尋所有 console.log
    
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

# [optional] 與 Work Guidelines 整合的 pre-commit

- 依照 [development-environment](https://github.com/CAFECA-IO/WorkGuidelines/blob/main/newbie/development-environment.md) 另外設置 pre-commit，需做以下調整來避免衝突
- 把 `.prettierrc` 改成 `.prettierrc.yaml`
    
    ```jsx
    $schema: <http://json.schemastore.org/prettierrc>
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
  - repo: <https://github.com/pre-commit/pre-commit-hooks>
    rev: v4.5.0
    hooks:
      - id: check-yaml
      - id: check-json
      - id: check-xml
      - id: end-of-file-fixer
      - id: trailing-whitespace
  - repo: <https://github.com/pre-commit/mirrors-prettier>
    rev: 'v4.0.0-alpha.8'
    hooks:
      - id: prettier
        args: ['--config', '.prettierrc.yml']

```

- 之後每次開發，在更改檔案之後，執行指令 `pre-commit run --all-files` ，如果排版不符合規定，會先出現提示訊息代表 pre-commit 透過 yaml 幫忙排版，之後再執行一次 `pre-commit run --all-files` 確保所有步驟都成功，就能 commit

# [optional] 修改 prettier 規則的工具

如果未來有做大幅的 coding style 調整，我們想要自定義規則，我們可以使用 [prettier playground](https://prettier.io/playground/)，並勾選頁面左方的 options 來產出符合我們所要的 coding style 的 .prettierrc 檔案
![prettierplayground](https://i.imgur.com/KyK4pKS.png)

# Reference

jest 官網： https://jestjs.io/docs/configuration

jest: https://titangene.github.io/article/jest-typescript.html

eslint and prettier: https://ithelp.ithome.com.tw/users/20130284/ironman/3612

airbnb config: https://www.npmjs.com/package/prettier-airbnb-config

eslint settings: https://pjchender.dev/webdev/note-eslint/

React eslint settings: https://ithelp.ithome.com.tw/articles/10215259

Vue eslint settings: https://pjchender.blogspot.com/2019/07/vue-vue-style-guide-eslint-plugin-vue.html

husky: https://typicode.github.io/husky/#/

airbnb ESLint config: https://github.com/iamturns/eslint-config-airbnb-typescript




