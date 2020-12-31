# Drone

docker base 的 CI/CD 工具

透過寫好的 .drone.yml(pipeline) 檔執行要做的 CI/CD 工作

使用前需要到 drone 上 active 專案

![](https://i.imgur.com/eSiaR82.png)

pipeline 可參考 https://gitea-6f1861e5.baas.tmpstg.twcc.tw/TWCC-BAAS/twcc3c/src/branch/master/.drone.yml

!!!! production 名稱為 `.drone-pro.yml`

`.drone.yml`

```yaml
kind: pipeline
type: kubernetes
name: fabric-api-service

clone:
  disable: true

steps:
  - name: clone-project   # pipeline step name
    image: registry.tmpstg.twcc.tw/fabric-network/alpine/git:v2.26.2 # 要跑的 image，這裡是 git 環境的 docker image
    settings:
      repo: TWCC-BAAS/fabric-api-service  # 要 clone 的 image
      username:
        from_secret: gitea_username # 帳號在 drone setting 頁內的 Secrets 那邊設定，下面有圖說明
      password:
        from_secret: gitea_password # 密碼 同上
    commands:
      - sleep 15
      - git clone $DRONE_REMOTE_URL .
      - git checkout $DRONE_COMMIT

  - name: Publish
    image: registry.tmpstg.twcc.tw/drone/kaniko:temp-staging-v0.0.1 # 這個 image 用來打包 docker 並推上 docker hub 用
    resources:
      requests:
        cpu: 512
        memory: 512MiB
      limits:
        cpu: 1024
        memory: 1024MiB
    settings:
      username:
        from_secret: harbor_username
      password:
        from_secret: harbor_password
      repo: fabric-network/fabric-api-service
      registry: registry.tmpstg.twcc.tw
      dockerfile: ./Dockerfile
      tags: latest
    commands:
      - echo "172.22.28.73 registry.tmpstg.twcc.tw" >> /etc/hosts
      - /busybox/sh /kaniko/plugin.sh

trigger:  # 整段 pipeline 觸發條件
  branch:
    - feature/add-cicd  # 當 feature/add-cicd 分支有更動時觸發

node_selector:
  kubernetes.io/hostname: bcapptcstg04
```

目前流程只有兩步：

- clone 專案
- build Dockerfile 後推上 Harbor

目前部署在 drone CI 上 build docker 時會卡在 npm install 後，所以現在本機 build 完後直接上傳到 Harbor 了

### drone Secrets

設定 pipeline yaml 中用的帳號密碼

![](https://i.imgur.com/WXtORCI.png)