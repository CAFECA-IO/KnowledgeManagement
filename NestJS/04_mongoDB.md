# Using MongoDB in Nest
## 安裝 mongoose
node.js 與 MongoDB 溝通最有名的函式庫即 mongoose，它是一個採用 schema-based 的 ODM 套件。Nest 對 mongoose 進行了包裝，製作了一個 MongooseModule。

安裝方式一樣是透過 npm，不過這裡需要特別注意除了安裝 Nest 製作的模組外，還需要安裝 mongoose 本身：

```shell
npm install @nestjs/mongoose mongoose
```
### 使用環境變數設置 MongoDB 的連線資訊
MongooseModule 提供了 forRootAsync 方法，透過這個方法可以把依賴項目注入進來，使 MongooseModule 在建立時可以使用依賴項目來賦予值。運用這個特性將 ConfigModule 引入，並注入 ConfigService 進而取出我們要的環境變數來配置 MongoDB 的來源。
```shell
npm install @nestjs/config --save
```
我們先在專案目錄下新增 .env 檔，並將 MongoDB 的相關配置寫進來：
```env=
MONGO_USERNAME=YOUR_USERNAME
MONGO_PASSWORD=YOUR_PASSWORD
MONGO_RESOURCE=YOUR_RESOURCE
```
在 src/config 資料夾下新增 mongo.config.ts 來實作工廠函式：
```typescript=
import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => {
  const username = process.env.MONGO_USERNAME;
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const resource = process.env.MONGO_RESOURCE;
  const uri = `mongodb+srv://${username}:${password}@${resource}?retryWrites=true&w=majority`;
  return { username, password, resource, uri };
});
```
#### [ConfigModule 的說明](https://ithelp.ithome.com.tw/articles/10275664)
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
## 連線 MongoDB
在安裝完相關套件後以及設定好環境參數後，在 AppModule 下匯入 MongooseModule 並使用 forRoot 方法來進行連線。
```typescript=
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import MongoConfigFactory from './config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MongoConfigFactory],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('mongo.uri'),
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
