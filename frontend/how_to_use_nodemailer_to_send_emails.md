# 如何使用 Nodemailer 寄送郵件

## 介紹 Nodemailer

Nodemailer 是一款能讓開發人員從 Node.js 發送電子郵件的套件，簡單好用且功能強大，安全性也十分可靠。

Nodemailer 支持多種傳輸方式，如：SMTP（Simple Mail Transfer Protocol）、OAuth2 、第三方服務如 Gmail、Outlook 等。除了可以發送純文本、 HTML 格式，它也支援嵌入圖像、附件等郵件。

## 注意事項

## **選擇合適的伺服器提供商**

大部分電子郵件提供商（如 Gmail、Outlook）都會對每天發送的郵件數量進行限制，如果你在短時間內寄送**※大量郵件**，很可能就會被標記為垃圾郵件發送者並限制使用。

因此，當你有發送大量郵件的需求（例如會員註冊信、站內通知信、密碼重設信等），就需要使用專門的電子郵件服務提供商（如 SendGrid、Mailgun 等），這些提供商針對大量郵件投遞進行優化，當然也需要支付相對的費用。

※ 根據 Google Workspace 的[說明文件](https://support.google.com/a/answer/166852?hl=zh-Hant)，Gmail 郵件的單日傳送上限如下表：

| 限制類型 | 上限 |
| --- | --- |
| 每個使用者帳戶的每日傳送限制 | • 2,000 個 <br/> • 郵件合併 (先前稱為多重傳送)：1,500 <br/> • 試用版帳戶：500 |
| 自動轉寄到其他帳戶的郵件數量，不計入每日傳送限 | 10,000 |
| 每封郵件的收件者人數（包含「收件者」、「副本」、「密件副本」欄位中的地址數） | 每封郵件總計 2,000 人(最多 500 位外部收件者) |
| 透過 SMTP 或透過 Gmail API 傳送的每封郵件收件者人數（包含「收件者」、「副本」、「密件副本」欄位中的地址數） | 100 |
| 透過 GWSMO 傳送的每封郵件收件者人數（包含「收件者」、「副本」、「密件副本」欄位中的地址數 | 100 |
| 每次寄出郵件的電子郵件地址 (收件者) 總數。舉例來說，如果將 5 封電子郵件傳送至 10 個地址，系統會計為有 50 位收件者。 | • 10,000 <br/> • 郵件合併 (先前稱為多重傳送)：1,500 |
| 主網域以外的電子郵件地址數，包括網域別名和替代網域 | 3,000 |
| 每個電子郵件地址 (每位非重複收件者) 每天只會列入計算一次： <br/> • 如有 5 封電子郵件傳送至 10 個不同的地址，則計為 10 位非重複收件者 <br/> • 如有 5 封電子郵件都傳送到同一地址，則計為 1 位非重複收件者 | • 3,000 人 • 外部收件者人數：2,000 <br/> • 試用版帳戶外部收件者人數：500 |

### 郵件附件的限制

大多數 SMTP 伺服器會限制單封郵件的檔案大小，包括附件。常見的限制範圍在 10MB 到 25MB 之間，超過這個範圍的郵件可能會被拒收或寄送失敗。

一般來說，電子郵件的附件並沒有限制格式，但有些郵件伺服器或收件人會過濾或拒收特定類型的文件，如可執行文件（.exe）、批處理文件（.bat）等。此時可以使用壓縮檔（.zip）來繞過這些限制。

關於寄送附件的方法，可以參考[官方文件](https://nodemailer.com/message/attachments/)的說明。

### 應用程式專用密碼管理

應用程式專用密碼是一種隨機生成的密碼，可以在 Google 帳戶的 `安全設定` 中生成。這種密碼讓應用程式（如 Nodemailer）繞過兩步驟驗證碼並訪問你的 Google 帳戶。

應用程式專用密碼是為了讓特定應用程式或服務訪問你的帳戶而設計，因此它只在該應用程式中有效，無法用於正常的帳戶登入。即使應用程式專用密碼外洩，攻擊者也只能訪問你授權的特定應用，無法完全控制你的帳號。你可以隨時撤銷這些密碼，避免進一步損害。

為了避免密碼外洩，**千萬不要將應用程式專用密碼直接寫在程式碼中**，而是應該儲存在環境變數（如 `.env` ）中，並在部署時透過環境配置（process.env）來使用它們。

## Next js 實踐

以下是根據 CAFECA 以往的開發經驗整理出的實踐步驟，讀者可以根據專案的需求自行調整。

### 取得 Gmail 權限

如果你的 Google 帳戶已經啟用了兩步驟驗證，那你就需要使用應用程式專用密碼（Application-specific password）來登入 SMTP 服務。請按照以下步驟來生成應用程式專用密碼：

1. 登入 Google 帳戶，在左側導航欄中點擊 `安全性` 
2. 在 `登入到 Google` 部分，點擊 `應用程式專用密碼` （如果找不到請點[這裡](https://www.shin-her.com.tw/R/07583ed)）
3. 填入應用程式名稱（例如 "Mail"），然後點擊 `建立`。
4. 將生成的應用程式專用密碼（16 英文字元）複製起來，此密碼只會出現這一次，丟失了就只能重新申請，請務必好好保存。

### 設定 .env

```bash
EMAIL_SERVICE =
EMAIL_USER =
EMAIL_PASSWORD = 
EMAIL_RECEIVER =
```

`EMAIL_SERVICE` 指的是使用的電郵伺服器，這裡就填 “gmail”。

`EMAIL_USER` 是使用者帳戶，直接貼上電子郵件地址就行了。

`EMAIL_PASSWORD` 請填入剛剛產生的應用程式專用密碼。

`EMAIL_RECEIVER` 是郵件的收件地址，請根據需求自行填入。

### 範例程式碼

首先安裝 nodemailer 套件：

```bash
npm install nodemailer
```

定義相關 Interface：

```tsx
// src/interfaces/email.ts
export interface IEmailBody {
  receiver: string; // Info: (20230324 - Julian) 收件人
  subject: string; // Info: (20230324 - Julian) 主旨
  comment: string; // Info: (20230324 - Julian) 內文
}

export interface IEmailConfig {
  service: string; // Info: (20230324 - Julian) 伺服器
  auth: {
    user: string; // Info: (20230324 - Julian) 使用者
    pass: string; // Info: (20230324 - Julian) 密碼
  };
}
```

建立發送電子郵件之 function：

```tsx
// src/lib/utils/email_sender.ts
import nodemailer from 'nodemailer';
import { IEmailConfig, IEmailBody } from '@/interfaces/email';

export async function sendEmail(emailConfig: IEmailConfig, emailBody: IEmailBody) {
  /* Info: (20230324 - Julian) create gmail service */
  const transporter = nodemailer.createTransport(emailConfig);

  /* Info: (20230324 - Julian) 設定信件模板 */
  const mailOptions = {
    /* Info: (20230324 - Julian) 寄件地址 */
    from: emailConfig.auth.user,
    /* Info: (20230324 - Julian) 收信人 */
    to: emailBody.receiver,
    /* Info: (20230324 - Julian) 主旨 */
    subject: emailBody.subject,
    /* Info: (20230324 - Julian) plaintext body */
    text: emailBody.comment,
    /* Info: (20230324 - Julian) html body */
    html: `<p>${emailBody.comment}</p>`,
  };

  /* Info: (20230324 - Julian) send mail with defined transport object */
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw error;
    } else {
      return info.response;
    }
  });

  return { success: true };
}
```

撰寫寄送電子郵件的 API：

```tsx
// src/pages/api/v1/email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '@/lib/utils/email_sender';
import { DEFAULT_SUBJECT } from '@/constants/email';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    try {
      // Info: (20230324 - Julian) 設置環境變數
      const emailConfig = {
        service: process.env.EMAIL_SERVICE as string,
        auth: {
          user: process.env.EMAIL_USER as string,
          pass: process.env.EMAIL_PASSWORD as string,
        },
      };
      // Info: (20230324 - Julian) 設置郵件內容
      const emailBody = {
        receiver: process.env.EMAIL_RECEIVER as string,
        subject: DEFAULT_SUBJECT,
        comment: request.body.comment as string,
      };

      // Info: (20230324 - Julian) 發送郵件
      await sendEmail(emailConfig, emailBody);

      // Info: (20230324 - Julian) 回應成功
      response.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      // Info: (20230324 - Julian) 回應失敗
      response.status(500).json({ success: false, message: 'Email sent failed' });
    }
  } else {
    // Info: (20240819 - Julian) 回應錯誤
    response.setHeader('Allow', ['POST']);
    response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
```

這樣就可以在專案中使用 API 來寄送郵件了：

```tsx
// src/components/contact_form.tsx (節錄)
const emailData = {
  // Info: (20240819 - Julian) 加上時間戳
  comment: `<h3>姓名：${nameInput}</h3><h3>電話：${phoneInput}</h3><h3>電郵：${emailInput}</h3><h3>訊息內容：${messageInput}</h3><p>${now}<p>`,
};

// Info: (20240819 - Julian) call API
const res = await fetch('/api/v1/email' {
  method: 'POST',
  body: JSON.stringify(emailData),
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

const result = await res.json();

const { success } = result;
...
```

<img width="1410" alt="截圖 2024-08-19 下午5 21 57" src="https://github.com/user-attachments/assets/8bd921fd-8cae-4807-b931-41ce2738bfe9">

## 參考來源

- [Nodemailer](https://nodemailer.com/)
- [ChatGPT](https://chatgpt.com/)
- [透過 Google 轉送 SMTP 轉發服務的外寄郵件](https://support.google.com/a/answer/2956491#sendinglimitsforrelay)

