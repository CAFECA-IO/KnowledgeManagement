## 使用情境
有時候會碰到將網頁畫面列印出來的需求。以 BAIFA 報表為例，先用 Html 完成報表內容的排版，設定每一頁的尺寸為 A4 大小(長 595px、寬 842px)，並在每頁間用 `<hr />` 分割。完成的網頁如下：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/a46ff708-caeb-43a3-ade3-86f4465770d4)
然而列印出來的結果卻不如預期：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/e6398eff-5d83-42e5-b5be-313915b543fa)
這是因為我們沒有設定網頁的列印樣式。CSS 不僅能

依據上面的輸出結果，我們可以整理出以下幾個需要修正的問題：
1. 背景圖消失
2. 頁面沒有根據 `<hr />` 分割
3. 不需要預設的頁首和頁尾

### 實作方法

### 參考來源
- [在網頁當中如何設定列印格式?(CSS的media print設定)](https://kbytalk.com/html-print-css/)
