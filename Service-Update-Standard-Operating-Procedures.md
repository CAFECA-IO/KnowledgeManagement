# Service Update Standard Operating Procedures
## Environment
- Staging Environment: develop branch
- Production Environment: main branch

## Version Number
版號由四個部分組成，如 vX.Y.Z 其中 v 是固定前綴，X 為 APP 版本，Y 為 release version，Z 為 Hotfix version，當 X 發生變動時 Y Z 即歸零，當 Y 發生變動時 Z 即歸零。

## Test Script
- 手動測試腳本
- 自動化測試腳本 (Backend)
- 自動化測試腳本 (APP)

## Release
根據既定專案目標進行的更新，建立 release branch 時需將 Hotfix 版號歸零。Release 連續 7 天通過所有測試腳本後方能上線。

### Create Release Branch
- 基於 develop branck 建立 release branch

### Deploy to Staging
- 自動化部屬至 Staging Environment

### Stability Test
- 需連續 7 日執行所有腳本測試通過
- 當測試不通過時直接在 release branch 進行修改，並重新計算連續 7 日測試
- 連續 7 日無出現任何錯誤即結束此流程

### Finish Release Branch
- 將 release branch 合併至 develop branch
- 將 release branch 合併至 main branch
- 刪除 Release Branch
- 建立 Release Tag (GitHub)
- 建立 Release Note (GitHub)

### Deploy to Production
- 自動部署至 Production Environment

## Hotfix
上線的專案若發現程式碼異常且評估會造成嚴重問題，需緊急進入 Hotfix 流程。Hotfix 需通過所有測試腳本後方可上線。
