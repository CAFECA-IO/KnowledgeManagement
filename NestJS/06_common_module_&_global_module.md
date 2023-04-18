# 常用模組 (Common Module)
這是一種設計技巧，Module 可以不含任何 Controller 與 Provider，只單純把匯入的 Module 再匯出，這樣的好處是可以把多個常用的 Module 集中在一起，其他 Module 要使用的話只需要匯入此 Module 就可以了。下方為範例程式碼：

```typescript=
@Module({
  imports: [
    AModule,
    BModule
  ],
  exports: [
    AModule,
    BModule
  ],
})
export class CommonModule {}
```

# 全域模組 (Global Module)
當有 Module 要與多數 Module 共用時，會一直在各 Module 進行匯入的動作，這時候可以透過提升 Module 為 全域模組，讓其他模組不需要匯入也能夠使用，只需要在 Module 上再添加一個 @Global 的裝飾器即可。以 TodoModule 為例：
```typescript=
import { Module, Global } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Global()
@Module({
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService]
})
export class TodoModule {}
```

**注意：雖然可以透過提升為全域來減少匯入的次數，但非必要情況應少用，這樣才是好的設計準則。**

# 在 TBD-backend 有嘗試將兩者組合起來使用
我這邊將取得 config 的 ConfigModule 跟負責 request 的 HttpModule 用 CommonModule 包起來，然後定義成 Global Module，然後在各個 Module 間就可以同一使用，就不會發生需要多次去讀 .env 的問題。

```typescript=
import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import MarketConfigFactory from 'src/config/market.config';
import MongoConfigFactory from './config/mongo.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      load: [MarketConfigFactory],
    }),
    ConfigModule.forRoot({
      load: [MongoConfigFactory],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [
    ConfigModule.forRoot({
      load: [MongoConfigFactory],
    }),
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      load: [MarketConfigFactory],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CommonModule {}

```

在 AppModule import 一次就夠了
```typescript=
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TickersModule } from './market/tickers/tickers.module';
import { CandlesticksModule } from './market/candlesticks/candlesticks.module';
import { CfdsModule } from './user/trade/cfds/cfds.module';
import { MarketModule } from './market/market.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('mongo.uri'),
      }),
    }),
    TickersModule,
    CandlesticksModule,
    CfdsModule,
    MarketModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
