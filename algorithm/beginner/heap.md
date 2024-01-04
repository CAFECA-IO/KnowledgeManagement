# Overview

堆積（Heap）是一種特殊的基於樹的資料結構，屬於 [complete binary tree](https://courses.cs.vt.edu/~cs3114/Fall09/wmcquain/Notes/T03a.BinaryTreeTheorems.pdf)。它實現了一種稱為優先隊列（Priority Queue）的抽象數據類型。通常，“ 堆積（heap） ”和“ 優先隊列（priority queue） ”這兩個術語可以互換使用。

我們知道，普通隊列 (queue) 是按照先進先出的原則運作的，但在 priority queue 中，元素的移除是基於給定的優先級。優先級最高的元素會首先被移除。

heap 主要有兩種類型：最小堆（Min Heap）和最大堆（Max Heap）。在 Min Heap 中，根節點 (root) 具有最小的值，並且在刪除時，值最小的元素具有最高的優先級。相反，在 Max Heap 中，根節點 (root) 具有最大的值，刪除時，值最大的元素具有最高的優先級。

本文將重點介紹 Min Heap 的實現，但 Max Heap 的實現方式與之完全相同，只是在實現時更注重最大值而非最小值。

# Heap properties

要使 binary tree 成為 heap ，它必須滿足以下兩個性質：

1. 結構性質 (structure property)：一個 binary heap 是一棵 complete binary tree，這意味著除了最底層外，其他每一層都是完全填滿的，最底層的節點則從左至右連續填充。
2. 順序性質 (order property)：對於 Min Heap 而言，所有後代節點的值都應大於它們的祖先節點。換句話說，對於以 y 為根的樹，其右子樹和左子樹中的每個節點都應大於或等於 y。這是一個遞歸的性質，與 binary search tree (BST) 類似。在 Max Heap 中，情況則相反。

# Heap implementation

在概念上， binary heap 是以樹的資料結構來表示的，但實際上，它們是使用 array 來實現的。例如，給定一個 binary heap ：`[14,19,16,21,26,19,68,65,30,null,...]`，我們會將它轉化為一個 array 。這個 array 的大小是節點數量 n 加 1，從索引 1 開始填充，這樣便於後續計算節點的左右子節點和父節點的位置。

對於給定節點 i，它的左子節點和右子節點以及父節點的索引可以通過以下公式計算得出：

- 左子節點 (left child): `2*i`
- 右子節點 (right child): `2*i + 1`
- 父節點 (parent): `i / 2`

![Data structure   Algorithm - heap](https://github.com/CAFECA-IO/ASICEX/assets/20677913/f41bd479-9ed8-45ac-8c82-d3ae2c2df414)


在對 heap 進行添加或刪除操作時，必須確保維持 heap 的性質，並且上述公式依然有效。

```jsx
class Heap {
  constructor() {
    this.heap = new Array();
    this.heap.push(0);
  }
}
```

# Push and Pop in Heap

## Percolating up

透過將新增的元素與其父元素進行比較並將新增的元素向上移動一個層級（與父元素交換位置）來修復 heap 疊屬性。這個過程稱為「向上滲透」。重複比較，直到父元素大於或等於滲透元素。

## Percolating down

從最後一個不是葉節點的節點開始，將其與其左右子節點進行比較。將節點與其兩個子節點中較大的節點互換。對節點繼續此過程，直到它成為葉節點或直到 heap 屬性恢復。這稱為向下滲透。

## Push

在對 heap 進行操作時，Push 操作是將一個新元素添加到 heap 中，而 Pop 操作則是從 heap 中移除元素。這兩種操作都需要維持 heap 的結構和順序性質。

- Push 操作：將新元素添加到 array 的末尾，然後“上浮” (percolate up) 至正確位置，以保持 heap 的性質。

```jsx
push(val) {
    this.heap.push(val); // add new value to the end of the heap
    let i = this.heap.length - 1; // get the new index

    // Percolate up
    while (i > 1 && this.heap[i] < this.heap[Math.floor(i / 2)]) {
        let tmp = this.heap[i];
        this.heap[i] = this.heap[Math.floor(i / 2)];
        this.heap[Math.floor(i / 2)] = tmp;
        i = Math.floor(i / 2);
    }
}

```

## Pop

- Pop 操作：通常從 heap 中移除根節點（對於 Min Heap 來說是最小元素），然後將最後一個節點移至根位置，並“下沉” (percolate down) 至正確位置。

```jsx
pop() {
    if (this.heap.length == 1) {
        // Normally we would throw an exception if the heap is empty.
        return -1;
    }
    if (this.heap.length == 2) {
        return this.heap.pop(); // if there're only two elements, return the other one directly
    }

    let res = this.heap[1]; // reserve the root

    this.heap[1] = this.heap.pop(); // Move the last value to root
    let i = 1;
    // Percolate down
    while(2 * i < this.heap.length) {
        if (2*i + 1 < heap.length &&
        this.heap[2 * i + 1] < this.heap[2 * i] &&
        this.heap[i] > this.heap[2 * i + 1]) {
            // Swap right child
            let tmp = this.heap[i];
            this.heap[i]= this.heap[2 * i + 1];
            this.heap[2 * i + 1] = tmp;
            i = 2 * i + 1;
        } else if (this.heap[i] > this.heap[2 * i]) {
            // Swap left child
            let tmp = this.heap[i];
            this.heap[i] = this.heap[2 * i];
            this.heap[2 * i] = tmp;
            i = 2 * i;
        } else {
            break;
        }
    }
    return res;
}

```

# Heapify (to build heap)

Heapify 是建立 heap 的一種有效方式。它的概念是確保 binary heap 既是一棵 complete binary tree，也滿足每個節點的值最多與其父節點的值相等。由於葉節點不能違反 Min Heap 的性質，因此不需要對它們進行 Heapify。

Heapify 從第一個非葉子節點開始，向下“沉降” (percolate down) ，直到達到根節點。

```jsx
heapify(arr) {
    // 0-th position is moved to the end
    arr.push(arr[0]);

    this.heap = arr;
    let cur = Math.floor((this.heap.length- 1) / 2);
    while (cur > 0) {
        // Percolate Down
        let i = cur;
        while (2 * i < this.heap.length) {
            if (2 * i + 1 < this.heap.length &&
            this.heap[2 * i + 1] < this.heap[2 * i] &&
            this.heap[i] > this.heap[2 * i + 1]) {
                // Swap right child
                let tmp = this.heap[i];
                this.heap[i] = this.heap[2 * i + 1];
                this.heap[2 * i + 1] = tmp;
                i = 2 * i + 1;
            } else if (this.heap[i] > this.heap[2 * i]) {
                // Swap left child
                let tmp = this.heap[i];
                this.heap[i] = this.heap[2 * i];
                this.heap[2 * i]  = tmp;
                i = 2 * i;
            } else {
                break;
            }
        }
        cur--;
    }
    return;
}

```

# Time complexity

| Operation   | Big-O Time |
| ----------- | ---------- |
| Get Min/Max | O(1)       |
| Push        | O(log n)   |
| Pop         | O(log n)   |

Push & Pop: 在最壞的情況下，我們需要在樹的每一層進行一次交換。因此交換的總數將等於 heap 的高度。具有節點數的平衡完全樹的高度為 。每次交換都需要時間 O(1)。

# Takeaway

## **Heap 的工作原理**：
   - **結構設計**：Heap 是一種完全二元樹（Complete Binary Tree），這意味著除了最後一層，每一層都被完全填滿，且最後一層的節點從左至右填充。
   - **資料存儲**：Heap 通常用 array 來實現，其中元素的位置關係透過特定的索引規則來維護（例如，對於任意位置 i 的元素，其左子節點位於 2*i，右子節點位於 2*i + 1）。
   - **元素排序**：在 Min Heap 中，每個父節點的值都小於或等於其子節點的值；在 Max Heap 中則相反。這確保了根節點始終是整個堆中的最小值（Min Heap）或最大值（Max Heap）。
## **Heap 解決的問題**：
   - **高效存取**：Heap 提供了一種高效的方式來存取、新增和移除資料集中的最小或最大元素。這在多種演算法和應用中是非常重要的。
   - **優先隊列實現**：Heap 是實現優先隊列（Priority Queue）的理想結構。在優先隊列中，元素的添加和移除是根據優先級來進行的，而非它們被加入的順序。
   - **資料動態排序**：由於其結構和操作方式，Heap 允許在資料集動態變化時持續維持排序狀態，這對於需要經常更新並存取最小或最大元素的應用來說非常有用。
   - **演算法應用**：Heap 在很多演算法中都有應用，如 Heapsort（堆積排序）、計算最小生成樹（如 Prim's algorithm）、以及在圖的最短路徑問題（如 Dijkstra's algorithm）中找到最小邊。

# Reference

- [Heap](https://neetcode.io/courses/dsa-for-beginners/25)
- [Big-O time of complete or full binary tree from Virginia Tech](https://courses.cs.vt.edu/~cs3114/Fall09/wmcquain/Notes/T03a.BinaryTreeTheorems.pdf)
