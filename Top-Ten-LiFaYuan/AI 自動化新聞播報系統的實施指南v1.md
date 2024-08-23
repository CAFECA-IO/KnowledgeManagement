# KM：AI 自動化新聞播報系統的實施指南

## 背景

本文件旨在記錄如何利用多種 AI 工具來構建一個自動化新聞播報系統，並詳細說明了各個步驟的實施方法。系統將基於從台灣立法院爬取的影片逐字稿和生成的簡單摘要，生成完整的新聞播報影片。這個文件將作為日後實施類似項目的參考指南。

## 目標

- 記錄使用 LLaMA 生成新聞播報講稿的步驟和方法。
- 整理 Flux.1 在生成分鏡稿圖片和主播圖片中的操作流程。
- 記錄 Animatediff 用於將圖片轉換為動畫及生成主播動畫的步驟。
- 整理 CosyVoice 生成新聞播報語音的實施方法。
- 記錄 Suno 用於生成新聞播報背景配樂的步驟。
- 紀錄使用 FFmpeg 合成完整新聞播報影片的流程。

## 工具與技術操作指南

1. **新聞講稿生成：LLaMA**

   **操作指南**：
   使用 LLaMA 模型生成新聞播報的講稿。具體步驟如下：
   - 準備好新聞摘要，作為 LLaMA 模型的輸入。
   - 調用 LLaMA API，生成符合新聞播報格式的講稿文本。
   - 保存並檢查生成的講稿，確保內容連貫且準確。

   **範例代碼**：
   ```javascript
   async function generateNewsScript(summary) {
       const aiUrl = 'http://211.22.118.146:11434/api/generate';
       const requestData = {
           model: "llama3.1",
           prompt: `根據以下摘要生成新聞稿：「${summary}」`,
       };

       try {
           const response = await axios.post(aiUrl, requestData, {
               headers: {
                   'Content-Type': 'application/json'
               }
           });
           return response.data;
       } catch (error) {
           console.error('生成新聞稿時出錯:', error);
       }
   }
   ```

2. **分鏡稿和主播圖片生成：Flux.1**

   **操作指南**：
   使用 Flux.1 生成新聞播報所需的分鏡稿圖片和主播圖片。
   - 將新聞講稿分段，為每一段描述合適的視覺元素。
   - 調用 Flux.1 API，生成對應的分鏡稿圖片和主播圖片。
   - 保存生成的圖片，準備進一步處理。

   **範例代碼**：
   ```javascript
   from flux1_sdk import Flux1Client

   client = Flux1Client(api_key='Your-Flux1-API-Key')

   async function generateStoryboardImages(script) {
       const images = await client.generate_images(prompt=script);
       return images;
   }

   async function generateAnchorImage() {
       const anchorImage = await client.generate_images(prompt="Generate an image of a news anchor");
       return anchorImage;
   }
   ```

3. **動畫生成：Animatediff**

   **操作指南**：
   使用 Animatediff 將生成的分鏡稿圖片轉換為動畫，並結合主播圖片和語音生成主播動畫。
   - 使用 Animatediff 將分鏡稿圖片轉換為動畫片段。
   - 結合主播圖片和語音生成同步的主播動畫。
   - 保存生成的動畫片段，準備合成。

   **範例代碼**：
   ```javascript
   from animatediff_sdk import AnimatediffClient

   animatediff_client = AnimatediffClient(api_key='Your-Animatediff-API-Key')

   async function generateAnimationFromImages(images) {
       const animations = [];
       for (const image of images) {
           const animation = await animatediff_client.generate_animation(image);
           animations.push(animation);
       }
       return animations;
   }

   async function generateAnchorAnimation(anchorImage, voiceover) {
       const anchorAnimation = await animatediff_client.generate_animation_with_voice(image=anchorImage, voice=voiceover);
       return anchorAnimation;
   }
   ```

4. **語音合成：CosyVoice**

   **操作指南**：
   使用 CosyVoice 生成新聞播報語音。
   - 調用 CosyVoice API，將新聞講稿轉換為語音文件。
   - 確保語音的質量和語調適合新聞播報的風格。
   - 保存語音文件，準備合成。

   **範例代碼**：
   ```javascript
   from cosyvoice_sdk import CosyVoiceClient

   cosyvoice_client = CosyVoiceClient(api_key='Your-CosyVoice-API-Key')

   async function generateVoiceover(script) {
       const voiceover = await cosyvoice_client.generate_voice(script);
       return voiceover;
   }
   ```

5. **配樂生成：Suno**

   **操作指南**：
   使用 Suno 生成新聞播報的背景配樂。
   - 調用 Suno API，根據新聞內容生成合適的背景音樂。
   - 檢查音樂與播報內容的匹配度，必要時進行調整。
   - 保存生成的音樂文件，準備合成。

   **範例代碼**：
   ```javascript
   from suno_sdk import SunoClient

   suno_client = SunoClient(api_key='Your-Suno-API-Key')

   async function generateBackgroundMusic(script) {
       const music = await suno_client.generate_music(script);
       return music;
   }
   ```

6. **影片合成：FFmpeg**

   **操作指南**：
   使用 FFmpeg 將所有生成的媒體內容合成完整的新聞播報影片。
   - 將動畫、語音和背景音樂文件放置於相同目錄下。
   - 使用 FFmpeg 命令行工具進行合成，確保不同媒體元素同步並且格式正確。
   - 檢查最終生成的影片，確保其質量符合預期。

   **範例命令**：
   ```bash
   ffmpeg -i animation.mp4 -i voiceover.mp3 -i background_music.mp3 -c:v copy -c:a aac final_news_video.mp4
   ```

## 整體流程

1. **準備新聞摘要**：根據爬取的逐字稿生成的摘要，作為後續步驟的基礎資料。
2. **生成新聞講稿**：使用 LLaMA 生成具體的新聞播報文本。
3. **生成分鏡稿和主播圖片**：使用 Flux.1 生成視覺元素，包括分鏡稿和主播圖片。
4. **生成動畫**：使用 Animatediff 將分鏡稿轉換為動畫，並結合語音生成主播動畫。
5. **合成語音**：使用 CosyVoice 將新聞講稿轉換為語音文件。
6. **生成配樂**：使用 Suno 生成背景配樂，為新聞播報增添氣氛。
7. **影片合成**：使用 FFmpeg 將所有生成的媒體內容合成完整的新聞播報影片。

## 總結

通過以上記錄，這份 KM 文件詳述了如何實施一個基於 AI 的自動化新聞播報系統的各個步驟。這些步驟涵蓋了從文本生成、圖片和動畫生成、語音合成到影片合成的完整流程，並提供了實用的範例代碼。這份文件可用於日後實施類似項目時作為參考和指導，確保流程的順利進行和項目的成功實施。
