# shipline

> A Vue.js project

## install Node.js

install Node.js>=8.0

[Node.js download](https://nodejs.org/)
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
# serve api at localhost:10072
npm run server
# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## folder tree
```
├─api 服务端接口
│  ├─bak
│  │  └─ejs
│  └─shipline api文件
├─bhx 本地生成html,json
├─build
├─config
├─dist 编译后静态文件
│  └─static
│      ├─css
│      └─js
├─src 源文件
│  ├─api 已废除，移至根目录
│  ├─assets
│  ├─components Vue组件
│  ├─ejs 已废除，移至/api/shipline
│  ├─resource 配置文件
│  └─router
└─static
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
