# 使用 FastAPI 構建 Surya OCR 服務

本指南中，我們將學習如何使用FastAPI構建 OCR（光學字符識別）服務。我們將涵蓋以下術語和概念：

- FastAPI: FastAPI 是一個現代化、高速（高性能）的網路框架，用於使用 Python 3.8+ 建立 API，基於標準 Python 型別提示。
- pytesseract: pytesseract 是一個 Python 庫，用於與 Tesseract OCR 引擎進行交互。

## 先決條件

在我們開始之前，請確保您已經滿足以下先決條件：

- Python 3.9 或更高版本安裝於您的系統上。
- 安裝 Google Tesseract OCR（附加的安裝資訊適用於 Linux、Mac OSX 和 Windows）。你必須能夠執行 tesseract 命令。如果不是這種情況，例如因為 tesseract 不在你的 PATH 中，你需要更改 pytesseract.pytesseract.tesseract_cmd 變數。
在 Debian/Ubuntu 上，你可以使用 tesseract-ocr 軟件包。
Mac OS 用戶請安裝 Homebrew 軟件包 tesseract。
- 強烈建議為您的項目設置虛擬環境。您可以使用以下命令創建虛擬環境，我們將虛擬環境命名為 `v3.12`，例如使用 Python 3.12：

    ```bash
    python -m venv v3.12
    ```

- 啟動虛擬環境：
  
      - 在 Windows 上：
        
        ```bash
        venv\Scripts\activate
        ```
      
      - 在 macOS 和 Linux 上：
        
        ```bash
        d
        ```

- FastAPI 和其依賴項目安裝。您可以使用 pip 安裝 FastAPI：

    ```bash
    pip install fastapi
    ```

- Uvicorn，ASGI 服務器，用於生產環境，安裝。您可以使用 pip 安裝 Uvicorn：

    ```bash
    pip install uvicorn
    ```

- Pytorch。您可以使用 pip 安裝它。見 [PyTorch](https://pytorch.org/get-started/locally/) 獲取更多詳細信息。例如，您可以使用以下命令安裝 PyTorch：

    ```bash
    pip install torch torchvision torchaudio
    ```

- pytesseract 庫安裝。您可以使用 pip 安裝它：

    ```bash
    pip install pytesseract
    ```

## 入門

現在我們已經準備好，讓我們開始使用 FastAPI 建立 OCR 服務。

1. 創建images和results文件夾用於儲存照片：

    ```bash
    mkdir images results
    ```

2. 創建一個新的 Python 文件，例如 `main.py` 的組件：

    ```
    from fastapi import FastAPI
     ```

3. 初始化 FastAPI 應用程序：

    ```
    app = FastAPI()
     ```

4. 定義上傳圖像端點：

    ```
    from fastapi import FastAPI, Request, Response, UploadFile, HTTPException, status
    from fastapi.responses import HTMLResponse
    from typing import List

    @app.post('/upload')
    async def upload(files: List[UploadFile]):
        for file in files:
            try:
                contents = await file.read()
                with open(f'images/{file.filename}', 'wb') as image:
                    image.write(contents)
                
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail='There was an error uploading the file(s)',
                 )
            finally:
                await file.close()

        return { 'message': f'Successfully uploaded {[file.filename for file in files]}' } 
     ```

5. 對照片進行預處理：

    ```python
    def process_image_with_opencv(img_name):
        image = cv2.imread(img_name)
        scale_factor = 0.5  # Resize to 50% of original size
        resized_img = cv2.resize(image, None, fx=scale_factor, fy=scale_factor)
        # Convert to grayscale
        gray_image = cv2.cvtColor(resized_img, cv2.COLOR_BGR2GRAY)
        # Apply erode
        erode_image = cv2.erode(gray_image, (3,3), iterations=1)
        # Apply dilate
        dilate_image = cv2.dilate(erode_image, (3,3), iterations=1)
        return dilate_image
     ```

6. 定義 OCR 端點：

    ```python
    import pytesseract
    import os
    import cv2

    @app.post('/ocr')
    async def ocr():
        img_folder = 'images'
        img_names = os.listdir(img_folder)
        for img_name in img_names:
            processed_image = process_image_with_opencv(img_folder+ "/" + img_name)
            text = pytesseract.image_to_string(processed_image, lang='chi_tra+eng+chi_tra_vert')
            print(text)
            result_folder = 'results'
            result_file = os.path.join(result_folder, os.path.basename(img_name) + '.txt')
            with open(result_file, 'w') as f:
                f.write(text)
     ```

7. 創建一個首頁用來測試 FastAPI 應用程序：

    ```python
    @app.get('/')
    async def main():
        content = '''
        <body>
        <form action='/upload' enctype='multipart/form-data' method='post'>
        <input name='files' type='file' multiple>
        <input type='submit'>
        </form>
        <form action="/ocr" method="post">
        <input type="submit" value="ocr" />
        </form>
        </body>
        '''
        return HTMLResponse(content=content)
    ```

7. 運行 FastAPI 應用程序：

     ```bash
     uvicorn main:app --reload
     ```

8. 開啟 <http://127.0.0.1:8000/> 去嘗試！

## 測試

![IMG_20240425_125133](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/3429a358-73cf-4175-b557-4d7b0d6504ce)

辨識結果：
ZF -26527928

yy 2024-04-22 12:29:48 格式 25
誠二史記 WBAt $299
賣方 53020850 買方 52414797

三三三三三
回(8  器   is gv)

 02190-001#0022728 aeMP at
RA OA

a <2 athe YA
PT

9 門市統編:53020650

加電話;02-27203005

beg 台北市信義區竹贅路473號1-2慷
電子發票(已列印) 2F 26527928

POSH 02150-001
gop 92412 #0022728-0008
營業月:2024-04-22 12:29

$5 “Ha: 52414797
Py fi: pte 92412              全
i 21464098           299T       iti
Apacer 64GB AH15J USB32        f
Gent &
sy APB4GAHTSURI               a
a hit                    HH
Auch = 288         由
(Hh       14

wy 654                   0

很           299

Gk 5242557974

42:20: 4507-01

Na FS HACR UM se

AN v           ie         AOU DSR MARE)

辨識率：60% 由於照片有些彎曲，彎曲部分辨識不佳
準確率：70% 橫式和直式混合也會降低辨識率，還有字體忽大忽小。

![IMG_20240424_091052](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/b89466e1-1324-45ef-a980-cac2fdccc54a)

辨識結果：
== Wi TOES

Mai, aye
PLE Ges 1
Bee ath  me i ih

SALE
Ce B 89310032300
ENELOOPIS ASS
176230  lx 1,239  1,239 T
ay eee crys 4
118883  lx   597   597
ea ee ee se
103722  lx  899  899 T
午後奶茶1. 5LX4
119948    Ix     339      339 T
(T= 29)
Bes (T)     ~
聯名卡    4.074
poe  N      0

i  約
a      時 WAGs At jas 和 a 同 *   i |  入

Please sean opt FF
phat at the Puy
g the Car Pa

~ TAG \ bin  ,

Yl   VAN

iat fe  in ‘Le

辨識率：80%
準確率：50%，過多中英混雜導致辨識混亂，但數字部分準確率高

![1000003081](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/949790bc-90b9-4caf-b56a-c26c54eb1194)

辨識結果：
a     ite adit
it 生生生生
二二和(全

¥2-30887276

SUE OT TANS 00 fas 20
WEG Ms 715          下加名
才之生一閃生

lu

買

BEE A Wide: $1380003

RAIS) FB) PUBS F Z|
地址:台北市人ml南京西路1號
店 Wits BAO Sse fa L125

