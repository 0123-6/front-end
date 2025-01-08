## Pinia是什么？

Pinia是 Vue.js状态管理库，同时适用于Vue2和Vue3。

## 最简单的全局状态

### reactive版本

```
// 定义初始state
const initState = {}

export const state = Vue.reactive({
  ...initState,
  ...JSON.parse(localStorage.getItem('state'))
})

// 添加浏览器事件,处理刷新和退出事件
window.addEventListener('beforeunload', () => {
  localStorage.setItem('state', JSON.stringify(Vue.toRaw(state)))
})
```

# 安装

```cmd
npm install pinia
```

## Store是什么？

Store(如pinia)是一个全局单例对象，有3个属性，state，getter，action，分别对应组件的data，computed和methods。









# pinia是什么

Pinia是Vue.js的状态管理库.有3个概念,state,getter,action,相当于Vue组件的data,computed,methods.

# 自己实现

```ts
export const state = reactive({})
```

# 安装

```bash
npm i pinia
```

# 简单使用

```ts
import { createApp } from "vue/dist/vue.esm-bundler.js"
import { createPinia } from "./pinia/index.ts"

const app = createApp({
	template: `<div style="width: 100vw;height: 100vh;background-color: aqua;display: flex;flex-direction: column;">
	<span>layout</span>
</div>`,
})

// 创建pinia实例
const pinia = createPinia()
app.use(pinia)

// 将创建的实例绑定到DOM上
app.mount(document.body)

```

对象式语法

```ts
// src/store.ts
import {defineStore} from "./pinia";

const useCounterStore = defineStore('counter', {
	state() {
		return {
			count: 0,
		}
	},
	actions: {
		increment() {
			this.count++
		}
	},
})
```

也可以用函数式语法,对象式语法是组合式函数的封装.

```ts
// src/store.ts
import {ref} from "vue";
import {defineStore} from "./pinia";

const useCounterStore = defineStore('counter', () => {
	// state
	const count = ref(0)

	// methods
	function increment() {
		count.value++
	}

	return {
		count,
		increment,
	}
})

export default useCounterStore
```

在组件中使用

```ts
import { createApp } from "vue/dist/vue.esm-bundler.js"
import { createPinia } from "./pinia/index.ts"
import useCounterStore from "./store.ts";

const app = createApp({
	template: `<div style="width: 100vw;height: 100vh;background-color: aqua;display: flex;flex-direction: column;">
	<span>layout</span>
	<span>{{counter.count}}</span>
</div>`,
	setup() {
		const counter = useCounterStore()
    // 第一种方式
		counter.count++
    // 第二种方式
		counter.$patch({
			count: counter.count + 1,
		})
    // 第三种方式
		counter.increment()

		return {
			counter,
		}
	}
})

// 创建pinia实例
const pinia = createPinia()
app.use(pinia)

// 将创建的实例绑定到DOM上
app.mount(document.body)
```

# 定义Store

现在我们知道,Store是通过defineStore()函数定义的,

- 第一个参数: id
- 第二个参数: setup函数或者options对象.

## Option Store

与 Vue 的选项式 API 类似，我们也可以传入一个带有 `state`、`actions` 与 `getters` 属性的 Option 对象.**state**相当于**data**,**getters**相当于**computed**,**actions**相当于**methods**.

```ts
// src/store.ts
import {defineStore} from "./pinia";

const useCounterStore = defineStore('counter', {
	state() {
		return {
			count: 0,
		}
	},
	actions: {
		increment() {
			this.count++
		}
	},
})
```

options 的底层是setup函数.

## setup函数

我们可以传入一个函数，该函数定义了一些响应式属性和方法，并且返回一个带有我们想暴露出去的属性和方法的对象。

```ts
// src/store.ts
import {ref} from "vue";
import {defineStore} from "./pinia";

const useCounterStore = defineStore('counter', () => {
	// state
	const count = ref(0)

	// methods
	function increment() {
		count.value++
	}

	return {
		count,
		increment,
	}
})

export default useCounterStore
```

其中:

- ref()相当于state属性
- computed相当于getters
- function相当于actions

## 使用Store

我们前面定义了一个 store，但在我们使用 `<script setup>` 调用 `useStore()`(或者使用 `setup()` 函数，**像所有的组件那样**) 之前，store 实例是不会被创建的：

请注意，`store` 是一个用 `reactive` 包装的对象，这意味着不需要在 getters 后面写 `.value`。就像 `setup` 中的 `props` 一样，**我们不能对它进行解构**：

# State

在Pinia中,state被定义为一个返回初始状态的函数.

```ts
interface ITestStore {
	name: string
	age: number
}

const useTestStore = defineStore('test', {
	// 为了完整类型推理，推荐使用箭头函数
	state: (): ITestStore => ({
		// 所有这些属性都将自动推断出它们的类型
		name: '夏翀',
		age: 25,
	}),
})
```

## 访问和修改state

```ts
const counter = useCounterStore()
counter.count++
counter.$patch({
	count: counter.count + 1,
})
counter.increment()
```

## 重置state

