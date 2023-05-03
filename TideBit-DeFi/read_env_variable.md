This envs just works in Server Side. To access this envs in Client Side, you need declare in the next.config.js

This way:
```
module.exports = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
  }
}
```
[ref](https://stackoverflow.com/questions/66137368/next-js-environment-variables-are-undefined-next-js-10-0-5)
