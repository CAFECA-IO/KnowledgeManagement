# KM：AI 自動化新聞播報系統的實施指南

## 背景

本KM記錄如何構建一個基於 AI 的自動化新聞播報系統，該系統將會議視頻轉換為逐字稿，並生成摘要和最終的新聞播報視頻與語音。系統通過四大模塊的組合來實現完整的流程，包括數據收集、逐字稿生成、內容摘要生成及最終的視頻與配音合成。每個模塊均已單獨驗證可行性。

## 系統架構概述

### 1. **Smart Legi Crawler - 數據收集模塊**

**目標**：該模塊負責從台灣立法院網站自動化爬取會議視頻和相關數據，並提供 API 查詢與下載功能。

**技術堆疊**：
- **Selenium** 和 **BeautifulSoup**：用於網頁自動化操作與解析。
- **Flask**：提供 API 查詢與下載功能。
- **FFmpeg**：用於處理視頻，特別是將會議視頻下載為本地文件。

#### **範例解釋**

- **Selenium 使用範例**：
  Selenium 自動化操作模擬用戶行為來打開立法院網站、進行翻頁，並爬取需要的數據。BeautifulSoup 負責解析頁面內容。

```python
from selenium import webdriver
from bs4 import BeautifulSoup

# 初始化瀏覽器
driver = webdriver.Chrome()

# 打開立法院網站
driver.get("https://www.ly.gov.tw/Pages/MeetingList.aspx?nodeid=135")

# 模擬點擊下一頁（如果需要翻頁）
next_button = driver.find_element_by_id('nextPageButton')
next_button.click()

# 獲取當前頁面的 HTML
page_content = driver.page_source

# 使用 BeautifulSoup 解析頁面內容
soup = BeautifulSoup(page_content, 'html.parser')

# 找到會議列表元素，提取會議的相關信息
meeting_elements = soup.select('ul.list-group.newsType2 li')
for meeting in meeting_elements:
    title = meeting.find('div', class_='heading').get_text(strip=True)
    print(f"會議標題: {title}")
```

這段範例展示了如何使用 Selenium 自動化操作台灣立法院網站來獲取會議的相關信息，並結合 BeautifulSoup 進行數據提取。

### 2. **Video Script - 逐字稿生成與優化模塊**

**目標**：該模塊負責將視頻音頻轉換為逐字稿，並通過 Llama3-TAIDE 模型進行優化，提升逐字稿的精確度和可讀性。

**技術堆疊**：
- **FFmpeg**：從視頻中提取音頻並進行音頻轉換和處理。
- **Pydub** 和 **Noisereduce**：進行音頻處理，例如降噪和歸一化。
- **Whisperx**：自動生成逐字稿，並標記說話者。
- **Llama3-TAIDE**：對逐字稿進行語義優化。

#### **範例解釋**

- **使用 FFmpeg 提取音頻**：
  從會議視頻中提取高質量的無損音頻，以便進行後續的音頻處理。

```bash
ffmpeg -i downloaded_meeting_154397.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 converted_meeting_154397.wav
```

- **Whisperx 轉錄範例**：
  使用 Whisperx 進行音頻轉錄，生成逐字稿並標記說話者。

```python
import whisperx
import torch

# 初始化模型
model = whisperx.load_model("base", device=torch.device("cuda" if torch.cuda.is_available() else "cpu"))

# 轉錄音頻並生成逐字稿
result = model.transcribe("converted_meeting_154397.wav")

# 將逐字稿結果保存到 JSON 文件中
with open("meeting_script_154397.json", "w") as f:
    json.dump(result, f, ensure_ascii=False, indent=4)
```

- **Llama3-TAIDE 逐字稿優化**：
  使用 Hugging Face 的 Llama3-TAIDE 模型對生成的逐字稿進行優化。

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# 初始化 Llama3-TAIDE 模型
tokenizer = AutoTokenizer.from_pretrained("taide/Llama3-TAIDE-LX-8B-Chat-Alpha1")
model = AutoModelForCausalLM.from_pretrained("taide/Llama3-TAIDE-LX-8B-Chat-Alpha1")

# 加載逐字稿文本
with open("meeting_script_154397.json", "r") as f:
    transcript = json.load(f)

# 語義優化處理
input_text = ' '.join([seg['text'] for seg in transcript['segments']])
inputs = tokenizer(input_text, return_tensors="pt")
outputs = model.generate(inputs['input_ids'], max_length=500)

