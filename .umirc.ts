// https://umijs.org/docs/guides/env-variables#umi_env  package.json 当指定 UMI_ENV 时，会额外加载指定值的配置文件，优先级为：
import { defineConfig } from "umi";
import postCssPxToViewport from "postcss-px-to-viewport";
console.log('.umirc')
export default defineConfig({
  title: 'BinaX',
  routes: [
    { path: "/", component: "index/index" },
    { path: "/home", component: "home" },
    { path: "/airdrop", component: "airdrop" },
    { path: "/dashboard", component: "dashboard" },
    // { path: "/index", component: "index" },
    // { path: "/docs", component: "docs" },
    // { path: "/demo", component: "Demo" },
  ],
  // 加载并且开启插件
  plugins: ['@umijs/plugins/dist/dva', '@umijs/plugins/dist/locale', '@umijs/plugins/dist/request'],
  hash: true,
  dva:{},
  locale: {
    //   // // 默认使用 src/locales/zh-CN.ts 作为多语言文件
      default: 'zh-CN',
      baseNavigator: false,
      title: true,
      // antd: true,
    //   baseSeparator: '-',
  },
  request: {
    dataField: 'data'
  },
  alias: {
    '@/': '/src',
  },
  extraPostCSSPlugins: [
    postCssPxToViewport({
      unitToConvert: 'px',
      viewportWidth: 375, //75表示750设计稿，37.5表示375设计稿
      unitPrecision: 6, // 计算结果保留 6 位小数
      selectorBlackList: ['.no-vw', 'no-vw'], // 要忽略的选择器并保留为px。
      propList: ['*'], // 可以从px更改为rem的属性  感叹号开头的不转换
      replace: true, // 转换成 rem 以后，不保留原来的 px 单位属性
      mediaQuery: true, // 允许在媒体查询中转换px。
      minPixelValue: 2, // 设置要替换的最小像素值。
      viewportUnit: 'vw',
      fontViewportUnit: "vw",
      exclude: /(node_modules)|(\-pc)|(global\-pc)/i // 排除 node_modules 文件(node_modules 内文件禁止转换)
    })
  ],
  // 兼容 es5 ，目前的缓解方法是： 调整 js 与 css 的压缩器
  jsMinifier: 'terser',
  cssMinifier: 'cssnano',
  npmClient: 'yarn',
});
