- [HTML](#html)
  - [重绘和回流](#%e9%87%8d%e7%bb%98%e5%92%8c%e5%9b%9e%e6%b5%81)
    - [浏览器渲染机制 - 流式布局模型](#%e6%b5%8f%e8%a7%88%e5%99%a8%e6%b8%b2%e6%9f%93%e6%9c%ba%e5%88%b6---%e6%b5%81%e5%bc%8f%e5%b8%83%e5%b1%80%e6%a8%a1%e5%9e%8b)
    - [浏览器缓存机制](#%e6%b5%8f%e8%a7%88%e5%99%a8%e7%bc%93%e5%ad%98%e6%9c%ba%e5%88%b6)
- [CSS](#css)
- [兼容性](#%e5%85%bc%e5%ae%b9%e6%80%a7)

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

异步脚本加载 defer 🆚 async
defer：按顺序加载，加载完执行，执行完出发 DOMContentLoaded 事件
async：不按顺序加载，加载完立即执行，出发 DOMContentLoaded 事件时机不定。

### 重绘和回流

#### 浏览器渲染机制 - 流式布局模型

![浏览器渲染机制](https://camo.githubusercontent.com/bc1b4024057309bf919e96e7ccdccb39d50fa712/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f31302f313637393862386462353463616133313f773d36323426683d32383926663d706e6726733d3431303537)

1. DOM CSSOM
2. Render Tree 渲染树（只包含可见的节点）
3. Layout 回流，几何信息（位置，大小）
4. Painting 重绘，节点绝对信息
5. Display （Composition， GPU）

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

## CSS

1. 新增 CSS3 属性
   - border-radius border-image box-shadow text-shadow
   - background-size background-origin
   - transfrom animation
2. 伪类 - 向某些选择器添加特殊的效果
   - `:link`
   - `:visited`
   - `:hover`
   - `:active`
   - `:first-child` `:last-child`
3. 伪元素 - html 中不存在的元素
   - `::before`
   - `::after`
   - `::first-line`
   - `::first-letter`
   - `::section`
4. `display: none`, `visibility: hidden`, `opacity: 0`
   - display: none (不占空间，不能点击)（场景，显示出原来这里不存在的结构）- 回流操作
   - visibility: hidden（占据空间，不能点击）（场景：显示不会导致页面结构发生变动，不会撑开）- 重绘操作 - 子孙节点可显示
   - opacity: 0（占据空间，可以点击）（场景：可以跟 transition 搭配）- 重绘操作
5. animation
   ```
   @keyframes myMove {
     from{}to{}
   }
   div{animation: myMove 5s infinite}
   ```
6. `<img src="1.jpg" style="width:480px!important;”>`让图片宽度为 300px
   - `max-width: 300px`
   - `transfrom: scale(0.625)`
   - `box-sizing: border-box;padding: 90px`
   - `@keyframes test{ from {width:300px} to {width: 300px}}`
7. 1px
   - 伪元素 + transform scaleY(0.5)
   - `box-shadow: inset 0px -1px 1px -1px #d4d6d7`
8. 文本溢出
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
9. flex: flex-group flex-shrink flex-basis

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
