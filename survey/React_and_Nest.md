# 建立以 Nest js 為框架的 React App

## Summary:
為了節省建立以 Nest js 為框架的 React App 的時間，此篇研究著重在如何設定 package.json 以及將 Nest 框架的檔案和 React 放置在一起，期望未來能達到透過 Github repository 直接 pull 檔案下來也能快速進入狀況，並且基於此檔案能直接開發一個 Nest.js 作為 HTTP Service 的 React App 

## 檔案的 Repository：

https://github.com/royal0721/NestReact

## 如何創建一個基於 Nest 框架的 React App?

1. 安裝 nest 並建立一個新的檔案
```
$ npm i -g @nestjs/cli
$ nest new project-name
```
2. 將 src folder 名稱改成 server 以做區隔

3. 修改 package.json - 任何出現 src 的把它改成 server
4. 另外開啟一個新的資料夾 (放在此 root folder 外），並且 create react app (輸入以下 create react app 指令)
`npx create-react-app client`
5. 建立一個新的 React App，並且將 src, public 文件複製進 Nest folder 中
6. 修改 package.json，將 React App 中的 package 相關依賴放入 
![](https://i.imgur.com/p4Qnd9j.png)


7. 修改 package.json 的 script - 將 react 相關的指令加上後綴詞 :react
![](https://i.imgur.com/2ksBrE9.png)

8. 修改 server folder 內的  module, main.ts 
module:
```
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'build'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```
main.ts:
```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

9. build react app 並 run http service
```
npm run build:react
npm run start
```
10. 查看 localhost:3000 就能看到網站被 run 起來
11. (缺乏最後步驟) 放上 m3u8 影片
