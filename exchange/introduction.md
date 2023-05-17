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

| order id |    from     |     to      |      timestamp      |
| :------: | :---------: | :---------: | :-----------------: |
|    1     |  ETH<br>60  | USDT<br>710 | 2023-05-11 11:17:07 |
|    2     |  ETH<br>17  | USDT<br>75  | 2023-05-11 11:17:14 |
|    3     | USDT<br>700 |  ETH<br>87  | 2023-05-11 11:17:18 |
|    4     |  ETH<br>91  | USDT<br>575 | 2023-05-11 11:17:19 |
|    5     |  ETH<br>7   | USDT<br>64  | 2023-05-11 11:17:21 |
|    6     |  ETH<br>55  | USDT<br>986 | 2023-05-11 11:17:22 |
|    7     | USDT<br>431 |  ETH<br>25  | 2023-05-11 11:17:25 |
|    8     | USDT<br>682 |  ETH<br>33  | 2023-05-11 11:17:34 |
|    9     | USDT<br>804 |  ETH<br>21  | 2023-05-11 11:17:52 |

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

| new order |    from     |    to     | timestamp |
| :-------: | :---------: | :-------: | :-------: |
|     9     | USDT<br>804 | ETH<br>21 | 11:17:52  |

| market order |   from    |     to      |      timestamp      |
| :----------: | :-------: | :---------: | :-----------------: |
|      1       | ETH<br>60 | USDT<br>710 | 2023-05-11 11:17:07 |
|      2       | ETH<br>17 | USDT<br>75  | 2023-05-11 11:17:14 |
|      4       | ETH<br>91 | USDT<br>575 | 2023-05-11 11:17:19 |
|      5       | ETH<br>7  | USDT<br>64  | 2023-05-11 11:17:21 |
|      6       | ETH<br>55 | USDT<br>986 | 2023-05-11 11:17:22 |

### Price Priority

| new order |    from     |    to     |      timestamp      |
| :-------: | :---------: | :-------: | :-----------------: |
|     9     | USDT<br>804 | ETH<br>21 | 2023-05-11 11:17:52 |

| market order |   from    |     to      |      timestamp      |
| :----------: | :-------: | :---------: | :-----------------: |
|      2       | ETH<br>17 | USDT<br>75  | 2023-05-11 11:17:14 |
|      4       | ETH<br>91 | USDT<br>575 | 2023-05-11 11:17:19 |
|      5       | ETH<br>7  | USDT<br>64  | 2023-05-11 11:17:21 |
|      1       | ETH<br>60 | USDT<br>710 | 2023-05-11 11:17:07 |
|      6       | ETH<br>55 | USDT<br>986 | 2023-05-11 11:17:22 |

## Trade Book

- trade
- asset 1
- asset 2
- direct
- price
- amount
- timestamp

### Price Priority Market

| trade | asset1 | asset2 | direct | price | amount |      timestamp      |
| :---: | :----: | :----: | :----: | :---: | :----: | :-----------------: |
|   1   |  ETH   |  USDT  |  BUY   | 4.412 |   17   | 2023-05-11 11:17:52 |
|   2   |  ETH   |  USDT  |  BUY   | 6.32  |   4    | 2023-05-11 11:17:52 |

| Taker |      from      |    to     |
| :---: | :------------: | :-------: |
|   9   |  USDT<br>804   | ETH<br>21 |
|   9   |  USDT<br>729   | ETH<br>4  |
|   9   | USDT<br>703.72 | ETH<br>0  |

### Time Priority Market

| trade | asset1 | asset2 | direct | price | amount |      timestamp      |
| :---: | :----: | :----: | :----: | :---: | :----: | :-----------------: |
|   1   |  ETH   |  USDT  |  BUY   | 11.83 |   21   | 2023-05-11 11:17:52 |

| Taker |    from     |    to     |
| :---: | :---------: | :-------: |
|   9   | USDT<br>804 | ETH<br>21 |

### Price Priority vs Time Priority

