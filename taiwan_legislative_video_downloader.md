# 鄉民玩 AI: EP1 立法院十大好球 (2/6)

本文將介紹如何使用 Python 從零開始建立一個爬蟲系統，實現從台灣立法院官網下載會議影片的功能。整個過程將涵蓋建立 Python 環境、建立 Python 專案、建立 Git 儲存庫、爬取會議列表、解析會議詳情以及下載會議影片的步驟。以下是完整的實作步驟和程式碼。

鄉民玩 AI 系列基於取之於鄉民，用之於鄉民的精神，全系列進行 [CC0](https://ti-wb.github.io/creativecommon-tw/cc0.html)「公眾領域貢獻宣告 」，歡迎所有讀者自由使用，也歡迎透過 GitHub 與我們一同協作，或是提交 Issues 給予我們建議。

## 環境配置

### 建立 Python 環境

首先，確保你已安裝 Python 3。如果還沒有安裝，你可以從 [Python 官網](https://www.python.org/)下載並安裝最新版本的 Python。

接著，使用以下命令來建立虛擬環境，以便管理你的 Python 套件：

```bash
python3 -m venv myenv
```

啟動虛擬環境：

```bash
source myenv/bin/activate  # MacOS/Linux
myenv\Scripts\activate     # Windows
```

### 建立 Python 專案

創建一個新的資料夾作為你的專案目錄，並進入該目錄：

```bash
mkdir my_crawler_project
cd my_crawler_project
```

### 建立 Git 儲存庫

初始化 Git 儲存庫，以便進行版本控制：

```bash
git init
```

### 安裝必要的套件

我們需要安裝一些必要的 Python 套件，包括 Flask、Selenium、BeautifulSoup 和 webdriver_manager。請在你的虛擬環境中安裝這些套件：

```bash
pip install flask selenium beautifulsoup4 webdriver-manager
```

###  確認並安裝 FFmpeg
選擇使用 `ffmpeg` 在台灣立法院官網下載會議影片是因為直接觀察視頻源地址，可以發現這是一個 HLS (HTTP Live Streaming) 格式的播放列表文件（m3u8）。使用 `ffmpeg` 可以有效地下載這種格式的視頻。

首先，在終端機中執行以下命令來檢查是否已安裝：

```bash
ffmpeg -version
```

如果這個命令返回了版本信息，這意味著 `ffmpeg` 已經安裝。如果沒有，則需要安裝它。根據使用者的操作系統，安裝方法會有所不同：

- **MacOS**：
  使用 Homebrew 安裝：
  ```bash
  brew install ffmpeg
  ```

- **Windows**：
  - 下載 FFmpeg 的壓縮包從 [FFmpeg 官網](https://ffmpeg.org/download.html)。
  - 解壓縮到一個目錄，例如 `C:\Program Files\ffmpeg`。
  - 將 `ffmpeg` 目錄下的 `bin` 目錄添加到你的系統環境變數 PATH 中。

- **Linux**：
  通常可以使用包管理器安裝，如在 Ubuntu 上：
  ```bash
  sudo apt update
  sudo apt install ffmpeg
  ```

#### 指定 FFmpeg 的完整路徑

如果 `ffmpeg` 已經安裝但不在你的系統路徑中，你可以在 Python 腳本中指定 `ffmpeg` 可執行文件的完整路徑。修改你的 Python 腳本中調用 `ffmpeg` 的部分，如下所示：

```python
ffmpeg_path = '/path/to/your/ffmpeg'  # 替換成你的 ffmpeg 安裝路徑
command = [
    ffmpeg_path,
    '-i', m3u8_url,
    '-c', 'copy',
    '-bsf:a', 'aac_adtstoasc',
    output_filename
]
```

確保將 `/path/to/your/ffmpeg` 替換為實際的路徑。

## 建立 Flask 應用

接著，我們建立一個 Flask 應用，用於提供 API 服務。我們將實作三個 API：

1. 查詢會議列表
2. 取得會議視頻詳情
3. 下載會議視頻

### 項目結構

```plaintext
SmartLegiCrawler/
│
├── app/
│   ├── __init__.py       # 初始化 Flask 應用
│   ├── routes.py         # 定義 API 路由
│   ├── scraper.py        # 網頁爬取邏輯
│   ├── downloader.py     # 視頻下載邏輯
│   ├── utils.py          # 工具函數
│
├── venv/                 # 虛擬環境
│
├── requirements.txt      # 專案依賴
│
├── run.py                # 啟動應用
├── readme.md             # 專案說明文件
├── downloads/            # 下載的視頻
│
└── .gitignore            # Git 忽略文件
```

### `__init__.py` 文件

在 `app/` 目錄下創建一個 `__init__.py` 文件。這個文件的作用是初始化 Flask 應用，並導入其他模塊。

```python
# app/__init__.py

from flask import Flask

# 初始化 Flask 應用
app = Flask(__name__)

# 導入其他模塊中的路由
from . import routes
```

### `routes.py` 文件

將所有 API 路由相關的代碼放在 `routes.py` 文件中。

```python
# app/routes.py

from flask import request, jsonify, send_file
import os
import threading
from . import app
from .scraper import scrape_meetings, scrape_video_links
from .downloader import download_video, get_video_source, get_output_filename

# 第一個 API：查詢會議視頻
@app.route('/api/meetings', methods=['GET'])
def get_meetings():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    page = request.args.get('page', default=1, type=int)
    q = request.args.get('q', None)
    committee = request.args.get('committee', None)
    limit = request.args.get('limit', default=100, type=int)

    meetings, has_more, current_page = scrape_meetings(start_date, end_date, page, q, committee, limit)

    response = {
        'total': len(meetings),
        'has_more': has_more,
        'current_page': current_page,
        'message': f'總數量超過 {limit}，請帶入當前頁面的下一頁接續查詢，每次最多查詢100筆，當前頁面為 {current_page}頁。' if has_more else '這是搜尋結果的最後一頁。',
        'meetings': meetings,
    }

    return app.response_class(
        response=json.dumps(response, ensure_ascii=False),
        mimetype='application/json'
    )

# 第二個 API：會議視頻詳情
@app.route('/api/meetings/<meeting_id>', methods=['GET'])
def get_meeting_videos(meeting_id):
    videos_source = scrape_video_links(meeting_id)

    response = {
        'details': videos_source,
    }

    return app.response_class(
        response=json.dumps(response, ensure_ascii=False),
        mimetype='application/json'
    )

# 第三個 API：下載視頻
@app.route('/api/download', methods=['POST'])
def download():
    video_url = request.json.get('url')
    
    # 獲取視頻源地址
    m3u8_url = get_video_source(video_url)
    if not m3u8_url:
        return jsonify({'error': '無法獲取視頻源地址'}), 400
    
    output_filename = get_output_filename(video_url)
    
    # 使用多線程下載視頻，防止阻塞
    download_thread = threading.Thread(target=download_video, args=(m3u8_url, output_filename))
    download_thread.start()
    download_thread.join()

    # 檢查文件是否存在以及大小
    if os.path.exists(output_filename):
        try:
            # 打印文件的絕對路徑以便調試
            abs_path = os.path.abspath(output_filename)
            return send_file(abs_path, as_attachment=True)
        except FileNotFoundError:
            return jsonify({'error': '文件未找到'}), 500
    else:
        return jsonify({'error': '下載失敗'}), 500
```

### `scraper.py` 文件

將所有與爬取會議相關的代碼放在 `scraper.py` 文件中。

```python
# app/scraper.py

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import re
from .utils import setup_logger

# 配置瀏覽器選項
options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('start-maximized')
options.add_argument('disable-infobars')
options.add_argument('--disable-extensions')

base_url = 'https://www.ly.gov.tw/Pages/MeetingList.aspx?nodeid=135'
logger = setup_logger('scraper', 'scraper.log')

def init_driver():
    """初始化瀏覽器驅動"""
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

def get_url(page=None, start_date=None, end_date=None, q=None, committee=None):
    """生成會議列表的URL"""
    url = base_url
    params = []

    if page is not None:
        params.append(f'idx={page - 1}')
    else:
        params.append(f'idx=0')
    if start_date:
        params.append(f'qsd={start_date}')
    if end_date:
        params.append(f'qed={end_date}')
    if q:
        params.append(f'q={q}')
    if committee:
        params.append(f'Committee={committee}')

    if params:
        url += '&' + '&'.join(params)

    return url

def parse_meeting_element(date, meeting_element):
    """解析單個會議元素，提取會議信息"""
    meeting = {'date': date}

    committee_div = meeting_element.find('div', class_='room', attrs={'data-name': True})
    if committee_div:
        meeting['committee'] = committee_div.text.strip()

    label_div = meeting_element.find('div', class_='label')
    if label_div:
        meeting['label'] = label_div.text.strip()

    time_div = meeting_element.find('div', class_='room', string=lambda text: '時間' in text)
    if time_div:
        meeting['time'] = time_div.text.strip()

    location_div = meeting_element.find('div', class_='label', string=lambda text: '地點' in text)
    if location_div:
        meeting['location

'] = location_div.text.strip()

    heading_div = meeting_element.find('div', class_='heading')
    if heading_div:
        meeting['title'] = heading_div.get_text(separator=' ', strip=True)
        link_tag = heading_div.find('a')
        if link_tag:
            meeting['meeting_url'] = link_tag['href']
            meeting_id = re.search(r'Meet=([0-9]+)', link_tag['href'])
            if meeting_id:
                meeting['meeting_id'] = meeting_id.group(1)

    con_data_div = meeting_element.find('div', class_='con_data')
    if con_data_div:
        description_div = con_data_div.find('div')
        if description_div:
            meeting['description'] = description_div.text.strip()

    return meeting

def scrape_meetings(start_date=None, end_date=None, page=None, q=None, committee=None, max_meetings=100):
    """爬取會議列表"""
    driver = init_driver()
    meetings = []
    current_page = page if page else 1

    while True:
        url = get_url(current_page, start_date, end_date, q, committee)
        logger.info(f"正在爬取 URL: {url}")
        driver.get(url)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        meeting_elements = soup.select('ul.list-group.newsType2 li')
        date = ''
        for meeting_element in meeting_elements:
            date_element = meeting_element.find('div', class_='date')
            if date_element:
                year = date_element.find('b').text.strip()
                date_hr = date_element.find('strong').text.strip()
                date = f"{year}/{date_hr}"
            meeting = parse_meeting_element(date, meeting_element)
            meetings.append(meeting)
            if len(meetings) >= max_meetings:
                break

        if len(meetings) >= max_meetings:
            break

        # 檢查是否還有更多頁面
        pagination = soup.select_one('ul.pagination')
        if not pagination:
            break
        pagination_items = pagination.find_all('li')
        if not pagination_items:
            break
        last_item = pagination_items[-1]
        if '»' in last_item.text.strip():
            current_page += 1
        else:
            try:
                last_page_num = int(last_item.text.strip())
                if current_page >= last_page_num:
                    break
                current_page += 1
            except ValueError:
                break

    driver.quit()
    return meetings, len(meetings) >= max_meetings, current_page

def parse_video_element(video_element):
    """解析單個視頻元素，提取視頻信息"""
    video_info = {}
    base_url = 'https://ivod.ly.gov.tw'
    
    committee_info = video_element.find('div', class_='clip-list-text')
    if committee_info:
        p_tags = committee_info.find_all('p')
        for p in p_tags:
            if '委員：' in p.get_text():
                video_info['member'] = p.get_text(strip=True).replace('委員：', '')
            if '委員發言時間：' in p.get_text():
                video_info['speech_time'] = p.get_text(strip=True).replace('委員發言時間：', '')
            if '影片長度：' in p.get_text():
                video_info['video_length'] = p.get_text(strip=True).replace('影片長度：', '')

    committee_video = video_element.find('div', class_='clip-list-thumbnail')
    if committee_video:
        video_info['video_links'] = {}
        links = committee_video.find_all('a')
        for link in links:
            video_info['video_links'][link['title']] = base_url + link['href']

    return video_info

def scrape_video_links(meeting_id):
    """爬取會議視頻鏈接"""
    base_url = 'https://ivod.ly.gov.tw'
    meeting_url = f'http://ivod.ly.gov.tw/Demand/Meetvod?Meet={meeting_id}'
    driver = init_driver()
    page = 1
    video_details = {
        'meeting_id': meeting_id,
        'meeting_time': '',
        'meeting_name': '',
        'video_links': []
    }
    
    while True:
        paginated_url = f"{meeting_url}&page={page}"
        logger.info(f"正在爬取 URL: {paginated_url}")
        driver.get(paginated_url)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        if page == 1:
            committee_data = soup.select_one('div.committee-data-info')
            if committee_data:
                committee_info = committee_data.find('div', class_='clip-list-text')
                if committee_info:
                    video_details['committee'] = committee_info.find('h5').get_text(strip=True)
                    video_details['meeting_time'] = committee_info.find('span', class_='time').text
                    video_details['meeting_name'] = committee_info.find('span', class_='metdec').text

                committee_video = committee_data.find('div', class_='clip-list-thumbnail')
                if committee_video:
                    video_info = {'type': 'full', 'video_links': {}}
                    for a in committee_video.find_all('a'):
                        video_info['video_links'][a['title']] = base_url + a['href']
                    video_details['video_links'].append(video_info)

        no_data_div = soup.find('div', class_='list-nodate')
        if no_data_div:
            break
        
        clip_list = soup.find('div', class_='clip-list')
        if clip_list:
            for ul in clip_list.find_all('ul'):
                video_info = parse_video_element(ul)
                video_info['type'] = 'clip'
                video_details['video_links'].append(video_info)

        page += 1

    driver.quit()
    return video_details
```

### `downloader.py` 文件
如何使用 Python 和 Selenium 從一個具有反爬蟲機制的網站上下載視頻。

#### 第一步：瞭解如何一般使用 Python 下載網頁上的視頻
通常情況下，可以使用 Python 的 `requests` 庫直接從網頁上的 `<video>` 標籤中獲得視頻源地址並下載視頻。然而，如果遇到具有動態加載技術或反爬蟲機制的網站，這種方法可能不適用。我們這裡要下載的立法院會議相關資訊的網站就有反爬蟲機制。

#### 第二步：使用 Selenium 獲取視頻源地址

因為一般方法無法直接獲取到視頻源，所以我們需要使用 `Selenium` 來模擬瀏覽器操作，從而繞過反爬蟲機制。Selenium 可以模擬真實用戶的行為，如點擊和滾動，以觸發 JavaScript 的執行並獲取動態加載的內容。

#### 第三步：處理 Blob URL 的問題

透過使用 Chrome 的開發者工具直接看我們要下載視頻 (https://ivod.ly.gov.tw/Play/Clip/300K/153887) 的html 結構發現，該視頻元素的源地址是一個 Blob URL ，要了解 blob URL 本身並不是視頻文件的直接來源，而是一個臨時的 URL，它指向在瀏覽器中存儲的一個對象。這意味著我們無法直接從 blob URL 下載視頻，而需要透過其他方法來獲取實際的視頻數據。這通常需要分析網頁上的 JavaScript 代碼或使用網路請求監聽工具來找到視頻的實際請求地址。

#### 第四步：獲取 HLS 格式的 m3u8 視頻源地址

一樣透過 Chrome 的開發者工具來分析視頻是如何被加載的，在`source` -> `ivod.ly.gov.tw` -> `script` -> `play.js`: 
```js
canAutoplay.video().then(function(o) {
        var cap = o.result === true;
        _player = new Clappr.Player({
          source: _filelink,
          parentId: '#fPlayer',
          width: _rtspW,
          height: _rtspH,
          autoPlay: cap,
          plugins: [
            PlaybackRatePlugin
          ],
          playbackRateConfig: {
            defaultValue: 1,
            options: [
                //{value: 0.25, label: '0.25x'},
                {value: 0.5, label: '0.5x'},
                {value: 0.75, label: '0.75x'},
                {value: 1, label: '1x'},
                //{value: 1.25, label: '1.25x'},
                {value: 1.5, label: '1.5x'},
                //{value: 1.75, label: '1.75x'},
                {value: 2, label: '2x'},
            ],
            // rateSuffix: 'x',
          },
        });

        settingPlayer();

      });
```
發現視頻播放器的源地址是通過 `_filelink` 變量設置的。如果我們想使用 Python 和 Selenium 捕獲實際的視頻源（_filelink 變量），我們需要進一步模擬瀏覽器操作以解析和取得視頻文件的 URL。可以使用 Selenium 執行 JavaScript 代碼來獲取這個變量的值：

```python
filelink = driver.execute_script("return _filelink;")
print("視頻源地址：", filelink)
```
視頻源地址： https://ivod-lyvod.cdn.hinet.net/vod_1/_definst_/mp4:300KClips/4f10fa8b3f7cd819a8acd1da281beef20fec08313b105ec06824d40b1933d675aa6d9d5be5f1c9245ea18f28b6918d91.mp4/playlist.m3u8


將所有與下載視頻相關的代碼放在 `downloader.py` 文件中。
```python
# app/downloader.py

import subprocess
import os
import logging
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
from .utils import setup_logger

options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('start-maximized')
options.add_argument('disable-infobars')
options.add_argument('--disable-extensions')

logger = setup_logger('downloader', 'downloader.log')

def get_output_filename(video_url):
    """取得輸出文件名"""
    last_value = video_url.split('/')[-1]
    downloads_dir = os.path.join(os.getcwd(), 'downloads')
    
    if not os.path.exists(downloads_dir):
        os.makedirs(downloads_dir)
    
    output_filename = os.path.join(downloads_dir, f'downloaded_meeting_{last_value}.mp4')
    return output_filename

def download_video(m3u8_url, output_filename):
    command = [
        'ffmpeg',
        '-i', m3u8_url,
        '-c', 'copy',
        '-bsf:a', 'aac_adtstoasc',
        output_filename
    ]
    
    try:
        subprocess.run(command, check=True)
        if os.path.exists(output_filename):
            logger.info(f"視頻已成功下載至：{output_filename}")
        else:
            logger.error(f"文件下載失敗：{output_filename} 不存在")
    except subprocess.CalledProcessError as e:
        logger.error(f"錯誤：{e}")

def get_video_source(url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(url)
    time.sleep(10)
    filelink = driver.execute_script("return _filelink;")
    logger.info(f"視頻源地址：{filelink}")
    driver.quit()

    return filelink
```

### `utils.py` 文件

在 `utils.py` 文件中定義工具函數，包括設置日誌紀錄器的功能。

```python
# app/utils.py

import logging

def setup_logger(name, log_file, level=logging.INFO):
    """
    配置日誌紀錄
    :param name: 日誌紀錄器的名稱
    :param log_file: 日誌文件路徑
    :param level: 日誌紀錄級別
    :return: 配置好的日誌紀錄器
    """
    handler = logging.FileHandler(log_file)
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)

    return logger
```

### `run.py` 文件

創建一個 `run.py` 文件來運行 Flask 應用。

```python
# run.py

from app import app

if __name__ == '__main__':
    app.run(debug=True)
```

### 更新 `requirements.txt`

確保你的 `requirements.txt` 文件包含項目所需的所有依賴包。你可以使用以下命令生成或更新 `requirements.txt`：

```sh
pip freeze > requirements.txt
```

### 總結

通過將代碼模塊化並使用 `__init__.py` 文件來初始化和組織你的 Flask 應用，你可以更好地管理和維護你的項目。這樣做可以使代碼更具可讀性和可擴展性

，並且方便以後的開發和調試。

### 完整的 `requirements.txt` 示例

```plaintext
attrs==23.2.0
beautifulsoup4==4.12.3
blinker==1.8.2
certifi==2024.6.2
charset-normalizer==3.3.2
click==8.1.7
Flask==3.0.3
h11==0.14.0
idna==3.7
itsdangerous==2.2.0
Jinja2==3.1.4
MarkupSafe==2.1.5
outcome==1.3.0.post0
packaging==24.1
PySocks==1.7.1
python-dotenv==1.0.1
requests==2.32.3
selenium==4.22.0
sniffio==1.3.1
sortedcontainers==2.4.0
soupsieve==2.5
trio==0.25.1
trio-websocket==0.11.1
typing_extensions==4.12.2
urllib3==2.2.2
webdriver-manager==4.0.1
websocket-client==1.8.0
Werkzeug==3.0.3
wsproto==1.2.0
```

## API 使用範例

1. 查詢會議列表
```sh
GET http://localhost:5000/api/meetings?start_date=2024/06/28&end_date=2024/07/01&limit=15
```

回傳範例：
```json
{
    "total": 10,
    "has_more": false,
    "current_page": 1,
    "message": "這是搜尋結果的最後一頁。",
    "meetings": [
        {
            "date": "2024/07/01",
            "time": "時間 : 07:30~18:00",
            "committee": "外交及國防委員會",
            "label": "召委 : 王定宇",
            "location": "地點 :",
            "title": "考察「國防部心理作戰大隊」 議事轉播IVOD網際網路多媒體隨選視訊系統(另開視窗) 公聽會",
            "meeting_url": "http://ivod.ly.gov.tw/Demand/Meetvod?Meet=00998826079593390403",
            "meeting_id": "00998826079593390403",
            "description": ""
        },
        ...
    ]
}
```

2. 取得會議視頻詳情
```sh
GET http://localhost:5000/api/meetings/00998826079593390403
```

回傳範例：
```json
{
    "details": {
        "meeting_id": "00509424695844495701",
        "meeting_time": "2024-06-28 09:00",
        "meeting_name": "第11屆第1會期第20次會議（事由：一、對行政院院長報告施政方針繼續質詢。\n二、6月28日上午9時至10時為國是論壇時間。\n三、7月2日下午1時50分至2時30分為處理臨時提案時間。）",
        "video_links": [
            {
                "type": "full",
                "video_links": {
                    "寬頻": "https://ivod.ly.gov.tw/Play/Full/1M/16048",
                    "窄頻": "https://ivod.ly.gov.tw/Play/Full/300K/16048"
                }
            },
            ...
        ],
        "committee": "第11屆第1會期　主辦單位：院會"
    }
}
```

## 啟動應用

最後，我們啟動 Flask 應用。

```sh
python run.py
```
