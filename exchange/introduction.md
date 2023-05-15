# Exchange Introduction
- Order Book
- Match
- Trade Book

```
Interface orderBook {
  private orders: order[];
  
  constructor();
  add(order: order) void;
  update(id: string, order: order) void;
  remove(id: string) void;
}
```

```
Interface tradeBook {
  private trades: trade[];
  
  constructor();
  add(trade: trade) void;
  toLineChart()
  toCandleStickChart()
}
```

```
Interface Exchange {
  private orderBoook: orderBook;
  private tradeBook: tradeBook;
  
  constructor();
  public addOrder(): order;
  public match();
}
```

## Order Book
| order id | from | to | timestamp |
|:-:|:-:|:-:|:-:|
|1|ETH<br>60|USDT<br>710|2023-05-11 11:17:07|
|2|ETH<br>17|USDT<br>75|2023-05-11 11:17:14|
|3|USDT<br>700|ETH<br>87|2023-05-11 11:17:18|
|4|ETH<br>91|USDT<br>575|2023-05-11 11:17:19|
|5|ETH<br>7|USDT<br>64|2023-05-11 11:17:21|
|6|ETH<br>55|USDT<br>986|2023-05-11 11:17:22|
|7|USDT<br>431|ETH<br>25|2023-05-11 11:17:25|
|8|USDT<br>682|ETH<br>33|2023-05-11 11:17:34|
|9|USDT<br>804|ETH<br>21|2023-05-11 11:17:52|

## Match
1. new Taker Order
2. sort Maker Orders
3. try to fill first Maker Order
4. redo 3. till no match or no maker order

```
Taker.from.quantity = TFQ
Taker.to.quantity = TTQ
Taker.from.asset = TFA
Taker.to.asset = TTA
Maker.from.quantity = MFQ
Maker.to.quantity = MTQ
Maker.from.asset = MFA
Maker.to.asset = MTA
```
```
TFA = MTA
TTA = MFA
TFQ * MFQ / TTQ / MTQ > 1
```

### Market Maker
increase liquidity

### Market Taker
decrease liquidity

### Time Priority
|new order|from|to|timestamp|
|:-:|:-:|:-:|:-:|
|9|USDT<br>804|ETH<br>21|11:17:52|

| market order | from | to | timestamp |
|:-:|:-:|:-:|:-:|
|1|ETH<br>60|USDT<br>710|2023-05-11 11:17:07|
|2|ETH<br>17|USDT<br>75|2023-05-11 11:17:14|
|4|ETH<br>91|USDT<br>575|2023-05-11 11:17:19|
|5|ETH<br>7|USDT<br>64|2023-05-11 11:17:21|
|6|ETH<br>55|USDT<br>986|2023-05-11 11:17:22|

### Price Priority
|new order|from|to|timestamp|
|:-:|:-:|:-:|:-:|
|9|USDT<br>804|ETH<br>21|2023-05-11 11:17:52|

| market order | from | to | timestamp |
|:-:|:-:|:-:|:-:|
|2|ETH<br>17|USDT<br>75|2023-05-11 11:17:14|
|4|ETH<br>91|USDT<br>575|2023-05-11 11:17:19|
|5|ETH<br>7|USDT<br>64|2023-05-11 11:17:21|
|1|ETH<br>60|USDT<br>710|2023-05-11 11:17:07|
|6|ETH<br>55|USDT<br>986|2023-05-11 11:17:22|


## Trade Book
- trade
- asset 1
- asset 2
- direct
- price
- amount
- timestamp

### Price Priority Market
| trade | asset1 | asset2 | direct | price | amount | timestamp |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|1|ETH|USDT|BUY|4.412|17|2023-05-11 11:17:52|
|2|ETH|USDT|BUY|6.32|4|2023-05-11 11:17:52|

|Taker|from|to|
|:-:|:-:|:-:|
|9|USDT<br>804|ETH<br>21|
|9|USDT<br>729|ETH<br>4|
|9|USDT<br>703.72|ETH<br>0|

### Time Priority Market 

| trade | asset1 | asset2 | direct | price | amount | timestamp |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1 | ETH | USDT | BUY | 11.83 | 21 | 2023-05-11 11:17:52 |

