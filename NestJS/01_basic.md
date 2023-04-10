# NestJS
## 從頭開始做 NestJS (不使用 nestJS CLI)

1. 創建 package.json 
```
npm init -y
```
2. 安裝 nestJS 所必需的 dependency
```
npm install @nestjs/common@7.6.17 @nestjs/core@7.6.17 @nestjs/platform-express@7.6.17 reflect-metadata@0.1.13 typescript@4.3.2
```
![](https://i.imgur.com/MPP6iU5.jpg)
nestJS 不直接處理 http 請求 而是我們在 nestJS 里面 實作外部 lib 來處理 http 請求，可以選擇 express(default) 或是 fastify。

這裡我們使用 express ，其中 @nestjs/platform-express 就是 express 與 nestJS 之間的適配器，使兩者可以一起工作。

3. 設定 typescript 編譯器配置文件
tsconfig.json
```json=
{
    "compilerOptions":{
        "module": "commonjs",
        "target": "es2017",
        "experimentalDecorators": true,
        "emitDecoratorMetadata" true,
    }
}

```
5. 創建 Nest module 及 controller
伺服器處理請求的流程
![](https://i.imgur.com/uNMkNmu.jpg)
最低限度的 nestJS App 需要 module 及 controller。
建立 src 資料夾，生成 main.ts
在 main.ts
```typescript=
import {Controller, Module， Get} from '@nestjs/common';
import {NestFactory} from '@nestjs/core'

@Controller() // typescript decorator
class AppController { // 用來處理和路由傳入的請求requests
    // 定義不同的方法，每個方法都設計用於處理一種傳入請求
    @Get() // 這允許我們創建處理 http get 方法請求的路由
    getRootRoute(){
        return 'Hi there!';
    }
}

@Module({ // 一個模塊將包裹一個或多個控制器，Nest 會幫我們將傳進來的控制器實體化
    controllers: [AppController]
})
class AppModule {}

async function bootstrap(){
    const app = await NestFactory.create(AppModule)；
    
    await app.listion(3000); // 設定要監聽的端口
}
bootstrap();// Nest 啟動時運行的 function
```
6. 啟動
```shell=
npx ts-node-dev src/main.ts
```

## 檔案命名傳統
1. 一個檔案裡面只包含一個 class (會有一些例外情況)
2. class 名稱要可以容易看出這個 class 要做的事情
3. 檔案名稱要對應 class 名稱

範例：
- main.ts => bootstrap
- app.controller.ts => class AppController{}
- app.module.ts => class AppModule{}

## Routing Decorators
nestJS 使用在 controller decorator 及 method decorator 裡面傳入的字串來構建 routing 的層級
範例：
`http://localhost:3000/`
```typescript=
@Controller()
class AppController { 
    @Get()
    getRootRoute(){
        return 'Hi there!';
    }
}
```
`http://localhost:3000/app/hi`
```typescript=
@Controller('/app')
class AppController { 
    @Get('/hi')
    getRootRoute(){
        return 'Hi there!';
    }
}
```

## 使用 Nest CLI 

### 安裝 Nest CLI 
```shell=
npm install -g @nestjs/cli
```
