# use Wav2lip on Mac

## 事前準備
### 下載wav2lip

```
git clone https://github.com/Rudrabha/Wav2Lip.git
```

### 安裝Homebrew

請至官方網站照指令安裝

```
https://brew.sh/index_zh-tw.html
```

安裝成功應該能夠執行下列指令

```
brew update
brew upgrade
```

### 安裝python3.7
雖然官方文件上說支援3.6+，但是brew最低就支援3.7。另外我直接去python官網抓了3.6跑script時100%python會當掉，推測是mac問題。

```
brew install python@3.7
```	

確認python

```
python3 -V
```

### 安裝 linbomp

```
brew install libomp
```

### 安裝 ffmpeg

```
brew install ffmpeg
```

### get models
```
https://drive.google.com/drive/folders/1I-0dNLfFOSFwrfqjNa-SXuwaURHE5K4k
```

下載 wav2lip_gen.pth 或 wav2lip.pth，然後複製到

```
./checkpoints
```

### 下載臉部辨識模型

```
https://www.adrianbulat.com/downloads/python-fan/s3fd-619a316812.pth
```

檔案改名成`s3fd.pth`，然後複製到
```
./face_detection/detection/sfd/s3fd.pth
```

## 下載python相依套件
避免環境污染，請針對「每個專案」開vm。

### 建立vm
在Wav2Lip根目錄
```
python3 -m venv .venv
```

### 開啟vm
```
source .venv/bin/activate
```
開啟成功後會看到`(.venv)`。如需關閉vm，請輸入

```
deactivate
```

### 下載相依套件
先修改 ./requirements.txt，因為有些版本找不到，先換成最近的版本。
```
tensorflow==1.12.0  改成  tensorflow==1.13.0rc2
```

修改完後執行
```
pip install -r requirements.txt
```

## 執行
```
python inference.py --checkpoint_path <ckpt> --face <video.mp4> --audio <an-audio-source> 
```
* <ckpt>: checkpoints/wav2lip_gan.pth 或 checkpoints/wav2lip.pth，根據上面選擇下載的檔案。
* <video.mp4>: 可以是圖片或影片
* <an-audio-source> : .wav, .mp3

產出的檔案會存在`./results/result_voice.mp4`
