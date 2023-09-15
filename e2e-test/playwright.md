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

## 參考文獻

- <https://playwright.dev/docs/intro>
- <https://zhuanlan.zhihu.com/p/602616599>