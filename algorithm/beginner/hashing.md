# **雜湊 (hashing)**

# Overview

本文介紹如何利用雜湊來實現映射（map）和集合（set）的知識，以及**`HashSet`**和**`HashMap`** 的使用方法。

集合與映射的**區別**在於集合不會將其鍵 (key) 映射到任何東西，也就是只有 key，而映射則包含鍵值對（key-value pair），避免文章冗長，接下來主要介紹映射 （map）。

# Hash usage

## Tree Maps vs Hash Maps

我們先比較一下 hash map、tree map (參考 [trees](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/algorithm/beginner/trees.md#overview) ) ，了解使用每種資料結構的取捨。

| Operation         | TreeMap  | HashMap | Array                                                |
| ----------------- | -------- | ------- | ---------------------------------------------------- |
| Insert            | O(log n) | \*O(1)  | O(n)                                                 |
| Remove            | O(log n) | \*O(1)  | O(n)                                                 |
| Search            | O(log n) | O(1)    | O(log n), if sorted and used binary search algorithm |
| Inorder traversal | O(n)     | -       | -                                                    |

\*注：表中列出的 HashMap 的時間複雜度是平均情況的時間複雜度，至於為什麼不是“最糟情況”的時間複雜度，實作知識章節會說明。

HashMap 的缺點是它們不是有序的，所以不能保證像 BST 將值存儲在固定位置。如果我們想遍歷所有鍵，首先需要對它們進行排序，然後遍歷，這將以`O(n log n)`的時間運行。

### Example

由於 HashMap 不允許重複並且具有鍵值對，我們可以利用它們來計算鍵的頻率。

例如，給定以下 array ，我們可以將所有元素作為鍵添加到雜湊映射中。由於雜湊映射不允許重複，我們可以利用這一點。如果在我們的 array 中再次遇到在雜湊映射中已作為鍵存在的名稱，我們可以將其值增加 1。如果該名稱不存在，我們可以將其添加到我們的雜湊映射中並將頻率設置為 1。

```jsx
["alice", "brad", "collin", "brad", "dylan", "kim"];
```

| key    | value |
| ------ | ----- |
| Alice  | 1     |
| Brad   | 2     |
| Collin | 1     |
| Dylan  | 1     |
| Kim    | 1     |

```jsx
const names = ["alice", "brad", "collin", "brad", "dylan", "kim"];
const countMap = new Map();

for (let i = 0; i < names.length; i++) {
  // If countMap does not contain name
  if (!countMap.has(names[i])) {
    countMap.set(names[i], 1);
  } else {
    countMap.set(names[i], countMap.get(names[i]) + 1);
  }
}
```

使用雜湊映射實現上述算法比使用樹映射更高效。使用樹映射，插入操作將花費 O(log n) 時間，如果 n 是 array 的大小，總時間將是 O(n log n)。而在雜湊映射的情況下，這僅花費 O(n)。

# Knowledge of Hash implementation

# Reference

- [hash](https://neetcode.io/courses/dsa-for-beginners/26)
- [Understanding Hash Tables](https://www.baeldung.com/cs/hash-tables#:~:text=Furthermore%2C%20the%20average%20complexity%20to,regardless%20of%20the%20aimed%20operation.)
