# Overview

- 本文會先介紹 binary tree 的定義，接著介紹 binary search tree (BST) 以及 BST 的 search, insert, remove, rotate，接著介紹泛用於樹狀結構的搜尋方法深度優先搜尋 (Depth-first search, DFS) 跟廣度優先搜尋 (Breadth-first search, BFS)，最後，介紹常見於區塊鏈的樹狀結構 Merkle tree
- 範例程式碼皆為 Javascript

# Binary Tree

- 每個 node 可以用來儲存 integer, string, object, … 任意資料型態
- 每個 node 都有 left pointer, right pointer
- 第一層 node 為 root
- 當 node 沒有任何 children ，則為 leaf node
- node 有上下級關係，第一層 node 為第二層 node 的 parent，第二層 node 為第一層 node 的 children ，可分為 left child and right child；有同一個 parent 的兩個 children nodes 可稱為 sibling nodes
- 相鄰的 nodes 不能連接起來、pointer 是單向的，不能是任何形式的 cycle
- node 要連接在同一棵樹上，node 散落在其他地方就不能叫做連貫的 binary tree
- 在 A node 上面的 nodes 為 A 的 ancestor，在 A node 下面的 node 為 A 的 descendant
- Height 取決於 **descendant 數量**
  - 將單一 node 的高度視為 1 ， `node 2` left subtree 共有 2 個 **descendant**（高度為 2+1=3），right subtree 有 1 個 descendant（高度為 1+1=2），則取最高值 3
  - （另一種做法是將 single node 視為 0）
- Depth 取決於 **ancestor 數量**
  - 將單一 node 的深度視為 1 ， `node 4` 的有 2 個 **ancestor** ，深度為 2+1=3
  - （另一種做法是將 single node 視為 0）

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4540&x=-1630&y=-1646&w=1356&h=1013&store=1&accept=image%2F*&auth=LCA%2028f42601b428e2599239a2919a0dbf8823feddc942af06e079e6fcb5d7647863-ts%3D1701704902">

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4542&x=22&y=-1595&w=1163&h=774&store=1&accept=image%2F*&auth=LCA%200102f3d589d26b369d52f345d61692da035e4e0c8f9d542d8294f582747fdc08-ts%3D1701704902">

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4542&x=-1712&y=-421&w=2678&h=1734&store=1&accept=image%2F*&auth=LCA%20cbd078ee061dd9a6ba108b22af52a6801e4456a450eecd9f1c2302f2cc04778b-ts%3D1701704902">

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4542&x=-1569&y=1858&w=1519&h=823&store=1&accept=image%2F*&auth=LCA%20969e429c9f635dd6caef5e321363121d73bf9d12a6fb61fad891b097b2d64f80-ts%3D1701704902">

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4568&x=-50&y=1823&w=1541&h=823&store=1&accept=image%2F*&auth=LCA%2004bdfe7c8fc8ccc845f5990a621d6902a5fd7c598a58332cbc74b8421053842d-ts%3D1701704902">

## code snippet of binary tree node

```jsx
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
```

# Binary Search Tree (BST)

- 不能有重複的值
- 是排序好的，其中 parent node 的 left child 小於 parent node ，right child 大於 parent node
- 本身是 two-branch，但因為 Binary Search Tree 本身是經過排序的，用 one-branch recursion 找到目標值是最簡單的

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4568&x=4042&y=-1581&w=1277&h=903&store=1&accept=image%2F*&auth=LCA%202a5f2aa67fdca3894e191bcb160b783867a7f869ae8a877f0f34b2f6201e76a3-ts%3D1701704902">

## e.g. find 5

- 先從 root 下手，因為 5 > 2，所以接著從 root 的 right child 下手，因為 5 > 3，所以接著從 3 的 right child 下手，因為 5 > 4，所以接著從 4 的 right child 下手，但 4 是 leaf node，也就是 4 的 children node 都為 null，所以得知 5 不存在這一個 binary search tree 裡，最後回傳 false


<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4568&x=5672&y=-1753&w=1497&h=1165&store=1&accept=image%2F*&auth=LCA%20b950a8251de4b62519743a62909fcadb4a66679fa4532fbcc956084e1b1cf7e3-ts%3D1701704902">

## The time complexity of the search

