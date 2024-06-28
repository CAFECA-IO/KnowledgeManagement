# 1. Image Generation
> 參考資料：
>- [基於 Diffusion Models 的生成圖像演算法](https://d246810g2000.medium.com/%E5%9F%BA%E6%96%BC-diffusion-models-%E7%9A%84%E7%94%9F%E6%88%90%E5%9C%96%E5%83%8F%E6%BC%94%E7%AE%97%E6%B3%95-984212710610)
>- [AIAIART #7](https://colab.research.google.com/drive/1NFxjNI-UIR7Ku0KERmv7Yb_586vHQW43?usp=sharing#scrollTo=g7btoXL7Im7M)
>- [原始論文:Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)

## 常見圖片生成
![](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/generative-overview.png)
- Autoencoder [2006]
- Variational Autoencoder (VAE) [2014]
- Flow-based models
- GAN [2014]
- PixelRNN [2016]
- Diffusion [2020]

## Defusion Model
Defusion Model 是模仿Markov chain，利用常態分佈(高斯分佈)逐漸對一張圖片增加雜訊，直到看不到原始的圖片(下圖的q)，再利用模型一步一步把圖片還原回來(下圖的p)
![image](https://hackmd.io/_uploads/BJz50T7LR.png)

可以看下左這張圖逐漸從雜訊中生出一張圖。
<div style="display: flex; justify-content: space-around;">
  <div style="text-align: center;">
    <img src="https://miro.medium.com/v2/resize:fit:640/format:webp/1*4GmL_x9gzQu3uiH8JKdfaQ.gif" alt="Image 1" style="max-width:97%;">
    <p>生成過程</p>
  </div>
  <div style="text-align: center;">
    <img src="https://truth.bahamut.com.tw/s01/202304/4adfdcb747b978c794f5709339986662.JPG" alt="Image 2" style=";">
    <p>我的train壞掉的版本</p>
  </div>
</div>



### Diffusion process (擴散過程)
下面是的意思是，我們會逐步對一張圖片加上常態分配的雜訊，這個步驟總共會做T次，其中的一次叫做t。`Beta_t`是一個會隨著t越大而增加的值，而雜訊的常態分配的平均數(mean)是`Beta_t`*上一步驟t-1的圖片, 變異數(var)是`Beta_t`，可以算出雜訊eps, 接著新的圖片會是`main + √var*eps`。

我們模型要訓練的其實是給定一張被雜訊污染的`X_t`，要求模型幫我們預測出是什麼雜訊污染他，也就是預測`eps`

> 公式

$$
q(\mathbf{x}_{1:T} | \mathbf{x}_0) := \prod_{t=1}^T q(\mathbf{x}_t | \mathbf{x}_{t-1}), \quad 
q(\mathbf{x}_t | \mathbf{x}_{t-1}) := \mathcal{N}(\mathbf{x}_t; \sqrt{1 - \beta_t}\mathbf{x}_{t-1}, \beta_t \mathbf{I})
$$

```python=
n_steps = 100
beta = torch.linspace(0.0001, 0.04, n_steps)

def q_xt_xtminus1(xtm1, t):
  # gat
  mean = gather(1. - beta, t) ** 0.5 * xtm1 # √(1−βt)*xtm1
  var = gather(beta, t) # βt I
  eps = torch.randn_like(xtm1) # Noise shaped like xtm1
  return mean + (var ** 0.5) * eps


def gather(consts: torch.Tensor, t: torch.Tensor):
    """
    Gather consts for $t$ and reshape to feature map shape
    用來提取一個tensor中第t個值，並錢reshape
    
    """
    c = consts.gather(-1, t)
    return c.reshape(-1, 1, 1, 1)
```

### Reverse process (逆擴散過程)
上面說到模型需要給定圖片`x_t`，預測雜訊`eps`，實際上是要讓模型學會產生`eps`的常態分配的平均值和標準差。

有了上面的`beta_t`，可以算出`alpha_t = 1 - beta_t`, `alpha_bar_t = 從 t=0 連乘到t=t`，接著按下面步驟算出：
1. 雜訊的係數 eps_coef = `(1-alpha_t )/ √(1-alpha_bar_t)`
2. 平均mean = `(1/(√alpha_t))*(x_t - eps_coef * noise)`
3. var: 就是`beta_t`
4. 新的雜訊eps: 用torch生成隨機數
5. 新的圖片 `main + √var*eps`
> 公式：

$$
p_\theta(\mathbf{x}_{0:T}) := p(\mathbf{x}_T) \prod_{t=1}^T p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t), \quad 
p_\theta(\mathbf{x}_{t-1}|\mathbf{x}_t) := \mathcal{N}(\mathbf{x}_{t-1}; \mu_\theta(\mathbf{x}_t, t), \Sigma_\theta(\mathbf{x}_t, t))
$$

```python=
# Set up some parameters
n_steps = 100
beta = torch.linspace(0.0001, 0.04, n_steps).cuda()
alpha = 1. - beta
alpha_bar = torch.cumprod(alpha, dim=0)

def p_xt(xt, noise, t):
  """
  x_t:被污染的圖片
  noise：模型看著x_t預測出來的雜訊
  t:現在是第幾步驟
  """
  alpha_t = gather(alpha, t)
  alpha_bar_t = gather(alpha_bar, t)
  eps_coef = (1 - alpha_t) / (1 - alpha_bar_t) ** .5
  mean = 1 / (alpha_t ** 0.5) * (xt - eps_coef * noise) # Note minus sign
  var = gather(beta, t)
  eps = torch.randn(xt.shape, device=xt.device)
  return mean + (var ** 0.5) * eps 
```

### Algorithm 演算法
![image](https://hackmd.io/_uploads/HJw4C6Q8C.png)

#### Loss Function
學習的時候會使用下面這個loss function來計算，其實就是算出污染`x_t`圖片的雜訊`eps_t`與模型預測的雜訊`pred_noise_t`平方差的平方 (mse)
$$
L_{\text{simple}}(\theta) := \mathbb{E}_{t, \mathbf{x}_0, \epsilon} \left[ \left\| \epsilon - \epsilon_\theta \left( \sqrt{\bar{\alpha}_t} \mathbf{x}_0 + \sqrt{1 - \bar{\alpha}_t} \epsilon, t \right) \right\|^2 \right]
$$

#### Training
重複以下4個步驟直到loss降低
1.訓練時先從我們想訓練的圖片集(`q(x_theata`)中挑出一張 `x_theata`
2.設定總訓練步驟數大T(也就是上面設定的`n_step`)，中**隨機**挑朱一個步驟做
3.先用常態分佈隨機出一個雜訊`eps`
4.用上面的loss function算出`eps`與模型預測的雜訊`pred_noise`的平方差的平方，然後做gradient descent

<div style="display: flex-ㄏㄠ; justify-content: space-around;">
  <div style="text-align: left; width: 100%;;">
    <b>Algorithm 1</b> Training
    <pre>
1: repeat
2:   <b>x</b><sub>0</sub> ~ <i>q</i>(<b>x</b><sub>0</sub>)
3:   <i>t</i> ~ Uniform({1, ..., T})
4:   <b>ε</b> ~ <i>𝒩</i>(0, <b>I</b>)
5:   Take gradient descent step on
         ∇<sub>θ</sub> || <b>ε</b> - <b>ε</b><sub>θ</sub>(√<span style="text-decoration: overline;">α</span><sub>t</sub><b>x</b><sub>0</sub> + √1 - <span style="text-decoration: overline;">α</span><sub>t</sub><b>ε</b>, <i>t</i>) ||<sup>2</sup>
6: until converged
    </pre>
  </div>
</div>


#### Sampling
訓練好之後就可以來產圖了，產圖流程如下：
1. 先獲得一個雜訊，就做`x_T`
2. 執行大T(n_step)次去噪動作，以下為loop
    1. 使用訓練好的model產生預測的雜訊`pred_eps`
    1. 使用[Reverse process (逆擴散過程)](#Reverse-process-逆擴散過程)的公式，幫圖片降噪，並還要加上一個小雜訊
3. loop完之後圖片產出 

<div style="display: flex-ㄏㄠ; justify-content: space-around;">
  <div style="text-align: left; width: 100%;">
    <b>Algorithm 2</b> Sampling
    <pre>
1: <b>x</b><sub>T</sub> ~ <i>𝒩</i>(0, <b>I</b>)
2: for <i>t</i> = T, ..., 1 do
3:   <b>z</b> ~ <i>𝒩</i>(0, <b>I</b>) if <i>t</i> > 1, else <b>z</b> = 0
4:   <b>x</b><sub>t-1</sub> = <sup>1</sup>/<sub>√α<sub>t</sub></sub> (<b>x</b><sub>t</sub> - <sup>1 - α<sub>t</sub></sup>/<sub>√1 - <span style="text-decoration: overline;">α</span><sub>t</sub></sub> <b>ε</b><sub>θ</sub>(<b>x</b><sub>t</sub>, <i>t</i>)) + σ<sub>t</sub><b>z</b>
5: end for
6: return <b>x</b><sub>0</sub>
    </pre>
  </div>
</div>

### 模型 UNet

> 參考資料
>- [UNet 原始論文:U-Net: Convolutional Networks for Biomedical Image Segmentation](https://arxiv.org/abs/1505.04597)
>- [ConvTranspose2d原理，深度网络如何进行上采样？](https://blog.csdn.net/qq_27261889/article/details/86304061)

U Net 是用來預測雜訊 `pred_eps`的模型本體，他可以輸入兩個值：
1. 用來預測的被污染的圖片`x_t`
2. 現在是第幾個步驟t

步驟是
1. down: 2次的 3\*3 convolution 搭配一次2\*2 max pool，共執行4次
2. middle(bottom)，兩次的convolution，在這裡要加數步驟t的embedding資訊，模型才會知道現在在第幾步驟
3. up:2次的 3\*3 convolution 搭配一次2\*2 up-conv(逆convolution)，共執行4次
![image](https://hackmd.io/_uploads/HJDoCe4LA.png)
