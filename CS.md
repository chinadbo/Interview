## CS

### OSI 七层模型

1. 应用层 - HTTP FTP SMTP
2. 表示层 - 加解密压缩 LPX
3. 会话层 - SSL TLS
4. 传输层 - TCP UDP
5. 网络层 - IP
6. 数据链路层
7. 物理层

### 进程 🆚 线程

- 进程是一个动态的过程，是一个活动的实体
- 进程是操作系统进行资源分配和调度的最小单元
- 线程是程序执行流的最小单元
- 一个进程由一个或多个线程组成，线程是一个进程中代码的不同执行路线
- 进程之间相互独立，线程之间共享内存空间
- 调度和切换：线程上下文切换比进程切换快得多

单线程

- 顾名思义只有一条线程在执行任务

多线程

- 创建多条线程同时执行任务

并发

- 同时进行多种时间，这几种时间并不是同时进行的，而是交替进行的。

并行

- 同时进行多种事情

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

## 算法

### DFS 🆚 BFS

#### 深度优先搜索 Depth-First-Search

> DFS 沿着树的深度遍历树的节点，尽可能深的搜索树的分之。当节点 v 的所有边都已被探寻过，将回溯到发现节点 v 的那条边的起始节点。这一过程一直进行到已探寻源节点到其他所有节点为止，，如果还有未被发现的节点，则选择其中一个未被发现的节点为源节点并重复以上操作，直到所有节点都被探寻完成。

> 简单的说，DFS 从图中的一个节点开始追溯，直到最后一个节点，然后回溯，继续追溯下一条路径，直到到达所有的节点，如此往复，直到没有路径为止。

```
const deepTraversal = node => {
  let nodes = []
  if(node) {
    nodes.push(node)
    for(let i = 0, ilen = nodes.children; i < ilen; i++) {
      nodes = [...nodes, deepTraversal(nodes.children[i])]
    }
  }
  return nodes
}
```

#### 广度优先搜索 Breadth-First-Search

> 从根节点开始，沿着图的宽度遍历节点，如果所有节点均被访问，则算法结束，BFS 同样属于盲目搜索，一般用队列结构实现。

```

const widthTraversal = node => {
  let nodes = []
  let queue = []
  if(node) {
    queue.push(node)
    while(queue.length) {
      let head = queue.shift()
      nodes.push(head)
      const children = head.children
      for (let i = 0,ilen=children.length;i<ilen;i++) {
        queue.push(children[i])
      }
    }
  }
  return nodes
}
```

### 排序

