
# 什麼時候用 Server Side Rendering 與 Static Side Generation
Next.js 是一個基於 React 的框架，它同時支援 SSR (Server Side Rendering) 與 SSG (Static Side Generation) 兩種方法，不需要很多的設定就可以讓網站同時有這兩種功能。SSG 與 SSR 不一樣地方是，SSG 是 next build 打包 HTML 後，每次使用者都會是拿到一樣的 HTML。SSR 則是每次使用者瀏覽頁面時，伺服器都會重新建立 HTML，會回傳新的 HTML 給使用者。

Next.js 在設計上可以混用兩種方法，像是 /page-a 希望能夠 SSR，因為網站內容很常改變，需要 API 支援變動頻繁的資料；而 /page-b 則是使用 SSG 則是可以用在內容較不常改變的頁面，例如 Landing Page 或部落格等。

## Static Side Generation
Static Side Generation 指的是在打包階段會將所有渲染所需要的資料都準備好，包括呼叫 API 的資料，最後會將資料都嵌入到 HTML 檔案之中，因此使用者在瀏覽網站時就會直接拿到已經渲染完的 HTML 靜態檔案。

### getStaticProps
Next.js 提供了一個 function — `getStaticProps` ，它可以自動地在程式碼打包階段自動執行執行上述的流程，我們不必做過多的設定就可以撰寫 pre-rendering 的程式碼。

- 範例 
path: ` pages/home.tsx` Next.js 會在 next build 的階段為符合的頁面產生 .html 檔案：