- 價格優先
  - 對於交易所的優點
    - 可以導致更小的價差和更準確的市場定價，最終改善市場流動性。
  - 對於交易所的缺點
    - 與時序相比，這種方法的實施和維護也可能更加複雜。
  - 對於用戶的優點
    - 獎勵提供較優價格的用戶
    - 適合依賴速度執行策略
    - 提高所有參與者的流動性和更好的執行力。
  - 對於用戶的缺點
    - 對於提前提交訂單但沒有最佳價格的交易者來說，這可能會帶來潛在的不利影響。
- 時序優先
  - 對於交易所的優點
    - 系統簡單易懂、容易維護
  - 對於交易所的缺點
    - 降低市場流動性
    - 深度圖看起來不公平
  - 對於用戶的優點
    - 獎勵提前提交訂單的用戶
  - 對於用戶的缺點
    - 成交的價格不是最有競爭力的
    - 不適合依賴速度執行策略

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

| trade | asset1 | asset2 | direct | price | amount |      timestamp      |
| :---: | :----: | :----: | :----: | :---: | :----: | :-----------------: |
|   1   |  ETH   |  USDT  |  BUY   | 4.412 |   17   | 2023-05-11 11:17:52 |
|   2   |  ETH   |  USDT  |  BUY   | 6.32  |   4    | 2023-05-11 11:17:54 |
|   3   |  ETH   |  USDT  |  BUY   |   7   |   1    | 2023-05-11 11:17:55 |

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

| trade | asset1 | asset2 | direct | price | amount |       timestamp       |
| :---: | :----: | :----: | :----: | :---: | :----: | :-------------------: |
|   1   |  ETH   |  USDT  |  BUY   | 4.412 |   17   |  2023-05-11 11:17:52  |
|   2   |  ETH   |  USDT  |  BUY   | 6.32  |   4    |  2023-05-11 11:17:54  |
|   3   |  ETH   |  USDT  |  BUY   |   7   |   1    |  2023-05-11 11:17:55  |
|   4   |  ETH   |  USDT  |  BUY   | 7.068 |   0    | 2023-05-11 11:17:55.1 |
|   5   |  ETH   |  USDT  |  BUY   | 7.136 |   0    | 2023-05-11 11:17:55.2 |

### Real Market with Price Priority and Data Prediction

- tradeBook
- lineChart
- candlestickChart

## 第一筆 trade

### Order book

| order id | from    | to      | timestamp           |
| -------- | ------- | ------- | ------------------- |
| 1        | ETH60   | USDT710 | 2023-05-11 11:17:07 |
| 2        | ETH17   | USDT75  | 2023-05-11 11:17:14 |
| 3        | USDT700 | ETH87   | 2023-05-11 11:17:18 |

### Match

taker

| order id | from    | to    | timestamp           |
| -------- | ------- | ----- | ------------------- |
| 3        | USDT700 | ETH87 | 2023-05-11 11:17:18 |

maker

| order id | from  | to      | timestamp           | from/to     |
| -------- | ----- | ------- | ------------------- | ----------- |
| 2        | ETH17 | USDT75  | 2023-05-11 11:17:14 | 17/75=0.23  |
| 1        | ETH60 | USDT710 | 2023-05-11 11:17:07 | 60/710=0.09 |

### Trade book

| trade | asset1 | asset2 | direct | price | amount | timestamp           |
| ----- | ------ | ------ | ------ | ----- | ------ | ------------------- |
| 1     | ETH    | USDT   | BUY    | 4.412 | 17     | 2023-05-11 11:17:18 |

| Taker | from    | to    |
| ----- | ------- | ----- |
| 3     | USDT700 | ETH87 |
| 3     | USDT625 | ETH70 |

## 第二筆 trade

### Order book

| order id | from    | to      | timestamp           |
| -------- | ------- | ------- | ------------------- |
| 1        | ETH60   | USDT710 | 2023-05-11 11:17:07 |
| 3        | USDT625 | ETH70   | 2023-05-11 11:17:18 |
| 4        | ETH91   | USDT575 | 2023-05-11 11:17:19 |

### Match

taker

| order id | from  | to      | timestamp           |
| -------- | ----- | ------- | ------------------- |
| 4        | ETH91 | USDT575 | 2023-05-11 11:17:19 |

