# KM：AI 自動化新聞播報系統的實施指南

## 背景

本文件旨在記錄如何利用多種 AI 工具來構建一個自動化新聞播報系統，並詳細說明了各個步驟的實施方法。系統將基於從台灣立法院爬取的影片逐字稿和生成的簡單摘要，生成完整的新聞播報影片。這個文件將作為日後實施類似項目的參考指南。

## 環境設定

為了順利運行此系統，首先需要設定相關的開發環境，包括安裝所需的工具、庫和配置 API 金鑰。

1. **安裝 Node.js 和 npm**：
   - 確保你已經安裝了 Node.js 和 npm，可以通過命令行輸入以下指令來檢查是否已安裝：
     ```bash
     node -v
     npm -v
     ```

2. **安裝所需的 npm 包**：
   - 在專案目錄下，運行以下命令來安裝所需的 npm 包：
     ```bash
     npm install axios cheerio
     ```

3. **安裝 Python 和 pip**：
   - 確保你的系統上已經安裝了 Python 和 pip。檢查方法如下：
     ```bash
     python --version
     pip --version
     ```

4. **安裝所需的 Python 包**：
   - 使用 pip 安裝所需的 Python 包：
     ```bash
     pip install flux1_sdk animatediff_sdk cosyvoice_sdk suno_sdk
     ```

5. **配置 API 金鑰**：
   - 你需要從相關服務提供商那裡獲取 API 金鑰，並將它們配置在腳本中。通常，這些金鑰需要設置為環境變數或直接寫入代碼中（如 `Your-Flux1-API-Key`）。

## 完整的自動化腳本

以下是完整的自動化腳本，將所有的步驟整合在一起，從新聞摘要生成到最終影片合成的全過程：

```javascript
// Importing necessary libraries
const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Importing Python tools through child process or using respective SDKs
const { spawn } = require('child_process');

// Environment variables for API keys
const FLUX1_API_KEY = 'Your-Flux1-API-Key';
const ANIMATEDIFF_API_KEY = 'Your-Animatediff-API-Key';
const COSYVOICE_API_KEY = 'Your-CosyVoice-API-Key';
const SUNO_API_KEY = 'Your-Suno-API-Key';

// Helper function to execute Python scripts
function executePythonScript(script, args = []) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [script, ...args]);
        pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString());
        });
        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

// Generate news script using LLaMA
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

// Generate storyboard and anchor images using Flux.1
async function generateStoryboardImages(script) {
    // Assuming the Python script uses flux1_sdk to generate images
    return await executePythonScript('generate_storyboard_images.py', [script, FLUX1_API_KEY]);
}

async function generateAnchorImage() {
    // Assuming the Python script uses flux1_sdk to generate the anchor image
    return await executePythonScript('generate_anchor_image.py', [FLUX1_API_KEY]);
}

// Generate animations using Animatediff
async function generateAnimationFromImages(images) {
    // Assuming the Python script uses animatediff_sdk to generate animations
    return await executePythonScript('generate_animation.py', [images, ANIMATEDIFF_API_KEY]);
}

async function generateAnchorAnimation(anchorImage, voiceover) {
    // Assuming the Python script uses animatediff_sdk to generate animations with voice
    return await executePythonScript('generate_anchor_animation.py', [anchorImage, voiceover, ANIMATEDIFF_API_KEY]);
}

// Generate voiceover using CosyVoice
async function generateVoiceover(script) {
    // Assuming the Python script uses cosyvoice_sdk to generate voiceover
    return await executePythonScript('generate_voiceover.py', [script, COSYVOICE_API_KEY]);
}

// Generate background music using Suno
async function generateBackgroundMusic(script) {
    // Assuming the Python script uses suno_sdk to generate background music
    return await executePythonScript('generate_background_music.py', [script, SUNO_API_KEY]);
}

// Combine animations, voiceover, and music using FFmpeg
async function combineMedia(animationFilePath, voiceoverFilePath, musicFilePath) {
    const command = `ffmpeg -i ${animationFilePath} -i ${voiceoverFilePath} -i ${musicFilePath} -c:v copy -c:a aac final_news_video.mp4`;
    execSync(command);
    console.log('新聞播報影片已生成：final_news_video.mp4');
}

// Main function to orchestrate the entire process
async function createNewsBroadcast(summary) {
    const script = await generateNewsScript(summary);
    const storyboardImages = await generateStoryboardImages(script);
    const anchorImage = await generateAnchorImage();
    const animations = await generateAnimationFromImages(storyboardImages);
    const voiceover = await generateVoiceover(script);
    const backgroundMusic = await generateBackgroundMusic(script);
    const anchorAnimation = await generateAnchorAnimation(anchorImage, voiceover);

    // Combine all media elements into the final video
    await combineMedia('path_to_animation.mp4', 'path_to_voiceover.mp3', 'path_to_background_music.mp3');
}

// Example usage: Use the generated transcript summary to create a news broadcast
const summary = "這是一個關於台灣立法院的簡單摘要...";
createNewsBroadcast(summary);
```

## 整體流程

1. **準備新聞摘要**：根據爬取的逐字稿生成的摘要，作為後續步驟的基礎資料。
2. **生成新聞講稿**：使用 LLaMA 生成具體的新聞播報文本。
3. **生成分鏡稿和主播圖片**：使用 Flux.1 生成視覺元素，包括分鏡稿和主播圖片。
4. **生成動畫**：使用 Animatediff 將分鏡稿轉換為動畫，並結合語音生成主播動畫。
5. **合成語音**：使用 CosyVoice 將新聞講稿轉換為語音文件。
6. **生成配樂**：使用 Suno 生成背景配樂，為新聞播報增添氣氛。
7. **影片合成**：使用 FFmpeg 將所有生成的媒體內容合成完整的新聞播報影片。

#### 總結

這份 KM 文件詳述了如何實施一個基於 AI 的自動化新聞播報系統的各個步驟，並提供了完整的自動化腳本。通過使用 LLaMA、Flux.1、Animatediff、CosyVoice、Suno 和 FFmpeg 等工具，可以自動化生成高質量的新聞播報影片。
