# B-Tree
## 參考
- [programiz B-tree](https://www.programiz.com/dsa/b-tree)

![](https://i.kym-cdn.com/photos/images/newsfeed/001/384/531/8ed.jpg)
# 1. 前言


B-Tree 是為了讓我們在硬碟中找資料時，不要存取太多次硬碟，因為硬碟讀取速度很慢，但可以存很多東西。所以我們可以在一個Node裡面多塞幾個，然後把整個tree的高度壓扁一點，高度越低訪問硬碟的次數月少。

> 以下python是使用 Type strict去寫，所以code有很多type的設定大家可以忽略

![B tree-20240423002704362](https://hackmd.io/_uploads/HkVNHm4-C.png)

# 2. 結構特性
![](https://cdn.programiz.com/sites/tutorial2program/files/b-tree.png)

1. 一個Node分成keys 和 children, keys才是資料真正儲存的位置，child 則是下一層的node，用key區分範圍，一個`child[i]`內所有的keys，都是parent keys中 `key[i]`, `key[i+1]` 中間的值，child會比key多一個，因為keys的兩次都可以有一個child
2. 實做方面由於array是對齊的，如果有 `key[i]`，左小孩是`child[i]`, 右小孩是 `child[i+1]`
3. 每一個node, 他的key都要從小到大排序
4. node需要紀錄 `node.leaf`(boolean)，代表 這個值是不是leaf
5. 如果 n 是 BTree的order(指tree中最多child的node有幾個child)，keys最多就是 n - 1個
6. 除了root以外的node，每個node最多n 個 child，最少 n/2個child，這是為了有效利用BTree的結構，在一個node裡存多一點東西。實做上會用 t = n/2 代替，所以一個node最多2t children, 最少 t children
7. root 最少要有一個key和兩個child（除了最一開始時)
8. 所有leaf都在同一個高度
9. 如果 `n >= 1`, 任何一個有 n個 "key"的 BTree, (並有 `h` 高度，以及node最小children數`t`)時， `h ≥ logt (n+1)/2` （不知道怎麼證明）


| 演算法 | **平均**     | **最差**     |
| --- | ---------- | ---------- |
| 空間  | O(_n_)     | O(_n_)     |
| 搜尋  | O(log _n_) | O(log _n_) |
| 插入  | O(log _n_) | O(log _n_) |
| 刪除  | O(log _n_) | O(log _n_) |
# 3. Implement
需要實做的有
- Node本體
- Search
- Insert
- Delete

## 3-1. BTreeNode

一個node如下，紀錄
- leaf: 這個node是否是
- keys: 每個 "key"都要有一個可以排大小的值當作index，其他要放什麼隨便，以下放的string
- children: 小孩BTreeNode，比keys多一個
```python
class BTreeNode():
    def __init__(self, leaf: bool = False) -> None:
        self.leaf: bool = leaf
        # key is a list of tuples with int and str elements
        self.keys: list[tuple[int, str]] = []
        self.children: list[BTreeNode] = []
```

## 3-2 BTree init
BTree init 時只需要創造
- root: 創一個空的 BTreeNode當作root, 記得要把leaf設成true
- t: 一個node最小有幾個child

```python
class BTree():
    def __init__(self, t: int) -> None:
        self.root: BTreeNode = BTreeNode(True) # init 的時候, root是leaf

        # 控制一個Node可以有幾個child
        # child 有 t ~ 2t 之間
        # key 在 t ~ (2t - 1) 之間 
        self.t: int = t
```

## 3-3 search
可以先看：[[B tree#3-3 步驟演示]]

### 3-3 範例code
- 先移動到 尋找值key 可能存在的地方，也就是 比左邊的key都還要大
- 如果有找到就回傳
- 如果是leaf還是找不到回傳None
- 如果不是小孩就像下繼續找
```python
    def searchKey(self, key: int , node: None | BTreeNode = None) -> tuple[BTreeNode | None, int]:
        if not node:
            return self.searchKey(key, self.root)
        
        idx = 0
        keysLength = len(node.keys)

        # 找到key 可能出現的位置, 比前一個key還大但小於等於後一個
        # 注意如果沒有停下來，最後idx 會 == keysLength
        # 由於key會比child 少一個，所以比所有key都大時，會用keysLength去下一層找最後一個
        while idx < keysLength and node.keys[idx][0] < key:
            idx += 1
        
        if idx < keysLength and key == node.keys[idx][0]:
            # 找到了就回傳自己，和值是在自己身上的第幾index的key
            return (node, idx)
        elif node.leaf:
            # 找到底端了，找不到東西
            return (None, -1)
        else:
	        # 找不到就遞迴向下找
            return self.searchKey(key, node.children[idx])
```

### 3-3 步驟演示
> 目標： 找到17

首先先從11開始

![](https://cdn.programiz.com/sites/tutorial2program/files/search-2.png)


17 比 11 大，進入11 的右child
![](https://cdn.programiz.com/sites/tutorial2program/files/search-4.png)


搜尋node找不到 17，進入 16與18中間
![](https://cdn.programiz.com/sites/tutorial2program/files/search-5.png)

找到 17
![](https://cdn.programiz.com/sites/tutorial2program/files/search-6.png)

## 3-4 Insert
可以先看 [[B tree#3-4 步驟演示]]

### 3-4 範例code
```python
    def insert(self, keyValue: tuple[int, str]) -> None:
        # 真正的邏輯是root滿了就先切分
        # 新root 暫時沒有key,只有一個原本的root當child
        # 然用split去切開元root，把 中間的key上升到新的root

        # 這邊可以用 == 
        if len(self.root.keys) >= (2 * self.t) - 1:
            originRoot = self.root
            newUpperRoot = BTreeNode(False)
            self.root = newUpperRoot

            newUpperRoot.children.insert(0, originRoot) # 原root就當地一個child
            self.splitChild(newUpperRoot, 0) # 切原本的root (在新的root的 0 號 children)
            self.insertNonFull(newUpperRoot, keyValue)
        else:
            self.insertNonFull(self.root, keyValue)

        return None
    

    def insertNonFull(self, node: BTreeNode, keyValue: tuple[int, str]) -> None:
        # 真正的insert邏輯在此
        # 使用while迴圈會比用 list.insert更高效一點
        # 另外要注意插入後keys長度是否會超過 2* t -1，是要在parentNode檢查,
        # 因此不在 node.leaf 時檢查

        idx = len(node.keys) - 1

        if not node.leaf: # 如果有小孩
            while idx >= 0 and keyValue[0] < node.keys[idx][0]:
                idx -= 1
            # 這邊我們要找的是child, child 比key多一格 （key的右邊小孩才是要插入的位置)
            idx += 1
            print(node.keys)

            # 如果要插入的child 已經滿了，先切開 => idx移動到正確的位置 => 再插入
            if len(node.children[idx].keys) >= (2 * self.t) - 1: # 這邊可以用 ==
                self.splitChild(node, idx) # 要從parent這邊切
                # keys 被 splitChild動過了，因此要重新調整位置
                if keyValue[0] > node.keys[idx][0]:
                    idx += 1
            self.insertNonFull(node.children[idx], keyValue) # 繼續往下
        else: # 如果沒有小孩, 不須檢查overflow就插入
            # 這邊的 (-1, "Placeholder")是 (None, None)的代替，因為我開啟嚴格type
            # (-1, "Placeholder") 是一個placeholder,會被取代
            node.keys.append((-1, "Placeholder"))
            # 從後往前找一個可以插入的位置， 走過的都往後搬一格
            while idx >= 0 and keyValue[0] < node.keys[idx][0]:
                node.keys[idx + 1] = node.keys[idx]
                idx -= 1
            node.keys[idx + 1] = keyValue

    
    def splitChild(self, parentNode: BTreeNode, idx: int) -> None:
        # self.t 是 child 和 key數量的下限, t-1也是整個要被切兩半的正中間
        # 一個node 的 key 會被切成 0~t-1, t - 1, t ~ 2*t-1 (end包含)
        # if t = 2, key will be 2~ 2*2-1 =3, child will be 2~ 2*2
        # key = |0|t-1|t|
        # child=|0|t-1|t|t+1|
        
        t = self.t
        # 要被提升到parent 的 child
        childBeSplited = parentNode.children[idx]
        otherHalfOfChild = BTreeNode(childBeSplited.leaf)

        # 被切出來的右半邊放在被切的node的下一個位置
        # 注意這裡是array原生的insert, 不是用btree的
        parentNode.children.insert(idx + 1, otherHalfOfChild)

        # child key = t - 1升級到parent, 放在 被切的左右邊中間
        keyUpToParent = childBeSplited.keys[t - 1]
        # 注意這裡是array原生的insert, 不是用btree的
        parentNode.keys.insert(idx, keyUpToParent)

        # 把被切的node的key 除了 t-1 以外分給兩邊
        otherHalfOfChild.keys = childBeSplited.keys[t: (2 * t) - 1] # 淺copy就可以，因為我們只是改指向
        childBeSplited.keys = childBeSplited.keys[0 : t - 1]

        # 如果被切的node不是最後的leaf, 小孩也要分兩半
        if not childBeSplited.leaf:
            otherHalfOfChild.children = childBeSplited.children[t : 2*t]
            childBeSplited.children = childBeSplited.children[0: t] # 注意不是t-1
```

### 3-4 步驟1 split
當一個node 的 keys值超過上限 `2t - 1`(也就是children超過 `2t`)時，就要把node 切兩半，步驟如下:
- 在parentNode身上選擇一個 `children[i]`，接著我們要切的是`children[i]`，但由於切玩之後要把新小孩接到parent身上，所以是在parent身上呼叫
- 以下不一定要照順序
	- 創一個新小孩otherHalfOfChild，接在 parentChildren 的 `i + 1`位置當作右小孩
	- `children[i]` 的 `keys[t-1]` 是整個child存放的值的正中心
	- 把`keys[t-1]`insert到 parentKey 的`i`位置，這個時候 被切的小孩會在此key的左小孩，切出來新的Node則是右小孩
	- 把`children[i]` t~2t-2 的 keys貼到新增出來的node的keys, t~2t-1 child貼到 新增出來的node的children
	- 把`children[i]`  的 keys 縮短剩下 0~t-2, children縮短剩下 0~t-1

```python
    def splitChild(self, parentNode: BTreeNode, idx: int) -> None:
        # self.t 是 child 和 key數量的下限, t-1也是整個要被切兩半的正中間
        # 一個node 的 key 會被切成 0~t-1, t - 1, t ~ 2*t-1 (end包含)
        # if t = 2, key will be 2~ 2*2-1 =3, child will be 2~ 2*2
        # key = |0|t-1|t|
        # child=|0|t-1|t|t+1|
        
        t = self.t
        # 要被提升到parent 的 child
        childBeSplited = parentNode.children[idx]
        otherHalfOfChild = BTreeNode(childBeSplited.leaf)

        # 被切出來的右半邊放在被切的node的下一個位置
        # 注意這裡是array原生的insert, 不是用btree的
        parentNode.children.insert(idx + 1, otherHalfOfChild)

        # child key = t - 1升級到parent, 放在 被切的左右邊中間
        keyUpToParent = childBeSplited.keys[t - 1]
        # 注意這裡是array原生的insert, 不是用btree的
        parentNode.keys.insert(idx, keyUpToParent)

        # 把被切的node的key 除了 t-1 以外分給兩邊
        otherHalfOfChild.keys = childBeSplited.keys[t: (2 * t) - 1] # 淺copy就可以，因為我們只是改指向
        childBeSplited.keys = childBeSplited.keys[0 : t - 1]

        # 如果被切的node不是最後的leaf, 小孩也要分兩半
        if not childBeSplited.leaf:
            otherHalfOfChild.children = childBeSplited.children[t : 2*t]
            childBeSplited.children = childBeSplited.children[0: t] # 注意不是t-1
```

### 3-4 步驟2 insert non root
以下是在不是root的時候的插入狀況，分以下兩個狀況
1. 是中間Node(有小孩)：
	1. 從右邊往左找(不知道為什麼)，找到可以插入的點 i
	2. 如果爆倉了，就把 `children[i]`切開，切完後 `keys[i]`會變成`children[i].keys[t-1]`
	3. 不論有沒有切，遞迴 `i`
2. 是leaf
	1. 直接insert在正確位置就好
	2. 這邊不用怕爆倉，因為parent層就檢查好了才會進入leaf

> 這邊叫做 `insertNonFull`， 但是我覺得比較像是插入在非root
```python
   def insertNonFull(self, node: BTreeNode, keyValue: tuple[int, str]) -> None:
        # 真正的insert邏輯在此
        # 使用while迴圈會比用 list.insert更高效一點
        # 另外要注意插入後keys長度是否會超過 2* t -1，是要在parentNode檢查,
        # 因此不在 node.leaf 時檢查

        idx = len(node.keys) - 1

        if not node.leaf: # 如果有小孩
            while idx >= 0 and keyValue[0] < node.keys[idx][0]:
                idx -= 1
            # 這邊我們要找的是child, child 比key多一格 （key的右邊小孩才是要插入的位置)
            idx += 1

            # 如果要插入的child 已經滿了，先切開 => idx移動到正確的位置 => 再插入
            if len(node.children[idx].keys) >= (2 * self.t) - 1: # 這邊可以用 ==
                self.splitChild(node, idx) # 要從parent這邊切
                # keys 被 splitChild動過了，因此要重新調整位置
                if keyValue[0] > node.keys[idx][0]:
                    idx += 1
            self.insertNonFull(node.children[idx], keyValue) # 繼續往下
        else: # 如果沒有小孩, 不須檢查overflow就插入
            # 這邊的 (-1, "Placeholder")是 (None, None)的代替，因為我開啟嚴格type
            # (-1, "Placeholder") 是一個placeholder,會被取代
            node.keys.append((-1, "Placeholder"))
            # 從後往前找一個可以插入的位置， 走過的都往後搬一格
            while idx >= 0 and keyValue[0] < node.keys[idx][0]:
                node.keys[idx + 1] = node.keys[idx]
                idx -= 1
            node.keys[idx + 1] = keyValue
```

### 3-4 步驟3 insert root
insert root和 下面圖片的邏輯不太一樣，code是用top down的方法實做
- 當我們發現root爆倉的時候：
	- 先生出一個新的root
	- 把原本的root當作新root的0 號小孩，然後切原root，把原root `t-1`的key上升到新的root當key
	- 這個時候新的root就會有1個key加上切兩半的兩個小孩，tree也長高一層
- 沒有爆倉時：
	- 直接插入
```python
    def insert(self, keyValue: tuple[int, str]) -> None:
        # 真正的邏輯是root滿了就先切分
        # 新root 暫時沒有key,只有一個原本的root當child
        # 然用split去切開元root，把 中間的key上升到新的root

        # 這邊可以用 == 
        if len(self.root.keys) >= (2 * self.t) - 1:
            originRoot = self.root
            newUpperRoot = BTreeNode(False)
            self.root = newUpperRoot

            newUpperRoot.children.insert(0, originRoot) # 原root就當地一個child
            self.splitChild(newUpperRoot, 0) # 切原本的root (在新的root的 0 號 children)
            self.insertNonFull(newUpperRoot, keyValue)
        else:
            self.insertNonFull(self.root, keyValue)

        return None
```

### 3-4 步驟演示

1. If the tree is empty, allocate a root node and insert the key.
2. Update the allowed number of keys in the node.
3. Search the appropriate node for insertion.
4. If the node is full, follow the steps below.
5. Insert the elements in increasing order.
6. Now, there are elements greater than its limit. So, split at the median.
7. Push the median key upwards and make the left keys as a left child and the right keys as a right child.
8. If the node is not full, follow the steps below.
9. Insert the node in increasing order.
![](https://cdn.programiz.com/sites/tutorial2program/files/insertion.png)

## 3-5 Delete
### 3-5 範例程式碼
> 推薦從下往上閱讀
```python
    # Delete (keyValue)
    def delete(self, node: BTreeNode, keyValue: tuple[int, str]) -> tuple[int, str] | None:
        t = self.t
        i = 0

        # 找到keyValue可以刪除的位置
        while i < len(node.keys) and keyValue[0] > node.keys[i][0]:
            i += 1
        # Case 1-1, delete leaf (此時已確認過不會刪光)
        if node.leaf:
            if i < len(node.keys) and keyValue[0] == node.keys[i][0]:
                return node.keys.pop(i)
            return None
        
        # Case 1-2, 找到要刪除的，但是是internal node
        if i < len(node.keys) and keyValue[0] == node.keys[i][0]:
            return self.deleteInternalNode(node, keyValue, i) # 用內部節點刪除法
        elif len(node.children[i].keys) >= t:
            # Case 2, 沒找到, child還有足夠的key，繼續往下找
            return self.delete(node.children[i], keyValue)
        else:
            # Case 3 沒找到, child不夠key
            # 分成三種情況
            # 3-1 要往下的i是 中間的child
            if i != 0 and i + 2 < len(node.children):
                # 和internal 一樣，先看左右小孩有沒有足夠的key
                # 如果有就隨便挑一個旋轉
                # 都不夠就合併
                if len(node.children[i - 1].keys) >= t:
                    self.rotateSibling(node, i, i - 1)
                elif len(node.children[i + 1].keys) >= t:
                    self.rotateSibling(node, i, i + 1)
                else:
                    self.mergeSibling(node, i, i + 1)
                return self.delete(node.children[i], keyValue)
            # 3-2 要往下的i是 第一個child
            elif i == 0:
                # 如果是0號小孩， 只能看右邊有沒有足夠的key做旋轉，沒有就合併
                if len(node.children[i + 1].keys) >= t:
                    self.rotateSibling(node, i, i + 1)
                else:
                    self.mergeSibling(node, i, i + 1)
            # 3-3 要往下的i是 最後一個child
            elif i + 1 == len(node.children):
                # 如果是最後一個小孩， 只能看左邊有沒有足夠的key做旋轉，沒有就合併
                if len(node.children[i - 1].keys) >= t:
                    self.rotateSibling(node, i, i - 1)
                else:
                    self.mergeSibling(node, i, i - 1)
            return self.delete(node.children[i], keyValue)

        return None

    # delete internal node
    def deleteInternalNode(self, node: BTreeNode, keyValue:tuple[int, str], i: int) -> tuple[int, str] | None:
        t = self.t

        if node.leaf:
            # 是leaf且是要刪除的對象
            if keyValue[0] == node.keys[i][0]:
                return node.keys.pop(i)
            # 沒找到就returnNone
            return None
        
        # 刪除的對象是internal node
        # 如果左小孩或右小孩的key數量夠，就直接便選一邊刪除
        # 如果不夠，就要左小孩和右小孩合併
        if len(node.children[i].keys) >= t:
            node.keys[i] = self.deletePredecessor(node.children[i])
            return node.keys[i]
        elif len(node.children[i + 1].keys) >= t:
            node.keys[i] = self.deleteSuccessor(node.children[i + 1])
            return node.keys[i]
        else:
            # 如果左右小孩都不夠，就合併左右小孩？？？
            self.mergeSibling(node, i, i + 1)
            return self.deleteInternalNode(node.children[i], keyValue, t - 1)


    # Delete the predecessor
    # predecessor 是左邊小孩的最大值
    # 此時我們已經在左小孩裡面了
    # 只有leaf會真正被刪掉，其他都在調整形狀
    def deletePredecessor(self, node: BTreeNode) -> tuple[int, str]:
        if node.leaf:
            return node.keys.pop()
        
        # 不是leaf 且 "倒數第二個" 小孩的key足夠
        # 注意key比children少一個，所以n其實是倒數第二個
        # 順時鐘旋轉
        n = len(node.keys) - 1
        if len(node.children[n].keys) >= self.t:
            self.rotateSibling(node, n + 1, n)
        else:
            # 倒數第二個小孩不夠的話，倒數第二個小孩併入最後一個小孩
            self.mergeSibling(node, n, n + 1)
        return self.deletePredecessor(node.children[n])

    # Delete the successor
    # successor 是右邊小孩的最小值
    # 此時我們已經在右小孩裡面了
    # 只有leaf會真正被刪掉，其他都在調整形狀
    def deleteSuccessor(self, node: BTreeNode) -> tuple[int, str]:
        # 如果是leaf, 直接pop最小的key
        if node.leaf:
            return node.keys.pop(0)
        
        # 不是leaf 且 1 小孩的key足夠
        # 逆時針旋轉一個key 上來
        if len(node.children[1].keys) >= self.t:
            self.rotateSibling(node, 0, 1)
        else:
            # 1 小孩不夠的話，1 小孩併入0 小孩
            self.mergeSibling(node, 0, 1)
        # 繼續朝左小孩前進(因為要找到最小)
        return self.deleteSuccessor(node.children[0])

    # Delete resolution
    def mergeSibling(self, parentNode: BTreeNode, i: int, j: int):
        # 先辨認i 和 j 哪個是左兄弟
        # 把右兄弟（source）併到左兄弟(target)

        # 确定合并方向和参与合并的节点
        targetNode = parentNode.children[i]  # 默认当前节点为目标节点
        sourceNode = parentNode.children[j]  # 来源节点
        sourceIndex = j
        targetIndex = i

        if j < i:  # 如果左兄弟是来源
            targetNode, sourceNode = sourceNode, targetNode  # 交换，确保targetNode是合并后保留的节点
            sourceIndex, targetIndex = targetIndex, sourceIndex 
        
        # source 併入 target
        targetNode.keys.append(parentNode.keys[targetIndex])  # 将parent的key下移到target

        # 将source的key和child移動到target，會剩最後一個child, 因為child比key多一個
        for k in range(len(sourceNode.keys)):
            targetNode.keys.append(sourceNode.keys[k])
            if sourceNode.children: # 如果有children, 不是leaf
                targetNode.children.append(sourceNode.children[k])
        
        # 最後一個用pop, 
        if sourceNode.children:
            targetNode.children.append(sourceNode.children.pop())
        
        # 刪除parent的key, 因為下移到target了
        parentNode.keys.pop(targetIndex)

        # 刪除parent的source child, 因為source已經併入target
        parentNode.children.pop(sourceIndex)

        # 如果parent是root, 且root已經沒有key了, 代表高度整個降低一格
        # 這時候要把target變成root
        if parentNode == self.root and not parentNode.keys:
            self.root = targetNode
    
    # Delete the sibling, 從parent這邊刪除才可以
    # 從幫助者拉一個上到 parent, parent 的key 下去被幫助者
    # 這個function只是調整位置，沒有刪除東西
    def rotateSibling(self, parentNode: BTreeNode, idxNodeNeedHelp: int, idxNodeForHelp: int) -> None:
        nodeNeedHelp = parentNode.children[idxNodeNeedHelp] # 需要被幫忙的Node

        if idxNodeNeedHelp < idxNodeForHelp: # 被幫忙的是左兄弟, 幫助者是右兄弟
            # 逆時鐘旋轉
            rightNode = parentNode.children[idxNodeForHelp]
            nodeNeedHelp.keys.append(parentNode.keys[idxNodeNeedHelp])

            # 幫助者提一個上去
            parentNode.keys[idxNodeNeedHelp] = rightNode.keys.pop(0)

            # 如果有children (也就是不是leaf) 也要逆時鐘旋轉
            # 但是其實不需要上提到parent, 直接貼到另一邊
            if rightNode.children:
                nodeNeedHelp.children.append(rightNode.children.pop(0))
        else: # 被幫忙的是左兄弟, 幫助者是右兄弟
            # 順時針旋轉
            leftNode = parentNode.children[idxNodeForHelp]
            # 注意idx是前一個, 因為是在parent 的右邊
            nodeNeedHelp.keys.insert(0, parentNode.keys[idxNodeNeedHelp - 1])

            # 幫助者提一個上去
            parentNode.keys[idxNodeNeedHelp] = leftNode.keys.pop()

            if leftNode.children:
                nodeNeedHelp.children.insert(0, leftNode.children.pop())
```

### 3-5 名詞解釋
- Inorder Predecessor：左小孩中最大的
- Inorder Successor：右小孩中最小的

### 3-5 Delete 6 function

#### 3-5 Delete-1 rotateSibling
- Rotation sibling 是 AVL-Tree等 Self-balancing tree 常會有的操作
- 選定被幫忙的node與幫助者node
- 幫助者node轉一個上來到parentNode(左右小孩中間的key)，parentNode轉一個下去被幫助的node
- 右分成順時鐘旋轉和逆時鐘旋轉
    - 逆時鐘：被幫助者在左邊，幫助者在右邊，幫助者把最小的key轉到parent
    - 順時鐘：被幫助者在右邊，幫助者在左邊，幫助者把最大的key轉到parent
    - 結束後也要把child從幫助者貼到被幫助者
```python
    # Delete the sibling, 從parent這邊刪除才可以
    # 從幫助者拉一個上到 parent, parent 的key 下去被幫助者
    # 這個function只是調整位置，沒有刪除東西
    def rotateSibling(self, parentNode: BTreeNode, idxNodeNeedHelp: int, idxNodeForHelp: int) -> None:
        nodeNeedHelp = parentNode.children[idxNodeNeedHelp] # 需要被幫忙的Node

        if idxNodeNeedHelp < idxNodeForHelp: # 被幫忙的是左兄弟, 幫助者是右兄弟
            # 逆時鐘旋轉
            rightNode = parentNode.children[idxNodeForHelp]
            nodeNeedHelp.keys.append(parentNode.keys[idxNodeNeedHelp])

            # 幫助者提一個上去
            parentNode.keys[idxNodeNeedHelp] = rightNode.keys.pop(0)

            # 如果有children (也就是不是leaf) 也要逆時鐘旋轉
            # 但是其實不需要上提到parent, 直接貼到另一邊
            if rightNode.children:
                nodeNeedHelp.children.append(rightNode.children.pop(0))
        else: # 被幫忙的是左兄弟, 幫助者是右兄弟
            # 順時針旋轉
            leftNode = parentNode.children[idxNodeForHelp]
            # 注意idx是前一個, 因為是在parent 的右邊
            nodeNeedHelp.keys.insert(0, parentNode.keys[idxNodeNeedHelp - 1])

            # 幫助者提一個上去
            parentNode.keys[idxNodeNeedHelp] = leftNode.keys.pop()

            if leftNode.children:
                nodeNeedHelp.children.insert(0, leftNode.children.pop())
```


#### 3-5 Delete-2 mergeSibling
- 當刪除時有一個child的key數小於t的時候使用
- 永遠都是右邊併入左邊
    - 先把左右小孩在parentNode身上的key轉到左小孩最大keys
    - 右小孩併入左小孩
    - 併好之後刪掉右小孩和左右小孩在parentNode中間夾的key

```python
    # Delete resolution
    def mergeSibling(self, parentNode: BTreeNode, i: int, j: int):
        # 先辨認i 和 j 哪個是左兄弟
        # 把右兄弟（source）併到左兄弟(target)

        # 确定合并方向和参与合并的节点
        targetNode = parentNode.children[i]  # 默认当前节点为目标节点
        sourceNode = parentNode.children[j]  # 来源节点
        sourceIndex = j
        targetIndex = i

        if j < i:  # 如果左兄弟是来源
            targetNode, sourceNode = sourceNode, targetNode  # 交换，确保targetNode是合并后保留的节点
            sourceIndex, targetIndex = targetIndex, sourceIndex 
        
        # source 併入 target
        targetNode.keys.append(parentNode.keys[targetIndex])  # 将parent的key下移到target

        # 将source的key和child移動到target，會剩最後一個child, 因為child比key多一個
        for k in range(len(sourceNode.keys)):
            targetNode.keys.append(sourceNode.keys[k])
            if sourceNode.children: # 如果有children, 不是leaf
                targetNode.children.append(sourceNode.children[k])
        
        # 最後一個用pop, 
        if sourceNode.children:
            targetNode.children.append(sourceNode.children.pop())
        
        # 刪除parent的key, 因為下移到target了
        parentNode.keys.pop(targetIndex)

        # 刪除parent的source child, 因為source已經併入target
        parentNode.children.pop(sourceIndex)

        # 如果parent是root, 且root已經沒有key了, 代表高度整個降低一格
        # 這時候要把target變成root
        if parentNode == self.root and not parentNode.keys:
            self.root = targetNode
```

#### 3-5 Delete-3 deleteSuccessor
- 刪掉右邊小孩的最小值
- 注意此時我們已經在右小孩裡面了
- 最後只會刪掉一個leaf，其他動作都在調整tree的架構
    - 如果是leaf就直接刪掉
    - 刪掉的話左小孩(最小值所在地)會少一個，所以我們要補員
        - 如果`index=1`小孩的key足夠(`>t`)逆時針轉一個上來，再從parent轉一個下去補左小孩
        - 如果`index=1`小孩的key不夠旋轉，直接合併左右小孩
```python
    # Delete the successor
    # successor 是右邊小孩的最小值
    # 此時我們已經在右小孩裡面了
    # 只有leaf會真正被刪掉，其他都在調整形狀
    def deleteSuccessor(self, node: BTreeNode) -> tuple[int, str]:
        # 如果是leaf, 直接pop最小的key
        if node.leaf:
            return node.keys.pop(0)
        
        # 不是leaf 且 1 小孩的key足夠
        # 逆時針旋轉一個key 上來
        if len(node.children[1].keys) >= self.t:
            self.rotateSibling(node, 0, 1)
        else:
            # 1 小孩不夠的話，1 小孩併入0 小孩
            self.mergeSibling(node, 0, 1)
        # 繼續朝左小孩前進(因為要找到最小)
        return self.deleteSuccessor(node.children[0])
```

#### 3-5 Delete-4 deletePredecessor

- 和deleteSuccessor 一樣，只是這次換成刪除左小孩最大值
- 注意此時我們已經在左小孩裡面了
- 最後只會刪掉一個leaf，其他動作都在調整tree的架構
    - 如果是leaf就直接刪掉
    - 刪掉的話右小孩(最小值所在地)會少一個，所以我們要補員
        - 如果`index=len-2`小孩的key足夠(`>t`)逆時針轉一個上來，再從parent轉一個下去補左小孩
        - 如果`index=len-2`小孩的key不夠旋轉，直接合併左右小孩

```python
    # Delete the predecessor
    # predecessor 是左邊小孩的最大值
    # 此時我們已經在左小孩裡面了
    # 只有leaf會真正被刪掉，其他都在調整形狀
    def deletePredecessor(self, node: BTreeNode) -> tuple[int, str]:
        if node.leaf:
            return node.keys.pop()
        
        # 不是leaf 且 "倒數第二個" 小孩的key足夠
        # 注意key比children少一個，所以n其實是倒數第二個
        # 順時鐘旋轉
        n = len(node.keys) - 1
        if len(node.children[n].keys) >= self.t:
            self.rotateSibling(node, n + 1, n)
        else:
            # 倒數第二個小孩不夠的話，倒數第二個小孩併入最後一個小孩
            self.mergeSibling(node, n, n + 1)
        return self.deletePredecessor(node.children[n])
```

#### 3-5 Delete-5 deleteInternalNode
- 刪除內部節點是以上幾種刪除方法的組合技
- 這邊還是需要處理leaf(不明原因？？？)
- 如果遇到leaf是要刪除的對象直接刪除
- 如果是內部節點如下操作：
    - 以下兩者可則一：
        - 左小孩夠的話，用`deletePredecessor`
        - 右小孩夠的話，用`deleteSuccessor`
    - 如果左右小孩都不夠就合併左右小孩，遞迴deleteInternalNode

```python
    # delete internal node
    def deleteInternalNode(self, node: BTreeNode, keyValue:tuple[int, str], i: int) -> tuple[int, str] | None:
        t = self.t

        if node.leaf:
            # 是leaf且是要刪除的對象
            if keyValue[0] == node.keys[i][0]:
                return node.keys.pop(i)
            # 沒找到就returnNone
            return None
        
        # 刪除的對象是internal node
        # 如果左小孩或右小孩的key數量夠，就直接便選一邊刪除
        # 如果不夠，就要左小孩和右小孩合併
        if len(node.children[i].keys) >= t:
            node.keys[i] = self.deletePredecessor(node.children[i])
            return node.keys[i]
        elif len(node.children[i + 1].keys) >= t:
            node.keys[i] = self.deleteSuccessor(node.children[i + 1])
            return node.keys[i]
        else:
            # 如果左右小孩都不夠，就合併左右小孩？？？
            self.mergeSibling(node, i, i + 1)
            return self.deleteInternalNode(node.children[i], keyValue, t - 1)
```

#### 3-5 Delete-6 Delete，請搭配下一段落一起看
- 預先準備：把idx調整到可能刪除的位置（也就是某個key上面或是兩個key中間)
- Case 1-1: 如果是leaf直接刪除
- Case 1-2：找到要刪除的，但是是internal node，使用`deleteInternalNode`
- Case 2: 沒找到，但是child 有足夠的keys (`>t`)，往下刪除不用調整，遞迴`delete`
- Case 3: 沒找到，child 的keys不足 (`<=t`)，刪除一個要調整，分成以下三種
    - Case 3-1: child不在最邊邊，代表child還有兄弟child `i-1`和`i+1`，選一邊轉一個進來補充key之後再遞迴`delete`，左右兄弟都不夠的話就合併其中一邊再遞迴`delete`
    - Case 3-2: child 是最左邊，只能從右兄弟轉一個進來補key，右兄弟也不夠就合併再遞迴`delete`
    - Case 3-3: child 是最右邊，只能從左兄弟轉一個進來補key，左兄弟也不夠就合併再遞迴`delete`

```python
    # Delete (keyValue)
    def delete(self, node: BTreeNode, keyValue: tuple[int, str]) -> tuple[int, str] | None:
        t = self.t
        i = 0

        # 找到keyValue可以刪除的位置
        while i < len(node.keys) and keyValue[0] > node.keys[i][0]:
            i += 1
        # Case 1-1, delete leaf (此時已確認過不會刪光)
        if node.leaf:
            if i < len(node.keys) and keyValue[0] == node.keys[i][0]:
                return node.keys.pop(i)
            return None
        
        # Case 1-2, 找到要刪除的，但是是internal node
        if i < len(node.keys) and keyValue[0] == node.keys[i][0]:
            return self.deleteInternalNode(node, keyValue, i) # 用內部節點刪除法
        elif len(node.children[i].keys) >= t:
            # Case 2, 沒找到, child還有足夠的key，繼續往下找
            return self.delete(node.children[i], keyValue)
        else:
            # Case 3 沒找到, child不夠key
            # 分成三種情況
            # 3-1 要往下的i是 中間的child
            if i != 0 and i + 2 < len(node.children):
                # 和internal 一樣，先看左右小孩有沒有足夠的key
                # 如果有就隨便挑一個旋轉
                # 都不夠就合併
                if len(node.children[i - 1].keys) >= t:
                    self.rotateSibling(node, i, i - 1)
                elif len(node.children[i + 1].keys) >= t:
                    self.rotateSibling(node, i, i + 1)
                else:
                    self.mergeSibling(node, i, i + 1)
                return self.delete(node.children[i], keyValue)
            # 3-2 要往下的i是 第一個child
            elif i == 0:
                # 如果是0號小孩， 只能看右邊有沒有足夠的key做旋轉，沒有就合併
                if len(node.children[i + 1].keys) >= t:
                    self.rotateSibling(node, i, i + 1)
                else:
                    self.mergeSibling(node, i, i + 1)
            # 3-3 要往下的i是 最後一個child
            elif i + 1 == len(node.children):
                # 如果是最後一個小孩， 只能看左邊有沒有足夠的key做旋轉，沒有就合併
                if len(node.children[i - 1].keys) >= t:
                    self.rotateSibling(node, i, i - 1)
                else:
                    self.mergeSibling(node, i, i - 1)
            return self.delete(node.children[i], keyValue)   
```

### 3-5 圖片詳解
- 這邊和上面的code對部起來
> Case 1-1 如果是leaf, 且刪除後node裡有足夠key，直接刪掉

![](https://cdn.programiz.com/sites/tutorial2program/files/delete-leaf-1.png)

> Case 1-2 如果是leaf，但刪到數量不足
> Case 1-2-1 刪除一個，sibling還有key可以轉進來

![](https://cdn.programiz.com/sites/tutorial2program/files/delete-leaf-2.png)

> Case 1-2-2  刪除一個，sibling不夠key，直接合併

![](https://cdn.programiz.com/sites/tutorial2program/files/delete-leaf-3.png)

> Case 2 刪除internal node

> Case 2-1 2-2 如果左右小孩足夠就轉一個上來補

![](https://cdn.programiz.com/sites/tutorial2program/files/delete-internal-1.png)

> Case 2-3 左右小孩不夠就合併左右小孩

![](https://cdn.programiz.com/sites/tutorial2program/files/delete-internal-2.png)

> Case 3 刪到整棵樹變矮，直接把root並到其中一個小孩？？？？？？

![](https://cdn.programiz.com/sites/tutorial2program/files/delete-internal_3.png)

---

# 其他有用資訊
- [Github總集合：yt-challenge](https://github.com/michaelg29/yt-challenges)
- [Programming Challenges](https://www.youtube.com/playlist?list=PLysLvOneEETP-XQZQ6VTdMIHmxbGxX6nX)
- [Eric O Meehan](https://www.youtube.com/@eom-dev/videos)
- [Programming Challenges - 30 - B-Tree Search/Insertion (C)](https://www.youtube.com/watch?v=mHI-7bCgDtM)

# 備註：全部檔案

## bTree.py

```python
# BTreeNode

class BTreeNode():
    def __init__(self, leaf: bool = False) -> None:
        self.leaf: bool = leaf
        # key is a list of tuples with int and str elements
        self.keys: list[tuple[int, str]] = []
        self.children: list[BTreeNode] = []

class BTree():
    def __init__(self, t: int) -> None:
        self.root: BTreeNode = BTreeNode(True) # init 的時候, root是leaf

        # 控制一個Node可以有幾個child
        # child 有 t ~ 2t 之間
        # key 在 t ~ (2t - 1) 之間 
        self.t: int = t

    def searchKey(self, key: int , node: None | BTreeNode = None) -> tuple[BTreeNode | None, int]:
        if not node:
            return self.searchKey(key, self.root)
        
        idx = 0
        keysLength = len(node.keys)

        # 找到key 可能出現的位置, 比前一個key還大但小於等於後一個
        # 注意如果沒有停下來，最後idx 會 == keysLength
        # 由於key會比child 少一個，所以比所有key都大時，會用keysLength去下一層找最後一個
        while idx < keysLength and node.keys[idx][0] < key:
            idx += 1
        
        if idx < keysLength and key == node.keys[idx][0]:
            # 找到了就回傳自己，和值是在自己身上的第幾index的key
            return (node, idx)
        elif node.leaf:
            # 找到底端了，找不到東西
            return (None, -1)
        else:
            return self.searchKey(key, node.children[idx])
    
    def insert(self, keyValue: tuple[int, str]) -> None:
        # 真正的邏輯是root滿了就先切分
        # 新root 暫時沒有key,只有一個原本的root當child
        # 然用split去切開元root，把 中間的key上升到新的root

        # 這邊可以用 == 
        if len(self.root.keys) >= (2 * self.t) - 1:
            originRoot = self.root
            newUpperRoot = BTreeNode(False)
            self.root = newUpperRoot

            newUpperRoot.children.insert(0, originRoot) # 原root就當地一個child
            self.splitChild(newUpperRoot, 0) # 切原本的root (在新的root的 0 號 children)
            self.insertNonFull(newUpperRoot, keyValue)
        else:
            self.insertNonFull(self.root, keyValue)

        return None
    

    def insertNonFull(self, node: BTreeNode, keyValue: tuple[int, str]) -> None:
        # 真正的insert邏輯在此
        # 使用while迴圈會比用 list.insert更高效一點
        # 另外要注意插入後keys長度是否會超過 2* t -1，是要在parentNode檢查,
        # 因此不在 node.leaf 時檢查

        idx = len(node.keys) - 1

        if not node.leaf: # 如果有小孩
            while idx >= 0 and keyValue[0] < node.keys[idx][0]:
                idx -= 1
            # 這邊我們要找的是child, child 比key多一格 （key的右邊小孩才是要插入的位置)
            idx += 1
            print(node.keys)

            # 如果要插入的child 已經滿了，先切開 => idx移動到正確的位置 => 再插入
            if len(node.children[idx].keys) >= (2 * self.t) - 1: # 這邊可以用 ==
                self.splitChild(node, idx) # 要從parent這邊切
                # keys 被 splitChild動過了，因此要重新調整位置
                if keyValue[0] > node.keys[idx][0]:
                    idx += 1
            self.insertNonFull(node.children[idx], keyValue) # 繼續往下
        else: # 如果沒有小孩, 不須檢查overflow就插入
            # 這邊的 (-1, "Placeholder")是 (None, None)的代替，因為我開啟嚴格type
            # (-1, "Placeholder") 是一個placeholder,會被取代
            node.keys.append((-1, "Placeholder"))
            # 從後往前找一個可以插入的位置， 走過的都往後搬一格
            while idx >= 0 and keyValue[0] < node.keys[idx][0]:
                node.keys[idx + 1] = node.keys[idx]
                idx -= 1
            node.keys[idx + 1] = keyValue

    
    def splitChild(self, parentNode: BTreeNode, idx: int) -> None:
        # self.t 是 child 和 key數量的下限, t-1也是整個要被切兩半的正中間
        # 一個node 的 key 會被切成 0~t-1, t - 1, t ~ 2*t-1 (end包含)
        # if t = 2, key will be 2~ 2*2-1 =3, child will be 2~ 2*2
        # key = |0|t-1|t|
        # child=|0|t-1|t|t+1|
        
        t = self.t
        # 要被提升到parent 的 child
        childBeSplited = parentNode.children[idx]
        otherHalfOfChild = BTreeNode(childBeSplited.leaf)

        # 被切出來的右半邊放在被切的node的下一個位置
        # 注意這裡是array原生的insert, 不是用btree的
        parentNode.children.insert(idx + 1, otherHalfOfChild)

        # child key = t - 1升級到parent, 放在 被切的左右邊中間
        keyUpToParent = childBeSplited.keys[t - 1]
        # 注意這裡是array原生的insert, 不是用btree的
        parentNode.keys.insert(idx, keyUpToParent)

        # 把被切的node的key 除了 t-1 以外分給兩邊
        otherHalfOfChild.keys = childBeSplited.keys[t: (2 * t) - 1] # 淺copy就可以，因為我們只是改指向
        childBeSplited.keys = childBeSplited.keys[0 : t - 1]

        # 如果被切的node不是最後的leaf, 小孩也要分兩半
        if not childBeSplited.leaf:
            otherHalfOfChild.children = childBeSplited.children[t : 2*t]
            childBeSplited.children = childBeSplited.children[0: t] # 注意不是t-1

    # Delete (keyValue)
    def delete(self, node: BTreeNode, keyValue: tuple[int, str]) -> tuple[int, str] | None:
        t = self.t
        i = 0

        # 找到keyValue可以刪除的位置
        while i < len(node.keys) and keyValue[0] > node.keys[i][0]:
            i += 1
        # Case 1-1, delete leaf (此時已確認過不會刪光)
        if node.leaf:
            if i < len(node.keys) and keyValue[0] == node.keys[i][0]:
                return node.keys.pop(i)
            return None
        
        # Case 1-2, 找到要刪除的，但是是internal node
        if i < len(node.keys) and keyValue[0] == node.keys[i][0]:
            return self.deleteInternalNode(node, keyValue, i) # 用內部節點刪除法
        elif len(node.children[i].keys) >= t:
            # Case 2, 沒找到, child還有足夠的key，繼續往下找
            return self.delete(node.children[i], keyValue)
        else:
            # Case 3 沒找到, child不夠key
            # 分成三種情況
            # 3-1 要往下的i是 中間的child
            if i != 0 and i + 2 < len(node.children):
                # 和internal 一樣，先看左右小孩有沒有足夠的key
                # 如果有就隨便挑一個旋轉
                # 都不夠就合併
                if len(node.children[i - 1].keys) >= t:
                    self.rotateSibling(node, i, i - 1)
                elif len(node.children[i + 1].keys) >= t:
                    self.rotateSibling(node, i, i + 1)
                else:
                    self.mergeSibling(node, i, i + 1)
                return self.delete(node.children[i], keyValue)
            # 3-2 要往下的i是 第一個child
            elif i == 0:
                # 如果是0號小孩， 只能看右邊有沒有足夠的key做旋轉，沒有就合併
                if len(node.children[i + 1].keys) >= t:
                    self.rotateSibling(node, i, i + 1)
                else:
                    self.mergeSibling(node, i, i + 1)
            # 3-3 要往下的i是 最後一個child
            elif i + 1 == len(node.children):
                # 如果是最後一個小孩， 只能看左邊有沒有足夠的key做旋轉，沒有就合併
                if len(node.children[i - 1].keys) >= t:
                    self.rotateSibling(node, i, i - 1)
                else:
                    self.mergeSibling(node, i, i - 1)
            return self.delete(node.children[i], keyValue)

        return None

    # delete internal node
    def deleteInternalNode(self, node: BTreeNode, keyValue:tuple[int, str], i: int) -> tuple[int, str] | None:
        t = self.t

        if node.leaf:
            # 是leaf且是要刪除的對象
            if keyValue[0] == node.keys[i][0]:
                return node.keys.pop(i)
            # 沒找到就returnNone
            return None
        
        # 刪除的對象是internal node
        # 如果左小孩或右小孩的key數量夠，就直接便選一邊刪除
        # 如果不夠，就要左小孩和右小孩合併
        if len(node.children[i].keys) >= t:
            node.keys[i] = self.deletePredecessor(node.children[i])
            return node.keys[i]
        elif len(node.children[i + 1].keys) >= t:
            node.keys[i] = self.deleteSuccessor(node.children[i + 1])
            return node.keys[i]
        else:
            # 如果左右小孩都不夠，就合併左右小孩？？？
            self.mergeSibling(node, i, i + 1)
            return self.deleteInternalNode(node.children[i], keyValue, t - 1)


    # Delete the predecessor
    # predecessor 是左邊小孩的最大值
    # 此時我們已經在左小孩裡面了
    # 只有leaf會真正被刪掉，其他都在調整形狀
    def deletePredecessor(self, node: BTreeNode) -> tuple[int, str]:
        if node.leaf:
            return node.keys.pop()
        
        # 不是leaf 且 "倒數第二個" 小孩的key足夠
        # 注意key比children少一個，所以n其實是倒數第二個
        # 順時鐘旋轉
        n = len(node.keys) - 1
        if len(node.children[n].keys) >= self.t:
            self.rotateSibling(node, n + 1, n)
        else:
            # 倒數第二個小孩不夠的話，倒數第二個小孩併入最後一個小孩
            self.mergeSibling(node, n, n + 1)
        return self.deletePredecessor(node.children[n])

    # Delete the successor
    # successor 是右邊小孩的最小值
    # 此時我們已經在右小孩裡面了
    # 只有leaf會真正被刪掉，其他都在調整形狀
    def deleteSuccessor(self, node: BTreeNode) -> tuple[int, str]:
        # 如果是leaf, 直接pop最小的key
        if node.leaf:
            return node.keys.pop(0)
        
        # 不是leaf 且 1 小孩的key足夠
        # 逆時針旋轉一個key 上來
        if len(node.children[1].keys) >= self.t:
            self.rotateSibling(node, 0, 1)
        else:
            # 1 小孩不夠的話，1 小孩併入0 小孩
            self.mergeSibling(node, 0, 1)
        # 繼續朝左小孩前進(因為要找到最小)
        return self.deleteSuccessor(node.children[0])

    # Delete resolution
    def mergeSibling(self, parentNode: BTreeNode, i: int, j: int):
        # 先辨認i 和 j 哪個是左兄弟
        # 把右兄弟（source）併到左兄弟(target)

        # 确定合并方向和参与合并的节点
        targetNode = parentNode.children[i]  # 默认当前节点为目标节点
        sourceNode = parentNode.children[j]  # 来源节点
        sourceIndex = j
        targetIndex = i

        if j < i:  # 如果左兄弟是来源
            targetNode, sourceNode = sourceNode, targetNode  # 交换，确保targetNode是合并后保留的节点
            sourceIndex, targetIndex = targetIndex, sourceIndex 
        
        # source 併入 target
        targetNode.keys.append(parentNode.keys[targetIndex])  # 将parent的key下移到target

        # 将source的key和child移動到target，會剩最後一個child, 因為child比key多一個
        for k in range(len(sourceNode.keys)):
            targetNode.keys.append(sourceNode.keys[k])
            if sourceNode.children: # 如果有children, 不是leaf
                targetNode.children.append(sourceNode.children[k])
        
        # 最後一個用pop, 
        if sourceNode.children:
            targetNode.children.append(sourceNode.children.pop())
        
        # 刪除parent的key, 因為下移到target了
        parentNode.keys.pop(targetIndex)

        # 刪除parent的source child, 因為source已經併入target
        parentNode.children.pop(sourceIndex)

        # 如果parent是root, 且root已經沒有key了, 代表高度整個降低一格
        # 這時候要把target變成root
        if parentNode == self.root and not parentNode.keys:
            self.root = targetNode
    
    # Delete the sibling, 從parent這邊刪除才可以
    # 從幫助者拉一個上到 parent, parent 的key 下去被幫助者
    # 這個function只是調整位置，沒有刪除東西
    def rotateSibling(self, parentNode: BTreeNode, idxNodeNeedHelp: int, idxNodeForHelp: int) -> None:
        nodeNeedHelp = parentNode.children[idxNodeNeedHelp] # 需要被幫忙的Node

        if idxNodeNeedHelp < idxNodeForHelp: # 被幫忙的是左兄弟, 幫助者是右兄弟
            # 逆時鐘旋轉
            rightNode = parentNode.children[idxNodeForHelp]
            nodeNeedHelp.keys.append(parentNode.keys[idxNodeNeedHelp])

            # 幫助者提一個上去
            parentNode.keys[idxNodeNeedHelp] = rightNode.keys.pop(0)

            # 如果有children (也就是不是leaf) 也要逆時鐘旋轉
            # 但是其實不需要上提到parent, 直接貼到另一邊
            if rightNode.children:
                nodeNeedHelp.children.append(rightNode.children.pop(0))
        else: # 被幫忙的是左兄弟, 幫助者是右兄弟
            # 順時針旋轉
            leftNode = parentNode.children[idxNodeForHelp]
            # 注意idx是前一個, 因為是在parent 的右邊
            nodeNeedHelp.keys.insert(0, parentNode.keys[idxNodeNeedHelp - 1])

            # 幫助者提一個上去
            parentNode.keys[idxNodeNeedHelp] = leftNode.keys.pop()

            if leftNode.children:
                nodeNeedHelp.children.insert(0, leftNode.children.pop())

    # 印出整棵樹，和資料結構無關
    def prettyPrint(self, node: BTreeNode | None = None, level: int = 0):
        if node is None:
            node = self.root
        
        # 顯示節點層
        print('Level', level, '->', end=" ")
        
        # 顯示該層的所有鍵
        for key in node.keys:
            print(key, end=" ")
        
        print()  # 換行到下一層
        
        # 遞迴顯示每個子節點
        level += 1
        for child in node.children:
            self.prettyPrint(child, level)

if __name__ == '__main__':
    # 初始化 BTree，最小度數 t 為 3
    btree = BTree(3)


    # 插入一些鍵值對，使用 tuple 存儲 (key, value)
    keyValuePairs = [(10, 'a'), (20, 'b'), (5, 'c'), (6, 'd'), (12, 'e'),
                     (30, 'f'), (7, 'g'), (17, 'h')]

    # for i in range(26):
    #     char = chr(i + ord('a'))
    #     btree.insert((i, char))
    # 插入操作
    print("Inserting keys...")
    for key, value in keyValuePairs:
        btree.insert((key, value))
        print(f"Inserted ({key}, {value})")
    
    # 漂亮列印整棵樹，確認結構
    print("\nTree structure after insertions:")
    btree.prettyPrint()

    # 搜索一些鍵
    searchKeys = [6, 15, 30]
    print("\nSearching for keys...")
    for key in searchKeys:
        node, idx = btree.searchKey(key)
        if node:
            print(f"Found key {key} at index {idx} in node with keys {node.keys}")
        else:
            print(f"Key {key} not found.")

    # 刪除操作
    deleteKeys = [6, 20]
    print("\nDeleting keys...")
    for key in deleteKeys:
        result = btree.delete(btree.root, (key, ''))
        if result:
            print(f"Deleted key {key}")
        else:
            print(f"Failed to delete key {key}")

    # 最後再次漂亮列印整棵樹，檢查結構變化
    print("\nTree structure after deletions:")
    btree.prettyPrint()

```

## bTree.test.py

和 `bTree.py`放同一個資料夾然後:

```shell
python bTree.test.py
```

```python
# test_btree.py
import unittest
from bTree import BTree

class TestBTree(unittest.TestCase):

    def setUp(self):
        """Initialize a BTree with minimum degree t=3 before each test method."""
        self.btree = BTree(3)
        self.keys = [(10, 'a'), (20, 'b'), (5, 'c'), (6, 'd'), (12, 'e'),
                     (30, 'f'), (7, 'g'), (17, 'h')]

        for key, value in self.keys:
            self.btree.insert((key, value))

    def test_search_key(self):
        """Test searching for keys."""
        known_keys = [6, 30, 10]
        unknown_keys = [100, -1]

        for key in known_keys:
            with self.subTest(key=key):
                node, idx = self.btree.searchKey(key)
                self.assertIsNotNone(node, f"Should find key {key} in the tree.")
                self.assertEqual(node.keys[idx][0], key, f"Key found should be {key}.")

        for key in unknown_keys:
            with self.subTest(key=key):
                node, idx = self.btree.searchKey(key)
                self.assertIsNone(node, f"Should not find key {key} in the tree.")

    def test_insert_and_structure(self):
        """Test tree structure after insertions."""
        self.assertEqual(len(self.btree.root.keys), 1, "Root should have exactly one key after initial insertions.")
        self.assertEqual(self.btree.root.keys[0][0], 10, "Root key should be 10 after initial insertions.")

    def test_delete_key(self):
        """Test deleting keys."""
        self.btree.delete(self.btree.root, (6, ''))
        node, idx = self.btree.searchKey(6)
        self.assertIsNone(node, "Key 6 should be deleted.")

        self.btree.delete(self.btree.root, (20, ''))
        node, idx = self.btree.searchKey(20)
        self.assertIsNone(node, "Key 20 should be deleted.")

    def tearDown(self):
        """Clean up after each test method."""
        self.btree = None

if __name__ == '__main__':
    unittest.main()

```
