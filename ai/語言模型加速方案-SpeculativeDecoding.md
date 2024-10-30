# 目錄
- [介紹 Speculative Decoding](#介紹-speculative-decoding)
- [原理解說](#原理解說)
- [推理流程](#推理流程)
- [優缺點分析](#優缺點分析)
- [其他加速方案](#其他加速方案)
  - [知識蒸餾(Knowledge Distillation)](#知識蒸餾knowledge-distillation)
  - [量化(Quantization)](#量化quantization)
  - [剪枝(Pruning)](#剪枝pruning)

## 介紹 Speculative Decoding
Speculative Decoding 是一種提升語言模型生成效率的技術。其核心目的為解決語言**模型越大推理速度就越慢**的問題。它不須修改模型架構本身，也不須額外訓練語言模型，因此不限使用於大型語言模型(LLM)，而是能應用於各種語言模型，加速約 2-3 倍的推理時間。

## 原理解說
Speculative Decoding 的基本原理是**透過預測並平行生成多個字元或詞彙，從而減少逐步生成的次數，加快回應速度**。相較於傳統的逐步生成每個 token，這種方法可以提高語言模型的性能，特別是在處理快速生成大量文本的情境，能有效降低延遲並提升計算效率。

![SpeculativeDecoding](https://github.com/user-attachments/assets/c6f4d3e7-05b9-4b39-9fe3-b5ba86e287f2)

1. **Autoregressive Decoding**：
    - 傳統模型循序漸進，逐步生成詞元(token)，因此推理速度較慢。
    - 每步驟依賴上一個詞元的生成，延遲時間被拖得很長。
2. **Speculative Decoding**：
    - 會先有效率地草擬多個詞元，再使用目標 LLM **並行驗證**，以減少延遲時間。
    - 錯誤的草擬詞元(如上圖紅框標記)會被丟棄，以確保生成品質。
    - 降低延遲，提升了系統的實際性能。

## 推理流程
Speculative decoding 會透過一個小型的 *draft model* 先預測多個 token，並與語言模型實際生成的 token 進行比對，實現效率和準確性的平衡。具體推理流程如下：

1. **Draft model 預測**：由 draft model 預測多個 token，並將這些候選 token 提供給語言模型進行並行處理。
2. **並行驗證**：將預測的 token 與目標語言模型生成的 token 進行比較，確認哪些是可以接受的。
3. **濾除與輸出**：捨棄不符合語言模型預期的 token，並輸出最終的正確結果。

## 優缺點分析
### 優點
- **推理加速**：透過並行生成 token 和驗證，提升推理速度的同時保持準確度。
- **延遲降低**：減少逐步生成的時間，使回應速度更迅速，並能同時處理多個場景，因此特別適合需要即時回饋的應用。
- **靈活應用**：這項技術不要求對現有語言模型進行重新訓練，使用現成的數據庫或簡單的統計模型即可作為 Draft model ，簡化部署流程。

### 缺點
- **硬體負擔**：由於需要更多計算資源來處理多個候選 token，此技術對硬體效能要求較高。
- **計算浪費**：即使加快了生成速度，部分預測的 token 可能會被捨棄，導致浪費部分計算資源。
- **適用性有限**：對簡單或短文本生成的場景可能效果不明顯。

Speculative Decoding 能夠在維持生成品質的同時，顯著降低回應時間，提升用戶體驗。在需要處理大量生成任務和快速生成的場景中特別有優勢，如**聊天機器人**、**即時翻譯**等。

然而，此技術對硬體資源和應用場景有一定的要求。它需要較高的計算能力來處理並行驗證，因此實際應用時仍需權衡其效益與可能帶來的額外計算成本。

## 其他加速方案
#### 知識蒸餾(Knowledge Distillation)
是一種模型壓縮的技術，目的是從較大且成熟的模型中抽取精華，訓練出更小、更簡單的模型。它的最大優勢是顯著減少記憶體和計算需求，縮短推理時間，同時保持接近大型模型的精度。

![Knowledge Distillation](https://github.com/user-attachments/assets/5ea443cf-abdf-40a6-b456-0ae28b57a0d6)

其大致作法是訓練一個簡單模型(Student Model)，讓它學習複雜模型(Teacher Model)的推理過程。過程中，Teacher Model 會為每個輸入生成**預測分佈**（即各答案的信心分數）。Student Model 會以此為學習目標，逐步接近 Teacher Model 的輸出結果。
然而，知識蒸餾的缺點是需要大量的 Teacher Model 數據，在訓練前的準備上須耗費大量時間。

#### 量化(Quantization)
是一種模型壓縮的技術，將模型中的數據精度從高精度（如 32 位元）壓縮到低精度（如 8 位元），以減少計算和內存需求。讓模型的計算過程變得更輕量，加速推理。因此它適合運行在資源有限的硬體（如智慧型手機）上。

<img width="834" alt="Quantization" src="https://github.com/user-attachments/assets/90b958bf-3cb6-4ec6-b4db-b414a7c32875">

儘管量化能大幅縮小模型大小和提高運行效率，但精度降低可能會稍微影響模型性能，因此並非所有模型和應用場景都適合量化。應根據實際需求選擇是否採用量化方法。

#### 剪枝(Pruning)
是一種模型壓縮的技術，透過移除模型中不重要的參數來縮小模型規模，加速推理，從而提高模型運行效率。
具體作法包括移除對結果影響小的權重（通常設置門檻值篩選），也可進行**結構性剪枝**，例如刪減冗餘層和節點。通常採用漸進式剪枝，每次剪枝後都會微調模型，以確保準確度。

![Pruning](https://github.com/user-attachments/assets/9ec8806c-dd7d-4f84-824d-fa6fc9ec955b)

剪枝後的模型計算量和記憶體需求降低，特別適合內存有限的硬體。不過，剪枝過程可能十分複雜，須花費大量時間實驗和調整，並會略微影響精度，因此不適合精度要求極高的應用。

### 參考資料
- [arXiv - Unlocking Efficiency in Large Language Model Inference:
A Comprehensive Survey of Speculative Decoding](https://arxiv.org/html/2401.07851v2)
- [YouTube -【生成式AI導論 2024】第16講：可以加速所有語言模型生成速度的神奇外掛 — Speculative Decoding](https://www.youtube.com/watch?v=MAbGgsWKrg8)
- [iT 邦幫忙 - Day18 - 快......還要更快：Speculative decoding](https://ithelp.ithome.com.tw/articles/10353523)
- [facebook - 加速 LLM 推理 2 - 3 倍的技巧：Speculative Decoding](https://www.facebook.com/permalink.php?story_fbid=pfbid0JedAZ8EuMCnmBNKqetrcX7xrxRXxmp6a6nYr2Xi8qKwbS6UnHZns6cPeHH9EAqsJl&id=100094251365406)
- [CH.Tseng - 知識蒸餾 KnowledgeDistillation](https://chtseng.wordpress.com/2020/05/12/%E7%9F%A5%E8%AD%98%E8%92%B8%E9%A4%BE-knowledgedistillation/)
- [FIND - 知識蒸餾: 壓縮模型以達泛用化](https://www.find.org.tw/index/knowledge/browse/7353378d7b72bcf0722141f77c121cd4/)
- [iT 邦幫忙 - Day 21 : 模型優化 - 剪枝 Pruning](https://ithelp.ithome.com.tw/articles/10268124)
