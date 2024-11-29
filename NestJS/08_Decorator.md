# 深入了解 TypeScript 裝飾器（Decorators）
> [!note]
> - [TypeScript Decorator](https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators)

TypeScript 的裝飾器（Decorators）是一個強大的語法特性，允許我們在類別、方法、屬性或參數上添加註解，並藉此擴展它們的功能。裝飾器經常被用於元編程場景，例如框架設計（Angular 的依賴注入）或簡化代碼重用。

在這篇文章中，我們將結合範例，深入探討 TypeScript 提供的四種主要裝飾器：

- **類別裝飾器（Class Decorators）**
- **方法裝飾器（Method Decorators）**
- **存取器裝飾器（Accessor Decorators）**
- **參數裝飾器（Parameter Decorators）**

我們還會介紹裝飾器執行順序，幫助您更好地理解它們在代碼中的作用。

---

## 1. Decorator function 與 Factory
Decorator目前只能在class內使用，放在不同地方的decorator function 接收的參數不同，但大多數有下面三種。
1. target: 一般是 class本身，如果是class decorator則會是 `constructor`function
2. propertyKey: 會是 被掛Decorator的function的名字
3. descriptor: 會是被掛Decorator的function或是property的 descriptor，可以設定該property的屬性

Decorator化把原本的function包住，先執行Decorator，並且執行完值後可以return原本的function，讓原本的function被執行。原本的function會放在 `descriptor.value`
```ts

// 下面這個就是 decorator
function log2(target: Calculator0, propertyKey: string, descriptor: PropertyDescriptor): any {
    console.log('target: ', target);
      // Calculator0 {
      //   add: [Function: add],
      // }
    console.log('propertyKey: ', propertyKey); // add
    console.log('descriptor: ', descriptor);
      // descriptor:  {
      //   value: [Function: add],
      //   writable: true,
      //   enumerable: false,
      //   configurable: true,
      // }
    console.log('this in log', this); // undefined
    return descriptor.value; // 原本的function會被存放在 descriptor.value，
}

class Calculator0 {
    @log2 // 這裡使用decorator，不要加括號
    add(a: number, b: number) {
        console.log('this in add:', this);
          // Calculator0 {
          //   add: [Function: add],
          // }
        return a + b;
    }
}

const calculator0 = new Calculator0();
console.log(calculator0.add(2, 3));
```

如果想要依照不同的情況這定log，可以用factory的方法，需要有一個function, return decorator。在使用的時候需要加括號

```ts
function log1(coolString: string):any {
  console.log(coolString);
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) { // 這個是真的decorator
    console.log('target: ', target);
      // target:  Calculator {
      //   add: [Function: add],
      // }

    console.log('propertyKey: ', propertyKey);
      // propertyKey:  add
    console.log('descriptor: ', descriptor);
      // descriptor:  {
      //   value: [Function: add],
      //   writable: true,
      //   enumerable: false,
      //   configurable: true,
      // }
    console.log('this in log', this); // this in log undefined

    return descriptor.value;
  }
}

class Calculator {
  @log1('Hello')
  add(a: number, b: number) {
    console.log('this in add:', this); // this is "Calculator"
    return a + b;
  }
}

const calculator = new Calculator();
console.log(calculator.add(2, 3));
```

## 2. Decorator的組合應用

在 TypeScript 中，Decorator可以同時應用於一個method。例如，可以將多個Decorator寫在同一行：

```typescript
@f @g x
```

或者分別寫在多行：

```typescript
@f
@g
x
```

當多個Decorator應用於同一個method時，其執行順序類似於數學中的函數組合。在這種模型中，組合函數 `f` 和 `g` 的結果 `(f ∘ g)(x)` 等同於 `f(g(x))`。

因此，當 TypeScript 評估同一聲明上的多個Decorator時，會執行以下步驟：

