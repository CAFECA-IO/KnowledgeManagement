# Create a Dynamic Sitemap in Next.js

站點地圖（Sitemap）是一個網站的結構圖，收錄整個網站中所有頁面站點間的關聯性。它可以幫助 Google 的搜尋引擎爬取頁面內容，避免頁面被搜尋引擎遺漏也縮短檢索時間，並且有助於提升網站的搜索引擎優化（SEO）。

本文將說明在 Next.js 中建立動態站點地圖的方法。

## 一、建立檔案

在 `/pages` 底下建立一個名為 `sitemap.xml.tsx` 的檔案。`.xml` 表明這是一個 XML 文件，請注意不要忽略。 

<img width="253" alt="image" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/99d610fe-2a8a-4a97-85d8-a84ebe40285b">

在 Next.js 中，每個頁面都需要導出一個 React 組件作為預設匯出 (**`default export`**)。這裡只需要直接回傳 null。

```tsx
export default function Sitemap() {
  return null;
}
```

## 二、取得全部頁面

撰寫一個 function ，將網頁中所有頁面的 URL 和最後更新的日期整理起來。

最後更新日期需要根據專案需求或其他邏輯來決定，也可以由後端提供。如果頁面內容在後端發生變化，則可以由後端的最後修改時間來設置這個值。

以 MerMer-offcial 為例，這裡是取檔案的最後修改日期，實際作法如下：

```tsx
function getLastModifiedDate(filepath: string) {
  const stats = fs.statSync(filepath);

  // 格式化日期
  const formattedMonth =
    stats.mtime.getMonth() + 1 < 10 ? `0${stats.mtime.getMonth() + 1}` : stats.mtime.getMonth() + 1;
  const formattedDay =
    stats.mtime.getDate() < 10 ? `0${stats.mtime.getDate()}` : stats.mtime.getDate();

  const formattedDate = `${stats.mtime.getFullYear()}-${formattedMonth}-${formattedDay}`;
  return formattedDate;
}
```

接著是將 URL 和最後更新日期做整理，一樣以 MerMer-offcial 為例：

```tsx
// 取得所有頁面
async function getPages() {
  // 取得首頁的最後更新日期
  const indexUpdated = getLastModifiedDate('./src/pages/index.tsx');

  // 取得全部 KM 的 URL
  const slugs = (await getSlugs(KM_FOLDER)) ?? [];

  const kmPosts = slugs.map(slug => {
    // 取得 KM 最後更新日期
    const updated = getLastModifiedDate(`./src/km/${slug}.md`);
    return {
      url: `${MERURL.KM}/${slug}`,
      updated: updated,
    };
  });

  // 整理所有的 URL 項目
  const posts = [
    {
      url: MERURL.INDEX,
      updated: indexUpdated,
    },
    ...kmPosts,
  ];

  return posts;
}
```

## 三、建立 XML 字串

<img width="1225" alt="image" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/fef65c61-e157-4ff1-99cd-378d2ed86ed4">

這是 [Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=zh-tw) 提供的 XML sitemap 範例，接下來將根據它建立一個模板，用於生成符合 XML 格式的字串。

```tsx
async function generateSitemap(): Promise<string> {
  // 取得所有頁面
  const pages = await getPages();

  //生成 XML 字串
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  // 將每個 URL 項目轉換成 XML 字串
  .map(page => 
    return `<url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${page.updated}</lastmod>
  </url>`;
  })
  // 將所有 URL 項目拼接成一個完整的 sitemap 文檔
  .join('')}
    </urlset>`;
}
```

## 四、生成 sitemap.xml

Next.js 的 `getServerSideProps` 函數會在每次收到 Server-Side Rendering (SSR) 的請求時生成 sitemap，然後傳遞給頁面組件。

執行的流程如下：

- 設置 response 的 Content-Type 為 `text/xml`，表示返回 XML 格式的內容。
- 調用 `generateSitemap` 函數以獲取 sitemap 的 XML 內容。
- 使用 `res.write` 將 XML 內容寫入 response。
- 最後 `res.end()` 結束 response 的處理。

```tsx
export const getServerSideProps: GetServerSideProps = async ctx => {
  // 設置 response header 為 XML
  ctx.res.setHeader('Content-Type', 'text/xml');

  // 生成 sitemap 內容
  const xml = await generateSitemap();

  // 將 sitemap 寫入到 response 中
  ctx.res.write(xml);

  // 結束 response
  ctx.res.end();

  // 返回一個空的 props 對象，因為在 SSR 中必須返回一個包含數據的對象
  return {
    props: {},
  };
};
```

## 五、完成

前往 `/sitemap.xml` 就可以看到完成的站點地圖了。

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/114177573/41b1242b-e087-4e7a-bc78-ea1535837231)

完整 `sitemap.xml.tsx` 程式碼如下：

```tsx
import {GetServerSideProps} from 'next';
import {MERURL} from '../constants/url';
import {DOMAIN, KM_FOLDER} from '../constants/config';
import {getSlugs} from '../lib/posts';
import fs from 'fs';

//預設匯出
export default function Sitemap() {
  return null;
}

// 生成 sitemap.xml
export const getServerSideProps: GetServerSideProps = async ctx => 
  ctx.res.setHeader('Content-Type', 'text/xml');

  const xml = await generateSitemap();
  ctx.res.write(xml)
  ctx.res.end();

  return {
    props: {},
  };
};

// (20231205 - Julian) 生成 XML 字串
async function generateSitemap(): Promise<string> {
  const pages = await getPages();

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${page
  .map(page => {
    return `<url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${page.updated}</lastmod>
  </url>`;
  })
  .join('')}
    </urlset>`;
}

// Info: (20231205 - Julian) 取得檔案的最後修改日期
function getLastModifiedDate(filepath: string) {
  const stats = fs.statSync(filepath);

  const formattedMonth =
    stats.mtime.getMonth() + 1 < 10 ? `0${stats.mtime.getMonth() + 1}` : stats.mtime.getMonth() + 1;
  const formattedDay =
    stats.mtime.getDate() < 10 ? `0${stats.mtime.getDate()}` : stats.mtime.getDate();

  const formattedDate = `${stats.mtime.getFullYear()}-${formattedMonth}-${formattedDay}`;
  return formattedDate;
}

async function getPages() {
  const indexUpdated = getLastModifiedDate('./src/pages/index.tsx');

  const slugs = (await getSlugs(KM_FOLDER)) ?? [];

  const kmPosts = slugs.map(slug => {
    const kmDate = getLastModifiedDate(`./src/km/${slug}.md`);
    return {
      url: `${MERURL.KM}/${slug}`,
      updated: kmDate,
    };
  });

  const posts = [
    {
      url: MERURL.INDEX,
      updated: indexUpdated,
    },
    ...kmPosts,
  ];

  return posts;
}
```

## 參考來源

- [How to create a Dynamic Sitemap in Next.js](https://www.youtube.com/watch?v=khYC98faSrg)
- [Google 搜尋中心](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=zh-tw)
- [How to get the last modified Date of a File in Node.js](https://bobbyhadz.com/blog/get-last-modified-date-of-file-using-node-js)
