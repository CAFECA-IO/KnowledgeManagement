# 為什麼使用 MJML ？

電子報是企業與使用者之間最直接、也是最穩定的聯繫方式。然而透過 HTML 手刻 Email 絕非易事，原因是各個 Email Client 對常用 CSS 屬性的普遍支援度不高。尤其是排版常用到的 `flex` 和 `grid` ，在 Gmail 和 Outlook 都無法使用。

而 MJML 這個工具，能處理 Email 在不同客戶端和設備上的相容性問題，降低開發難度。

<aside>
💡

想了解各家 Email Client 的支援程度，可以到 [Can I email](https://www.caniemail.com/) 查詢。

</aside>

MJML（Mailjet Markup Language）是一個專為簡化電子郵件開發而設計的標記語言框架。它能將內容轉譯成支援 Gmail、Outlook、Apple Mail 等大多數 Email Client 的 HTML 結構，讓開發者專注於郵件內容的設計與排版。

主要優點：

- 簡化的語法結構，降低開發難度。
- 自動處理 `跨平台` 和 `跨設備` 的相容性。
- 支援響應式設計。
- 開源專案，社群活躍，有官方網站和 `VS Code` 插件。

# 撰寫 MJML

安裝 MJML CLI 工具：

```bash
npm install mjml
```

如果在 VS Code 上開發，可以安裝 [`MJML Official`](https://marketplace.visualstudio.com/items?itemName=mjmlio.vscode-mjml)  套件，它提供以下功能：

- 美化 MJML 排版
- 轉譯後 HTML 的即時預覽（與實際輸出略有出入）
- 自動格式化 MJML 原始碼

![截圖 2025-04-16 上午11.48.53.png](attachment:c8fecb56-5430-4133-aa90-f31f3215e272:截圖_2025-04-16_上午11.48.53.png)

## MJML 核心架構

MJML 是一種 XML 語法的語意化標記語言，其結構包含三層：

```xml
<mjml>
  <mj-head>
    <!-- 樣式、字體、meta 等設定 -->
  </mj-head>

  <mj-body>
    <!-- 信件的主要內容 -->
  </mj-body>
</mjml>
```

## 常用標籤分類與說明

### Meta / 設定用標籤

| 標籤 | 說明 |
| --- | --- |
| `<mj-attributes>` | 設定全域預設樣式。 |
| `<mj-preview>` | 信件在收件匣中的預覽文字。 |
| `<mj-style>` | 自訂 CSS（會被 inline 處理）。 |
| `<mj-font>` | 引入自定義字體。 |
| `<mj-class>` | 宣告樣式群組，可重複套用。 |
| `<mj-all>` | 套用所有元件的全域樣式設定。 |

### 功能元件

| 標籤 | 說明 |
| --- | --- |
| `<mj-wrapper>` | 包住多個 `<mj-section>`，通常用於統一背景或邊框。 |
| `<mj-raw>` | 插入原生 HTML（如 `<table>`）。 |
| `<mj-include>` | 導入外部 MJML 檔案，常用於模組化。 |

### Layout 元件

排版階層：**mj-section > mj-group > mj-column**

| 標籤 | 說明 |
| --- | --- |
| `<mj-section>` | 橫向排列的容器。 |
| `<mj-column>` | 縱向排列的容器。 |
| `<mj-group>` | 包住多個 `<mj-column>` ，使其在桌機版橫排，並在手機版不自動堆疊。 |

### Content 元件

| 標籤 | 說明 |
| --- | --- |
| `<mj-hero>` | 大圖區塊，通常用於主視覺。 |
| `<mj-text>` | 文字元件。支援行高、顏色、字體大小等設定。 |
| `<mj-image>` | 圖片元件。類似 `<img />` 。 |
| `<mj-button>` | 可自訂的 CTA 按鈕，支援樣式與連結。 |
| `<mj-divider>` | 水平分隔線。 |
| `<mj-spacer>` | 插入空白空間，可自訂高度。 |

## 範本參考

```xml
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Barlow" />
      <mj-class
        name="header"
        color="white"
        font-style="italic"
        font-weight="800"
        font-size="20px"
      />
      <mj-class
        name="title"
        color="#525252"
        font-style="italic"
        font-weight="600"
        font-size="20px"
      />
      <mj-class name="button" background-color="#6464c8" color="white" font-size="14px" />
      <mj-class
        name="text"
        color="#525252"
        font-weight="400"
        font-size="12px"
        line-height="16px"
        letter-spacing="1px"
      />
    </mj-attributes>
  </mj-head>

  <mj-body>
    <!-- Header -->
    <mj-section background-color="#6464c8">
      <mj-column>
        <mj-text mj-class="header">My Header</mj-text>
      </mj-column>
    </mj-section>

    <!-- Banner -->
    <mj-section
      background-url="https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?cs=srgb&dl=pexels-thatguycraig000-1563356.jpg&fm=jpg"
      background-size="cover"
      background-repeat="no-repeat"
    >
      <mj-column>
        <mj-text align="center" color="#fff" font-size="40px" font-family="Helvetica Neue"
          >Slogan here</mj-text
        >
        <mj-button mj-class="button" href="#">Promotion</mj-button>
      </mj-column>
    </mj-section>

    <!-- Intro Text -->
    <mj-section background-color="#c8c8ff">
      <mj-column width="400px">
        <mj-text mj-class="title">My Awesome Text</mj-text>
        <mj-text mj-class="text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna
          efficitur, eu semper augue semper. Aliquam erat volutpat. Cras id dui lectus. Vestibulum
          sed finibus lectus, sit amet suscipit nibh. Proin nec commodo purus. Sed eget nulla elit.
          Nulla aliquet mollis faucibus.
        </mj-text>
        <mj-button mj-class="button" href="#">Learn more</mj-button>
      </mj-column>
    </mj-section>

    <!-- Side Image Part -->
    <mj-section background-color="white">
      <!-- Left Image -->
      <mj-column>
        <mj-image
          width="200px"
          src="https://images.unsplash.com/photo-1526512340740-9217d0159da9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmVydGljYWx8ZW58MHx8MHx8fDA%3D"
        ></mj-image>
      </mj-column>

      <!-- Right Paragraph -->
      <mj-column>
        <mj-text mj-class="title">Very Cool</mj-text>
        <mj-text mj-class="text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna
          efficitur, eu semper augue semper. Aliquam erat volutpat. Cras id dui lectus. Vestibulum
          sed finibus lectus.
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section background-color="#6464c8">
      <mj-column>
        <mj-image width="40px" src="https://www.isuncloud.com/logo/cafeca_active.svg"></mj-image>
      </mj-column>
      <mj-column>
        <mj-image width="40px" src="https://www.isuncloud.com/logo/isunfa_active.svg"></mj-image>
      </mj-column>
      <mj-column>
        <mj-image width="40px" src="https://www.isuncloud.com/logo/mermer_active.svg"></mj-image>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

![截圖 2025-04-24 上午9.50.30.png](attachment:0060dbf1-ac05-4453-8777-3d9872e508db:截圖_2025-04-24_上午9.50.30.png)

<aside>
💡

每個 MJML 標籤皆有對應的屬性（如 padding、align、color 等），可用來細部調整樣式與排版。詳細可參考 [MJML 官方文件](https://documentation.mjml.io/#supported-components) 中各元件的說明頁面。

</aside>

# 寄送郵件

排版完成後就可以準備寄出郵件了，這個步驟會用到以下兩個套件：

1. [mustache](https://www.npmjs.com/package/mustache) 
    
    Mustache 是一種輕量級「邏輯少模板語言（logic-less template）」
    
    可將資料注入至字串或 HTML 中。
    
    透過 Mustache 可以將變數注入刻好的 MJML 範本裡，使信件內容能依據使用者資料動態產生。
    
2. [nodemailer](https://www.npmjs.com/package/nodemailer)
    
    Nodemailer 是一個 Node.js 的套件，支持 SMTP、OAuth2 等協議。可以用它製作簡易的寄信 API。
    

<aside>
💡

如果想更多 nodemailer 的資訊，請參考我過去寫的[這篇文章](https://mermer.com.tw/en/knowledge-management/20240910001)。本文不會深入說明其設定細節。

</aside>

## 建立範本

將要插入資料的地方以 `{{變數名稱}}`  標記。以下為範例（為了輕便這裡只截取部分）：

```xml
<!-- Intro Text -->
<mj-section background-color="#c8c8ff">
  <mj-column width="400px">
    <mj-text mj-class="title">{{title1}}</mj-text>
    <mj-text mj-class="text"> {{article1}} </mj-text>
    <mj-button mj-class="button" href="{{learnMoreLink}}">Learn more</mj-button>
  </mj-column>
</mj-section>

<!-- Side Image Part -->
<mj-section background-color="white">
  <!-- Left Image -->
  <mj-column>
    <mj-image width="200px" src="{{imageUrl}}"></mj-image>
  </mj-column>

  <!-- Right Paragraph -->
  <mj-column>
    <mj-text mj-class="title">{{title2}}</mj-text>
    <mj-text mj-class="text"> {{article2}} </mj-text>
  </mj-column>
</mj-section>
```

## 轉換 HTML

```tsx
// src/pages/api/v1/send_email.ts

// 1. 讀取 MJML 範本
const rawMjml = fs.readFileSync(path.resolve(process.cwd(), `${MJML_FILE}`), 'utf8');

// 2. 使用 Mustache 注入變數
const renderedMjml = Mustache.render(rawMjml, templateData);

// 3. 轉換成 HTML
const { html, errors } = mjml2html(renderedMjml);
if (errors.length) {
  // response error
}
```

## 發送郵件

```tsx
// 設置郵件選項
const mailOptions: SendMailOptions = {
  from: emailData.sender, // 寄件者
  to: emailData.recipient, // 收件者
  subject: emailData.subject, // 主旨
  text: JSON.stringify({ html }), // 文字內容
  html, // 轉換後的 HTML 內容
};

// 呼叫自定義 class "MailService" 發送郵件
const mailServiceInstance = MailService.getInstance();
const success = await mailServiceInstance.sendMail(mailOptions);

if (success) {
  // success handle
} else {
  // fail handle
}
```

## 測試範例：POST Body

```json
// POST API body example
{
  "templateData": {
    "title1": "Welcome to Our Weekly Update",
    "article1":
      "Stay informed with the latest news, insights, and product updates tailored just for you.",
    "learnMoreLink": "https://example.com/learn-more",
    "imageUrl":
      "https://images.unsplash.com/photo-1731466224983-01f32f883ea7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D",
    "title2": "New Feature: Smart Reporting",
    "article2":
      "Our latest release includes a smarter way to track performance. Explore customizable dashboards and real-time alerts.",
  }
}
```

你可以透過 Postman 呼叫 API，測試郵件是否能成功渲染與寄出。

![email_example.png](attachment:a56be222-021a-44b2-8f9c-0367c60554d2:email_example.png)

# 注意事項

### 安裝套件

請確認你安裝的是官方維護的 VS Code 套件 [MJML Official](https://marketplace.visualstudio.com/items?itemName=mjmlio.vscode-mjml) 。

此套件具備以下特性：

- 維護較穩定。
- 自動輸出 HTML。
- 支援即時預覽。

⚠️ 不建議使用另一款 [MJML 套件](https://marketplace.visualstudio.com/items?itemName=attilabuti.vscode-mjml)，該套件已停止更新，功能也較不完整。

### 添加註解

MJML 的註解和標準 HTML 一樣是使用 `<!-- ... -->` ，且可以放在任何層級中。

🚨請特別注意：

- **MJML 在轉換 HTML 時會保留註解。**
- 雖然不會顯示在畫面上，但收件者仍可從 Email 原始碼中看到。
- **請勿在註解中留下敏感資訊或內部備註。**

### 插入圖片

在 MJML 中插入圖片有幾點需要注意：

- MJML **不支援本地圖片路徑**（例如 `/public/logo.png`），必須使用**完整 URL** 或 **CDN 上的圖片網址。**
- 圖片連結必須是**公開可存取的 URL**（HTTP/HTTPS）。
- 大多 Email Client 不支援 `svg` 格式的圖檔，建議使用 `png` 或 `jpg` 。
- 建議在圖片加上 `alt` 屬性，避免 Outlook 或某些平台關閉圖片預覽後顯示空白。
- 建議圖片不要過大（通常寬度 600px 以內較佳）。

### 垃圾郵件

為了避免垃圾郵件氾濫的問題，許多電子郵件供應商都會設置過濾郵件的機器人。如果郵件中出現不適當的內容，就很可能被機器人阻擋。

為防止寄出的郵件被歸類為垃圾信，請避免以下常見問題：

- 內容包含[垃圾郵件觸發詞](https://www.benchmarkemail.com/tw/blog/%E5%9E%83%E5%9C%BE%E9%83%B5%E4%BB%B6%E8%A7%B8%E7%99%BC%E8%A9%9E%E8%A1%A8/)，例如：「大優惠」、「免費」、「點擊此處」、大量「$」符號等。
- 內容包含縮短後的網址（如 [bit.ly](http://bit.ly/)、tinyurl 等），可能被認定為惡意連結。
- 郵件中包含過多連結。
- 圖片不完整或無替代文字：
    - 圖片地址無效
    - 沒有 `alt` 描述
    - 信件中只有圖片、沒有任何文字內容
- 主旨與郵件內容不符。

# 參考資料

- [讓 Email 切版不再可怕－MJML 初次使用心得](https://uu9924079.medium.com/%E8%AE%93-email-%E5%88%87%E7%89%88%E4%B8%8D%E5%86%8D%E5%8F%AF%E6%80%95-mjml-%E5%88%9D%E6%AC%A1%E4%BD%BF%E7%94%A8%E5%BF%83%E5%BE%97-2b9748a47f87)
- [製作 RWD email 工具：MJML，如何使用及注意事項](https://www.letswrite.tw/mjml-rwd-email/)
- [mjml - 如何快速编写响应式电子邮件？](https://www.cnblogs.com/xjnotxj/p/11186255.html)
- [MJML Guides](https://documentation.mjml.io/)
- [10個方法避免成為垃圾郵件](https://www.benchmarkemail.com/tw/blog/10%E5%80%8B%E6%96%B9%E6%B3%95%E9%81%BF%E5%85%8D%E6%88%90%E7%82%BA%E5%9E%83%E5%9C%BE%E9%83%B5%E4%BB%B6/)
