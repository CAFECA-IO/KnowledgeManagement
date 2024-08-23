# KM：AI 自動化新聞播報系統的實施指南

## 背景

本文件旨在記錄如何利用多種 AI 工具來構建一個自動化新聞播報系統，並詳細說明了各個步驟的實施方法。系統將基於從台灣立法院爬取的影片轉成逐字稿後生成的簡單摘要，來生成完整的新聞播報影片。這個文件將作為日後實施類似項目的參考指南。

## 專案創建

```
NewsGenerator/
│
├── README.md
├── requirements.txt
├── .gitignore
├── config/
│   └── config.py
├── scripts/
│   ├── generate_news_script.py
│   ├── generate_storyboard_images.py
│   ├── generate_anchor_image.py
│   ├── generate_animation.py
│   ├── generate_voiceover.py
│   ├── generate_background_music.py
│   └── combine_media.py
├── main.py
└── data/
    ├── input/
    ├── output/
    └── temp/
```
- `README.md`：專案的介紹和使用說明。
- `requirements.txt`：列出專案所需的所有 Python 庫。
- `.gitignore`：定義需要忽略的文件或目錄（如虛擬環境、臨時文件等）。
- `config/`：存放專案的配置文件，如 API 金鑰、環境配置等。
- `scripts/`：包含所有主要功能的 Python 腳本，每個功能一個腳本。
- `main.py`：主程式，用於調用所有功能並執行完整的新聞播報生成流程。
- `data/`：用於存放生成過程中的輸入、輸出和臨時文件。

##環境配置

###創建虛擬環境

在專案根目錄下，創建並啟用虛擬環境，以確保依賴項不會與其他專案衝突。

```bash
cd ai_news_broadcast
python -m venv venv
source venv/bin/activate  # 在Windows上使用 `venv\Scripts\activate`
```

### 安裝所需的 Python 庫

在 `requirements.txt` 中列出所有需要的 Python 庫：

```
requests
flux1_sdk
animatediff_sdk
cosyvoice_sdk
suno_sdk
```

然後在虛擬環境中安裝它們：

```bash
pip install -r requirements.txt
```
### 安裝 FFmpeg：
確保你的系統中已安裝了 FFmpeg，這是合成影片時所必需的工具。可以通過以下指令檢查是否已安裝：
```bash
ffmpeg -version
```
如果未安裝，請根據你的操作系統安裝 FFmpeg。例如，在 Ubuntu 上可以使用以下命令安裝：
```bash
sudo apt-get install ffmpeg
```
在 Windows 上，請從 [FFmpeg 官網](https://ffmpeg.org/download.html) 下載並安裝。


### 配置文件

在 `config/config.py` 中存放 API 金鑰和其他配置信息：

```python
FLUX1_API_KEY = 'Your-Flux1-API-Key'
ANIMATEDIFF_API_KEY = 'Your-Animatediff-API-Key'
COSYVOICE_API_KEY = 'Your-CosyVoice-API-Key'
SUNO_API_KEY = 'Your-Suno-API-Key'
```

## 腳本詳細說明與檔案命名

### `scripts/generate_news_script.py`

這個腳本負責使用 LLaMA 生成新聞講稿：

```python
import requests

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
```

### `scripts/generate_storyboard_images.py`

這個腳本用於生成分鏡稿圖片：

```python
def generate_storyboard_images(script):
    # 假設這個函數用 flux1_sdk 生成分鏡稿
    images = []  # 模擬生成的圖片列表
    return images
```

### `scripts/generate_anchor_image.py`

這個腳本負責生成主播圖片：

```python
def generate_anchor_image():
    # 假設這個函數用 flux1_sdk 生成主播圖片
    anchor_image = "path_to_anchor_image.png"
    return anchor_image
```

### `scripts/generate_animation.py`

這個腳本用於將分鏡稿圖片生成動畫：

```python
def generate_animation_from_images(images):
    animations = []
    # 假設這個函數用 animatediff_sdk 生成動畫
    return animations
```

### `scripts/generate_voiceover.py`

這個腳本用於生成新聞播報的語音：

```python
def generate_voiceover(script):
    # 假設這個函數用 cosyvoice_sdk 生成語音
    voiceover = "path_to_voiceover.mp3"
    return voiceover
```

### `scripts/generate_background_music.py`

這個腳本用於生成背景音樂：

```python
def generate_background_music(script):
    # 假設這個函數用 suno_sdk 生成背景音樂
    background_music = "path_to_background_music.mp3"
    return background_music
```

### `scripts/combine_media.py`

這個腳本負責使用 FFmpeg 將所有媒體內容合成為完整的影片：

```python
import subprocess

def combine_media(animation_file_path, voiceover_file_path, music_file_path):
    output_file_path = 'data/output/final_news_video.mp4'
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
```

### `main.py`

`main.py` 是主程序，它將調用所有腳本來完成新聞播報的自動化生成：

```python
from scripts.generate_news_script import generate_news_script
from scripts.generate_storyboard_images import generate_storyboard_images
from scripts.generate_anchor_image import generate_anchor_image
from scripts.generate_animation import generate_animation_from_images
from scripts.generate_voiceover import generate_voiceover
from scripts.generate_background_music import generate_background_music
from scripts.combine_media import combine_media

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

# 示例使用：使用生成的逐字稿摘要來創建新聞播報
if __name__ == "__main__":
    summary = "這是一個關於台灣立法院的簡單摘要..."
    create_news_broadcast(summary)
```

## 最佳實踐與注意事項

- **版本控制**：使用 Git 來進行版本控制，確保每次變更都能夠被追蹤和回溯。
- **單元測試**：為每個腳本編寫單元測試，確保所有功能正常運行。
- **自動化部署**：考慮使用 CI/CD 工具（如 GitHub Actions）來自動化測試和部署過程。
- **文檔管理**：詳細記錄每個步驟的操作說明和技術細節，以便於團隊協作和日後維護。

## 總結

這份完整的 KM 文件描述了如何從零開始構建一個基於 Python 的 AI 自動化新聞播報系統。通過嚴謹的專案結構設計、詳細的環境配置指南、完善的腳本命名規範以及整體流程的統籌安排，這份指南可以幫助你有效地實施並維護該系統。未來的擴展和優化將基於此基礎，確保系統具備良好的可維護性和可擴展性。
