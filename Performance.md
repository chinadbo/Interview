- [Performance](#performance)
  - [性能优化](#%e6%80%a7%e8%83%bd%e4%bc%98%e5%8c%96)
- [工程化](#%e5%b7%a5%e7%a8%8b%e5%8c%96)
    - [AST](#ast)
    - [Webpack](#webpack)
      - [Webpack HMR 原理](#webpack-hmr-%e5%8e%9f%e7%90%86)
      - [webpack 优化](#webpack-%e4%bc%98%e5%8c%96)

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

前端工程化四大特性：

1. 模块化 - （在文件层面上，对代码和资源的拆分）
   - js 模块化
   - css 模块化
   - 资源模块化
     - 依赖关系单一化
     - 资源处理集中化
     - 项目结构清晰化
2. 组件化（开发）- （在设计层面上，对 UI 的拆分）
3. 自动化
   1. 持续集成
   2. 自动化构建
   3. 自动化部署
   4. 自动化测试
4. 规范化
   1. 目录结构的制定
   2. 编码规范
   3. 前后端接口规范
   4. 文档规范
   5. 组件管理
   6. Git 分支管理
   7. Commit 描述规范
   8. CodeReview

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

**具体流程**

1. 初始化参数：从配置文件和 Shell 语句汇总读取与合并参数，得出最终的参数
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，通过执行对象的 run 方法开始执行编译。
3. 确定入口：根据配置文件的 entry 找出左右入口文件
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经历了本步骤的处理。
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容及它们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再将每个 Chunk 转换成一个单独的文件加入输出列表中，这是可以修改输出内容的最后机会。
7. 输出完成：再确定好输出内容后，根据配置文件确定输出的路径和文件名，将文件的内容写入文件系统中。

在以上过程中，Webpack 会在特定的时间点广播特定的事件，插件在监听到对应的事件后执行特定的逻辑，并且插件可以调用 webpack 提供的 api 改变 webpack 的运行结果。

1. 初始化： 启动构建，读取与合并配置参数，加载 plugin，实例化 Compiler
2. 编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找出 Module 依赖的 Module，递归地进行编译处理。
3. 输出：在编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中。

**loader 🆚 plugin**
**loader：**

4. loader 本质上是一个函数，是一个文件加载器，能够加载文件资源，并进行处理
5. loader 转换指定类型的模块

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

#### webpack 优化

**总结：**

1. 分析打包速度
   - `webpack-bundle-analyzer`, `speed-measure-webpack-plugin`
2. 优化开发体验
   1. 优化构建速度
      - 开启多进程打包 thread-loader，happypack
      - 合理利用缓存 cache-loader，HardSourceWebpackPlugin
      - 优化压缩时间 terser，terser 多进程，ParallelUglifyPlugin
      - dll 动态库文件
      - 缩小文件搜索范围
        - 优化 loader 配置
        - 优化 resolve.module，优化 resolve.mainFileds、resolve.alias、resolve.extensions、resolve.noParse
   2. 优化使用体验
      - 文件刷新，自动刷新，HMR
3. 优化输出质量
   1. 减少加载时间
   2. 提升代码性能

具体：

1. 优化开发体验
   1. 优化构建速度
      - 缩小文件的搜索范围
        1. 优化 Loader 配置
           - `test: /\.js$/`优化正则表达式性能
           - `use:['babel-loader?cacheDirectory']`开启转换结果的缓存 / `cache-loader`
           - `include: path.resolve(__dirname, 'src')`只针对 src 目录下文件
        2. 优化 resolve.modules 配置
           ```
           resolve: {
             // 使用绝对路径指明第三方模块存放位置
             // 减少搜索步骤
             modules: [path.resolve(__dirname, 'node_modules')]
           }
           ```
        3. 优化 resolve.mainFields 配置
           ```
           resolve: {
             // 明确指明第三方模块的入口文件描述字段，以减少搜索步骤
             mainFields: ['main']
           }
           ```
        4. 优化 resolve.alias 配置
           ```
           resolve: {
             alias: {
               // 使用alias将导入react的语句换成直接使用单独、完整的react.min.js文件
               // 减少耗时的递归解析操作
               // 适用于整体性比较强的库
               // 不适合tree-shaking
               'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js')
             }
           }
           ```
        5. 优化 resolve.extensions 配置
           ```
           extensions: ['js', 'json']
           // 尽可能减少后缀尝试的可能性
           ```
        6. 优化 module.noParse 配置
           ```
           module: {
             // 单独完整的react.min.js文件没有采用模块化，忽略对这个文件的递归解析处理
             noParse: [/react\.min\.js$]
           }
           ```
      - 使用 DLLPlugin
        打包复用动态链接库
        DLLPlugin：用于高打包出一个个单独的动态链接库文件
        DLLReferencePlugin：用于在主要的配置文件中引入 DLLPlugin 插件打包好的动态链接库文件
        1. 构建动态链接库文件
        ```
        // webpack.dll.config.js
        const DllPlugin = require('webpack/lib/DllPlugin')
        module.exports = {
         entry:{
           // react相关的模块放置在一个单独的动态链接库中
           react: ['react','react-dom'],
           // polyfill单独放置在一个动态链接库中
           polyfill: ['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch']
         },
         output: {
           filename: '[name].dll.js',
           path: path.resolve(__dirname, 'dist'),
           library: '_dll_[name] // 防止全局变量冲突
         },
         plugins: [
           new DllPlugin({
             name: '_dll_[name]',
             path: path.join(__dirname, 'dist', '[name].manifest.json')
           })
         ]
        }
        ```
        1. 使用动态链接库文件
        ```
        // webpack.config.js
        const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
        ...
        plugins: [
          new DllReferencePlugin({
            manifest: require('./dist/react.manifest.json')
          }),
          new DllReferencePlugin({
            manifest: require('./dist/polyfill.manifest.json')
          }),
        ]
        ```
        1. 执行构建
           1. 如果动态链接库相关的文件还没有编译出来，就需要先将它们编译出来。 `webpack --config webpack.dll.config.js`
           2. 在确保动态链接库存在时，才能正常编译入口执行文件。
      - 使用 HappyPack / thread-loader
        接入：
        ```
        const happyThreadPool = Happypack.ThreadPool({size: 5})
        // 构建共享进程池，在进程池中包含5个子进程
        module: {
          rules:[
            {
              test: /.js$/,
              use: ['happypack/loader?id=babel']
            },
            {
              test: /.css$/,
              use: ExtractTextPlugin.extract({
                use: ['happypack/loader?id=css']
              })
            }
          ]
        },
        plugins: [
          new HappyPack({
            id: 'babel',
            loaders: ['babel-loader?cacheDirectory'],
            // 使用共享进程池中的子进程去处理任务
            threadPool: happyThreadPool,
          }),
          new HappyPack({
            id: 'css',
            loaders: ['css-loader'],
            // 使用共享进程池中的子进程去处理任务
            threadPool: happyThreadPool,
          })
        ]
        ```
        原理：HappyPack 将这部分耗时的 loader 处理任务分解成多个子进程去并行处理，从而减少总的构建时间。
      - 使用 ParallelUglifyPlugin
        开启多个子进程，将对多个文件的压缩工作分配给多个子进程完成。
        ```
        const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
        ...
        plugins: [
          new ParallelUglifyPlugin({
            uglifyJS: {
              output: {
                beautify: false,//紧凑输出
                comments: false,//删除注释
              },
              compress: {
                warnings: false,//删除没有用到的代码时不输出警告
                drop_console: true,//删除console
                collapse_vars: true,//内嵌已定义但只用到一次的变量
                reduce_vars: true//提取出现多次但未被定义变量的引用静态值
              }
            }
          })
        ]
        ```
   2. 优化使用体验
      1. 使用自动刷新
         - 文件监听
           ```
           module.export = {
             watch: true,
             watchOptions: {
               ignored: /node_modules/, //不监听的文件
               aggregateTimeout: 300,//截流，文件变化300ms后再去执行
               poll: 1000 // 默认美妙询问1000次
             }
           }
           ```
         - 自动刷新浏览器
           `webpack-dev-server --inline false`
         - 开启热模块更新
           `devServer.hot: true`
2. 优化输出质量
   1. 减少用户能感知到的加载时间，也就是首屏加载时间
      - 区分环境
      - 压缩代码
      - CDN 加速
      - Tree Shaking
      - 提取公共代码
      - 代码分割按需加载
   2. 提升流畅度，也就是提升代码性能
      - 使用 Prepack
        在保持运行结果一致的情况下，改变源代码的运行逻辑，输出性能更好的 js 代码。实际上 prepack 是一个部分求值器，编译代码时提前将计算结果放到编译后的代码中，而不是在代码运行时采取求值。
      - 使用 Scope Hoisting
        作用域提升，让 webpack 打包出来的代码文件更小，运行更快，`plugins:[new ModuleConcatenationPlugin()]`
3. 输出分析，分析问题所在
   1. `webpack --profile`记录构建过程中的耗时信息
   2. `webpack --json`以 json 的格式输出构建结果。
   3. `webpack-bundle-analyzer`
   4. `speed-measure-webpack-plugin`