- 如果 BST 本身是平衡 (balanced) 的，也就是 root 的左右兩邊 node 數量差不多，則時間複雜度為 O(log n)，但如果是失衡 (unbalanced) 的，則時間複雜度為 O(n)
  - 也可將時間複雜度看成 O(h) ，其中 h 為 tree 的高度
    - h = log n, for a balanced tree
    - h = n, for an unbalanced tree
  - 是否平衡可參考 balance factor (BF)
    ```jsx
    bf=(Height of left subtree) - (Height of right subtree)
    balanced: -1<=bf<=1
    unbalanced: bf<-1 or bf>1
    ```
- unbalanced tree

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4604&x=3715&y=-560&w=2003&h=1314&store=1&accept=image%2F*&auth=LCA%20b2829c0a4e6e39fa277a1c95d87ef9a15d62d67d2986ece063fe6bbd18760a12-ts%3D1701704902">

- balanced tree

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4603&x=5745&y=-563&w=1629&h=936&store=1&accept=image%2F*&auth=LCA%20ce00490e982335d81378e6771dc22922be75f9a63367c8a6eec9ed5d9ebe6c0c-ts%3D1701704902">

## code snippet of search in BST

```jsx
function search(root, target) {
  if (root == null) {
    return false;
  }

  if (target > root.val) {
    return search(root.right, target);
  } else if (target < root.val) {
    return search(root.left, target);
  } else {
    return true;
  }
}
```

# BST Insert and Remove

## Insertion

### e.g. Insert 6

- 將 value 加在 leaf node 會比較簡單
- 將 6 加到 BST

<img width="165" alt="Screenshot 2023-12-04 at 16 39 37" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/dc8c2209-b68c-4a6b-a703-4eae9aa2f0b5">

- 有兩種可能結果

<img width="153" alt="Screenshot 2023-12-04 at 16 39 44" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/4c7d4b63-bd8a-477c-9230-b51db4ed7ff6">

<img width="141" alt="Screenshot 2023-12-04 at 16 39 40" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/2970acea-9484-4441-bf75-bc34bca9e229">

### code snippet of insertion in BST

```jsx
// Insert a new node and return the root of the BST.
function insert(root, val) {
  if (root == null) {
    return new TreeNode(val);
  }

  if (val > root.val) {
    root.right = insert(root.right, val);
  } else if (val < root.val) {
    root.left = insert(root.left, val);
  }
  return root;
}
```

## Removal

- 因為刪掉目標 node 之後仍需維持 BST 的特性，所以依照維持難度分為兩個情境
  1. 目標 node 有 0 或 1 個 child
  2. 目標 node 有 2 個 children

<img width="397" alt="Screenshot 2023-12-04 at 16 28 22" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/b47c7763-7cb1-49ca-b098-3638dd42609b">

### Case 1: remove node 2

<img width="783" alt="Screenshot 2023-12-04 at 16 28 28" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/a08f43fd-30c3-4816-abd7-747861d46e7d">

### Case 2: remove node 3

<img width="749" alt="Screenshot 2023-12-04 at 16 30 24" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/011e9621-06de-43f1-893b-728283bb46d9">

### Case 3: remove node 6

- 刪掉 6 之後，為了補上空缺，需找 6 左邊最大的 node 或右邊最小的 node
  <img width="766" alt="Screenshot 2023-12-04 at 16 28 38" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/75e126ad-8c4a-4b8f-8d87-879b664d97ac">

## Time complexity of insertion, removal, and search

| Operation | Average  | Worst Case |
| --------- | -------- | ---------- |
| Insert    | O(log n) | O(n)       |
| Remove    | O(log n) | O(n)       |
| Search    | O(log n) | O(n)       |

### Case 4: 刪掉 4

<img width="778" alt="Screenshot 2023-12-04 at 16 31 29" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/775712ab-5df2-494a-90fe-cc21755398d1">

### code snippet of removal in BST

```jsx
// Return the minimum value node of the BST.
function minValueNode(root) {
  let curr = root;
  while (curr != null && curr.left != null) {
    curr = curr.left;
  }
  return curr;
}

// Remove a node and return the root of the BST.
function remove(root, val) {
  if (root == null) {
    return null;
  }
  if (val > root.val) {
    root.right = remove(root.right, val);
  } else if (val < root.val) {
    root.left = remove(root.left, val);
  } else {
    if (root.left == null) {
      return root.right;
    } else if (root.right == null) {
      return root.left;
    } else {
      let minNode = minValueNode(root.right);
      root.val = minNode.val;
      root.right = remove(root.right, minNode.val);
    }
  }
  return root;
}
```

