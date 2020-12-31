# Istio

```
source: https://ithelp.ithome.com.tw/users/20104679/ironman/2825
https://ithelp.ithome.com.tw/users/20129516/ironman/3135
https://www.servicemesher.com/istio-handbook/
https://ithelp.ithome.com.tw/users/20122925/ironman/3537
```

## 前言

### Service Mesh(Istio)

![](https://philcalcado.com/img/service-mesh/6-a.png)
    
在 `NameSpace`、`Cluster`、`混合雲`、`External Service` 等多種區隔環境的情境下，各服務間的連接成了問題，而連線資訊可能還需要去修改到程式碼，相關維護成本就會變高，這邊採用了 `Sidecar Pattern` 的概念，使用 `Istio` 提供的 `Envoy Proxy` 去做到 `Service To Service`，減低對服務本身程式碼維護的衝擊。

![](https://philcalcado.com/img/service-mesh/mesh3.png)

### Kubernetes VS Istio

Kubernetes 在 Pod 之間的溝通都是採用 Service（一個抽象層）

而每個 k8s 的 node 中都會有一個 kube-proxy 的服務，用來處理到達 Service(不包含 ExternalName type) VIP 的網路流量

為什麼不用Kube-Proxy，因為Kube-Proxy有一些非常致命性的缺點：

- NodePort 的情況無法添加TLS服務
- 無法解析第七層協定ex Http,Http2,gRPC...等等
- 也必須再添加 Ingress 來建立複雜的 DestionRule

而 Kube-Proxy 可能會遇到的雷，可以直接看 `[Day03]為什麼我們要用Istio，Native Kubernetes有什麼做不到`

![](https://pbs.twimg.com/media/DlNQYQ9WsAEHc-n?format=jpg&name=medium)

使用istio可以很簡單的創建Service Mesh，而不需要對Service的程式碼進行任何修改與添加

## 安裝環境

### K3D(K3s In Docker)

Kubernetes Environment 環境建置，與 MiniKube 功能一樣

Install:

```
curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash
```

建立 k3s cluster:

```
k3d cluster create

# 將k3d kubeconfig 與 kubectl kubeconfig 連接
k3d kubeconfig get k3s-default >  KUBECONFIG
export KUBECONFIG=$PWD/KUBECONFIG


#簡單測試指令
kubectl get cs
kubectl get nodes
```

### 如何安裝 Istio Use istioctl

> 根據
> - https://aijishu.com/a/1060000000099275
> k3d 在关闭了traefik以避免端口冲突之后，即可在上面成功运行Istio
> - https://github.com/rancher/k3d/issues/104#issuecomment-542184960
> - https://github.com/rancher/k3d/issues/292

所以需要重新開一個 k3d

```
k3d cluster delete default

k3d cluster create --k3s-server-arg '--no-deploy=traefik'
```


```
curl -L https://istio.io/downloadIstio | sh -
cd istio-1.8.1
export PATH=$PWD/bin:$PATH

# 安裝
istioctl install --set profile=default -y

# 在該 ns 啟用
kubectl label namespace default istio-injection=enabled
```

## Istio 範例

可以跑個範例測試 istio

> 流程跟文件中的一樣 https://istio.io/latest/docs/setup/getting-started/

```
cd istio-1.8.1
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
```

會看到此時 pod 會是 2/2

```
$ kubectl get pod
NAME                              READY   STATUS    RESTARTS   AGE
details-v1-79c697d759-cgrbk       2/2     Running   0          3m23s
ratings-v1-7d99676f7f-mqtpq       2/2     Running   0          3m22s
productpage-v1-65576bb7bf-2n7cb   2/2     Running   0          3m22s
reviews-v2-6c5bf657cf-zd2wm       2/2     Running   0          3m23s
reviews-v3-5f7b9f4f77-pcsdh       2/2     Running   0          3m23s
reviews-v1-987d495c-ksg6k         2/2     Running   0          3m22s
```

驗證該測試服務已成功運行

```
$ kubectl exec "$(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}')" -c ratings -- curl -s productpage:9080/productpage | grep -o "<title>.*</title>"
<title>Simple Bookstore App</title>
```

### 建立對外 gateway

> [Istio Ingress Gateway](https://istio.io/latest/docs/concepts/traffic-management/#gateways)

```
kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
```

檢查現在配置是否正確

```
$ istioctl analyze
✔ No validation issues found when analyzing namespace: default.
```

### 設定 ingress IP 和 ports

根據下面方法設定 INGRESS_HOST、INGRESS_PORT 存取 gateway

#### Step1. 先確定 gateway 有在運行，設定 INGRESS_HOST、INGRESS_PORT

```
$ kubectl get svc istio-ingressgateway -n istio-system
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)                                                                      AGE
istio-ingressgateway   LoadBalancer   10.43.215.126   192.168.32.2   15021:31379/TCP,80:31723/TCP,443:30703/TCP,15012:32579/TCP,15443:30745/TCP   3h10m
```

如果 EXTERNAL-IP 有 ip，代表它提供 external load balancer 可用於 ingress gateway

```
$ export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
$ export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
$ export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].port}')
```

> 在某些環境可能是主機名字而不是 IP
> ```
> export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
> ```

如果 EXTERNAL-IP 值為 `<none>` 或 `<pending>` 代表它支援 ingress gateway 用於 external load balancer，因此需要將 service 改用 NodePort 的方式 [nodeport](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)

```
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')
```


#### Step2. Set GATEWAY_URL:

```
$ export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT
$ echo "$GATEWAY_URL"
```

### 驗證外部存取

```
curl http://$GATEWAY_URL/productpage
```

### dashboard

各種可視化工具

Kiali dashboard, Prometheus, Grafana, Jaeger.


1. install Kiali 和其他套件

```
kubectl apply -f samples/addons/kiali.yaml
kubectl apply -f samples/addons
kubectl rollout status deployment/kiali -n istio-system
```

2. Access dashboard.

```
$ istioctl dashboard kiali --address 0.0.0.0
http://localhost:20001/kiali

$ istioctl dashboard grafana --address 0.0.0.0
$ istioctl dashboard prometheus --address 0.0.0.0
$ istioctl dashboard jaeger --address 0.0.0.0
```

#### Tracing-jaeger

可使用Select pod tracing 服務的流向與觀測通過的服務的執行時間對於Debug也可以有相幫不錯的幫助

![](https://ithelp.ithome.com.tw/upload/images/20200903/201295169SKcpQZMZG.png)

> 使用範例 https://ithelp.ithome.com.tw/articles/10253028

#### Grafana

grafana 監控Istio Mesh 查看服務CPU Memory Disk用量，以及service 流向connection request所需時間 Latency延遲時間

![](https://ithelp.ithome.com.tw/upload/images/20200903/201295160V2eMzgAAO.png)

#### Kiali

可以追蹤所有服務動向，我覺得最好用的部分是可大觀來看服務，可選擇叢集該叢集內服務如何呼叫甚至跨叢集的呼叫都可從Kiali上的Graph查看，愈龐大的服務越可以表現出Kiali的好用之處，舉例來說：當如果有需要抽換服務A至A1時而BCD服務相依A此時線圖會是如下方狀態互相相依，而當線圖A服務為獨立狀態時可表示A服務以抽離A1 A1轉變為A狀態，可以藉此知道是否有落網之魚，進而降低遺漏抽換相依服務之問題

![](https://ithelp.ithome.com.tw/upload/images/20200903/20129516PPUK0WvYn6.png)

#### Prometheus

是一個開源監視系統和時間序列數據庫，可以將Prometheus與Istio一起使用，以記錄跟踪Istio和服務網格中應用程序的運行狀況的指標

> 使用範例 https://ithelp.ithome.com.tw/articles/10253271

### Uninstall 範例

```
$ kubectl delete -f samples/addons
```

## Istio Architecture

關於 Istio 網路架構（Istio Architecture）可分兩個部分

- Data Plane
- Control Plane

### Data Plane

在 Istio 整體架構裡都是採用Sidecar Pattern，在使用完 istio-injection 後，每次起 pod 時都會多幫你起個 `Envoy Proxy`，之後進出 pod 的流量都可以被 Envoy 攔截，嚴格來說 Istio 的 Data Plane 就是 Envoy Proxy

![](https://istio.io/latest/docs/ops/deployment/architecture/arch.svg)

多了 Envoy Proxy 後可以做到 `流量操作與控制`，實現了以下功能：

* Dynamic service discovery
* Load balancing(非常重要)
* TLS termination
* HTTP/2 and gRPC proxies(非常重要)
* Circuit breakers
* Health checks
* Staged rollouts with %-based traffic split
* Fault injection
* Rich metrics
* 流量控制

### Control Plane

可分為三大項：

1. Pilot
2. Galley
3. Ciadel

![](https://ithelp.ithome.com.tw/upload/images/20200903/20129516z4O6Eron9p.png)

#### Mixer

Mixer跨服務網格實施訪問控制和使用策略，並從Envoy代理和其他服務收集遙測數據。代理提取請求級別屬性，並將其發送到Mixer進行評估。

#### Piloy

![](https://ithelp.ithome.com.tw/upload/images/20200903/20129516J9DeGRfZo6.png)

Data Plane 的 Envoy Sidecar 正是透過 Piloy 提供 service discovery，此外，該路由也提供流量管理功能（canary），超時，重試，斷路器等

#### Galley

Galley是Istio的配置驗證，提取，處理和分發組件。它負責將其餘Istio組件與從底層平台獲取用戶配置的細節隔離開來

#### Ciadel

使用Citadel，主要目的服務間的憑證身份管理達到服務間的安全性，運營可以基於服務身份而不是相對不穩定的第3層或第4層網絡標識符來實施策略

### Istio ingressgateway egressgateway

![](https://blogs.sap.com/wp-content/uploads/2019/02/Screenshot-2019-02-08-at-16.02.10.png)

在 Istio 中 istio-ingressgateway 掌管 Service Mesh 的入口，istio-egressgateway 則是掌管 Service Mesh 的出口。

#### Istio Ingressgateway

![](https://miro.medium.com/max/1494/1*WVX2nrMaLsYH2u_R3oViiA.png)

一般來說大多的Kubernetes Cluster都會使用Ingress Control當作Cluster的入口，但是如果要將流量也導到Service Mesh所掌管的服務，就必須建立許多Istio的物件，最好的方式是採用下圖：

#### Istio egressgateway

![](https://ithelp.ithome.com.tw/upload/images/20200903/20129516r9u0X6fuoB.png)

#### EX:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: my-gateway-name #指定gateway配置的代理，如具有標籤app: my-gateway-name的pod
spec:
  selector:
    istio: my-gateway  #對應virtualservice spec.gateways 
  servers:
  - port: #加密傳輸
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      serverCertificate: /etc/istio/ingressgateway-certs/tls.crt #設定憑證路徑
      privateKey: /etc/istio/ingressgateway-certs/tls.key  #設定憑證路徑
    hosts:
     - "*" #該服務對應domain
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
     - "*" #該服務對應domain
```

用 gateway 的方式綁定 domain，virtualservice 轉導可以做到將 Istio 監控服務綁到你所需要的服務上，以下以 Istio 監控為實例，可透過此方式省去 port-forward 方式連線服務，讓使用可以更加便捷。

## 常用 resource

### Virtualservice

在 Istio 的服務`Istio-gateway -> Gateway ->  virtualservice -> service -> pod` 的方向流動

![](https://i.imgur.com/aSzOvHl.png)

yaml 設定：

- hosts
    發送流量的目標主機，可以是帶有通配符前綴的 DNS 名稱或 IP 地址，適用於 HTTP 和 TCP 服務，若不是使用域名（FQDN）而是使用 Kubernetes Service 要記得使用完整名稱 testService.{namespace}.svc.cluster.local 不建議使用 testService，因為會容易導致 testService 指向 default 的 namespace
- gateways
    Gateways 是一個[]string 可以多對一，Sidecar 會據此使用路由，單個 VirtualService 可以用於 mesh 內的 Sidecar 一個或多個 Gateway。在特定協議路由的匹配條件中。如果提供了 gateway 稱列表，則規則將僅適用於 gateway。要讓規則同時對gateway和網格內服務生效，請將其指定mesh指定為 gateway 名稱之一。
- http
    HTTP 流量規則的有序列表。這個列表對名稱前綴為 http-、http2-、grpc- 的服務端口，或者協議為 HTTP、HTTP2、GRPC 以及終結的 TLS，另外還有使用 HTTP、HTTP2 以及 GRPC 協議的 ServiceEntry 都是有效的。進入流量會使用匹配到的第一條規則。
- tls
    一個有序列表，對應的是透傳 TLS 和 HTTPS 流量。路由過程通常利用 ClientHello 消息中的 SNI 來完成。TLS 路由通常應用在 https-、tls- 前綴的平台服務端口，或者經 Gateway 透傳的 HTTPS、TLS 協議端口，以及使用 HTTPS 或者 TLS 協議的 ServiceEntry 端口上。
    
    注意：沒有關聯 VirtualService 的 https- 或者 tls- 端口流量會被視為透傳 TCP 流量。
- tcp
    TCP路由將應用於不是HTTP或TLS端口的任何端口。使用匹配傳入請求的第一條規則

#### EX:

`Gateway`

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: test-gateway #會對應下面使用的Vertaulservice
spec:
  selector:
    istio: test-gateway # Istio gateway implementation
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      serverCertificate: /etc/istio/ingressgateway-certs/tls.crt #設定自簽憑證
      privateKey: /etc/istio/ingressgateway-certs/tls.key #設定自簽憑證
    hosts:
     - "*" #也可使用整網域名（FQDN）
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
      - "www.test.com" #只允許此網址當作入口
```

`Virtualservice`

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: vs-test #名稱
spec:
  hosts:
      www.test.com #這邊使用完整網域名（FQDN）
  gateways:
      test-gateway #istio-ingressgateway name
  http:
  - route:
    - destination:
        port:
          number: 80
        host: realTestService #導向得service
```

### DestinationRule

DestinationRule 定義路由發生後應用於服務流量的策略

K8s Load Balancer 無法分配 HTTP2 的長連線，所以如果服務是使用 GRPC 這類長連線，會導致分流失敗，這邊就可以用個 Proxy 來做 Load Balancer

![](https://i.imgur.com/VOFPBs0.png)

#### EX

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: my-destination-rule
spec:
  host: my-svc 
  trafficPolicy:     #默認的策略模型為隨機
    loadBalancer:
      simple: RANDOM
  subsets:        
  - name: v1  #subset1流量轉發具有標籤version:v1的deployment對應服務上
    labels:
      version: v1
  - name: v2  #subset2流量轉發具有標籤version:v2的deployment對應服務上,指定策略輪詢
    labels:
      version: v2
    trafficPolicy:
      loadBalancer:
        simple: ROUND_ROBIN
  - name: v3   #subset3流量轉發具有標籤version:v3的deployment對應服務上
    labels:
      version: v3
```


### 內部憑證

Istio 在內部服務的流量也是透過憑證的機制作加密，官方也提供查看憑證與更新憑證的實作

下載官方腳本

> $ wget https://raw.githubusercontent.com/istio/tools/release-1.5/bin/root-transition.sh
> $ chmod +x root-transition.sh

查看憑證到期時間

> $ ./root-transition.sh check-root
> Fetching root cert from istio-system namespace...
> base64: invalid input
> Your Root Cert will expire after
>    Dec 23 03:16:34 2030 GMT
> Current time is
>   Fri Dec 25 03:16:49 UTC 2020
> 
> 
> =====YOU HAVE 3649 DAYS BEFORE THE ROOT CERT EXPIRES!=====

確認 Istio 版本 (在 Istio `1.0.8` `1.1.8`以前無法更新憑證)

> $ ./root-transition.sh check-version
> Checking namespace: istio-test
> Istio proxy version: 1.8.1

更換憑證(Envoy 熱重啟可能會影響到你的 cluster 內連線中斷)

> $ ./root-transition.sh root-transition

查看是否更新完成

> $ ./root-transition.sh verify-certs
> This script checks the current root CA certificate is propagated to all the Istio-managed workload secrets in the cluster.
> Root cert MD5 is 0f94cfeda0222acc5db5244de84e5e08
> Checking namespace: kube-node-lease
> Checking namespace: istio-system
> Checking namespace: default
> Checking namespace: istio-test
> Checking namespace: httpbin
> 
> =====All Istio mutual TLS keys and certificates match the current root!=====

查看Envoy是否已收到新證書

> kubectl exec [YOUR_POD] -c istio-proxy -n [YOUR_NAMESPACE] -- curl http://localhost:15000/certs | head -c 1000


憑證的自動更新可能是在你非預期時段，因此建議平時維護時定期更新，不過在Istio 1.6.X以上版本似乎解決了這問題，可以找找相關文章

### rate limit


```yaml
apiVersion: networking.istio.io/v1alpha3
kind: EnvoyFilter
metadata:
  name: filter-ratelimit
  namespace: istio-system
spec:
  configPatches:
    applyTo:  HTTP_ROUTE
    match:
      context:  GATEWAY
      routeConfiguration:
        vhost:
          name:  www.test.com:80 #對應網址
          route:
            action:  ANY
            name:    api_path #API路徑
    patch:
      operation:  MERGE
      value:
        route:
          rate_limits:
            actions:
              generic_key:
                descriptor_value:  testkey #ratelimit服務限制key
              remote_address:
    applyTo:  HTTP_ROUTE
    match:
      context:  GATEWAY
      routeConfiguration:
        vhost:
          name:  www.test.com:443
          route:
            action:  ANY
            name:    api_path
    patch:
      operation:  MERGE
      value:
        route:
          rate_limits:
            actions:
              generic_key:
                descriptor_value:  testkey
```

可以透過 Istio 設定 API 的使用頻率，一方面可以阻擋惡意攻擊，另一方面可以保護系統不被過大的瞬間流量打穿導致崩壞

## Debug

### Log

Istio 預設是關閉的，可以通過將設定 accessLogFile 來輸出 log

https://istio.io/latest/docs/tasks/observability/logs/access-log/#enable-envoy-s-access-logging

打開後就可以直接 kubectl logs 某個 pod 的 istio-proxy 或使用 k9s（下圖）來查看

![](https://ithelp.ithome.com.tw/upload/images/20200921/20129516M7k3YLN4Iu.png)

