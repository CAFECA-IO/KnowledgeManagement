Principle of Keccak

# Overview
## Keccak 簡介
Keccak 是一種 Hash 函式，而所謂的 Hash 函式具有單向特性，也就是輸入值經由 Hash 函式產生出來的輸出有不可回推的特性。據分類來說，Keccak 為 Hash 函式中的密碼雜湊函式（Cryptographic Hash Function)，這種類型的函式所得出的輸出值不會有衝突 (collision) 的情況，因此區塊鏈中，都是使用密碼雜湊函式來進行 Hash 相關的運算。

在密碼雜湊函式中，有幾個常見的系列：MD5、SHA 系列，而此處提到的 Keccak 屬於 SHA-3(第三代）的系列之一。之所以採取 Keccak 是因為 Keccak 採用了海綿函式，相較上一代的 SHA-2 更為快速，除此之外，Keccak 也已經可以抵禦最小複雜度為 2n 的攻擊，相對來說是較為安全的密碼雜湊函式。

### Keccak 支援 SHA-3 的種類
- n = 224: Keccak [ r = 1152 ,c = 448 ]
- **n = 256: Keccak [ r = 1088 ,c = 512 ]** (在此使用的是 Keccak 256, 256 的意思是 output 長度為 256 bits)
- n = 384: Keccak [ r = 832 ,c = 768 ]
- n = 512: Keccak [ r = 576 ,c = 1024 ]

**備註：**

n 為 output length ， r 為 bitrate（中間處理 message 的長度）， c 為 capacity （與 security 相關）
 
# Definition
Keccak 是一種海綿函式，而之所以稱為海棉函式，是因為運作模式包含 Absorbing 吸入 input message bits， Squeezing 擠出 output 作為最後的 Hash value
![](https://i.imgur.com/wjy8EJC.png)

由上圖可知，過程中我們會經歷三個階段： 

(Notes: 以下用到的 n 為 output length ， r 為 bitrate（中間處理 message 的長度）, c 為 capacity（與 security 相關))

1. Padding Message 階段：  
   * 將 Message pad 成 100...01 的格式，並且將 Message 分割成一個一個 r bit 的 P block

2. Absorbing 階段：
   * 產生一個 r + c = 1600 bits 的 State ， 而 State 的格式為 0000..000 (全部為 0, 共 1600 bits)
   * 將所有 P block pad 0 到滿足 r + c = 1600 bits
   * 針對每個 P block 和 State 做 XOR 運算
   * 將 State 放入 function f 中進行運算

3. Squeezing 階段：
   * Output 產生前 r bits 的 State 作為 Z0
   * 如果 Z0 的長度 > output length n -> 將 Output 出的 State 的前 n bits 的字串作為 Hash value
   * 反之，如果 Z0 的長度 < output length n -> 將 State 重新放入 function f 做計算，再產生一個 State 作為 Z1
     * 若此時產生的 State length >= n bits 就將 Output 出的 State 的前 n bits 的字串作為 Hash value
     * 若無則再將 State 放入 function f 中 ， 直到產生 n bits 以上的 State 為止

若轉換成 pseudo code 則為如下：

![](https://i.imgur.com/Z6NLCAC.png)

中間會進行的 F function 如下：

function f 為 nr rounds of R 的 置換 function (permutation function) :

設 State = s[w(5y + x) + z] = a[x][y][z] ， 也就是 s[w(5y + x)] 會映射到 a[x][y][z] ， 而 x = 0,1,...,4 ; y = 0,1,...,4 ; z = 0,...,2^l - 1, z length = w

依據上述定義 x 有 5 bits 的空間 ， y 有 5 bits 的空間 ， 為了符合最終應是 1600 bits 的 state ， 1600 = 5 * 5 * w ， 可算出 w = 64 ， 又因 w = 2^l ， 所以可以得出 l = 6 ， 而 nr (number of rounds) = 12 + 2l = 24

因此可以得出 function f 為 24 rounds 的 R function

以下為 R function 的內容，包含下面所述的 5 個算式
![](https://i.imgur.com/bJqgVtf.png)

# Structure
![](https://i.imgur.com/GGQTXdg.png)

一個 Keccak 函式需要 input r ， c ， padding function ， f function (以下稱為 Transforms function)

## Transforms Function
Definition 中的 f 為此處的 Transform function ， 內部會進行 nr rounds 的 R function ， 而 R function 內部會分為 5 個 function： θ , ρ , π , χ , ι

備註：

以下的 rot(W,r) function 是按位循環移位的操作，將位置 i 處的位移動到位置 i+r


**f function:**
```
Keccak-f[b](A) {
  for i in 0…nr-1
    A = Round[b](A, RC[i])
  return A
}
// r function
Round[b](A,RC) {
  # θ step
  C[x] = A[x,0] xor A[x,1] xor A[x,2] xor A[x,3] xor A[x,4],   for x in 0…4
  D[x] = C[x-1] xor rot(C[x+1],1),                             for x in 0…4
  A[x,y] = A[x,y] xor D[x],                           for (x,y) in (0…4,0…4)

  # ρ and π steps
  B[y,2*x+3*y] = rot(A[x,y], r[x,y]),                 for (x,y) in (0…4,0…4)

  # χ step
  A[x,y] = B[x,y] xor ((not B[x+1,y]) and B[x+2,y]),  for (x,y) in (0…4,0…4)

  # ι step
  A[0,0] = A[0,0] xor RC

  return A
}
```

**個別的 pseudocode - 官方 reference**

θ:

![](https://i.imgur.com/TbGQVvW.png)

ρ:

![](https://i.imgur.com/Z1osp0K.png)

π:

![](https://i.imgur.com/oXkEp2p.png)

χ:

![](https://i.imgur.com/U8P0U3L.png)

ι:
```
A[0,0] xor RC 
```

上述的 RC 為 round constants ， 如下所示：
```
uint64_t RC[24] = {
    0x0000000000000001, 0x0000000000008082,
    0x800000000000808A, 0x8000000080008000,
    0x000000000000808B, 0x0000000080000001,
    0x8000000080008081, 0x8000000000008009,
    0x000000000000008A, 0x0000000000000088,
    0x0000000080008009, 0x000000008000000A,
    0x000000008000808B, 0x800000000000008B,
    0x8000000000008089, 0x8000000000008003,
    0x8000000000008002, 0x8000000000000080,
    0x000000000000800A, 0x800000008000000A,
    0x8000000080008081, 0x8000000000008080,
    0x0000000080000001, 0x8000000080008008,
};
```
上述的 r[x,y] 則是 the rotation offsets，可以被當成一組 table 數字
![](https://i.imgur.com/RSNvrVu.png)

可以 define 成一個二維陣列

## Padding Function
處理的字串有分為 2 種： delimited suffix = D , padding message = P 
而 Ｍ 為 Message

備註：

下面的描述假設輸入 M 表示為一串字節 Mbytes，後跟一個數字（可能為零，最多 7 個）尾隨位 Mbits。標準實例通常會添加一些尾隨位以進行域分離。當由字節組成時，這些函數的輸入變為 Mbytes，而 Mbits 僅由使用的實例確定，請參見下表。

![](https://i.imgur.com/Lg7TevQ.png)

我們採用 Keccak 256 的話 ， M bits 就會為 01

```
function Padding(Mbytes || Mbits) {
  d = 2^|Mbits| + sum for i=0..|Mbits|-1 of 2^i*Mbits[i]
  P = Mbytes || d || 0x00 || … || 0x00
  P = P xor (0x00 || … || 0x00 || 0x80)
}
```

# Process
## Call padding function
```
Padding(Mbytes || Mbits);
```

## Initialize state
```
S[x,y] = 0,                               for (x,y) in (0…4,0…4)
```

## Absorbs
```
for each block Pi in P
  // 針對 s[x, y] 和 Pi[x+5y] 進行 xor
  S[x,y] = S[x,y] xor Pi[x+5*y],          for (x,y) such that x+5*y < r/w
  // call f function
  S = Keccak-f[r+c](S)
```

## Squeezed Out
```
  Z = empty string
  while output is requested
    Z = Z || S[x,y],                        for (x,y) such that x+5*y < r/w
    // call f function
    S = Keccak-f[r+c](S)
  // if Z length >= nbits , return Z
  return Z
```

# Reference

keccak 官方文件 3.0 版本： https://keccak.team/files/Keccak-reference-3.0.pdf

keccak summary 文件： https://keccak.team/keccak_specs_summary.html
