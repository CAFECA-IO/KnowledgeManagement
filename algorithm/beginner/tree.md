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

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/ff66c067-ff56-4936-836b-88ac23ff07ae)

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/404ce013-1c52-4131-80b5-4ddb0b5e4129)

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/bc44242e-816d-424e-a5d6-b55e5dbb2681)

# Binary Search Tree (BST)

- 不會有重複的值
- 是排序好的，其中 parent node 的 left child 小於 parent node ，right child 大於 parent node
- 本身是 two-branch，但因為 Binary Search Tree 本身是經過排序的，用 one-branch recursion 找到目標值是最簡單的

## e.g. find 5

- 先從 root 下手，因為 5 > 2，所以接著從 root 的 right child 下手，因為 5 > 3，所以接著從 3 的 right child 下手，因為 5 > 4，所以接著從 4 的 right child 下手，但 4 是 leaf node，也就是 4 的 children node 都為 null，所以得知 5 不存在這一個 binary search tree 裡，最後回傳 false

<img width="385" alt="Screenshot 2023-12-04 at 16 40 38" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/ed88584e-0dcd-4f1a-9b6c-f165473fd8ad">


## The time complexity of the search

- 如果 BST 本身是平衡 (balanced) 的，也就是 root 的左右兩邊 node 數量差不多，則時間複雜度為 O(log n)，但如果是失衡 (unbalanced) 的，則時間複雜度為 O(n)
    - 也可將時間複雜度看成 O(h) ，其中 h 為 tree 的高度
        - h = log n, for a balanced tree
        - h = n, for an unbalanced tree

- unbalanced tree
<img width="381" alt="Screenshot 2023-12-04 at 16 41 37" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/fc25d12d-089b-4088-b79a-02e5f60e66c8">

- balanced tree
<img width="254" alt="Screenshot 2023-12-04 at 16 41 33" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/37f5808e-0c0e-4918-bd2d-8cab1a251cf2">



## code snippet

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

### code snippet

```jsx
// Insert a new node and return the root of the BST.
function insert(root, val) {
    if (root == null) {
        return new TreeNode(val);
    }

    if (val > root.val) {
        root.right = insert(root.right, val);
    } else  if (val < root.val) {
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

### Case 1: 刪掉 2
<img width="783" alt="Screenshot 2023-12-04 at 16 28 28" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/a08f43fd-30c3-4816-abd7-747861d46e7d">

### Case 2: 刪掉 3 
<img width="749" alt="Screenshot 2023-12-04 at 16 30 24" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/011e9621-06de-43f1-893b-728283bb46d9">


### Case 3: 刪掉 6
- 刪掉 6 之後，為了補上空缺，需找 6 左邊最大的 node 或右邊最小的 node
<img width="766" alt="Screenshot 2023-12-04 at 16 28 38" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/75e126ad-8c4a-4b8f-8d87-879b664d97ac">

## Time complexity of insertion, removal, and search
| Operation | Average | Worst Case |
| --- | --- | --- |
| Insert | O(log n) | O(n) |
| Remove | O(log n) | O(n) |
| Search | O(log n) | O(n) |

### Case 4: 刪掉 4

<img width="778" alt="Screenshot 2023-12-04 at 16 31 29" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/775712ab-5df2-494a-90fe-cc21755398d1">

# Balanced Binary Search Tree (BBST)

## Time complexity of insertion, removal, and search
| Operation | Average | Worst Case |
| --- | --- | --- |
| Insert | O(log n) | O(log n) |
| Remove | O(log n) | O(log n) |
| Search | O(log n) | O(log n) |



# Depth-First Search (DFS) 適用於任何樹狀資料結構，不限於 BST

- 

# Breadth-First Search (BFS) 適用於任何樹狀資料結構，不限於 BST

-


# Merkle Tree

-

# Reference

- https://neetcode.io/courses/dsa-for-beginners
- https://www.scaler.com/topics/data-structures/tree-data-structure/
- https://www.youtube.com/watch?v=q4fnJZr8ztY
- https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/algorithm/merialize.md
- https://github.com/CAFECA-IO/js-Merialize-Laria
