# 1. 前言
Shamir's secret sharing (SSS) 於 1979年由[Adi Shamir](https://web.mit.edu/6.857/OldStuff/Fall03/ref/Shamir-HowToShareASecret.pdf)提出，這個演算法可以使用分散的形式保護金鑰，演算法將金鑰分成n把，並設定m為threshold(閥值)，當有m把以上的拆分金鑰時，可以還原成未拆分錢的金鑰。

主要用途有：
1. 從 passphrase(密碼短語)中還原成master secret, 主要用在加密錢包
2. 用來分享用來解碼 Password Manager 的 rook key的金鑰
3. 恢復用於encrypted email access(加密電子郵件訪問)的用戶金鑰

# 2.參考資料
- [Shamir's Secret Sharing: Explanation and Visualization](https://evervault.com/blog/shamir-secret-sharing)
- [What is Shamir’s Secret Sharing?](https://www.ledger.com/academy/topics/security/shamirs-secret-sharing)
- [Shamir’s Secret Sharing Algorithm | Cryptography](https://www.geeksforgeeks.org/shamirs-secret-sharing-algorithm-cryptography/)
- [原始論文：How to Share a Secret](https://web.mit.edu/6.857/OldStuff/Fall03/ref/Shamir-HowToShareASecret.pdf)
- [Wiki Shamir's secret sharing](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing)
- [finite field](https://web.ntnu.edu.tw/~algo/FiniteField.html)
- [Primitive Polynomial List](https://www.partow.net/programming/polynomials/index.html#deg02)
- [3-3 公開鑰匙的同餘算術](https://www.tsnien.idv.tw/Security_WebBook/chap3/3-3%20%E5%85%AC%E9%96%8B%E9%91%B0%E5%8C%99%E7%9A%84%E5%90%8C%E9%A4%98%E7%AE%97%E8%A1%93.html)

# 3. 什麼是Shamir’s Secret Sharing
> 以下介紹與圖片來自於[Shamir's Secret Sharing: Explanation and Visualization](https://evervault.com/blog/shamir-secret-sharing) , Author:  [David Nugent](https://evervault.com/blog/shamir-secret-sharing#)

如前言所述，Shamir’s Secret Sharing 主要的功能是把一把金鑰拆成n把小金鑰，並且需要k把金鑰才能還原。

他的底層邏輯其實就是多項式的原理，當我們在平面上有k個 (x, y)的點，我們就可以畫出最高次方向為 k-1 的多項式。舉例來說果我們有三個點 (0,0), (1,1), (2,4) 就可以畫出 $f(x)=x^2$ 

在Shamir’s Secret Sharing 中，原始的金鑰會被放在用來生成小金鑰的多項式的常數項。接著生成 n 個 隨機的點，並帶入 $f(x)$ 並產生 $(x_0, f(x_0))$ , $(x_1, f(x_1))$ ...  $(x_{n-1}, f(x_{n-1}))$ 個點, 這些點就會變成一串小金鑰, 在這邊每把小金鑰是 (x, y)的pair  

$$f(x) = a_0 + a_1 x + a_2 x^2 + a_3 x^3 + \cdots + a_{k-1} x^{k-1}$$

而上面這個多項式是怎麼生成呢？首先 $a_0$ 放的是我們要加密的 $secret$ ，接著我們需要先挑選一個質數 $prime$ (為什麼需要質數會於後面的部份介紹)， $a_1$ ~ $a_{k_1}$ 從 1 ~ $prime-1$ 中隨機選取

以下做一個舉例，假設我們設定使用 1613 當作質數 $prime$ , 而 $secret$ 是 1234, 做一個需要 3 把金鑰才能解開的多項式。 首先我們先從 1~1613 中隨機抽選兩個數字，這裡抽 166 與 1234, 並把 $secret$ 放在常數向，得到：

$$f(x) = 1234 + 166x + 94x^{2}$$

> (影片來源：[Shamir's Secret Sharing: Explanation and Visualization](https://evervault.com/blog/shamir-secret-sharing) , Author:
>  [David Nugent](https://evervault.com/blog/shamir-secret-sharing#))
<video src="https://cdn.sanity.io/files/r000fwn3/production/81a22e3b93e473ade79891d42b3a0cde3b63a0a0.mp4" autoplay="" muted="" controls="" loop="" playsinline=""></video>

接著我們可以在這個數線上面取得無限多個點產生無限把小金鑰，但最少要產生3把小金鑰才可以還原原本的多項式。這裡我們就取三個點 $x=2$ 、 $x=4$  、  $x=5$  得到以下的三個小金鑰 (這裡按照[wiki](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing#Preparation) 取點, 非影片上表示)

$$D_0=(2,1942);D_1=(4,3402);D_2=(5,4414)$$

> (影片來源：[Shamir's Secret Sharing: Explanation and Visualization](https://evervault.com/blog/shamir-secret-sharing) , Author:
>  [David Nugent](https://evervault.com/blog/shamir-secret-sharing#))

<video src="https://cdn.sanity.io/files/r000fwn3/production/f468dff959c31c05dc961d569b41c0ee1ea83d1a.mp4" autoplay="" muted="" controls="" loop="" playsinline=""></video>

有了三把小金鑰之後我們嘗試還原原本的多項式之後，把0帶入會還原出 $secret$ 。這裡使用[拉格朗日插值法](https://en.wikipedia.org/wiki/Lagrange_polynomial), 需要注意下面的公式是變體版本，幫助我們更快算出 $f(0)$ :

$$f(0)=\sum_{j=0}^{k-1}y_{j}\prod_{\begin{smallmatrix}m\,=\,0\\m\,\neq\,j\end{smallmatrix}}^{k-1}{\frac {x_{m}}{x_{m}-x_{j}}}$$

首先我們先計算function 右邊的部份：

$$\ell_{j}(x) = \prod_{\begin{smallmatrix}m\,=\,0\\m\,\neq \,j\end{smallmatrix}}^{k-1}{\frac{x_{m}}{x_{m}-x_{j}}}$$

$D_0$ :

$$\ell_{0}(x)={\frac {x_{1}}{x_{1}-x_{0}}}\cdot{\frac {x_{2}}{x_{2}-x_{0}}}={\frac{4}{4-2}}\cdot{\frac{5}{5-2}}={\frac{10}{3}}$$

$D_1$ :
$$\ell_{1}(x)={\frac{x_{0}}{x_{0}-x_{1}}}\cdot{\frac{x_{2}}{x_{2}-x_{1}}}={\frac{2}{2-4}}\cdot{\frac {5}{5-4}}=-5$$

$D_2$ :

$$\ell_{2}(x)={\frac{x_{0}}{x_{0}-x_{2}}}\cdot{\frac{x_{1}}{x_{1}-x_{2}}}={\frac {2}{2-5}}\cdot{\frac{4}{4-5}}={\frac{8}{3}}$$

接著合在一起算

$$f(0)=\sum_{j=0}^{k-1}y_{j}\cdot\ell_{j}(x)$$

$$f(0)=1942\cdot{\frac{10}{3}}+3402\cdot-5+4414\cdot{\frac{8}{3}}={\frac{19420}{3}}-{\frac{51030}{3}}+{\frac {35312}{3}}={\frac{3702}{3}}=1234$$

> (影片來源：[Shamir's Secret Sharing: Explanation and Visualization](https://evervault.com/blog/shamir-secret-sharing) , Author:
>  [David Nugent](https://evervault.com/blog/shamir-secret-sharing#))

<video src="https://cdn.sanity.io/files/r000fwn3/production/b9cb032732f564764e341a4969099c43bf08959a.mp4" autoplay="" muted="" controls="" loop="" playsinline=""></video>

# 4. Shamir’s Secret Sharing的安全風險

如果某個攻擊者取得其中兩把金鑰，他又知道三把金鑰就可以還原金鑰，那他就可以用暴力破解的方法猜出整個多項式然後猜出 $secret$ 。

> (影片來源：[Shamir's Secret Sharing: Explanation and Visualization](https://evervault.com/blog/shamir-secret-sharing) , Author:
>  [David Nugent](https://evervault.com/blog/shamir-secret-sharing#))

<video src="https://cdn.sanity.io/files/r000fwn3/production/81a22e3b93e473ade79891d42b3a0cde3b63a0a0.mp4" autoplay="" muted="" controls="" loop="" playsinline=""></video>

或是像下面這個例子，如果攻擊者知道小金鑰只要3把，並且他已經獲得以下兩把金鑰

$$D_0=(1,1494);D_1=(2,1942)$$

那他可以知道原始的多項式會長的像是下面這樣

$$f(x)=secret+a_1x+a_2x^2$$

接著帶入 $D_0$ 、 $D_1$ 

$D_0$:

$$1494=secret+a_1\cdot1+a_2\cdot1^2=secret+a_1+a_2$$

$D_1$

$$1494=secret+a_1\cdot2+a_2\cdot2^2=secret+2a_1+4a_2$$

接著 $D_1 - D_0$ 得到

$$(1942-1494)=secret+2a_1+4a_2-(secret+a_1+a_2)$$

整理之後得到

$$a_1=448-3a_2$$

帶回原本的式子得到以下公式，於是就可以知道 $secret$ 一定是偶數，就會讓暴力破解的難度下降。

$$secret=1046+2a_2$$

# 5. 使用有限體 finite field / Galois field

解決上面風險的方法是使用 [有限體 (finite field / Galois field)](https://zh.wikipedia.org/zh-tw/%E6%9C%89%E9%99%90%E5%9F%9F)，有限體是包含有限個[元素](https://zh.wikipedia.org/wiki/%E5%85%83%E7%B4%A0_(%E6%95%B8%E5%AD%B8) "元素 (數學)")的[體](https://zh.wikipedia.org/wiki/%E5%9F%9F_(%E6%95%B8%E5%AD%B8) "體 (數學)")，一個有限體 滿足 $q=p^n$ 在這裡 $p$ 是值數, $n$ 是次方項，而接下來我們會用 $n=1$ 的有限體，也就是單一值數 $p$ 做示範(因為我的數學太差了QQ)

而這個值數 $p$ 就是我們之前提到的 1613, 只要把前面提到的三把小金鑰的 y 值都 mod 1613, 就可以把y值限縮在0~1612中間：

mod 之前：

$$D_0=(2,1942);D_1=(4,3402);D_2=(5,4414)$$

mod 之後

$$D_0=(2,329);D_1=(4,176);D_2=(5,1188)$$

以下是將小金鑰 mod的結果，可以看到如果攻擊者只拿到其中2個點的話，就算暴力解也無法還原出原本的多項式
> (影片來源：[Shamir's Secret Sharing: Explanation and Visualization](https://evervault.com/blog/shamir-secret-sharing) , Author:
>  [David Nugent](https://evervault.com/blog/shamir-secret-sharing#))

<video src="https://cdn.sanity.io/files/r000fwn3/production/068001535d5ba6fd231f694041d155f7aacf9288.mp4" autoplay="" muted="" controls="" loop="" playsinline=""></video>

但是如果使用者可以拿到3把小金鑰，就可以使用[模反元素(Modular multiplicative inverse)](https://zh.wikipedia.org/zh-tw/%E6%A8%A1%E5%8F%8D%E5%85%83%E7%B4%A0)的方法反算出原本的 $secret$

> (影片來源：[Shamir's Secret Sharing: Explanation and Visualization](https://evervault.com/blog/shamir-secret-sharing) , Author:
>  [David Nugent](https://evervault.com/blog/shamir-secret-sharing#))

<video src="https://cdn.sanity.io/files/r000fwn3/production/260cd0495f9633ba2d8b925b81490807975a2f3b.mp4" autoplay="" muted="" controls="" loop="" playsinline=""></video>

# 6. Python 實做金鑰生成與解析
接下來會用python程式碼實做金鑰生成與反算，程式碼來自於wiki的 [Python code](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing#Python_code)。我自己實做比較詳細的版本在[Github: Shamir_Secret_Sharing_practice](https://github.com/TinyMurky/Shamir_Secret_Sharing_practice)

## 6-1 金鑰生成
首先是生成金鑰的部份
```python
"""
This file will create a polynomial,
sample "k" point from it,
and get (y mod prime) from that polynomial
"""

import random

from .constants import DEFAULT_PRIME # 2 ** 127 - 1 (會是一個質數)


def _eval_at(polynomial_coefficients: list[int], x, prime) -> int:
    """
    This function use iterated method to calculate "f(x) mod prime"
    mod will be calculate inside every step not after f(x) is calculated
    """

    accumulate: int = 0

    for coefficient in reversed(
        polynomial_coefficients
    ):  # reverse make sure it calculate from a_n to a_0
        accumulate *= x
        accumulate += coefficient
        accumulate %= prime
    return accumulate


def make_random_share(
    secret: int, threshold_of_key: int, shares_of_key: int, prime: int = DEFAULT_PRIME
) -> list[tuple[int, int]]:
    """
    :param secret: secret to divided into shares
    :param threshold_of_key: minimum number of shares needed to reconstruct the secret
    :param shares_of_key: number of shares to generate
    :param prime: prime number to mod polynomial
    """

    if threshold_of_key > shares_of_key:
        raise ValueError("Threshold of key must be less than or equal to shares of key")

    # Secret is the first coefficient of the polynomial
    # other coefficients are random between 0 and prime - 1
    # the max degree of polynomial is threshold_of_key - 1,
    # because we already have secret be our first coefficient
    polynomial_coefficients = [secret] + [
        random.SystemRandom().randint(0, prime - 1) for _ in range(threshold_of_key - 1)
    ]

    # x is 1 to shares_of_key + 1, y use _eval_at to calculate f(x) mod prime
    points = [
        (x, _eval_at(polynomial_coefficients, x, prime))
        for x in range(1, shares_of_key + 1)
    ]
    return points
```

首先是`_eval_at` 可以把一組 多項式 的係數，帶入 x 之後 用prime(質數) mod出結果。這裡是用迭代的方法，每次跑一個係數就會mod一次答案。

```python
def _eval_at(polynomial_coefficients: list[int], x, prime) -> int:
    """
    This function use iterated method to calculate "f(x) mod prime"
    mod will be calculate inside every step not after f(x) is calculated
    """

    accumulate: int = 0

    for coefficient in reversed(
        polynomial_coefficients
    ):  # reverse make sure it calculate from a_n to a_0
        accumulate *= x
        accumulate += coefficient
        accumulate %= prime
    return accumulate
```

接下來是產生金鑰，parameter 中的 `secret` 是 我們實際的金鑰, `threshold_of_key`是要幾把小金鑰才可以反算出原本的金鑰。`shares_of_key`是總共生成多少把金鑰。

在 `polynomial_coefficients`這裡，先把`secret` 當作常數項，然後 $x$ 和 $x^2$ 的常數項則是從`1~prime-1`中選取,  最後產生x 從`1~shares_of_key+1`的點點(不要用 $x=0$ 那是保留給 $secret$ )
```python
def make_random_share(
    secret: int, threshold_of_key: int, shares_of_key: int, prime: int = DEFAULT_PRIME
) -> list[tuple[int, int]]:
    """
    :param secret: secret to divided into shares
    :param threshold_of_key: minimum number of shares needed to reconstruct the secret
    :param shares_of_key: number of shares to generate
    :param prime: prime number to mod polynomial
    """

    if threshold_of_key > shares_of_key:
        raise ValueError("Threshold of key must be less than or equal to shares of key")

    # Secret is the first coefficient of the polynomial
    # other coefficients are random between 0 and prime - 1
    # the max degree of polynomial is threshold_of_key - 1,
    # because we already have secret be our first coefficient
    polynomial_coefficients = [secret] + [
        random.SystemRandom().randint(0, prime - 1) for _ in range(threshold_of_key - 1)
    ]

    # x is 1 to shares_of_key + 1, y use _eval_at to calculate f(x) mod prime
    points = [
        (x, _eval_at(polynomial_coefficients, x, prime))
        for x in range(1, shares_of_key + 1)
    ]
    return points
```

下面是示範使用，假設 $secret$ 是1234，生出伍把key
```python
def start():
    """
    Start
    """
    _secret = 1234
    shares = make_random_share(_secret, 3, 5, DEFAULT_PRIME)

	# print結果
    print(f"Secret: {_secret}")
    print('Shares:')
    if shares:
        for share in shares:
            print('  ', f"key: (x: {share[0]}, y: {share[1]})")
```

結果如下：
```console
Secret: 1234
Shares:
   key: (x: 1, y: 64499932312378433274612611001340990222)
   key: (x: 2, y: 86354527660512659223014381865893903271)
   key: (x: 3, y: 65563786044402677845205312593658740381)
   key: (x: 4, y: 2127707464048489141185403184635501552)
   key: (x: 5, y: 66187475379919324842641957354708292511)
```

## 6-2. 金鑰解析
解析的程式碼如下：

```python
"""
This code will recover secret from shares
"""

from typing import Generator
from .constants import DEFAULT_PRIME  # 2 ** 127 - 1 (會是一個質數)

def _extended_gcd(a: int, n: int) -> tuple[int, int]:
    """
    This will calculate "Modular multiplicative inverse" by extended Euclidean algorithm
    check https://zh.wikipedia.org/wiki/%E6%A8%A1%E5%8F%8D%E5%85%83%E7%B4%A0 for more information

    When a*x + n*y = 1, x is the modular multiplicative inverse of a will be x
    """

    x = 0
    last_x = 1
    y = 1
    last_y = 0
    while n != 0:
        quot = a // n
        a, n = n, a % n
        x, last_x = last_x - quot * x, x
        y, last_y = last_y - quot * y, y

    # last_x is the modular multiplicative inverse of a
    return last_x, last_y

def _divmod(num: int, den: int, prime: int) -> int:
    """Compute num / den mod prime

    this will make sure the following equation hold:
    den * _divmod(num, den, prime) % prime == num

    what we want is to help lagrange interpolation of:
        (num/den) mod prime
    be easily calculated with "Modular multiplicative inverse" of den
    """
    inv, _ = _extended_gcd(den, prime)
    return num * inv

def _lagrange_interpolation(x: int, x_shares: list[int], y_shares: list[int], prime: int) -> int:
    """
    This function will calculate lagrange interpolation for x
    """

    len_of_shares = len(x_shares)
    assert len_of_shares == len(set(x_shares)), "x_shares must be unique"

    def PI(vals:Generator[int, None, None] | list[int]) -> int :
        """
        upper-case PI -- product of inputs
        """
        accumulate = 1
        for v in vals:
            accumulate *= v
        return accumulate

    nums:list[int] = []  # avoid inexact division, nums is the product of (x - x_j) for all j != i
    dens: list[int] = []  # dens is the product of (x_i - x_j) for all j != i
    for i in range(len_of_shares):
        others = list(x_shares)
        cur = others.pop(i)
        nums.append(PI(x - o for o in others))
        dens.append(PI(cur - o for o in others))

    den = PI(dens) # product of all dens, 可以當作是每個差值為了一起計算，分母進行的通分

    # nums[i] * den * y_shares[i] % prime 是 lagrange 需要 sum(y * (x - x_1) * ... * (x - x_n) / (x_i - x_1) * ... * (x_i - x_n))
    # 所以 nums[i]代表在 i 的 分子的乘積, den代表通分, y 代表 shares_i的被mod prime的y值
    # 把nums[i] * den * y_shares[i] % prime 和 dens[i] 代入_divmod, 就是相當於 進行模數除法運算, 並且把結果加總
    num = sum([_divmod(nums[i] * den * y_shares[i] % prime, dens[i], prime)
               for i in range(len_of_shares)])

    return (_divmod(num, den, prime) + prime) % prime # make sure the value is in range of prime

def recover_secret(shares: list[tuple[int, int]], prime: int = DEFAULT_PRIME) -> int:
    """
    :param shares: list of shares
    :param prime: prime number to mod polynomial
    """
    x_shares, y_shares = zip(*shares)
    return _lagrange_interpolation(0, x_shares, y_shares, prime)
```

首先是`_extended_gcd` 是擴展歐幾里得算法 (輾轉鄉除法的擴展)，可以算出在 `mod n` 的情況下 a的[模反元素(Modular multiplicative inverse)](https://zh.wikipedia.org/wiki/%E6%A8%A1%E5%8F%8D%E5%85%83%E7%B4%A0) ( $a\cdot a^{-1}\equiv 1$ ), 下面的 `last_x` 就是 $a^{-1}$ 
```python
def _extended_gcd(a: int, n: int) -> tuple[int, int]:
    """
    This will calculate "Modular multiplicative inverse" by extended Euclidean algorithm
    check https://zh.wikipedia.org/wiki/%E6%A8%A1%E5%8F%8D%E5%85%83%E7%B4%A0 for more information

    When a*x + n*y = 1, x is the modular multiplicative inverse of a will be x
    """

    x = 0
    last_x = 1
    y = 1
    last_y = 0
    while n != 0:
        quot = a // n
        a, n = n, a % n
        x, last_x = last_x - quot * x, x
        y, last_y = last_y - quot * y, y

    # last_x is the modular multiplicative inverse of a
    return last_x, last_y
```

接著是 `_divmod` 這是在有限域 中的除法實做, 我們要算出：
$$
\frac{num}{den}
$$

可以先找出 $den$ 在質數 $prime$ 狀態下的模反元素 $inv$ ，再用 $inv$ 乘上 $num$ 就可以得到在 質數 $prime$ 的有限域中 兩個數字相除會是什麼數字。 
```python
def _divmod(num: int, den: int, prime: int) -> int:
    """Compute num / den mod prime

    this will make sure the following equation hold:
    den * _divmod(num, den, prime) % prime == num

    what we want is to help lagrange interpolation of:
        (num/den) mod prime
    be easily calculated with "Modular multiplicative inverse" of den
    """
    inv, _ = _extended_gcd(den, prime)
    return num * inv
```

最後是拉格朗日差值多項式在有限域下的算法：

首先 `x` 就是我們要求的點的 $x$ 項，我們要求 $secret$ ，所以這邊 $x$ 在使用此function的時候應該填入 0。 `x_shares`則是所有小金鑰的x的部份, `y_shares`則是所有小金鑰的y的部份(都被prime mod 過)。`prime`則是金鑰在產生時是被什麼數字給mod過。

接著是 `def PI`，這邊單純是把一組 integer連乘。

往下的 `nums`和`dens` 是之前提到公式的分子與分母, 依照每個小金鑰算出該金鑰的 $\ell$ 方便我們等一下作加總， `nums` 就是 $x_m$ `dens` 是 $x_m - x_j$ 。要注意要移除 `j` 的金鑰。

$$\ell _{j}(x) = \prod _{\begin{smallmatrix}m\,=\,0\\m\,\neq \,j\end{smallmatrix}}^{k-1}{\frac {x_{m}}{x_{m}-x_{j}}}$$

算好之後就要計算下面這邊的部份，首先先把 `dens` 連乘起來 然後通分。接著分子是 `nums` * `den(通分)` * `y_j`  然後先 mod `prime` 接著用有限域除法 `dens[i]`。最後把加總的再除一次通分的 `den`。

$$f(0)=\sum _{j=0}^{k-1}y_{j}\cdot\ell _{j}(x)$$

```python
def _lagrange_interpolation(x: int, x_shares: list[int], y_shares: list[int], prime: int) -> int:
    """
    This function will calculate lagrange interpolation for x
    """

    len_of_shares = len(x_shares)
    assert len_of_shares == len(set(x_shares)), "x_shares must be unique"

    def PI(vals:Generator[int, None, None] | list[int]) -> int :
        """
        upper-case PI -- product of inputs
        """
        accumulate = 1
        for v in vals:
            accumulate *= v
        return accumulate

    nums:list[int] = []  # avoid inexact division, nums is the product of (x - x_j) for all j != i
    dens: list[int] = []  # dens is the product of (x_i - x_j) for all j != i
    for i in range(len_of_shares):
        others = list(x_shares)
        cur = others.pop(i)
        nums.append(PI(x - o for o in others))
        dens.append(PI(cur - o for o in others))

    den = PI(dens) # product of all dens, 可以當作是每個差值為了一起計算，分母進行的通分

    # nums[i] * den * y_shares[i] % prime 是 lagrange 需要 sum(y * (x - x_1) * ... * (x - x_n) / (x_i - x_1) * ... * (x_i - x_n))
    # 所以 nums[i]代表在 i 的 分子的乘積, den代表通分, y 代表 shares_i的被mod prime的y值
    # 把nums[i] * den * y_shares[i] % prime 和 dens[i] 代入_divmod, 就是相當於 進行模數除法運算, 並且把結果加總
    num = sum([_divmod(nums[i] * den * y_shares[i] % prime, dens[i], prime)
               for i in range(len_of_shares)])

    return (_divmod(num, den, prime) + prime) % prime # make sure the value is in range of prime
```

最後只要把 前面生成 `recover_secret` 然後把原本的 keys 放在 `shares`裡面，就可以 `zip` 拆出 `x_shares`, `y_shares` 算出原本的 `shares`

```python
def recover_secret(shares: list[tuple[int, int]], prime: int = DEFAULT_PRIME) -> int:
    """
    :param shares: list of shares
    :param prime: prime number to mod polynomial
    """
    x_shares, y_shares = zip(*shares)
    return _lagrange_interpolation(0, x_shares, y_shares, prime)
```

範例：
```python
def start():
    """
    Start
    """
    _secret = 1234
    shares = make_random_share(_secret, 3, 5, DEFAULT_PRIME)

    print(f"Secret: {_secret}")
    print('Shares:')
    if shares:
        for share in shares:
            print('  ', f"key: (x: {share[0]}, y: {share[1]})")

    recovered_secret = recover_secret(shares[:3])
    print(f"Recovered secret: {recovered_secret}")

```

回傳：
```
Secret: 1234
Shares:
   key: (x: 1, y: 64499932312378433274612611001340990222)
   key: (x: 2, y: 86354527660512659223014381865893903271)
   key: (x: 3, y: 65563786044402677845205312593658740381)
   key: (x: 4, y: 2127707464048489141185403184635501552)
   key: (x: 5, y: 66187475379919324842641957354708292511)
Recovered secret: 1234
```
