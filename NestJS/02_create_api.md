# NestJS
這裡選擇使用 Express 作為底層系統
## 設置
安裝 cli 並建立 Nest 專案
```shell!
npm i -g @nestjs/cli
nest new project-name
```
## 載入點
Nest 專案裡面的 main.ts 為載入點，程式碼如下：
```typescript!
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```
以非同步的 bootstrap 函式做為載入函式，透過 NestFactory.create(AppModule) 產生一個 Nest App 的實例 (Instance)，並透過呼叫該實例的 listen(PORT) 將其架設起來。

## Module、Controller、Service
### 建置在 Market 下的 Tickers Module
Module 屬於功能模組，把相同性質的功能包裝在一起。
```shell!
 nest generate controller <CONTROLLER_NAME>
 nest generate module market/tickers     
```
完成後會新增一個檔案 `markets.module.ts` 在 market/tickers 資料夾下並在 `app.module.ts` 裡面 `import` MarketsModule。
#### markets.module.ts 的程式碼如下：
```typescript!
import { Module } from '@nestjs/common';

@Module({})
export class MarketsModule {}
```
#### app.module.ts 的程式碼如下：
```typescript!
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
-新增-> import { MarketsModule } from './market/tickers/tickers.module';

@Module({
  imports: [-新增-> MarketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 建置 Controller
```shell!
 nest generate controller <CONTROLLER_NAME>
 nest generate controller market/tickers   
```
這裡使用跟 module 同樣的路徑，這樣 Nest 會將 TickersController 作為 controller 會自動 import 到 market/tickers 的 module 中。generate controller 會產生兩個 file，分別為 `tickers.controller.ts` 跟 `tickers.controller.spec.ts`，其中 `xxx.controller.spec.ts` 是 controller 的單元測試。

#### markets.module.ts 的更新如下：
```typescript!
import { Module } from '@nestjs/common';
-新增-> import { TickersController } from './tickers.controller';
@Module({
    -新增-> controllers: [TickersController],
})
export class MarketsModule {}
```
### 建置 Service
```shell!
 nest generate service <CONTROLLER_NAME>
 nest generate service market/tickers   
```
這裡使用跟 module 同樣的路徑，這樣 Nest 會將 TickersService 作為 provider 自動 import 到 market/tickers 的 module 中。generate controller 會產生兩個 file，分別為 `tickers.service.ts` 跟 `tickers.service.spec.ts`，其中 `xxx.service.spec.ts` 是 service 的單元測試。

#### markets.module.ts 的更新如下：
```typescript!
import { Module } from '@nestjs/common';
import { TickersController } from './tickers.controller';
@Module({
    controllers: [TickersController],
    -新增-> providers: [TickersService],
})
export class MarketsModule {}
```

### 在上述的配置下建立一個 listTickers 的 API

#### 將 markets.service.ts 更新成如下：
```typescript!
import { Injectable } from '@nestjs/common';

@Injectable()
export class TickersService {
  listTickers(): [] {
    return [];
  }
}
```

#### 將 markets.controller.ts 更新成如下：
```typescript!
import { Controller, Get } from '@nestjs/common';
import { TickersService } from './tickers.service';

@Controller('tickers')
export class TickersController {
  constructor(private readonly todoService: TickersService) {}

  @Get()
  getAll() {
    return this.todoService.listTickers();
  }
}
```
