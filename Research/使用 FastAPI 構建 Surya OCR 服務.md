# 使用 FastAPI 構建 Surya OCR 服務

本指南中，我們將學習如何使用FastAPI構建Surya OCR（光學字符識別）服務。我們將涵蓋以下術語和概念：

- FastAPI: FastAPI 是一個現代化、高速（高性能）的網路框架，用於使用 Python 3.8+ 建立 API，基於標準 Python 型別提示。
- Surya OCR: Surya OCR 是一個開源的 OCR 引擎，可以用來從圖像或掃描文件中提取文字。

## 先決條件

在我們開始之前，請確保您已經滿足以下先決條件：

- Python 3.9 或更高版本安裝於您的系統上。
- 強烈建議為您的項目設置虛擬環境。您可以使用以下命令創建虛擬環境，我們將虛擬環境命名為 `venv`，例如使用 Python 3.12：

    ```bash
    python -m venv venv
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
1. 創建一個新的 Python 文件，例如 `main.py` 的組件：

    ```
    from fastapi import FastAPI
    import surya_ocr
     ```

2. 初始化 FastAPI 應用程序：

    ```
    app = FastAPI()
     ```

3. 定義上傳圖像端點：

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

4. 定義 OCR 端點：

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

5. 創建一個首頁用來測試 FastAPI 應用程序：

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

6. 運行 FastAPI 應用程序：

     ```bash
     uvicorn main:app --reload
     ```

7. 開啟 http://127.0.0.1:8000/ 去嘗試！

## 結論

所以，在這本指南中，我們學會了如何使用FastAPI建立Surya OCR服務。我們涵蓋了基本概念和設定服務所需的步驟。
現在，你已經有了一個堅實的基礎，自由探索FastAPI和Surya OCR提供的進階功能和自定義選項，以提高你的OCR服務！
接下來呢？你是否對於要深入OCR和AI-powered文本識別世界中感到激動呢？
