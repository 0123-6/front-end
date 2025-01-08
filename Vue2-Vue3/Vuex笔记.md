# Vuex笔记

# Vuex是什么？

Vuex是Vue.js的一个插件，用来管理全局状态。当我们有全局状态，且希望依赖Vue的响应式系统时，可以使用Vuex来简单达到这一目的。

# 如何使用Vuex 

## \<script\>引入

```html
<!--导入Vue-->
<script src="/node_modules_myself/vue/dist/vue.js"></script>
<!--导入Vuex3-->
<script src="/node_modules_myself/vuex/dist/vuex.js"></script>
```

通过script导入时，无需手动执行Vue.use(Vuex)。

## npm

```cmd
npm install vuex
```

```js
import Vue from 'vue'
import Vuex from 'vuex'

// 在一个模块化的打包系统中，您必须显式地通过 `Vue.use()` 来安装
Vue.use(Vuex)
```

## 自己构建

在script中引入自己构建的Vuex。

# 简单使用

Vuex的核心就是一个Vue实例，我们传递给Vuex.Store(options)的state和getters被作为Store实例的vm属性的data和计算属性，Vuex在安装过程中为Vue mixins了一个全局生效的beforeCreate钩子，在钩子中定义this.$store属性指向this.$options.store,即我们在main.js中定义的全局store对象，因此我们在组件中访问this.$store.state.xxx。Store对象的state是一个getter，代理store.\_vm.\_data.$$state属性。当我们读取store的变量时，会订阅那个属性作为依赖，当store的属性发生变化时，会通知组件进行更新。

- store.state.xxx读取数据
- store.commit('xxx', {})触发更新

为了在 Vue 组件中访问 `this.$store` property，你需要为 Vue 实例提供创建好的 store。Vuex 提供了一个从根组件向所有子组件，以 `store` 选项的方式“注入”该 store 的机制：

```js
new Vue({
  el: '#app',
  store: store,
})
```

```js
// 定义初始state
const initState = {
  user: null,
}

// Vuex配置项
const storeOptions = {
  // state的类型为Object/Function,
  state: {
   ...initState,
   // 如果存在之前缓存的vuex,则使用缓存
   ...JSON.parse(localStorage.getItem('vuexState')),
  },
  // 相当于计算属性
  // 接收2个参数
  // 第1个参数：state
  // 第2个参数: getters
  getters: {
  
  },
  // Vuex规定，改变state必须使用mutations中定义的函数，
  // 函数接收2个参数，第1个参数为state，第2个参数为负载。
  // 在vm中，通过vm.$store.commit()触发.
  // 必须为同步函数.
  mutations: {
   // 清空所有state
   // state是store._vm.$$state的引用，
   // 所以直接重置state本身无效,重置state相当于把函数的形参state指向了你设置的对象
   // store._vm.$$state并没有被改变
   // this指向临时store，注意这个store和真实的store很相似，但不是真正的store,
   // this.state = initState会报错，因为state没有setter方法，只有getter方法
   clear(state) {
    Object.assign(state, initState)
   },
   setUser(state, payload) {
    state.user = payload ? payload : null
   },
  },
  // actions用来执行异步方法，通过vm.$store.dispatch()触发
  // 接收2个参数，
  // 第1个参数为context,相当于store的别名
  // 第2个参数为payload负载
  actions: {
    inc(context) {
      const a = context.state.a
      const b = context.getters.b
      context.commit('inc')
    },
  },
  
}

// store.state
// store.getters
// store.commit()
// store.dispatch()
const store = new Vuex.Store(storeOptions)

// 添加浏览器事件,处理刷新和退出事件
window.addEventListener('beforeunload', () => {
  localStorage.setItem('vuexState', JSON.stringify(store.state))
})

export default store
```

# Vuex的全局导出

```ts
// 导出对象
export default {
  // 最核心的Store类
  Store,
  // Vuex的安装函数
  install,
  
  // 在组件获取state的语法
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```

# 在组件中使用

```ts
// 通过计算属性
const Counter = {
  template: `<div>{{count}}<input v-model="age"></div>`,
  computed: {
    count() {
      return this.$store.state.count,
    },
    // 使用带set属性的计算属性来结合v-model使用.
    age: {
      get() {
        return this.$store.getters.age
      },
      set(value) {
        this.$store.commit('changeAge', value)
      }
    },
  },
}
```

# 大致实现

```js
let Vue // bind on install

export class Store {
  constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }
    
    this.getters = options.getters
    this.mutations = options.mutations
    this.actions = options.actions
    
    const wrappedGetters = this._wrappedGetters
    const computed = {}
    
    for (const [key, fn] of Object.entries(this.getters)) {
      // use computed to leverage its lazy-caching mechanism
      // direct inline function use will lead to closure preserving oldVm.
      // using partial to return function with only arguments preserved in closure environment.
      computed[key] = () => fn(this)
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
        enumerable: true // for local getters
      })
    }
    
    // 使用Vue实例存储state
    this._vm = new Vue({
      data: {
        $$state: options.state
      },
      computed
    })
  }

  get state () {
    return this._vm.$$state
  }

  commit (type, payload) {
    const entry = this.mutations[type]
    if (!entry) {
      return
    }
    
    entry.forEach(handler => {
      handler(payload)
    })
  }

  dispatch (type, payload) {
    const entry = this.actions[type]
    if (!entry) {
      return
    }

    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    return new Promise((resolve) => {
      result.then(res => {
        resolve(res)
      })
    })
  }
}

export function install (_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      // Vuex init hook, injected into each instances init hooks list.
      const options = this.$options
      // store injection
      if (options.store) {
        this.$store = typeof options.store === 'function'
          ? options.store()
          : options.store
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
      }
    },
  })
}

```

























































