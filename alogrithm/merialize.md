# Overview
## Principle
![](https://i.imgur.com/kngYziw.png)
圖一

圖片來源 [BitcoinWiki](https://en.bitcoinwiki.org/wiki/Main_Page)

Merkle Tree 雜湊樹本身是一個樹狀的資料結構，且 Merkle Tree 是一個二元樹。其驗證資料存放方式是由最底層的子節點開始將文件進行 Hash 計算，然後由節點存放算出的 Hash 值，若這層的節點並非完整的偶數個節點，則會把最後的節點再複製一份以確保節點個數是偶數個。除此之外，因為 Merkle Tree 為二元樹狀結構，上層節點會是下層節點數的一半，每個節點會將下層的兩個子節點存放的 Hash 值一起做 Hash 計算後存放在節點，並依序由下層往上做，直到最後剩下第一層的 root 節點存放算出的 Hash 值，也就是總和整棵樹的節點算出的 Hash 值。
### 驗證方式
在 Merkle Tree 的驗證資料中，每個節點都會以其子節點的數值做 Hash 值，所以當有人篡改了其中一個節點的數值，就會連帶影響到上層所算出的 Hash 值。故我們可以使用此方式進行驗證，以確保最後所得的資料並沒有被竄改。

### Merkle Tree 分支 - Sparse Merkle Tree
基本的 Merkle Tree 被用來驗證節點是否存在在樹上，但若是要進行未存在節點的驗證怎麼辦？
此時我們可以使用 Merkle Tree 的其他版本 - Sparse Merkle Tree，Sparse Merkle Tree 可以用來證明 inclusion 和 non-inclusion，換句話說，也就是能夠證明某筆資料存在或不存在某個 index，以圖一為例：我們能使用 Sparse Merkle Tree 證明 H(B) 不存在在 index 3。

**實現方式:** 在沒有資料的 leaf 節點裡補上 null or 0。

### 應用場域
Merkle Tree 被應用在 Bitcoin 、區塊鏈領域、分佈式存儲資料庫(例子： AWS Dynamo DB)等，大多被用來快速驗證資料節點是否存在。

## Definition
### Merkle Tree builder
在建立 Merkle Tree 時，需要先定義 Merkle Tree 的資料結構：

```
class MerkleTree {
  
  // set type of tree elements
  zeroValue = zero value;
  levels: number;
  hashLeftAndRight: (left: string, right: string) => string;
  nodeStorage: Map<string, string>;
  zeros: string[];
  totalLeavesCounts: number;
  
  // we can replace defaultHashFunction with any hash function we want to use for making hash value
  constructor(levels: number, nodeElements: string[] = [], hashFunction = defaultHashFunction) {
  
    // set levels, hashfunction, nodeStorage Map object, zero list and totalLeavesCounts
    levels = levels;
    hashLeftAndRight = hashFunction;
    nodeStorage = new Map();
    zeros = [];
    totalLeavesCounts = 0;
    
    // initialize the tree with zero value in the elemet
    push zero value to zeros[]
   
    let currentZeroNode = this.zeroValue;
    for loop i < levels:
      currentZeroNode = this.hashLeftAndRight(currentZeroNode, currentZeroNode);
      this.zeros.push(currentZeroNode);
    
    if (nodeElements.length > 0):
      // set totalLeavesCounts, level
      set totalLeavesCounts = nodeElements.length;
      set level = 0;
      
      // 遍歷 Elements 和放進 nodeStorage
      for each nodeElements and set the nodeStorage;
      
      // set level = 1;
      level++;
      
      // set node's index in level
      set NodesInLevel;
      
      // 遍歷 Merkle tree
      for loop level <= levels:
        for loop i < NodesInLevel:
          make MerleTree's leftNode and store key in leftKey;
          store leftNode in leftNode;
          make MerleTree's rightNode and store key in leftKey;
          store rightNode in rightNode;
          // put leftNode and rightNode in hash function
          set node = hashFunction(leftNode, rightNode);
          NodeStorage.set(node's Merkle tree key , node)
        // 結束完一層進行上一層
        NodesInLevel = Math.ceil(NodesInLevel / 2);
      
   }
   
}

```
### Hash
在 Merkle Tree 的定義中，我們會使用到 Hash，而此處使用到的 Hash 我們採用先前開發的 js-Keccak-Laria 中的 keccak 256 hash function
```
const Keccak = require('@cafeca/keccak');
const keccak256 = new Keccak('keccak256'); 
```
### Prover
### Verifier

