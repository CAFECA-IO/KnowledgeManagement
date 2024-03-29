# Next & React & Typescript

```
npx create-next-app --ts
```

# Next 主要特點

- [Next \& React \& Typescript](#next--react--typescript)
- [Next 主要特點](#next-主要特點)
- [SSR](#ssr)
  - [SSR (Server-side rendering)](#ssr-server-side-rendering)
  - [SSG (Static Side Generation)](#ssg-static-side-generation)
  - [CSR (Client Side Rendering)](#csr-client-side-rendering)
  - [Next.js 中的 CSR、SSR 與 SSG](#nextjs-中的-csrssr-與-ssg)
- [File-based routing](#file-based-routing)
  - [Static Routes](#static-routes)
- [Dynamic Route Example with Context and I18n by Typescript](#dynamic-route-example-with-context-and-i18n-by-typescript) 

# SSR

## SSR (Server-side rendering)

SSR 保有 SPA 換頁時不會閃爍的優點，還可以讓伺服器動態地注入資料到 HTML 的檔案中，讓瀏覽器端第一次請求拿到的 HTML 就已經包含所有的資料，因此 google 爬蟲也就可以順利地爬到網站中的內容。
大部分的時候這種方式的使用者體驗更好。但問題就在於使用 SSR 就必須有個伺服器一直處理使用者的請求，一直產生有資料的 HTML，並送到瀏覽器端，這樣的工作對於伺服器來說是一個負擔。
SSR 來說伺服器會在頁面中的資料都準備完畢後，才給使用者有資料的 HTML 檔案，因此在載入速度的體驗上是 SSR 更為快一些。而 SSG 則是在 build 的時候就已經產生資料，使用者在進入一個網站後，伺服器可以直接回應已經產生的 HTML 檔案，而且因為有 cache 的機制，載入速度整體上是三者中最快的。

## SSG (Static Side Generation)

SSG 意味著所有的內容都在 bulid 的時候都打包進入檔案中，所以使用者在瀏覽網站時，就可以拿到完整的 HTML 檔案。優點除了可以有利於 SEO 之外，還有因為每次使用者拿到的 HTML 內容都不會變，所以還可以讓 HTML 被 cache 在 CDN 上，很適合用在資料變動較小的網站中，像是部落格、產品介紹頁這種應用中。

但使用 SSG 這項技術時，除了必須考量到頁面資料更新頻率的問題，再者要衡量隨著應用越來越大時，打包的時間也會隨之增長。

## CSR (Client Side Rendering)

CSR 如同其名，是將渲染資料的所有過程都交由瀏覽器端處理，使用者在瀏覽網站時，第一次跟伺服器請求的 HTML 檔裡面幾乎不包含任何的內容，伺服器並沒有傳入資料到 HTML。接著，後續會再透過載入的 bundle，也就是 JavaScript 的檔案，再讓 JS 執行 AJAX 跟伺服器請求資料，最後將資料渲染到畫面上。

## Next.js 中的 CSR、SSR 與 SSG

在 Next.js 中要實作這三種模式語法會有點不一樣，以下為必須知道的三個 function：

getStaticProps (SSG)： 在 build 的時候抓取資料

```
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

...

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post: Post = await res.json();

  return {
    props: {
      post,
    },
  };
};
```

getStaticPaths (SSG)：在 Next.js 的 dynamic routes 的時候使用

```
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

...

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post: Post = await res.json();

  return {
    props: {
      post,
    },
  };
};
```

getServerSideProps (SSR)：在使用者進入網頁時，每一次發送請求伺服器都會抓取資料
UseEffect (CSR): 在 component mount 第一次時呼叫，可以用來抓取資料

# File-based routing

在 Next.js 可以分為三種的 routing 方式，分別為：

- static routes
- dynamic routes
- catch all routes

## Static Routes

首先是 static routes，舉一個例子，像是我們在前一天使用 create-next-app 產生的專案中，裡面有個 `pages/index.tsx` ，所以在瀏覽網頁時使用的路徑就會是 `/` 。再舉另一個例子，如果有個檔案是被放置在 pages/post.tsx ，而路徑就會是 `/post`；如果是 `page/post/index.tsx` 跟前面一樣的意思，同樣路徑會是 `/post` 。

這是最基本定義 page 的方式，用資料夾層級的方式來決定 url 會長什麼樣子.

要注意的是，如果是 component 是一個 page，則它必須用 `default export` 而不是 `named export`。

# Dynamic Route Example with Context and I18n by Typescript

在此 dynamic route 解決方案中，我們將添加一個新的 trading component，該 component 利用 Next.js dynamic routing 根據提供的 ticker ID 顯示交易資訊。此解決方案涉及使用 `getStaticProps` 和 `getStaticPaths` function 生成靜態站點(Static Site Generation)，再把兩個 function 拿到的資料放到 Page component

- `getStaticProps`: 在 build 時獲取資料並將資料作為 props 回傳給 page component，用於 SSG for dynamic routes，頁面是在 build time (構建時) 從 server 拿資料而生成的。

```tsx
export const getStaticProps: GetStaticProps<IPageProps> = async ({
	params,
	locale,
}) => {
	if (!params || !params.tickerId || typeof params.tickerId !== 'string') {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			tickerId: params.tickerId,
			...(await serverSideTranslations(locale as string, ['common', 'footer'])),
		},
	};
};
```

- `getStaticPaths`: 是一個生成要在 build time pre-rendered 的 dynamic routes 列表的 function 。 它用於指定應用程序中可用的 dynamic routes。 每個 route 都由一個 object 表示，該 object 包含表示 dynamic route 參數的 params 屬性。

```tsx
/**
 * @note getStaticPaths
 * In development (npm run dev or yarn dev), getStaticPaths runs on every request.
 * In production, getStaticPaths runs at build time.
 * set `fallback: false` to return `404` when url is out of dynamic routes list
 */
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
	const paths = tickerIds
		.flatMap((id) => {
			return locales?.map((locale) => ({
				params: { tickerId: id },
				locale: locale,
			}));
		})
		.filter(
			(path): path is { params: { tickerId: string }; locale: string } => !!path
		);

	return {
		paths: paths,
		fallback: false,
	};
};
```

- `Trading Page Component`

```tsx
const Trading = (props: IPageProps) => {
  useEffect(() => {
    // Renew the page when url is different and after the page is ready/rendered because we use `context` to retrive the data by API

  }, [...]);

  if (!router.isFallback && !props.tickerId) {
    return <Error statusCode={404} />;
  }

  return (...)
};

export default Trading;

```

###### tags: `Next` `React` `Typescript`
