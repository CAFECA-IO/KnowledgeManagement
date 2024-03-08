### 1. Introduction to graphs

### 介紹圖 (Graph)

圖(Graph)是一種非線性的數據結構，用於表示物件間的關係。Linked list 跟 trees 是 graphs 的子集，分別符合 graphs 的規定，但又有各自的限制。

它由`節點（vertex / vertices）`和`連接節點的邊 (edge / edges)`組成。圖可以是有向的（邊有方向）或無向的（邊沒有方向）。

- 下圖的 B 跟 C 是雙向的，也可以說是無向 (undirected) 的

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/4ec26e81-a11a-4e95-a457-3e588e0c062b)


### 介紹矩陣 (Matrix)

在圖的表示方法中，矩陣是一個非常基本且重要的概念。矩陣是一個二維陣列，用於表示節點間的關係。對於一個有 n 個節點的圖，我們可以使用一個 `n x n` 的矩陣來表示它。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/f21dafbf-c92e-40b4-9437-27f73e617222)



### 介紹鄰接矩陣 (Adjacency Matrix)

鄰接矩陣是表示圖中節點間相連關係的一種矩陣。對於無向圖來說，如果節點 i 與節點 j 相連，則鄰接矩陣中的元素 A[i][j] 和 A[j][i] 被設為 1；否則設為 0。對於有向圖，如果從節點 i 到節點 j 有邊，則 A[i][j] 為 1，否則為 0。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/7511680f-7956-4930-ad95-9cfe9d08a452)


### 介紹鄰接列表 (Adjacency List)

鄰接列表是一種比鄰接矩陣更為節省空間的圖表示方法，特別是對於稀疏圖來說。它使用一個陣列來存儲所有節點的鄰接節點。對於圖中的每一個節點，都有一個列表來存儲與其相連的所有節點。實際程式碼下面有介紹。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/0bb3179b-7be7-4561-9559-767588cc3248)


### **2. Matrix DFS (深度優先搜索)**

深度優先搜索是一種用於遍歷圖的演算法，它從起始節點開始，儘可能深入地探索每個分支，直到達到最深處再回溯。

```tsx
// Count paths (backtracking)
function dfs(grid, r, c, visit) {
    let ROWS = grid.length, COLS = grid[0].length;

    if (Math.min(r, c) < 0 || r == ROWS || c == COLS ||
        visit[r][c] == 1 || grid[r][c] == 1) { // visit 代表已經走過的，grid[r][c] == 1)代表值是 1 ，這個是不能走的
        return 0;
    }
    if (r == ROWS - 1 && c == COLS - 1) {
        return 1;
    }
    visit[r][c] = 1;

    let count = 0;
    count += dfs(grid, r + 1, c, visit); // move down
    count += dfs(grid, r - 1, c, visit); // move up
    count += dfs(grid, r, c + 1, visit); // move right
    count += dfs(grid, r, c - 1, visit); // move left

    visit[r][c] = 0; // backtracking
    return count;
}

```

### **3. Matrix BFS (廣度優先搜索)**

廣度優先搜索是另一種用於遍歷圖的演算法，它從起始節點開始，逐層訪問 (go layer by layer) 與起始節點距離相同的所有節點。

```tsx
// Matrix (2D Grid)
let grid = [[0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 1],
            [0, 1, 0, 0]];

// Shortest path from top left to bottom right
function bfs(grid) {
    let ROWS = grid.length;
    let COLS = grid[0].length;
    let visit = new Array(4).fill(0).map(() => Array(4).fill(0)); // 4x4 2d array
    let queue = new Array();

    queue.push(new Array(2).fill(0)); // Add {0, 0}
    visit[0][0] = 1;

    let length = 0;
    while (queue.length > 0) {
        let queueLength = queue.length;
        for (let i = 0; i < queueLength; i++) {
            let pair = queue.shift();
            let r = pair[0], c = pair[1];

            if (r == ROWS - 1 && c == COLS - 1) {
                return length; // when we reach the result (the destination)
            }    
            // We can directly build the four neighbors
            let neighbors = [[r, c + 1], [r, c - 1], [r + 1, c], [r - 1, c]];
            for (let j = 0; j < 4; j++) {
                let newR = neighbors[j][0], newC = neighbors[j][1];
                if (Math.min(newR, newC) < 0 || newR == ROWS || newC == COLS
                || visit[newR][newC] == 1 || grid[newR][newC] == 1) {
                    continue;
                }
                queue.push(neighbors[j]); // 如果能執行到這行，代表這個 node 是 valid 的，將此 node 新增到 queue 裡面
                visit[newR][newC] = 1; // 並且加到已經遍歷過的 hash set 裡面
            }
        }
        length++; // 路徑的長度+1
    }
    return length; // This should never be called
}

```

