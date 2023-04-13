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
 在 mongoDB 建立帳號及 database 透過 database Connect 獲得連線資訊，把對應的資訊填到 .env 裡面
 
[url: mongoDB](https://cloud.mongodb.com/v2/6437a139e7ffc775573e816e#/clusters/connect?clusterId=Cluster0)

## 設計 Scheme
在 Nest 要設計 schema 有兩種方式，一種是採用 mongoose 原生的做法，另一種則是用 Nest 設計的裝飾器，這裡會以 Nest 裝飾器為主。透過 Nest 裝飾器設計的 schema 主要是由 @Schema 與 @Prop 所構成：

這裡我們先設計一個名為 User 的 class，並使用 @Schema 裝飾器，在 src/common/models 資料夾下建立一個名為 user.model.ts 的檔案：
```typescript!
import { Schema } from '@nestjs/mongoose';

@Schema()
export class User {}
```
### Prop 裝飾器
@Prop 裝飾器定義了 document 的欄位，其使用在 class 中的屬性，它擁有基本的型別推斷功能，讓開發人員在面對簡單的型別可以不需特別做指定，但如果是陣列或巢狀物件等複雜的型別，則需要在 @Prop 帶入參數來指定其型別，而帶入的參數其實就是 mongoose 的 SchemaType，詳細內容可以參考官方文件。

然後來修改一下 user.model.ts 的內容，實作一次 @Prop 的使用方式。

### 產生 Schema
在設計好 schema 之後，就要將 schema 透過 SchemaFactory 的 createForClass 方法產生出這個 schema 的實體。
```typescript!
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  created_timestamp: number;

  @Prop()
  updated_timestamp: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

## 使用 Model
先用 nestCLI 生成 UserModule、UserController、UserService
```shell!
$ nest generate module user
$ nest generate controller user
$ nest generate service user
```

MongooseModule 有提供 forFeature 方法來配置 MongooseModule，並在該作用域下定義需要的 model，使用方式很簡單，給定一個陣列其內容即為 要使用的 schema 與 對應的 collection 名稱，通常我們習慣直接使用 schema 的 class 名稱作為值，其最終會對應到的 collection 為 名稱 + s，舉例來說，User 會對應到的 collection 名稱即 users。

我們修改 user.module.ts，將 MongooseModule 引入，並在 UserModule 的作用域下使用 User 的 model：

```typescript!
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../../common/models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
```

在定義好之後，就可以透過 @InjectModel 來將 User 的 model 注入到 UserService 中，並給定型別 UserDocument：
```typescript!
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { User, UserDocument } from '../../common/models/user.model';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

}
```
### 建立 (Create)
修改 user.service.ts 的內容，新增一個 create 方法，並呼叫 userModel 的 create 方法來建立一個使用者到 users 這個 collection 裡面：
```typescript!
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { User, UserDocument } from '../../common/models/user.model';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  create(user: any) {
    return this.userModel.create(user);
  }

}
```

修改 user.controller.ts 的內容，設計一個 POST 方法來建立使用者，並且返回 UserDocument 到客戶端：
```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  
  constructor(
    private readonly userService: UserService
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.userService.create(body);
  }

}
```
