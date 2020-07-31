# 認識 RxJS

> RxJS is a library for composing asynchronous and event-based programs by using observable sequences

目前有大量的 API 可以來處理非同步事件

* DOM Events
* XMLHttpRequest
* fetch
* WebSockets
* Server Send Events
* Service Worker
* Node Stream
* Timer

而這些都能簡易的透過 RxJS 來處理，這樣就能都統一成同一種 API 了

> Think of RxJS as Lodash for events.

而所謂的 Rx 則是 Reactive Programming(ReactiveX) 的縮寫，其結合了 Observer pattern 和 Iterator pattern 兩種概念

> ReactiveX is a combination of the best ideas from
the Observer pattern, the Iterator pattern, and functional programming

- Observer pattern

    - 如 event listener
    
        ```javascript
        function clickHandler(event) {
            console.log('user click!');
        }

        document.body.addEventListener('click', clickHandler)
        ```
        
        > 通過這種事件與監聽的互動做到去耦合(decoupling)。
- Iterator Pattern

    - 可以通過一種方法遍歷取得資料
        
        > Iterator Pattern 雖然很單純，但同時帶來了兩個優勢，第一它漸進式取得資料的特性可以拿來做延遲運算(Lazy evaluation)，讓我們能用它來處理大資料結構。第二因為 iterator 本身是序列，所以可以實作所有陣列的運算方法像 map, filter... 等！

        ```javascript
        var arr = [1, 2, 3];

        var iterator = arr[Symbol.iterator]();

        iterator.next();
        // { value: 1, done: false }
        iterator.next();
        // { value: 2, done: false }
        iterator.next();
        // { value: 3, done: false }
        iterator.next();
        // { value: undefined, done: true }
        ```

## Observable(資料源)

結合上面兩種 Pattern 特性，就是 Observable 的概念，而因為是 `漸進式(progressive) 的取得資料`，所以

> Observable 具備生產者推送資料的特性，同時能像序列，擁有序列處理資料的方法(map, filter...)！

![](https://res.cloudinary.com/dohtkyi84/image/upload/v1482240798/push_pull.png)

EX:

```javascript
Rx.Observable.fromEvent(window, 'click')
  .map(e => 1)
  .scan((total, now) => total + now)
  .subscribe(value => {
    document.querySelector('#counter').innerText = value;
  })
```

![](https://static.coderbridge.com/img/techbridge/images/huli/rxjs/click.gif)

## Observer(觀察者)

> Observable 可以被訂閱(subscribe)，或說可以被觀察，而訂閱 Observable 的物件又稱為 `觀察者(Observer)`。觀察者是一個具有三個方法(method)的物件，每當 Observable 發生事件時，便會呼叫觀察者相對應的方法。
> 
> ```javascript
> var observable = Rx.Observable
> 	.create(function(observer) {
> 			observer.next('Jerry');
> 			observer.next('Anna');
> 			observer.complete();
> 			observer.next('not work');
> 	})
> 	
> // 宣告一個觀察者，具備 next, error, complete 三個方法
> var observer = {
> 	next: function(value) {
> 		console.log(value);
> 	},
> 	error: function(error) {
> 		console.log(error)
> 	},
> 	complete: function() {
> 		console.log('complete')
> 	}
> }
> 
> // 用我們定義好的觀察者，來訂閱這個 observable	
> observable.subscribe(observer)
> ```
> 
> output:
> 
> ```
> Jerry
> Anna
> complete
> ```
> 

## Subject

Subject 實際上就是 Observer Pattern 的實作

`statusStream.js`

```javascript
const Rx = require('rxjs/Rx');

class listener {
  constructor() {
    this.subject = new Rx.Subject();
  }

  add(something) {
    this.subject.next(something)
  }
}

let instance;

if (typeof instance === 'object') {
  return instance;
} else {
  instance = new listener();
}

module.exports = instance
```

`main.js`

```javascript
const statusListener = require('./statusListener')

const statusObserver = {
  next: x => {
    // 接收資料
  },
  error: error => console.log('A error: ' + error),
  complete: () => console.log('A complete!')
}

statusListener.subject.subscribe(statusObserver)
```

`ATWalletKit/xxxx.js`

```javascript
const statusListener = require('./statusListener')

statusListener.add({ event: ATCryptocurrencyAccount.Evt_OnBalanceChanged, data: { accountIndex: this._accountIndex, balance: this._balance.toFixed() } })

```