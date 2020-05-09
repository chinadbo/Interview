i## Attention

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