## Tree rotation

- 旋轉是維持 BST 平衡的關鍵，會大量用於 AVL or Red-Black Trees
- 左右兩邊高度相差大於 1 代表失衡，此時可用旋轉保持平衡

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=4923&x=3727&y=965&w=2487&h=1779&store=1&accept=image%2F*&auth=LCA%20dd5a33b77f476df8b55f39c5352e835543a4a173211b06beedee1bf5058e145e-ts%3D1701704902">

### Right Rotation

- 在 balance factor > 1 並且 bf > 1 的 target node 跟它附近的 node 正負號相同，則將 target node 右旋轉

### code snippet of right rotation

```jsx
function rightRotate(root) {
  let newRoot = root.left;
  root.left = newRoot.right;
  newRoot.right = root;
  return newRoot;
}
```

### Left Rotation

- 在 balance factor < -1 並且 bf < -1 的 target node 跟它附近的 node 正負號相同，則將 target node 左旋轉

### code snippet of left rotation

```jsx
function leftRotate(root) {
  let newRoot = root.right;
  root.right = newRoot.left;
  newRoot.left = root;
  return newRoot;
}
```

# Depth-First Search (DFS)

## 1. in-order traversal

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=5234&x=4157&y=3150&w=1393&h=1079&store=1&accept=image%2F*&auth=LCA%20891cb792dd09e707a0c2628f1188913e4d196746c05682714d6c0e1c397957cd-ts%3D1701704902">

- 在 BST 中，中序遍歷首先訪問左子樹 (left subtree)，然後訪問根節點 (root node)，最後訪問右子樹 (right subtree)。
- 例如，對於一棵根節點是 4 的 BST，遍歷的順序將是左子節點 (left child node)，然後是根節點 4，最後是右子節點 (right child node)。
- 這種遍歷方式對於排序後的節點值特別有用。

### code snippet of in-order traversal

```jsx
function inorder(root) {
  if (root == null) {
    return;
  }
  inorder(root.left);
  console.log(root.val);
  inorder(root.right);
}
```

## 2. pre-order traversal

- 在 BST 中，先序遍歷的順序是首先訪問根節點 (root node)，接著訪問左子樹 (left subtree)，最後訪問右子樹 (right subtree)。
- 在根節點為 4 的 BST 中，遍歷的順序會是先訪問根節點 4，然後是左子樹，最後是右子樹。
- 這種遍歷方式適合於創建樹的複本或打印樹的結構。

### code snippet of pre-order traversal

```jsx
function preorder(root) {
  if (root == null) {
    return;
  }
  console.log(root.val);
  preorder(root.left);
  preorder(root.right);
}
```

## 3. post-order traversal

- 在 BST 中，後序遍歷的順序是首先訪問左子樹 (left subtree)，接著是右子樹 (right subtree)，最後是根節點 (root node)。
- 在根節點為 4 的 BST 中，遍歷的順序會是先訪問左子樹，然後是右子樹，最後是根節點 4。
- 這種遍歷方式適合於釋放或刪除樹節點。

### code snippet of post-order traversal

```jsx
function postorder(root) {
  if (root == null) {
    return;
  }
  postorder(root.left);
  postorder(root.right);
  console.log(root.val);
}
```

## 4. reverse-order traversal

- 在 BST 中，反向中序遍歷的順序是首先訪問右子樹 (right subtree)，接著是根節點 (root node)，最後是左子樹 (left subtree)。
- 這是中序遍歷的反向，適合於輸出降序排列的節點值。

### code snippet of reverse-order traversal (swapped in-order traversal)

```jsx
function inorder(root) {
  if (root == null) {
    return;
  }
  inorder(root.right);
  console.log(root.val);
  inorder(root.left);
}
```

## The time complexity of traversing is O(n)

# Breadth-First Search (BFS)

- 廣度優先搜尋，也稱為層序遍歷 (level order traversal)，首先訪問根節點 (root node)，然後逐層訪問所有子節點。
- 在 BST 中，從根節點 4 開始，接著訪問左子節點 3 (left child node) 和右子節點 6 (right child node)，然後遍歷這些節點的子節點。
- BFS 通常使用隊列 (queue) 來追蹤下一個要訪問的節點，這種方法對於尋找最短路徑或與層級相關的問題特別有效。

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=5554&x=4160&y=4387&w=1313&h=771&store=1&accept=image%2F*&auth=LCA%204eb76bdf0e89db36c08bb8cb1eedd8b3bd7e6c3bd60450365c1f8007510ee3ac-ts%3D1701704902">

