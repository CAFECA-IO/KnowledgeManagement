# （未完成，範例還有錯誤）如何使用 Python 從零開始建立一個爬蟲系統，從而可以從台灣立法院官網下載任一會議影片

本文將介紹如何使用 Python 從零開始建立一個爬蟲系統，實現從台灣立法院官網下載會議影片的功能。整個過程將涵蓋建立 Python 環境、建立 Python 專案、建立 Git 儲存庫、爬取會議列表、解析會議詳情以及下載會議影片的步驟。以下是完整的實作步驟和程式碼。

## 環境配置

### 建立 Python 環境

首先，確保您已安裝 Python 3。如果還沒有安裝，您可以從 [Python 官網](https://www.python.org/)下載並安裝最新版本的 Python。

接著，使用以下命令來建立虛擬環境，以便管理您的 Python 套件：

```bash
python3 -m venv myenv
```

啟動虛擬環境：

```bash
source myenv/bin/activate  # MacOS/Linux
myenv\Scripts\activate     # Windows
```

### 建立 Python 專案

創建一個新的資料夾作為您的專案目錄，並進入該目錄：

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

我們需要安裝一些必要的 Python 套件，包括 Flask、Selenium、BeautifulSoup 和 webdriver_manager。請在您的虛擬環境中安裝這些套件：

```bash
pip install flask selenium beautifulsoup4 webdriver-manager
```

## 建立 Flask 應用

接著，我們建立一個 Flask 應用，用於提供 API 服務。我們將實作三個 API：

1. 查詢會議列表
2. 取得會議視頻詳情
3. 下載會議視頻

```python
from flask import Flask, request, jsonify, send_file
import os
import time
import subprocess
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import threading
import json
import re

app = Flask(__name__)
```

### 配置瀏覽器選項

我們使用 Selenium 來控制瀏覽器，並使用 Chrome 瀏覽器的 headless 模式來進行爬蟲。

```python
options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('start-maximized')
options.add_argument('disable-infobars')
options.add_argument('--disable-extensions')
```

### 爬取會議列表

我們首先實作爬取會議列表的功能，並解析會議的基本資訊。

```python
base_url = 'https://www.ly.gov.tw/Pages/MeetingList.aspx?nodeid=135'

def parse_meeting_element(meeting_element):
    meeting = {}
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
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    def get_url(page=None):
        url = base_url
        params = []

        if page is not None:
            params.append(f'idx={page}')
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
    
    meetings = []
    page = 0

    while True:
        url = get_url(page)
        print(url)
        driver.get(url)

        soup = BeautifulSoup(driver.page_source, 'html.parser')

        meeting_elements = soup.select('ul.list-group.newsType2 li')
        for meeting_element in meeting_elements:
            meeting = parse_meeting_element(meeting_element)
            meetings.append(meeting)
            if len(meetings) >= max_meetings:
                break

        if len(meetings) >= max_meetings:
            break

        pagination_items = soup.select('ul.pagination li')
        if len(pagination_items) == 0:
            break
        last_item = pagination_items[-1]
        if '»' in last_item.text.strip():
            page += 1
        else:
            try:
                last_page_num = int(last_item.text.strip())
                if page >= last_page_num:
                    break
                page += 1
            except ValueError:
                break

    driver.quit()

    return meetings, len(meetings) >= max_meetings, page
```

### 查詢會議 API

我們實作第一個 API，用於查詢會議列表。

```python
@app.route('/api/meetings', methods=['GET'])
def get_meetings():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    page = int(request.args.get('page', 1))
    q = request.args.get('q', None)
    committee = request.args.get('committee', None)

    meetings, has_more, current_page = scrape_meetings(start_date, end_date, page, q, committee)

    response = {
        'total': len(meetings),
        'has_more': has_more,
        'current_page': current_page,
        'meetings': meetings,
    }

    if has_more:
        response['message'] = '總數量超過 100，請帶入最新查到的頁面再查100筆。'

    return app.response_class(
        response=json.dumps(response, ensure_ascii=False),
        mimetype='application/json'
    )
```

#### 範例

取得 meetings：

```bash
curl http://127.0.0.1:5000/api/meetings
```

範例結果：

```json
{
    "total": 10,
    "has_more": false,
    "current_page": 0,
    "meetings": [
        {
            "committee": "院會",
            "label": "地點 : 議場",
            "time": "時間 : 09:00~18:00",
            "location": "地點 : 議場",
            "title": "第11屆第1會期第20次會議 議事轉播IVOD網際網路多媒體隨選視訊系統(另開視窗)",
            "meeting_url": "http://ivod.ly.gov.tw/Demand/Meetvod?Meet=00509424695844495701",
            "meeting_id": "00509424695844495701",
            "description": "一、對行政院院長報告施政方針繼續質詢。\n二、6月28日上午9時至10時為國是論壇時間。\n三、7月2日下午1時50分至2時30分為處理臨時提案時間。"
        },
        {
            "committee": "朝野黨團協商(內政委員會)",
            "label": "召委 : 吳琪銘",
            "time": "時間 : 09:10~10:40",
            "location": "地點 : 紅樓302會議室",
            "title": "立法院朝野黨團協商通知 議事轉播IVOD網際網路多媒體隨選視訊系統(另開視窗)",
            "meeting

_url": "http://ivod.ly.gov.tw/Demand/Meetvod?Meet=00415253294285367115",
            "meeting_id": "00415253294285367115",
            "description": "一、本院內政委員會報告併案審查行政院函請審議、台灣民眾黨黨團及委員陳亭妃等16人分別擬具「詐欺犯罪危害防制條例草案」案\n二、委員何欣純等21人擬具「詐欺犯罪危害防制條例草案」。"
        }
    ]
}
```

### 爬取會議視頻詳情

接著，我們實作爬取會議視頻詳情的功能，包括取得會議視頻的不同片段及其鏈接。

```python
def scrape_video_links(meeting_id):
    base_url = 'https://ivod.ly.gov.tw'
    meeting_url = f'http://ivod.ly.gov.tw/Demand/Meetvod?Meet={meeting_id}'
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    page = 1
    video_details = {}
    video_details['meeting_id'] = meeting_id
    video_details['meeting_time'] = ''
    video_details['meeting_name'] = ''
    video_details['video_links'] = []
    
    while True:
        paginated_url = f"{meeting_url}&page={page}"
        print('paginated_url', paginated_url)
        driver.get(paginated_url)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        if(page == 1):
            committee_data = soup.select_one('div', class_='committee-data-info')
            committee_info = committee_data.find('div', class_='clip-list-text')
            video_details['committee'] = committee_info.find('h5').get_text(strip=True)
            video_details['meeting_time'] = committee_info.find('span', class_='time').text
            video_details['meeting_name'] = committee_info.find('span', class_='metdec').text

            committee_video = committee_data.find('div', class_='clip-list-thumbnail')
            video_info = {}
            video_info['type'] = 'full'
            video_info['video_links'] = {}
            for a in committee_video.find_all('a'):
                video_info['video_links'][a['title']] = base_url + a['href']
            print('video_info', video_info)
            video_details['video_links'].append(video_info)
        page += 1
        
        no_data_div = soup.find('div', class_='list-nodate')
        if no_data_div:
            break
        
        clip_list = soup.find('div', class_='clip-list')
        if clip_list:
            for ul in clip_list.find_all('ul'):
                video_info = {}
                video_info['type'] = 'clip'
                
                committee_info = ul.find('div', class_='clip-list-text')
                if committee_info:
                    p_tags = committee_info.find_all('p')
                    for p in p_tags:
                        if '委員：' in p.get_text():
                            video_info['member'] = p.get_text(strip=True).replace('委員：', '')
                        if '委員發言時間：' in p.get_text():
                            video_info['speech_time'] = p.get_text(strip=True).replace('委員發言時間：', '')
                        if '影片長度：' in p.get_text():
                            video_info['video_length'] = p.get_text(strip=True).replace('影片長度：', '')
                
                committee_video = ul.find('div', class_='clip-list-thumbnail')
                if committee_video:
                    links = committee_video.find_all('a')
                    video_info['video_links'] = {}
                    for link in links:
                        video_info['video_links'][link['title']] = base_url + link['href']

                video_details['video_links'].append(video_info)

    driver.quit()
    
    return video_details
```

### 會議視頻詳情 API

我們實作第二個 API，用於取得會議視頻的詳情。

```python
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
```

#### 範例

取得 meeting details：

```bash
curl http://127.0.0.1:5000/api/meetings/00509424695844495701
```

範例結果：

```json
{
    "details": {
        "meeting_id": "00509424695844495701",
        "meeting_time": "2024-06-28 09:00",
        "meeting_name": "第11屆第1會期第20次會議",
        "video_links": [
            {
                "type": "full",
                "video_links": {
                    "寬頻": "https://ivod.ly.gov.tw/Play/Full/1M/16048",
                    "窄頻": "https://ivod.ly.gov.tw/Play/Full/300K/16048"
                }
            },
            {
                "type": "clip",
                "video_links": {
                    "寬頻": "https://ivod.ly.gov.tw/Play/Clip/1M/154397",
                    "窄頻": "https://ivod.ly.gov.tw/Play/Clip/300K/154397"
                },
                "member": "黃國昌",
                "speech_time": "16:12:38 - 16:29:32",
                "video_length": "00:16:54"
            }
        ],
        "committee": "第11屆第1會期　主辦單位：院會"
    }
}
```

### 下載會議視頻

最後，我們實作下載會議視頻的功能，包括取得視頻源地址和下載視頻。

```python
def download_meeting(m3u8_url, output_filename):
    command = [
        'ffmpeg',
        '-i', m3u8_url,
        '-c', 'copy',
        '-bsf:a', 'aac_adtstoasc',
        output_filename
    ]
    
    try:
        subprocess.run(command, check=True)
        print(f"視頻已成功下載至：{output_filename}")
    except subprocess.CalledProcessError as e:
        print(f"錯誤：{e}")

def get_video_source(url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(url)
    time.sleep(10)
    filelink = driver.execute_script("return _filelink;")
    driver.quit()

    return filelink
```

### 下載視頻 API

我們實作第三個 API，用於下載會議視頻。

```python
@app.route('/api/download', methods=['POST'])
def download():
    video_url = request.json.get('url')
    
    m3u8_url = get_video_source(video_url)
    if not m3u8_url:
        return jsonify({'error': '無法獲取視頻源地址'}), 400
    
    last_value = video_url.split('/')[-1]
    output_filename = f'downloaded_meeting_{last_value}.mp4'
    
    download_thread = threading.Thread(target=download_meeting, args=(m3u8_url, output_filename))
    download_thread.start()
    download_thread.join()

    if os.path.exists(output_filename):
        return send_file(output_filename, as_attachment=True)
    else:
        return jsonify({'error': '下載失敗'}), 500
```

#### 範例

下載視頻：

```bash
curl -X POST http://127.0.0.1:5000/api/download -H "Content-Type: application/json" -d '{"url": "https://ivod.ly.gov.tw/Play/Full/300K/16048"}'
```

## 啟動應用

最後，我們啟動 Flask 應用。

```python
if __name__ == '__main__':
    app.run(debug=True)
```

以上就是如何使用 Python 從零開始建立一個爬蟲系統，從台灣立法院官網下載會議影片的完整步驟。