maker

| order id | from    | to    | timestamp           |
| -------- | ------- | ----- | ------------------- |
| 3        | USDT625 | ETH70 | 2023-05-11 11:17:18 |

### Trade book

| trade | asset1 | asset2 | direct | price   | amount | timestamp             | unix timestamp in ms |
| ----- | ------ | ------ | ------ | ------- | ------ | --------------------- | -------------------- |
| 1     | ETH    | USDT   | BUY    | 4.412   | 17     | 2023-05-11 11:17:18   | 1683775038000        |
| 2     | ETH    | USDT   | SELL   | 8.929   | 575    | 2023-05-11 11:17:19   | 1683775039000        |
| 3     | ETH    | USDT   | SELL   | 9.3807  | 0      | 2023-05-11 11:17:19.1 | 1683775039100        |
| …     | …      | …      | …      | …       | …      | …                     | …                    |
| 11    | ETH    | USDT   | SELL   | 12.9943 | 0      | 2023-05-11 11:17:19.9 | 1683775039900        |

taker

| order id | from    | to      |
| -------- | ------- | ------- |
| 4        | ETH91   | USDT575 |
| 4        | ETH26.6 | USDT0   |

maker

| order id | from    | to    |
| -------- | ------- | ----- |
| 3        | USDT625 | ETH70 |
| 3        | USDT50  | ETH0  |

## 第三筆&第四筆 trade

### Order book

| order id | from    | to      | timestamp           | unix timestamp in ms |
| -------- | ------- | ------- | ------------------- | -------------------- |
| 1        | ETH60   | USDT710 | 2023-05-11 11:17:07 | 1683775027000        |
| 5        | ETH7    | USDT64  | 2023-05-11 11:17:21 | 1683775041000        |
| 6        | ETH55   | USDT986 | 2023-05-11 11:17:22 | 1683775042000        |
| 7        | USDT431 | ETH25   | 2023-05-11 11:17:25 | 1683775045000        |

### Match

taker

| order id | from    | to    | timestamp           | unix timestamp in ms |
| -------- | ------- | ----- | ------------------- | -------------------- |
| 7        | USDT431 | ETH25 | 2023-05-11 11:17:25 | 1683775045000        |

maker

| order id | from  | to      | timestamp           | unix timestamp in ms |      |
| -------- | ----- | ------- | ------------------- | -------------------- | ---- |
| 5        | ETH7  | USDT64  | 2023-05-11 11:17:21 | 1683775041000        | 0.11 |
| 1        | ETH60 | USDT710 | 2023-05-11 11:17:07 | 1683775027000        | 0.08 |
| 6        | ETH55 | USDT986 | 2023-05-11 11:17:22 | 1683775042000        | 0.06 |

### Trade book

| trade | asset1 | asset2 | direct | price  | amount | timestamp             | unix timestamp in ms |                                                           |
| ----- | ------ | ------ | ------ | ------ | ------ | --------------------- | -------------------- | --------------------------------------------------------- |
| 1     | ETH    | USDT   | BUY    | 4.412  | 17     | 2023-05-11 11:17:18   | 1683775038000        |                                                           |
| 2     | ETH    | USDT   | SELL   | 8.929  | 575    | 2023-05-11 11:17:19   | 1683775039000        |                                                           |
| 3     | ETH    | USDT   | BUY    | 9.143  | 7      | 2023-05-11 11:17:25   | 1683775045000        |                                                           |
| 4     | ETH    | USDT   | BUY    | 11.833 | 18     | 2023-05-11 11:17:25   | 1683775045000        | 以 (11.833+9.143)/2=10.488 跟 1/0.112=8.93 為基準往下預測 |
| 5     | ETH    | USDT   | BUY    | 10.644 | 0      | 2023-05-11 11:17:25.1 | 1683775046000        |                                                           |
| …     | …      | …      | …      | …      | …      | …                     | …                    |                                                           |
| 13    | ETH    | USDT   | BUY    | 10.662 | 0      | 2023-05-11 11:17:19.9 | 1683775046800        |                                                           |

