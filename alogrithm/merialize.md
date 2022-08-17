# Overview
## Principle
![](https://i.imgur.com/kngYziw.png)
圖一

圖片來源 [BitcoinWiki](https://en.bitcoinwiki.org/wiki/Main_Page)

Merkle Tree 雜湊樹本身是一個樹狀的資料結構，且 Merkle Tree 是一個二元樹。其驗證資料存放方式是由最底層的子節點開始將文件進行 Hash 計算，然後由節點存放算出的 Hash 值，若這層的節點並非完整的偶數個節點，則會把最後的節點再複製一份以確保節點個數是偶數個。除此之外，因為 Merkle Tree 為二元樹狀結構，上層節點會是下層節點數的一半，每個節點會將下層的兩個子節點存放的 Hash 值一起做 Hash 計算後存放在節點，並依序由下層往上做，直到最後剩下第一層的 root 節點存放算出的 Hash 值，也就是總和整棵樹的節點算出的 Hash 值。
### 確保為 perfect binary tree
為了方便計算，我們需要確保用戶輸入 leaf list (input data) 後，若 leaf 總數為奇數，我們將 node 補成 perfect binary tree ， 一開始初始化時，我們會計算樹所需要的 level n，而 n 的計算方式是以 (2^n - 2^listlen) for n = 0..20，直到計算出最小的正整數為止（ 2^20 = 1048576 大約 = 100萬個證據節點 )，而後我們會將 n levels 的所有 value 補成 **64 bits 的 0 **， 其節點的 hash 以 value = 0 存放之。 除此之外，我們需要將 leaf node 都確保在最後一層（level) 也就是算出來的 n level。
### 0 value 的儲存
0 value 以 64 bits 的 0 儲存
### Data 資料結構
- 證據樹
    > 其存放方式如上述確保為 Merkle Tree 所言，需要為 perfect binary tree，而存放順序為層序遍歷（Breadth-first) 的儲存方式，並且以 Buffer 的形式儲存以免資料在 ouput 時直接顯示資料。

