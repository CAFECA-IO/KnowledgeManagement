<div align=center>

![girl-creating-robot-help-her-with-daily-chores (1)](https://github.com/user-attachments/assets/82f2981c-613b-4b70-94ab-4597e785666a)

</div>

# 如何使用 ComfyUI 建立動畫? _How to create animations using comfyUI?_

## 前言
截至今日AI技術的發展已經改變了我們現代在創作和設計表達的方式。隨著技術的進步，創建高質量影像和動畫的過程變得前所未有的簡單，即便是沒有程式背景的使用者，也能夠輕鬆上手。ComfyUI 作為一款主打工作流的強大AI工具，正是這一潮流的典範。它結合了直觀的工作流介面、各種功能的模型、先進的技術，讓任何人都能快速生成影像、動畫，從靜態影像到動態影片，不需要具備深厚的技術知識，便能創作出令人驚豔的視覺作品。在這篇文章中，我們將探討如何利用 ComfyUI 建立圖片與動畫。

## 什麼是ComfyUI?
ComfyUI 是一個開源的圖形使用者介面框架，主要為 Stable Diffusion 和類似的圖像生成模型設計。ComfyUI提供了使用者友善的介面，讓使用者能夠更方便地操作這些模型，而不需要深入了解複雜的程式碼或命令行。ComfyUI 讓使用者可以調整模型參數、生成圖像、批量處理任務等，通常是為了簡化和優化圖像生成的過程。如果對圖像生成模型有興趣，ComfyUI可以幫助你更輕鬆地進行操作和實驗。

ComfyUI在使用流程上是以「功能模組」和「節點」來編輯可視化流程的AI繪圖－圖形使用者介面(GUI)。他的優點在於執行速度快、資源消耗較低，而且這種模組與節點串接的方式能給使用者更直觀的理解，不需要寫一堆程式代碼，在上手的速度會比較快一點。ComfyUI使用「節點式編輯」工作流的方式更符合專業團隊的需求，節點的工作模式可以滿足多人協作、更靈活運用各個模組拼接。

#### ComfyUI 節點式的工作流介面
![image](https://github.com/user-attachments/assets/f1861da6-67fc-4987-b7c4-e86ab0abc7e4)

ComfyUI也提供分享工作流的功能，有許多網站提供別人製作的工作流可以免費下載進行實作參考，除了分享整個工作流之外你也可以分享某一個功能模組。以下連結是ComfyUI Workflows的分享網站：

- [ComfyUI Examples](https://github.com/comfyanonymous/ComfyUI_examples)
- [1000+ ComfyUI workflows](https://openart.ai/workflows/home?gad_source=1&gclid=CjwKCAjwuMC2BhA7EiwAmJKRrHEC7oLer7z-7pAMGnKj63Hz763Ap-vhWMqDHTm-HpDnQ4TazXEUsxoCmG8QAvD_BwE)
- [Civitai | Tag:workflows](https://civitai.com/articles?tags=127048&fbclid=IwAR2HO6HyQ_0ZNE59ucauJ41NDDBmu1vJmbLUnbNiXtzMj4kdqdniTNmfpvU)

### ComfyUI 安裝配置
ComfyUI 的安裝配置可以直接參考 [ComfyUI-Github](https://github.com/comfyanonymous/ComfyUI) 進行安裝與設置，除了手動安裝外也提供下載至本地端使用的ComfyUI，配置部分在Github文件是建議使用Nvidia顯示卡，如果是使用AMD顯示卡則會使用Linux系統。

> [!IMPORTANT] 
> 在ComfyUI 提供「Manager」功能，能夠下載額外插件、進行插件管理、當工作流匯入時能幫你補齊缺失插件等功能，是非常實用的額外功能，一定要記得下載。安裝完新的插件記得重新啟動。

## ComfyUI 生成圖片
完成安裝後開啟網址來到 ComfyUI 會看到一個預設的工作流。右邊的功能列表，包含輸出佇列、儲存匯入工作流、刷新、剪輯空間、清除、載回預設值，最下方則是額外安裝的「Manager插件管理」與分享功能，中間的預設工作流其實就可以簡單生成圖片，以此預設工作流介面介紹各個插件的功能。

#### ComfyUI 預設工作流介面
<img width="1673" alt="截圖 2024-08-30 上午11 20 24" src="https://github.com/user-attachments/assets/b4f003fd-96ec-4e16-8e88-25d99f8d0124">

#### Checkpoint 模型加載器
![image](https://github.com/user-attachments/assets/e6baaf90-7fed-415c-b4f3-4b4721dc870b)

可以選擇你的Checkpoint模型，不同的模型所生成的影像也會有所差別，而且有些模型是不支援某些插件功能的。這邊的模型也可以從Stable Diffusion匯入。這邊我使用的是 Dreamshaper_8 模型，在生成圖片的質量上很好，且如果是想生成人物或是動畫、漫畫風格的圖片建議可以下載使用。

#### Clip文字提示編碼
![image](https://github.com/user-attachments/assets/3c70a065-620a-495d-bf0e-f9d733a2e3ae)

這邊的Clip文字提示編碼指的是輸入提示詞的功能，包含有正向與反向的提示詞，正向的提示詞可以理解成你想要生成的圖片內容，例如你想生成一張動漫風格的女生，可能在海邊聽音樂，可以輸入成 「Anime Girl,Listening the muic,seaside」，你也可以針對你想生成的圖片質量進行提示詞的輸出。反向提示詞可幫助您避免人工智慧產生的影像中出現不良結果，反向提示詞通常會輸入避免身體扭曲或不適當的內容，確保創作符合你的願景。

#### 採樣器
![image](https://github.com/user-attachments/assets/171a431d-a59c-401d-8c4b-fa9a04ca493d)

採樣器會根據你的模型與提示詞進行圖片的渲染，是整個工作流的核心，透過連接你設定的模型、輸入正向和反向提示詞來生成你的潛在圖像。

#### VAE解碼
![image](https://github.com/user-attachments/assets/d8d94d24-9007-489c-99cf-0e64b4ee931d)

將採樣器所生成的潛在圖像轉成真實圖像並輸出，可以理解採樣器所生成的圖像是由一堆程式碼組成，而解碼器就是來把這些程式碼翻譯成圖片的工具。

#### 圖片生成
<img width="1670" alt="截圖 2024-08-30 下午2 02 01" src="https://github.com/user-attachments/assets/8771f37b-e014-4ad1-85ec-23b2551c7110">


## ComfyUI 由圖片生成影片
進行生成影片的之前，要先進行相關模型的下載
> [AnimateDiff](https://github.com/guoyww/AnimateDiff)
> Manager內安裝: AnimateDiff Evolved、VideoHelper

#### 新增採樣器與加載器與設定參數
![image](https://github.com/user-attachments/assets/739d3898-0dbe-42a2-b625-9f0ce10912a6)

從Efficiency Nodes 模型中，新增一個採樣器與加載器，採樣器之前在生成圖片有提到就是工作流的核心，可以說是生成圖片的關鍵模型，而Efficiency Nodes內的加載器可以說是比較複雜一點的Checkpoint模型加載器。在加載器的部分一樣選擇指定的模型名稱，在連結部分可以直接將加載器與採樣器對應的節點連結(模型、正反條件、Latent、VAE)，這邊節點在連結時會發現ComfyUI節點只會連結到可以連結的對應點，是他們的防呆機制，也可以更減少錯誤發生。

在加載器的下方有兩欄文字提示編碼輸入的地方，上面的為正向(你想生成的圖片)、下方為反向(不想圖片出現的)，在輸入完成後，這邊加載器的設定就差不多完成。採樣器的部分可以先看到Steps(步數)，這是指你圖片生成所要花的Step，步數越多花的時間也會越長。採樣器的部分可以選擇ddpm(在低步數下，仍然可以生成質量好的圖片)，這時候點擊佇列生成就可以看到你的圖片了

![image](https://github.com/user-attachments/assets/99886844-0f11-4cab-9274-febce10e279d)

#### AnimateDiff模型組件
![image](https://github.com/user-attachments/assets/74777b9d-489f-41b0-ab42-31187afdf05c)

AnimateDiff模型組件有非常多的模型可以做使用，這次使用到的是比較基礎的Gen Mode 1。Gen mode 2 是比較多參數自定義的部分，把Gen Mode 1的模組拆開來運行，所以自定義空間較大。下圖就是AnimateDiff此次的核心模型。可以發現AnimateDiff是模型對模型的管道，這時候可以看到剛剛建立採樣器與加載器，也有模型對模型的管道，這時候就會了解要如何把AnimateDiff加入到工作流中了。

![image](https://github.com/user-attachments/assets/862595c2-d5f8-4b59-935f-7e91710b02ca)

![image](https://github.com/user-attachments/assets/356568fd-dcf4-4811-ad21-aa77571d181d)

再來可以看到context_options的部分，這邊指的是章節配置，AnimateDiff在初版只能生成2秒鐘的影片，但有了章節配置之後，透過把生成的影片續接，把兩秒鐘疊加上去就能超過這個時長，但這邊前提是後面生成的影片要與前面有關，這就像是你看西遊記，如果突然出現哈利波特你也會覺得很奇怪，影片也是一樣要有前後文關係，所以要基於前面的影像進行後續的演算，這邊就跟我們的採樣器有關需要將採樣器的隨機種子指定為同一種子。

選擇章節配置的模組，可以從下圖找到，上面的Standard指的是靜態的模組，我們這邊所選擇的是Looped動態的模組，將我們動態模組與剛剛的核心模組章節配置的管道連結。
![image](https://github.com/user-attachments/assets/5290e24f-23f8-45cc-b000-1f2357dfb6b5)

##### Looped動態模組
![image](https://github.com/user-attachments/assets/e69710b7-26cb-47ac-8c1b-63f03f207de6)

#### Looped動態模組比較重點的內容
- 第一個context_length指的是你的圖片有多少張，可以理解成你的影片是由一張一張的圖片構成，預設值為16，可以依據8的倍數進行調整(這裡參考的是動畫製作的幀數)。
- 第二個Stride是指會推播的張數，假設你選擇16張的圖片，如果從頭到尾播放選擇一張一張放這樣就會比較細膩，如果你是兩張或是三張播放眼睛就會看出圖片瞬間的轉換，相較就是比較不細膩的影片。
- 第三個overlap指的是融合，通常，通常畫面運動比較激烈就會選擇多點融合，畫面動作較少就會調整少點融合。

#### 產出連續圖片
<img width="1018" alt="截圖 2024-08-30 下午4 01 56" src="https://github.com/user-attachments/assets/4654e416-d490-47f1-93f5-cc9a454a9db9">

接下來設置AnimateDiff Loader模型，這邊Model Name需要選擇運動的模型，可以在AnimeDiff查找相關的運動模型，這次測試使用的為V3，下方beta_schedule常用的為線性的調度器，Motion_Scale指定是運動強度(越高越強)。調整完後至加載器的批次大小(一次生成圖片數量)調整輸出至對應的數量。點擊生成佇列，生成圖片後點擊圖片會發現是同一系列且具有動作的連續圖片。

![image](https://github.com/user-attachments/assets/e760f8eb-35ea-47e7-b99a-cee2f6ac71fb)

#### 將連續圖片做成影片
這邊會使用到處理影片的處理影片的節點模型-VideoHelper，這邊選擇合併成影片。並把採樣器的圖像管道與合併成影片的圖像管道進行連結。
![image](https://github.com/user-attachments/assets/1283d154-d4ff-46f3-82ce-9508e018c5e8)
![image](https://github.com/user-attachments/assets/c2aa42fe-03df-43eb-8c25-59d278123211)

調整合併影片的參數，調整幀數參考前面在加載器所設置批次大小的數字，循環次數的部分則是影片循環播放的次數(0則為不循環)，文件名稱與格式則依自身需求調整，Ping-Pong指的是影片從頭到尾再從尾巴到頭，來回播放。
調整完成後，點擊生成就會發現圖片已經變成影片。

https://github.com/user-attachments/assets/a920bb26-20e1-4501-9b3b-6d8315cbc727

## 總結
這次使用 ComfyUI 的初步建立生成圖片與將圖片轉換成影片的過程中，即便沒有程式語言的背景，其實也是能夠輕鬆進入 AI 創作的領域。ComfyUI提供強大的模組功能，以及許多社群都有開源可以參考的工作流，甚至有許多從0到1的教學影片，都讓人快速掌握並創建出高質量的圖片與動畫。不僅拓展了使用者的創作能力，對 AI 技術的未來發展應用更是有了深入的理解與對開發人員的敬佩。ComfyUI 讓每一位使用者都能輕鬆實現他們的視覺構想，也是進一步展現了現代 AI 技術的無限潛力。

## Reference
- [ComfyUI初階②基本操作手冊](https://vocus.cc/article/654798f8fd89780001d4ffaa)

- [SD學習筆記 | Stable Diffusion模型概念篇](https://www.patreon.com/posts/comfyuijiao-xue-95319890)

- [K採樣器](https://comfyuidoc.com/zh/Core%20Nodes/Sampling/KSampler.html)

- [只需簡潔文本，創建豐富動態，精緻AI短影片！ComfyUI-AnimateDiff 動畫製作新手入門](https://www.youtube.com/watch?v=F3DluiHzuMY&list=PLK7sA3zrSa4s0tO8w2pdc7zPTcIAgS7ru&index=10)

- [動畫概述：Clip Studio Paint 中的動畫基礎知識](https://tips.clip-studio.com/zh-tw/articles/7690)