- 431/25 > 64/7 （第三筆 trade）
  - taker
    - 剩餘 25-7=18ETH
    - 剩餘 431-(64/7)\*7=367USDT
  - maker
    - 剩餘 7-7=0ETH
    - 剩餘 64-64=0USDT
  - price
    - 64/7=9.143
  - amount
    - 7
- 367/18 > 710/60 （第四筆 trade）
  - taker
    - 剩餘 18-18=0ETH
    - 剩餘 367-(710/60)\*18=154USDT
  - maker
    - 剩餘 60-18=42ETH
    - 剩餘 710-(710/60)\*18=710-213=497USDT
  - price
    - 710/60=11.833
  - amount
    - 18

taker

| order id | from    | to    |
| -------- | ------- | ----- |
| 7        | USDT431 | ETH25 |
| 7        | USDT367 | ETH18 |
| 7        | USDT154 | ETH0  |

maker

| order id | from | to     |
| -------- | ---- | ------ |
| 5        | ETH7 | USDT64 |
| 5        | ETH0 | USDT0  |

| order id | from  | to      |
| -------- | ----- | ------- |
| 1        | ETH60 | USDT710 |
| 1        | ETH42 | USDT497 |

## 第五筆 trade

### Order book

| order id | from    | to      | timestamp           | unix timestamp in ms |
| -------- | ------- | ------- | ------------------- | -------------------- |
| 1        | ETH42   | USDT497 | 2023-05-11 11:17:07 | 1683775027000        |
| 6        | ETH55   | USDT986 | 2023-05-11 11:17:22 | 1683775042000        |
| 8        | USDT682 | ETH33   | 2023-05-11 11:17:34 | 1683775054000        |

### Match

taker

| order id | from    | to    | timestamp           |
| -------- | ------- | ----- | ------------------- |
| 8        | USDT682 | ETH33 | 2023-05-11 11:17:34 |

maker

| order id | from  | to      | timestamp           |
| -------- | ----- | ------- | ------------------- |
| 1        | ETH42 | USDT497 | 2023-05-11 11:17:07 |
| 6        | ETH55 | USDT986 | 2023-05-11 11:17:22 |

### Trade book

| trade | asset1 | asset2 | direct | price  | amount | timestamp             | unix timestamp in ms |                                                           |
| ----- | ------ | ------ | ------ | ------ | ------ | --------------------- | -------------------- | --------------------------------------------------------- |
| 1     | ETH    | USDT   | BUY    | 4.412  | 17     | 2023-05-11 11:17:18   | 1683775038000        |                                                           |
| 2     | ETH    | USDT   | SELL   | 8.929  | 575    | 2023-05-11 11:17:19   | 1683775039000        |                                                           |
| 3     | ETH    | USDT   | BUY    | 9.143  | 7      | 2023-05-11 11:17:25   | 1683775045000        |                                                           |
| 4     | ETH    | USDT   | BUY    | 11.833 | 18     | 2023-05-11 11:17:25   | 1683775045000        | 以 (11.833+9.143)/2=10.488 跟 1/0.112=8.93 為基準往下預測 |
| 5     | ETH    | USDT   | BUY    | 11.833 | 33     | 2023-05-11 11:17:34   | 1683775054000        |                                                           |
| 6     | ETH    | USDT   | BUY    | 11.833 | 0      | 2023-05-11 11:17:34.1 | 1683775055000        |                                                           |
| …     | …      | …      | …      | …      | …      | …                     | …                    |                                                           |
| 14    | ETH    | USDT   | BUY    | 11.833 | 0      | 2023-05-11 11:17:34.9 | 1683775063000        |                                                           |
|       |        |        |        |        |        |                       |                      |                                                           |

- 683/33 > 497/42
  - taker
    - 剩餘 683-(497/42)\*33=292.5USDT
    - 剩餘 33-33=0ETH
  - maker
    - 剩餘 42-33=9ETH
    - 剩餘 497-(497/42)\*33=106.5USDT
  - price
    - 497/42=11.833
  - amount
    - 33

taker