使用[选项式 API](https://pinia.vuejs.org/zh/core-concepts/#option-stores) 时，你可以通过调用 store 的 `$reset()` 方法将 state 重置为初始值。

```ts
const store = useStore()

store.$reset()
```

在 `$reset()` 内部，会调用 `state()` 函数来创建一个新的状态对象，并用它替换当前状态。

在setup函数中,需要自己创建$reset()方法:

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function $reset() {
    count.value = 0
  }

  return { count, $reset }
})
```

# getters

Getter完全等同于store的state的计算值.**推荐**使用箭头函数，并且它将接收 `state` 作为第一个参数：

```ts
interface ITestStore {
	name: string
	age: number
}

const useTestStore = defineStore('test', {
	// 为了完整类型推理，推荐使用箭头函数
	state: (): ITestStore => ({
		// 所有这些属性都将自动推断出它们的类型
		name: '夏翀',
		age: 25,
	}),
	// 计算属性
	getters: {
		hello: state => state.name + state.age,
		// 在非箭头函数中,可以使用this访问store实例
		hello2(state): string {
			return this.name + this.age
		}
	}
})
```

## 使用setup()时的用法

```ts
const store = useCounterStore()
store.count = 3
store.doubleCount // 6
```

# Action

actions相当于Vue组件的methods.

```ts
interface ITestStore {
  name: string
  age: number
}

const useTestStore = defineStore('test', {
  // 为了完整类型推理，推荐使用箭头函数
  state: (): ITestStore => ({
   // 所有这些属性都将自动推断出它们的类型
   name: '夏翀',
   age: 25,
  }),
  // 计算属性
  getters: {
   hello: state => state.name + state.age,
   // 在非箭头函数中,可以使用this访问store实例
   hello2(): string {
    return this.name + this.age
   }
  },
  // methods
  actions: {
   say() {
    console.log(`你好,我是${this.name}, 今年${this.age}岁`)
   }
  },
})
```

类似Getter,actions也可以通过this访问整个store实例,actions可以是异步的.

# createPinia()的源代码

```ts
// Pinia接口定义
export interface Pinia {
  // 安装函数,可以被app使用,app.use(pinia)将pinia注册为app的插件
  // App为Vue中通过createApp()函数创建的Vue实例
  install: (app: App) => void
  // install函数传递的app参数
  app: App
  // pinia连接到的EffectScope
  effectScope: EffectScope
  // 根state
  state: Ref<any>
  // 该pinia注册的store
  storeMap: Map<string, StoreGeneric>
}

// createPinia是一个全局函数,创建一个Pinia实例,给createApp()创建的app实例使用
export function createPinia(): Pinia {
  // 创建一个EffectScope实例,用来管理对应的computed和watch
  const scope = effectScope(true)
  // 创建一个ref对象,用来保存全部store,每一个store是一个key为string,value为StateTree的键值对,
  // 该ref对象被scope管理
  const state = scope.run(() => ref({}))
  // markRaw表示该对象不需要被Vue的响应式系统管理和影响
  // 创建一个符合Pinia接口的pinia对象并返回
  const pinia: Pinia = markRaw({
    install(app: App) {
      setActivePinia(pinia)
      pinia.app = app
      // 2种注入方法
      // 通过provide提供数据,在setup中可以通过inject获取
      app.provide(piniaSymbol, pinia)
      // 注入到Vue实例的this中
      app.config.globalProperties.$pinia = pinia
    },
    app: null,
    effectScope: scope,
    state,
    storeMap: new Map<string, StoreGeneric>()
  })
  
  return pinia
}
```

# defineStore源代码

```ts
export function defineStore(id, setup): StoreDefinition {
  // 返回的函数
  function useStore(pinia?: Pinia | null): StoreGeneric {
    // 获取pinia实例
    const pinia = inject(piniaSymbol)!;
    // 如果该pinia实例的storeMap没有这个id对应的store,则创建
    if (!pinia.storeMap.has(id)) {
      createSetupStore(id, setup, pinia)
    }
    
    // 获取对应的store对象,并返回
    const store: StoreGeneric = pinia.storeMap.get(id)!;
    return store as any;
  }
  
  userStore.$id = id
  return useStore
}
```

# 为什么我们在使用defineStore定义时命名为useXXX?

因为defineStore函数返回的是一个组合式函数,所以我们得到的是一个组合式函数,所以以useXXX命名.

# pinia常用API

- createPinia: 创建一个pinia实例
- defineStore(id, {} | () => {}) 返回一个为id的store的自定义组合式函数
  - 对象式语法包含state,getters,actions,是组合式语法的语法糖,getters定义的函数有一个state参数.
  - 组合式语法为一个类似setup()的函数
- storeToRefs: 将调用useXXXStore()得到的reactive包装的对象转换为ref包装,结构不丢失响应性.
- $patch: 更新store.
- $reset: 重置状态,只有对象式语法有,函数式语法没有.

# pinia和Vuex的不同

- vuex的底层是一个Vue实例,pinia的底层是Vue的组合式API
- vuex的定义为new Vuex.Store({}),pinia为defineStore(id, {} | () => {}),pinia参数可以为对象或函数,且对象式语法中没有mutations.
- vuex修改state为使用commit触发mutations,或使用dispatch触发actions;pinia为直接修改,使用store.$patch,或直接调用定义时提供的修改函数.









pinia返回的对象会使用reactive包装,我们使用组合式函数时,如果解构,也会保持响应性连接.如果直接使用,需要注意这是一个reactive proxy对象,属性为ref的会自动解包,不用.value









































