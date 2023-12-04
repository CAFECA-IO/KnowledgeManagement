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

https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=929&x=161&y=31&w=712&h=628&store=1&accept=image%2F*&auth=LCA%2037495dc3bf58559d5f2cdb47a098be9fc8927d7959a1f4046d4c8427410f7db9-ts%3D1701674363

https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=965&x=-34&y=721&w=740&h=707&store=1&accept=image%2F*&auth=LCA%209499310057edfba7d90039b72069c0510f044ac015207eda7a8753a0c3622339-ts%3D1701674363

https://documents.lucid.app/documents/22bc2fe8-79fe-48ad-a88b-5cef4dc64847/pages/0_0?a=965&x=780&y=758&w=857&h=704&store=1&accept=image%2F*&auth=LCA%20ed464270cc145e3fa39361924ae7c762c5d335b66ae1197ae0a4f555f9d83cb1-ts%3D1701674363

# Binary Search Tree

- 不會有重複的值
- 是排序好的，其中 parent node 的 left child 小於 parent node ，right child 大於 parent node

# BST Insert and Remove

-

# Balanced BST

-

# Depth-First Search

-

# Breadth-First Search

-

# BST Sets and Maps

-

# Merkle Tree

-

# Reference

- https://neetcode.io/courses/dsa-for-beginners
- https://www.scaler.com/topics/data-structures/tree-data-structure/
-
-
-