### **4. Adjacency List (鄰接列表的原理與應用)**

鄰接表是一種常見的圖表示方法，用於表示圖中每個頂點相鄰的邊集合。這種表示方法通常使用無序集合來描述。
鄰接表包含兩個主要元素：

- **節點列表**：存儲圖中的每個節點，通常以數字或字母標識。
- **相鄰節點列表**：對於每個節點，記錄與之相鄰的其他節點。

```tsx
// GraphNode used for adjacency list
class GraphNode {
    constructor(val) {
        this.val = val;
        this.neighbors = new Array();
    }
} 

// Or use a HashMap
let adjList = new Map();

// Given directed edges, build an adjacency list
let edges = [["A", "B"], ["B", "C"], ["B", "E"], ["C", "E"], ["E", "D"]];
adjList.set("A", new Array());
adjList.set("B", new Array());

for (let edge of edges) {
    let src = edge[0], dst = edge[1];
    // If the current source does not exist, add it to the hashmap
    if (!adjList.has(src)) {
        adjList.set(src, new Array());    
    }
    // If the current destination does not exist, add it to the hashmap
    if (!adjList.has(dst)) {
        adjList.set(dst, new Array());    
    }
    // Retrieve the key (source) and add the destination to its list of neighbors
    adjList.get(src).push(dst);    
}
return adjList;

```

### **DFS on an adjacency list**

- 在鄰接列表上執行深度優先搜索

在這個深度優先搜索（DFS）的例子中，我們使用一個鄰接列表來表示 graph。我們的目標是**找到從起始節點到目標節點的所有路徑**。我們使用一個集合來記錄已經訪問過的節點，以防止在搜索過程中重複訪問。如果我們達到目標節點，我們就返回1，表示找到一條路徑。否則，我們對當前節點的所有鄰居進行DFS，並將找到的路徑數加到計數器上。最後，我們從訪問集合中刪除當前節點，以便於後續的搜索。

```tsx
// Count paths (backtracking)
function dfs(node, target, adjList, visit) {
    if (visit.has(node)) {
        return 0;
    }
    if (node == target) {
        return 1;
    }
    let count = 0;
    visit = new Set();
    visit.add(node);
    for (let neighbor of adjList.get(node)) {
        count+=dfs(neighbor, target, adjList, visit); 
    }
    visit.delete(node);
    return count;
}

```

### **BFS on an adjacency list**

- 在鄰接列表上執行廣度優先搜索

在這個廣度優先搜索（BFS）的例子中，我們也使用一個鄰接列表來表示 graph。我們的目標是找到從起始節點到目標節點的**最短路徑**。我們使用一個集合來記錄已經訪問過的節點，以防止在搜索過程中重複訪問。我們使用一個隊列來存儲待訪問的節點，並從起始節點開始搜索。每次從隊列中取出一個節點，如果該節點是目標節點，則返回當前的路徑長度。否則，我們將該節點的所有未訪問過的鄰居加入隊列。每訪問完一層的節點，路徑長度就增加1。

```tsx
// Shortest path from node to target.
function bfs(node, target, adjList) {
    let length = 0;
    let visit = new Set();
    let q = [];
    visit.add(node);
    q.push(node);

    while (q.length != 0) {
        let queueLength = q.length;

        for (let i = 0; i < queueLength; i++) {
            let curr = q.shift();
            if (curr === target) {
                return length;
            }
            for (let neighbor of adjList.get(curr)) {
                if (!visit.has(neighbor)) {
                    visit.add(neighbor);
                    q.push(neighbor);
                }
            }
        }
        length++;
    }
    return length;
}

```

### Ref
- [Algorithms and Data Structures for Beginners](https://neetcode.io/courses/dsa-for-beginners/28)

