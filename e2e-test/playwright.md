# Playwright

## 概述

Playwright Test was created specifically to accommodate the needs of end-to-end testing. Playwright supports all modern rendering engines including Chromium, WebKit, and Firefox. Test on Windows, Linux, and macOS, locally or on CI, headless or headed with native mobile emulation of Google Chrome for Android and Mobile Safari.

### Installing Playwright

[Installing Playwright](<https://playwright.dev/docs/intro>)

[Playwright VS Code Extension](https://playwright.dev/docs/getting-started-vscode)
可以大幅降低使用門檻及增加效率！

## 研究目的

欲進行TideBit DeFi自動化測試，並且希望可以在不同瀏覽器上進行測試，並且可以在不同平台上進行測試。
先前使用Cypress時遇到無法操作MetaMask的情況，雖然現在有其他解決方案如Synpress可以解決，但是考量到整體未來維護以及測試完整度，希望使用Playwright來進行測試。

## 研究結論

目前研究下來Playawright主要有幾個優點：

1. 利用[Codegen](<https://playwright.dev/docs/codegen-intro>)或是[VScode](<https://playwright.dev/docs/getting-started-vscode>)插件可以大幅降低撰寫測試的時間，直接選取元素而不用比對元素的屬性，並且可以直接在VScode上執行測試，大幅提升效率。

2. 支援[chrome-extension](https://playwright.dev/docs/chrome-extensions)，可以直接操作MetaMask，如果覺得需要寫太多東西也可再引入[synpress](<https://github.com/synpress-io/synpress-examples>)來進行操作。

3. 可以開啟[Trace viewer](https://playwright.dev/docs/trace-viewer)自動產生測試報告，大幅降低測試時間，並且可以在CI上進行測試，出問題時可以自動截圖報錯。

- 若未來如需延伸CI/CD和API測試也有對應的Docs參考如[Mock APIs](https://playwright.dev/docs/mock)、[docker](<https://playwright.dev/docs/docker>)、[CI](<https://playwright.dev/docs/ci>)等等。

## 使用技巧

推薦的**資料夾結構**如下：

```

└── Project
    ├── .auth
    ├── fixtures.ts
    ├── i18n.ts
    ├── locales
    ├── metamask-chrome-11.0.0
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── pages
    ├── playwright-report
    ├── playwright.config.ts
    ├── test-results
    ├── tests
    └── tsconfig.json

```

首先是`.auth`，這裡面用來放置一些敏感資料，例如帳號密碼等等，可以在`.gitignore`中忽略，並且在[global setup](https://playwright.dev/docs/test-global-setup-teardown)中引入，但由於本次目標是需要操縱Metamask，而Playwright的解決方法是將登入狀態（例如JWT）儲存，因此不適合用此方式，解決方式是利用Page Object Models 引入，但是缺點是要在不同測試中重複登入。

接著是`fixtures.ts`，這裡面放置一些共用的function，例如登入、登出、切換語系等等，本次測試參考[官方Chrome extension](https://playwright.dev/docs/chrome-extensions) 的設置，將所有測試一開始都先加載Metamask。

`i18n.ts`和`locales`是用來切換語系的，可以參考[官方i18n](https://www.i18next.com/overview/getting-started)的設置，但是目前還沒有找到可以直接切換語系的方法，因此只能先用`test.beforeEach()`的方式來切換語系。

`pages`是用來放置Page Object Models，可以參考[官方POM](https://playwright.dev/docs/pom)的設置，將所有需要測試的頁面分離出來，不但解耦合，又方便維護。

`playwright.config.ts`是用來設置測試的環境，例如測試的瀏覽器、測試的平台、測試的視窗大小等等，包含CI/CD的相關設置，可以參考[官方config](https://playwright.dev/docs/test-configuration)的設置。

最後也是最重要的`tests`，這裡放置所有的測試，也是預設的測試資料夾。

### 需要注意的幾個細節

- 首先在設置 `playwright.config.ts` 的BaseURL時如果網址有子目錄，例如`https://tidebit.com/defi/`，則需要在`playwright.config.ts`中設置`baseURL: 'https://tidebit.com/defi/'`，並且在使用`page.goto()`時需要寫成`page.goto("./")`，否則會出現跳轉錯誤的情況。[#8933](https://github.com/microsoft/playwright/issues/8933)

- 進行測試時主要利用[Locators](https://playwright.dev/docs/locators)獲取元素，再用[Actions](https://playwright.dev/docs/input)模擬互動，最後以[Assertion](https://playwright.dev/docs/test-assertions)判斷結果，當最後一個步驟為互動後判斷結果可能因不需互動就可獲取結果而報錯，出現此情況需要用`page.waitForTimeout()`或是更改順序，此外Assertion若只使用expect時，當判斷為false時會出現直接終止單個測試，因此當此行為不影響後續測試時建議使用`expect.soft()`替代。

- 官方[Chrome extension](https://playwright.dev/docs/chrome-extensions) 的設置內有動態獲取extension ID的方法，但目前使用無法獲取，解決方式是直接到擴充功能頁面點選開發者模式來獲取extension ID。

- 利用[Locators](https://playwright.dev/docs/locators)獲取元素時，頁面若不是原生的css設置可能會影響獲取元素，因此使用`page.locator()`時，需要注意複製的css selector 路徑是否包含`:`、`\`等無法辨別的符號。

- 進行[Assertion](https://playwright.dev/docs/test-assertions)判斷時可以使用Regex增加靈活性。

- 默認使用的page物件只能操作單一頁面，因此若希望保留此頁面情況開新分頁時，需要操作BrowserContext物件，詳情可以參考[pages](https://playwright.dev/docs/pages)與[browsercontext](https://playwright.dev/docs/api/class-browsercontext)。

## 參考文獻

- <https://playwright.dev/docs/intro>
- <https://zhuanlan.zhihu.com/p/602616599>
- <https://github.com/microsoft/playwright/issues/8933>
- <https://www.cnblogs.com/hiyong/p/15490784.html>
- <https://github.com/lokalise/i18n-ally>
- <https://www.i18next.com/overview/getting-started>
- <https://hiyongz.github.io/posts/web-testing-with-playwright-for-browser-language/>
- <https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs>
