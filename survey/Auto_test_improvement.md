# Selenium and DApp
## Selenium 
### Summary:
為了改善先前 Selenium IDE 的一些限制，例如：無法直接使用 Google Chrome Extension 的問題、無法指定參數的問題，因此根據以上幾點做改善，先研究了如何使用 Python 撰寫 Selenium 程式，並且嘗試實踐於 TideBit 上，以達到可以直接輸入帳號密碼，最終測試到可以將Trading 進行自動判斷測試的目標
### 最終目的：測試 TideBit 入金/ TideBit Swap 
### 執行結果：測試 TideBit 入金 進行自動化測試不可行（目前判斷）/ TideBit Swap 使用 Selenium 進行自動化測試可行，需要 3hrs 完成自動化測試 
### 使用 Python 語法 實際運行 Selenium 
#### 前置作業
1. 先下載 Google Chrome WebDriver，接著 pip3 install selenium
2. 接著針對 Login test（admin) 撰寫
```
def auto_login_as_admin():

    chrome_driver = webdriver.Chrome('/usr/local/bin/chromedriver')
    chrome_driver.get('https://legacy2.tidebit.network/signin')
   // 輸入帳號密碼
    chrome_driver.find_element_by_xpath("//input[@id='identity_email']").send_keys("clemmy.liao@mermer.cc")  
    chrome_driver.find_element_by_xpath("//input[@id='identity_password']").send_keys("1234royal")  
    chrome_driver.find_element_by_xpath("//input[@value='Submit']").click()
    // 暫停方便做確認
    sleep(20)
``` 

---
### 如何在 Mac 使用 Selenium 連接 Metamask?
#### 連接 MetaMask 的前置作業
1. 使用 chrome 進入 chrome://extensions/
![](https://i.imgur.com/RQwwaMI.png)
2. 將 Metamask 的 extension 資料夾 path 輸入進 External root directory 欄位
![](https://i.imgur.com/eWG1pOD.png)
3. 點擊 Pack extension ，google 會幫忙產生出 crx 檔案和 private key
4. 記錄下 crx 檔案的路徑
![](https://i.imgur.com/7hlWlT0.png)
#### 將記錄下來的 crx 檔案路徑輸入到 code 中
```
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from time import sleep
 
def test_app():

    EXTENSION_PATH = '/Users/clemmyliao/Library/Application Support/Google/Chrome/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/10.14.3_0.crx'
    opt = webdriver.ChromeOptions()
    opt.add_extension(EXTENSION_PATH)
    
    // 將 crx path 作為 chrome driver 開啟時的ｏption
    chrome_driver = webdriver.Chrome('/usr/local/bin/chromedriver',chrome_options=opt)
```
#### 可能會遇到的問題
Error: `Timed out receiving message from renderer: 10.000`
原因： 可能是遇到網路不穩定的問題

#### 可能遇到的困難:
嘗試捕捉 Metamask Get Started Button 但無法捕捉到該 button
![](https://i.imgur.com/pPgSXIV.png)

遇到困難時使用的 code:
```
// 使用 xpath: //button[text()='Get Started']
chrome_driver.find_element_by_xpath("//button[text()='Get Started']").click()
```
#### 解決方式：
在自動化測試打開其裝置時，可以使用 webdriver.get(”chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome“）先轉換成網頁

---
## Reference:
https://www.lambdatest.com/blog/selenium-webdriver-with-python/

https://dev.to/ltmenezes/automated-dapps-scrapping-with-selenium-and-metamask-2ae9

https://www.lambdatest.com/learning-hub/python-tutorial

