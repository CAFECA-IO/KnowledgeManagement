- [基本概念](#基本概念)
  - [機器學習的流程](#機器學習的流程)
  - [微調模型的流程](#微調模型的流程)
- [Machine Learning Operations (MLOps)](#machine-learning-operations-mlops)
  - [MLOps 解決了什麼問題](#mlops-解決了什麼問題)
  - [MLOps 的架構](#mlops-的架構)
  - [MLOps Best Practices](#mlops-best-practices)
  - [MLOps vs DevOps](#mlops-vs-devops)
  - [LLMOps：大型語言模型的 MLOps](#llmops大型語言模型的-mlops)
- [FTI pipeline or 3-pipeline design](#fti-pipeline-or-3-pipeline-design)
  - [FTI pipeline (Feature/Training/Inference Pipelines) 的架構](#fti-pipeline-featuretraininginference-pipelines-的架構)
  - [FTI pipeline 設計的架構](#fti-pipeline-設計的架構)
  - [3-pipeline 設計的優勢](#3-pipeline-設計的優勢)
- [批處理與流處理](#批處理與流處理)
  - [批處理（Batch Processing）](#批處理batch-processing)
  - [流處理（Stream Processing）](#流處理stream-processing)
  - [在 ML 和 LLM 中的應用](#在-ml-和-llm-中的應用)
  - [在 FTI Pipeline 中的應用](#在-fti-pipeline-中的應用)
- [參考資料](#參考資料)

# 基本概念

1. AI (人工智慧)

   - 人工智慧是試圖用電腦模擬或超越人類智能的廣泛領域
   - 目標是讓機器具備學習、推理、理解等人類智能特徵
   - AI 研究始於 1950 年代,但直到近年才廣泛應用

2. ML (機器學習)

   - 機器學習是 AI 的一個分支,讓機器能從數據中學習和發現模式
   - **不需要明確編程,而是通過大量數據訓練來學習,也就是讓機器透過推論得到結果**
   - 特別擅長預測和檢測異常

3. DL (深度學習)

   - 深度學習是機器學習的一個子集,使用多層神經網絡
   - 模仿人腦的工作方式,有多個隱藏層
   - 能處理更複雜的任務,但結果可能難以解釋

4. Generative AI (生成式 AI)

   - 生成式 AI 是最新的 AI 發展方向
   - 基於基礎模型(如大型語言模型)來生成新內容
   - 應用包括聊天機器人、深度偽造等
   - 極大推動了 AI 的普及應用

5. LLM (大型語言模型)

   - 大型語言模型是一種基礎模型
   - 通過學習大量文本來預測和生成人類語言
   - 能生成連貫的句子、段落甚至整篇文檔
   - 是許多生成式 AI 應用的基礎

6. 超參數 (Hyperparameter)

   - 超參數是指在模型訓練過程開始之前設定的參數，這些參數不是通過訓練數據學習得到的，而是由開發者預先設定的。對模型性能有重要影響。
   - 例如：學習率、批次大小、訓練輪數、LLM 專有的 temperature, Top-k, Top-p 等
     - 溫度（temperature）：控制生成文本的隨機性
     - Top-k 和 Top-p：用於控制文本生成的多樣性

## 機器學習的流程

1. 載入數據
   - 數據是機器學習模型的基礎，數據源可以是 CSV 文件、數據庫、API 等。
   - 例如：使用 Python 的 pandas 庫來讀取 CSV 文件，將數據轉換為 DataFrame 格式。
2. 數據預處理和轉換
   - 將數據轉換為適合機器學習庫（如 PyTorch 或 TensorFlow）使用的格式，通常是張量（tensor）。
   - 處理數據問題，如缺失值、特徵縮放和類別變量編碼。
   - 例如：使用 sklearn 的 StandardScaler 對數值特徵進行標準化，使用 OneHotEncoder 對類別特徵進行編碼。
3. 數據分割
   - 將數據分為訓練集、驗證集和測試集。
   - 訓練集用於模型學習，驗證集用於調整模型，測試集用於最終評估。
   - 例如：使用 sklearn 的 train_test_split 函數將數據分為 70% 訓練集、15% 驗證集和 15% 測試集。
4. 定義模型架構
   - 指定模型的層數、每層的神經元數量和激活函數。
   - 例如：使用 PyTorch 定義一個包含兩個隱藏層的神經網絡，每層使用 ReLU 激活函數。
5. 定義損失函數
   - 選擇適合問題的損失函數，用於評估模型性能。
   - 例如：對於二元分類問題，可以使用二元交叉熵損失函數。
6. 定義優化器和學習率
   - 選擇優化算法（如 Adam 或 SGD）和適當的學習率。
     學習率通常設置在 0.05 到 0.001 之間。
   - 例如：使用 Adam 優化器，初始學習率設為 0.001。
7. 訓練模型
   - 指定訓練的輪數（epochs）和批次大小（batch size）。
   - 使用 mini-batch 策略來提高訓練效率，特別是對於大型數據集。
   - 例如：訓練模型 50 個輪次，每個批次包含 64 個樣本。
8. 評估模型
   - 使用適當的評估指標來衡量模型性能。
     分類問題可使用準確率、精確率、召回率等；回歸問題可使用均方誤差、平均絕對誤差等。
   - 例如：對於多分類問題，計算模型在測試集上的 F1 分數。
9. 微調模型（可選）
   - 調整超參數以提高模型性能。
   - 可以嘗試不同的學習率、批次大小、模型架構等。
   - 例如：使用網格搜索或隨機搜索來找到最佳的超參數組合。
10. 在新數據上進行預測（推理）
    - 將訓練好的模型部署到生產環境中。
    - 使用模型對新的、未見過的數據進行預測。
    - 例如：將模型部署為 API 服務，接收新的數據輸入並返回預測結果。

## 微調模型的流程

微調模型與訓練模型不同，微調模型是使用已經訓練好的模型，然後用新的數據集上進行訓練，以適應新的任務。
需要注意數據集的大小、以及與預訓練數據集的相似度；在數據集大且相似度高的情況，對於微調模型是最理想的。

1. 選擇預訓練模型
   - 從現有的預訓練模型（如 GPT-3）開始，而不是從頭開始訓練。
   - 例如：選擇 OpenAI 的 GPT-3 模型作為起點。
2. 準備數據集
   - 收集特定於您任務的高質量數據集，這被稱為"微調集"。
   - 數據預處理：清理和標準化數據。
   - 數據分割：將數據分為訓練集、驗證集和測試集。
   - 例如：如果要微調模型生成 Python 代碼，可以收集數百到數千個 Python 代碼示例。
3. 設置微調參數
   - 定義微調作業，指定模型、數據集和超參數。
   - 關鍵參數包括：
     - 學習率：通常設置較小的值，如 0.0001 到 0.00001。
     - 批次大小：根據數據集大小和可用內存調整。
       - 這邊的批次指的是在進行一次參數更新之前，模型所看到的樣本數量。
     - 訓練輪數（epochs）：決定模型在整個數據集上訓練的次數。
   - 例如：使用 OpenAI API 定義微調作業，指定使用 GPT-3 模型，Python 代碼數據集，學習率為 0.00005，批次大小為 32。
4. 微調模型
   - 將數據集中的示例傳遞給模型並收集其輸出。
   - 計算模型輸出與預期輸出之間的損失。
   - 使用梯度下降和反向傳播更新模型參數以減少損失。
   - 重複這個過程多個 epochs，直到模型收斂。
   - 例如：使用 OpenAI API 啟動微調作業，監控訓練進度，觀察損失值的變化。
5. 評估微調後的模型
   - 使用保留的驗證集評估模型性能。
   - 檢查模型是否過擬合或欠擬合。
   - 根據需要調整超參數並重複微調過程。
   - 例如：在驗證集上測試模型生成 Python 代碼的質量，計算相關指標如準確率或 BLEU 分數。
6. 部署和應用
   - 將微調後的模型部署到生產環境中。
   - 使用 API 或將模型下載到本地使用。
   - 持續監控模型性能，必要時進行更新。
   - 例如：將微調後的 Python 代碼生成模型部署為 API 服務，供開發團隊使用。

# Machine Learning Operations (MLOps)

## MLOps 解決了什麼問題

MLOps 主要解決以下問題：

1. 模型開發和部署之間的斷層
2. 模型性能監控和維護的困難
3. 模型版本控制和可重現性的挑戰
4. 跨團隊協作的效率問題
5. 模型部署的自動化和標準化

## MLOps 的架構

![image](https://github.com/user-attachments/assets/130ae511-a70a-44ca-8433-8c68a4c719dc)
(picture from https://mlops-for-all.github.io/en/docs/introduction/component/)

MLOps 的架構通常包括以下幾個主要組件：

1. 實驗環境 (Experiment Environment)

   - 提供版本控制工具（如 Git）和筆記本（如 Jupyter Notebook）環境的整合
   - 實驗追蹤功能，包括使用的數據、超參數和評估指標
   - 數據和模型分析與可視化功能

2. 數據處理系統 (Data Processing System)

   - 兼容各種數據源和服務的數據連接器
   - 兼容不同數據格式的數據編碼器和解碼器
   - 適用於不同數據類型的數據轉換和特徵工程功能
   - 用於訓練和服務的可擴展批處理和流處理數據處理能力

3. 模型訓練和調優平台 (Model Training and Tuning Platform)

   - ML 框架執行的環境配置
   - 用於多個 GPU 和分佈式訓練的分佈式訓練環境
   - 超參數調優和優化功能 (Hyperparameter Tuning and Optimization)

4. 模型評估系統 (Model Evaluation System)

   - 在評估數據集上進行模型性能評估
   - 跟踪不同連續訓練運行的預測性能
   - 比較和可視化不同模型之間的性能
   - 使用可解釋 AI 技術進行模型輸出解釋

5. 模型部署系統 (Model Deployment System)

   - 低延遲和高可用性的推理能力
   - 支持各種 ML 模型服務框架（如 TensorFlow Serving、TorchServe、NVIDIA Triton 等）
   - 高級推理例程，如預處理或後處理，以及多模型集成以獲得最終結果
   - 處理突發推理請求的自動擴展能力
   - 推理請求和結果的日誌記錄

6. 在線實驗系統 (Online Experiment System)

   - A/B 測試能力 (A/B Testing)

7. 模型監控系統 (Model Monitoring System)

   - 監控生產環境中部署的模型，確保正常運行
   - 提供模型性能下降和更新需求的信息

8. ML 流水線 (pipeline)

   - 通過各種事件源執行 pipeline
   - ML 元數據追蹤和集成，用於流水線參數和工件管理
   - 支持常見 ML 任務的內置組件和用戶定義組件
   - 提供不同的執行環境

9. 模型註冊表 (Model Registry)

   - 註冊、追蹤和版本控制已訓練和部署的模型
   - 存儲部署所需的數據和運行時包的信息

10. 數據集和特徵存儲 (Dataset and Feature Store)

    - 數據集的共享、搜索、重用和版本控制功能
    - 用於事件流和在線推理任務的實時處理和低延遲服務能力
    - 支持各種類型的數據，如圖像、文本和表格數據

11. ML 元數據和工件追蹤 (ML Metadata and Artifact Tracking)
    - ML 工件的歷史管理
    - 實驗和流水線參數配置的追蹤和共享
    - ML 工件的存儲、訪問、可視化和下載功能
    - 與其他 MLOps 功能的集成

## MLOps Best Practices

以下是 MLOps 在機器學習生命週期各階段的最佳實踐：

1. 探索性數據分析 (EDA)

   - 創建可重現、可編輯和可共享的數據集、表格和可視化
   - 例如：使用 Jupyter Notebook 進行小規模交互式數據探索，並將結果保存在版本控制系統中

2. 數據準備和特徵工程

   - 迭代轉換、聚合和去重數據以創建精煉特徵
   - 使用特徵存儲使特徵可見並可在數據團隊間共享
   - 例如：使用 Feast 或 Tecton 等特徵存儲平台管理特徵

3. 模型訓練和調優

   - 使用流行的開源庫（如 scikit-learn 和 hyperopt）進行模型訓練和性能改進
   - 考慮使用 AutoML 工具自動執行試驗並創建可審查和可部署的代碼
   - 例如：使用 H2O.ai 或 Google Cloud AutoML 進行自動化模型訓練

4. 模型審查和治理

   - 追踪模型譜系、版本，並管理模型工件及其生命週期轉換
   - 使用開源 MLOps 平台（如 MLflow）發現、共享和協作 ML 模型
   - 例如：使用 MLflow 記錄實驗參數、指標和模型版本

5. 模型推理和服務

   - 管理模型刷新頻率、推理請求時間等生產特定問題
   - 使用 CI/CD 工具（如代碼庫和編排器）自動化預生產管道
   - 例如：使用 Jenkins 或 GitLab CI 自動化模型部署流程

6. 模型部署和監控

   - 自動化權限和集群創建以將註冊模型投入生產
   - 啟用 REST API 模型端點
   - 例如：使用 Kubernetes 進行模型部署，Prometheus 進行監控

7. 自動化模型重新訓練
   - 創建警報和自動化以在模型漂移時採取糾正措施
   - 例如：使用 Evidently AI 檢測數據漂移，並觸發模型重新訓練流程

## MLOps vs DevOps

雖然 MLOps 和 DevOps 都致力於提高軟件質量和加快發布速度，但 MLOps 特別關注機器學習模型的生產化過程，包括數據管理、模型訓練、部署和監控等特定挑戰。

## LLMOps：大型語言模型的 MLOps

LLMOps 是 MLOps（機器學習操作）的一個專門子集。 MLOps 涵蓋了管理機器學習模型的一般原則和實踐，而 LLMOps 則解決了 LLM 的獨特特徵，例如規模大、訓練要求複雜、計算要求高。

訓練大型語言模型（如 Llama）的 LLMOps 與傳統 MLOps 有一些不同之處：

1. 計算資源：需要更多的 GPU 資源進行訓練和推理
2. 遷移學習：通常從基礎模型開始，通過微調適應特定領域
3. 人類反饋：強化學習中的人類反饋（RLHF）對提高模型性能至關重要
4. 超參數調優：除了提高準確性，還需要考慮降低訓練和推理成本
5. 性能指標：使用特定的評估指標，如 BLEU 和 ROUGE 分數

# FTI pipeline or 3-pipeline design

儘管 MLOps 工具不斷進步，但將 prototype 轉化為可迭代的產品，仍是一大挑戰。

更常見的情況是：

- ML 系統的架構主要考慮研究需求
- ML 系統變成一個龐大的單體結構，難以從離線環境重構到在線環境

因此，良好的軟件工程流程和明確定義的架構與使用合適的工具和高精度模型同樣重要。

## FTI pipeline (Feature/Training/Inference Pipelines) 的架構

![CleanShot 2024-09-30 at 17 47 46@2x](https://github.com/user-attachments/assets/0617ce2c-0e29-490f-bd69-e0b9d98ac338)
(picture from https://medium.com/decodingml/an-end-to-end-framework-for-production-ready-llm-systems-by-building-your-llm-twin-2cc6bb01141f)

3-pipeline 設計（也稱為 Feature/Training/Inference，簡稱 FTI 架構）是一種心智模型，幫助簡化開發過程並將單體 ML 流水線拆分為三個組件：

1. 特徵流水線（Feature Pipeline）
2. 訓練流水線（Training Pipeline）
3. 推理流水線（Inference Pipeline）

## FTI pipeline 設計的架構

1. 特徵流水線

   - 將數據轉換為特徵和標籤
   - 存儲和版本控制在特徵存儲中
   - 特徵存儲作為特徵的中央存儲庫
   - 特徵只能通過特徵存儲訪問和共享
   - 工具：Pandas, Polars, Spark, DBT, Flink, Bytewax

2. 訓練流水線

   - 從特徵存儲中獲取特定版本的特徵和標籤
   - 輸出訓練好的模型權重
   - 模型權重存儲和版本控制在模型註冊表中
   - 模型只能通過模型註冊表訪問和共享
   - 工具：PyTorch, TensorFlow, Scikit-Learn, XGBoost, Jax

3. 推理流水線
   - 使用特徵存儲中的特定版本特徵
   - 從模型註冊表下載特定版本的模型
   - 最終目標是向客戶端輸出預測結果
   - 工具：PyTorch, TensorFlow, Scikit-Learn, XGBoost, Jax

## 3-pipeline 設計的優勢

1. 直觀易懂
2. 提供結構化設計，所有 ML 系統都可以簡化為這三個組件
3. 定義了三個組件之間的透明接口，便於多個團隊協作
4. ML 系統從一開始就考慮了模塊化設計
5. 三個組件可以輕鬆分配給不同的團隊（如有必要）
6. 每個組件都可以使用最適合的技術棧
7. 每個組件可以獨立部署、擴展和監控
8. 特徵流水線可以輕鬆實現批處理、流處理或兩者結合

最重要的是，遵循這種模式可以確保 ML 模型 100% 從筆記本環境轉移到生產環境中。

# 批處理與流處理

這邊提兩種常見的數據處理方式：批處理（Batch Processing）和流處理（Stream Processing），會在 ML 和 LLM 中使用。

## 批處理（Batch Processing）

批處理是指在預定的時間間隔內處理一批數據的方法。

特點：

- 處理大量靜態數據
- 通常在固定的時間間隔執行（如每天、每週）
- 延遲較高，但吞吐量大

適用情境：

- 歷史數據分析
- 定期報告生成
- 離線特徵計算

## 流處理（Stream Processing）

流處理是指實時處理持續產生的數據流的方法。

特點：

- 處理連續、即時的數據流
- 低延遲，近乎實時的處理
- 適合處理時間敏感的數據

適用情境：

- 實時監控和警報
- 即時推薦系統
- 金融交易分析

## 在 ML 和 LLM 中的應用

1. 機器學習（ML）：

   - 批處理：

     - 大規模模型訓練
     - 離線特徵工程
     - 模型評估和驗證

   - 流處理：
     - 在線學習和模型更新
     - 實時預測和推薦
     - 異常檢測

2. 大型語言模型（LLM）：

   - 批處理：

     - 模型預訓練和微調
     - 大規模文本語料庫處理
     - 離線評估和基準測試

   - 流處理：
     - 實時對話系統
     - 即時文本生成和翻譯
     - 持續學習和適應

## 在 FTI Pipeline 中的應用

批處理和流處理在 FTI pipeline 中可以有不同的應用方式：

1. 特徵流水線（Feature Pipeline）：

   - 批處理：處理大量歷史數據，生成離線特徵
   - 流處理：實時計算和更新特徵，處理即時數據流

2. 訓練流水線（Training Pipeline）：

   - 批處理：大規模模型訓練，定期重新訓練
   - 流處理：在線學習，持續更新模型

3. 推理流水線（Inference Pipeline）：
   - 批處理：批量預測，如每日推薦列表生成
   - 流處理：實時預測，如即時對話回應或實時欺詐檢測

# 參考資料

- Machine learning
  - [10 Steps of Machine Learning Process](https://siddp6.medium.com/10-steps-to-machine-learning-models-de72ea495562)
- Fine tuning
  - [【遷移學習】一個訓練大型網路重要的技巧：Fine Tuning](https://jason-chen-1992.weebly.com/home/fine-tuning)
  - [[機器學習 ML NOTE]Overfitting 過度學習](https://medium.com/%E9%9B%9E%E9%9B%9E%E8%88%87%E5%85%94%E5%85%94%E7%9A%84%E5%B7%A5%E7%A8%8B%E4%B8%96%E7%95%8C/%E6%A9%9F%E5%99%A8%E5%AD%B8%E7%BF%92-ml-note-overfitting-%E9%81%8E%E5%BA%A6%E5%AD%B8%E7%BF%92-6196902481bb)
  - [Fine-Tuning AI Models: A Guide](https://medium.com/@prabhuss73/fine-tuning-ai-models-a-guide-c515bcd4b580)
  - [什麼是微調 (fine-tuning)? 如何微調 GPT-3.5 模型?](https://www.explainthis.io/zh-hant/ai/fine-tuning-gpt)
  - [[Finetuning Large Language Models ] 課程筆記- 為何要微調(Why finetune)](https://hackmd.io/@YungHuiHsu/HJ6AT8XG6)
- MLOps & LLMOps
  - [Components of MLOps](https://mlops-for-all.github.io/en/docs/introduction/component/)
  - [MLOps](https://www.databricks.com/glossary/mlops)
  - [**什麼是 MLOps？- 機器學習營運說明**](https://aws.amazon.com/tw/what-is/mlops/)
  - [ML Pipeline Architecture Design Patterns (With 10 Real-World Examples)](https://neptune.ai/blog/ml-pipeline-architecture-design-patterns)
  - Chip Huyen, [Building LLM applications for production](https://huyenchip.com/2023/04/11/llm-engineering.html) (2023), Chip Huyen’s Blog
  - [**How to Build an End-To-End ML Pipeline**](https://neptune.ai/blog/building-end-to-end-ml-pipeline)
  - [What is LLMOps (large language model operations)?](https://cloud.google.com/discover/what-is-llmops)
- FTI pipeline
  - [An End-to-End Framework for Production-Ready LLM Systems by Building Your LLM Twin](https://medium.com/decodingml/an-end-to-end-framework-for-production-ready-llm-systems-by-building-your-llm-twin-2cc6bb01141f)
