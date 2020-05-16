- [React](#react)
  - [Redux](#redux)
    - [三大原则](#%e4%b8%89%e5%a4%a7%e5%8e%9f%e5%88%99)
      - [Action](#action)
      - [Reducer](#reducer)
      - [Store](#store)
    - [数据流](#%e6%95%b0%e6%8d%ae%e6%b5%81)
    - [Redux 中间件](#redux-%e4%b8%ad%e9%97%b4%e4%bb%b6)
    - [问题](#%e9%97%ae%e9%a2%98)
  - [React-Router](#react-router)
    - [主要组件](#%e4%b8%bb%e8%a6%81%e7%bb%84%e4%bb%b6)
    - [SSR](#ssr)
    - [代码分割 code splitting](#%e4%bb%a3%e7%a0%81%e5%88%86%e5%89%b2-code-splitting)
    - [ScrollToTop](#scrolltotop)
    - [API](#api)
    - [问题](#%e9%97%ae%e9%a2%98-1)
  - [React](#react-1)
    - [Fiber](#fiber)
    - [React 事件处理系统](#react-%e4%ba%8b%e4%bb%b6%e5%a4%84%e7%90%86%e7%b3%bb%e7%bb%9f)
    - [Reconciliation 协调(一致性比较)](#reconciliation-%e5%8d%8f%e8%b0%83%e4%b8%80%e8%87%b4%e6%80%a7%e6%af%94%e8%be%83)
      - [Diff 算法](#diff-%e7%ae%97%e6%b3%95)
    - [性能优化](#%e6%80%a7%e8%83%bd%e4%bc%98%e5%8c%96)
    - [组件生命周期](#%e7%bb%84%e4%bb%b6%e7%94%9f%e5%91%bd%e5%91%a8%e6%9c%9f)
      - [挂载](#%e6%8c%82%e8%bd%bd)
      - [更新](#%e6%9b%b4%e6%96%b0)
      - [卸载](#%e5%8d%b8%e8%bd%bd)
      - [错误处理](#%e9%94%99%e8%af%af%e5%a4%84%e7%90%86)
    - [问题](#%e9%97%ae%e9%a2%98-2)

# React

## Redux

> Redux 是 JavaScript 状态容器，提供可预测化的状态管理。
> Redux 让 state 的变化变得可预测。

### 三大原则

- 单一数据源： 整个应用的 state 存在一个 object tree 中，并且这个 object tree 只存在唯一一个 state。
- `state`是只读的： 唯一改变`state`的是`dispatch action`。（action 是一个用于描述已发生事件的普通对象）
- 使用纯函数进行修改： 编写 reducer 纯函数描述如何改变 state tree。


    ```
    import {combineReducers, createStore} from 'redux'
    const reducer = combineReducers({reducer1, reducer2})
    const store = createStore(reducer)
    ...
    store.getState()
    ...
    store.dispatch(action)
    ```

#### Action

action 是把数据从应用传到 store 的有效载荷，是 store 数据的唯一来源，本质上只是一个 JavaScript 普通对象。

```
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```

#### Reducer

reducer 指定应用状态的变化如何响应 actions 并发送到 store，actions 只是描述了有事情发生并没有描述应用如何更新 state。

```
(prevState, action) => newState
```

#### Store

Store 维持应用的`store`；提供`getState()`获取 state；提供`dispatch(action)`更新 state；提供`subscribe(listener)`注册监听器。

```
const unsubscribe=store.subscribe(() => {
  console.log(store.getState())
})
// stop subscribe
unsubscribe()
```

### 数据流

> 严格的单向数据流

用户触发 action，经过中间件，到达 reducer，reducer 处理后返回新的 state，state 一旦变化，就会调用监听函数，触发 UI 更新。

1. 调用`store.dispatch(action)`
2. Redux store 调用传入的`reducer`函数
3. 根 reducer 把多个子 reducer 输出合并成一个单一的 state 树
4. Redux store 保存了根 reducer 返回的完整 state 树

### Redux 中间件

middleware 在途中对 action 进行截获，并进行改变。

```
const doNothingMidddleware = (dispatch, getState) => next => action => next(action)
```

首先接受一个对象作为参数，对象上是 redux store 上的两个同名参数`dispacth`和`getState`；返回函数接收一个 next 类型的参数，如果调用了他，就说明这个中间件完成了自己的职能，并将 action 控制权交与下一个中间件，但这个函数不是处理 action 对象的函数。最后以 action 为参数的函数处理 action 对象，并且在这里可以调用 dispacth 派发一个新的 action 对象、调用 getstate 获取 state 等。

### 问题

1. 何时使用 Redux？
   随着时间推移，数据处于合理的变动之中，需要一个单一的数据源，在 React 顶层组件中 state 维护所有状态已无法满足需求，这时需要 Redux。
2. Reducers 之间数据共享？
   - 把所需数据当额外参数的形式传递给自定义函数。
     ```
     case 'ACTION_A':
      return {
        a: sliceReducerA(state.a, action),
        b: sliceReducerB(state.b, action, state.a)
      }
     ```
   - 给 action 添加额外数据，通过 thunk 函数或类似方法实现。
     ```
     function actionCreator() {
       return (dispatch, getState) => {
         const state = getState()
         const dataFromB = dataFromBFunction(state)
         dispatch({
           type: 'ACTION_A',
           dataFromB
         })
       }
     }
     ```
   - 结合 combineReducers 和 reducer 处理，每个 reducer 依旧更新自身数据，新创建一个 reducer 处理数据交叉场景，最后创建一个包裹函数依次调用这两类 reducer。
     ```
     const combineReducer = combineReducers({
       a: reducerA,
       b: reducerB
     })
     const crossReducer(state, action) {
       switch(action.type){
         case 'CROSS_REDUCER':
          return {
            a: handleA(state.a, action, state.b)
            b: reducerB(state.b, action)
          }
       }
     }
     const rootReducer = (state, action) {
       const intermediateState = combineReducer(state, action)
       const finalState = crossReducer(intermediateState, action)
       return finalState
     }
     ```
3. 怎样的数据放入 Redux？
   - 应用的其他部分是否关心这个数据
   - 是否需要创建衍生数据
   - 相同的数据是否会被用作驱动多个组件
   - 能否将状态恢复到特定时间点
   - 是否要缓存数据
4. 如何组织 state 嵌套和重复数据？
   当数据存在 ID、嵌套或者关联关系时，应当以 “范式化” 形式存储：对象只能存储一次，ID 作为键值，对象间通过 ID 相互引用。将 store 类比于数据库，每一项都是独立的 “表”。
5. Redux 如何实现多个组件之间的通信，多个组件使用相同状态如何进行管理
   所有的数据全部最后都在一个 state tree 上，实现多组件通信，就需要实现，一份数据多组件接收，同时组件之间发出的 action，最后需要通信的组件接收他的 state。

## React-Router

### 主要组件

1. 路由(routers)
   - `<BrowserRouter>`
   - `<HashRouter>`
2. 路径匹配(route mathes)
   - `<Route>`
   - `<Switch>`
3. 导航(navigation)
   - `<Link>`
     - `<Link to='/home'>Home</Link>`
   - `<NavLink>`
     - `<NavLink to='/react' activeClassName='active'>React</NavLink>`
   - `<Redirect>`
     - `<Redirect to="/login" />`

### SSR

```
const html = (req, context) => ReactDOMServer.renderToString(
  <StaticRouter location={req.url} context={context}>
    <Switch>
      <RedirectWithStatus status={301} from='/users' to='/profiles' />
    </Switch>
  </StaticRouter>
)

const RedirectWithStatus = ({from, to, status}) =>
(<Route render={({staticContext}) => {
  if(staticContext) staticContext.status=status
  return <Redirect from={from} to={to} />
}} />)
```

server

```
http.createServer((req, res) => {
  const context = {}
  const markup = html(req, context)

  if(context.url) {
    res.writeHead(301,{Location: context.url})
    res.end()
  } else {
    res.write(`
      <!doctype html>
      <div id='app'>${markup}</div>
    `)
    res.end()
  }
}).listen(3000)
```

### 代码分割 code splitting

1. .babelrc
   ```
   {
     "presets":["@babel/preset-react"],
     "plugins":["@babel/plugin-syntax-dynamic-import"]
   }
   ```
2. loadable-components
   ```
   import loadable from '@loadable/component'
   const loadableComponent = loadable(() => import('./Dashboard.js'), { fallback: <Loading />})
   ...
   render(){
     return (<loadableComponent />)
   }
   ```

### ScrollToTop

```
export deafult function ScrollToTop(){
  const {pathname}=useLocation()
  useEffect(() => {
    window.scrollTo(0,0)
  }, [pathname])
  return null
}
```

### API

1. Hooks
   - `useHistory`
   - `useLocation`
   - `useParams`
   - `useRouteMatch`
2. `<BrowserRouter`
   `window.history`,HTML5 history API,`pushState` `replaceState`, `popstate` event.
   - `basename='/sub-directory'`
   - `getUserConfirmation={(message, callback)=>{callback(window.confirm(message))}}`
   - `forceRefresh={true}` // full pages refresh
   - `keyLength={12}` // location.key
   - `>children</BrowserRouter>`
3. `<HashRouter`
   `window.location.hash` `hashchange`
   - `basename`
   - `getUserConfirmation`
   - `hashType` // #home or #/home or #!/home
4. history
   - `length`
   - `action`: `PUSH` | `REPLACE` | `POP`
   - `location`
   - `push`, `replace`
   - `go(n)`,`goBack()`, `goForward()`
   - `block(prompt)`
5. location
   - `pathname`
   - `search`
   - `hash`
   - `state` when `push(path, state)`

### 问题

1. `<Link>`和`<a>`的区别
   - Link 避免了一些不必要的重渲染
   - react-router 只更新变化的部分，从而减少 DOM 性能损耗

## React

### Fiber

> Fiber 是一种数据结构，用于代表某些 worker，也就是一个 work 单元，通过 fiber 架构，提供一种跟踪、调度、暂停和终止工作的方式。

Fiber 是一种重新设计的增量渲染的调度的堆栈幀，它的特性是时间分片和暂停（悬挂），它将可中断的任务拆分成多个子任务，按照优先级来自由调度子任务，分段更新，从而避免以前同步渲染引起的掉帧和卡顿现象。

**Fiber nodes**

当 react 第一次 render 的时候，react 元素第一次转换为 fiber node 的时候，react 使用 react.createElement 返回的数据创建 fiber node，随后的更新，react 将复用 fiber node,根据最新的 VirtualDOM 信息，生成一颗新的 fiber 树，这棵树每生成一个 fiber 节点，都会将控制权交回给主线程去查看有没有优先级更高的任务需要执行，如果没有，继续创建树的过程；如果有，就丢弃当前创建的树，在空闲的时候再创建一遍树。在构造 fiber 树的时候，将需要更新的节点信息（Placement、Deletion 等）存储在 Effect list 里面，在第二阶段的时候批量更新节点。

fiber node 以链表的形式组成了 fiber node tree
![fiber node tree](https://pic2.zhimg.com/80/v2-0ab001d3801fefcd634c9e0339b26545_1440w.jpg)

1.  工作过程：
    - render() 和 setState 的时候创建更新，
    - 将创建的更新加入任务队列，等待调度
    - 在 requestIdleCallback 空闲时执行任务
    - 从跟节点开始遍历 Fiber Node，并且生成 workInProgress Tree
    - 生成 effectList
    - 根据 effectList 更新 DOM
2.  如上主要分为两个阶段：
    1.  render/reconciliation：生成 Fiber 树，得出需要更新的节点信息。这个过程是渐进的，可被中断。
    2.  commit：将需要更新的节点一次性批量更新，这个过程不可被中断。(处理 effectlist（包括更新 dom 树、调用组件生命周期以及更新 ref 等内部状态)）

注：
react 调度器（Schedular）调度任务：

- synchronous，与之前的 Stack Reconciler 操作一样，同步执行
- task，在 next tick 之前执行
- animation，下一帧之前执行
- high，在不久的将来立即执行
- low，稍微延迟执行也没关系
- offscreen，下一次 render 时或 scroll 时才执行

### React 事件处理系统

> - 原生事件（阻止冒泡）**会阻止**合成事件的执行
> - 合成事件（阻止冒泡）不会阻止原生事件执行

1.  事件机制：减少内存消耗、提升性能、统一规范、兼容性。主要是对原生事件的封装、对原生事件的升级改造、对浏览器事件的兼容处理。
2.  事件注册机制
    - 事件注册（listenTo） - 组件挂载阶段，根据组件内声明的事件类型（onClick，onChange）给 document 添加事件（addEventListener）并指定统一的事件处理程序 dispatchEvent。
    - 事件存储 - 把组件内所有事件回调 listener 统一存储在一个对象（listenerBank）里，缓存起来，以便触发事件时可以找到对应的方法去执行。
3.  事件执行机制
    - 进入统一的事件分发函数 dispatchEvent
    - 结合原生事件找到当前节点的 ReactDOMComponent 对象
    - 开始事件的合成
      - 根据当前的事件类型生成指定的合成对象
      - 封装原生事件和冒泡机制
      - 查找当前元素及其父级
      - 在 listenerBank 查找事件回调并合成到 event（合成事件结束）
    - 批量处理合成事件内的回调函数。

### Reconciliation 协调(一致性比较)

目标：

> 在某一时间点调用 render 方法，会创建一颗由 React 元素组成的树；在下一次 state 或者 props 更新时，render 方法会返回一颗不同的树，React 需要基于这两棵树之间的差别判断有效更新 UI 以保证 UI 与当前树保持同步。

O(n)的启发式算法：

1. DOM 节点跨层级的移动特别少，可忽略不计
2. 拥有相同类的组件生成相似的树形结构，两个不同类型的元素产生不同的树
3. 对于同一层级的一组子节点，可以通过唯一 id 区分。通过 key 暗示哪些子元素在不同的渲染中保持稳定

#### Diff 算法

首先比较两颗树的根节点

1. 比较不同类型的元素 - 卸载原有树并且创建新的树
2. 比对同一类型的元素 - 保留 DOM 节点，仅比对及更新有变化的属性

处理完当前节点，React 继续对子节点递归

1. 比对同类型的组件元素
   - 组件实例保持不变（state 在跨越不同的渲染时保持一致），React 将更新该组件实例的 props 以跟最新的元素保持一致并且调用该实例的 componentWillReceiveProps 和 componentWillUpdate 方法。
   - 下一步，调用 render 方法，diff 算法将在之前的结果和新的结果中进行递归。
2. 对子节点进行递归
   React 使用 key 来匹配原有树上的子元素以及最新树上的子元素。

说明：

1. tree diff
   对树进行分层比较，两棵树只会对同一层次的节点进行比较。
2. component diff
   - 如果是同一类型的组件，按照原有策略继续比较 Virtual DOM，
   - 如果不是，则该组件为 dirty component，从而替换整个组件的所有子节点。
3. element diff
   - 同一层级的子节点，diff 提供三种操作：插入，移动，删除
   - 添加唯一 key 进行区分

### 性能优化

1. 使用生产版本 React 并压缩
   - `Rollup: rollup-plugin-terser`
   - `Webpack: terser-webpack-plugin`
     ```
     optimization:{
       minimizer: [new TerserPlugin({})]
     }
     ```
2. 虚拟化长列表
   - `react-window`
3. 代码分割
   - `React.lazy`和`Suspense`
     ```
     import React, {Suspense} from 'react'
     // import {lazy} from '@loadable/component'
     const OtherComponent = React.lazy(() => import('./OtherComponent'))
     ...
     <Suspense fallback={<Loading />}>
       <OtherComponent />
     </Suspense>
     ```
   - `@loadable/component`
     | library | Supspense | SSR | library splitting| dynamic import|
     | --- | :---: | :---: | :---: | :---: |
     | `React.lazy` | ✅ | ❌ | ❌ | ❌ |
     |`@loadable/component` | ✅ | ✅ | ✅ | ✅ |
   - 错误边界
     ```
     constructor(props){
       super(props)
       this.state={hasError: false}
     }
     static getDerivedStateFromError(error) {
       return {hasError: true}
     }
     componentDidCatch(error, errorInfo) {
       log(error, errorInfo)
     }
     render() {
       if(this.state.hasError) {
         return <h1>Something went wrong!
       }
       return this.props.children
     }
     ```
4. 避免调停(Avoid Reconciliation)
   - SCU
     ```
     shouldComponentUpdate(nextProps, nextState) {
       return nextProps.count !== this.props.count
     }
     ```
   - 类组件 `React.PureComponent` 浅比较
   - 函数组件 `React.memo`，`useMemo` 浅比较（只比较 props），`useCallback`
   - 使用不可变数据模式
     更改 state 时，使用 ES6 数组扩展运算符，对象扩展符
5. precache with PWA(`workbox`)
6. pre-render routes(static HTML) with `react-snap`
7. 组件尽量拆分、解耦
8. 避免滥用 props
9. 在 constructor 里绑定函数
10. 保持 render 纯函数
11. 函数节流和防抖

### 组件生命周期

#### 挂载

> 当组件实例被创建并插入 DOM 中时

1. `constructor`
2. `static getDerivedStateFromProps(props, state)`
3. `render()`
4. `componentDidMount`

#### 更新

> 当组件的 props 或 state 发生变化时触发更新

1. `static getDerivedStateFromProps(props, state)`
2. `shouldComponentUpdate(nextProps, nextState)`
3. `render`
4. `getSnapShotBeforeUpdate(prevProps, prevState)`
5. `componentDidUpdate(prevProps, prevState, snap)`

#### 卸载

> 当组件从 DOM 中移除时

1. `componentWillUnmount`

#### 错误处理

> 当渲染过程、生命周期、或子组件构造函数中抛出错误

1. `static getDerivedStateFromError()`
2. `componentDidCatch`

### 问题

1. props 🆚 state

   - props 和 state 都是普通 js 对象
   - props 和 state 变化都会触发 render 更新
   - props 和 state 都是决定论的，（相同的变化产生相同的结果）
   - props 是传递给组件的，不可更改
   - state 是组件内被组件管理的，随着时间会变化的

2. setState 什么时候是异步的？
   在事件处理函数内部的 setState 是异步的。（在 react 以外 window 事件像 setTimeout，addEventListenner 和异步请求 promise 中 setState 是同步的。）在事件处理函数内部是不同步更新 state 的，在重新渲染之前，react 会等待，直到所有在事件处理函数内部的 setState 完成以后批量更新，从而避免不必要的渲染以提升性能。
   理由是：

   - 保证内部（props，state）的一致性，（不能保证 props 是同步更新的，并且避免子组件重新渲染两次）
   - 满足未来的 concurrent 能力更新

3. React/Vue key 的作用
   指定唯一的 key 存在是为了高效的更新 VDOM List，key 是用来判断 VDOM 元素项的唯一依据。
   - Vue 采用依赖收集的方式更细粒度的更新组件，简单无状态组件原地复用。
   - React 采用自顶向下的数据流，每次小的改动都会产生全新的 vdom。
