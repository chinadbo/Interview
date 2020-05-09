## Vue 3.0

1. 特性

   1. 更小
      - 全局 API，内置组件、功能 tree-shaking
      - 10kb gzipped
   2. 更快
      - 基于 proxy 的变动侦测，性能整体优于 getter/setter
      - Virtual DOM 重构:
        a). 编译模版的静态标记；b). 时间缓存；c). 静态提升
      - 编译器架构重构，更多的编译时优化
   3. 加强 API 设计一致性
   4. TypeScript 支持
   5. 采用 monorepo 结构，分层清晰

2. Composition API
   1. `reactive` 创建一个响应式对象，对应于 2.0 的`Vue.observable()`。
      ```
      setup() {
        const obj = reactive({count: 0, title: 'Vue 3.0'})
      }
      ```
   2. `ref`创建一个包装对象，ref 对象具有指向内部值的`.value`
      ```
      const count = ref(0)
      console.log(count.value) // 0
      ```
   3. `computed`计算属性
      `const computedCount = computed(() => count*100)`
   4. `watch`监听数据
      ```
      watch(() => obj.count, (count, prevCount) => {})
      ```
   5. lifeCycle
      | 原方法 | now |
      | --- | --- |
      | ~~beforeCreate~~ | setup |
      | ~~created~~ | setup|
      | beforeMount | onBeforeMount |
      | mounted | **onMounted** |
      | beforeUpdate | onBeforeUpdate |
      | updated | **onUpdated**|
      | beforeDestory | onBeforeUnmount |
      | destoryed | **onUnmounted** |
