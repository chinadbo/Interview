- [CS](#cs)
  - [进程 🆚 线程](#进程--线程)
      - [进程间通信](#进程间通信)
      - [线程间通信](#线程间通信)
  - [事务](#事务)
  - [设计模式](#设计模式)
    - [观察者模式 🆚 发布-订阅者模式](#观察者模式--发布-订阅者模式)
  - [算法](#算法)
    - [DFS 🆚 BFS](#dfs--bfs)
      - [深度优先搜索 Depth-First-Search](#深度优先搜索-depth-first-search)
      - [广度优先搜索 Breadth-First-Search](#广度优先搜索-breadth-first-search)
    - [排序](#排序)
    - [基本算法](#基本算法)
    - [正则表达式](#正则表达式)
    - [问题](#问题)

# CS

## 进程 🆚 线程

- 进程是一个动态的过程，是一个活动的实体
- 进程是操作系统进行资源分配和调度的最小单元
- 线程是程序执行流的最小单元
- 一个进程由一个或多个线程组成，线程是一个进程中代码的不同执行路线
- 进程之间相互独立，线程之间共享内存空间
- 调度和切换：线程上下文切换比进程切换快得多

单线程 - 顾名思义只有一条线程在执行任务

多线程 - 创建多条线程同时执行任务

并发 - 同时进行多种时间，这几种时间并不是同时进行的，而是交替进行的。

并行 - 同时进行多种事情

**线程间共享** 堆地址空间，全局变量
**线程独享** 栈，寄存器，程序计数器

**线程状态：**

1. 新创建 New
2. 就绪状态 Runnable
3. 运行状态 Running
4. 阻塞状态 Blocked
5. 死亡状态 Dead

**进程调度**
![进程调度](https://user-gold-cdn.xitu.io/2019/10/21/16deecc24dfd080c)

1. 先到先得 FCFS
2. 轮转
3. 最短进程优先
4. 最短剩余时间
5. 最高响应比优先
6. 反馈法

#### 进程间通信

1. 无名管道：半双工通信方式，数据只能单向流动，且只能在具有亲缘关系的进程间（父子通信）。
2. 命名管道： 半双工通信方式，允许没有亲缘关系的进程通信
3. 消息队列：消息队列是有消息的链表，存放在内核中，并由消息队列标识符标识，消息队列克服了信号传递信息少，管道只能承载无格式字节流以及缓冲区大小受限的缺点
4. 共享内存（shared memory）：共享内存就是映射一段能被其他进程所访问的内存，这段共享内存由一个进程创建，但多个进程都可以访问。共享内存是最快的 ipc 通信方式，它是针对其他进程间通信方式运行效率低而专门设计的。它往往和其他通信方式如信号量，配合使用来实现进程间的同步和通信。
5. 信号（sinal）：信号是一种比较复杂的通信方式，用于通知接受进程某个事件已经发生。
6. 信号量（semophonre）：信号量是一个计数器，可以用来控制多个进程队共享资源的访问。它常作为一个锁机制，防止某进程在访问共享资源时，其他进程也访问此资源。因此，主要作为进程间以及同一进程内不同线程之间的同步手段。
7. 套接字（socket）：套接字也是一种进程间通信机制，与其他通信机制不同的是，它可用于不同设备间的进程通信。
8. 全双工管道：共享内存、信号量、消息队列、管道和命名管道只适用于本地进程间通信，套接字和全双工管道可用于远程通信，因此可用于网络编程。

#### 线程间通信

- 锁机制：包括互斥锁、条件变量、读写锁
  - 互斥锁：提供以排他方式防止数据结构被并发修改的方法
  - 读写锁：允许多个线程同时共享数据，而对写操作互斥。
  - 条件变量：可以以原子的方式阻塞进程，直到某个特定条件为真为止。对条件的测试是在互斥锁的保护下进行的。条件变量始终与互斥锁一起使用。
- 信号量机制（Semaphore）：包括无名进程信号量和命名线程信号量
- 信号机制（Signal）：类似进程间的信号处理

## 事务

> 事务是逻辑上的一组操作，要么都执行，要么都不执行。

**事务的特性：**

1. 原子性
2. 一致性
3. 隔离性
4. 持久性

## 设计模式

1. 外观模式
   > 它为子系统的一组接口提供一个统一的高层接口，使子系统更容易使用，也就是把多个子系统中复杂逻辑进行抽象，从而提供一个更统一、更简洁、更易用的 API

```
// 绑定事件
function addEvent(element, event, handler) {
  if (element.addEventListener) {
    element.addEventListener(event, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, handler);
  } else {
    element['on' + event] = fn;
  }
}

// 取消绑定
function removeEvent(element, event, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(event, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + event, handler);
  } else {
    element['on' + event] = null;
  }
}
```

2. 代理模式
   - 增加对一个对象的访问控制
   - 当访问一个对象的过程中需要添加额外的控制
3. 工厂模式（Factory Pattern）
   ```
   function BMWCar(color) {
     this.color = color
     this.brand = 'BMW'
   }
   ```
4. 单例模式（Singleton Pattern）
   ```
   const SingleService = (function(){
     function service(){}
     let singleService
     return {
       getSetvice:function() {
         if(singleService) return singleService
       }
     }
   })()
   ```

### 观察者模式 🆚 发布-订阅者模式

![观察者模式 🆚 发布-订阅者模式](https://user-gold-cdn.xitu.io/2017/11/22/15fe1b1f174cd376)

观察者模式：
![观察者模式](https://user-gold-cdn.xitu.io/2017/11/22/15fe1b1f1797e09a)

发布-订阅者：
![发布-订阅者](https://user-gold-cdn.xitu.io/2017/11/22/15fe1b1f07c13719)

1. 观察者模式中，观察者是知道 Subject，Subject 一直保持着对观察者进行记录。
2. 发布-订阅者模式，发布者（Publisher）和订阅者（Subscriber）不知道对方的存在，只能通过消息代理通信。
3. 发布-订阅者中，组件是松散耦合的，与观察者模式相反
4. 观察者模式大多数是同步的，比如当时间触发，Subject 就会去调用观察者方法。发布订阅者通常通过消息队列异步处理。
5. 观察者模式需要在单个应用程序地址空间中出现，而发布订阅者更像是交叉模式。

```
// 发布订阅模式简单版
class Events {
  constructor() {
    this.handlers = {};
    return this;
  }
  on(eventName, callback) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(callback);
  }
  off(eventName, callback) {
    if (!this.handlers[eventName]) return;
    this.handlers[eventName] = this.handlers[eventName].filter(
      (item) => item !== callback
    );
  }
  emit(eventName, ...rest) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((cb) => cb.apply(this. rest));
    }
  }
  once(eventName, callback) {
    function fn() {
      callback()
      this.off(eventName, callback)
    }
    this.on(eventName, fn)
  }
}
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

![时间复杂度](https://upload-images.jianshu.io/upload_images/1867034-1d3e43cdb301fc9b.png)

```
const swap = (arr, i, j) => {
  [arr[i], arr[j]] = [arr[j], arr[i]]
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
        // [arr[i], arr[j+1]] = [arr[j+1], arr[i]]
        swap(arr, i, j+1)
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
    // [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    swap(arr, i, minIndex)
  }
  return arr
}
```

3. 插入排序

> 以第一个元素为有序数组，其后的元素通过在已有序的数组中找到合适的位置并插入
> 平均 O(n2)
> ![insertSort](https://upload-images.jianshu.io/upload_images/1867034-d1537e355abdd298.gif)

方法 1:

```
function insertSort(arr) {
  let len = arr.length
  for (let i = 1; i < len;i++) {
    let temp = arr[i]
    let j = i
    for(;j>0;j--) {
      if(temp > arr[j-1]) {
        break;// 当前数大于前一个数，证明有序，退出循环
      }
      arr[j] = arr[j-1] // 将前一个数复制到后一个数上
    }
    arr[j]=temp // 找到考察的数应在的位置
  }
  return arr
}
```

方法 2：

```
function insertSort(arr){
  const len = arr.length
  for(let i = 1; i < len; i++) {
    let j = i - 1
    let temp = arr[i]
    while(j>=0&&temp<arr[j]){
      arr[j+1]=arr[j]
      j--
    }
    arr[j+1]=temp
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
  let result = []
  while(left.length && right.length) {
    if(left[0] < right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  result = result.concat(lest, right)
  /**
  while(left.length) {
    result.push(left.shift())
  }
  while(right.length) {
    result.push(right.length)
  }
  */
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

### 基本算法

[剑指 OFFER](https://blog.csdn.net/weixin_42235173/article/details/90897252)

1. 数组交集

   > 给定 nums1 = [1, 2, 2, 1]，nums2 = [2, 2]，返回 [2, 2]。

   ```
   const intersection = (arr1, arr2) => arr1.filter(some => arr2.includes(some))
   ```

   多个数组之间

   ```
   const intersection = (...args) => args.reduce(
     (acr, cur) => acr.filter(item => cur.includes(item))
   )
   ```

2. 字符串的大小写取反
   ```
   const processStr = str => str.split('').map(item => item === item.toUpperCase() ? item.toLowerCase() : item.toUpperCase()).join('')
   ```
3. 字符串 S 中查找字符串 T 的位置
   ```
   const findSonStrIndex = (S, T) => {
     if(S.length < T.length) return -1
     for(let i = 0; i<S.length;i++) {
       if(S.slice(i, i+T.length) === T) return i
     }
     return -1
   }
   ```
4. 旋转数组
   ```
   const rotate(arr, key) => {
     const len = arr.length
     const step = key % len
     return arr.slice(-step).concat(arr.slice(0, len - step))
   }
   ```
5. 对称数
   ```
   const reverseFind = max => {
     const result = []
     for (let i = 0, i < max; i++) {
       const origin = '' + i
       const reverse = origin.split('').reverse().join('')
       if(origin === reverse) {
         result.push(i)
       }
     }
     return result
   }
   ```
6. 数组 0 移至末尾（愿数组上操作）
   ```
   function zeroMove(array){
     const len = array.length
     let j = 0;
     for (let i = 0; i < len - j; i++) {
       if(array[i] === 0) {
         array.push(0)
         array.splice(i, 1)
         i--
         j++
       }
     }
     return array
   }
   ```
7. currying add

   ```
   function curryingAdd(...outer) {
     let result = 0
     result = outer.reduce((acr, cur) => acr + cur, result)

     const ret = function(...inner) {
       result = inner.reduce((acr, cur) => acr+cur, result)
       return ret
     }
     ret.toString = function() { return result}
     ret.valueOf = function() { return result}

     return ret
   }
   ```

8. 两数之和
   ```
   function findTwoSum(arr, target) {
     let result = []
     for (let i = 0, ilen = arr.length; i < ilen;i++) {
       let another = target - arr[i]
       let index = arr.indexOf(another, i)
       if(index > 0) {
         result.push(i, index)
         // break
       }
     }
     return result
   }
   ```
9. 中位数

   ```
   function mid(arr1, arr2) {
     let arr = []
     while(arr1.length && arr2.length) {
       if(arr1[0] < arr2[0]) {
         arr.push(arr1.shift())
       } else {
         arr.push(arr2.shift())
       }
     }
     arr = arr.concat(arr1, arr2)
     const len = arr.length
     if(len % 2) {
       return arr[Math.floor(len/2)]
     } else {
       return (arr[len/2 -1] + arr[len/2]) / 2
     }
   }
   ```

10. 数字变反序字符串
    ```
    const numReStr = num =>
        num != 0 ? `${num%10}${numReStr(num/10>>0)}` : ''
    const numReStr = num => num.toString().split('').reverse().join('')
    ```
11. 数组中抽取不重复的数

    ```
    const sliceArray = (arr, size) => {
      let result = [];
      const len = arr.length;
      const arr_ = [...arr];

      for (let i = 0; i < size; i++) {
        let key = Math.floor(Math.random() * arr_.length);
        result.push(arr_[key]);
        arr_.splice(key, 1);
      }
      console.log(result);
      return result;
    };
    ```

12. flat 对象

    ```
    const flatObj = (obj, parentKey='', result={}) {
      for(const key in obj) {
        if(obj.hasOwnProperty(key)) {
          const keyName = `${parentkey}${key}`
          if(typeof obj[key] === 'object') {
            flatObj(obj[key], `${keyName}.`, result)
          }else {
            result[keyName]=obj[key]
          }
        }
      }
      return result
    }
    // { 'a.b.c.dd': 'abcdd', 'a.d.xx': 'adxx', 'a.e': 'ae' }
    ```

13. 计算 1-n 中出现的 1 的次数
    ```
    const findOne = n => {
      let str = ''
      while(n>0) {
        str+=n
        n--
      }
      return str.split('').filter(n => n==='1').length
    }
    ```
14. 牌顶牌底
    ```
    const sort = arr => {
      let pre = []
      while(arr.length>1){
        pre.push(arr.pop())
        pre.push(arr.shift())
      }
      pre.push(arr.pop())
      console.log(pre)
      return pre
    }
    ```
15. 二进制转 base64
    ```
    String.fromCharCode(...new Unit8Array(response.data))
    ```
16. normalize 函数
    > `'[abc[bcd[def]]]' --> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}`
    ```
    function normalize(str) {
      let result = {}
      str
        .split(/[\[\]]/)
        .filter(item=>item)
        .reduce((acr, cur, index, arr) => {
          acr.value = cur
          if(index !== arr.length - 1) {
            return acr.children = {}
          }
        }, result)
      return result
    }
    ```
17. 十进制转二进制
    ```
    const toBit = num => {
      const res = []
      while(num>0){
        res.unshift(num%2)
        num=Math.floor(num/2)
      }
      return res.join('')
    }
    ```
18. 判断成对符号

    ```
    const validParentheses = str => {
      if(!str) return false
      const len = str.length
      if(len % 2 !== 0) return false
      const maps = {
        '(': 1,
        '[': 2,
        '{': 3,
        ')': -1,
        ']': -2,
        '}': -3
      }
      const stack = []
      for(let i = 0;i < len;i++) {
        const cur = maps[str[i]]
        if(cur > 0) {
          stack.push(cur)
        }else {
          if(cur + stack.pop() !== 0) return false
        }
      }
      if(stack.length === 0) return true
      return false
    }
    ```

19. 三数之和
    ```
    function threeSumZero(arr) {
      const len = arr.length;
      if (len < 3) return [];
      const nums = arr.sort((a, b) => a - b);
      const result = [];
      for (let i = 0; i < len; i++) {
        if (nums[i] > 0) break;
        if (nums[i] === nums[i - 1]) continue;
        let l = i + 1;
        let r = len - 1;
        while (l < r) {
          let sum = nums[i] + nums[l] + nums[r];
          if (sum === 0) {
            result.push([nums[i], nums[l], nums[r]]);
            while (l < r && nums[l] === nums[l + 1]) {
              l++;
            }
            while (l < r && nums[r] === nums[r - 1]) {
              r--;
            }
            l++;
            r--;
          } else if (sum < 0) {
            l++;
          } else {
            r--;
          }
        }
      }
      console.log(result);
      return result;
    }
    ```
20. 红绿灯
    ```
    async function step(color, duration) {
      console.log(color)
      await new Promise((resolve, reject) => setTimeout(resolve, duration))
    }
    async function showLight() {
      while(true) {
        await step('red', 3000)
        await step('green', 1000)
        await step('yellow', 2000)
      }
    }
    ```
21. 最大无重复子串长度
    ```
    function loneSubStr(s) {
      const arr = s.split('')
      const len = arr.length
      if(len === 1) return 1
      const maxLen = 0
      for(let i=0;i<len-1;i++){
        let str = arr[i]
        for(letj=i+1;j<len;j++){
          if(str.indexOf(arr[j]) !=== -1) {
            maxLen = str.length > maxLen ? str.length : maxLen
            break;
          }
          str += arr[j]
          maxLen = str.length > maxLen ? str.length : maxLen
            break;
        }
      }
      return maxLen
    }
    ```
22. 最大子串和

    ```
    const maxSum = arr => {
      let current = 0
      let sum = 0
      for(let i = 0,ilen=arr.length;i<ilen;i++) {
        if(current > 0) {
          current+=arr[i]
        } else {
          current = arr[i]
        }

        if(current>sum) {
          sum = current
        }
      }
      return sum
    }
    ```

23. 最大公共子串
    ```
    const findSubstr = (str1, str2) => {
      if(str1.length > str2.length) {
        [str1, str2] = [str2, str1]
      }
      const len1 = str1.length
      const len2 = str2.length
      for(let j = len1;j>0;j--) {
        for(let i = 0;i<len1-j;i++) {
          const current = str1.substr(i,j)
          if(str2.indexOf(current) >=0) {
            return current
          }
        }
      }
      return ''
    }
    ```
24. 最大子序列长度
    ```
    function lcs(str1, str2) {
      const len1 = str1.length
      const len2 = str2.length
      const dp = [new Array(len2+1).fill(0)]
      for(let i = 1; i<= len1;i++) {
        dp[i] = [0]
        for(let j = 1;j<=len2;j++) {
          if(str1[i-1]===str2[j-1]) {
            dp[i][j]=dp[i-1][j-1]+1
          } else {
            dp[i][j]=Math.max(dp[i-1][j], dp[i][j-1])
          }
        }
      }
      return dp[len1][len2]
    }
    ```
25. 最长公共前缀
    ```
    function longFirstStr(strs) {
      if (strs === null || strs.length === 0) return "";
      let prevs = strs[0];
      for (let i = 0, ilen = strs.length; i < ilen; i++) {
        let j = 0;
        for (; j < prevs.length && j < strs[i].length; j++) {
          if (prevs.charAt(j) !== strs[i].charAt(j)) break;
        }
        prevs = prevs.substr(0, j);
        if (prevs === "") return "";
      }
      return prevs;
    }
    ```
26. 斐波拉
    ```
    const cache = []
    function fib(n) {
      if(cache[n]) return cache[n]
      if(n<=2) {
        cache[n]=1
        return 1
      }
      cache.push(fib(n-1) + fib(n-2))
      return cache[n]
    }
    ```
27. 链式调用
    ```
    class LazyManClass {
      constructor(name) {
        this.name = name
        console.log(`My name is ${name}`)
        this.queue = []
        setTimeout(() => this.next(), 0)
      }
      eat(food) {
        const fn = () => {
          console.log(`I am eating ${food}`)
          this.next()
        }
        this.queue.push(fn)
        return this
      }
      sleepFirst(time) {
        const fn = () => {
          setTimeout(() => {
            console.log(`Wait first for ${time}ms`)
            this.next()
          }, time)
        }
        this.queue.unshift(fn)
        retur this
      }
      sleep(time) {
        const fn = () => {
          setTimeout(() => {
            console.log(`wait for ${time}ms`)
            this.next()
          }, time)
        }
        this.queue.push(fn)
        return this
      }
      next() {
        const fn = this.queue.shift()
        fn && fn()
      }
    }
    function lazyMan(name) {
      return new LazyManClass(name)
    }
    lazyMan('Tom').eat('eggs').sleepFirst(1000).eat('apple').sleep(2000).eat('junk food')
    ```
28. setTimeout 实现 setInterval
    ```
    function mySetInterval() {
      mySetInterval.timer = setTimeout(() => {
        arguments[0]()
        mySetInterval(...arguments)
      }, arguments[1])
      mySetInterval.clear = function () {
        clearTimeout(mySetInterval.timer)
      }
    }
    ```
29. 实现 multiRequest
    ```
    function multiRequest(urls, maxNum, callback) {
      let urlCount = urls.length;
      let requestQueue = [];
      let result = [];
      let currentIndex = 0;
      const handleRequest = (url) => {
        const req = fetch(url).then(res => {
          const len = result.push(res)
          if (len < urlCount && currentIndex + 1 < urlCount) {
            requestQueue.shift()
            handleRequest(urls[++i])
          } else if (len === urlCount) {
            typeof callback === 'function' && callback(result)
          }
        }).catch(e => result.push(e))
        if (requestQueue.push(req) < maxNum) {
          handleRequest(urls[++i])
        }
      };
      handleRequest(urls[i])
    }
    ```
30. 实现 once 函数
    ```
    function once(func) {
      let flag = true
      return function() {
        if(flag) {
          func.apply(this, arguments)
          flag = false
        }
        return undefined
      }
    }
    ```
31. 连续数字格式化
    ```
    // 1,3,4,5,7,8
    //=> 1, 3-5, 7-8
    function formatNum(...nums) {
      const arr = nums.sort((a, b) => a - b);
      const len = arr.length;
      let idx = 0;
      let temp = [[arr[0]]];
      for (let i = 1; i < len; i++) {
        if (arr[i] - 1 === arr[i - 1]) {
          temp[idx].push(arr[i]);
        } else {
          temp[++idx] = [arr[i]];
        }
      }
      for (let j = 0, jlen = temp.length; j < jlen; j++) {
        const len = temp[j].length;
        if (len > 1) {
          temp[j] = `${temp[j][0]}->${temp[j][len - 1]}`;
        } else {
          temp[j] = `${temp[j][0]}`;
        }
      }
      return temp.join(", ");
    }
    ```
32. 字符串转换
    ```
    function trans(str) {
      if (typeof str !== "string") return "";
      let len = str.length;
      if (len < 2) return str;
      let idx = 1;
      let nums = 1;
      let res = str[0];
      let last = res;
      while (idx < len) {
        if (str[idx] === last) {
          nums++;
          if (idx === len - 1) {
            res = res + nums;
            break;
          }
        } else {
          res = res + (nums > 1 ? nums : "") + str[idx];
          last = str[idx];
          nums = 1;
        }
        idx++;
      }
      return res;
    }
    console.log(trans("aaabcccaa"));
    // a3bc3a2
    ```
33. 全排列
    ```
    function permute(...nums) {
      const res = [];
      nums.sort((a, b) => a - b);
      find(nums, []);
      return res;
      function find(nums, temp) {
        const len = nums.length;
        if (nums.length === 0) {
          res.push(temp.slice());
        }
        for (let i = 0; i < len; i++) {
          temp.push(nums[i]);
          const copy = nums.slice();
          copy.splice(i, 1);
          find(copy, temp);
          temp.pop();
        }
      }
    }
    ```

### 正则表达式

1. 判断正确的网址
   ```
   const reg = /^(?:(https?|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^?#]*)+)?(\?[^#]+)?(#.+)?$/i
   ```
   ```
   function isURL(str) {
     try{
       const {
         href, origin,
         host, hostname,
         pathname
       } = new URL(str)
       return true
     }catch(e) {
       return false
     }
   }
   ```
2. search params
   ```
   // https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800,700&local_province_id=33
   // elective ['800', '700']
   function getVal(url) {
     if(!url) return
     const res = url.match(/(?<elective)(\d+(,\d+)*)/)
     res ? res[0].split(',') : []
   }
   // or
   url = new URLSearchParams(url).get('elective)
   ```
3. 匹配连续出现子串
   ```
   str.match(/(.)\1+/g)
   // 'aassscvbaff'
   // ['aa', 'sss', 'ff']
   ```
4. 数字每三位加逗号
   ```
   const addComma = str =>
    str.replace(/(\d)(?=(\d{3})+\b)/g, '$1,')
   ```
   ```
   const addComma = str => str.replace(/(?!\b)(?=(\d{3})+\b)/g, ',')
   ```
5. 十六进制颜色值
   ```
   string.match(/#[0-9A-Fa-f]{6}|#[0-9a-fA-F]{3}/)
   ```
6. 时间
   ```
   const reg = /^(0?[1-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5]|[0-9])$/
   ```
7. 日期
   ```
   const reg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
   ```
8. windows 文件路径
   ```
   const reg = /^[a-zA-Z]:\\([^\\:*<>|"?\r\n/]+\\)*([^\\:*<>|"?\r\n/]+)?$/;
   ```
9. 匹配 id `<div id="leo" class="good">`
   ```
   const reg = /id=".*?"/
   const reg2 = /id="[^"]*"/
   ```
10. trim
    ```
    const trim = str => str.replace(/^\s+|\s+$/g, '')
    ```
11. 每个单词首字母大写
    ```
    const toFirstUpper = str => str.toLowerCase().replace(/(?:^|\s)\w/g, c => c.toUpperCase())
    ```
12. 驼峰下划线转换

    ```
    const toUnderLine = str => str.replace(/(^\b[A-Z])|([A-Z])/g, (a, b, c) => {
      if(a===b) return a.toLowerCase()
      return `_${a.toLowerCase()}`
    })

    const toHump = str => str.replace(/\_(\w)/g, (a,b,c) => b.toUpperCase())
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
   ```
   Number.prototype.add = function(i=0) {
     return this.valueOf() + i
   }
   Number.prototype.minus = function(i=0) {
     return this.valueOf() - i
   }
   ```

合并 K 个有序链表
求数独
二叉树的层级遍历
二叉树的锯齿形层级遍历
字符串翻转
重排链表
二叉树插入节点
二叉搜索树节点删除
链表翻转
接雨水
旋转有序数组的峰值数字
有序矩阵的第 k 小数字
编辑距离
二分查找
找出小于并且最接近目标数字的数
寻找旋转排序数组中的最小值
不同路径
两两交换链表中的节点
山脉数组的峰顶索引
盛最多水的容器
