# ArgoCD

> source: https://argoproj.github.io/argo-cd/getting_started/

## Connet repostitories

Settings > Repostitories > CONNECT REPO USING HTTPS

![](https://i.imgur.com/Y4xfTZn.png)

## Create Projects

Settings > Projects

![](https://i.imgur.com/XASTmNm.png)

## Create App

![](https://i.imgur.com/1fSC96n.png)

依序設定

- 部署 app 名稱
- argoCD 專案名稱
- sync 策略

![](https://i.imgur.com/2UJzDmu.png)

- repo url
- repo target
- 部署腳本放置位置

![](https://i.imgur.com/DPx9NuH.png)

- k8s cluster
- k8s namespace

![](https://i.imgur.com/Ca2cyhv.png)

![](https://i.imgur.com/2b8E6ur.png)

當專案需要部署時，可以點 SYNC 按鈕來自動部署

也可以將 app 的 sync 策略改成自動的

APP DETAILS > Sync Policy > ENABLE AUTO-SYNC

![](https://i.imgur.com/MPYopsw.png)
