# 超簡單！在Ubuntu上部署AI大腦：Docker+Ollama一步到位指南（含GPU加速）

## 簡介

在當今的軟體開發和部署環境中,Docker 和大型語言模型(LLM)已成為不可或缺的工具。本教學將指導您如何在 Ubuntu 系統上安裝 Docker,並使用它來運行 Ollama,一個強大的開源 LLM 推理引擎。

### 為什麼要學習這個？

1. **提升開發效率**: Docker 容器化技術讓您的開發環境更加一致和可移植。
2. **掌握前沿技術**: 學習部署和使用 LLM 將使您在 AI 領域保持競爭力。
3. **本地 AI 能力**: Ollama 允許您在本地運行強大的 AI 模型,無需依賴雲服務。

### 關鍵概念

**Docker**: 容器化平台,讓應用程式在不同環境中一致運行。
**Ollama**: 開源 LLM 推理引擎,簡化本地 AI 模型的部署和使用。

## 前置準備

### 系統要求

- Ubuntu 操作系統 (建議最新 LTS 版本)
- 至少 10GB 可用硬碟空間
- 至少 4GB RAM (建議 8GB 或更多)
- 穩定的網路連接

**注意**: 請先檢查是否已安裝舊版 Docker。如有,我們將在第一步中移除它。

## 步驟一: 移除舊版 Docker (如果存在)

1. 開啟終端機。

2. 執行以下命令來移除舊版 Docker:

   ```bash
   sudo apt purge docker-ce docker-ce-cli containerd.io
   sudo rm -rf /var/lib/docker
   ```

3. 驗證 Docker 是否已被移除:

   ```bash
   docker --version
   ```

   如果顯示"command not found"或類似的錯誤訊息,則表示 Docker 已成功移除。

## 步驟二: 安裝 Docker

1. 更新軟體套件清單:

   ```bash
   sudo apt update
   ```

2. 安裝必要的相依套件:

   ```bash
   sudo apt install apt-transport-https ca-certificates curl software-properties-common
   ```

3. 添加 Docker 官方 GPG 金鑰:

   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```

4. 設定 Docker 穩定版軟體庫:

   ```bash
   echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

5. 再次更新套件清單並安裝 Docker 引擎:

   ```bash
   sudo apt update
   sudo apt install docker-ce docker-ce-cli containerd.io
   ```

6. 驗證 Docker 安裝成功:

   ```bash
   sudo docker run hello-world
   ```

   如果一切順利,您將看到一條表示 Docker 已成功安裝的訊息。

## 步驟三: 使用 CPU 運行 Ollama

1. 拉取 Ollama Docker 映像檔:

   ```bash
   sudo docker pull ollama/ollama
   ```

2. 啟動 Ollama 容器:

   ```bash
   sudo docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
   ```

   這個命令會在背景啟動一個名為"ollama"的容器,將 Ollama 映像與本地的 `ollama` 卷關聯,並將容器的 11434 端口映射到主機的 11434 端口。

3. 存取 Ollama:

   現在您可以通過訪問 `http://localhost:11434` 來存取 Ollama。

4. 在本地運行模型:

   ```bash
   docker exec -it ollama ollama run llama2
   ```

   這將在 Ollama 容器中運行 llama2 模型。

### 提示: 自訂模型匯入

**GGUF 模型匯入步驟:**

a. 創建 Modelfile：
   建立一個名為 `Modelfile` 的檔案，加入 `FROM` 指令指向您要匯入的模型本地檔案路徑。

   例如：

   ```bash
   FROM ./vicuna-33b.Q4_0.gguf
   ```

b. 使用 Modelfile 創建模型：

   ```bash
   ollama create example -f Modelfile
   ```

c. 運行模型：

   ```bash
   ollama run example
   ```

**其他格式模型匯入:**

