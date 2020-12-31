# K6 - load testing tool 

## Getting started

### What is k6?

壓測工具


### install

> https://k6.io/docs/getting-started/installation

> docker pull loadimpact/k6

### run 

`script.js`

```js
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://test.k6.io');
  sleep(1);
}

```

> $ k6 run script.js

or

> $ docker run -i loadimpact/k6 run - <script.js

### VU(virtual user)

> k6 run --vus 10 --duration 30s script.js

or

> docker run -i loadimpact/k6 run --vus 10 --duration 30s - <script.js

Running a 30-second, 10-VU load test

### Results output

提供 (min/max/avg/percentiles) 等統計資訊輸出

> $ k6 run --summary-trend-stats="avg,p(99)" script.js

也提供各種輸出格式

PLUGIN | USAGE
-------|-------
Amazon CloudWatch | k6 run --out statsd
Apache Kafka | k6 run --out kafka
Cloud | k6 run --out cloud
CSV | k6 run --out csv
Datadog | k6 run --out datadog
InfluxDB | k6 run --out influxdb
JSON | k6 run --out json
New Relic | k6 run --out statsd
StatsD | k6 run --out statsd

也可以同時輸出

```
$ k6 run \
    --out json=test.json \
    --out influxdb=http://localhost:8086/k6
```

或是導出檔案

> $ k6 run --summary-export=export.json script.js


## Using k6

ES6 語法的腳本

### HTTP Requests

[JavaScript API](https://k6.io/docs/javascript-api/)

#### HTTP Request Tags

預設會在 request 時夾帶 tags，可以方便分析時使用

包含下列幾項資料

NAME | DESCRIPTION
-----|--------------
name | Defaults to URL requested
method | Request method (GET, POST, PUT etc.)
status | response status
url | defaults to URL requested

#### URL Grouping

當有動態 URL 或是多組不同 URL 的 request 需要歸類在一起時（如下面的 k6 Cloud 圖）可以用到

EX:

```js
for (var id = 1; id <= 100; id++) {
  http.get(`http://example.com/posts/${id}`, {
    tags: { name: 'PostsItemURL' },
  });
}

// tags.name=\"PostsItemURL\",
// tags.name=\"PostsItemURL\",
```

#### k6 Cloud Results

分類後如下（圖為 k6 Cloud）

![](https://k6.io/docs/static/8f2d63ba57dc704583eb43305650a743/a2c06/cloud-insights-http-tab.png)

### Metrics

除了內建的資料外

![](https://k6.io/docs/static/fbb3d72dcad93e08cb2730ead338f57a/7b1d8/output-to-stdout.png)

除此之外也能自行新增，這邊就不展開說明（直接看文件）

> [metrics 各項說明](https://k6.io/docs/using-k6/metrics)

### Checks

如 Assert 之類的功能

![](https://k6.io/docs/static/fe8833d5bfa9e4570e043fdf94e236b8/47a22/multiple-checks-output.webp)

### Thresholds

測試中通過於否的標準

EX:

- 系統錯誤不能超過 1%
- 95% 的 Response time 應該小於 200ms
- 特定的 Endpoint 必須 Response time 必須小於 300ms

該值對於 load-testing automation 

![](https://k6.io/docs/static/1a159a97d2e50fb37eb8ee194e838e43/3434a/executing-with-a-threshold.png)

### Options

[doc](https://k6.io/docs/using-k6/options)

### Test life cycle

```javascript
// 1. init code

export function setup() {
  // 2. setup code
}

export default function (data) {
  // 3. VU code
}

export function teardown(data) {
  // 4. teardown code
}
```

Skip setup and teardown execution

> $ k6 run --no-setup --no-teardown ... 

### Tags and Groups

```javascript
import { group } from 'k6';

export default function () {
  group('user flow: returning user', function () {
    group('visit homepage', function () {
      // load homepage resources
    });
    group('login', function () {
      // perform login
    });
  });
}

```
