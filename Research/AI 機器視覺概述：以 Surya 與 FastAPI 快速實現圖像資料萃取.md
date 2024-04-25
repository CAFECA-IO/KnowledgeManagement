# 使用 FastAPI 構建 Surya OCR 服務

本指南中，我們將學習如何使用FastAPI構建Surya OCR（光學字符識別）服務。我們將涵蓋以下術語和概念：

- FastAPI: FastAPI 是一個現代化、高速（高性能）的網路框架，用於使用 Python 3.8+ 建立 API，基於標準 Python 型別提示。
- Surya OCR: Surya OCR 是一個開源的 OCR 引擎，可以用來從圖像或掃描文件中提取文字。

## 先決條件

在我們開始之前，請確保您已經滿足以下先決條件：

- Python 3.9 或更高版本安裝於您的系統上。
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
        source venv/bin/activate
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

- Surya OCR 庫安裝。您可以使用 pip 安裝它：

    ```bash
    pip install surya-ocr
    ```

## 入門

現在我們已經準備好，讓我們開始使用 FastAPI 建立 Surya OCR 服務。

1. 創建images和results文件夾用於儲存照片：

    ```bash
    mkdir images results
    ```

2. 創建一個新的 Python 文件，例如 `main.py` 的組件：

    ```
    from fastapi import FastAPI
    import surya_ocr
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

5. 定義 OCR 端點：

    ```python
    from surya.ocr import run_ocr
    from surya.model.detection import segformer
    from surya.model.recognition.model import load_model
    from surya.model.recognition.processor import load_processor
    from surya.postprocessing.text import draw_text_on_image
    from surya.input.load import load_from_folder
    import os

    @app.post('/ocr')
    async def ocr():
        file_path = 'images'
        result_path = 'results'
        images, names = load_from_folder(file_path)
        image_langs = ["en","zh"] # Replace with your languages
        det_processor, det_model = segformer.load_processor(), segformer.load_model()
        rec_model, rec_processor = load_model(), load_processor()
        predictions = run_ocr(images, [image_langs], det_model, det_processor, rec_model, rec_processor)
        # draw the image by predictions content
        for idx, (name, image, pred, langs) in enumerate(zip(names, images, predictions, image_langs):
            bboxes = [l.bbox for l in pred.text_lines]
            pred_text = [l.text for l in pred.text_lines]
            page_image = draw_text_on_image(bboxes, pred_text, image.size, langs, has_math="_math" in langs)
            page_image.save(os.path.join(result_path, f"{name}_{idx}_text.png"))

        return {'message': predictions, 'image':Response(content=page_image, media_type="image/png")}
     ```

6. 創建一個首頁用來測試 FastAPI 應用程序：

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

目前辨識一張照片速度為2-3秒，主要時間在加載模型，需要大約15秒，可以在開啟伺服器時預先加載解決。
![截圖 2024-04-25 上午11 04 39](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/7ef2fbcd-5caa-4e2e-9db7-06592ed82670)

1. 判別手寫發票

![cl8765](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/b813c5db-5ebe-4ce4-91df-475c60580550)
![cl8765_1_text](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/ce17a1d2-dd5b-46bf-8950-366829d8ff7e)

結果：辨識效果極差基本上完全辨識不出來

3. 電子發票掃描檔

![f10](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/dcbe51cb-c78d-4477-b049-7efd70cf4f38)
![f10_2_text](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/8677516e-d14f-4fbf-b912-2493169d8363)

結果：基本上90%都有辨別出字，數字部分完全正確，中文部分大約70%正確，但須注意同時辨別中英文時英文容易錯誤，如圖中左上角發票號碼

4. 統一發票掃描檔

![travel](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/5c0e53ef-8897-4324-a876-afd23594631f)
![results](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/7fbe8f9a-7bb5-4b71-b66b-d3dcc16469b6)

結果：基本上90%都有辨別出字，右上角背景模糊過的數字無法辨識，與收執聯看不懂，其餘基本正確

5. 英文 Scanned invoice

![OIP](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/5ddc90f8-4329-4911-9524-0e0fb105cf2d)
![OIP_1_text](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/776a0e35-e833-4862-9efb-69662906c699)

結果：基本完全辨識到且正確，除左上角可能因紅色框框導致少辨識到一點字

6. 英文 receipt photo

![Costco-Receipt-Example1](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/ae036bc2-b309-46c0-945e-966ef19581cc)
![Costco-Receipt-Example1_0_text](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/b111b375-fcac-428c-a354-a29e7b01220d)

結果：基本約95%辨識到且正確，除中間F看成E，與兩個黑底的字會影響結果。

7. 簡體字發票電子檔

![saadasd](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/21e9b3a2-6a1c-48c7-befc-8e167203310d)
![saadasd_1_text](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/51d87cbe-9dbd-4b3d-8f6b-656dec315c36)

結果：基本約90%辨識到且正確，除直式的字與中間欄位判別錯誤還有右上角校驗碼沒讀取到。

8. 簡體字手寫發票

![20161021152646140804](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/a0f279cf-2804-4e50-b128-78b17c356fd0)
![20161021152646140804_1_text](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/9cb55f72-9661-406f-9b45-b9e5cd789618)

結果： 準確率降低到60%左右，問題與電子檔差不多，只是變得更加嚴重。

9. 直式玉皇心印妙經
![r609ng6s_0_text](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/127fa7df-137c-486d-b938-6cbd4d18d6eb)
![r609ng6s](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/3cad641b-618d-4a3f-a229-30e97fbed368)

結果：辨別效果極差，看不懂直式文字

## 結論

所以，在這本指南中，我們學會了如何使用FastAPI建立Surya OCR服務。我們涵蓋了基本概念和設定服務所需的步驟。
現在，你已經有了一個堅實的基礎，自由探索FastAPI和Surya OCR提供的進階功能和自定義選項，以提高你的OCR服務！
接下來呢？你是否對於要深入OCR和AI-powered文本識別世界中感到激動呢？

