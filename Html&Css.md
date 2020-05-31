- [浏览器](#浏览器)
  - [浏览器进程](#浏览器进程)
    - [浏览器渲染机制 - 流式布局模型](#浏览器渲染机制---流式布局模型)
    - [重绘和回流](#重绘和回流)
    - [浏览器缓存机制](#浏览器缓存机制)
  - [跨域](#跨域)
- [HTML](#html)
- [CSS](#css)
- [兼容性](#兼容性)

## 浏览器

### 浏览器进程

1. Browser 进程：浏览器的主进程（协调、主控），只有一个
   1. 负责浏览器界面显示，与用户交互，如前进后退。
   2. 负责各个页面管理，创建和销毁其他进程
   3. 将渲染进程得到的位图绘制到用户界面
   4. 网络资源的管理和下载
2. 插件进程
3. GPU 进程：用于 3D 绘制
4. 浏览器渲染进程（内部多线程）- 页面渲染，脚本执行，事件处理
   1. GUI 线程
   2. JS 引擎线程
   3. 事件触发线程
   4. 定时器线程
   5. 网络请求线程

**输入 URL 后发生：**

1. 浏览器开启 Browser process 浏览器进程。
2. 处理输入
   1. UI thread UI 线程控制浏览器按钮及输入框
   2. UI thread 判断输入的是 URL 还是 query
3. 开始导航
   1. 当点击回车，UI thread 通知 network thread 获取网页内容，并控制 tab 页的 spinner 展示，表示正在加载中
   2. network thread 执行 DNS 查询随后为请求建立 TLS 连接
   3. 如果 network thread 接收到重定向请求头，会通知 ui thread 要求重定向，随后另外一个 url 请求会被触发。
4. 读取响应
   1. 当请求响应返回的时候，network thread 会根据 Content-Type 和 MIME Type 判断响应内容格式
      - 如果响应内容是 html，下一步会把数据传递给 renderer process
      - 如果是 zip 或其他文件，会把相关数据传输给文件下载器
   2. Safe Browseing 会触发检查是否是恶意站点，是的话会显示告警页
5. 查找渲染进程
   1. 当第四步检查完毕，network thread 确信可以导航到请求网页，network thread 会通知 UI thread 数据已准备好
   2. UI thread 会查找到一个 renderer process 进程进行网页渲染。
6. 确认导航
   1. 上述过程，确认数据和渲染进程可用，Browser process 发送 IPC 消息给 renderer process 来确认导航。
   2. 一旦 Browser process 收到 renderer process 的渲染确认消息，导航过程结束，页面渲染过程开始
      - 地址栏会更新，展示出新网页的网页信息
      - history tab 会更新，可通过返回键返回导航来的页面（这些信息会存在硬盘）
7. 渲染进程
   1. 渲染进程包括：
      - 主线程 Main thread
      - 工作线程 Worker thread
      - 排版线程 Compositor thread
      - 光栅线程 Raster thread
   2. 构建 DOM
   3. 加载次级资源：图片 css js
   4. js 的下载与执行： 阻塞解析 html
   5. 样式计算
   6. 获取布局
   7. 绘制各元素
   8. 合成帧：
      1. 复合是一种分割页面为不同的层，并单独栅格化，随后组合为帧
      2. 主线程遍历布局树来创建层树（layer tree）
      3. 一旦层数被创建，渲染顺序被确定，主线程通知合成器线程栅格化每一层，分成多个磁贴，并发送给栅格线程。
      4. 栅格线程会栅格化每一个磁贴并发送给 GPU 显存中
   9. renderer process 渲染结束，会发送 IPC 消息给 Browser process，UI thread 会停止展示 tab 中的 spinner。

**浏览器获取资源文件的流程**
![浏览器获取资源文件的流程](https://s0.lgstatic.com/i/image/M00/07/0E/Ciqc1F647j-AFiBtAABWh7ld3uA965.png)

#### 浏览器渲染机制 - 流式布局模型

![浏览器渲染机制1](https://s0.lgstatic.com/i/image/M00/12/EE/CgqCHl7OM-CAQGiGAAFv6uHi6MI573.png)

![浏览器渲染机制2](https://camo.githubusercontent.com/bc1b4024057309bf919e96e7ccdccb39d50fa712/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f31302f313637393862386462353463616133313f773d36323426683d32383926663d706e6726733d3431303537)

1. DOM CSSOM
2. Render Tree 渲染树（只包含可见的节点）
3. Layout 回流，几何信息（位置，大小）
4. Painting 重绘，节点绝对信息
5. Display （Composition， GPU）

#### 重绘和回流

重绘：outline visibility color background-color（不会影响布局的）
回流： 布局或几何属性需要改变

**回流必定发生重绘，重绘不一定发生回流**

如何避免：

1.  css
    - transform 代替 top
    - visibility 代替 display：none
    - 避免 table 布局
    - 尽可能在 DOM 树最末端改变 class
    - 避免设置多层内联样式
    - 避免 css 表达式
    - 将动画效果运用到 position 为 absolute 或 fixed 元素上（requestAnimationFrame）
    - 将频繁重绘回流的节点设置为图层。will-change video iframe 等标签
    - CSS3 硬件加速 transform opacity filters 等
2.  js
    - 批量修改样式或 DOM
    - 避免频繁读取会引起重绘/回流的属性
    - 对具有复杂动画的元素使用绝对定位，脱离文档流

#### 浏览器缓存机制

cache-control:
![cache](https://upload-images.jianshu.io/upload_images/3174701-3fa81f5e9efac5af)

缓存机制：
![cache str](https://upload-images.jianshu.io/upload_images/3174701-9d9e8b52a18ed35a)

### 跨域

> **同源策略：** 协议，域名， 端口一致
> 同源策略限制：
>
> 1. cookie localStorage indexdDB 无法读取
> 2. DOM 和 JS 对象无法获取
> 3. AJAX 请求不能发送

1. `jsonp`跨域
   原理： 浏览器允许 html 页面标签（img,video,img,script, link)加载不同域的静态资源。
   缺点： 只能实现**get**请求

   - 原生实现

     ```
     <script>
       const script = document.createElement('script')
       script.type = 'text/javascript'
       // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
       script.src = 'http://domain.com/login?user=admin&callback=handleCallback'
       document.body.appendChild(script)

       // 回调执行函数
       function handleCallback(res) {
         console.log(res)
       }
       </script>
     ```

     服务端返回如下（返回时即执行全局函数）：
     `handleCallback({"status": true, "user": "admin"})`

   - jQuery Ajax
     ```
     $.ajax({
       url,
       type: 'get',
       dataType: 'jsonp', // 请求方式 jsonp
       jsonpCallback: 'handleCallback', // 自定义回调函数名
       data: {}
     })
     ```

2. document.domain + iframe 跨域
   原理： 两个页面通过 js 强制设置 document.domain 为基础主域
   限制： 主域相同、子域不同场景
   - 父窗口 `http://www.domain.com/a.html`
     ```
     <iframe id='child' src='http://child.domain.com/b.html></iframe>
     <script>
       document.domain = 'domain.com'
       var user = 'admin'
     </script>
     ```
   - 子窗口 `http://child.domain.com/b.html`
     ```
     <script>
       document.domain = 'domain.com'
       // 访问父窗口的变量
       console.log(window.parent.user) // 'admin'
     ```
3. location.hash + iframe 跨域
   原理： a 与 b 跨域通信，通过中间页 c 来实现，不同域通过 location.hash 传值。相同域直接 js 调用。

   - A `http://www.domaina.com/a.html`

     ```
     <iframe id='b' src='http://www.domainb.com/b.html></iframe>
     <script>
       const iframe = document.getElementById('b')
       // 向 B 传hash值
       setTimeout(() => {
         iframe.src = iframe.src + '#user=admin'
       }, 1000)

       // 全局函数 C可访问
       function onCallback(res) {
         console.log(res + ' from A')
       }
      </script>
     ```

   - B `http://www.domainb.com/b.html`
     ```
      <iframe id='c' src='http://www.domaina.com/c.html></iframe>
      <script>
        const iframe = document.getElementById('c')
        // 监听来自 A 的hash值
        window.onhashchange = function() {
          iframe.src = iframe.src + location.hash
        }
      </script>
     ```
   - C `http://www.domaina.com/c.html`
     ```
     <script>
       // 监听来自 B 的hash值
       window.onhashchange = function() {
         // 调用 A 的回调函数并传参
         window.parent.parent.onCallback('from C' + location.hash.replace('#user', ''))
       }
     </script>
     ```

4. `window.name` + iframe 跨域
   原理：name 值在不同的页面（甚至不同的域名）加载后依然存在（2MB 以内）
5. postMessage(data, origin) 跨域
   - 页面与新打开窗口的数据传递
   - 多窗口之间消息传递
   - 页面与嵌套的 iframe 消息传递
   - A
     ```
     iframe.contentWindow.postMessage(JSON.stringify(data), 'http://www.domainb.com')
     ```
   - B
     ```
     window.addEventlistener('message', function(e) {
       console.log(e.data)
     })
     ```
6. 跨域资源共享 CORS
   服务端设置 Access-Control-Allow-Origin，前端设置 withCredentials 是否带 cookie
7. nginx 代理跨域

   - 添加跨域
     ```
     location / {
       add_header Access-Control-Allow-Origin *;
     }
     ```
   - 反向代理

     ```
     location / {
       proxy_pass http://www.domainb.com:8080; // 反向代理
       proxy_cookie_domain www.domainb.com www.domaina.com; //修改cookie里域名

       add_header Access-Control-Allow-Origin http://www.domaina.com;
       add_header Access-Control-Allow-Credentials true;
     }
     ```

8. Nodejs 中间件代理跨域
   启用一个代理服务器，实现数据的转发，可以设置 cookieDomainRewrite 参数修改响应头 cookie 中域名，实现当前域的 cookie 写入。
   ```
   const express = require('express')
   const proxy = require('http-proxy-middleware')
   const app = express()
   app.use('/', proxy({
     // 代理跨域目标接口
     target: 'http://www.domainb.com:8080',
     changeOrigin: true,
     // 修改响应头信息
     onProxyRes: function(proxyRes, req, res) {
      res.header('Access-Control-Allow-Origin', 'http://www.domaina.com');
      res.header('Access-Control-Allow-Credentials', 'true');
     },
     // 修改响应头cookie中域名
     cookieDomainRewrite: 'http://www.domaina.com'
   }))
   ```
9. websocket 跨域
   webSocket 实现浏览器与服务器全双工（支持跨域）通信。
   ```
   const socket = socketIO('http://domainb.com:8080')
   // connect success
   socket.on('connect', function() {
     // listenning message
     socket.on('message', function(msg) {
       console.log(msg)
     })
     // listenning close
     socket.on('disconnect', function() {
       // close
     })
   })
   ...
   socket.send('some value')
   ```

## HTML

iframe：
缺陷：

1. 会阻塞主页面的 onload 事件
2. 搜索引擎无法解读 iframe，不利于 SEO
3. iframe 和主页面共享连接池，会影响性能

HTML5

1. 语义化标签 header footer nav section article aside audio video canvas
2. 表单 input - color data range
3. 存储 - localStorage sessionStorage IndexDB
4. geolocation web-worker

meta

- 自动刷新 `<meta http-equiv='Refresh' content='5,URL=page2.html'>`
- SEO： content description 等

**脚本加载**

异步脚本加载 defer 🆚 async

- defer：按顺序加载，加载完执行，执行完触发 DOMContentLoaded 事件
- async：不按顺序加载，加载完立即执行，触发 DOMContentLoaded 事件时机不定。
- `type='module'`按 ES6 模块进行解析，默认阻塞效果同 defer

**link**

- link 不会阻塞 dom tree 的生成，但是会阻塞 paint
- script 阻止 dom 解析

## CSS

1. 新增 CSS3 属性
   - border-radius border-image box-shadow text-shadow
   - background-size background-origin
   - transfrom animation
2. 动画
   1. `transform: translate3D(0,0,0);transition: All 0.4s ease-in-out;`
   2. `@keyframes movement{}; animation: movement 3s`
   3. requestAnimationFrame + css
3. 伪类 - 向某些选择器添加特殊的效果
   - `:link`
   - `:visited`
   - `:hover`
   - `:active`
   - `:first-child` `:last-child`
4. 伪元素 - html 中不存在的元素
   - `::before`
   - `::after`
   - `::first-line`
   - `::first-letter`
   - `::section`
5. `display: none`, `visibility: hidden`, `opacity: 0`
   - display: none (不占空间，不能点击)（场景，显示出原来这里不存在的结构）- 回流操作
   - visibility: hidden（占据空间，不能点击）（场景：显示不会导致页面结构发生变动，不会撑开）- 重绘操作 - 子孙节点可显示
   - opacity: 0（占据空间，可以点击）（场景：可以跟 transition 搭配）- 重绘操作
6. animation
   ```
   @keyframes myMove {
     from{}to{}
   }
   div{animation: myMove 5s infinite}
   ```
7. `<img src="1.jpg" style="width:480px!important;”>`让图片宽度为 300px
   - `max-width: 300px`
   - `transfrom: scale(0.625)`
   - `box-sizing: border-box;padding: 90px`
   - `@keyframes test{ from {width:300px} to {width: 300px}}`
8. 1px
   - 伪元素 + transform scaleY(0.5)
   - `box-shadow: inset 0px -1px 1px -1px #d4d6d7`
9. 文本溢出

- 单行
  ```
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ```
- 多行
  ```
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  ```

11. flex: flex-group flex-shrink flex-basis

```
<div class="container">
<div class="left"></div>
<div class="right"></div>
</div>
.container {
width: 600px;
display: flex;
}
.left1 {
flex: 1 2 500px;
// left1 = 500 - (500+400-600)*(500*2/(500*2+400*1))
}
.right1 {
flex: 2 1 400px;
}
//
.left2{
  flex: 1 2 300px;
  // left2 = 300 + (600 - 300 - 200) * (1/(1+2))
}
.right2{
  flex: 2 1 200px;
}

```

## 兼容性

1. IE6 - IE10 不支持 `const`, `let`，只支持 `var`。
2. 统一 `getElementById('idname')`获取 `html` 对象

- IE 支持 `document.idname`

3. event.x event.y

- IE 只有 `event.x`和`event.y`属性
- FireFox 只有 `event.pageX`和`event.pageY`属性

4. Event 事件

- 非 IE
- `addEventListenner`
- `removeEventListener`
- 事件对象 `event`
- 目标对象 `event.target`
- 阻止冒泡 `event.stopPropagation`
- 阻止默认事件 `event.preventDefault`
- IE
- `attachEvent`
- `detachEvent`
- 事件对象 `window.event`
- 目标对象 `event.srcElement`
- 阻止冒泡 `event.cancelBubble = true`
- 阻止默认事件 `event.returnValue = false`

5. scollTop

```

window.addEventListener("scroll", function(event) {
if (document.compatMode === "CSS1Compat") {
// -> html
document.documentElement.scrollTop;
} else {
// safari -> body
document.body.scrollTop;
}
});

```

6. 透明度

- IE `filter: alpha(opacity=60);`
- `opacity: 0.85`

7. 清除浮动

- 伪元素 `.clearfix::after{clear: both}`
- 父元素 `.parent{overflow: auto}`

8. 盒子模型
   - IE 盒子模型 box-sizing：border-box; width = content + border + padding
   - 标准盒子模型 box-sizing：content-box
9. a 标签效果顺序
   link - visited - hover - active
10. BFC 块级格式化上下文
    触发条件：

- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position（absolute、fixed）
- display 的值为 inline-block table-cell flex
- overflow 除 visible 以外的值（hidden，auto，scroll）
  特性：
- 同一个 BFC 下外边距发生重叠
- BFC 可以包含浮动的元素（清除浮动）
- BFC 可以阻止元素被浮动元素覆盖（左右两栏布局）

**移动端兼容性**

1.  上下拉动滚动条时卡顿、慢

```
body{
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch
}
```

2.  禁止复制、选中文本
    `user-select: none`
3.  禁止识别

```
<meta name='format-detection' content='email=no'>
<meta name='format-detection' content='telephone=no'>
```

4.  禁止弹出提示
    `-webkit-touch-callout: none`
5.  ios 输入框内默认阴影
    `appearance: none`
6.  ios 和 android 下触摸元素出现半透明遮罩
    `-webkit-tap-highight-color: rgba(255,255,255, 0)`
    16
7.  旋转屏幕，禁止字体变化
    `-webkit-text-size-adjust: 100%;`
8.  启用 3D 硬件加速
    `transform: translate3D(0,0,0)`
9.  Android 圆角失效
    `background-clip: padding-box`
10. IOS 键盘字母输入，默认首字母大写
    `<input type='text' autocapitalize='off' autocorrect='off'>`
11. 移动端点透问题
    由于区分单击和双击缩放，有了 300ms 延迟。
    事件顺序是 touchstart - touchmove - touchend - click
    由于 touchstart 早于 touchend 早于 click，click 的触发是有延迟的，大概 300ms，也就是我们的 tap 触发之后蒙层隐藏，300ms 后，click 触发到下面的 a 元素上。
    **解决办法：**
12. 尽量使用 touch 事件替换 click 事件
13. 使用 fastclick （300ms 后会阻止 click 事件发生）
14. 关于 iOS 系统中，中文输入法输入英文时，字母之间可能会出现一个六分之一空格
    `this.value = this.value.replace(/\u2006/g, '')`
15. 一些情况下对非可点击元素如(label,span)监听 click 事件，ios 下不会触发
    `cursor: pointer`
16. 消除 transition 闪屏

```
/*设置内嵌的元素在 3D 空间如何呈现：保留 3D*/
-webkit-transform-style: preserve-3d;
/*(设置进行转换的元素的背面在面对用户时是否可见：隐藏)*/
-webkit-backface-visibility: hidden;
```

15. android 取消语音输入按钮
    `input::-webkit-input-speech-button{display: none}`
16. 软键盘弹出，fixed 失效，input 跟随页面滚动。

```
// 要把带fixed定位的元素，和内容滚动的元素分开来，
// 滚动部分设置绝对定位和overflow-y: scroll;
// 使之自成一块，这样就不会出现页面的滚动。没有滚动，即使fixed失效也没有问题。
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  //可以滚动
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch; // 弹性
}
```

17. Android 设备图片模糊
    分辨率太小，用 2X 图片，`background-size:contain`
18. 是否全屏模式
    `<meta name="apple-mobile-web-app-capable" content="yes">`
19. 设置缓存
    `<meta http-equiv="Cache-Control" content="no-cache">`
