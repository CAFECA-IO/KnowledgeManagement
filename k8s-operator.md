# Kubernetes - Operator

```
source: https://jimmysong.io/kubernetes-handbook/concepts/extension.html
- [如何从零开始编写一个Kubernetes CRD](https://www.servicemesher.com/blog/kubernetes-crd-quick-start/)
- [Kuberneters(K8s)CRD资源详解](https://www.jianshu.com/p/cc7eea6dd1fb)
- https://ithelp.ithome.com.tw/articles/10227731
- https://staight.github.io/2019/10/08/Kubernetes-CRD%E7%AE%80%E4%BB%8B/
- https://access.redhat.com/documentation/zh-cn/openshift_container_platform/4.2/html/operators/crds
- https://ithelp.ithome.com.tw/articles/10215845
```

### info

Operator = CRD + Controller

CRD 是對 Kubernetes API 的擴展，kubernetes 中的每種 resource object 都是 API object，每種 YAML 中的 type 都是已經定義的資源，而自定義資源(CRD)與內建的已定義資源一樣都能操控 kubectl

是否需要 CRD 呢？ [Should I add a custom resource to my Kubernetes Cluster?](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#should-i-add-a-custom-resource-to-my-kubernetes-cluster) 文中有提到適合的情境

> 把 minikube 記憶體加大一點，以免有些操作跑不動
> 
> ```
> minikube start --memory 8192
> ```

### CRD

`resourcedefinition.yaml`：

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # 名称必须符合下面的格式：<plural>.<group>
  name: crontabs.stable.example.com
spec:
  # REST API 使用的组名称：/apis/<group>/<version>
  group: stable.example.com
  # REST API 使用的版本号：/apis/<group>/<version>
  version: v1
  # Namespaced 或 Cluster
  scope: Namespaced
  names:
    # URL 中使用的复数名称: /apis/<group>/<version>/<plural>
    plural: crontabs
    # CLI 中使用的单数名称
    singular: crontab
    # CamelCased 格式的单数类型。在清单文件中使用
    kind: CronTab
    # CLI 中使用的资源简称
    shortNames:
    - ct
​```创建该 CRD：```bash
kubectl create -f resourcedefinition.yaml
​```访问 RESTful API 端点如 <http://172.20.0.113:8080> 将看到如下 API 端点已创建：```bash
/apis/stable.example.com/v1/namespaces/*/crontabs/...
```

使用：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * /5"
  image: my-awesome-cron-image
```

## Controller

但是 CRD 只定義了資源，沒有對應的 Controller 是不會有任何功能的

## Operator Framework

這邊使用了 [operator-framework](https://operatorframework.io/) 

會簡單的幫你產生 CRD 和 controller(使用 helm 幫你建立環境)，功能如下圖

![](https://i.imgur.com/SSQvsnd.jpg)

- [quickstart](https://sdk.operatorframework.io/docs/building-operators/helm/quickstart/)
- [tutorial](https://sdk.operatorframework.io/docs/building-operators/helm/tutorial/)

### 安裝 Command

https://sdk.operatorframework.io/docs/installation/

### kustomize

這邊會使用到 kustomize 所以也需要先安裝

kustomize 為 Helm 的模板語言，可以簡化大量重複的 Helm

### init 專案

這邊會產生 `api: v1alpha1` 名字叫 `CreateNetwork`, `group: baas.twcc` 的 CRD

```
$ operator-sdk init --plugins=helm --project-name=fabric-operator --group=baas.twcc --version=v1alpha1 --kind=CreateNetwork
```

專案結構如下：

```
.
├── Dockerfile   - Contoller 的 dockerfile
├── Makefile
├── PROJECT
├── config       - CRD, role, contoller manager 的 k8s yaml 檔案
│   ├── crd      - CRD
│   ├── default
│   ├── manager  - Controller 部署
│   ├── prometheus
│   ├── rbac     - CRD 相關權限設定
│   ├── samples
│   └── scorecard
├── helm-charts  - helm chart
│   └── createnetwork
└── watches.yaml - contoller 啟動後關注的 CRD 和設定 Helm 位置
```

簡單說:

- helm chart 為 k8s 模板（可以想像成 docker-compose），這邊存放著 CR 建立後要建立的 Helm chart 模板
- 將整個專案 build 成 docker image，在透過 config/manager 內的 yaml 部署整個 controller 到 k8s 上

流程如下:

![](https://i.imgur.com/46FFxrg.jpg)

### Helm

將要部署的 Helm 丟到 helm-charts/createnetwork 底下

### 部署 CRD

kustomize build config/crd | kubectl apply -f -


### 部署 Role 和 Controller

cd config/manager 
kustomize edit set image registry.tmpstg.twcc.tw/fabric-network/nginx-operator:latest
cd ../..
kustomize build config/default | kubectl apply -f -

### 測試

當上面兩項都部署完成後，可以使用

```
kubectl get all -l "control-plane=controller-manager" -n fabric-operator-system
```

來查看部署是否成功

成功部署後，可以使用 `config/samples` 來測試

```
kubectl apply -f config/samples
```

此時會建立該 CRD，然後 controller-manager 會觀測到，並透過 Helm 部署一組環境到 K8S 上

### 新增 CRD 與對應的檔案結構

```
operator-sdk create api --group baas.twcc --version=v1alpha1 --kind=CreateChannel
```


