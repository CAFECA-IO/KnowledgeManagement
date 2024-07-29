<div align=center>

![through-use-specific-algorithm-electronic-robot-with-brush-can-use-watercolors-paint-figures-paper-this-technology-enables-robot-produce-colorful-images (1)](https://github.com/user-attachments/assets/00551e1e-5c0c-48a5-85c1-3f4027f654d7)

</div>

# Ai Image Creator 人工智慧繪圖簡述

## 前言
在Ai技術發展逐漸成熟下，許多軟體透過Ai可以有更方便的流程或是新的應用，也因為NLP自然語言處理與機器學習技術比以往成熟，電腦能夠更理解人類的語言，並從中給出更貼近人們所需的解答，最好的例子就是ChatGPT，而Ai不光只是回答問題而已，除了檢索資料、回答問題之外，現在Ai功能還可以生成圖片、影片等，本篇文章將針對Ai繪圖功能進行簡述說明，包含介紹Ai技術是如何生成圖片、目前熱門的Ai繪圖工具，並從中選擇熱門的繪圖工具進行實際使用與產出。

接下來將會依據以下幾個主題進行敘述：
> 人工智慧是如何生成圖片。

> 目前有哪些熱門的Ai繪圖工具?

> Ai繪圖工具產出作品。

## 人工智慧是如何生成圖片?
人工智慧(Ai)生成圖片的過程主要依賴生成模型(Generative Models)的技術。這些模型能夠從數據中學習，並生成新的數據樣本。當Ai生成圖片時，最常使用的技術是生成對抗網路(GANs)。這是生成圖片的一種非常有效的方法，在生成圖片的過程中(使用生成對抗網絡)會有兩個主要的技術部分，生成對抗網路(GANs)中的生成器(Generator)會負責“創造”圖片。由生成器去接收一些隨機的數字，然後試圖把這些數字轉換成看起來像真實的圖片，可以想像生成器就是一個畫家，他要從一些模糊的想法中畫出一幅畫。判別器(Discriminator)是負責判斷圖片真假的部分。它會查看圖片，然後決定圖片是“真實的”還是“偽造的”，可以想像判別器是一個圖片評論家，專門挑錯生成器畫家畫的畫，並指出哪些地方不像真的。

生成對抗網路(GANs)在生成圖片的訓練過程中，生成器(畫家)和判別器(評論家)會互相競爭。生成器會不斷改進自己生成圖片的能力，以便“騙”過判別器；而判別器則不斷學習，以更好地去區分真實圖片和生成的圖片。隨著時間的推移，生成器會變得越來越擅長創造看起來像真的圖片，而判別器也變得越來越擅長區分真實與假圖片。在這個生成圖片的過程因為透過不斷的競爭和改進，最終會使生成器能夠創造出非常逼真的圖片，這也是現在許多Ai生成的圖片連人們都不知道是由Ai生成的。

#### 生成對抗網路模型圖(GANs)

<div align=center>

![image](https://github.com/user-attachments/assets/b4d714b4-28c2-405a-9db8-78611bdc355d)

</div>


除了生成對抗網路(GANs)可以生成圖片外，還有其他生成模型能夠生成圖片。以下為其他可以生成圖片的生成模型簡述說明：

### 變分自編碼器(VAEs)
變分自編碼器是一種生成模型，它可以通過學習數據的潛在分佈來生成新樣本。
#### 變分自編碼器(VAEs)生成圖片的主要原理：
- 編碼器(Encoder)：編碼器的作用是將輸入的圖片壓縮成一個潛在向量。這個潛在向量是一組數字，它們以壓縮的形式表示圖片的關鍵特徵。例如：想像你用一些關鍵詞來描述一幅畫。這些關鍵詞不是畫的全部內容，但它們能夠概括畫的主要特徵。這些關鍵詞就是潛在向量。
- 潛在空間(Latent Space)：這是一個虛擬的空間，圖片的潛在向量就位於這裡。VAEs 的特點之一是它不僅生成一個潛在向量，而是生成一個分佈，表示這個潛在向量可能是什麼樣的。例如：你給出了一個描述的範圍，而不是精確的描述，你可能會說畫中有“像玫瑰般的鮮紅色”，而不是精確地說出該紅色的色號。
- 解碼器(Decoder)：解碼器的作用是從潛在向量重建圖片。它將潛在向量轉換回圖像空間，生成與原始輸入圖片相似的圖片。解碼器就像是根據你給出的關鍵詞重新創作一幅畫。它不一定完全還原原畫，但會創作出風格和內容相似的作品。

#### 變分自編碼器(VAEs)訓練過程
在訓練過程中，VAEs 通過最小化重建損失（重建的圖片與原始圖片的差異）和正則化損失（使得潛在向量的分佈接近於高斯分佈）來學習。
- 重建損失：保證解碼器生成的圖片與原始圖片盡量相似。
- 正則化損失：保證潛在向量的分佈是連續且平滑的，這有助於生成多樣且連續的圖片。

### 自回歸模型
自回歸模型生成圖片的方式是透過逐步生成圖片的一部分，並且每一步都基於之前生成的內容。這樣的生成方式使得生成的圖片能夠保持一致性和連貫性。
#### 自回歸模型的優點
- 逐步生成：自回歸模型生成圖片時，不是一次性生成整個圖片，而是一次生成一個像素或一個區域。每生成一部分，模型會考慮之前生成的部分，然後根據這些信息來決定下一部分的內容。
- 考慮上下文：這些模型非常依賴上下文信息。也就是說，當它們在生成某個像素時，會參考之前已生成的像素。這樣做的好處是可以保證生成的圖片在細節上是一致的，並且能夠捕捉到圖片內部的複雜關係和結構。

#### 自回歸模型生成圖片的兩個主要部份：
- 像素CNN（PixelCNN）：這是一種自回歸模型，使用卷積神經網絡來依賴之前生成的像素。它能夠捕捉到圖片的局部依賴性，例如某個區域的顏色變化。
- 像素RNN（PixelRNN）：這是一種使用遞歸神經網絡的自回歸模型，它通常更適合捕捉長距離的依賴性，例如圖片中不同區域之間的相關性。

#### 舉例說明
想像你要畫一幅畫，而你只能一次畫一個點(像素)，你先畫了左上角的一個點，可能是黃色的。接下來，你畫這個點旁邊的點，你會考慮這個點是黃色的，所以你可能會選擇畫一個相似顏色的點來保持一致。
你繼續這樣畫，每次都考慮你之前畫的點的顏色和位置，直到畫出整幅畫。在這個過程中，自回歸模型就像一個非常有耐心的畫家，一步一步地仔細描繪每個細節，並且每次都考慮到之前的工作，以確保整體的和諧和一致。

> [!IMPORTANT]  
> 這些生成模型的技術都很依賴於深度學習模型，尤其是神經網路來進行訓練和生成。生成模型的能力在於能夠從大量的真實數據中學習並生成新的、逼真的數據樣本，這些樣本可以是圖像、音頻、文本等各種形式。

## 目前有哪些熱門的Ai繪圖工具?

### HitPaw FotorPea
HitPaw FotorPea(原名稱為HitPaw Photo AI)是一個照片編輯的軟體，由軟體公司HitPaw發行，可支援Windows與Mac的作業系統。HitPaw FotorPea可說是多合一的AI照片編輯工具，其網站有主推四大功能包括畫質修復、Ai繪圖、物件移除、圖片去背。AI圖片生成的功能流程十分簡單，使用者可以輸入提示詞，並從樣板選擇喜歡的風格，按下創作就可以等待HitPaw自動生成。或是也可以上傳照片，再輸入提示詞修飾。

##### HitPaw FotorPea 功能介面
<div align=center>

<img width="1187" alt="截圖 2024-07-29 中午12 09 45" src="https://github.com/user-attachments/assets/ce91ae93-8e15-4374-8c24-fbbeaaf6e96a">

</div>

##### HitPaw FotorPea 生成圖片選擇
<div align=center>

<img width="1188" alt="截圖 2024-07-29 下午1 07 36" src="https://github.com/user-attachments/assets/267871df-a479-465f-b89e-44df7f36ec44">

</div>

##### HitPaw FotorPea 自動生成
<div align=center>

<img width="1187" alt="截圖 2024-07-29 中午12 12 17" src="https://github.com/user-attachments/assets/bf3447b5-8670-47f3-8f57-0342bb2f59de">

</div>

### Midjourney
Midjourney是一個由位於舊金山獨立研究室所開發的Ai自動生成圖片服務，目前可支援 Windows、Mac、iOS與Android。因為Midjourney目前服務僅透過Discord提供，所以使用者必須先註冊Discord帳戶。使用者只需要在Discord聊天室中輸入你想要的圖片特徵自然語法指令，電腦就會自動依據文字來完成運算處理並且產生圖像。

### DALL-E
DALL-E是由OpenAI推出的線上AI圖像生成工具。當輸入文字詞後，DALL-E會根據輸入的文字自動繪圖出AI圖片。目前Open-AI已有推出更新的DALL-E 2與DALL-E 3的版本。

### DreamStudio
DreamStudio是由另一個深度學習文生圖模型 Stable Diffusion 所推出的Ai繪圖服務。使用者輸入製圖的文字提示到命令框內，選擇繪圖風格再點擊「Dream」，DreamStudio將自動完成所有工作。

##### DreamStudio 功能介面
<div align=center>
  
<img width="1673" alt="截圖 2024-07-29 下午1 30 14" src="https://github.com/user-attachments/assets/c7bfbd0e-e270-4fef-a324-c41345afa3d2">

</div>

### Fotor AI
Fotor文字轉圖片AI生成器使用生成模型來創建AI生成圖像。其生成模型包括GAN和VAE兩種。在Fotor的圖像AI生成器框中輸入圖像的關鍵詞，Fotor AI將自動完成所有工作。

##### Fotor AI 功能介面
<div align=center>
  
![image](https://github.com/user-attachments/assets/80304991-c9c5-4b6b-b12a-65a0d734a720)

</div>

## Ai繪圖工具產出作品

#### 使用HitPaw FotorPea生成的作品
輸入提示詞為：A futuristic city with towering glass buildings and glowing neon lights, where flying cars navigate through the sky.
<div align=center>

![image](https://github.com/user-attachments/assets/71b5a57a-b09b-40d6-9aa4-3d76cf8e0443)

</div>

#### 使用DreamStudio生成的作品
輸入提示詞為：Luxury sports car with aggressive lines, shot in a high contrast, high key lighting with shallow depth of field, detailed, sporty, sleek, studio lighting.

<div align=center>

![118884_Luxury sports car with aggressive lines, shot in a_xl-1024-v1-0](https://github.com/user-attachments/assets/e0d7dbfe-f8c8-4861-abb6-52e9617bff99)

</div>

#### 使用Fotor Ai生成的作品
輸入提示詞為：RAW phoro, a girl, light rays, lightgeo, elegant, highly detailed, digital painting,Sense of technology, melting skin, sacred geometry, surreal futurism.

<div align=center>

![fotor-ai-20240729134027](https://github.com/user-attachments/assets/d25dc798-49c4-4044-91c6-844d7593498d)

</div>

## 總結
Ai繪圖利用生成式Ai技術透過使用者輸入的繪圖文字指令及所選擇的繪圖風格，來產生與描述相符的Ai圖像作品。其帶來的除了便利性外，還多了訓練模型的繪圖可能性。但隨之而來的是關於Ai繪圖的爭議，在各地都有相關Ai繪圖的爭議事件報導，對於Ai繪圖最具爭議性的部分就是Ai繪圖的著作權歸屬問題，因Ai圖像生成工具本身的原始素材有些並非都是經過合法授權，但經過生成後的「作品」，竟然還可以被廣泛地應用在各種商業用途上，甚至有人會拿Ai繪圖的作品參賽，這讓許多「人類藝術家」非常憤怒甚至認為自己被侵權。

Ai繪圖版權方面的疑慮是目前在Ai創作過程中，最眾說紛紜且沒有結論的羅生門。因為一旦你對Ai繪圖工具下了指令後，這些資料來源都是從「人類創作者」或是其他未知的作品巨量搜集而來，在生成過程當中充滿了不確定性和隨機抽樣，我們身為「人類創作者」，透過Ai能帶給我們更多創意與更有效率的工作流程，Ai的優勢在於能夠短時間快速產出有效率的「創意」，節省工作時長。關鍵就在於如何定義「合理的使用Ai繪圖」，包括使用Ai繪圖的目的和性質，使用方式是否帶有商業性。目前有許多Ai繪圖平台是有明確說明不能商用的規範，部分藝文競賽也會在條文寫上關於Ai使用的規範，隨著Ai技術發展應用愈發成熟，在Ai技術應用的規範上也勢必需要有所調整。

## Reference
- [什麼是 GAN？](https://aws.amazon.com/tw/what-is/gan/)

- [Variational Autoencode](https://medium.com/data-science-navigator/variational-autoencoder-6ec2342e7ad4)

- [什麼是自動迴歸模型？](https://aws.amazon.com/tw/what-is/autoregressive-models/)

- [HitPaw FotorPea](https://www.hitpaw.tw/photo-ai.html)

- [Midjourney](https://www.midjourney.com/home)

- [dall-e-3](https://openai.com/index/dall-e-3/)

- [Fotor AI繪圖](https://www.fotor.com/tw/ai-image-generator/)