序號:04140107

機 號:8AD10007

Feb 1 2024-04-14 17:19:04

沒有國家的人(第2版)

2681272303006
200           是               $200
(會會員折扣        90%       -$20
AORN ALIS
2682122250006
330           18               $330

(吧嗎下生        得“ 4
SCORER Chi

2882444550008
800           18               $800
C@) @ FYI        90%       ~$80
fila ARES
2000000034003«
3           各                  $3TK

國來的點格: AAT I Las ERA,
2682453868000

500        1@           $500
全)生存二二二一生在 $105

三                      $1995
os                         $1595
計生說               $50
MB EE                                 $45
LinePay                               $1500
AML                         $0
{eH                         $a
HAASE                     $0
站要                    $1500

FL. 30) 99000434

AS KMLASOR

PAN AN28 294,

公歷生三三
cdi, Hie rid Pda ey He
ASHES INE BSS

off / ae 6 Ni

四 汪汪

辨識率： 75% 字太小導致自字多的地方辨識不佳。
準確率： 50% 圖片下半部就模糊，因此準確率每況愈下。

![1000003033](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/8548b722-83ec-4eaa-a9b3-f7e4dd4b1c69)

辨識結果：
geeeremed 9 帳 傳 票
peng 111 年12月9      編號 : 1229001
銀行存款-富幫外雁       港幣119940*#d. 916                     469, 685

28%                         手續費-港幣60*3, 916                          295

12.4 7-3 % 120000*3. 916 P                 ;

tit

營業收入

也
9
6
6
7
0

核准        TH       ae         we r

辨識率： 60% 間隔忽大忽小以及紙透光到後面的字導致辨識不佳
準確率： 70% 左上角光線以及彎曲導致辨識不佳

![1000003031](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/97ff188d-264f-4fdf-afa1-e40940fdeea1)

辨識結果：
了    。       當         發    mf  ter,
20620301        tet Be

Teuncloud Lrmited     POP RRA 2 A og a
LE

和  i 路街 段 巷 二 號 樓 室
踢

KM ~ ERE EAZBEMRAP HM LRM ER: El  了

辨識率：30% 間隔忽大忽小以及紙透光到後面的字導致辨識不佳
準確率：20% 準確率又因手寫體與照片模糊，效果極差




## 結論
在本指南中，我們學習了如何使用 FastAPI 構建 OCR 服務。我們使用了 pytesseract 和 OpenCV 來處理圖像並進行光學字符識別。我們創建了上傳圖像的端點和 OCR 的端點，並通過測試首頁來測試我們的應用程序。通過運行 FastAPI 應用程序，我們可以在本地主機上運行我們的 OCR 服務。現在您可以根據您的需求擴展和改進這個基礎上的應用程序。
