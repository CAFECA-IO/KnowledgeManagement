
## Exception
[ref:](https://ithelp.ithome.com.tw/articles/10270357)
1. Exception 即為錯誤物件。
2. Nest 內建的標準 Exception 為 HttpException。Nest 內建錯誤處理機制，名為 Exception filter，會自動處理錯誤並包裝回應格式。
3. 內建的 Exception filter 在收到非 HttpException 系列的 Exception 時，會一回覆 Internal server error。
4. HttpException 可以透過給定 Object 來覆寫格式。
5. Nest 內建大量的 Http Exception。
6. 可以自訂 Exception filter，並可以套用至單一資源、Controller 或全域。
7. 全域 Exception filter 可以透過依賴注入的方式實作。


## Pipe
[ref1:](https://ithelp.ithome.com.tw/articles/10271014)
[ref2:](https://ithelp.ithome.com.tw/articles/10271720)
1. Pipe 經常用在處理使用者傳入的參數的資料驗證與型別轉換。
2. Nest 有內建六個 Pipe。
3. 內建 Pipe 可以自訂 HttpCode 或 Exception。
4. Pipe 就是一個帶有 @Injectable 的 class，它要去實作 PipeTransform 這個介面。
5. ValidationPipe 需要安裝 class-validator 及 class-transformer。
6. 透過 ValidationPipe 可以實現 DTO 格式驗證。
7. ValidationPipe 可以透過 disableErrorMessages 關閉錯誤細項。
8. ValidationPipe 一樣可以透過 exceptionFactory 自訂 Exception。
9. ValidationPipe 可以透過 whitelist 來過濾無效參數，如果接收到無效參數想要回傳錯誤的話，還需要額外啟用 forbidNonWhitelisted。
10. ValidationPipe 可以透過 transform 來達到自動轉換型別的效果。
11. 用 ParseArrayPipe 解析陣列 DTO 以及查詢參數。
12. DTO 可以透過 PartialType、PickType、OmitType、IntersectionType 這四個函式來重用 DTO 的欄位。
13. 全域 Pipe 可以透過依賴注入的方式實作。

## Middleware 
[ref:](https://ithelp.ithome.com.tw/articles/10272385)
Middleware 是一種執行於路由處理之前的函式，可以存取請求物件與回應物件，並透過 next() 繼續完成後續的流程，比如說：執行下一個 Middleware、進入正式的請求資源流程。
1. Middleware 是一種執行於路由處理之前的函式，其可以存取請求物件與回應物件。
2. Middleware 有兩種設計方式：Functional middleware 與 Class middleware。
3. 在 Module 實作 NestModule 介面並設計 configure() 方法，再透過 MiddlewareConsumer 管理各個 Middleware。
4. 可以把一個或多個 Middleware 套用在一個或多個路由、HttpMethod 或 Controller 上。
5. 可以排除特定路由，讓該路由不套用 Middleware。
6. 可以將 Middleware 套用至全域。

## Interceptor
[ref:](https://ithelp.ithome.com.tw/articles/10273045)
中文名稱為攔截器，受到 剖面導向程式設計 (Aspect Oriented Programming) 的啟發，為原功能的擴展邏輯，其特點如下：

1. Interceptor 執行於 Middleware 之後，但可執行於 Pipe 與 Controller 之前與之後。
2. 可以在不變動原本邏輯的情況下去擴充邏輯。
3. CallHandler 為重要成員，需要呼叫其 handle() 來讓路由機制得以運行。
4. ExecutionContext 提供了 getClass() 與 getHandler() 來提升靈活性。
5. 全域 Interceptor 可以透過依賴注入的方式實作。

## Gurd
[ref:](https://ithelp.ithome.com.tw/articles/10273757)
- Guard 是實作授權與身份驗證的好幫手，也是非常常用的功能，後面篇幅會出現 Guard 的相關應用。
  - Guard 執行在 Middleware 之後、Interceptor 之前。
  - Guard 比 Middleware 更適合實作授權與身份驗證。
  - 善用 ExecutionContext 取得驗證相關資訊。
  - 全域 Guard 可以透過依賴注入的方式實作。

## ConfigModule 
[ref:](https://ithelp.ithome.com.tw/articles/10275664)
1. 官方有實作一套環境變數管理模組 - ConfigModule。
2. ConfigModule 使用 Dynamic Module 的概念實作。
3. 透過 .env 檔來配置環境變數。
4. 透過 envFilePath 來指定自訂的環境變數檔。
4. envFilePath 可以按照優先權做排序。
5. 使用工廠函式與 load 搭配來處理環境變數。
7. 運用工廠函式來配置命名空間，以歸納各個環境變數的類別。
8. 可以在 main.ts 中取出 ConfigService 來獲得環境變數。
9. 透過 expandVariables 讓環境變數檔有嵌入變數的功能。
10. 透過 isGlobal 讓 ConfigModule 提升為全域模組。
