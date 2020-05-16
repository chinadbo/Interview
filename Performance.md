# Performance

保持前端的可用性、稳定性（加载过慢，交互卡顿延迟）等性能问题

lighthouse webpageTest 工具分析具体指标

**window.performance.timing**
![performance timing](https://lz5z.com/assets/img/performance.png)

```

const t = window.performance.timing
const times = {
  // DNS 查询时间
  dns = t.domainLookUpEnd - t.domainLookUpStart,

  // TCP连接耗时
  tcp = t.connectEnd - t.connectStart,

  // Request请求耗时
  request = t.requestEnd - t.requestStart,

  // 读取页面第一个字节的时间
  ttfb: t.responseEnd - t.reqestStart,

  // 解析DOM树🌲的时间
  toDOMtree: t.domComplete - t.domInteractive,

  // 白屏时间
  blank: t.domLoading - t.navigationStart,

  // DOM Ready
  domReady: t.domContentLoadedEventEnd - t.navigationStart,

  // 页面加载时间
  loadPage: t.loadEventEnd - t.navigationStart,

}

```

- DOMContentLoaded: 是指页面元素加载完毕，但是一些资源比如图片还无法看到，但是这个时候页面是可以正常交互的，比如滚动，输入字符等。
- load 是指页面上所有的资源（图片，音频，视频等）加载完成。

## 性能优化

1. **页面加载速度**
2. **执行效率**
3. **交互效果**

性能指标：

1. FCP：First Contentful Paint 首次内容绘制
2. FMP：First Meaningful Paint 首次有效绘制
3. Speed Index： 速度指数，浏览器出现可是内容的时间
4. FID：First CPU Idle 主线程初次空闲时间
5. TTI：Time To Interactive 可交互时间
6. Max Potential First Input Delay： 最大无响应时间，也就是最长的 task 执行时间。
7. Total Blocking Time： 总阻塞时间
8. Largest Contentful Paint： 最大内容渲染

方法：

1. 用用 PRPL 模式立即加载
   1. P = Push 或者 Preload 最重要的资源
      `<link rel="preload" as="style" href="css/style.css">`
   2. R = Render 尽快渲染初始路由
   3. P = Pre-Cache 预缓存剩下的资源
   4. L = Lazy-load 懒加载其他路由和非关键资源
2. 消除阻塞渲染的资源
   1. 预加载
      - preload 预加载高优先级资源，不阻塞当前页面渲染
      - prefetch 预获取低优先级资源，作为缓存使用
      - dns-prefetch 预查询 DNS
      - preconnect 预先建立连接
3. 图片
   1. 高效编码图片， Imagemin 压缩图片
   2. 延迟加载图片 lazyload
   3. 合适大小的图片（宽高），加载响应式图片，`srcset`,`sizes`
   4. 下一代图片技术 webp
   5. CDN
4. html
   1. 添加 doctype，避免怪异模式（非标准排版行为）
5. css
   1. 最小化和压缩 css
   2. 导出关键 css
      - `<header><style type='text/css'>.content{...}.btn{...}`
   3. 延后非关键 css
      ```
      <header>
      <link rel='preload' as='style' href='styles.css' onload="this.onload=null;this.rel='stylesheet'">
      <noscript><link rel='stylesheet' href='styles.css'/></noscript>
      ```
      - preload 异步加载样式表
      - onload 加载完立即处理样式
      - =null 避免有些浏览器处理切换 rel 的时候重新调用
      - noscript 避免禁止使用 script
   4. 移除无用 css
   5. 使用媒体查询优化 css 背景图片
6. js

   1. 加载关键资源来提高加载速度
      - `<link rel="preload" as="script" href="critical.js">`
   2. 代码分割减少 js 负载
      - webpack,rollup 等分割代码块，动态导入 dynamic import
   3. 最小化和压缩 js
      - teser-webpack-plugin
      - gzip
   4. 移除无用代码
      - webpack-bundle-analyzer
   5. 使用现代 js `<script type="module">`
   6. 减少 js 执行时间,避免 long task
   7. 避免使用 document.write（延迟页面内容布局）

7. 字体
   1. 开启字体压缩
   2. 当加载字体资源的时候保证字体可见
8. 减少 Server 响应时间（TTFB）
9. 开启 HTTPS，HTTP/2

   ```
   server {
     listen 443 ssl http2 default_server;
     ssl_certificate    /path/to/server.cert;
     ssl_certificate_key /path/to/server.key;
     # ...}
   ```

10. 避免多页面重定向
11. 使用 video 格式代替动画内容
12. 减少第三方库代码的影响

策略：

1. 避免巨大的网络请求负载
2. 设置静态资源高效的缓存策略
3. 避免过重的 DOM size
4. 避免链式关键资源请求
5. 减少主线程工作
6. 减少请求数量，减小传输数据大小

安全问题：

1. 启用 https
2. 连接安全的 cross-origin
   - 添加`rel='noopener' rel='noreferer'` 到 link`target='_blank'`
3. 停止使用第三方不安全的库
4. 阻止复制密码 `input.addEventListener('paste',(e)=>e.preventDefault())`
5. 页面加载的时候请求 geolocation、notification 权限

# 工程化

### AST

> AST 是对源代码的抽象语法结构的树状表现形式

1. 词法分析（分词）： input ---> (tokenizer) ---> tokens
   - 对输入代码进行分词，根据最小有效语法单元，对字符串进行切割
   - 词法单元（token）：标识符、数字、运算符、空格...
2. 语法分析：tokens ---> (parser) ---> AST
   - 对词法单元进行一个整体的组合，识别语句(statement)和表达式(expression)
   - 涉及读取、暂存、回溯、暂存点销毁等操作

**Babel:**

1. 解析 parse
2. 转换 transform
3. 生成 generate

plugin:

- plugin 会运行在 presets 之前
- plugin 按正序顺序执行
- presets 倒序执行

### Webpack

流程：

1. 识别入口文件
2. 通过逐层识别模块依赖
3. 分析代码，转换代码，编译代码，输出代码
4. 生成代码

**loader 🆚 plugin**
**loader：**

1. loader 本质上是一个函数，是一个文件加载器，能够加载文件资源，并进行处理
2. loader 转换指定类型的模块

**plugin：**

3. 在 webpack 运行的生命周期中会广播出许多事件（hooks），plugin 可以监听这些事件，在合适的生命周期钩子函数通过 webpack 提供的 api 进行结果的处理
4. plugin 是一个扩展器，基于 webpack 事件流机制工作，不直接操作文件。针对 loader 结束后，打包整个过程中执行更广泛的任务比如打包优化、文件管理、环境注入等。

#### Webpack HMR 原理

![hmr](https://pic1.zhimg.com/80/v2-f7139f8763b996ebfa28486e160f6378_1440w.jpg)

1. 在 webpack 的 watch 模式下，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码以 JavaScript 对象的形式保存在内存中。
2. 主要是 webpack-dev-server 中的 webpack-dev-middleware 与 webpack 的接口交互，webpack-dev-middleware 调用 webpack 暴露的 api 对代码变化进行监听，并且告诉 webpack，将代码打包到内存中。
3. webpack-dev-server 对配置文件的一个监听（当 devServer.watchContentBase 为 true 的时候），变化后会通知浏览器 live reload，也就是浏览器刷新，并不是 HMR。
4. 在服务端和客户端使用 SockJS 建立 websocket 长链接通信，将 webpack 编译打包的各个阶段的状态信息（新模块的 hash 值）和第三步监听静态文件变化的信息传送给浏览器端。
5. webpack-dev-server 并不能请求更新的代码和不会热模块替换，而是把工作交回了 webpack，webpack 根据 webpack-dev-server 传递的信息和 dev-server 的配置决定是刷新浏览器还是热更新模块。
6. HotModuleReplacement.Runtime 热模块更新运行时根据上一步骤传递的新模块 hash 值，通过 JsonpMainTemplate.Runtime 运行时以 Ajax 形式向服务端请求所有要更新的模块的 hash 列表，然后通过 jsonp 形式请求所有的模块代码。
7. HotModulePlugin 对新旧模块进行对比，决定是否更新模块，更新之前，会检查依赖关系并且更新模块间的依赖引用。
8. 当 HMR 失败，将回退到 live reload 阶段刷新浏览器获取最新打包代码。
