# React & Jest 研究
### props
一個用來從 父 compoenent pass data 到 子 component 的 system
* 目標
目標是用來將客製化、configure
### Class Component and Function Component
**Class Component:**
    
    可以在裡面使用jsx
    使用Lifecycle method來在某些特別的時間點run code
    使用state來更新螢幕上的畫面
    
**Function Component:**

    可以在裡面使用jsx
    使用Hooks來在某些特別的時間點run code
    使用Hooks來access state system，並 update 螢幕上的畫面

參考:
https://ithelp.ithome.com.tw/articles/10234746
### State 
1. 當 component 被創建時，State 必須被初始化
2. 更新 state 時，會讓 Component 被 render
3. 用 SetState 來 update state 

* Lifecycle:
    - constructor
    - render
    - componentDidMount會在第一次render後被呼叫
    - 在state被update時，會呼叫componentDidupdate
    - componentDidUpdate被呼叫時，會呼叫render

### Hooks

**useState**
```
const [activeIndex,setIndex] = useState(null);
//set index
setIndex(2)
```

**useEffect**

```
// second argument
// 會在一開始 render 時 run
[]
// nothing 時，會在一開始 rerender 和往後 render 時 run

// 有 data 時，會在 相較上一次render值 data 被改變的時候 rerender後 run
[data]
```

### Redux

#### Redux cycle: 
- Action creator -> action(type、payload) -> dispatch -> reducer(prev state,action) pure funciton -> store
#### Redux 細節詳述
- Reducer:
描述發生什麼的動作的一般物件
- Action:
State 如何應對改變，只負責計算下一個 State
定義 type（動作形式）, payload (處理資料)
- Store:
不同 Reducers 和 Action creator 的 assembly 
#### Redux 範例
- Action 的使用範例：
```
const createPolicy = (name, amount) =>{
    return {
        type: 'CREATE_POLICY',
        payload:{
         name: name,
         amount: amount
        }
    }
}
```
- 以下為 Reducer 的使用範例：
```
const claimsHistory = (oldListOfClaims = [], action) =>{
    if(action.type==='CREATE_CLIAM'){
        oldListOfClaims.push(action.payload);
        return [...oldListOfClaims, action.payload];
    }
    return oldListOfClaims;
}
```

- 以下為 Reducer 和 store 的綜合使用的使用範例：

    範例一、
    ```
    const {createStore, combineReducers} = Redux;
    
    const ourDepartments = combineReducers({
        accounting: accounting,
        claimsHistory: claimsHistory,
        policies: policies
    })
    
    const store = createStore(ourDepartments);
    
    store.dispatch(createPolicy('Alex',20));
    
    // console.log(store.getState());
    ```
    範例二、
    ```
    import {createStore} from 'redux';

    const Areducer =  (state={num:0},action) =>{

        if (action.type==='d'){
            return { counter: state.num - 1 };
        }
    
    return state;

    }

    const store = createStore(Areducer);

    export default store;
    ```


### Jest
1. 下載 Jest 進環境裡:
`npm install jest --save-dev`

2. 在 package.json 確認 devDependencies:
![](https://i.imgur.com/tCnyTws.png)

3. 更改 script 的 test
![](https://i.imgur.com/UH7ZRhy.png)

4. Jest 會在執行程式前先去會尋找專案中副檔名為 .test.js 結尾的檔案


    ```
    // build page_name.test.js 並撰寫測試方式：
    test('Check the result of 5 + ', () => {
        expect(5 + 2).toBe(7)
    })
    ```
    並且 run test
    `npm run test`
---
Reference:

Testing 簡介：
https://medium.com/hannah-lin/%E5%89%8D%E7%AB%AF%E6%B8%AC%E8%A9%A6%E5%8E%9F%E4%BE%86%E6%B2%92%E9%80%99%E9%BA%BC%E5%96%AE%E7%B4%94-%E6%90%9E%E6%87%82-unit-testing-integration-e2e-snapshop-dc26d164bd6b
Jest:
https://medium.com/enjoy-life-enjoy-coding/%E8%AE%93-jest-%E7%82%BA%E4%BD%A0%E7%9A%84-code-%E5%81%9A%E5%96%AE%E5%85%83%E6%B8%AC%E8%A9%A6-%E5%9F%BA%E7%A4%8E%E7%94%A8%E6%B3%95%E6%95%99%E5%AD%B8-d898f11d9a23
React-redux:
https://medium.com/hannah-lin/jest-enzyme-%E9%81%8B%E7%94%A8%E5%9C%A8%E7%9C%9F%E5%AF%A6%E4%B8%96%E7%95%8C%E4%B8%AD%E7%9A%84-react-redux-project-%E5%B0%88%E6%A1%88%E8%AC%9B%E8%A7%A3%E7%AF%87-ca370c22f745