1. **自上而下評估Decorator表達式**：先按裝飾器的書寫順序（由上至下）計算裝飾器的表達式。
2. **自下而上執行Decorator函數**：計算完成後，按裝飾器的應用順序（由下至上）執行它們作為函數。

如果我們使用Decorator Factory，可以清楚地觀察到這種執行順序。以下是範例：

```typescript
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}
```

執行上述code時，控制台的輸出結果為：

```plaintext
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

### 分析執行過程

1. Decorator Factory執行**：
    
    - `first()` 和 `second()` Factory function會按書寫順序（從上到下）執行，分別打印 `first(): factory evaluated` 和 `second(): factory evaluated`。
2. **Decorator執行**：
    
    - 當Decorator應用於 `method()` 方法時，裝飾器函數按相反順序（從下到上）執行，因此先打印 `second(): called`，再打印 `first(): called`。

---

## 3. 各種Decorator

### 1. Class Decorators

Class Decorators應用於整個類別，用於觀察、修改甚至替換Class定義。
Class Decorator的輸入值只有一個，就是該class的constructor function。

#### 基本範例

```typescript
function classLog(constructor: Function) {
  console.log(`Class decorated: ${constructor.name}`);
}

@classLog
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}
```

**輸出**：
```plaintext
Class decorated: Calculator
```

這裡的 `@classLog` 是Class Decorator，會在類別被定義後立即執行。參數 `constructor` 是該類別的構造函數，可以用於讀取或修改類別的原型。

#### 修改Class的範例

```typescript
function classMod(constructor: Function) {
  constructor.prototype.createdAt = new Date();
  constructor.prototype.getCreatedAt = function () {
    return this.createdAt;
  };
}

@classMod
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
console.log((calc as any).getCreatedAt());
```

這段代碼將新的屬性和方法添加到 `Calculator` 類別，達到了擴展類別功能的效果。

---

### 2\. Method Decorators

Method Decorators是在方法宣告之前定義的。它會應用到方法的屬性描述符（Property Descriptor），可以用於觀察、修改或替換方法定義。

Method Decorators在運行時會作為Method被調用，並接收以下三個參數：

1. Static method的Class Constrictor或是Class Instanse的Class Prototype。
2. method的名稱。
3. 該成員的屬性描述符（`Property Descriptor`）。

#### 基本範例

```typescript
function log1(coolString: string):any {
  console.log(coolString);
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) { // 這個是真的decorator
    console.log('target: ', target);
      // target:  Calculator {
      //   add: [Function: add],
      // }

    console.log('propertyKey: ', propertyKey);
      // propertyKey:  add
    console.log('descriptor: ', descriptor);
      // descriptor:  {
      //   value: [Function: add],
      //   writable: true,
      //   enumerable: false,
      //   configurable: true,
      // }
    console.log('this in log', this); // this in log undefined

    return descriptor.value;
  }
}

class Calculator {
  @log1('Hello')
  add(a: number, b: number) {
    console.log('this in add:', this); // this is "Calculator"
    return a + b;
  }
}

const calculator = new Calculator();
console.log(calculator.add(2, 3));
```

在這裡，`@log1` 是一個方法裝飾器。`descriptor` 提供對方法的元數據存取，例如我們可以改寫方法實現。

---

## 3\. Accessor Decorators

Accessor Decorators是在Accessor（getter 或 setter）聲明之前定義的。它會應用到Accessor的屬性描述符（`Property Descriptor`），可以用於觀察、修改或替換存取器的行為。

Accessor Decorators不能同時Decorate  `get` 和 `set`，必須應用到code順序中的第一個Accessor，因為Decorators會應用到整個屬性描述符，而不是單獨的 `get` 或 `set`。

裝飾器表達式在運行時會作為函數被調用，並接收以下三個參數：

1. Static method的Class Constrictor或是Class Instanse的Class Prototype。
2. Accessor的名稱
3. 該成員的屬性描述符（`Property Descriptor`）。

#### 基本範例

```typescript