| Taker | from | to |
| --- | --- | --- |
| 9 | USDT804 | ETH21 |

### Line Charts
```
type line = {
  average: number;
  volume: number;
  timestamp: number;
}
```
```
  toLineChart(interval: number, length: number): line[] {
    const lines: line[] = [];
    const intervalMs = interval * 1000;
    const lastTimestamp = this.trades[this.trades.length - 1].timestamp;
    const firstTimestamp = lastTimestamp - (length * intervalMs);
    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const trades = this.trades.filter(t => t.timestamp >= i && t.timestamp < i + intervalMs);
      if (trades.length > 0) {
        const average = trades.reduce((sum, t) => sum + t.price, 0) / trades.length;
        const volume = trades.reduce((sum, t) => sum + t.quantity, 0);
        lines.push({ average, volume, timestamp: i });
      }
    }
    return lines;
  }
```

### Candlestick Charts
```
type candleStick = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
};
```
```
  toCandleStick(interval: number, length: number): candleStick[] {
    const candleSticks: candleStick[] = [];
    const intervalMs = interval * 1000;
    const lastTimestamp = this.trades[this.trades.length - 1].timestamp;
    const firstTimestamp = lastTimestamp - (length * intervalMs);

    let candleStick: candleStick | undefined;
    for (let i = firstTimestamp; i <= lastTimestamp; i += intervalMs) {
      const trades = this.trades.filter(t => t.timestamp >= i && t.timestamp < i + intervalMs);
      if (trades.length > 0) {
        const open = trades[0].price;
        const close = trades[trades.length - 1].price;
        const high = Math.max(...trades.map(t => t.price));
        const low = Math.min(...trades.map(t => t.price));
        const volume = trades.reduce((sum, t) => sum + t.quantity, 0);
        candleStick = { open, high, low, close, volume, timestamp: i };
        candleSticks.push(candleStick);
      }
    }

    return candleSticks;
  }
```
### Data Prediction
- period 100ms
- linear regression
- after trade 3

| trade | asset1 | asset2 | direct | price | amount | timestamp |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|1|ETH|USDT|BUY|4.412|17|2023-05-11 11:17:52|
|2|ETH|USDT|BUY|6.32|4|2023-05-11 11:17:54|
|3|ETH|USDT|BUY|7|1|2023-05-11 11:17:55|

- Prediction Trade 4
```
T4.asset1 = T3.asset1 = ETH
T4.asset2 = T3.asset2 = USDT
T4.direct = T3.direct = BUY
T4.price = T3.price + ((T3.price - T2.price) / (T3.timestamp - T2.timestamp) * period) = 7 + ((7 - 6.32) / (1683775075000 - 1683775074000) * 100) = 7.068
T4.amount = 0
T4.timestamp = T3.timestamp + period = '2023-05-11 11:17:55.1'
```
> caution: Exception if T3.timestamp === T2.timestamp

- Prediction Trade 5
```
T5.asset1 = T4.asset1 = ETH
T5.asset2 = T4.asset2 = USDT
T5.direct = T4.direct = BUY
T5.price = T4.price + ((T4.price - T3.price) / (T4.timestamp - T3.timestamp) * period) = 7.068 + ((7.068 - 7) / (1683775075100 - 1683775075000) * 100) = 7.136
T5.amount = 0
T5.timestamp = T4.timestamp + period = '2023-05-11 11:17:55.2'
```

| trade | asset1 | asset2 | direct | price | amount | timestamp |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|1|ETH|USDT|BUY|4.412|17|2023-05-11 11:17:52|
|2|ETH|USDT|BUY|6.32|4|2023-05-11 11:17:54|
|3|ETH|USDT|BUY|7|1|2023-05-11 11:17:55|
|4|ETH|USDT|BUY|7.068|0|2023-05-11 11:17:55.1|
|5|ETH|USDT|BUY|7.136|0|2023-05-11 11:17:55.2|

### Real Market with Price Priority and Data Prediction
- tradeBook
- lineChart
- tickerStickChart

### Real Market with Time Priority and Data Prediction
- tradeBook
- lineChart
- tickerStickChart
