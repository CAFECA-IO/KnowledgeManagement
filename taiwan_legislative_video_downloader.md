### 鄉民玩 AI: EP1 立法院十大好球 (2/6)

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

## 建立 Flask 應用

接著，我們建立一個 Flask 應用，用於提供 API 服務。我們將實作三個 API：

1. 查詢會議列表
2. 取得會議視頻詳情
3. 下載會議視頻

### 項目結構

```plaintext
TaiwanLegislativeVideoDownloader/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── routes.py
│   ├── scraper.py
│   ├── downloader.py
│   ├── utils.py
│
├── venv/
│
├── requirements.txt
│
├── run.py
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
from .downloader import download_video, get_video_source

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
    
    last_value = video_url.split('/')[-1]
    output_filename = os.path.join(os.getcwd(), f'downloaded_meeting_{last_value}.mp4')
    
    # 使用多線程下載視頻，防止阻塞
    download_thread = threading.Thread(target=download_video, args=(m3u8_url, output_filename))
    download_thread.start()
    download_thread.join()

    # 檢查文件是否存在以及大小
    if os.path.exists(output_filename):
        file_size = os.path.getsize(output_filename)
        print(f"下載的文件大小：{file_size} 字節")
        try:
            # 打印文件的絕對路徑以便調試
            abs_path = os.path.abspath(output_filename)
            print(f"文件的絕對路徑：{abs_path}")
            return send_file(abs_path, as_attachment=True)
        except FileNotFoundError:
            print(f"文件未找到：{abs_path}")
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

# 配置瀏覽器選項
options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('start-maximized')
options.add_argument('disable-infobars')
options.add_argument('--disable-extensions')

base_url = 'https://www.ly.gov.tw/Pages/MeetingList.aspx?nodeid=135'

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
        meeting['location'] = location_div.text.strip()

    heading_div = meeting_element.find('div', class_='heading')
    if heading_div:
        meeting['title'] = heading_div.get_text(separator=' ', strip=True)
        link_tag = heading_div.find('a')
        if link_tag:
            meeting['meeting_url'] = link_tag['href']
            meeting_id = re.search(r'Me

et=([0-9]+)', link_tag['href'])
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
        print(f"正在爬取 URL: {url}")
        driver.get(url)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        meeting_elements = soup.select('ul.list-group.newsType2 li')
        date = ''
        for meeting_element in meeting_elements:
            date_element = meeting_element.find('div', class_='date')
            if date_element:
                date = date_element.text.strip()
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
        print(f"正在爬取 URL: {paginated_url}")
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

將所有與下載視頻相關的代碼放在 `downloader.py` 文件中。

```python
# app/downloader.py

import subprocess
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('start-maximized')
options.add_argument('disable-infobars')
options.add_argument('--disable-extensions')

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
            print(f"視頻已成功下載至：{output_filename}")
            file_size = os.path.getsize(output_filename)
            print(f"下載的文件大小：{file_size} 字節")
        else:
            print(f"文件下載失敗：{output_filename} 不存在")
    except subprocess.CalledProcessError as e:
        print(f"錯誤：{e}")

def get_video_source(url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(url)
    time.sleep(10)
    filelink = driver.execute_script("return _filelink;")
    print("視頻源地址：", filelink)
    driver.quit()

    return filelink
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

通過將代碼模塊化並使用 `__init__.py` 文件來初始化和組織你的 Flask 應用，你可以更好地管理和維護你的項目。這樣做可以使代碼更具可讀性和可擴展性，並且方便以後的開發和調試。

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

### 啟動應用

最後，我們啟動 Flask 應用。

```sh
python run.py
```
