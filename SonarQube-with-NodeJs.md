# SonarQube with NodeJs

## 準備環境
- Node/npm
- Docker

## 安裝npm套件
> npm install jest

- **jest** 用來測試的套件，SonarQube測試覆蓋率的依據。

> npm install -D sonarqube-scanner jest-sonar-reporter

- **sonarqube-scanner** - SonarQube掃描用的套件，用這個可以少很多事，比如建專案、建key、其他設定等等
- **jest-sonar-reporter** - 幫忙把jest結果轉換成SonarQube通用測試數據的套件

## Docker Image SonarQube

[SonarQube Docker hub](https://hub.docker.com/_/sonarqube/)

啟動SonarQube
> docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest

啟動後可以在瀏覽器輸入 http://localhost:9000 進入SonarQube主控台
* 帳號： admin
* 密碼： admin

內建DB無法升版，僅供單機測試用。如果要供大家長期使用，需要設置DB。(待補完)
* https://docs.sonarqube.org/latest/setup/install-server/
> Warning: Only a single instance of SonarQube can connect to a database schema. If you're using a Docker Swarm or Kubernetes, make sure that multiple SonarQube instances are never running on the same database schema simultaneously. This will cause SonarQube to behave unpredictably and data will be corrupted. There is no safeguard until SONAR-10362.

## Project structure

```
SampleProject
  |-node_module
  |-src
  |   |-backend
  |   |   |-Utils.js
  |   |-test
  |       |-Utils.test.js
  |-.gitignore
  |-package-lock.json
  |-package.json
  |-sonar-project.js
```

### code

file: sonar-project.js
```js
const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
  {
    serverUrl:  'http://localhost:9000',
    options : {
      'sonar.sources':  'src',
      'sonar.tests':  'src',
      'sonar.inclusions'  :  '**', // Entry point of your code
      'sonar.test.inclusions':  'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
      'sonar.javascript.lcov.reportPaths':  'coverage/lcov.info',
      'sonar.testExecutionReportPaths':  'coverage/test-reporter.xml'
    }
  }, () => {});
```

在package.json加入以下幾行

```js
{
  .
  .
  .
  "scripts": {
    "sonar":  "node sonar-project.js",
    "test":  "jest --coverage"
  },
  "jest": {
    "testEnvironment":  "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ],
    "testResultsProcessor":  "jest-sonar-reporter"
  },
  "jestSonar": {
    "reportPath":  "coverage",
    "reportFile":  "test-reporter.xml",
    "indent":  4
  }
  .
  .
  .
}
```

## 測試

> npm run test

就可以看到類似下面的測試的結果
```sh

> fabric-opa@0.1.0 unitTest /Users/wayne.lee/Desktop/BOLT/Project/ASUS/gitea-fabric-opa
> jest --coverage src

 PASS  src/test/Model.test.js
 PASS  src/test/Utils.test.js

----------|---------|----------|---------|---------|-----------------------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-----------------------------------
All files |   64.09 |     53.9 |      58 |   66.31 |
 Model.js |   66.67 |      100 |      50 |   66.67 | 6
 Utils.js |   64.07 |     53.9 |   58.16 |    66.3 | ...00,420,436,447,454-456,476-578
----------|---------|----------|---------|---------|-----------------------------------

Test Suites: 2 passed, 2 total
Tests:       12 skipped, 25 passed, 37 total
Snapshots:   0 total
Time:        2.723 s
```

測試結果會在coverage裡，sonar-project.js會用到

> npm run sonar

上傳測試結果，就可以在SonarQube看到被自動建起來的同名專案。
