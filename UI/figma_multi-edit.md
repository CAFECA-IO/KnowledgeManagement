<div align=center>

![e1e35820-9d3b-4461-88c6-4559e32c0ee9-cover](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/96234f5f-dbca-4428-b360-4047ab926229)

</div>

# Figma_multi-edit
## 前言
Figma在近期推出了"Multi-edit"的新功能，使用這個功能可以讓設計師一次性的去多重更改物件，包含該物件的大小、角度、文字內容、甚至是元件(component) variant 的修改都可以完成，節省了在不同畫面切換找物件的選取流程。
接下來會介紹multi-edit相關應用實例。
> 1.Select Matching layers

> 2.Identify matching objects

> 3.Aligning objects across frames

> 4.Applying transformations

> 5.Re-parenting nested frames

> 6.Multi-edit copy and paste

### Select Matching layers
在使用Select Matching layers之前需要注意，該物件的名稱需要相同且該物件是在不同的Frame。可參考下方示範圖片：
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/83a318fa-c435-4e29-94bf-41d118f618cf)

選擇好物件後，可在Figma上方的功能icon列，選擇Select Matching layers或是使用快捷鍵"⌥⌘A"、“Ctrl+Alt+A”，接下來Figma就會幫你選取好所有相同的物件，就可以進行大小、顏色、角度、位置等調整。
如果想修改物件名稱，也不用再像以前一個一個點擊修改，只需要先使用Select Matching layers選取完成，按下“⌘R”、“Ctrl+R”，會出現下方彈窗，可以依照順序或是倒敘方式命名。
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/59035b57-096d-463e-b957-e65c5d3efbbf)

### Identify matching objects
當有物件名稱相同且該物件是在不同的Frame時，選取了其中的物件並按著Shift，可以發現Figma將不同Frame下的相同物件以淺藍色的框線做區別顯示，這時候在建立一個選取範圍時，可以非常輕鬆的直接選取到這些被淺藍色的框線所區別的物件，完全不用擔心選取到其他物件還要重新選取的問題。
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/4efccc42-1774-4461-9346-0b6d4805bb61)

### Aligning objects across frames
在使用Select Matching layers後選擇好物件時，使用對齊工具會將在不同的Frame裡的相同物件進行靠左、置中、靠右等對齊方式。但當選取的物件是複數以上時，使用對齊工具會讓所有物件根據你選擇的對齊方式重新排列，有時候我們想維持原本物件排列的方式，這時候就可以在選取完後，滑鼠移到對齊工具上並且按著Shift鍵，這時候你會發現對齊工具的圖示改變(如下圖)，在按下想使用的對齊方式後，物件則會維持原本的置放樣式進行對齊。
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/e9e248cc-fb99-440c-804a-aff2f75de0ac)
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/2de171ea-de2d-4552-b09d-feaff193505b)

### Applying transformations
當你使用Select Matching layers後選擇好物件時，可以發現就算物件是不同大小或不同角度，只要他是相同的物件並且名稱相同，Select Matching layers一樣會選取到同樣名稱物件(大小、角度不同)，如果想要將這些角度不同的相同物件統一，使用Select Matching layers選取完成後，參考右側工作資訊欄位，在角度的位置上顯示為“Mixed”，這時候只需要打入想統一的角度為何，即使三個相同物件角度不同也會直接變成統一的角度(長寬大小也是同樣方式)。
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/405b32d1-d42f-422f-b865-1bcb1dd18d09)

### Re-parenting nested frames
在卡片的設計上，常常會有一個最大的Frame裡有物件跟Frame組合而成，如果當設計上需要調整位置，想把在不同Frame相同物件移至指定的Frame，就算Frame的大小不同只要名稱相同也可以完成你的需求。
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/402f11f1-7d3f-47da-9c82-d7050b555f41)
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/e3510819-0c01-40e3-8f80-103ffee75df5)

### Multi-edit copy and paste
如果有物件想要複製到另一個Frame，但維持原本位置，現在可以直接選取物件，並且選擇要複製到的Frame上，貼上時就會照著原本複製的物件位置顯示。這時候有更有趣的方式，可以同時選擇多個Frame裡的多個物件，複製到多個空白Frame，他會依據順序來貼上物件到新的空白Frame上。
![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/77717533/6d1212e9-76f6-418b-8522-97efa03ce037)

## 教學體驗檔案(使用此檔案來實際運用新功能)
https://www.figma.com/file/YxgZjBM0ucIQLIQPWk0sEs/Multi-edit-play-ground-Test?type=design&node-id=0%3A1&mode=design&t=Qt8VOziJxgb7toLz-1

## Reference 
- [What's New in Figma](https://www.figma.com/whats-new/?utm_source=figma&utm_medium=email&utm_campaign=figma_monthly_mar2024&utm_content=figma_team&mkt_tok=Nzc4LU1FVS0yODEAAAGSJuVJuh96W-XqWdxY_Uo616RM6SgdXhFFif53GFReKLbKDquykx5nNcbDOeEKWx4CWGbaH0GucxtHHWPhaAU7rg7B8Gs_giySsQFOyiqEDiM)

- [Meet Multi-edit | Figma](https://www.youtube.com/watch?v=XfHSWfCrX58&list=PLXDU_eVOJTx4fIgW4YtLfxlbuv9BuHCac)

- [Figma Multi-edit 批次修改讓變更與管理元件更具彈性](https://medium.com/titansoft/figma-multi-edit-%E6%89%B9%E6%AC%A1%E4%BF%AE%E6%94%B9%E8%AE%93%E8%AE%8A%E6%9B%B4%E8%88%87%E7%AE%A1%E7%90%86%E5%85%83%E4%BB%B6%E6%9B%B4%E5%85%B7%E5%BD%88%E6%80%A7-8f7fb694caa1)
