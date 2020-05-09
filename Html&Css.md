## HTML

## CSS

1. 伪类 - 向某些选择器添加特殊的效果
   - `:link`
   - `:visited`
   - `:hover`
   - `:active`
   - `:first-child` `:last-child`
2. 伪元素 - html 中不存在的元素
   - `::before`
   - `::after`
   - `::first-line`
   - `::first-letter`
   - `::section`

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
8. a 标签效果顺序
   link - visited - hover - active
9. 创建 BFC
   - float 的值不为 none
   - position 的值不为 static 或 relative
   - display 的值为 inline-block table-cell flex
   - overflow 的值不为 visible

**移动端兼容性**

10. 上下拉动滚动条时卡顿、慢
    ```
    body{
      -webkit-overflow-scrolling: touch;
      overflow-scrolling: touch
    }
    ```
11. 禁止复制、选中文本
    `user-select: none`
12. 禁止识别
    ```
    <meta name='format-detection' content='email=no'>
    <meta name='format-detection' content='telephone=no'>
    ```
13. 禁止弹出提示
    `-webkit-touch-callout: none`
14. ios 输入框内默认阴影
    `appearance: none`
15. ios 和 android 下触摸元素出现半透明遮罩
    `-webkit-tap-highight-color: rgba(255,255,255, 0)`
    16
16. 旋转屏幕，禁止字体变化
    `-webkit-text-size-adjust: 100%;`
17. 启用 3D 硬件加速
    `transform: translate3D(0,0,0)`
18. Android 圆角失效
    `background-clip: padding-box`
19. IOS 键盘字母输入，默认首字母大写
    `<input type='text' autocapitalize='off' autocorrect='off'>`
20. 移动端点透问题
    由于区分单击和双击缩放，有了 300ms 延迟。
    事件顺序是 touchstart - touchmove - touchend - click
    由于 touchstart 早于 touchend 早于 click，click 的触发是有延迟的，大概 300ms，也就是我们的 tap 触发之后蒙层隐藏，300ms 后，click 触发到下面的 a 元素上。
    **解决办法：**
    1.  尽量使用 touch 事件替换 click 事件
    2.  使用 fastclick （300ms 后会阻止 click 事件发生）
21. 关于 iOS 系统中，中文输入法输入英文时，字母之间可能会出现一个六分之一空格
    `this.value = this.value.replace(/\u2006/g, '')`
22. 一些情况下对非可点击元素如(label,span)监听 click 事件，ios 下不会触发
    `cursor: pointer`
23. 消除 transition 闪屏
    ```
    /*设置内嵌的元素在 3D 空间如何呈现：保留 3D*/
    -webkit-transform-style: preserve-3d;
    /*(设置进行转换的元素的背面在面对用户时是否可见：隐藏)*/
    -webkit-backface-visibility: hidden;
    ```
24. android 取消语音输入按钮
    `input::-webkit-input-speech-button{display: none}`
25. 软键盘弹出，fixed 失效，input 跟随页面滚动。
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