如果您想匯入 SafeTensor 或其他格式的模型，請參考 [Ollama 官方網站](https://ollama.com/) 或 [Ollama GitHub 存儲庫](https://github.com/ollama/ollama)。

## 進階選項: 使用 NVIDIA GPU 運行 Ollama

**注意**: 此部分僅適用於擁有 NVIDIA GPU 的用戶。

1. 安裝 NVIDIA 驅動程式 (如果尚未安裝):

   a. 檢查是否已安裝 NVIDIA 驅動:

      ```bash
      nvidia-smi
      ```

      如果顯示 GPU 資訊,則驅動已安裝。否則,繼續下一步。

   b. 清理現有 NVIDIA 套件 (如需要):

      ```bash
      sudo apt purge 'nvidia*'
      ```

   c. 安裝驅動程式:
    
      自動安裝:

      ```bash
      sudo ubuntu-drivers autoinstall
      ```

      或指定版本:

      ```bash
      sudo ubuntu-drivers install nvidia:<版本號>
      ```

   d. 重新啟動系統:

      ```bash
      sudo reboot
      ```

   e. 驗證安裝:

      ```bash
      nvidia-smi
      ```

2. 安裝 NVIDIA Container Toolkit:

   a. 添加 NVIDIA Container Toolkit 軟體庫:

      ```bash
      distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
      curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
      curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
      ```

   b. 更新套件清單並安裝工具包:

      ```bash
      sudo apt update
      sudo apt-get install nvidia-container-toolkit
      ```

   c. 設定 Docker 運行時:

      ```bash
      sudo nvidia-ctk runtime configure --runtime=docker
      ```

   d. 重新啟動 Docker 服務:

      ```bash
      sudo systemctl restart docker
      ```

   e. 驗證安裝:

      ```bash
      sudo docker run --rm --runtime=nvidia --gpus all nvidia/cuda:11.6.2-base-ubuntu20.04 nvidia-smi
      ```

3. 啟動支援 GPU 的 Ollama 容器:

   ```bash
   sudo docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
   ```

4. 存取支援 GPU 的 Ollama:

   現在您可以通過訪問 `http://localhost:11434` 來存取支援 GPU 的 Ollama。

## 故障排除

如果在使用 GPU 運行 Docker 容器時遇到 "Docker failed to initialize NVML unknown error" 錯誤,請嘗試以下步驟:

1. 編輯 `config.toml` 檔案:

   ```bash
   sudo vim /etc/nvidia-container-runtime/config.toml
   ```

2. 將 `no-cgroups = true` 修改為 `no-cgroups = false`。

3. 儲存更改並退出編輯器。

4. 重新啟動 Docker 服務:

   ```bash
   sudo systemctl restart docker
   ```

## 結語

恭喜您! 您已成功掌握了在 Ubuntu 系統上部署 Docker 和 Ollama 的技能。這不僅提升了您的開發能力,還為您打開了 AI 應用的新世界。

### 實踐建議

- 嘗試運行不同的 LLM 模型
- 探索 Ollama 的 API 功能
- 將 Ollama 整合到您的開發項目中

記住,持續實踐和探索是掌握這些強大工具的關鍵。祝您在 AI 開發之旅中收穫豐富!

## 參考資源

1. [Docker 官方文檔](https://docs.docker.com/)
2. [Docker 安裝指南（Ubuntu）](https://docs.docker.com/engine/install/ubuntu/)
3. [Ollama 官方網站](https://ollama.ai/)
4. [Ollama GitHub 倉庫](https://github.com/ollama/ollama)
5. [NVIDIA 容器工具包安裝指南](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
6. [NVIDIA 驅動程式下載頁面](https://www.nvidia.com/Download/index.aspx)
7. [Ubuntu 官方文檔（硬體和驅動程式）](https://help.ubuntu.com/community/BinaryDriverHowto/Nvidia)
8. [Docker GPU 支援文檔](https://docs.docker.com/config/containers/resource_constraints/#gpu)
9. [GGUF 模型格式說明（LLaMA.cpp 項目）](https://github.com/ggerganov/llama.cpp)
10. [Ubuntu LTS如何安裝Nvidia顯示卡驅動、CUDA、cuDNN、NVIDIA Container Toolkit套件](https://ivonblog.com/posts/ubuntu-install-nvidia-drivers/#5-%E5%AE%89%E8%A3%9Dnvidia-container-toolkit)
11. [Docker failed to initialize NVML unknown error](https://bobcares.com/blog/docker-failed-to-initialize-nvml-unknown-error/)
