# blockscount 新增多國語系

> 官方文件 [Internationalization](https://docs.blockscout.com/for-developers/configuration-options/internationalization)

Step 1. 設定新語言

blocksout 本身並不提供多語言切換，因此這邊參考了

[How does internationalization switch automatically? #3609](https://github.com/blockscout/blockscout/issues/3609)

所以這邊要針對以下三個檔案做新增，以下以新增 `zh` 為例

!!!! 然後這邊要留意的是，這邊語系的名稱看起來用的是 CLDR(Unicode Common Locale Data Repository) 的格式，但不確定為什麼 `zh-Hans` 或 `zh-Hans-HK` 等字眼，之後 build 會出錯，而這邊測試的情況，兩個英文字的格式的情況下，build 會成功

`blockscout\apps\config\config.exs`

```diff
# Configures gettext
- config :block_scout_web, BlockScoutWeb.Gettext, locales: ~w(en), default_locale: "en"
+ config :block_scout_web, BlockScoutWeb.Gettext, locales: ~w(en zh), default_locale: "en"
```

`blockscout\apps\block_scout_web\lib\block_scout_web\cldr.ex`

```diff
-    locales: ["en"],
+    locales: ["en", "zh"],
```

`blockscout\apps\block_scout_web\lib\block_scout_web\router.ex`

```diff
+    plug :put_secure_browser_headers
+    plug Cldr.Plug.SetLocale,
+         apps:    [cldr: BlockScoutWeb.Cldr, gettext: :global],
+         from:    [:cookie],
+         param:   "locale"
```

然後可以看到至這邊是透過 cookie 來判斷切換的語系

Step 2. setup 語系檔

```
cd apps/block_scout_web; mix gettext.extract --merge; cd -
```

Step 3. 編輯新語系

如果沒看到要新增的語系檔，可以複製其他的來改

檔案位置：

`apps/block_scout_web/priv/gettext`

目前架構，然後檔案是 `Poedit` 格式

```
zh # 語系名稱
└── LC_MESSAGES # 固定名稱
   ├── default.po   # 一般顯示文字
   └── error.po     # 錯誤訊息
```

所以這邊直接修改新增加的 zh 語系

```
apps/block_scout_web/priv/gettext/zh/LC_MESSAGES/default.po
apps/block_scout_web/priv/gettext/zh/LC_MESSAGES/error.po
```

Step 4. 重新 Build 前端

```
cd apps/block_scout_web/assets
npm install && node_modules/webpack/bin/webpack.js --mode production
```

Step 5. 部署靜態檔

```
cd apps/block_scout_web/
mix phx.digest
```

Step 6. 啟動服務

```
screen mix phx.server
```








