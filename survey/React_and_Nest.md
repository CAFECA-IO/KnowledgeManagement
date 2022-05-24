# 建立以 Nest js 為框架的 React App

## Summary:
為了節省建立以 Nest js 為框架的 React App 的時間，此篇研究著重在如何設定 package.json 以及將 Nest 框架的檔案和 React 放置在一起，期望未來能達到透過 Github repository 直接 pull 檔案下來也能快速進入狀況，並且基於此檔案能直接開發一個 Nest.js 作為 HTTP Service 的 React App 

## 檔案的 Repository：

https://github.com/royal0721/NestReact

## 開發環境設定 
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

## 初始化檔案
1. 修改 package.json，將 React App 中的 package 相關依賴放入 
    ```
      "dependencies": {
        "@nestjs/cli": "^8.2.6",
        "@nestjs/common": "^8.1.1",
        "@nestjs/core": "^8.1.1",
        "@nestjs/platform-express": "^8.1.1",
        "@nestjs/serve-static": "^2.2.2",
        "@testing-library/jest-dom": "^5.16.4",
        "@testing-library/react": "^13.2.0",
        "@testing-library/user-event": "^13.5.0",
        "nest": "^0.1.6",
        "react": "^18.1.0",
        "react-dom": "^18.1.0",
        "react-player": "^2.10.1",
        "react-scripts": "5.0.1",
        "reflect-metadata": "^0.1.13",
        "typescript": "^4.6.4",
        "web-vitals": "^2.1.4"
      },
    ```

2. 修改 package.json 的 script - 將 react 相關的指令加上後綴詞 :react
    ```
      "scripts": {
        "start:react": "react-scripts start",
        "start": "nest start",
        "build:react": "react-scripts build",
        "test:react": "react-scripts test",
        "eject:react": "react-scripts eject"
      },
    ```
3. 修改 server folder 內的  module, main.ts 
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
4. 重新 npm install 更新 node module
    `npm install`
## 開發使用資料夾 



- Nest 開發檔案放置於 server folder:
    新增的 controller/module/service 可以分別放在其資料夾底下
    ![](https://i.imgur.com/X82pYtz.png)
    
    main.ts 監聽 port 3000，若要修改 port 可以在此檔案修改 

- React 開發檔案放置於 src folder：
新增的 component 可以放置於 component folder 底下
 ![](https://i.imgur.com/jSP8iqR.png)

- React 要使用的靜態資料放置於 public folder:

    ![](https://i.imgur.com/tOU2G8n.png)

- npm run build:react 後生成打包完成的 index.html 放置於 build folder：
    ![](https://i.imgur.com/QO3wilY.png)


## 部署方式
- 下指令 build react app 並 run http service
    ```
    npm run build:react
    npm run start
    ```
- 於 browser 輸入 http://localhost:3000 即可以開啟

## 整個資料夾結構（ server / react )

![](https://i.imgur.com/6oJobAv.png)

資料夾說明：
1. build:
npm run build:react 後的檔案
2. dist:
npm run build:nest 後的檔案
3. node_modules:
local node_modules
4. public:
放置靜態檔案（images,txt等）
5. server:
Nest 開發用的檔案
6. src:
React 開發用的檔案
7. .gitignore:
push 上 git 時需要 ignore 的檔案或資料夾
8. package-lock.json:
鎖定安裝時的 package version
9. package.json:
放置 dependencies, scripts, devDependencies 等
10. tsconfig.build.json:
引入 tsconfig.json 並 exculde 文件 
11. tsconfig.json:
Typescript - tsconfig.json 文件中指定了用來編譯此項目的 root folder 底下的文件和編譯選項

## Video App 開發
開發前先下載 pkg:
    ```
    npm install video.js
    npm install react-router-dom@6
    ```
1. import video 並 建立 video Component 
    ```
    import React, { useEffect, useRef, useState } from "react";
    import videojs from "video.js";
    import "video.js/dist/video-js.css";

    const Video = (props) => {

      const videoNode = useRef(null);
      const [player, setPlayer] = useState(null);

      useEffect(() => {

        if (videoNode.current) {
          const _player = videojs(videoNode.current, props);
          setPlayer(_player);
          return () => {
            if (player !== null) {
              player.dispose();
            }
          };
        }

      }, []);

      return (
        <div data-vjs-player>
          <video ref={videoNode} className="video-js"></video>
        </div>
      );
    };

    export default Video;
    ```
2. 於 App.js import video component - 將 Video 放到主頁
    ```
    import React from "react";
    import Video from './component/Video'

    function App() {
      const play＿details = {
        fill: true,
        fluid: true,
        autoplay: true,
        controls: true,
        preload: "metadata",
        sources: [
          {
            src: "https://stream.chinasuntv.com/680k/mid_video_index.m3u8",
            type: "application/x-mpegURL"
          }
        ]
      };
      return (
        <div className="App">
          <Video {...play＿details} />
        </div>
      );
    }
    export default App;
    ```
3. 製作導覽列，在 App.js import React Router
    ```
    import React from "react";
    import { BrowserRouter, Routes , Route, Link} from "react-router-dom";
    import HomePage from "./component/HomePage";
    import PlayList from "./component/PlayList";
    function App() {
      const linkStyle = {
        margin: "1rem",
        textDecoration: "none",
        color: 'blue',
        padding: '20px'
      };
      return (
        <BrowserRouter>
          <Link to="/" style={linkStyle}>首頁</Link>
          <Link to="/playlist" style={linkStyle}>節目表</Link>
          <Routes>
            <Route path="/" element={<HomePage/>}/> 
            <Route path="/playlist" element={<PlayList/>}/>
          </Routes>
        </BrowserRouter>
      );
    }
    export default App;
    // <Route exact index element={<Home />} />
    // <Route exact path="/about" element={<About />} />
    ```
4. 撰寫 playlist component, 分別將 json 檔案轉換成一個一個 component
    ```
    import data from '../playlist.json';
    import { Fragment, React } from "react";
    import './HomePage.css';
    const PlayList = (props) => {    

        const listItems = data.map((data_one, index) => (
        <Fragment key={index}>
            <li>
                <span>{data_one.prgName}</span>
                <span>{data_one.PlayTime}</span>
                <span>{data_one.prgColumn}</span>
            </li>
        </Fragment>
        ));

        return (
                <ul>{listItems}</ul>
            )


    }

    export default PlayList;
    ```
5. 畫面結果截圖
    ![](https://i.imgur.com/CcPBJor.jpg)
    ![](https://i.imgur.com/cSlxWlU.png)


## Reference
1. https://docs.nestjs.com/
2. https://create-react-app.dev/
3. https://videojs.com/guides/react/
