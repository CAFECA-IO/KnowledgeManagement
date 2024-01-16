# 雜湊 (hashing)

# Overview

本文介紹如何利用雜湊來實現映射（map）和集合（set）的知識，以及`HashSet`和`HashMap` 的使用方法。

集合與映射的區別在於集合不會將其鍵 (key) 映射到任何東西，也就是只有 key，而映射則包含鍵值對（key-value pair），避免文章冗長，接下來主要介紹映射 （map）。

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

知道怎麼使用 hash 比實現 hash 更重要，hash 映射最常見的實現方式是在底層使用陣列。 我們的 hash 映射可以是零大小，但最初我們的陣列不會是零大小。

假設我們想用以下鍵值對來填滿我們的陣列。

```jsx
hashmap["Alice"] = "NYC";
hashmap["Brad"] = "Chicago";
hashmap["Collin"] = "Seattle";
```

為此，我們需要引入所謂的雜湊（hashing）和雜湊函數。 雜湊函數接受鍵（在本例中為字串）並將其轉換為整數。 相同的字串將始終得到相同的整數。 使用這個整數，我們可以確定我們希望儲存鍵值對的位置。

---

## Insertion and Hashing

以`"Alice"`為例。 我們的雜湊函數將取該字串中的每個字元並獲取其 ASCII 碼。 然後將這些 ASCII 碼加起來，以確定其在陣列中的位置。 然而，由於這可能是一個巨大的數字且容易越界，我們可以使用模運算子。 假設`"Alice"`中所有字符的 ASCII 碼總和為 2525。 為了確定其在陣列中的位置，我們可以使用公式：`ASCII 碼總和 mod 陣列大小`。 在本例中，大小為 22。 因此，`2525 mod 22`的結果是 11，這是我們儲存第一個鍵值對的位置。 這個過程有時也稱為預雜湊（pre-hashing）。

由於我們的陣列大小只有 22，當我們取模時，另一個鍵值對可能會得到相同的陣列位置。 這稱為碰撞（collision），碰撞非常常見。 有方法試圖最小化碰撞，但它們是不可避免的。 我們將很快更詳細地討論碰撞。

為了確保每個鍵值對找到一個空位，我們將追蹤陣列的大小和實際已滿的索引數量。 這樣做的方式是：當陣列的容量為原來的兩倍時，或當雜湊映射變成半滿時，也就是陣列中一半的索引被佔用。 在本例中，我們有一個大小為 22，並且由於添加`"Alice" : "NYC"`將導致映射變成半滿，我們將在執行下一次插入*之前*將其大小加倍。 尺寸的工作方式與我們在動態陣列章節中所描述的相同。

> 我們不會在插入新鍵值對時調整陣列的大小，而是當陣列變成半滿時立即這樣做。 這確保我們在插入前最小化碰撞。

一旦我們執行了調整大小，我們將進行稱為重雜湊（re-hashing）的操作。 由於陣列的大小已經改變，需要重新計算已經存在於雜湊映射中的所有元素的位置。 我們在索引 11 處插入了`"Alice"`。 在將陣列大小加倍後，`"Alice"`的新位置在這個案例中恰好還是索引 11，所以我們不需要更新它。 然而，如果`"Alice"`的新位置現在是索引 22，我們需要移動它。

> 如果我們想要保持操作的 O(1) 時間複雜度，我們需要進行重雜湊。 我們最初以 22 的大小開始。 假設我們想要將 10,000 個鍵值對插入陣列中。 當我們希望搜尋"Alice"時，我們會根據新的大小計算位置，而"Alice"可能不再處於那個位置！

假設將`"Brad"`轉換為整數得到 2727。 `27 mod 4 = 3`，意味著`"Brad" : "Chicago"`將最終位於第 33 個索引。 現在，我們將大小加倍到 88。

## Collisions

假設將`"Collin"`轉換為整數得到 3333。 `33 mod 8 = 1`。 這是一次碰撞，因為 Alice 已經住在第一個索引中。 我們該如何解決這個問題？ 我們可以直接覆蓋，但這意味著我們最終會丟失`"Alice"`。 我們也可以不斷增加陣列的大小，直到我們為`"Collin"`找到一個空位。 然而，這是一個巨大的內存浪費。

我們可以透過兩種常見的方式來處理碰撞：

1. 鏈接 (Chaining)

   連接是透過將 linked list 節點串聯在一起來實現的，這樣可以在同一索引處儲存多個鍵值對。

   因為 Alice 和 Collin 屬於同一索引，我們可以將它們儲存為 linked list 物件。 在這種情況下，搜尋、插入和刪除的時間複雜度降低為 O(n)。 這樣，任何未來屬於相同索引的鍵都會被儲存為 linked list 鏈中的一個節點。

   <!-- 下面的視覺展示了這一點。 -->

2. 開放尋址 (Open addressing)

   開放尋址的概念是找到下一個可用的插槽位，這樣我們就不會在一個索引中儲存多個鍵值對。 與連接相比，如果碰撞數量較少，這種技術更有效。 然而，這裡的限制是表中的總條目數受陣列大小的限制。

> 為了減少發生的碰撞數量，選擇雜湊映射為質數大小在數學上是有意義的。 這是因為質數只能被 11 和它本身整除！ 如果你有興趣，[CS StackExchange](https://cs.stackexchange.com/questions/11029/why-is-it-best-to-use-a-prime-number-as-a-mod-in-a-hashing-function)上的這篇文章提供了數學證明。

## Code Implementation


# Reference

- [hash](https://neetcode.io/courses/dsa-for-beginners/26)
- [Understanding Hash Tables](https://www.baeldung.com/cs/hash-tables#:~:text=Furthermore%2C%20the%20average%20complexity%20to,regardless%20of%20the%20aimed%20operation.)
- [CS StackExchange](https://cs.stackexchange.com/questions/11029/why-is-it-best-to-use-a-prime-number-as-a-mod-in-a-hashing-function)