| order id | from      | to    |
| -------- | --------- | ----- |
| 8        | USDT682   | ETH33 |
| 8        | USDT292.5 | ETH0  |

maker

| order id | from  | to        |
| -------- | ----- | --------- |
| 1        | ETH42 | USDT497   |
| 1        | ETH9  | USDT106.5 |

## 第六筆&第七筆 trade

### Order book

| order id | from    | to        | timestamp           | unix timestamp in ms |
| -------- | ------- | --------- | ------------------- | -------------------- |
| 1        | ETH9    | USDT106.5 | 2023-05-11 11:17:07 | 1683775027000        |
| 6        | ETH55   | USDT986   | 2023-05-11 11:17:22 | 1683775042000        |
| 9        | USDT804 | ETH21     | 2023-05-11 11:17:52 | 1683775072000        |

### Match

taker

| order id | from    | to    | timestamp           | unix timestamp in ms |
| -------- | ------- | ----- | ------------------- | -------------------- |
| 9        | USDT804 | ETH21 | 2023-05-11 11:17:52 | 1683775072000        |

maker

| order id | from  | to        | timestamp           | unix timestamp in ms |
| -------- | ----- | --------- | ------------------- | -------------------- |
| 1        | ETH9  | USDT106.5 | 2023-05-11 11:17:07 | 1683775027000        |
| 6        | ETH55 | USDT986   | 2023-05-11 11:17:22 | 1683775042000        |

### Trade book [Final]

| trade | asset1 | asset2 | direct | price   | amount | timestamp             | unix timestamp in ms |                                                           |
| ----- | ------ | ------ | ------ | ------- | ------ | --------------------- | -------------------- | --------------------------------------------------------- |
| 1     | ETH    | USDT   | BUY    | 4.412   | 17     | 2023-05-11 11:17:18   | 1683775038000        |                                                           |
| 2     | ETH    | USDT   | SELL   | 8.929   | 575    | 2023-05-11 11:17:19   | 1683775039000        |                                                           |
|       | ETH    | USDT   | SELL   | 9.3807  | 0      | 2023-05-11 11:17:19.1 | 1683775039100        |                                                           |
| …     | …      | …      | …      | …       | …      | …                     | …                    |                                                           |
|       | ETH    | USDT   | SELL   | 12.9943 | 0      | 2023-05-11 11:17:19.9 | 1683775039900        |                                                           |
| 3     | ETH    | USDT   | BUY    | 9.143   | 7      | 2023-05-11 11:17:25   | 1683775045000        |                                                           |
| 4     | ETH    | USDT   | BUY    | 11.833  | 18     | 2023-05-11 11:17:25   | 1683775045000        | 以 (11.833+9.143)/2=10.488 跟 1/0.112=8.93 為基準往下預測 |
|       | ETH    | USDT   | BUY    | 10.644  | 0      | 2023-05-11 11:17:25.1 | 1683775046000        |                                                           |
| …     | …      | …      | …      | …       | …      | …                     | …                    |                                                           |
|       | ETH    | USDT   | BUY    | 10.662  | 0      | 2023-05-11 11:17:19.9 | 1683775046800        |                                                           |
| 5     | ETH    | USDT   | BUY    | 11.833  | 33     | 2023-05-11 11:17:34   | 1683775054000        |                                                           |
|       | ETH    | USDT   | BUY    | 11.833  | 0      | 2023-05-11 11:17:34.1 | 1683775055000        |                                                           |
| …     | …      | …      | …      | …       | …      | …                     | …                    |                                                           |
|       | ETH    | USDT   | BUY    | 11.833  | 0      | 2023-05-11 11:17:34.9 | 1683775063000        |                                                           |
| 6     | ETH    | USDT   | BUY    | 11.833  | 9      | 2023-05-11 11:17:52   | 1683775072000        |                                                           |
| 7     | ETH    | USDT   | BUY    | 17.927  | 12     | 2023-05-11 11:17:52   | 1683775072000        |                                                           |
| 8     | ETH    | USDT   | BUY    | 15.185  | 0      | 2023-05-11 11:17:52.1 | 1683775073000        |                                                           |
| …     | …      | …      | …      | …       | …      | …                     | …                    |                                                           |
| 16    | ETH    | USDT   | BUY    | 15.220  | 0      | 2023-05-11 11:17:52.9 | 1683775081000        |                                                           |