- Consistent Hashing：資料以一致性雜湊的方式存放
    > Data 以 Consistent Hashing 的方式儲存，其中分群的群數為 list length 的 4 倍 (因為要以 2*2 倍區間也就是 95% 做為定義）

### 驗證方式
在 Merkle Tree 的驗證資料中，每個節點都會以其子節點的數值做 Hash 值，所以當有人篡改了其中一個節點的數值，就會連帶影響到上層所算出的 Hash 值。故我們可以使用此方式進行驗證，以確保最後所得的資料並沒有被竄改。

### Merkle Tree 分支 - Sparse Merkle Tree
基本的 Merkle Tree 被用來驗證節點是否存在在樹上，但若是要進行未存在節點的驗證怎麼辦？
此時我們可以使用 Merkle Tree 的其他版本 - Sparse Merkle Tree，Sparse Merkle Tree 可以用來證明 inclusion 和 non-inclusion，換句話說，也就是能夠證明某筆資料存在或不存在某個 index，以圖一為例：我們能使用 Sparse Merkle Tree 證明 H(B) 不存在在 index 3。

**實現方式:** 在沒有資料的 leaf 節點裡補上 null or 0。

### 應用場域
Merkle Tree 被應用在 Bitcoin 、區塊鏈領域、分佈式存儲資料庫(例子： AWS Dynamo DB)等，大多被用來快速驗證資料節點是否存在。
### Data 存放的 Algorithm : Consistent Hashing 原理介紹
在介紹 Consistent Hashing 以前，先介紹一下在雜湊函數中很常見的雜湊函數 - 除法雜湊法 mod，令 key 為 k，假設雜湊表有 m 個槽，我們通過取 m 的餘數，將 k 映射到雜湊的其中一個槽中，也就是 Hash(k) = k mod m 
然而，在傳統的 Hash 中，假設假設我們總共有 7 個 slot (槽），也就是 m = 7，今天增加了一個 slot，也就是 m 改為 8，則每個 key 只會有 1/8 的機率被分配到原本的 slot。假設今天我們減少了一個 slot，也就是 m = 7，則每個 key 只會有 1/7 的機率被分配到原本的 slot。這表示大部份的資料在 slot 數量改變之後都會被分送到不同的 slot。然而如果使用 Consistent Hashing 的方法，增加一個 slot，則每個 key 只有 1/8 的機率會改變映射關係；減少一個節點，則每個 key 只有 1/7 的機率會改變映射關係。

![](https://i.imgur.com/bJ35dPE.png)
假設我們今天使用了一個函數，這個函數會將 Object 轉換成一個 unsigned integer，而它的大小在 0 ~ 2^32-1 之間，若我們想要將 data 分 3 群，我們則會透過這個函數將這 3 群資料的 hash 分散在 0 ~ 2^32-1 中的 3 個 slot 裡面，而 Consistent Hashing 就是「照著順時鐘方向走，遇到的第一個 Index 為 data 的 index」。假設我們從這個 Unsigned integer 的所在位置沿著順時鐘方向走，遇到的第一個 slot 的 Index 就是這個 Key 所映射的 Hash value，如圖中標示土黃色的部分：
![](https://i.imgur.com/1FJb38r.png)
但是，假設我們使用移除一個 slot 節點的 index 呢？
傳統的 Hashing 可能就無法如 Consistent hasing 一樣，確保 hasing 的一致性，反而可能會造成像是移除一個 hash 就必須重新處理映射關係的問題。

不過就我們的情況來看，與上述原理說明不同的是，我們採用的 hash function 最後會產出 64 bits 的 hash，而非 32 bits。
另外，因為 hash 出的值我們需要確保為 64 bit，而我們的 hash function 採取的是 keccak256 取前 64 bits。

## Hash collision resolution
然而，以上的編排方式仍有可能會出現 collision 的狀況，故我們需要針對 hash 進行 collision 的處理，此處我們採取比較方便且浪費較少記憶體空間的 Linear Probing 方式處理 hashing 可能會有碰撞的問題。

## Data Hash 節點的排序方式：
會依照 keccak 算出來的分群編號由最小到大的編號排列

但為了確保最後一層的 datahash 是方便 sort 的，我們採用 element length 最接近 2^n for n = 0,1,2,...,20 的 2^n 解為儲存 data 的 node 數 （也就是最後一層）而儲存方式採用 binary tree 的方式儲存

也就是假設 hash hex string 換算成 number 為如下：

[50,4,1,0,0,0,0,0,0,0,0,0] (3 nodes * 4)

轉換成最後一層 tree node 的算式為：

2^4 node elements

[ CorrespondingHash(50), CorrespondingHash(4), 0000000000000000, CorrespondingHash(1), 0000000000000000, 0000000000000000, 0000000000000000, ... ]

## Definition
### 證據樹
### Merkle Tree builder
在建立 Merkle Tree 時，需要先定義 Merkle Tree 的資料結構：

```
class MerkleTree {
  
  // set type of tree elements
  zeroValue = 0;
  levels: number;
  nodeStorage: Buffer []; // index and value
  totalLeavesCounts: number;
  groupNumber: 0;
  
  // we can replace defaultHashFunction with any hash function we want to use for making hash value
  constructor( groupNumber: number, nodeElements: buffer | string, hashFunction = defaultHashFunction) {
    
    // set levels, hashfunction, nodeStorage Map object, zero list and totalLeavesCounts
    levels = 0;
    hashLeftAndRight = hashFunction;
    // Store node value
    nodeStorage = [];
    totalLeavesCounts = 0;
    nodeElementsLen = nodeElementsLen * 4;
    
    if (nodeElements.length > 0):
      
      // set totalLeavesCounts, level
      set totalLeavesCounts = nodeElements.length;
      set level = 0;
      
      // 遍歷 Elements 和放進 nodeStorage
      for each nodeElements and set the nodeStorage;
      
      calculate (2^n - nodeElements length   for n=0,1,2...,20) 最小正數 result  

      // set levels = n;
      levels = n (from upper calculation);
      
      // set node's index in level
      set NodesInLevel;
      
      // 遍歷 Merkle tree
      const dataHashes = getObjectHash();
      // 使用廣度優先排序 並由最後一層做到第一層
      for loop to store dataHashes:
          use dataHashes to do hash and store hash in nodeStorage;
          if level = last level: // i > ( 2**(n+1)-2 ) - 2**n )
             // n level index
             const dataHash = new DataHashRing(nodeElementsLen, nodeElements).getObjectHash();
             store dataHash to DataHashes
          if (result - dataHash.length) > 0:
             store 64bits 0 to DataHashes
      
   }
   
}

```
### Hash
在 Merkle Tree 的定義中，我們會使用到 Hash，而此處使用到的 Hash 我們採用先前開發的 js-Keccak-Laria 中的 keccak 256 hash function

hashMerkle(leftString, rightString):
```
const Keccak = require('@cafeca/keccak');
const keccak256 = new Keccak('keccak256'); 
hashMerkle(leftString: string, rightString: string) {
     
    return keccak256.update([BigInt(leftString),BigInt(rightString)]).digest('hex');
}

```
### Merkle Tree related function

insertNodes():
// add leaf to 證據珠
```
insertNodes(value: Buffer []) {
    const addedNodes = addDataNode( value );
    // add values
    add addedNodes to nodeStorage (last level)
    // totalLeavesCount = leaf count from upper levels + leafValue.length
    totalLeavesCount = leaf count from upper levels + addedNodes (last level);
    // do caculation again
    for loop to store hash to parents until no siblings:
        store Hash(Buffer,siblings)
        store Hash to parents

}
```

getIndex(targetHashValue):
```
getIndex(targetHashValue) {
  find targetValue in NodeStorage
  return targetValue index;
}
```

indexToValue(index):
```
indexToKey(index): string {
  return NodeStorage[index];
}
```

getRoot(): string
```
getRoot(): string {
  // get root hash (index = 0)
  return nodeStorage.get(0);
}
```

removeNodes(index: number): string 
```
removeNodes(index: number): string {
   use index to map hash value and find target nodes;
   update dataValueBlock node to 0;
   update node's value to keccak256('0');
   level = node's level;
   for loop util index = 0: 
       hash with siblings and store to parent node;  
}
```

### Prover
// 檢測 tree 是否有被竄改
proof(root_hash):
```
proof(root_hash){
    const rootHash = Hash(nodeStorage[1], nodeStorage[2])
    if root_hash === rootHash:
        return true;
    else:
        return false;
}
```
// 檢測某 index 的 node 是否存在在樹上
proofIndexNode(index):

```
proofIndexNode(index){
    for loop to parents until reach the root:
        do Hash(index of node's hash ,siblings hash);
    if roothash!= previous root hash:
        return false;
    else:
        return true;
}
```
----
### Data 存放 - Consistent Hashing ring
Class Consistent ring data structure:
```
Class DataHashRing {
    
    objectNodes: null,         // original group node hash
    nodes: null,               // list of all nodes 
    keyHashMap: null,          // key hash map {"0x1679..(64bits)": dataBuffer, "0x178u..": 1, ...}
    nodeCount: 0,              // all node count
    groupNumber: 0

    // constructor
    constructor(datalist , groupNumber) {
        this.groupNumber = groupNumber;
        buildHashRing()
    }

    // pseudocode is down below
    keccakHash(s) function,
    buildHashRing(datalist) function,
    addDataNode() function,    
    concatDataNodes() function,
    getElementHash(value) function,
    getElementValue(hash) function,
    removeNode() function,
    
}
```

keccakHash(s):
```
function keccakHash(Buffer) {
    let result;
    // 取前 64 bits
    result = Buffer.slice(0,64);
    i = 0;
    let nextHashValue = Int64(result);
    while ( nodes contains ( nextHashValue ) ):
        i = i + 1;
        nextHashValue = nextHashValue + i;
    // 直到沒有遇到 重複的 Hashvalue 為止
    return nextHashValue;

}
```

buildHashRing:
```
function buildHashRing(datalist) {
    
    const groupNumber = this.groupNumber;
    // initialize nodeCount to 0
    let nodeCount = 0;

    // 將 2**64-1 分成 group number 等分
    for i to groupNumber:
        add this.keccakHash("group_"+i ) to objectNodes;
        add this.keccakHash("group_"+i) to nodes;
        // add element to KeyHashMap
        KeyHashMap[this.keccakHash("group_"+i)] = "group_"+i;
        // nodeCount contains object node and data node
        this.nodeCount += 1;

    // add element to hash ring
    for element in datalist:
        add this.keccakHash(element) to nodes;
        // add element to KeyHashMap
        KeyHashMap[this.keccakHash(element)] = element;
        // nodeCount contains object node and data node
        this.nodeCount += 1;       

}
```

addDataNode:
```
function addDataNode( dataElements: Array (not Empty array) ) {

    // concatDataNodes 
    elements = this.concatDataNodes(new Array(), dataElements);

    // transfer elements to hash and store in nodes
    for element in elements:
        add keccakHash(element) to nodes;
        // add element to KeyHashMap
        KeyHashMap[keccakHash(element)] = element;
        // nodeCount contains object node and data node
        this.nodeCount += 1;
    // sort nodes to node is in the correct space (do binary search)
    sort nodes;
    return this;

}
```

concatDataNodes:
```
function concatDataNodes( targetArray, array ) {
    // add elements to targetArray and return
    for (let i = 0; i < array.length; i++) {
        targetArray.push(array[i]);
    }
    return targetArray;
}
```

getElementHash:
```
function getElementHash( value ) {

    elementHash = keccakHash(value);
    find elementHash in which range of objectNodes;

    for i in objectNodes range:
        if(find elementHash in nodes) {
            // for collision
            while(keyHashMap[elementHash]!=value):
               elementHash = elementHash + 1;
            return elementHash;
        }
    // if no value
    return -1;

}
```
getElementValue:
```
function getElementValue(elementHash) {
    find elementHash in which range of objectNodes;
    // find elementHash
    for i in objectNodes range:
        if(find elementHash in nodes) {
            // for collision
            while(keyHashMap[elementHash]!=value):
               elementHash = elementHash + 1;
            return elementHash;
        }
    // if no value, return -1
    return -1;
}
```

removeNode:
```
function removeGroupNode( nodename (ex: group_1)) {
    
    // remove object nodes from nodes
    for( var i = 0; i < nodes.length; i++){ 
        if ( nodes[i] === this.keccakHash(nodename) ) { 
            nodes.splice(i, 1); 
            // node is removed
            return true;
        }
    }
    // remove group node in objecNode
    for( var i = 0; i < objecNode.length; i++){ 
        if ( nodes[i] === this.keccakHash(nodename) ) { 
            nodes.splice(i, 1); 
            // node is removed
            return true;
        }
    }
    // delete objectNode in HashMap
    
    return this

}
```
getObjectHash(): string[] 
```
getObjectHash(): string[] {
    return this.objectNodes;
}
```
### Sample

input: 

`new MerkleTree(3, [1,2,3] , keccak)`
 
MerkleTree 會呼叫 new DataHashRing(3*4, [1,2,3])

DataHashRing 會進行 Data 的 Hash 計算，並且將其自動分為 12 群，且這個分群最後需要產出接近 2^n 次方的數字

接著，會將所有的 data 群再 hash 一次，並且經過 binary search tree sort 完所有 hash 值後 ouput 成為 data hash

DataHash output:

`[c89efdaa54c0f20c, ad7c5bef027816a8, 2a80e1ef1d7842f2, 0, 0, 0, 0, 0, 0, 0, 0, 0]`

To int:

`[14456270761914069516, 12500967747770390184, 3062696163719791346, 0, 0, 0, 0, 0, 0, 0, 0, 0]`

To binary search tree:

`[c89efdaa54c0f20c, 0, ad7c5bef027816a8, 2a80e1ef1d7842f2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] (all 2^4)`

在計算完 hash 值後，將 hash 兩個兩個一組做 Hash 值

最終會產生類似篇文章第一張圖的 Tree
```
c89efdaa54c0f20c -
                 |-- 1bbefdd0eea01c68 --|
0000000000000000 -                      |-- 5805552ca6a1f5e7 --|
ad7c5bef027816a8 -                      |                      |
                 |-- 345b0b5b878c6407 --|                      |
2a80e1ef1d7842f2 -                                             |-- ce411687eba6b2dd --|
0000000000000000 -                                             |                      |
                 |-- 3ab96d3f576e4b38 --|                      |                      |
0000000000000000 -                      |-- 4279c53f951892bc --|                      |
0000000000000000 -                      |
                 |-- 3ab96d3f576e4b38 --|
0000000000000000 -
.
.
.
.
2^4 last level nodes
```