```typescript=
import { GetStaticProps } from "next";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface HomeProps {
  post: Post;
}

export default function Home({ post }: HomeProps) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

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
其中 getStaticProps 還有一個選擇性的參數 revalidate，它可以用來決定一個頁面多久會重新打包一次。
#### revalidate
```typescript=
export async function getStaticProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  return {
    props: {},
    revalidate: 60,
  }
}
```
https://vercel.com/docs/next.js/incremental-static-regeneration*

revalidate: 60 的意思是說頁面會 60 秒後就會失去 cache 的作用，Next.js 必須為這個頁面重新打包一次，但是如果沒有使用者瀏覽這個頁面的話，Next.js 也不會主動重新打包這個頁面。

而這個設定實際上運作的方式如下：

60 秒以前：這時不論跟伺服器請求幾次這個頁面，都會回應同樣的 HTML 給使用者
60 秒以後：當使用者瀏覽頁面時看到的仍然是舊的內容，但是伺服器發現這個頁面已經不再被 cache，所以會重新執行 getStaticProps ，進行重新打包的流程。在打包完成之後，Next.js 會更新 cache，並且當有使用者瀏覽該頁面時，看到的都會是新的內容。
以 revalidate: 60 作為範例，Next.js 會修改 header 中的 Cache-Control 數值， s-maxage 會等於 revalidate 設定的數值。

```
Cache-Control: s-maxage=60, stale-while-revalidate
```

### getStaticPaths 是用來事先定義哪些頁面需要產生 HTML 檔案。
```typescript=
export async const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { ... } }
    ],
    fallback: boolean
  };
}
```
getStaticPaths 我們需要回傳一個物件，物件中必須包含兩個 key，分別為 params 與 fallback ， params 定義的是 SSG 對應的路由有哪些， fallback 則是定義使用者瀏覽 params 沒有定義的頁面時的對應方式。當 fallback 為 true 或 'blocking'時，是 Next.js 實作的一種功能叫做 Incremental Static Regeneration，這個功能是在 next build 打包階段不用生成所有的頁面，而是讓頁面可以動態的生成，它能夠幫助我們降低打包時間，在使用者請求頁面時才動態地生成頁面。
#### fallback
`fallback` 允許傳入三種值，分別為 `true` 、 `false` 與 `'blocking'` ，以下是 Next.js 中的型別定義：

-  當 fallback: false 時
fallback 為 false 的行為很單純，意思是說當使用者瀏覽沒有定義在 getStaticPaths 中的頁面時，會回傳 404 的頁面。

-  當 fallback: true 時
使用 fallback: true 的使用比較複雜一點，因為與 fallback: false 不同的點在於，當使用者瀏覽沒有在 getStaticPaths 中定義的頁面時，Next.js 並不會回應 404 的頁面，而是回應 fallback 的頁面給使用者。
這個流程會呼叫 getStaticProps ，在伺服器產生資料前，使用者瀏覽的是 fallback 的頁面，在 getStaticProps 執行完後，同樣由 props 注入資料到網頁中，使用者這時就能看到完整的頁面。
而經過這個流程的頁面，該頁面會被加入到 pre-rendering 頁面中，下次如果再有同樣頁面的請求時，伺服器並不會再次的重新呼叫 getServerSideProps ，產生新的頁面，而是回應已經產生的頁面給使用者。

- 當 fallback: 'blocking' 時
在 getStaticPaths 使用這個設定時，跟 fallback: true 一樣，在使用者瀏覽不存的頁面時，伺服器不會回傳 404 的頁面，而是執行 getStaticProps ，走 pre-rendering 的流程。
但是與 fallback: true 不一樣的點在於沒有 router.isFallback 的狀態可以使用，而是讓頁面卡在 getStaticProps 的階段，等待執行完後回傳結果給使用者。
所以使用者體驗會非常像似 getServerSideProps ，但優點是下次使用者再次瀏覽同一個頁面時，伺服器可以直接回傳已經生成的 HTML 檔案，往後甚至可以藉由 CDN 的 cache 提升頁面的載入速度。


#### fallback: true v.s. fallback: 'blocking'
fallback 為 true 或 'blocking'，對於使用者來說兩個的體驗差別是有沒有 fallback page， 設定fallback: true 能夠用 isFallback 判別目前的 fallback 階段，並回傳 loading 的特效或是其他的 component 給使用者，而設定 'blocking' 則沒有 fallback page，更像是 SSR 的體驗，使用者會等待頁面生成完畢後，直接看到完整的網頁內容。
- `'blocking'` ：官方推薦使用這個參數，原因雖然沒有說，但是在 Next.js 的 GitHub issue 中翻了一會兒，會發現 'blocking' 的好處是有利於 SEO，雖然對於會執行 JavaScript 的 Google 爬蟲沒有影響，但是像是 Facebook 或 Twitter 等不會執行 JavaScript 的爬蟲， 'blocking' 才能確保爬蟲拿到的資料是完整的。
- `true` : 如上述，因為 true 會使爬蟲看到的是 fallback page，如果沒有執行 JavaScript，則無法拿到更新後的內容，如此對於 SEO 不利。但是，對於需要經過 authentication 的頁面或是後台頁面來說，也許 true 是一個好的選擇，因為不用在意 SEO，而且透過 web skeleton 可以讓使用者更快地看到網頁預載入的內容框，從另一個面向來看是可以優化 UX 的選擇。

## Server Side Rendering
### getServerSideProps
根據 Next.js 官方說明，如果需要每次使用者瀏覽網頁時，伺服器都能呼叫 API，將最新的資料都注入到 HTML，則可以選擇使用 getServerSideProps 。否則，如果不在意使用者是否拿到最新的資料，可以考慮使用 getStaticProps 。

再從使用者體驗的觀點來看，SSG 除非是設定 fallback: 'blocking' ，否則使用者在 SSG 的頁面看到內容的平均速度會比 SSR 更快，會導致 web vitals 的其中一項指標 Time to First Byte (TTFB) 在 SSG 頁面的表現比較好。
```typescript=
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
```
- 範例 
```typescript=
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

// react component

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<ProductProps, Params> = async ({
  params,
}) => {
  // params! 是用來斷言 params 一定不是 null 或 undefined
  const api = `https://fakestoreapi.com/products/${params!.id}`;
  const res = await fetch(api);
  const json: ProductType = await res.json();

  return {
    props: { product: json },
  };
};
```

## Ref:
- [從零開始學習 Next.js](https://ithelp.ithome.com.tw/users/20110504/ironman/4269?page=3)
