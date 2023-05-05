# Pusher 
 Pusher是Client端和Sever之間的實時中間層，通過WebSocket或HTTP来和Client端實現持久連接，這樣Server可以實時向Client端發送數據。總之，就是一个實現持久連接的library。 

# Pusher 的使用
要先到[Sign Up - Pusher](https://dashboard.pusher.com/accounts/sign_up)註冊，即可以獲得在App建立Pusher Instance時所需要的認證密碼 appid,secret和key 及設定 clutser。

# Server端建立Pusher
1. 以 NestJs 為例，先安裝 pusher 
```shell!
npm i pusher --save
```
2. 在 `.env` 存放 PUSHER 連線資訊
```env=
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_CLUSTER=
PUSHER_USE_TLS=
```
3. 在 configModule 裡面從 `.env` 取得裡面定義的參數，從而在 NestJs 裡面可以使用
4. 在合適的位置將 Pusher 實體化
```typescript=
const pusherOptions = {
      appId: this.PUSHER_APP_ID,
      key: this.PUSHER_APP_KEY,
      secret: this.PUSHER_APP_SECRET,
      cluster: this.PUSHER_CLUSTER,
      useTLS: this.PUSHER_USE_TLS, // Use SSL/TLS encryption for communication
    };
const pusher = new Pusher(pusherOptions);
```
# Client端建立Pusher
![](https://i.imgur.com/GRozSTt.png)
[圖片來源](https://pusher.com/docs/channels/library_auth_reference/pusher-websockets-protocol/)

1. 以 nextJS 為例，先安裝 pusher-js
```shell!
npm i pusher-js --save
```
2. 在 `.env` 存放 PUSHER 連線資訊
```env=
PUSHER_ENDPOINT=
PUSHER_API_KEY=
PUSHER_CLUSTER=
```
3. 在 `next.config.js` 定義環境參數
```javascript=
const nextConfig = {
    env: {
        PUSHER_ENDPOINT: process.env.PUSHER_ENDPOINT,
        PUSHER_API_KEY: process.env.PUSHER_API_KEY,
        PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    }
}

module.exports = nextConfig;
```
4. 在合適的位置將 Pusher 實體化
```typescript=
    const pusher = new Pusher(process.env.PUSHER_API_KEY, {
      cluster: process.env.PUSHER_CLUSTER,
      channelAuthorization: {
        transport: 'ajax',
        endpoint: `${process.env.PUSHER_ENDPOINT}/pusher/auth`,
        params: {
          deWT: getCookieByName('DeWT'),
        },
      },
    });
```
### Pusher 實體化參數
1. 在 new Pusher 時，傳入的第一個參數為 PUSHER_API_KEY 就是在註冊 Pusher 時獲得的 key。
![](https://i.imgur.com/ZTRfBB6.png)
2. 第二個傳入的是 Options，其中需要注意的是 cluster 是必須填寫的，cluster 也來自註冊 Pusher 後自己設定的。
3. 在 Options 中，我這邊還傳入了 channelAuthorization 的參數，那channelAuthorization 是 client 端註冊 private channel 時會觸發的，這邊的 endPoint 是使用Server提供的 API（endpoint 定義的就是 Server API），由Server 負責與 Pusher 溝通，用來取得授權 user 註冊 private channel， params 裡面自由定義要帶入的參數，我在這邊使用 DeWT 提供給後端用來驗證 user 的合法性，其中特別要注意的是要將 transport 設置為 'ajax' 允許 cors。

# Channel
每個應用程序可以有一個或多個頻道，每個客戶端可以選擇訂閱哪些頻道。

頻道提供：

* 一種過濾數據的方式例如，在聊天應用程序中，可能有一個頻道供想要討論“狗”的人使用
* 一種控制對不同信息流的訪問的方法。例如，項目管理應用程序想要授權人們獲取有關“secret-projectX”的更新


Pusher 強烈建議使用通道來過濾數據，而不是使用事件來實現。這是因為發佈到通道的所有事件都會發送給所有訂閱者，而不管他們的事件綁定。

通道不需要顯式創建，並根據客戶需求實例化。這意味著創建頻道很容易。只需告訴客戶訂閱它即可。

## Channel 類型
目前有4種Channel：

* Public channels: 任何知道Channel名字的人都可以訂閱。
* Private channels: 私人頻道應該有一個private-前綴。通過 Pusher 設計的一種機制，讓Server 可以管控哪些用戶可以獲取正在廣播的數據的訪問權限。
* Private encrypted channels: 私有加密通道應該有一個private-encrypted-前綴。它們擴展了私有通道的授權機制，添加了數據有效載荷的加密，這樣即使是 Pusher 也無法在未經授權的情況下訪問它。
* Presence channels: 存在通道應該有一個presence-前綴，並且是私有通道的擴展。它們讓您在訂閱時“註冊”用戶信息，並讓頻道的其他成員知道誰在線

* Cache channels: 緩存通道會記住最後發布的消息，並在客戶訂閱時將其傳遞給客戶。緩存通道有公共、私有和私有加密三種模式。


# Client端註冊Channel（訂閱活動）
## pusher:subscribe（客戶端 -> 推送通道）
該pusher:subscribe事件在客戶端生成，並在進行訂閱時發送到 Pusher Channels。

從 API 用戶的角度來看，訂閱是在subscribe調用方法的那一刻進行的。但是，客戶端庫中觸發事件的實際時刻pusher:subscribe取決於訂閱的頻道類型。

```typescript=
const channel = pusher.subscribe("public-channel");
```
## PublicChannel
由於訂閱公共頻道時無需授權，pusher:subscribe事件可以在調用後立即從客戶端發送到 Pusher Channels subscribe。


![](https://i.imgur.com/DS6V7ht.png)
[圖片來源](https://pusher.com/docs/channels/library_auth_reference/pusher-websockets-protocol/)

## PrivateChannel
專用、加密和在線頻道需要授權，因此需要對託管 Web 應用程序的應用程序服務器進行額外調用，以確保當前用戶可以訂閱給定頻道。
```typescript=
const channel = pusher.subscribe("private-channel");
```

其中 `private-` 是 private channel 的前綴，是 Pusher 用來判斷 channel 是否為私有的唯一判定方式。在 `pusher.subscribe("private-channel")` 被調用時會觸發在 Pusher 實體化時裡面的 `channelAuthorization` 由 Client Library 呼叫 `/pusher/auth` 由 Server 回傳給 Client Library，Client Library 在發送給 Puser。

![](https://i.imgur.com/h87YbNB.png)
[圖片來源](https://pusher.com/docs/channels/library_auth_reference/pusher-websockets-protocol)

# Server 向通道推送消息
![](https://i.imgur.com/O6s7Uui.png)
```typescript=
 const response = await pusher.trigger(
        channelName,
        Event,
        data,
      );
```




