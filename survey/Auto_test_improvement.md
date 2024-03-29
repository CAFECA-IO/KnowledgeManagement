# Selenium and Ｍetamask
## Selenium 
### Summary:
為了改善先前 Selenium IDE 的一些限制，例如：無法直接使用 Google Chrome Extension 的問題、無法指定參數的問題，因此根據以上幾點做改善，先研究了如何使用 Python 撰寫 Selenium 程式，並且嘗試實踐於 TideBit 上，以達到可以直接輸入帳號密碼並且可以自動化測試 TideBit 入金和 TideBit Swap 的目標

### 最終目的：測試 TideBit 入金/ TideBit Swap 

### 執行結果：

- 可以再優化的關鍵步驟：
缺乏最後判斷 clickable button 的判斷程式

- 預估研究時間：
需要 0.5 hrs 進行 clickable button 的判斷程式撰寫

- 若可以成功執行，預估的測試撰寫時間：
若可以執行，預估需要 1 hr 撰寫 TideBit 入金 自動化測試 / TideBit Swap 需要 0.5hrs 優化自動化測試（大致完成） 

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
    
    // 將 crx path 作為 chrome driver 開啟時的 option
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
在自動化測試打開 extension 時，可以使用 webdriver.get(”chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome“）進入到網頁
```
def test_metamask_connection(): 

    EXTENSION_PATH = '/Users/clemmyliao/Library/Application Support/Google/Chrome/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/10.14.3_0.crx'
    opt = webdriver.ChromeOptions()
    opt.add_extension(EXTENSION_PATH)
    chrome_driver = webdriver.Chrome('/usr/local/bin/chromedriver',chrome_options=opt)
    sleep(10)
    chrome_driver.get('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome')
```
接著進行下列步驟：（若發生無法獲取 element 的問題，可以設定 sleep(__seconds) )

5. 進入 Metamask 初始設定頁面
```
def test_metamask_connection(): 

    EXTENSION_PATH = '/Users/clemmyliao/Library/Application Support/Google/Chrome/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/10.14.3_0.crx'
    opt = webdriver.ChromeOptions()
    opt.add_extension(EXTENSION_PATH)
    chrome_driver = webdriver.Chrome('/usr/local/bin/chromedriver',chrome_options=opt)
    sleep(10)
    chrome_driver.get('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome')
    # 設立頓點 跳轉一開始的設定頁面
    sleep(3)
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div[@class='welcome-page']/button[text()='Get Started']").click()
    sleep(3)
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div[@class='select-action__select-button']//button[text()='Import wallet']").click()
    sleep(3)
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div[@class='page-container__footer']//button[text()='No Thanks']").click()
```
6. 自動匯入金鑰
```
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div//input[@id='import-srp__srp-word-0']").send_keys("nurse") 
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div//input[@id='import-srp__srp-word-1']").send_keys("banner")
    # 以下繼續輸入其他 keyword 總共 12 個 
    ...
    # input 完成 keyword 後進入 set password 
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div//input[@id='password']").send_keys("_pw")
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div//input[@id='confirm-password']").send_keys("_pw")
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div//input[@id='create-new-vault__terms-checkbox']").click()
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div//button[text()='Import']").click()
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div//button[text()='All Done']").click()
```
7. 進入 Metamask 開啟 testnet 並切換成 Ropsten
```
    chrome_driver.find_element_by_xpath("//div[@id='popover-content']//button[@title='Close']").click()
    chrome_driver.get('https://swap.tidebit.network')
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//span[text()='Ethereum Mainnet']").click()
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//a[text()='Show/hide']").click()
    chrome_driver.find_element_by_xpath("(//div[@id='app-content']//div[@class='settings-page__content-item-col'])[7]").click()
    chrome_driver.find_element_by_xpath("//div[@id='app-content']//div[@class='chip__right-icon']").click()
    chrome_driver.find_element_by_xpath("(//div[@id='app-content']//span[@class='network-name-item'])[2]").click()
```
8. 連接 Metamask 並回到 TideBit Swap 網頁確認錢包帳號已連接 
```
    chrome_driver.get('https://swap.tidebit.network')
    chrome_driver.find_element_by_xpath("//div[@class='header-bar']/button[text()='Connect']").click()
    chrome_driver.find_element_by_xpath("//div[@class='ConnectOptions_icon-button__3A5mo']").click()
    chrome_driver.get('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html')
    chrome_driver.find_element_by_xpath("//div/button[text()='Next']").click()
    chrome_driver.find_element_by_xpath("//div[@id='app-content']/div/div[@class='main-container-wrapper']/div/div[@class='page-container permission-approval-container']/div[@class='permission-approval-container__footers']/div[@class='page-container__footer']/footer/button[text()='Connect']").click()
    chrome_driver.get('https://swap.tidebit.network')
    print('connection ok!')
```
9. 進行 ETH Swap (ETH->tt3) 並且進入 Metamask confirm
```    
    chrome_driver.find_element_by_xpath('(//div[text()="Select Coin"])[1]').click()
    chrome_driver.find_element_by_xpath('//div[text()="ETH"]').click()
    chrome_driver.find_element_by_xpath('(//div[text()="Select Coin"])[1]').click() 
    chrome_driver.find_element_by_xpath('//div[text()="tt3"]').click()
    chrome_driver.find_element_by_xpath('(//input)[3]').send_keys("0.001") 
    # get value of the element
    exchange = chrome_driver.find_element_by_xpath('(//input)[4]').get_attribute('value')
    chrome_driver.find_element_by_xpath('//button[text()="Swap"]').click()
    chrome_driver.get('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html')
    
    # Go to Metamask and click confirm

    chrome_driver.find_element_by_xpath("//div/div[@class='confirm-page-container-content confirm-page-container-         content--with-top-border']/div[@class='page-container__footer']/footer/button[text()='Confirm']").click()
 
```
    
### 畫面結果連結：

https://drive.google.com/file/d/1zHpzd4yKS0bgUfYi7Q_xWM1aju38go_n/view?usp=sharing

---
## Reference:
https://www.lambdatest.com/blog/selenium-webdriver-with-python/

https://dev.to/ltmenezes/automated-dapps-scrapping-with-selenium-and-metamask-2ae9

https://www.lambdatest.com/learning-hub/python-tutorial

