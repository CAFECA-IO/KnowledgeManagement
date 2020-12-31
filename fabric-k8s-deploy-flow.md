# Fabric K8s deploy flow

## Flow

![](https://i.imgur.com/HN0GySH.jpg)

學習地圖

- Drone CI
- ArgoCD
- K8S
    - Helm Chart
        - kustomize
    - Operator
        - operator-framework
    - Istio
- K6

## Drone

- [Drone](./drone.md)

## Harbor

docker hub

參考文件：https://gitea-6f1861e5.baas.tmpstg.twcc.tw/TWCC-BAAS/twcc3c/src/branch/master/trainingDocs/src/Harbor/Harbor.md

現在在 `參考文件` 中 `7. 將config檔建成secret供佈屬用` 須透過 kubectl create secret 來建立


## ArgoCD

- [ArgoCD](./argo.md)

## K8s

- K8S(代補)

- Helm(代補)

### Operator

- [Kubernetes - Operator](./k8s-operator.md)

### Service Discovery

- [Istio](./isto.md)

## load test

- [K6 - load testing tool](./k6-load-testing-tool.md)