![时间复杂度](https://upload-images.jianshu.io/upload_images/1867034-1d3e43cdb301fc9b.png?imageMogr2/auto-orient/strip%7CimageView2/2)

```
const swap = (left, right) => {
  const temp = right
  right = left
  left = temp
}

```

1. 冒泡排序

   > 通过相邻元素的比较和交换
   > 平均 O(n2)
   > ![bubble sort](https://upload-images.jianshu.io/upload_images/1867034-e19840224b331fae.gif)

```
function bubbleSort(arr) {
  const len = arr.length
  for(let i = 0; i < len; i++) {
    let mark = true
    for(let j = 0; j < len - i - 1; j++) {
      if(arr[i] > arr[j+1]) {
        [arr[i], arr[j+1]] = [arr[j+1], arr[i]]
        mark = false
      }
    }
    if(mark) return
  }
  return arr
}
```

2. 选择排序

   > 每一个元素和他后面所有的元素进行比较和交换
   > 平均 O(n2)
   > ![selection Sort](https://upload-images.jianshu.io/upload_images/1867034-c6cc220cfb2b9ac8.gif)

   ```
   function selectionSort(arr) {
     let len = arr.length
     let minIndex = 0
     for (let i = 0; i < len - 1;i++) {
       minIndex = i
       for (let j = i + 1; j < len; j++) {
         if(arr[minIndex] > arr[j]) {
           minIndex = j
         }
       }
       [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
     }
     return arr
   }
   ```

3. 插入排序

   > 以第一个元素为有序数组，其后的元素通过在已有序的数组中找到合适的位置并插入
   > 平均 O(n2)
   > ![insertSort](https://upload-images.jianshu.io/upload_images/1867034-d1537e355abdd298.gif)

   ```
   function insertSort(arr) {
     let len = arr.length
     for (let i = 1; i < len;i++) {
       let temp = arr[i]
       let j = i
       while(j >= 0 && temp < arr[j-1]) {
         arr[j]=arr[j-1]
         j--
       }
       arr[j]=temp
     }
     return arr
   }
   ```

4. 希尔排序
   > 希尔排序是插入排序的一种更高效率的实现。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序的核心在于间隔序列的设定。既可以提前设定好间隔序列，也可以动态的定义间隔序列。
   > O(nlogn)
   ```
   function shellSort(nums) {
      let len = nums.length;
      // 初始步数
      let gap = parseInt(len / 2);
      // 逐渐缩小步数
      while(gap) {
        // 从第gap个元素开始遍历
        for(let i=gap; i<len; i++) {
          // 逐步其和前面其他的组成员进行比较和交换
          for(let j=i-gap; j>=0; j-=gap) {
            if(nums[j] > nums[j+gap]) {
              [nums[j], nums[j+gap]] = [nums[j+gap], nums[j]];
            }
            else {
              break;
            }
          }
        }
        gap = parseInt(gap / 2);
      }
    }
   ```
5. 归并排序

   > 采用自下而上的分而治之的迭代思想
   > O(nlogn)
   > ![Merge Sort](https://upload-images.jianshu.io/upload_images/1867034-18c70f637b5c01c2.gif)

```
function mergeSort(arr) {
  const len = arr.length
  if(len < 2) return arr;
  const middle = Math.floor(len / 2)
  const left = arr.slice(0, middle)
  const right = arr.slice(middle)
  return merge(mergeSort(left), mergeSort(right))
}
function merge(left, right) {
  const result = []
  while(left.length && right.length) {
    if(left[0] < right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  while(left.length) {
    result.push(left.shift())
  }
  while(right.length) {
    result.push(right.length)
  }
  return result
}
```

6. 快速排序

   > 选择一个元素作为基数，把比基数小的放左边，比基数大的放右边，再不断递归基数左右两边的序列，分而治之。
   > O(nlogn)
   > ![quick sort](https://upload-images.jianshu.io/upload_images/1867034-cd65e35d7dce5045.gif)

   ```
   function quickSort(arr) {
     const len = arr.length
     if(len < 2) return arr
     const pivot = arr[len-1]
     const left = []
     const right = []
     for (let i = 0; i < len -1; i++) {
       if(arr[i] < pivot) {
         left.push(arr[i])
       } else {
         right.push(arr[i])
       }
     }
     return [...quickSort(left), pivot, ...quickSort(right)]
   }
   ```

7. 桶排序
   > 取 n 个桶，根据数组的最大值和最小值确认每个桶存放的数的区间，将数组元素插入到相应的桶里，最后再合并各个桶。
   > O(n+k) k 表示桶的个数
   ```
   function bucketSort(nums) {
     // 桶的个数，只要是正数即可
     let num = 5;
     let max = Math.max(...nums);
     let min = Math.min(...nums);
     // 计算每个桶存放的数值范围，至少为1，
     let range = Math.ceil((max - min) / num) || 1;
     // 创建二维数组，第一维表示第几个桶，第二维表示该桶里存放的数
     let arr = Array.from(Array(num)).map(() => Array().fill(0));
     nums.forEach(val => {
       // 计算元素应该分布在哪个桶
       let index = parseInt((val - min) / range);
       // 防止index越界，例如当[5,1,1,2,0,0]时index会出现5
       index = index >= num ? num - 1 : index;
       let temp = arr[index];
       // 插入排序，将元素有序插入到桶中
       let j = temp.length - 1;
       while(j >= 0 && val < temp[j]) {
         temp[j+1] = temp[j];
         j--;
       }
       temp[j+1] = val;
     })
     // 修改回原数组
     let res = [].concat.apply([], arr);
     nums.forEach((val, i) => {
       nums[i] = res[i];
     })
   }
   ```
8. 堆排序

   > 根据数组建立一个堆（类似完全二叉树），每个结点的值都大于左右结点（最大堆，通常用于升序），或小于左右结点（最小堆，通常用于降序）。对于升序排序，先构建最大堆后，交换堆顶元素（表示最大值）和堆底元素，每一次交换都能得到未有序序列的最大值。重新调整最大堆，再交换堆顶元素和堆底元素，重复 n-1 次后就能得到一个升序的数组。
   > ![heap sort](https://upload-images.jianshu.io/upload_images/1867034-bf2472770e2258a9.gif)

   ```
   function heapSort(nums) {
     // 调整最大堆，使index的值大于左右节点
     function adjustHeap(nums, index, size) {
       // 交换后可能会破坏堆结构，需要循环使得每一个父节点都大于左右结点
       while(true) {
         let max = index;
         let left = index * 2 + 1;   // 左节点
         let right = index * 2 + 2;  // 右节点
         if(left < size && nums[max] < nums[left])  max = left;
         if(right < size && nums[max] < nums[right])  max = right;
         // 如果左右结点大于当前的结点则交换，并再循环一遍判断交换后的左右结点位置是否破坏了堆结构（比左右结点小了）
         if(index !== max) {
           [nums[index], nums[max]] = [nums[max], nums[index]];
           index = max;
         }
         else {
           break;
         }
       }
     }
     // 建立最大堆
     function buildHeap(nums) {
       // 注意这里的头节点是从0开始的，所以最后一个非叶子结点是 parseInt(nums.length/2)-1
       let start = parseInt(nums.length / 2) - 1;
       let size = nums.length;
       // 从最后一个非叶子结点开始调整，直至堆顶。
       for(let i=start; i>=0; i--) {
         adjustHeap(nums, i, size);
       }
     }

     buildHeap(nums);
     // 循环n-1次，每次循环后交换堆顶元素和堆底元素并重新调整堆结构
     for(let i=nums.length-1; i>0; i--) {
       [nums[i], nums[0]] = [nums[0], nums[i]];
       adjustHeap(nums, 0, i);
     }
   }
   ```

### 问题

1. 将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

   > `const arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];`

   ```
   // ES6
   [...new Set(arr.flat(Infinity))].sort((a,b) => a-b)

   // flat 1
   arr.toString().split(',')
   // flat 2
   Array.prototype.flat = function (arr) {
      return [].concat(
        ...this.map((item) => (Array.isArray(item) ? item.flat() : [item]))
      );
    };
    // flat 3
    const flat = arr => {
      while(arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
      }
      return arr
    }
    // flat4
    const flat = arr => arr.reduce(
      (acc, cur) => Array.isArray ?
      [...acc, ...flat(cur)]
      : [...acc, cur],
      []
    )

    // unique
    [...new Set(arr)]
    const unique = arr => {
      const temp = []
      for (let i = 0, ilen = arr.length; i<ilen;i++) {
        // if(arr.indexOf(arr[i]) === i) {
        //   temp.push(arr[i])
        // }
        if(temp.indexOf(arr[i]) < 0) {
          temp.push(arr[i])
        }
      }
    }

    // sort
    [].sort((a, b) => a-b)
   ```

2. sleep

```
const sleep = time => new Promise(resolve => setTimeout(resolve, time))
```

3. 实现 (5).add(3).minus(2) 功能。