- 804/21 > 106.5/9
  - taker
    - 剩餘 804-(106.5/9)\*9=697.5USDT
    - [to]剩餘 21-9=12ETH
  - maker
    - 剩餘 ETH
    - [to]剩餘 USDT
    - 如果 taker 有剩代表 maker 被消耗完，反之亦然
  - price
    - 11.833
  - amount
    - 9
- 697.5/12 > 986/55
  - taker
    - 剩餘 697.5-(986/55)\*12=482.373USDT
    - [to]剩餘 0ETH
  - maker
    - 剩餘 55-12=43ETH
    - [to]剩餘 986-(986/55)\*12=770.873USDT
  - price
    - 17.927
  - amount
    - 12

### Order book [Final]

| order id | from  | to        | timestamp           | unix timestamp in ms |
| -------- | ----- | --------- | ------------------- | -------------------- |
| 6        | ETH43 | USDT106.5 | 2023-05-11 11:17:22 | 1683775042000        |

### Real Market with Time Priority and Data Prediction

- tradeBook
- lineChart
- candlestickChart

### Trade book [Final]

| trade | asset1 | asset2 | direct | price  | amount | timestamp             | unix timestamp in ms |                |
| ----- | ------ | ------ | ------ | ------ | ------ | --------------------- | -------------------- | -------------- |
| 1     | ETH    | USDT   | BUY    | 4.412  | 17     | 2023-05-11 11:17:18   | 1683775038000        |                |
| 2     | ETH    | USDT   | SELL   | 8.929  | 575    | 2023-05-11 11:17:19   | 1683775039000        |                |
| 2-1   | ETH    | USDT   | SELL   | 9.381  | 0      | 2023-05-11 11:17:19.1 | 1683775039100        |                |
| …     | …      | …      | …      | …      | …      | …                     | …                    |                |
| 2-61  | ETH    | USDT   | SELL   | 35.579 | 0      | 2023-05-11 11:17:24.9 | 1683775044900        |                |
| 3     | ETH    | USDT   | BUY    | 11.833 | 25     | 2023-05-11 11:17:25   | 1683775045000        | ORDER 7 的時間 |
| 3-1   | ETH    | USDT   | BUY    | 11.881 | 0      | 2023-05-11 11:17:25.1 | 1683775045100        |                |
| …     | …      | …      | …      | …      | …      | …                     | …                    |                |
| 3-91  | ETH    | USDT   | BUY    | 16.141 | 0      | 2023-05-11 11:17:33.1 | 1683775053900        |                |
| 4     | ETH    | USDT   | BUY    | 11.849 | 33     | 2023-05-11 11:17:34   | 1683775054000        | ORDER 8 的時間 |
| 4-1   | ETH    | USDT   | BUY    | 11.849 | 0      | 2023-05-11 11:17:34.1 | 1683775054100        |                |
| …     | …      | …      | …      | …      | …      | …                     | …                    |                |
| 4-181 | ETH    | USDT   | BUY    | 11.881 | 0      | 2023-05-11 11:17:51.9 | 1683775071900        |                |
| 5     | ETH    | USDT   | BUY    | 11.849 | 2      | 2023-05-11 11:17:52   | 1683775072000        | ORDER 9 的時間 |
| 6     | ETH    | USDT   | BUY    | 9.143  | 7      | 2023-05-11 11:17:52   | 1683775072000        | ORDER 9 的時間 |
| 7     | ETH    | USDT   | BUY    | 17.927 | 12     | 2023-05-11 11:17:52   | 1683775072000        | ORDER 9 的時間 |

### Order book [Final]

| order id | from  | to        | timestamp           | unix timestamp in ms |
| -------- | ----- | --------- | ------------------- | -------------------- |
| 6        | ETH43 | USDT106.5 | 2023-05-11 11:17:22 | 1683775042000        |
