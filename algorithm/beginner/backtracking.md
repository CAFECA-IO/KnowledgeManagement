# Overview

這篇文章談論了一種稱為“回溯法” (backtracking) 的演算法，這種演算法與我們之前討論過的二元樹 (binary tree) 上的深度優先搜索(DFS)類似。它採用了暴力搜尋 (brute-force) 的方式。想像我們需要尋找“圖形鎖的所有可能組合” (**all possible combinations of a pattern lock**)，我們必須進行全面搜索來找出所有可能的組合，即實際上沒有比一個個搜尋所有組合更好的方法來獲得所有組合。這就是回溯法的主旨。我們探索執行任務的一種可能方法，如果不成功，我們就回溯並尋找其他方法，直到找到解決方案。

以下代碼皆使用 Javascript 作為示範。

# Explanation with Example

## 問題：確定從樹的根部 (root) 到葉子節點 (leaf node) 是否存在一條路徑。該路徑不能包含任何零。

解讀：這個問題基本上是在問我們是否可以從根節點走到葉節點而不遇到值為0的情況。如果存在這樣的路徑，我們返回true；如果不存在，則返回false。

思路：首先想到的是使用深度優先搜索。我們的限制是路徑中不能有值為0的節點。我們還知道，如果樹是空的，那麼也不存在有效路徑。最後，如果我們到達一個葉子節點並且還沒有返回false，我們可以返回true，因為這意味著存在從根到葉的路徑。

為了這個問題，假設只存在一條路徑，所以它必須存在於右子樹 (right subtree) 或左子樹 (left subtree) 中。我們任意選擇先嘗試左邊。如果左子樹中找不到答案，演算法將在右子樹中搜索，如果存在路徑，它將返回true。

給定的樹為 `[4,0,1,null,7,0,2]`，如以下圖示。如果路徑中有0，則該路徑無效。

現在我們知道了我們的基礎案例，將其轉化為代碼就簡單了。

![Backtracking - backtracking](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/b1941cf9-4b3e-46e1-b2bb-7dc7d8479b9e)

```jsx
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}   
  
function canReachLeaf(root) {
    if (root == null || root.val == 0) {
        return false;
    } 
    if (root.left == null && root.right == null) {
        return true;
    }
    if (canReachLeaf(root.left)) {
        return true;
    }
    if (canReachLeaf(root.right)) {
        return true;
    }
    return false;
}
```

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/fc28bf55-891b-4000-9bdd-a4fa330dd7a6)

## 問題：返回路徑的所有值

解讀：在這個問題中，我們可以傳遞一個參數path，這是一個列表，用於儲存有效路徑中的所有節點。因此，給定樹 `[4,0,1,null,7,3,2,null,null,null,0]`，如下圖所示。其中能肯定的是，根節點符合“非零”的條件，所以首先將根節點加入我們的堆疊 (stack) ，目前 path 有 `[4]`
![Backtracking - backtracking (3)](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/24ca69a1-67ce-430b-b35b-24588462872d)

思路：由於只有一條有效路徑，它要麼在左子樹，要麼在右子樹。優先考慮左子樹而不是右子樹，左子樹無效，因為4的左子節點是0。我們返回false，現在遞迴 (recursively) 檢查右子樹。向右走，1是有效的，所以我們將它加入我們的列表。現在，我們檢查3，它是有效的，所以也被加入到我們的列表。3的左子節點是null，所以我們返回false。檢查3的右子節點時，我們再次達到基礎案例。現在，我們必須**從我們的堆疊 (stack) 中移除3**，因為如果存在有效路徑，我們已經返回true了。我們回到3的父節點，即1，並檢查其右子樹。我們將2加入到我們的列表中。然後我們探索2，但2是葉子節點，這使得遞迴調用返回true，之後函數返回true。我們的有效路徑是`[4,1,2]`。

過程如下圖所示

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/898c0cb5-18ac-4010-bc88-1d5e82a5eb28)

```jsx
function leafPath(root, path) {
    if (root == null || root.val == 0) {
        return false;
    }
    path.push(root.val);

    if (root.left == null && root.right == null) {
        return true;
    }
    if (leafPath(root.left, path)) {
        return true;
    }
    if (leafPath(root.right, path)) {
        return true;
    }
    path.remove(path.size() - 1);
    return false;
}
```

# Time complexity and space complexity

- 樹共有 n 個節點，時間複雜度是 O(n)，必須遍歷 (traverse) 整棵樹
- 需要用一個堆疊儲存結果，空間複雜度是 O(n)

# Summary

## backtracking 可以解決的問題

- 在二叉樹中找到所有符合指定條件的路徑。
- 從一組元素中選擇 k 個元素，使得這 k 個元素的總和最大或最小。
- 將一組元素排列成特定的順序。

## backtracking 的工作原理

1. 從問題的初始狀態開始。
2. 檢查是否找到答案。如果找到，則返回答案。
3. 如果沒有找到答案，則嘗試所有可能的選擇。
4. 對於每個選擇，都將其應用於問題，並重複步驟 2 和 3。
5. 如果所有可能的選擇都嘗試過，但仍然沒有找到答案，則返回空值。

- backtracking 是一種抽象算法，並不僅限於應用於 binary trees，會在接下來的章節將這種算法應用在其他資料結構上。

# Reference

- [Tree maze](https://neetcode.io/courses/dsa-for-beginners/22)


