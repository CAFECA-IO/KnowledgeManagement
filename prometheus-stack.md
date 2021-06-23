# prometheus stack

###### tags: `note`, `prometheus`, `grafana`

## prometheus stack

- prometheus: monitoring system and time series database.
- grafana: The open and composable observability and data visualization platform. Visualize metrics, logs, and traces from multiple sources like Prometheus, Loki, Elasticsearch, InfluxDB, Postgres and many more.

![](https://camo.githubusercontent.com/f14ac82eda765733a5f2b5200d78b4ca84b62559d17c9835068423b223588939/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f70726f6d6574686575732f70726f6d65746865757340633334323537643036396336333036383564613335626365663038343633326666643564363230392f646f63756d656e746174696f6e2f696d616765732f6172636869746563747572652e737667)

## install by docker

公司環境都是使用 docker 的安裝方式安裝

### Grafana

default login info admin/admin

```
docker run -d -p 3000:3000 --name grafana grafana/grafana:6.5.0
```

### node-exporter

Exporter for machine metrics

在需要監控的主機裝就好了

```
docker run -d \
  --net="host" \
  --pid="host" \
  --name node-exporter \
  -v "/:/host:ro,rslave" \
  quay.io/prometheus/node-exporter:latest \
  --path.rootfs=/host
```

### Prometheus

先設定好 prometheus config

`prometheus/prometheus.yml`

```yaml
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  # 監控的 metric 位置，指向 node-exporter 安裝的主機
  - job_name: 'prometheus'
    static_configs:
     - targets: ['10.110.86.130:9100']
       labels:
          instance: 'local-01'
          platform: 'sh'
```

安裝 prometheus

```
docker run -d \
    -p 9090:9090 \
    -v /home/blockchain/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
    --name prometheus \
    prom/prometheus
```

## Prometheus

`http://10.110.86.130:9090`

這邊紀錄了所以收集來的監控資訊

### Target

```
http://10.110.86.130:9090/targets
```

可以看到 targets 的狀況（也就是 prometheus config 設定那些目標

![](https://i.imgur.com/5X5SVPy.png)

### Graph

可以直接將收集來的資料產生圖片

![](https://i.imgur.com/l4t7pAT.png)

## Grafana

```
http://10.110.86.130:3000
```

顯示介面、告警

### Dashboard(Import)

可以在官方的圖表庫中 [Official & community built dashboards](https://grafana.com/grafana/dashboards) 找別人設定好的圖來用

隨邊找個 postgres 模板

![](https://i.imgur.com/2COnLp8.png)

點下 `Copy ID to Clipboard` 後，回到 Grafana，按下 Create > Import

![](https://i.imgur.com/J64MZDW.png)

貼上 Dashboard ID

![](https://i.imgur.com/2sMBdvo.png)

按下 Load 後，就可以匯入 template 了

![](https://i.imgur.com/6YRk6vx.png)

### Dashboard(New)

或是自己新增

![](https://i.imgur.com/YSw1LYv.png)

#### Query

使用 [Querying basics | Prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/) 來過濾 Metrics 資料

![](https://i.imgur.com/TiDXCPz.png)

#### Visualization

資料源過濾完後，可以選擇要顯示的圖表樣式

![](https://i.imgur.com/LJb7OAc.png)

#### Alert

告警服務，這邊需要先設定要連接的平台

![](https://i.imgur.com/zij5Fgl.png)

![](https://i.imgur.com/wthpUQn.png)

![](https://i.imgur.com/JgzcigX.png)

然後回到顯示頁面的 Alert 頁

Conditions 觸發的情況下，推到 Notification 那邊

![](https://i.imgur.com/RuqXKrZ.png)

**slack**

![](https://i.imgur.com/F7vLSWU.png)

