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
|3|USDT<br>708|ETH<br>18|2023-05-11 11:17:18|
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
### Price Priority Market
| trade | from | to | timestamp |
|:-:|:-:|:-:|:-:|
|1|USDT<br>75|ETH<br>17|2023-05-11 11:17:52|
|2|USDT<br>25.28|ETH<br>4|2023-05-11 11:17:52|

|Taker|from|to|
|:-:|:-:|:-:|
|9|804|21|
|9|729|4|
|9|703.72|0|

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

| trade | from | to | timestamp |
|:-:|:-:|:-:|:-:|
|1|USDT<br>75|ETH<br>17|2023-05-11 11:17:52|
|2|USDT<br>25.28|ETH<br>4|2023-05-11 11:17:54|
|3|USDT<br>7|ETH<br>1|2023-05-11 11:17:55|

| trade | from | to | timestamp |
|:-:|:-:|:-:|:-:|
|1|USDT<br>75|ETH<br>17|2023-05-11 11:17:52|
|2|USDT<br>25.28|ETH<br>4|2023-05-11 11:17:54|
|3|USDT<br>7|ETH<br>1|2023-05-11 11:17:55|
|4|USDT<br>7.068|ETH<br>1|2023-05-11 11:17:55.1|
|4|USDT<br>7.136|ETH<br>1|2023-05-11 11:17:55.2|

### Real Market with Price Priority and Data Prediction
- tradeBook
- lineChart
- tickerStickChart

### Real Market with Time Priority and Data Prediction
- tradeBook
- lineChart
- tickerStickChart
