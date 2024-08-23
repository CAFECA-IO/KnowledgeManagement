# KM：AI 自動化新聞播報系統的實施指南

## 背景

本文件旨在記錄如何利用多種 AI 工具來構建一個自動化新聞播報系統，並詳細說明了各個步驟的實施方法。系統將基於從台灣立法院爬取的影片轉成逐字稿後生成的簡單摘要，來生成完整的新聞播報影片。這個文件將作為日後實施類似項目的參考指南。

## 環境設定

為了順利運行此系統，首先需要設定相關的開發環境，包括安裝所需的工具、庫和配置 API 金鑰。

1. **安裝 Python 和 pip**：
   - 確保你已經安裝了 Python 和 pip，可以通過命令行輸入以下指令來檢查是否已安裝：
     ```bash
     python --version
     pip --version
     ```

2. **安裝所需的 Python 包**：
   - 在專案目錄下，運行以下命令來安裝所需的 Python 庫：
     ```bash
     pip install requests
     ```
   - 如 Flux.1、Animatediff、CosyVoice 和 Suno有專門的 Python SDK，根據這些工具的官方文檔安裝相應的 SDK。例如：
     ```bash
     pip install flux1_sdk animatediff_sdk cosyvoice_sdk suno_sdk
     ```

3. **安裝 FFmpeg**：
   - 確保你的系統中已安裝了 FFmpeg，這是合成影片時所必需的工具。可以通過以下指令檢查是否已安裝：
     ```bash
     ffmpeg -version
     ```
   - 如果未安裝，請根據你的操作系統安裝 FFmpeg。例如，在 Ubuntu 上可以使用以下命令安裝：
     ```bash
     sudo apt-get install ffmpeg
     ```
   - 在 Windows 上，請從 [FFmpeg 官網](https://ffmpeg.org/download.html) 下載並安裝。

3. **配置 API 金鑰**：
   - 你需要從相關服務提供商那裡獲取 API 金鑰，並將它們配置在腳本中。這些金鑰需要設置為環境變數或直接寫入代碼中（如 `Your-Flux1-API-Key`）。

## 完整的自動化腳本

以下是完整的自動化腳本，將所有的步驟整合在一起，從新聞摘要生成到最終影片合成的全過程：

```python
import requests
import subprocess
import os

# 設定 API 金鑰
FLUX1_API_KEY = 'Your-Flux1-API-Key'
ANIMATEDIFF_API_KEY = 'Your-Animatediff-API-Key'
COSYVOICE_API_KEY = 'Your-CosyVoice-API-Key'
SUNO_API_KEY = 'Your-Suno-API-Key'

# 生成新聞講稿 (LLaMA)
def generate_news_script(summary):
    ai_url = 'http://211.22.118.146:11434/api/generate'
    request_data = {
        "model": "llama3.1",
        "prompt": f"根據以下摘要生成新聞稿：「{summary}」"
    }
    
    try:
        response = requests.post(ai_url, json=request_data, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"生成新聞稿時出錯: {e}")
        return None

# 生成分鏡稿和主播圖片 (Flux.1)
def generate_storyboard_images(script):
    # 假設這個函數用 flux1_sdk 生成分鏡稿
    # 示例代碼，實際需要依照 flux1_sdk 文檔實現
    images = []  # 模擬生成的圖片列表
    return images

def generate_anchor_image():
    # 假設這個函數用 flux1_sdk 生成主播圖片
    # 示例代碼，實際需要依照 flux1_sdk 文檔實現
    anchor_image = "path_to_anchor_image.png"
    return anchor_image

# 生成動畫 (Animatediff)
def generate_animation_from_images(images):
    animations = []
    # 假設這個函數用 animatediff_sdk 生成動畫
    # 示例代碼，實際需要依照 animatediff_sdk 文檔實現
    return animations

def generate_anchor_animation(anchor_image, voiceover):
    # 假設這個函數用 animatediff_sdk 生成主播動畫
    # 示例代碼，實際需要依照 animatediff_sdk 文檔實現
    anchor_animation = "path_to_anchor_animation.mp4"
    return anchor_animation

# 生成語音 (CosyVoice)
def generate_voiceover(script):
    # 假設這個函數用 cosyvoice_sdk 生成語音
    # 示例代碼，實際需要依照 cosyvoice_sdk 文檔實現
    voiceover = "path_to_voiceover.mp3"
    return voiceover

# 生成背景音樂 (Suno)
def generate_background_music(script):
    # 假設這個函數用 suno_sdk 生成背景音樂
    # 示例代碼，實際需要依照 suno_sdk 文檔實現
    background_music = "path_to_background_music.mp3"
    return background_music

# 使用 FFmpeg 合成影片
def combine_media(animation_file_path, voiceover_file_path, music_file_path):
    output_file_path = 'final_news_video.mp4'
    command = [
        'ffmpeg',
        '-i', animation_file_path,
        '-i', voiceover_file_path,
        '-i', music_file_path,
        '-c:v', 'copy',
        '-c:a', 'aac',
        output_file_path
    ]
    try:
        subprocess.run(command, check=True)
        print(f'新聞播報影片已生成：{output_file_path}')
    except subprocess.CalledProcessError as e:
        print(f'合成影片時出錯: {e}')

# 主流程
def create_news_broadcast(summary):
    script = generate_news_script(summary)
    if not script:
        return

    storyboard_images = generate_storyboard_images(script)
    anchor_image = generate_anchor_image()
    animations = generate_animation_from_images(storyboard_images)
    voiceover = generate_voiceover(script)
    background_music = generate_background_music(script)
    anchor_animation = generate_anchor_animation(anchor_image, voiceover)

    # 假設 animations 和 anchor_animation 是視頻片段，進行合成
    combine_media('path_to_animation.mp4', voiceover, background_music)

# 使用生成的逐字稿摘要來創建新聞播報
summary = "這是一個關於台灣立法院的簡單摘要..."
create_news_broadcast(summary)
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