### code snippet of BFS

```jsx
function bfs(root) {
  let queue = [];
  if (root != null) {
    queue.push(root);
  }
  let level = 0;
  while (queue.length > 0) {
    console.log("level " + level + ": ");
    let levelLength = queue.length;
    for (let i = 0; i < levelLength; i++) {
      let curr = queue.shift();
      console.log(curr.val + " ");
      if (curr.left != null) {
        queue.push(curr.left);
      }
      if (curr.right != null) {
        queue.push(curr.right);
      }
    }
    level++;
    console.log();
  }
}
```

# Merkle Tree (Hash tree)

## Structure of a Merkle Tree

- D 為 Data
- H 為 Hash function
- 將每個資料都各自使用雜湊函數，可以在之後個別驗證單一資料，如果將所有資料一口氣丟進雜湊函數得到一個雜湊值，就無法達到驗證特定數量資料的功能
- 如果 node 數量為奇數，則複製最後一個的 node 以確保平衡

<img src="https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=1621&x=-464&y=2265&w=2267&h=1189&store=1&accept=image%2F*&auth=LCA%204dfbd69652a127d126cc6aef0823492b3a9784b9c024c5ffa85d6d578d70a272-ts%3D1701704902">

### What is hashing

雜湊（Hashing）是一種將任意長度的輸入資料（通常稱為「訊息」）通過雜湊函數處理，轉化成固定長度的輸出值的過程。這個輸出值通常稱為「雜湊值」或「數字指紋」

- **不可逆性**：雜湊過程是單向的，從生成的雜湊值不能直接推算出原始輸入。
- **唯一性**：理想的雜湊函數對於不同的輸入會產生不同的輸出值。即使是微小的輸入差異也會導致截然不同的雜湊值。
- **固定長度的輸出**：無論輸入的長度如何，雜湊函數產生的輸出長度都是固定的。
- **高效計算**：雜湊函數能夠快速計算出輸入的雜湊值。
- **碰撞抵抗**：理想的雜湊函數讓找到兩個不同輸入但產生相同雜湊值（即「碰撞」）的情況變得非常困難。

### Why is hashing used in a Merkle Tree

- 資料完整性驗證：雜湊函數可確保每筆交易的唯一性和完整性。當資料被雜湊處理後，任何微小的變動都會導致雜湊值發生巨大變化，從而輕易發現資料被篡改。
- 安全性：雜湊函數具有單向性，這意味著從雜湊值無法逆推原始資料，這增加了資料的安全性。此外，好的雜湊函數具有高碰撞抵抗性，即找到兩個不同輸入但產生相同雜湊值的情況非常困難。
- 效率：在區塊鏈系統中，需要頻繁且快速地驗證大量資料。雜湊函數提供了一種高效的方式來生成和比對資料的指紋（即雜湊值）。通過比較雜湊值而不是完整資料，可以節省大量的計算和存儲資源。
- 簡化驗證過程：在區塊鏈中，使用 Merkle Tree 可以有效地簡化資料驗證過程。只需檢查少數幾個節點的雜湊值，就能驗證單個交易或資料塊的有效性，無需下載整個資料塊或整個區塊鏈。
- 資料結構的整合：Merkle Tree 通過將單獨的資料塊（如交易）的雜湊值組織成樹狀結構，使得整個資料集的雜湊值可以在 Merkle Root 中集中表示。這種結構使得資料的存儲和驗證更加高效和有組織。

# Reference

- [Neetcode course](https://neetcode.io/courses/dsa-for-beginners)
- https://www.scaler.com/topics/data-structures/tree-data-structure/
- [balanced binary search tree (BBST)](https://www.youtube.com/watch?v=q4fnJZr8ztY)
- [KM - merialize](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/algorithm/merialize.md)
- [merialize implementation by js](https://github.com/CAFECA-IO/js-Merialize-Laria)
- [BST visualization](https://www.cs.usfca.edu/~galles/visualization/BST.html)
- [AVL tree](https://www.youtube.com/watch?v=zP2xbKerIds)
- [AVL tree visualization](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html)
- [Merkle tree explained](https://www.youtube.com/watch?v=fB41w3JcR7U)