# 優化後的文本
optimized_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
```

### 3. **Event Summarizer - 內容摘要生成模塊**

**目標**：基於優化後的逐字稿生成簡潔、邏輯清晰的會議摘要。

**技術堆疊**：
- **Llama3-TAIDE**：提取逐字稿中的關鍵內容，生成簡明扼要的會議摘要。

#### **範例解釋**

- **生成摘要範例**：
  使用 Llama3-TAIDE 模型生成會議摘要，控制摘要字數不超過 500 字。

```python
prompt = f"根據以下會議逐字稿生成摘要：{optimized_text}"
inputs = tokenizer(prompt, return_tensors="pt")
summary_outputs = model.generate(inputs['input_ids'], max_length=500)

# 生成的摘要
summary_text = tokenizer.decode(summary_outputs[0], skip_special_tokens=True)
print(f"摘要：{summary_text}")
```

### 4. **ComfyUI Workflow Generator - 影片與配音生成模塊**

**目標**：將生成的新聞稿轉換為動畫視頻，並生成新聞播報所需的配音。

**技術堆疊**：
- **ComfyUI**：使用 ComfyUI 生成動畫，通過 WebSocket 與 ComfyUI 服務端通信，生成對應的視頻片段。
- **CosyVoice**：生成配音，根據新聞稿生成自然語音。
- **FFmpeg**：用來合成最終的視頻和配音。

#### **為什麼選擇 ComfyUI？**

**ComfyUI 的優勢**：
1. **模塊化和工作流管理**：ComfyUI 將各種生成模塊（如 KSampler、BatchPromptSchedule 等）整合到一個工作流中，使得多步操作更加簡單清晰。開發者可以快速設計和調整工作流，而不必深入每個模塊的技術細節。
2. **可視化設計與簡單配置**：通過可視化的方式，開發者可以在界面上直觀地配置和調試不同模塊的參數，減少了手動撰寫代碼的負擔，並能更靈活地管理多個生成任務。
3. **內置多任務支持與異步處理**：ComfyUI 支持並行處理多個生成任務，並自動處理異步操作，這在處理視頻生成和多模塊組合時非常高效。
4. **靈活集成多種生成技術**：ComfyUI 支持將動畫生成、語音生成等不同技術整合到同一個工作流中，大大減少了數據轉換的複雜性。
5. **簡化數據流管理**：ComfyUI 能夠自動管理數據流，並將各步驟的輸出格式化，無需手動編寫轉換邏輯。

**與直接使用對應套件的比較**：
相比直接使用 `diffusers` 或 `torch` 等單獨的生成工具，ComfyUI 提供了一個更高層次的抽象，開發者不需要處理每個模塊的細節，而可以專注於設計工作流並生成結果。這減少了系統的複雜性，並提高了維護和擴展的靈活性。

#### **範例解釋**

-

 **ComfyUI 生成視頻的工作流與節點配置**：
  使用 ComfyUI API，基於指定的文本描述來生成動畫場景。以下是工作流中使用的關鍵節點：
  - **KSampler (Efficient)**：用於從文本生成動畫畫面。
  - **BatchPromptSchedule**：用來設定不同場景在不同時間點出現的描述。
  - **VHS_VideoCombine**：將生成的動畫合成為完整的視頻。

```python
video_description = {
    "0": "Anime girl closed eyes listening to music, seaside",
    "6": "Anime girl opens eyes and smiles, seaside",
    "9": "Anime girl starts dancing happily, seaside"
}

# 調用 ComfyUI API 生成視頻
video_file = comfyui_client.get_video(video_description)
```

- **CosyVoice 生成語音**：
  根據文本生成配音，並控制語速和語音模式（如中文女聲）。

```python
text = "2024年全球在多個領域發生了影響深遠的重大事件。"
vocal_file = comfyui_client.get_vocal(text, speed=1.5, inference_mode="預訓練音色", spf_spk="中文女")
```

- **FFmpeg 合成視頻與配音**：

```bash
ffmpeg -i generated_video.mp4 -i generated_vocal.wav -c:v copy -c:a aac final_news_vid ceo.mp4
```

---

## 總結
這篇KM紀錄了我如何通過 4 個核心模塊構建自動化新聞播報系統，並展示我具體使用的技術細節與實施步驟，同時解釋了為何 ComfyUI 是一個更靈活和高效的選擇。完整的code可以到 [Top-Ten-LiFaYuan](https://github.com/CAFECA-IO/Top-Ten-LiFaYuan/tree/develop)查看。
