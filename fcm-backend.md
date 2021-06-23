# FCM - Backend

## 安裝函式庫

```
$ npm install firebase-admin --save
```

## 下載憑證

[Initialize the SDK](https://firebase.google.com/docs/admin/setup#initialize-sdk)

> To generate a private key file for your service account:
>
> 1. In the Firebase console, open Settings > Service Accounts.
>
> 2. Click Generate New Private Key, then confirm by clicking Generate Key.
>
> 3. Securely store the JSON file containing the key.

!! 替換掉下面 `Project Name`
Link: https://console.firebase.google.com/u/1/project/`{{Project Name}}`/settings/serviceaccounts/adminsdk

下載憑證 json 後之後會使用到

## Initial `firebase-admin` Instance

```javascript
const serviceAccount = require('private/service-account-file.json') || {};

this.firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});
```

## 將裝置 token 註冊至同一 User

使用 subscribeToTopic 將多個裝置註冊成 Topic，然後這邊將 DB 中的 UserID 當成 `Topic name`，所以在之後需要對該 user 所有裝置做推播時就可以戳該 UserID 為名的 Topic

至於 user registration Token(ex: [Android](https://firebase.google.com/docs/cloud-messaging/android/client))

```javascript
await this.firebase
  .messaging()
  .subscribeToTopic(userRegistrationToken), userID)
  .then(() => {
    this.logger.log(`subscribeToTopic userID(${userID}) success`);
  })
```

## 針對單一 User 推播訊息

source: [Build app server send requests](https://firebase.google.com/docs/cloud-messaging/send-message)

```javascript
await this.firebase
  .messaging()
  .send({
    notification: {
      // 系統下拉看到的到的訊息標題
      title: 'title',
    },
    data: {
      // app 會收到的 metadata
      title: `metadata title`,
      body: JSON.stringify({
        blockchainId: this.bcid,
        eventType: 'UTXO',
        currencyId: this.currencyInfo.currency_id,
        accountId: txout.accountCurrency_id,
        data: payload,
      }),
      // flutter action
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
    },
    // 要傳遞的目標 Topic，這邊我們註冊成
    topic: userID,
  })
  .then(() => {
    console.log('send success');
  })
```

## 備註

- `firebase.messaging().send()` 後成功會回傳 message id 給你，但目前沒有找到任何方式可以去檢查該 message id 是否有真的傳出去（這邊常遇到有回傳 message id，app 卻沒有收到通知

- 送出訊息後有時候 FCM，App 並非“很及時”的收到訊息