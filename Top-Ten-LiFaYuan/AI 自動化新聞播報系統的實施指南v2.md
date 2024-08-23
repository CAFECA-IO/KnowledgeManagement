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
│   ├── generate_anchor_animation.py
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
cd NewsGenerator
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
        "prompt": f"根據以下摘要生成新聞稿：「{summary}」，並用「哎呦呦，這件事情在我看來...」做總結"
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
from flux1_sdk import Flux1Client

def generate_storyboard_images(script):
    client = Flux1Client(api_key='Your-Flux1-API-Key')
    
    try:
        images = client.generate_images(prompt=script)
        # 假設返回的是圖片的路徑列表
        return images
    except Exception as e:
        print(f"生成分鏡稿圖片時出錯: {e}")
        return []
```

### `scripts/generate_anchor_image.py`

這個腳本負責生成主播圖片：

```python
from flux1_sdk import Flux1Client

def generate_anchor_image():
    client = Flux1Client(api_key='Your-Flux1-API-Key')
    
    try:
        anchor_image = client.generate_images(prompt="Generate an image of a news anchor")
        # 假設返回的是單個圖片的路徑
        return anchor_image[0]
    except Exception as e:
        print(f"生成主播圖片時出錯: {e}")
        return None
```

### `scripts/generate_animation.py`

這個腳本用於將分鏡稿圖片生成動畫：

```python
from animatediff_sdk import AnimatediffClient

def generate_animation_from_images(images):
    client = AnimatediffClient(api_key='Your-Animatediff-API-Key')
    animations = []
    
    try:
        for image in images:
            animation = client.generate_animation(image)
            animations.append(animation)
        return animations
    except Exception as e:
        print(f"生成動畫時出錯: {e}")
        return []
```

### `scripts/generate_anchor_animation.py`

這個腳本使用 Animatediff 來將主播圖片和語音結合生成動畫。

```python
from animatediff_sdk import AnimatediffClient

def generate_anchor_animation(anchor_image, voiceover):
    client = AnimatediffClient(api_key='Your-Animatediff-API-Key')
    
    try:
        anchor_animation = client.generate_animation_with_voice(image=anchor_image, voice=voiceover)
        return anchor_animation
    except Exception as e:
        print(f"生成主播動畫時出錯: {e}")
        return None
```

### `scripts/generate_voiceover.py`

這個腳本使用 CosyVoice 生成新聞播報的語音：

```python
from cosyvoice_sdk import CosyVoiceClient

def generate_voiceover(script):
    client = CosyVoiceClient(api_key='Your-CosyVoice-API-Key')
    
    try:
        voiceover = client.generate_voice(script)
        return voiceover
    except Exception as e:
        print(f"生成語音時出錯: {e}")
        return None
```

### `scripts/generate_background_music.py`

這個腳本使用 Suno 生成背景音樂：

```python
from suno_sdk import SunoClient

def generate_background_music(script):
    client = SunoClient(api_key='Your-Suno-API-Key')
    
    try:
        background_music = client.generate_music(script)
        return background_music
    except Exception as e:
        print(f"生成背景音樂時出錯: {e}")
        return None
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

summary = """
1. 使用者向總統和相關部門官員提出關於 Peer-to-Peer(P2 P) 監管問題的擔憂，尤其是在缺乏法律約束和自我監管下的非法活動
2. 官員承認在目前的法律框架下， 對於 P2p 平臺的 管理存在困難， 但強調正在研究各種選項， 包括成立行業協會和逐步實施分級管理。
3. 用戶表達了對政府在面對金融科技快速發展時， 是否具備明确的戰略和行動計劃的疑慮。
4. 金融監督管理委員會（FSC）表示， 他們正在努力平衡創新和風險管理， 同時呼籲企業遵守相關法律法規。
5. 會上還提及了房地產市場泡沫和銀行信貸比例過高的問題， 官方承諾將與中央 bank 協調， 採取相應措施防止金融危機。
6. 與會者同意進一步研究並追蹤相關議題， 以促進金融業的健康發展。
"""

def create_news_broadcast(summary):
    script = generate_news_script(summary)
    if not script:
        return

    storyboard_images = generate_storyboard_images(script)
    if not storyboard_images:
        return

    anchor_image = generate_anchor_image()
    if not anchor_image:
        return

    # 使用 generate_animation_from_images 來生成整個新聞播報的動畫，基於分鏡稿圖片生成動畫片段。
    animations = generate_animation_from_images(storyboard_images)
    if not animations:
        return

    voiceover = generate_voiceover(script)
    if not voiceover:
        return

    background_music = generate_background_music(script)
    if not background_music:
        return

    # 使用 generate_anchor_animation 來生成基於主播圖片和語音的動畫，這樣動畫的重點將是主播與新聞講稿的同步呈現。
    anchor_animation = generate_anchor_animation(anchor_image, voiceover)
    if not anchor_animation:
        return

    # 有兩種視頻片段可以進行合成 animations 和 anchor_animation 
    combine_media(anchor_animation, voiceover, background_music)

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