function configurable(value: boolean):any {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('target:', target);
        // target: Point {
        //   x: [Getter],
        //   y: [Getter],
        // }
    console.log('propertyKey:', propertyKey); // x, 用y的時候會印出y
    console.log('descriptor:', descriptor);
      // x的是下面這樣
      // descriptor: {
      //   get: [Function: x],
      //   set: undefined,
      //   enumerable: false,
      //   configurable: true,
      // }
      // y的是下面這樣
      // descriptor: {
      //   get: [Function: y],
      //   set: [Function: y],
      //   enumerable: false,
      //   configurable: true,
      // }
    console.log('this in configurable:', this); // undefined
    descriptor.configurable = value; // 代表 是否可改變該屬性的特徵/刪除該屬性, 一般是true, 用decorator改變它
    console.log('descriptor after decorated:', descriptor); // false
      // y
      // descriptor after decorated: {
      //   get: [Function: y],
      //   set: [Function: y],
      //   enumerable: false,
      //   configurable: false,
      // }
  }
}

class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
 
  @configurable(false)
  get x() {
    return this._x;
  }
 
  @configurable(false)
  get y() {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }
}

const point = new Point(2, 3);
console.log(point.x); // 2
// console.log(point.y); // 3
```

這段代碼使用了 `@configurable` 裝飾器，將 getter 的 `configurable` 屬性設置為 `false`，表示這個屬性無法被重新定義或刪除。

---

### 4\. Parameter Decorators

參數裝飾器是在參數聲明之前定義的。它會應用到類別構造函數或方法聲明，通常用於觀察參數是否被聲明。

參數裝飾器無法用於聲明文件、重載或其他 ambient 上下文（例如 `declare class` 中）。

裝飾器表達式在運行時會作為函數被調用，並接收以下三個參數：

1. Static method的Class Constrictor或是Class Instanse的Class Prototype。
2. Parameter的名稱
3. 該成員的屬性描述符（`Property Descriptor`）。

參數裝飾器的返回值會被忽略。

#### 基本範例

```typescript
const PARAM_METADATA_KEY = Symbol("log_param_metadata");

function LogParam(target: any, propertyKey: string | symbol, parameterIndex: number) {
  console.log('target:', target);
      // target: Example1 {
      //   greet: [Function: greet],
      // }
  console.log('propertyKey:', propertyKey); // greet
  console.log('parameterIndex:', parameterIndex); // greeting是0, name 是 1
  // 確保在 target 上有一個屬性來儲存參數資訊
  if (!target[PARAM_METADATA_KEY]) {
    target[PARAM_METADATA_KEY] = {};
  }

  // 紀錄當前屬性上的參數索引
  if (!target[PARAM_METADATA_KEY][propertyKey]) {
    target[PARAM_METADATA_KEY][propertyKey] = [];
  }

  target[PARAM_METADATA_KEY][propertyKey].push(parameterIndex);
}

function LogMethod(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const metadata = target[PARAM_METADATA_KEY]?.[propertyKey] || [];
    
    // 打印記錄的參數值
    metadata.forEach((index: number) => {
      console.log(`Method "${String(propertyKey)}", Parameter[${index}]:`, args[index]);
    });

    // 呼叫原始方法, 用apply可以確保this不會遺失
    return originalMethod.apply(this, args);
  };
}

class Example1 {
  @LogMethod
  greet(@LogParam greeting: string, @LogParam name: string) {
    console.log(`${greeting}, ${name}!`);
  }
}

const example1 = new Example1();
example1.greet("Hello", "Alice");
```

**輸出**：
```plaintext
Method "greet", Parameter[1]: Alice
Method "greet", Parameter[0]: Hello
Hello, Alice!
```

---

## 小結

TypeScript 的裝飾器是一種強大的語法工具，可以用來觀察、擴展甚至改寫類別及其成員的行為。在實際開發中，它們能有效簡化代碼，特別是在框架開發中非常有用。
