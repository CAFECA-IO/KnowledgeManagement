## Overview

這篇文章談論了一種稱為“回溯法” (backtracking) 的演算法，這種演算法與我們之前討論過的二元樹 (binary tree) 上的深度優先搜索(DFS)類似。它採用了暴力搜尋 (brute-force) 的方式。想像我們需要尋找“圖形鎖的所有可能組合” (**all possible combinations of a pattern lock**)，我們必須進行全面搜索來找出所有可能的組合，即實際上沒有比一個個搜尋所有組合更好的方法來獲得所有組合。這就是回溯法的主旨。我們探索執行任務的一種可能方法，如果不成功，我們就回溯並尋找其他方法，直到找到解決方案。

以下代碼皆使用 Javascript 作為示範。

## Explanation with Example

問題：確定從樹的根部 (root) 到葉子節點 (leaf node) 是否存在一條路徑。該路徑不能包含任何零。

解讀：這個問題基本上是在問我們是否可以從根節點走到葉節點而不遇到值為0的情況。如果存在這樣的路徑，我們返回true；如果不存在，則返回false。

思路：首先想到的是使用深度優先搜索。我們的限制是路徑中不能有值為0的節點。我們還知道，如果樹是空的，那麼也不存在有效路徑。最後，如果我們到達一個葉子節點並且還沒有返回false，我們可以返回true，因為這意味著存在從根到葉的路徑。

為了這個問題，假設只存在一條路徑，所以它必須存在於右子樹 (right subtree) 或左子樹 (left subtree) 中。我們任意選擇先嘗試左邊。如果左子樹中找不到答案，演算法將在右子樹中搜索，如果存在路徑，它將返回true。

給定的樹為 [4,0,1,null,7,0,2]，如以下圖示。如果路徑中有0，則該路徑無效。

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


## Reference
- [Tree maze](https://neetcode.io/courses/dsa-for-beginners/22)

