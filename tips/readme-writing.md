# README 撰寫｜ README Writing

本文主要參考下方這兩篇文章：

1. [Art of README](https://github.com/hackergrrl/art-of-readme/blob/master/README.md)
2. [README 寫法](https://gitqwerty777.github.io/art-of-readme/)

參考文章主要以 npm module 的 README 當作主角，所以通常都以「模組」來稱呼，但筆者認為「專案」的 README 也可以參考他的做法。

本文主要在介紹 README 文件的功能和技巧，已刪去了所多原文所寫的 npm module 相關內容，除了調整一些語法之外，另外新增一些延伸話題，以及在 GitHub 上 README 的存放位置等內容。

## 為什麼要寫 README？

README 是寫給模組使用者的。

README 也是寫給模組建立者的。一個沒有文件的模組，往往時隔 6 個月後，就連作者自己都會覺得陌生。每個模組的作者同時也是該模組的使用者。

README 是模組使用者第一次（或許是唯一一次）查看你的創作。

編寫優秀的文件可以讓使用者不用閱讀原始碼就能理解你模組的精妙之處。沒有 README 意味著開發者需要閱讀原始碼才能理解你的模組。

使用者希望模組能滿足他們的需要，所以你要清楚的說明你的模組的主要作用和優勢。

> 當某人可以在不必查看程式碼的情況下使用您的模組時，您的文件就算完整。這非常重要。因為這讓你分離模組文件介面與內部實作。這是一件好事，因為這意味著只要介面保持不變，您就可以自由更改模組的內部結構。
> 記住：文件，而不是程式碼，定義了模組的功能。 — Ken Williams

## README 目標

README 的工作是：

1. 這是什麼
2. 使用情境
3. 如何使用
4. 實作及相關細節

**延伸話題：README 必須用英文撰寫嗎？**

由於知名的 OSS（開源軟體）通常以英文撰寫 README，因此可能產生應該要使用英文撰寫的認知。然而，如果主要觀眾是懂日語的人，那 README 就應該以日語撰寫。

此外，若堅持用英文撰寫使內容變得薄弱，反而得不償失。近年來，因為翻譯技術有飛躍的進步，可嘗試先使用自己擅長的語言撰寫，然後再進行翻譯，也是另一種方法。

## 基本的 README 組成

**建議順序:**

- 一句話解釋模組的目的
- 簡潔可運行的範例 (Usage)
- 詳細的 API 文件 (API)
- 安裝說明 (Installation)
- 注意事項和限制
- 授權條款 (License)
- 必要的背景資料或連結
- 專業術語解譯

**原則:**

簡潔：理想的 README 應該儘可能的短，不是越長越好。詳細的內容可以在單獨的頁面裡描述。

## 方法

1.  使用模版:
    [common-readme](https://github.com/hackergrrl/common-readme)，一個 README 寫作指南和方便的 command-line 生成器。
    [standard readme](https://github.com/richardlitt/standard-readme)，更架構化的通用 README 格式。
2.  以史為鑒:
    其實就是參考其他模組所提供的 README。最好是參考已有歷史之外也有許多使用者的模組。
3.  以使用者的角度分析順序:
    當我(我現在是使用者)想要一個 2D 碰撞檢測模組時我找到了 `collide-2d-aabb-aabb`。

    我開始從頭開始檢查這個模組：

    1. 取名：名字要能做到 “其義自見”。`collide-2d-aabb-aabb` 聽起來是個不錯的匹配，儘管它假設我知道 "aabb" 是什麼意思。
    2. 簡介：透過一句話簡明扼要的說明了這個模組是做什麼的。
       `collide-2d-aabb-aabb` 的描述是：
       ```
       Determines whether a moving axis-aligned bounding box (AABB) collides with other AABBs.
       ```
       太棒了 —— 描述了 AABB 的定義是什麼，並且說明了這個模組是做什麼的。
    3. 用法：在開始探究 API 文件之前，最好看看這個模組在實際應用中是什麼樣子。我可以快速決定用 js 寫的範例程式是否符合我的程式碼樣式和我要解決的問題。
    4. API：模組的名字，描述和使用方法都符合我的胃口。在這一點上我很樂意使用這個模組。我需要瀏覽 API 來確定這就是我需要的，並且很容易整合到我的程式碼中。API 部分應該詳述模組的物件和函式，以及它們的定義、回傳值和事件。
    5. 安裝：如果不是通用的安裝說明，就需要在這兒進行描述。即使是一句簡單的 `npm install` 也好。 對於使用 Node 的新使用者來說，放一個指向 npmjs.org 的連結和安裝命令，可以讓使用者快速上手使用模組。
    6. 授權：大多數模組把這個放在最末尾，但是最好還是往前放一些；非常有可能在把這個模組整合完後才發現授權協議不合適。我通常使用 MIT/BSD/X11/ISC。如果你的協議不是很寬容，最好是放到最前面。

4.  順序：認知漏斗
    可以想象成是一個直立的漏斗，越往下移動細節越具體，最寬的部分相關細節最寬泛，只有對你的作品足夠感興趣的人才會關注這部分內容。最後，底部可以放一些作品背景的細節。

## 在 GitHub 上 README 的存放位置在哪裡？

如果要編輯 `README.md` 文件，建議開一個新分支處理，避免在 main 分支上直接修改，會產生不必要的 commit 記錄。

等到最後合併至 main 主幹後就會出現在 GitHub 首頁。

## 額外補充：README 檢查表

一個實用的檢查表來衡量你的 README：

- [ ] 用一行解釋模組的用途
- [ ] 必要的背景資料與連結
- [ ] 將可能不熟悉的術語連結到資訊來源
- [ ] 清楚、*可運行*的使用範例
- [ ] 安裝說明
- [ ] 詳細的 API 文件
- [ ] 預先提及注意事項和限制
- [ ] 不依賴圖像傳遞重要訊息
- [ ] 授權

## 額外補充：其他好做法

除了本文的重點外，你也可以遵循(或不遵循)其他做法，以進一步提高 README 的品質標準並最大限度地提高對其他人的實用性：

1. 積極建立連結！如果你談論到其他模組、想法或其他人時，在參考文字上加上連結，可以讓造訪者更容易的了解你的模組背後的想法。很少模組是憑空誕生的，所有的作品都源自於其他作品，因此幫助使用者了解模組的歷史和靈感是值得的。

2. 當參數及回傳值的型別不明顯時，請加上相對應的資訊。盡可能符合常用約定(`cb` 可能表示 callback、`num` 可能表示 `Number`)。

3. 在**用法**中示範的程式碼，要以文件的形式放在 repo 中，例如：`example.js`。這樣當用戶 clone 專案後，就可以直接執行 README 提及的程式碼。

4. API 格式是可高度循環的。使用你認為最清晰的任何格式，但要確保你的格式表達了重要的細節：

   1. 哪些參數是可選的，以及他們的預設值。
   2. 如果型別不像約定呈現，需包含型別資訊。
   3. 對於 `opts` 物件參數，描述它所有可以接受的鍵與值。
   4. 如果在**用法**區塊不明顯或沒有完全涵蓋，不要迴避提供使用 API 函數的小範例。但這也是一個警訊，表示該函數過於複雜，需要重構、分解為更小的函數或完全刪除。
   5. 積極為專業術語加上連結！在 Markdown 中，你可以在文件底部加上[註腳](https://daringfireball.net/projects/markdown/syntax#link)，可以很方便的多次引用它們，參考文章的作者[Kira](http://kira.solar)對於 API 格式的偏好可以查看[這裡](https://github.com/hackergrrl/common-readme/blob/master/api_formatting.md)。

5. 如果你的模組是一個小的無狀態函數集合，將**用法**區塊以 [Node REPL session](https://github.com/hackergrrl/bisecting-between#example)格式提供函數的呼叫及結果會比執行原始碼文件更清楚傳達使用方式。

6. 如果你的模組提供 CLI(指令介面)而不是 API，請提供使用範例程式如何呼叫指令和輸出。如果你創建或修改一個文件，`cat` 它示範前後的變化。

7. 別忘記使用 `package.json` 的關鍵字來引導模組探索者找到你的模組。

8. 你更改的 API 越多，更新文件所需的工作就越多。

9. 最後請記住，你的版本控制專案及內嵌入的 README 存在時間將比你的[專案託管主機(GitHub)](https://github.com)或任何你超連結(hyperlink)的東西——特別是圖片——都要長久。因此*內嵌*任何(inline anything)對未來使用者了解你的作品至關重要的內容。（避免超連結失效）

## 額外補充：範例

理論總是很好，但優秀的 README 長什麼樣子？以下是參考文章作者提供範例：

- https://github.com/hackergrrl/ice-box
- https://github.com/substack/quote-stream
- https://github.com/feross/bittorrent-dht
- https://github.com/mikolalysenko/box-intersect
- https://github.com/freeman-lab/pixel-grid
- https://github.com/mafintosh/torrent-stream
- https://github.com/pull-stream/pull-stream
- https://github.com/substack/tape
- https://github.com/yoshuawuyts/vmd

# References

1. [Art of README](https://github.com/hackergrrl/art-of-readme/blob/master/README.md)
2. [README 寫法](https://gitqwerty777.github.io/art-of-readme/)
