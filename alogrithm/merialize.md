# Overview
## Principle
![](https://i.imgur.com/kngYziw.png)

圖片來源 [BitcoinWiki](https://en.bitcoinwiki.org/wiki/Main_Page)

Merkle Tree 雜湊樹本身是一個樹狀的資料結構，且 Merkle Tree 是一個二元樹。其驗證資料存放方式是由最底層的子節點開始將文件進行 Hash 計算，然後由節點存放算出的 Hash 值，若這層的節點並非完整的偶數個節點，則會把最後的節點再複製一份以確保節點個數是偶數個。除此之外，因為 Merkle Tree 為二元樹狀結構，上層節點會是下層節點數的一半，每個節點會將下層的兩個子節點存放的 Hash 值一起做 Hash 計算後存放在節點，並依序由下層往上做，直到最後剩下第一層的 root 節點存放算出的 Hash 值，也就是總和整棵樹的節點算出的 Hash 值。
### 驗證方式
在 Merkle Tree 的驗證資料中，每個節點都會以其子節點的數值做 Hash 值，所以當有人篡改了其中一個節點的數值，就會連帶影響到上層所算出的 Hash 值。故我們可以使用此方式進行驗證，以確保最後所得的資料並沒有被竄改。
### 應用場域
Merkle Tree 被應用在 Bitcoin 、區塊鏈領域、分佈式存儲資料庫(例子： AWS Dynamo DB)，被用來快速驗證資料節點是否存在。

## Definition
### Merkle Tree builder
### Prover
### Verifier

