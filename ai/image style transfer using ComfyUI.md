<div align=center>

![image](https://github.com/user-attachments/assets/afcfc831-5da7-40c2-a108-776d36529587)

</div>

# Image Style Transfer Using ComfyUI 使用ComfyUI進行圖片風格置換

## 前言
隨著人工智慧技術的快速發展，圖片風格置換逐漸成為許多設計師與藝術創作者的利器。透過風格置換，我們能將普通照片轉換為富有藝術風格的作品，例如油畫風格、漫畫風格或水彩畫等，為創作帶來更多變化。ComfyUI 之前曾介紹過是一款功能強大且簡單易用的AI工作流工具，不僅提供直觀的介面，而且也有模型是支持多樣化風格的置換與風格的參數調整。本文將介紹如何使用 ComfyUI 進行圖片風格置換，並展示置換後的效果。

指南將會從以下內容進行敘述與介紹：
> 使用 ComfyUI 進行圖片風格置換的步驟。

> 風格置換後的圖片產出。


## 使用 ComfyUI 進行圖片風格置換的步驟
### 準備素材與相關Modle資源
首先，在本次實作所使用的Workflow是將指定圖片轉換成宮崎駿動畫風格的工作流(可參考下圖)，所使用的工作流可以從下方的相關資源中獲取。並且整理出需要下載的相關Modle，在運行工作流時需要準備一張圖片進行風格置換，因為工作流會從LoRA模型中選擇宮崎駿風格的模型，所以不需要第二張圖片。有些風格置換的工作流是需要兩張圖片，一張為風格類型的圖片、另一張則為你想轉化的圖片。

<div align=center>

![image](https://github.com/user-attachments/assets/7bc0b704-e541-479b-a296-a8e326ac6ffa)

</div>

根據你的 ComfyUI 工作流範例，我來更詳細說明這個流程中每個步驟如何處理一張貓的圖片，並解釋各個部件是如何對該圖片進行不同階段的處理。以下的描述會以貓的圖片為例，從初始載入、風格控制、圖像生成到最終輸出進行解說。

---

### Checkpoint 和 LoRA 加載
**CheckpointLoaderSimple 節點**：此節點加載的是 dreamshaperXL_v21TurboDPMSDE.safetensors 模型。這個模型是主要的生成模型，負責提供風格置換的基礎架構。

**LoraLoader 節點**：此節點加載 StudioGhibli.Redmond-StdGBRRedmAF-StudioGhibli.safetensors，應用了特定的"吉卜力"動畫風格。LoraLoader 調整了模型的風格權重，讓後續生成的圖片更接近動畫化效果，例如色彩柔和、線條簡單等。

以實作案例做說明：當放入一張普通的貓的照片時，這些加載的模型會將貓的圖片數據傳遞給生成模型，並在內部進行圖像風格轉換。並且透過 LoRA 權重的調整，這些模型會將貓的照片改造成 吉卜力動畫風格，讓貓的毛髮變得更平滑、色彩變得更柔和，使得整體效果更加動畫化。

### 文字提示設置（Prompting)
在 "Prompt" 群組中，可以看到 Text _O 等文字的節點，依序為貓的類型（如 “British Shorthair”）、畫面描述（如 “looking at viewer, anime artwork, vibrant”）以及風格要求（如 “key visual, studio anime”）。

ConcatText_Zho節點則是用來將這些提示詞組合成一個完整的描述，用於控制貓的圖像如何被生成。

以實作案例做說明：透過這些文字提示，ComfyUI 會理解我們輸入的提示字，從提示中判斷生成一張英國短毛貓的圖片，並讓貓的視線朝向觀眾，同時風格具備動畫般的色彩鮮明和生動效果。這些文字描述也會影響後續生成的結果，例如使貓的眼神更加生動，並呈現出 吉卜力 動畫般的場景效果。

### ControlNet 應用
- "ControlNetLoader 節點" 加載了 `control-lora-sketch-rank256.safetensors`。本次實作所使用的 ControlNet 模型，此部分是用來控制圖像生成的結構和細節。
- "CannyEdgePreprocessor 節點" 是用來處理貓的圖片，提取出圖片的邊緣輪廓。
- "ControlNetApply 節點" 則是使用提取的輪廓來生成貓的整體輪廓形狀，並應用到輸出的結果中，從而保留了原始照片中的結構。

以實作案例做說明：假設貓的照片有明顯的輪廓，例如臉部的圓弧和耳朵尖角，ControlNet 模型會提取這些特徵，並保留這些結構細節。這樣，在進行風格置換時，貓的輪廓會被保留下來，生成的圖像仍然保持貓的面部形狀與姿態，不會因為風格轉換而模糊或失真。

### KSampler 設置
- "KSampler 節點" 是生成過程的核心部分。這裡設置了隨機種子、步驟數量、採樣方法等參數，用來控制生成圖片的品質、風格強度和細節表現。其中，「步驟數」會影響到生成的精細程度，「採樣方法」如 "dpmpp_2m_sde"則是影響圖片生成的風格特性和效果。

以實作案例做說明：當生成貓的圖片時，步驟數越高，貓的細節（如毛髮質感）會更加清晰。而本次實作所使用 "dpmpp_2m_sde" 採樣方式則可以讓生成效果更偏向動畫風格，使貓的外觀具有更柔和、平滑的色彩層次，更加符合 吉卜力動畫 的風格。

### VAE 編碼與解碼
- "VAEEncode 節點" 將原始貓的照片轉化為潛在空間格式（latent space），這是一種壓縮表示，方便後續的處理。
- "VAEDecode 節點" 則在完成風格置換後，將潛在空間的數據重新解碼成標準的圖片格式，方便輸出和觀看。

以實作案例做說明：貓的圖片經過 VAE 編碼後，已經包含了必要的顏色、形狀和風格資訊，並且以壓縮格式保留，便於生成處理。最終，在 VAEDecode 將壓縮數據還原為標準圖像，使得貓的形狀、顏色和風格特徵能夠具體顯現出來。

### 圖片預覽與輸出
- "PreviewImage 節點" 提供圖片預覽功能，讓使用者能夠在每個階段檢查生成的圖片效果。
- "Reroute 節點" 負責將最終圖片導出至 "PreviewImage" 或者可以進行檔案儲存。

以實作案例做說明：當生成一張英國短毛貓的動畫風格圖片後，你可以在 PreviewImage 查看生成效果，檢查是否符合預期，例如貓的表情、姿勢以及整體畫面的動畫感是否符合你的構想。通過 Reroute 節點，最終生成的圖片會進行處理，讓你可以儲存或進行進一步修改。

### 實作步驟總結
在這個流程中，每個節點都對貓的圖片進行特定的處理，以達成完整的風格置換效果：
- **模型與權重加載** : 決定了風格置換的風格基礎，例如動畫風格。
- **文字提示與 ControlNet 設置** : 確保了貓的結構和細節。
- **KSampler** 主要控制生成的品質，**VAE** 則進行圖片編碼解碼，使得最終結果具有更高的精細度和統一風格。

## 風格置換後的圖片產出
<div align=center>

![螢幕擷取畫面 2024-11-01 112702](https://github.com/user-attachments/assets/daaeb4e6-1b9c-4c38-b3f0-c5cc7e399ffb)

</div>

<div align=center>
![ComfyUI_temp_pvkvm_00020_](https://github.com/user-attachments/assets/58457554-e95a-442a-8a00-c13c1b97f58f)

![ComfyUI_temp_pvkvm_00053_](https://github.com/user-attachments/assets/4554c524-1fce-43d9-bc1c-dde131ec1ef8)

</div>

## 總結
透過ComfyUI我們能夠將一張普通的照片轉換成特定的藝術風格，整個流程包含了模型選擇、提示詞設置、ControlNet 輪廓生成和細緻的參數調整。ComfyUI不僅有開源的資料分享空間，在工作流中提供了靈活的自定義選項，讓使用者能夠生成符合個人需求的圖像效果。

ComfyUI 的多階段流程設計，尤其是 Checkpoint、LoRA 模型的運用，加上 ControlNet 的細節控制，能讓風格置換的結果在保留原始圖片結構，並且精確呈現了特定風格的特徵。無論是生成動畫風格的動物肖像，還是高度寫實的照片風格轉換，ComfyUI 都提供了充分的控制選項，適合不同需求的創作者。

雖然在初期設定參數可能需要嘗試與調整，但是當你熟悉ComfyUI工作流的整體流程，ComfyUI 能夠為創作者帶來高效且直觀的風格置換體驗。在後期未來，我們可以預見更多AI工具在個人創作、商業設計等領域中的應用潛力，特別是在快速生成高品質圖片的需求下，不只ComfyUI，還有更多AI能夠協助設計，AI將成為輔助使用者的創意工具。

## 相關資源
### Workflow
- [animal workflow](https://openart.ai/workflows/willling/animal-2-anime/NoE7zH8tJ4KlrXbFr6AG)

### Modle Download
- [stabilityai/control-lora](https://huggingface.co/stabilityai/control-lora/blob/main/control-LoRAs-rank256/control-lora-sketch-rank256.safetensors)
- [dreamshaperXL_v21TurboDPMSDE.safetensors](https://huggingface.co/gingerlollipopdx/ModelsXL/blob/main/dreamshaperXL_v21TurboDPMSDE.safetensors)
- [StudioGhibli.Redmond-StdGBRRedmAF-StudioGhibli.safetensors](https://huggingface.co/artificialguybr/StudioGhibli.Redmond-V2/blob/main/StudioGhibli.Redmond-StdGBRRedmAF-StudioGhibli.safetensors)
