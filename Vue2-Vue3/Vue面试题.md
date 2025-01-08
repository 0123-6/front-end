# Vue面试题

## vue2支持ie的哪个版本

Vue **不支持** IE8 及以下版本，因为 Vue 使用了 IE8 无法模拟的 ECMAScript 5 特性。

## 如何创建Vue2项目

```cmd
npm create vue@legacy

# 改为不使用create
npm install -g create-vue@legacy
create-vue my-app
```

或者使用我的模板

Vue2的最终版本为**2.7.16**,

### 1. 直接script引入

```html
<!--1. 直接script引入,Vue会被注册为一个全局变量-->
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
<!--1. 或引入module格式-->
<script type="module">
  import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.esm.browser.js'
</script>
```

### 2. npm构建

通过npm和vite构建.

```cmd
# 最新稳定版
npm install vue@2.7.16
```

## Vue的不同构建版本的关系

|                               | UMD                | ES Module (基于构建工具使用) | ES Module (直接用于浏览器) |
| ----------------------------- | ------------------ | ---------------------------- | -------------------------- |
| **完整版**                    | vue.js             | vue.esm.js                   | vue.esm.browser.js         |
| **只包含运行时版**            | vue.runtime.js     | vue.runtime.esm.js           | -                          |
| **完整版 (生产环境)**         | vue.min.js         | -                            | vue.esm.browser.min.js     |
| **只包含运行时版 (生产环境)** | vue.runtime.min.js | -                            | -                          |

### 术语

- **完整版**：同时包含编译器和运行时的版本。
- **编译器**：用来将模板字符串编译成为 JavaScript 渲染函数的代码。
- **运行时**：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码。基本上就是除去编译器的其它一切。
- **[UMD](https://github.com/umdjs/umd)**：UMD 版本可以通过 `<script>` 标签直接用在浏览器中。jsDelivr CDN 的 [https://cdn.jsdelivr.net/npm/vue@2.7.14](https://cdn.jsdelivr.net/npm/vue@2.7.14) 默认文件就是运行时 + 编译器的 UMD 版本 (`vue.js`)。
- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**：从 2.6 开始 Vue 会提供两个 ES Modules (ESM) 构建文件：

  - 为打包工具提供的 ESM：为诸如 [webpack 2](https://webpack.js.org) 或 [Rollup](https://rollupjs.org/) 提供的现代打包工具。ESM 格式被设计为可以被静态分析，所以打包工具可以利用这一点来进行“tree-shaking”并将用不到的代码排除出最终的包。为这些打包工具提供的默认文件 (`pkg.module`) 是只有运行时的 ES Module 构建 (`vue.runtime.esm.js`)。

  - 为浏览器提供的 ESM (2.6+)：用于在现代浏览器中通过 `<script type="module">` 直接导入。

## Vue2的运行时版本和完整版的区别?

```js
// 需要编译器
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 不需要编译器
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

当我们使用构建工具时,build阶段会把template转换为渲染函数,因此无需使用完整版.

## 最简单的Vue2应用

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>最简单的Vue2程序</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			flex-shrink: 0;
		}
	</style>
	<!--导入Vue2.7.16-->
	<script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.min.js"></script>
</head>
<body>
<div id="app"></div>
<script type="module">
	// 定义1个Vue组件
	const MyComp = {
		template: `<div style="width: 600px;height: 600px;display: flex;flex-direction: column;background-color: orange;">
			<span>{{number}}</span>
			<button @click="add">add</button>
			<button @click="dec">dec</button>
		</div>`,
		data() {
			return {
				number: 10,
			}
		},
		methods: {
			add() {
				this.number++
			},
			dec() {
				this.number--
			},
		},
	}

	// 创建Vue组件
	const app = new Vue(MyComp)
	const element = document.getElementById('app')
	app.$mount(element)
</script>
</body>
</html>
```

## Vue的核心是什么？

Vue.js 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 DOM 的系统,Vue.js 使用了基于 HTML 的模板语法.

在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。

注意不要在Vue组件使用箭头函数,因为箭头函数没有this,无法绑定到Vue实例上.

## Vue2的style和class

- class推荐使用数组语法
- style推荐用对象语法

```vue
<!--class数组语法-->
<div :class="[isTrue ? 'classA, classB' : 'classC']">

<!--style对象语法-->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

当在一个自定义组件上使用 `class` property 时，这些 class 将被添加到该组件的根元素上面。这个元素上已经存在的 class 不会被覆盖。

## Vue使用了哪种设计模式？

- 观察者模式 defineProperty方法，可观察化的核心方法
- 发布订阅模式 Vue的事件机制，核心事件中心vm.\_events对象
- 策略模式，在vm.\_init()方法中，根据vm是否是子组件，执行不同的合并options方法

## 什么是MVC,MVVM,Vue是什么模式?

MVC模式，全称为Model-View-Controller,

- **模型Model**: 模型管理程序的数据
- **视图View**: 视图负责呈现数据，和接收用户输入。
- **控制器Controller**: 控制器充当模型和视图的桥梁，控制器与模型通信以更新数据，或与视图通信以更新UI，或接收用户输入，来执行相应的逻辑。

在MVVM中:

- **模型Model**: 和MVC一样
- **视图View**: 和MVC一样
- **视图模型ViewModel**: 实现了**双向绑定**,当数据模型发生变化时,DOM自动更新.当用户在DOM中进行操作时,数据模型也自动同步更新.

总结:

- MVC是结构清晰，Controller控制器负责一切，手动操作。
- MVVM引入ModelView模块，承担了一部分工作，实现了双向绑定，视图由于用户交互数据改变时自动修改model，同时model改变时自动修改view。

Vue使用了MVVM模式，但没有严格遵守，因为Vue提供了$refs这个属性，js可以直接操作view。

- **v-bind**实现了数据模型到DOM的单向绑定
- **v-on**实现了DOM到数据模型的单向绑定

- v-bind和v-on结合实现了Vue的双向绑定.
- **v-model**是语法糖,是v-bind和v-on的简化写法.

## 虚拟DOM

虚拟DOM本质是JavaScript对象树,对比新旧VNode树,计算出差异,更新.

### 优点

- 性能优化：通过避免不必要的对真实DOM的操作，提高程序性能。
- 跨平台：虚拟DOM是一种通用方法，不依赖具体平台，在具体平台使用时需要传递给patch函数具体的操作DOM的nodeOps的具体实现，因此使用虚拟DOM开发的程序可以跨平台。
- 组件化：虚拟DOM促进了组件化设计
- 易于测试：因为虚拟DOM是一个JavaScript对象，使测试组件的行为变得相对容易。

### 缺点

- 简单的程序不需要：对于简单的程序，引入虚拟DOM优势不明显，甚至画蛇添足。
- 首次初始化会花时间计算。

## Vue单页应用和多页应用的区别？

| 对比项   | 普通多页面         | SPA单页面                                 |
| -------- | ------------------ | ----------------------------------------- |
| 结构     | 许多HTML文件       | 1个HTML文件 + 很多js文件                  |
| 用户体验 | 首次加载快，切换慢 | 首次加载慢，切换快                        |
| 资源文件 | 不共享             | 共享                                      |
| 适用场景 | 对SEO要求高        | 现代化浏览器                              |
| 过渡动画 | 很难               | 简单                                      |
| 内容更新 | 切换HTML           | 局部更新                                  |
| 路由模式 | 普通链接跳转       | hash，或history                           |
| 数据传递 | localStorage       | localStorage，sessionStorage，vuex，redux |
| 开发成本 | 前期低，后期高     | 前期高，后期低                            |

## Vue初始化页面闪动问题

```css
[v-clock] {
  display: none;
}
```

## 既然Vue通过响应式系统已经知道哪些数据发生了变化,为什么还需要diff算法,而不是直接修改DOM?

Vue是以组件为单位的,而不是以单个DOM元素为单位.

## Vue2实例的创建过程

第一步,调用Vue构造函数

```ts
const myVue = new Vue({
  el: '#app',
  template: `
  <div style="display: flex;flex-direction: column;"><span>{{food.name}}</span><span>{{food.power}}</span></div>
  `,
  data() {
    return {
      food: {
        name: '吕凤凤',
        power: 120,
      },
    }
  },
  created() {
    eventBus.on('changeFood', this.changeFood)
  },
  beforeDestroy() {
    eventBus.off('changeFood', this.changeFood)
  },
  methods: {
    changeFood(food) {
      this.food = structuredClone(food)
    }
  },
})
```

触发了Vue构造函数

```ts
// Vue构造函数
function Vue(options) {
  // 执行初始化方法,因为Vue为构造函数,所以this是Vue实例
  this._init(options)
}
```

我们来看Vue.prototype.\_init()

```ts
Vue.prototype._init = function(options) {
  // 定义vm指向当前this,this为一个Vue对象
  const vm = this
  // 设置vm.$options
  vm.$options = mergeOptions(options)
  // 初始化事件,待补充,设置_events属性作为事件中心.
  initEvents(vm)
  // 调用beforeCreate生命周期钩子
  // 此时vm.$options存在,设置vm._events属性作为事件中心
  callHook(vm, 'beforeCreate')
  
  // 处理options,// 核心方法,将vm响应式化
  // 1. 如果存在props,初始化props
  initProps(vm, vm.$options.props)
  // 2. 如果存在options.methods
  initMethods(vm, vm.$options.methods)
  // 3. 如果存在data,响应式化data
  initData(vm)
  // 4. 初始化computed
  initComputed(vm, vm.$options.computed)
  // 5. 初始化watch
  initWatch(vm, vm.$options.watch)
  // 调用created钩子
  // 完成了对props,methods,data,computed,watch选项的配置,
  // 此时未渲染到DOM,无法和DOM交互,可以通过vm.nextTick 来访问 DOM。
  // vm还没有开始渲染，它的子组件自然还没有完成创建。
  // 此时,可以发起一些网络请求,获取和设置数据.
  callHook(vm, 'created')
}
```

### defineReactive(obj, key)

```ts
export function defineReactive(obj, key) {
  let value = obj[key]
  
  // dfs子对象
  if (typeof value ==== 'object' && value !== 'null') {
    for (const childKey of Object.keys(value)) {
      defineReactive(value, childKey)
    }
  }
  
  // 定义1个Dep依赖(发布者)对象
  const dep = new Dep()
  
  // 使用Objec.defineProperty来改造obj.key
  Object.defineProperty(obj, key, {
    get: function reactiveGetter() {
      // 依赖收集
			if (Dep.target) {
        Dep.target.newDeps.push(dep)
        dep.subs.push(Dep.target)
      }
      return value
    },
    set: function reactiveSetter(newValue) {
      if (value === newValue) {
        return
      }
      value = newValue
      // dfs子对象
      if (typeof value ==== 'object' && value !== 'null') {
        for (const childKey of Object.keys(value)) {
          defineReactive(value, childKey)
        }
      }
      // 通知
      dep.notify()
    },
  })
  
  return dep
}
```

### Dep类

Dep类,即依赖,也是观察者模式中的发布者.

```ts
// 模块变量,记录Dep的id
let uid = 0

// 观察者的接口
export interface DepTarget {
  id: number
  // 添加依赖的方法
  addDep(dep: Dep): void
  // 更新方法
  update(): void
}

class Dep {
  // 静态属性,指向正在进行get操作的观察者对象
  static target?: DepTarget | null
  id: number
  // 订阅该依赖的观察者数组
  subs: Array<DepTarget>
  
  // 构造函数
  constructor() {
    this.id = uid++
    // 设置观察者数组
    this.subs = []
  }
  
  // 添加一个订阅者
  addSub(sub: DepTarget) {
    this.subs.push(sub)
  }
  
  // 删除一个订阅者
  removeSub(sub: DepTarget) {
    this.subs = this.subs.filter(_sub => _sub !== sub)
  }
  
  // 将此时正在进行get操作的观察者订阅此依赖对象
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  
  // 通知订阅者更新
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null
const targetStack = []

// 设置正在执行get操作的Watcher对象
export function pushTarget(target: DepTarget) {
  targetStack.push(target)
  Dep.target = target
}

// 正在执行get操作的Watcher对象执行完毕,Dep.target恢复到之前的状态
export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack.at(-1)
}
```

### 总结Vue2的响应式原理

核心就是defineReactive(obj, key)函数,使用**数据拦截** + **观察者模式**.

defineReactive函数会定义一个Dep对象，保存依赖该属性的观察者对象，定义childOb，如果该属性的值是对象或数组，则dfs递归使用observe函数响应式该值，并保存在childOb中。最后使用Object.defineProperty(obj, key , {})为该属性设置get和set拦截，在get方法中，获取值，如果此时Dep.target存在，则互相添加，属性添加观察者到自身的dep的订阅数组中，观察者添加该dep的id到它的newDepIds中；在set方法中，先判断新值和旧值是否一致，如果不一致，则重新生成this.childOb，更新这个值，调用dep的notify方法，来通知所有订阅数组中的观察者对象进行更新操作。

Watcher类是观察者类。

### initProps

```js
function myInitProps(vm, propsOptions) {
  vm._props = {}
  for (const key in propsOptions) {
    const value = vm.$options.propsData[key]
    defineReactive(vm._props, key, value, undefined, true);
  }
}
```

遍历vm.$options.props对象，从vm.$options.propsData获取父组件传递过来的值，调用defineReactive(vm.\_props, key, value)将vm.\_props对象添加key值，并且是可观察化的。

### initMethods

```ts
function myInitMethods(vm, methods) {
  // 遍历methods，将vm.$options.methods中的所有属性设置到vm本身上，并且绑定this为vm
  for (const key in methods) {
    const method = methods[key]
    vm[key] = method.bind(vm)
  }
}
```

### initData(重点)

```ts
// 将vm.$options.data响应式化
function initData(vm) {
  // 1. 获取vm._data
  vm._data = isFunction(vm.$options.data)
    ? vm.$options.data()
  	: vm.$options.data || {}
  // 2. 将data可观察化
  for (const key of Object.keys(vm._data)) {
    defineReactive(vm._data, key)
  }
}
```

#### 为什么data是一个函数?

这样通过data()函数返回，可以避免多个实例对象的data指向同一个对象而造成的修改时数据混乱的问题。

### initComputed

```ts
function initComputed(vm, computed: Object) {
  // 创建保存计算属性观察者对象的属性
  vm._computedWatchers = {}
  
  // 遍历computed对象
  for (const [key, value] of Object.entries(computed)) {
    // 获取get函数
    const getter = isFunction(value) ? value : value.get
    // 新创建一个观察者对象,expOrFn为getter函数,是一个惰性观察者
    // 计算属性没有像data属性一样的保存值的位置,所以计算属性的值保存在一个观察者对象中
    vm._computedWatchers[key] = new Watcher(vm, getter, {lazy: true,})
    // 在vm上设置映射,使用Object.defineProperty拦截
    Object.defineProperty(vm, key, {
      get: function computedGetter() {
        // 找到对应的watcher对象
        const watcher = this._computedWatchers[key]
        // 如果是脏数据,计算获取最新数据
        if (watcher.dirty) {
          watcher.value = watcher.getter()
          watcher.dirty = false
        }
        return watcher.value
      },
      set: isFunction(value) ? () => {} : value.set
    })
  }
}
```

### initWatch

```ts
function initWatch(vm, watch) {
  // 遍历watch对象
  for (const [key, value] of Object.entries(watch)) {
    let handler = value
    let watcherOptions = null
    // 判断value的格式
    if (Object.prototype.toString.call(value) === '[obejct Object]') {
      handler = value.handler
      
      watcherOptions = structoredClone(value)
      delete watcherOptions.handler
    }
    new Watcher(this, key, handler, {
	    ...watcherOptions,
  	  // 用户定义的观察者
    	user: true,
  	})
  }
}
```

### computed和watch的区别和场景

计算属性默认只有getter,不过在需要时你也可以提供一个 setter：

computed一般用在模板渲染中，本质是一个属性，表达式比较复杂时，可以考虑使用计算属性，和方法比起来，会缓存值，只有当相关依赖变化时才会重新求值。computed本质是一个惰性观察者.

watch侦听器适合观测某个值的变化去完成复杂的业务逻辑,比如网络请求.

### 绑定DOM部分 vm.$mount(vm.$options.el)

```ts
// Vue.prototype.$mount
Vue.prototype.$mount = function(el?: string | HTMLElement) {
  const vm = this
  // 获取el元素
  el = el && query(el)
  // 如果render函数不存在
  if (!vm.$options.render) {
    // 如果template也不存在,则使用el作为template
    if (!vm.$options.template) {
      vm.$options.template = getOuterHTML(el)
    }
    // 获取render函数
    const {render} = compileToFunctions(vm.$options.template, vm)
    // 将获取的render函数绑定到vm.$optins上
    vm.$options.render = render
  }
  // 调用正常的$mount()
  return mountComponent(vm, el)
}
```

#### template模版编译过程

```js
const myCreateCompiler = createCompilerCreator(function baseCompile(template, options) {
  // 根据template和options，生成对应的抽象语法树
  const ast = parse(template.trim(), options)
  // 对 AST 进行静态节点标记,优化ast
  optimize(ast, options);
  // 生成渲染函数
  const code = generate(ast, options);
  // 返回ast等信息
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  }
})
```

####mountComponent

```ts
export function mountComponent(vm, el) {
  // 设置vm.$el
  vm.$el = el
  // 调用beforeMount钩子
  // vm.$options.render设置成功
  callHook(vm, 'beforeMount')
  
  // 定义1个无法访问的观察者,对应的get函数为更新DOM的方法
  new Watcher(
    vm,
    () => {
      // vm._render()重新生成最新的VNode,然后调用vm._update方法进行更新
      vm._update(vm._render())
    },
    // Watcher的配置项
    {
      // 在run()之前调用的函数
      before() {
        callHook(vm, 'beforeUpdate')
      }
    },
    // 是渲染观察者
    true,
  )
  
  // 调用mounted钩子
  // vm已挂载到DOM,但子组件不一定挂载完成.如果你希望等到整个视图都渲染完毕再执行某些操作，可以通过vm.$nextTick 来访问 DOM。
	callHook(vm, 'mounted')
}
```

#### Watcher类

```ts
interface IWatcherOptions {
  // 是否是深度观察,默认为true
  deep?: boolean
  // 是否是用户自定义观察者,默认为false
  user?: boolean
  // 是否是惰性观察者,主要用在options.computed上
  lazy?: boolean
  // run之前运行的函数
  before?: Function
}

// 模块作用域,记录Watcher实例的id
let uid = 0

// Watcher类的定义
export default class Watcher implements DepTarget {
  // 构造函数
  constructor(
  	vm: Component,
    expOrFn: () => any,
    options: IWatcherOptions,
  ) {
    	this.id = ++uid
      // 是否是脏数据,用于惰性观察者
      this.dirty = this.lazy
      // 依赖数组(订阅的依赖,也就是发布者的数组)
      this.deps = []
      // watcher对应的getter函数
      this.getter = isFunction(expOrFn) ? expOrFn : parsePath(expOrFn)
      // 设置值
      this.value = this.lazy ? undefined : this.get()
  }
  
  // 获取value的函数
  get() {
    // 将当前watcher放入全局targetStack栈,同时将Dep.target指向当前watcher
    pushTarget(this)
    // 获取value,会调用传入的函数,即
    // () => {
    //  // vm._render()重新生成最新的VNode,然后调用vm._update方法进行更新
    //  vm._update(vm.$options.render())
    // },
    let value = this.getter.call(this.vm, this.vm)
    // 出栈
    popTarget()
    
    return value
  }
  
  // 给观察者添加一个依赖项,在Watcher的get()运行过程中,如果访问某个可观察化的属性,会触发get拦截,依赖(发布者)和正在执行get操作的观察者对象相互添加,实现自动依赖收集.
  addDep(dep: Dep) {
    if (!this.newDepIds.has(dep.id)) {
      // 将依赖的id添加到观察者对象的依赖集合中
    	this.newDepIds.add(dep.id)
    	// dep添加一个订阅者,即当前Watcher对象
    	dep.addSub(this)
    }
  }
  
  // 当任意依赖项改变时调用
  update() {
    // 如果是惰性观察者,只需要将数据脏标志设置为true
    if (this.lazy) {
      this.dirty = true
    } else {
      // 否则将观察者对象放入待执行队列中
      queueWatcher(this)
    }
  }
  
  // update方法最终执行run方法
  run() {
    // 获取watcher的值
		const value = this.get()
    // 如果值不一样
    if (value !== this.value) {
      const oldValue = this.value
      // 设置新值
      this.value = value
      // 如果是用户观察者,调用对应的回调函数
      if (this.user) {
        this.cb.call(this.vm, value, oldValue)
      }
    }
  }
  
  // 惰性观察者更新值,和run方法不一样的是,不触发回调函数
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
}
```

接下来我们来解读vm.\_update(vm.$options.render())的具体实现.

####vm.$options.render()

渲染函数通常是编译生成的匿名函数.

```ts
(function anonymous(
) {
with(this){return _c('div',{staticStyle:{"display":"flex","flex-direction":"column"}},[_c('span',[_v(_s(food.name))]),_c('span',[_v(_s(food.power))])])}
})
```

这个函数会访问很多变量,这些变量在访问会触发get拦截,将此时正在进行get操作的Watcher对象,即渲染函数观察者订阅访问的属性,实现自动依赖收集.

如果遇到了自定义组件，会调用createComponentInstanceForVnode(vnode,activeInstance)方法进行创建，会触发子组件的beforeCreate钩子，created钩子.

#### vm.\_update(vnode: VNode)

```ts
Vue.prototype._update = function(vnode: VNode) {
  // 定义vm
  const vm = this
  // 获取旧的vnode
  const prevVnode = vm._vnode
  // 设置新的vm._vnode
  vm._vnode = vnode
  
  // 如果prevVnode不存在,说明是第一次渲染
  if (!prevVnode) {
    vm.$el = vm.__patch__(vm.$el, vndoe)
  } else {
    // 更新操作
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
}
```

#### vm.\_\_patch\_\_

```ts
// 1. oldVnode存在,vnode存在
// 2. oldVnode存在,vnode不存在
// 3. oldVnode不存在,vnode存在
// 4. oldVnode不存在,vnode不存在
function patch(oldVnode, vnode) {
  // 如果vnode不存在,情况2,4
  if (!vnode) {
    // 如果oldVnode存在,就破坏
    if (oldVnode) {
      invokeDestroyHook(oldVnode)
    }
    return
  }
  
  // 如果vnode存在,情况1,3
  // 如果oldVnode不存在,情况3
  if (!oldVnode) {
    // 创建元素
    createElm(vnode)
    // 插入到正确位置
    invokeInsertHook(vnode)
    // 返回真实DOM
    return vnode.elm
  }
  
  // 如果vnode存在,而且oldVnode存在,情况1
  // oldVnode是否是真实DOM
  const isRealElement = isDef(oldVnode.nodeType)
  // 1.1 如果都是VNode元素,而且代表同一个真实DOM
  if (!isRealElement && sameVnode(oldVnode, vnode)) {
    // 比较VNode元素,给存在的真实DOM打补丁
    patchVnode(oldVnode, vnode)
  } else {
    // 1.2 oldVnode是真实DOM元素,或者都是VNode元素,但不代表同一个真实DOM元素.
    // 根据vnode创建元素,插入到oldVnode原来的位置,移除oldVnode.
    // 首次new Vue({el: '#app'})会进入到这里
    // 至此,new Vue()主体完成.
    // 代码省略
  }
  // 返回真实DOM
  return vnode.elm
}
```

## 说下Vue2的更新过程

我们触发vm的方法,修改vm.food,来观察Vue2的更新过程.此代码会触发changeFood(food)方法.

```ts
debugger;eventBus.emit('changeFood', {name: '江思雨',power:110,})
```

### set被拦截

代码进入到了defineReactive()函数内部的Object.defineProperty的set部分.触发了对应的dep.notify().

此时订阅了该依赖的观察者有3个

- vm渲染函数
- desc计算属性
- food watch对象

3个观察者会依次执行update方法,

第一个触发的是food watch对象,执行了queueWatcher(this)代码.

###queueWatcher(this)

```ts
// 待更新的观察者数组
const queue = []
// has对象,防止watcher重复添加
let has = {}

// 刷新观察者队列方法
function flushScheduleQueue() {
  queue.forEach(watcher => {
    // 如果watcher存在before属性,则执行.渲染函数对应的before函数为执行beforeUpdate钩子.
    if (watcher.before) {
      watcher.before()
    }
    // 执行
    watcher.run()
  })
  // 调用updated钩子函数
  queue.forEach(watcher => {
    // 如果是渲染函数观察者
    if (watcher.vm && watcher.vm === watcher) {
      // 避免在此期间更新数据，因为这个可能导致无限循环的更新.
  		// updated不会保证所有的子组件也都被重新渲染完毕,如果希望DOM完全更新后做操作,可以使用vm.$nextTick()
      callHook(watcher.vm, 'updated')
    }
  })
}

// 将Watcher对象放入队列中,等待执行
export function queueWatcher(watcher: Watcher) {
  // watcher多次被调用update方法也只会执行1次,因为queueWatcher有去重机制
  if (has[watcher.id]) {
    return
  }
  
  // 标记watcher已放入待执行队列中
  has[watcher.id] = id
  // 将Watcher对象放入队列中
  queue.push(watcher)
  // 将刷新方法通过nextTick放入微任务队列中
  nextTick(flushScheduleQueue)
}
```

第一个观察者对象处理完毕,触发第2个观察者对象,第2个为渲染观察者.和第1个观察者处理逻辑基本一样.

第3个为computed观察者,只是设置dirty为true,就结束了.

### 同步代码执行完毕,执行微任务

放入nextTick的方法开始被执行.共2个,1个watch观察者,1个渲染函数观察者.

首先执行watch观察者,调用其run()方法,详见run方法.

第2个执行渲染watcher,渲染函数观察者的before属性存在,会调用,触发beforeUpdate钩子.接着调用run()方法,运行get()方法,运行getter()函数,触发vm.\_update(vm._render())代码.从而和第一个渲染执行相同逻辑.

相同逻辑参考第一个渲染,这里说下不一样的,在patchVnode函数中,更新操作会进入patchVnode()函数.

### patchVnode(oldVnode, vnode)

```js
// 根据vnode，给真实DOM打补丁函数
// oldVnode和vnode的类型一样,因为只有sameVnode为true才会执行此方法
function patchVnode(oldVnode, vnode) {
  // 获取待打补丁的真实DOM
  const elm = (vnode.elm = oldVnode.elm)
  // 获取vnode.data
  const data = vnode.data
  // 定义oldVnode的子节点
  const oldCh = oldVnode.children
  // 定义vnode的子节点
  const ch = vnode.children
  
  // 1. 更新dom属性,比如style,staticStyle属性,事件监听器等.
  if (isDef(data)) {
    for (let i = 0; i < cbs.update.length; i++) {
      cbs[update][i](oldVnode, vnode)
    }
  }
  
  // 2.1 如果vnode是一个普通Element节点，非Text节点
  if (isUndef(vnode.text)) {
    // 3.1 如果oldVnode和vnode都有子元素
    if (isDef(oldCh) && isDef(ch)) {
      // 调用updateChildren函数更新elm的子元素
      updateChildren(elm, oldCh, ch)
    } else if (isDef(ch)) {
      // 3.2 oldCh不存在,ch存在
      // 如果oldVnode是文本节点，则清楚内容;
      // 将ch插入到elm中
      if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
      addVnodes(elm, ch, 0, ch.length - 1)
    } else if (isDef(oldCh)) {
      // 3.3 oldCh存在，但ch不存在
      // 移除oldCh
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      // 3.4 oldCh和ch都不存在，并且oldVnode是文本节点
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    // 2.2 如果vnode是文本节点，且oldVnode.text不等于vnode.text
    // 直接更新
    nodeOps.setTextContent(elm, vnode.text)
  }
}
```

如果oldCh和ch都存在,进入updateChildren函数.

###updateChildren(parentElm, oldCh, newCh)

```js
// patchVnode的帮助函数，
// 当oldVnode和vnode的children都存在时，
// 使用此updateChildren函数更新elm
function updateChildren(parentElm, oldCh, newCh) {
  // 定义oldCh相关变量
  let oldStartIdx = 0
  let oldStartVnode = oldCh[0]
  let oldEndIdx = oldCh.length - 1
  let oldEndVnode = oldCh[oldEndIdx]
  
  // 定义ch相关变量
  let newStartIdx = 0
  let newStartVnode = newCh[0]
  let newEndIdx = newCh.length - 1
  let newEndVnode = newCh[newEndIdx]
  
  // 1. 满足条件时遍历
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 1.1 如果oldStartVnode未定义，将其指针向右移动一位
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (isUndef(oldEndVnode)) {
      // 1.2 如果oldEndVnode未定义，则将其指针向左移动一位
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 1.3 如果oldStartVnode和newStartVnode表示同一个真实DOM
      patchVnode(oldStartVnode, newStartVnode)
      // 重新设置下标和节点
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 1.4 如果oldEndVnode和newEndVnode表示同一个真实DOM
      patchVnode(oldEndVnode, newEndVnode)
      // 重新设置下标和节点
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 1.5 如果oldStartVnode和newEndVnode表示同一个节点
      // 先比较，然后将oldStartVnode移动到oldEndVnode元素之后
      patchVnode(oldStartVnode, newEndVnode)
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      // 重新设置下标和节点
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 1.6 如果oldEndVnode和newStartVnode表示同一个元素
      // 先比较，然后将oldEndVnode移动到oldStartVnode之前
      patchVnode(oldEndVnode, newStartVnode)
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      // 重新设置下标和节点
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 1.7 首首，尾尾，首尾，尾首 4种情况都没有匹配上
      // 则更新newStartVnode，尝试在oldCh中寻找
      // 如果找到，则patchVnode，并将找到的oldVnode移动到oldStartVnode之前
      // 如果未找到，则创建一个元素，并插入到正确的位置
      const findIndex = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      // 未找到
      if (isUndef(findIndex)) {
        createElm(newStartVnode, parentElm)
      } else {
        patchVnode(vnodeToMove, newStartVnode)
        oldCh[idxInOld] = undefined
        nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
      }
      // 重新设置下标和节点
      newStartVnode = newCh[++newStartIdx]
    }
  }
  
  // 2.1 如果oldStartIdx > oldEndIdx,
  // 说明vnode.children数量多，继续插入未处理的vnode.children
  if (oldStartIdx > oldEndIdx) {
    addVnodes(parentElm, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    // 2.2 如果newStartIdx > newEndIdx
    // 说明vnode.children数量少，移除未匹配的oldVnode.children
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}
```

### 更新最后

dfs递归比较和修改DOM,至此完成更新.修改完成后,会调用updated钩子函数.

## Vue组件相关

网站由Vue组件树组成:

![](./img/components.png)

### Vue组件的本质

在 Vue 里，一个组件本质上是一个拥有预定义选项的一个 Vue 实例。

我们可以注册组件为全局组件,或局部组件.

```js
// 定义名为 todo-item 的全局组件
Vue.component('todo-item', {
  template: '<li>这是个待办项</li>'
})

<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

现在我们可以在我们自己的组件中使用这个组件.渲染函数如果遇到了自定义组件，会调用createComponentInstanceForVnode(vnode,activeInstance)方法进行创建，会触发子组件的beforeCreate钩子，created钩子.

```html
<div>
  <!-- 创建一个 todo-item 组件的实例 -->
  <todo-item></todo-item>
</div>
```

### 组件注册

- 全局注册
- 局部注册

### Vue2组件通信方式

#### 父组件 -> 子组件

- 改变传递的参数,在父组件的更新过程中,会修改传递给子组件的props,而子组件的props是响应式的,会触发子组件更新.(Vue2和Vue3)
- this.$refs.xxx,ref和v-for一起使用时,得到的是数组.在Vue3的组合式API中,保存在ref同名的ref对象中. (Vue2和Vue3)

#### 子组件 -> 父组件

- this.$emit('xxx'),在子组件创建时,beforeCreate钩子触发前,会初始化子组件的\_event属性将父组件的方法加入其中,我们可以通过this.$emit('xxx')来访问this.\_events中定义的父组件的方法.在Vue3中为context.emit(). (Vue2和Vue3)
- this.$parent.xxx (Vue2和Vue3)

#### 不相关组件

- provide/inject (Vue2和Vue3)
- Vue.observable()定义响应式对象 (Vue2)
- 直接使用reactive()定义全局对象(Vue3)
- 使用Vue2实例作为EventBus (Vue2)
- 自己实现EventBus,见JavaScript面试题 (Vue2和Vue3)
- 使用Vuex,Pinia等.(Vue2和Vue3)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>最简单的Vue2程序</title>
  <style>
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    flex-shrink: 0;
   }
  </style>
  <!--导入Vue2.7.16-->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.min.js"></script>
</head>
<body>
<div id="app"></div>
<script>
  'use strict';

  function EventBus() {
   this.events = Object.create(null)
  }

  EventBus.prototype.on = function (event, handler) {
   if (!this.events[event]) {
    this.events[event] = []
   }
   this.events[event].push(handler)
  }

  EventBus.prototype.emit = function (event, ...args) {
   this.events[event]?.forEach(handler => handler(...args))
  }

  EventBus.prototype.off = function(event, deleteHandler) {
   if (this.events[event]) {
    this.events[event] = this.events[event].filter(handler => handler !== deleteHandler)
   }
  }

  const vue = new Vue()

  const eventBus = new EventBus()

  // 定义1个公共响应式对象
  const state = Vue.observable({
   price: 100,
   number: 10,
  })

  // 定义2级组件
  const ChildChildComp = {
   props: {

   },
   inject: ['version'],
   template: `<div style="width: 100px;height: 100px;background-color: rebeccapurple;display: flex;flex-direction: column;">
    <span>{{version}}</span>
    <span>state.price: {{state.price}}</span>
    <span>state.number: {{state.number}}</span>
</div>`
  }

  // 定义1个子组件
  const ChildComp = {
   props: {
    name: {
     type: String,
     required: true,
    },
   },
   components: {
    ChildChildComp,
   },
   template: `<div style="width: 200px;height: 200px;background-color: red;display: flex;flex-direction: column;justify-content: center;align-items: center;">
  <span @click="cao">名字: {{name}}</span>
  <div style="margin-top: 20px;display: flex;">
   <button @click="love">喜欢</button>
   <button @click="disLove">不喜欢</button>
  </div>
  <ChildChildComp/>
    <div style="display: flex;">
     <span>state.number: {{state.number}}</span>
     <span>state.price: {{state.price}}</span>
    </div>

</div>`,
   methods: {
    love() {
     console.log(this.$parent)
     this.$emit('love', this.name)
    },
    disLove() {
     this.$emit('disLove', this.name)
    },
    cao() {
     // eventBus.emit('cao', this.name)
     vue.$emit('cao', this.name)
    },
   },
  }

  // 定义1个Vue组件
  const MyComp = {
   components: {
    ChildComp,
   },
   provide: {
    version: 1,
   },
   template: `<div style="width: 600px;height: 600px;display: flex;flex-direction: column;background-color: orange;">
    <span>{{state.number}}</span>
    <button @click="add">add</button>
    <button @click="dec">dec</button>
    <ChildComp v-for="(item, index) in girl"
               :key="index"
               ref="child"
               style="margin-top: 20px;"
               :name="item.name"
               @love="love"
               @disLove="disLove"
    ></ChildComp>
   </div>`,
   data() {
    return {
     number: 10,
     girl: [
      {
       name: '夏翀',
      },
      {
       name: '吕凤凤',
      },
     ],
    }
   },
   created() {
    // eventBus.on('cao', (name) => {
    //   console.log(`我是MyComp,我要草${name}`)
    // })
    vue.$on('cao', name => {
     console.log(`我是MyComp,我要草${name}`)
    })
   },
   updated() {
    console.log(this.$refs.child[0])
    console.log('更新完成')
   },
   methods: {
    add() {
     state.number++
    },
    dec() {
     state.number--
    },
    love(name) {
     console.log(`喜欢${name}`)
     this.add()
    },
    disLove(name) {
     console.log(`不喜欢${name}`)
     this.dec()
    },
   },
  }

  // 创建Vue组件
  const app = new Vue(MyComp)
  const element = document.getElementById('app')
  app.$mount(element)
</script>
</body>
</html>
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>最简单的Vue2程序</title>
  <style>
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    flex-shrink: 0;
   }
  </style>
  <!--导入Vue3.5.12-->
  <script src="https://cdn.jsdelivr.net/npm/vue@3.5.12/dist/vue.global.min.js"></script>
</head>
<body>
<div id="app"></div>
<script>
  'use strict';

  const state = Vue.reactive({
   number: 10,
  })

  const ChildComp = {
   props: {
    name: {
     type: String,
     required: true,
    }
   },
   template: `
    <div style="width: 500px;height: 500px;background-color: yellow; display: flex;flex-direction: column;">
     <span>{{name}}</span>
     <div style="display: flex;align-items: center;">
      <button @click="love">喜欢</button>
      <button @click="disLove">不喜欢</button>
     </div>
     <span>{{state.number}}</span>
    </div>
   `,
   setup(props, context) {
    console.log(props.name)
    console.log(state.number)
    const a = Vue.inject('a')
    // state

    // methods
    const love = () => {
     context.emit('love', props.name)
     console.log(a)
    }
    const disLove = () => {
     context.emit('disLove', props.name)
    }

    // 返回值
    return {
     name: props.name,
     love,
     disLove,
     state,
    }
   },
  }

  const CompTwo = {
   template: `
    <div style="width: 300px;height: 300px;background-color: blue;display: flex;flex-direction: column;">
     <input v-model="state.number">
    </div>
   `,
   setup() {
    return {
     state,
    }
   }
  }

  const MyComp = {
   components: {
    ChildComp,
    CompTwo,
   },
   template: `
    <div style="width: 1000px;height: 1000px;background-color: red;display: flex;flex-direction: column;">
     <span>{{state.number}}</span>
     <ChildComp ref="myRef" name="申梦瑶" @love="love" @disLove="disLove"/>
     <CompTwo/>
    </div>
   `,
   setup(props, context) {
    // state
    // 保存ref
    const myRef = Vue.ref()
    Vue.provide('a', '江思雨')

    // methods
    const love = name => {
     console.log(`我是MyComp, 喜欢${name}`)
     console.log(myRef.value)
     console.log(context)
    }
    const disLove = name => {
     console.log(`我是MyComp, 不喜欢${name}`)
    }

    // 返回值
    return {
     myRef,
     love,
     disLove,
     state,
    }
   },
  }

  const app = Vue.createApp(MyComp)
  app.mount('#app')

</script>
</body>
</html>
```

### 什么是异步组件?

我们可以把组件改写为函数提供方式，方便进行代码分割，按需加载。

### Vue2如何拓展组件?

#### 1. 基于现有组件扩展extends

```js
const FoodComp = {
  name: 'FoodComp',
  template: `
  <div style="display: flex;flex-direction: column;">
    <span>{{info.name}}</span>
    <span>{{info.power}}</span>
  </div>
  `,
  props: {
    food: {
      type: Object,
      required: true,
      default: () => {
        return {
          name: '默认食物',
          power: 100,
        }
      },
    }
  },
  data() {
    return {
      info: null,
    }
  },
  created() {
    this.info = JSON.parse(JSON.stringify(this.food));
    eventBus.on('change-food', this.changeFood)
  },
  methods: {
    changeFood(food) {
      debugger;
      this.info = JSON.parse(JSON.stringify(food));
    }
  },
  beforeDestroy() {
    eventBus.off('change-food', this.changeFood)
  },
}

// 基于FoodComp创建一个新组件
const ShopFood = {
  name: 'ShopFood',
  extends: FoodComp,
  template: `
  <div style="display: flex;flex-direction: column;">
    <span>{{info.name}}</span>
    <span>{{info.power}}</span>
    <span>{{info.price}}</span>
    <span>{{info.number}}</span>
  </div>
  `,
}
```

#### 2. 使用mixins

可以将公共属性和方法抽离出来，方便复用，当组件初始化时会调用 mergeOptions 方法进行合并，采用策略模式针对不同的属性进行合并。如果重复的话会合并，合并结果是mixin代码先执行，在执行组件自己的方法。

```ts
/**
 * 给Vue构造函数添加mixin静态方法
 * @param mixin
 */
Vue.mixin = function (mixin: Object) {
  // 将this.options和传入的mixin对象混合
  this.options = mergeOptions(this.options, mixin)
  return this
}
```

同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子**之前**调用。

#### 3. 高阶组件

```ts
// 高阶组件函数
function withLogging(Component) {
  return {
    extends: Component,
    created() {
      console.log(`Component ${Component.name} created`);
    },
  };
}

// 使用高阶组件
const LoggedComponent = withLogging({
  template: `<div>Logged Component</div>`,
});

// 注册组件
Vue.component('logged-component', LoggedComponent);
```

## scoped如何修改element-ui的样式

### scoped的原理

当style标签有scoped属性时，它的CSS只作用于当前组件，它是通过**PostCSS**实现的。

为所有的选择器添加一个独一无二的属性选择器，因为全局和其它组件和第三方组件没有这个属性选择器，所以CSS无法影响到它们，也无法直接选择和修改第三方库的CSS样式。

```vue
<template>
  <div class="example">hi</div>
</template>

<style scoped>
.example {
  color: red;
  .button {
    color: yellow;
  }
}
</style>
```

转换结果：

```vue
<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>

<style>
.example[data-v-f3f3eg9] {
  color: red;
  .button[data-v-f3f3eg9] {
    color: yellow;
  }
}
</style>
```

### 如何修改

scoped会给所有选择器添加属性选择器，因为第三方库没有对应的属性选择器，所以默认不会被选中。

- 不使用scoped
- 深度选择器

### Vue2

使用Vue的深度选择器>>>实现样式穿透，本质就是不对第二个参数添加对应的特殊属性选择器。

有些像 Sass 之类的预处理器无法正确解析 `>>>`。这种情况下你可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作。

### Vue3

处于 `scoped` 样式中的选择器如果想要做更“深度”的选择，也即：影响到子组件，可以使用 `:deep()` 这个伪类：

```vue
<style scoped>
.module-two {
	:deep(.el-slider__bar) {
		background-color: yellowgreen;
	}
}
</style>
```

上面的代码会被编译成：

```css
.module-two[data-v-f3f3eg9] .el-slider__bar {
  background-color: yellowgreen;
}
```

## Vue中最少有几个Dep的实例？

core/instance/render.ts的initRender函数会触发2个Dep的创建，(从0开始)0,1

core/Instance/state.ts中const ob = observe(data)，vm.\_data本身会触发第3个Dep的创建id为2

遍vm.\_data,

name触发id=3，订阅者列表watcher的id：2，

age触发id=4，订阅者列表watcher的id：2，

loveGirl触发id=5，  订阅者列表watcher的id：1，2,

loveGirl指向的数组触发id=6，  订阅者列表watcher的id：1，2



loveGirl[0]触发id=7，  订阅者列表watcher的id：1，2，

loveGirl[0].id触发id=8  订阅者列表watcher的id：1，2，

loveGirl[0].name触发id=9  订阅者列表watcher的id：1，2，

loveGirl[0].age触发id=10  订阅者列表watcher的id：1，2，

loveGirl[0].description触发id=11  订阅者列表watcher的id：1，2



loveGirl[1]触发id=12  订阅者列表watcher的id：1，2

loveGirl[1].id触发id=13  订阅者列表watcher的id：1，2

loveGirl[1].name触发id=14  订阅者列表watcher的id：1，2

loveGirl[1].age触发id=15  订阅者列表watcher的id：1，2

loveGirl[1].description触发id=16  订阅者列表watcher的id：1，2



loveGirl[2]触发id=17，  订阅者列表watcher的id：1，2

loveGirl[2].id触发id=18  订阅者列表watcher的id：1，2

loveGirl[2].name触发id=19  订阅者列表watcher的id：1，2

loveGirl[2].age触发id=20  订阅者列表watcher的id：1，2

loveGirl[2].description触发id=21  订阅者列表watcher的id：1，2

## Vue中最少有几个Watcher的实例？

options.watch.loveGirl触发id=1(从1开始)，定义该watcher时，会访问loveGirl属性，订阅dep的id=5的依赖，因为loveGirl对应的childOb存在,所以childOb对应的dep的id=**6**的依赖也会被订阅，因为loveGirl的value是一个数组，所以还会订阅更多dep的id=7，id=12，id=**17**

因为是deep，所以会访问loveGirl的所有属性，从而加入更多的依赖，如下：

id=21，id=20，id=19，id=18

id=16,id=15,id=14,id=13

id=11,id=10,id=9,id=8



vm.$mount(vm.$options.el)触发第2个watcher

render过程获取name，触发了id=3的依赖，订阅它；

获取age，触发了id=4的依赖，订阅它

获取了loveGirl，触发了id=5的依赖，订阅它

因为loveGirl的childOb存在，所以也订阅它的childOb，id=6的依赖

因为loveGirl的childOb存在，且loveGirl是数组，所以订阅更多的依赖，id=7，id=12，id=17

在v-for渲染过程中，读取了loveGirl[0].id,订阅id=8的依赖，同理id=9，id=10，id=11

13,14,15,16

18,19,20,21





实例触发了第3个watcher

## 组件命名和自定义事件命名

### 组件命名

|          | Vue2和Vue3      |
| -------- | --------------- |
| 文件命名 | **PascalCase**  |
| 组件注册 | **PascalCase ** |
| 组件使用 | **PascalCase**  |

### 自定义参数命名

|                 | Vue2和Vue3     |
| --------------- | -------------- |
| 父组件传值      | **kebab-case** |
| 子组件props声明 | **camelCase**  |

### 自定义事件命名

|                | Vue2           | Vue3           |
| -------------- | -------------- | -------------- |
| 父组件定义     | **kebab-case** | **kebab-case** |
| 子组件emit传递 | **kebab-case** | **camelCase**  |

# Vue2.7 添加了什么

Vue 2.7 是 Vue 2 最新的次级版本。其提供了内置的[组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html#composition-api-faq) 支持。

- 组合式 API
- 单文件组件内的 [`<script setup>`](https://cn.vuejs.org/api/sfc-script-setup.html)
- 单文件组件内的 [CSS v-bind](https://cn.vuejs.org/api/sfc-css-features.html#v-bind-in-css)
- `defineComponent()` 以改善类型推断 (较之于 `Vue.extend`)

## 和Vue3组合式语法的差异

组合式 API 使用了 Vue 2 中基于 getter/setter 的响应式系统，以确保浏览器的兼容性。这意味着其行为和 Vue 3 中基于代理的系统相比有一些重要的区别：

- 所有 [Vue 2 检测变化的注意事项](https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E6%A3%80%E6%B5%8B%E5%8F%98%E5%8C%96%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)依然存在。

- `reactive()`、`ref()` 和 `shallowReactive()` 会直接转换原始的对象而不是创建代理。这意味着：

  ```js
  // 2.7 中为 true，3.x 中为 false
  reactive(foo) === foo;
  ```

- 避免将数组作为 `reactive()` 的根值。因为无法访问属性，数组的变更不会被追踪到 (这样做会产生一则警告)。

- 响应式 API 会忽略以 symbol 作为 key 的属性。

















# Vue2 API

```ts
// vue2
function Vue(options) {
  this._init(options)
}

Vue.mixin = function () {}
Vue.prototype.__patch__ = function () {}

export default Vue
```

## 全局函数

### Vue.nextTick

```ts
// src/core/util/next-tick.ts

// 模块作用域,回调函数数组
const callbacks = []
// 待办
let pending = false

// nextTick实用函数，用于将一个函数添加到异步任务中
// 在下次 DOM 更新循环结束之后执行延迟回调
export function nextTick(cb) {
  // 将cb放入callbacks数组中
  callbacks.push(cb)
  
  // 开启异步任务
  // 已经是准备中,直接返回
  if (pending) {
    return
  }
  
  pending = true
  Promise.resolve().then(() => {
    // 开始执行，所以状态改为不是待办
    pending = false
    const callbacksCopy = [...callbacks]
    callbacks.length = 0
    // 遍历执行每一个回调函数
    callbacksCopy.forEach(cb => cb())
  })
}

// 定义Vue.nextTick
Vue.nextTick = nextTick
```

### Vue.set

```ts
Vue.set = function(target, key, val) {
  defineReactive(target, key, val)
  target.__ob__.dep.notify()
}
```

注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象。

#### 声明响应式porperty

由于 Vue 不允许动态添加根级响应式 property，所以你必须在初始化实例前声明所有根级响应式 property，哪怕只是一个空值

#### Vue如何检测数组变化？

Vue 不能检测以下数组的变动：

1. 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`

```js
const vm = new Vue({
  data() {
    return {
      items: [],
    }
  },
})

vm.items[1] = 'x'// 不是响应性的
vm.items.length = 2 // 不是响应性的
```

为了给单个下标赋值,有2种方法:

- Vue.set(vm.items, indexOfItem, newValue)
- vm.items.splice(indexOfItem, 1, newValue)

为了解决第二类问题，你可以使用 `splice`：

- vm.items.splice(newLength)

Object.defineProperty默认无法监听数组的变化，但是Vue对数组的方法进行了重写。

数组考虑性能原因没有用defineProperty对数组的每一项进行拦截，而是选择对7种数组方法进行重写，push，pop,shift,unshift,splice,sort,reverse。

所以在 Vue 中修改数组的索引和长度无法监控到。需要通过以上7种变异方法修改数组才会触发数组对应的watcher进行更新。

#### Vue如何检测对象的变化?

Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的。

```ts
const vm = new Vue({
  data() {
    return {
      a: 1,
    }
  },
})

// vm.a 是响应式的

// vm.b是非响应式的
vm.b = 2
```

对于已经创建的实例,

- Vue**不允许**动态添加根级别的响应式属性
- 可以使用Vue.set(object, name, value)向嵌套对象添加响应式属性.this.$set是Vue.set()的别名

- 为嵌套对象同时添加多个属性,也可以直接赋值新对象.

### Vue.directive

注册或获取全局指令。

### Vue.component

注册或获取全局组件。

### Vue.use

Vue2通过全局方法Vue.use()使用插件,需要在new Vue之前调用.

```ts
// src/core/global-api/index.ts

// 定义Vue.use方法,用来给Vue安装插件
Vue.use = function (plugin: Function | object, ...args) {
  // this为Vue构造函数,使用_installedPlugins来保存安装的插件
  this._installedPlugins = this._installedPlugins || []
  // 已经安装,直接返回
  if (this._installedPlugins.includes(plugin)) {
    return this
  }
  
  // plugin需要为函数,或者plugin.install为函数
  // 如果plugin.install是函数
  if (typeof plugin?.install === 'function') {
    plugin.install(this, ...args)
  } else if (typeof plugin === 'function') {
    plugin(this, ...args)
  }
  // 将plugin添加到this._installedPlugins数组中
  this._installedPlugins.push(plugin)
  return this
}
```

```ts
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

### Vue.mixin

```ts
// 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例.
Vue.mixin = function(mixin: object) {
  // 将this.options和传入的mixin对象混合
  this.options = mergeOptions(this.options, mixin)
  return this
}
```

### Vue.observable

可以作为最小化的跨组件状态存储器.让一个对象可响应。可以做组件通信,类似Vuex.

```ts
// 让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。
Vue.observable = (obj: object) => {
  observe(obj)
  return obj
}
```

## Vue内置指令

指令 (Directives) 是带有 `v-` 前缀的特殊 attribute。指令 attribute 的值预期是**单个 JavaScript 表达式** (`v-for` 是例外情况，稍后我们再讨论)。指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。修饰符可以串联

![](./img/指令格式.png)

### v-if & v-else-if & v-else

值为真,vnode存在.为假,vnode不存在.组件会触发销毁钩子.

v-if是render函数中体现的，根据条件生成或不生成对应的VNode，在vm.\_update()过程中，会销毁或新建对应的元素或子组件。

### v-show

根据表达式之真假值，切换元素的 `display` CSS property。

v-show是普通的指令，在vm.\_update()的patchVnode过程中，会使用一系列函数来更新oldVnode和vnode，其中包括v-show指令，会触发v-show指令的update方法，来根据value设置el.style.display的值，如果为真，则为正常值，否则为none。

### v-for

v-for和v-if一样，也是编译期间使用的指令。

注意增加唯一key值，不要使用index作为key.

```vue
<template>
<div>
  <ul id="example-1">
  	<li v-for="item in items" :key="item.message">
    	{{ item.message }}
  	</li>
	</ul>
	<!--遍历对象-->
  <div v-for="(value, name, index) in object">
  	{{ index }}. {{ name }}: {{ value }}
	</div>
  <!--使用数字-->
  <div>
  	<span v-for="n in 10">{{ n }} </span>
	</div>
</div>
</template>

<script>
  export default {
    data: {
      items: [
        { message: 'Foo' },
        { message: 'Bar' },
      ],
    },
  }
</script>
```

你也可以用 `of` 替代 `in` 作为分隔符，因为它更接近 JavaScript 迭代器的语法.

在组件中使用v-for时,key是必须的.

```vue
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

- Vue2: v-for优先级高
- Vue3: v-if优先级高

### v-on

#### 修饰符

- **.stop** 调用event.stopPropagation()
- **.prevent** 调用event.preventDefault()
- **.native** 监听组件根元素的原生事件(Vue2专属,Vue3已移除,使用v-model取代)
- .passive 可以提高移动端性能,不要把 `.passive` 和 `.prevent` 一起使用，因为 `.prevent` 将会被忽略

v-on，简写为@，用于声明式的为普通元素或自定义组件绑定事件监听器。参数就是事件类型，

- 普通元素，只能监听原生DOM事件
- 自定义组件，监听原生DOM事件，也可以作为参数传递给子组件，子组件使用$emit()可以触发来给父组件传值。

组件的事件系统是基于发布-订阅模式的,vm.\_events为事件中心,在vm的方法中,可以通过$emit('xxx')发布一个事件,会触发vm.\_events['xxx']对应的数组全部执行一遍.v-on:event='handleEvent'就是将handleEvent函数存放在子组件的vm.\_events[event]数组中来订阅一个事件.

有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 `$event` 把它传入方法：

```vue
<template>
	<!--最外层-->
	<div>
    <button @click="greet">Greet</button>
    <button @click="say('hi', $event)">Say hi</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    
  },
}
</script>
```

#### 按键修饰符

```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input @keyup.enter="submit">
```

### v-bind

#### 修饰符

- **.sync** 语法糖，会扩展成一个更新父组件绑定值的 `v-on` 侦听器.

简写为:, 动态的绑定一个或多个attribute，或一个组件的prop 到表达式。

```vue
<text-document
  :title="doc.title"
  @update:title="doc.title = $event"
></text-document>

<!--等效-->
<text-document :title.sync="doc.title"></text-document>
```

### v-model

相关源码位于src/plateform/web/compiler/directives/model.ts

v-model的本质是语法糖,用于在**表单元素**或者**组件**上创建双向绑定.对不同的输入元素将值赋值给特定attr并监听特定的事件.

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- text 和 textarea 元素使用 `value` property 和 `input` 事件；
- checkbox 和 radio 使用 `checked` property 和 `change` 事件；
- select 字段将 `value` 作为 prop 并将 `change` 作为事件。

```vue
<template>
	<!--普通元素和组件,input元素的type为text或textarea-->
	<MyComp v-model="data"></MyComp>
	<!--2种写法等效-->
	<MyComp :value="data" @input="data = $event.target.value"></MyComp>

	<!--input元素type=radio或checkbox-->
	<input type="radio" v-model="data"/>
	<!--等效写法-->
	<input type="radio" :checked="data" @change="data = $event.target.value"/>

	<!--select元素-->
	<select v-model="data"/>
	<!--等效写法-->
	<select :value="data" @change="data = $event.target.value"/>
</template>

<script>
export default {
  name: "TestComp",
  components: {
    MyComp,
  },
  data() {
    return {
      data: null,
    }
  },
}
</script>
```

我们使用输入法时，v-model在输入法组合文字过程中不会更新。如果你也想处理这个过程，请使用 `input` 事件。

组件有一个v-model专属属性model,一个组件上的**v-model**默认会利用名为value的prop和名为input的事件,可以更改默认行为.

```ts
export default {
  name: 'MyComponent',
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: Boolean,
  },
  template: `<input type='checkbox'
  :checked='checked'
  @change=$emit('change', $event.target.checked)>`,
}
```

```vue
<MyComponent v-model="xxx"></MyComponent>
```

Vue2使用.sync创建双向绑定.

Vue3使用v-model创建双向绑定.

#### 如何理解Vue的单项数据流和双向数据流

单向数据流: 数据总是从父组件传到子组件，子组件不可以直接修改，而是调用函数请求父组件修改。

双向数据流: 双向数据流是指数据从父级向子级传递数据，子级可以通过一些手段改变父级向子级传递的数据。

比如用`v-model`、`.sync`来实现双向数据流。

### v-slot

v-slot在父组件使用,表示插槽

v-slot的简写为#,只可以在template元素使用,或只有1个默认插槽的组件上使用.

- 默认参数是default

**\<slot\>是Vue2的内置组件**.

\<slot name='default'\>元素在子组件使用,声明插槽name默认为default,

```vue
<template>
	<!--最外层-->
	<div class="w-full h-full">
		<span class="text-3xl">模块2</span>
		<CardComp :id="24">
			<template v-slot:header="slotParams">
				<div class="flex flex-col">
					<span>头部内容</span>
					<span>{{slotParams.username}}</span>
					<span>{{slotParams.age}}</span>
					<span>{{slotParams.love}}</span>
				</div>
			</template>
			<template v-slot:default>
				<div class="flex flex-col">
					<span class="text-purple-700 text-3xl">这是插槽内容</span>
				</div>
			</template>
		</CardComp>
	</div>
</template>
```

```vue
<template>
	<div class="w-[400px] h-[400px] flex flex-col bg-red border border-amber-400">
		<div class="w-full h-[200px] shrink-0 bg-blue-700 flex justify-center items-center">
			<span class="text-3xl">子组件内部内容,id={{id}}</span>
		</div>
		<slot name="header" :username="name" :age="age" :love="love">
			<div class="flex flex-col">
				<span>默认头部插槽</span>
			</div>
		</slot>
		<slot name="default">
			<div class="flex flex-col">
				<span>这是默认插槽</span>
			</div>
		</slot>
		<slot name="footer">
			<div class="flex flex-col">
				<span>默认尾部插槽</span>
			</div>
		</slot>
	</div>
</template>
```

插槽有几个基本术语和概念：

- 默认插槽：子组件在父组件没有匹配的信息时，默认显示的内容
- 具名插槽：给插槽起的名字，默认为default
- 作用域插槽：父组件使用来自子组件的数据

作用：子组件实现了更好的灵活性。

实现原理？

当组件实例化时，获取到父组件传入的内容，存放在vm.$slot中。组件渲染时遇到slot标签，则用vm.$slot中的内容对默认内容进行替换。

####插槽变化,是否会引起组件变化

会

### v-text

等效于双大括号{{}}

```html
<span v-text="msg"></span>
<!-- 和下面的一样 -->
<span>{{msg}}</span>
```

### 如何自定义指令

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- bind: 只调用一次,指令第一次绑定到元素时调用.
- inserted: 被绑定元素插入父节点时调用
- update: 所在组件更新时调用.
- componentUpdate: 指令所在组件及其所有子组件更新后调用.
- unbind: 只调用一次,指令与元素解绑时调用.

钩子函数的参数:

- el: 指令所绑定的元素,可以用来直接操作DOM
- binding: 一个对象
  - name: 指令名,不包括v-前缀
  - value: 指令的绑定值
- vnode
- oldVnode

除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。

## 特殊属性

### key

```ts
function sameVndoe(a, b) {
  return (
    a.key === b.key &&
    xxx
  )
}
```

key用来高效判断两个虚拟Node节点是否表示相同的实际DOM,如果key不一样,则一定不是同一个节点.

如果不使用key，Vue会使用一种**最大限度减小动态元素并尽可能的复用相同类型元素**的算法.

### ref

`ref` 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs` 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例.

## Vue构造函数参数

### name

组件名称.

### el

只在用 `new` 创建实例时生效.指定挂载DOM.也可以不使用这个属性,而使用$mount()方法挂载.

### tenplate

一个字符串模板作为 Vue 实例的标识使用。

### components

引用的其它组件.

### mixins

混入其它js文件.

### provide & inject

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖.

`provide` 和 `inject` 绑定并不是可响应的。这是刻意为之的。

```ts
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar'
  },
  // ...
}

// 子组件注入 'foo'
var Child = {
  inject: ['foo'],
  created () {
    console.log(this.foo) // => "bar"
  }
  // ...
}
```

### props

组件接收的参数.

### data

定义的响应式对象.

### computed

计算属性.

### watch

侦听器.

### beforeCreate

### created

### beforeMount

### mounted

### beforeUpdate

### updated

### beforeDestroy

实例销毁之前调用。在这一步，实例仍然完全可用。我们可以在这时进行 善后收尾工作，比如清除定时器。

### destroyed

实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。

### 父组件和子组件生命周期的关系

首次加载过程

父beforeCreate -> 父created -> 父beforeMount -> 

子beforeCreate -> 子created -> 子beforeMount -> 子mounted ->

父mounted

父mounted不保证一定在子mounted之后



销毁过程
父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed

### methods

## Vue实例属性

### vm.$el

vue实例绑定的实际DOM元素.

### vm.$parent

### vm.$refs

### vm.$options

### vm.$data

## Vue实例方法

### vm.$mount

将当前实例绑定到指定元素.

实现原理: 使用Vue实例得到的元素,完全替换传入的元素.这样传入的元素将被移除出DOM树,因此多次绑定到一个元素会失败,因为之后绑定的该元素已经被移除出DOM树,将Vue实例挂载到不在DOM树上的元素是不被渲染的.

在学习Vue Router中,我尝试自己实现Vue Router,多次失败,最终定位原因是,每次vm.$mount()之后,传入的元素会被移除出DOM树,对那个元素的所有操作将不被渲染.

### vm.$set

### vm.$forceUpdate

### vm.$nextTick

### vm.$on(Vue3已移除)

```ts
/**
 * $on方法,一个函数订阅指定事件 
 * @params event
 * @params fn
 */
Vue.prototype.$myOn = function(event, fn) {
  // 获取当前vm
  const vm = this
  // 如果event是数组的话,递归调用
  if (Array.isArray(event)) {
    for (const e of event) {
      vm.$myOn(e, fn)
    }
  } else {
    // 是一个普通事件
    if (!vm._events[event]) {
      vm._events[event] = []
    }
    vm._events[event].push(fn)
  }
  return vm
}
```

### vm.$once(Vue3已移除)

```ts
// $once方法,一个函数订阅指定事件,但只订阅第一次触发
Vue.prototype.$myOnce = function(event, fn) {
  // 获取当前vm
  const vm = this
  // 定义一个内部函数,把event包装起来
  function on() {
    vm.$off(event, on)
    fn.apply(vm, argument)
  }
  // 取消订阅会用到
  on.fn = fn
  // 将on包装器订阅指定事件
  vm.$on(event, on)
  return vm
}
```

### vm.$off(Vue3已移除)

```ts
// $off方法,取消订阅事件
Vue.prototype.$myOff = function(event, fn) {
  // 获取当前vm
  const vm = this
  // 1. 如果没有任何参数,则是取消全部事件和对应的订阅列表
  if (!argument.length) {
    vm._events = Object.create(null)
    return vm
  }
  // 2. 如果event为数组,递归调用本方法
  if (Array.isArray(event)) {
    for (const e of event) {
      vm.$off(e, fn)
    }
    return vm
  }
  // 3. 没有指定fn, 则清除订阅该事件的所有订阅函数
  if (!fn) {
    vm._events[event] = null
    return vm
  }
  // 4. 取消fn对event的订阅
  vm._events[event] = vm._events[event].filter(item => item!==fn && item.fn!==fn)
}
```

### vm.$emit

```ts
// vm发布一个事件,会触发订阅了该事件的函数
Vue.prototype.$myEmit = function(event) {
  // 获取当前vm
  const vm = this
  const args = Array.from(arguemnts).slice(1)
  for (const fn of vm._events[event]) {
    fn.apply(vm, args)
  }
  return vm
}
```

## Vue内置组件

### component

有1个特殊属性is,表示是哪个组件.可以在动态组件中使用.

porps接收is参数，渲染一个"元组件"为**动态组件**。根据is的值，来决定哪个组件被渲染。

```vue
<!--动态组件由vm实例的componentId属性控制-->
<component :is="componentId"></component>
```

### keep-alive

keep-alive主要用于保留组件状态或避免重新渲染。

keep-alive组件包裹**动态组件**时，会缓存不活动的组件实例，而不是销毁它们。keep-alive是一个**抽象组件**，它自身不会渲染一个DOM元素，也不会出现在组件的父组件链中。

当组件在keep-alive内被切换，它的activated和deactivated这2个生命周期钩子函数将会被对应执行。所有嵌套组件都会触发这2个生命周期钩子。

```vue
<template>
	<!--基本用法-->
	<keep-alive>
    <component :is="view"></component>
  </keep-alive>

	<!--多个条件判断的子组件-->
	<keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>
</template>
```

keep-alive的子元素最多有1个被渲染，且不可以和v-for同时使用。

props有

- include 字符串或正则表达式。只有名称匹配的组件会被缓存
- exclude 符串或正则表达式。任何名称匹配的组件都不会被缓存
- max 数字。最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中LRU 算法，**最久没有被访问**的实例会被销毁掉

如何实现LRU算法？

- 新加入的放入数组尾部
- 被访问的移动到尾部
- 到达max时，数组头部元素就是最久未被访问的元素，删除数组头部元素

keep-alive组件是一个抽象组件，本身不会被渲染到真实DOM中，当最外层的view变化时，会触发最外层vm.\_update()方法执行，在patch过程中，会更新传递给keep-alive的slot内容，slot内容变化时，会通知keep-alive组件进行更新。在keep-alive组件进行更新过程中，也就是keep-alive的render函数执行中，如果其子组件已经被缓存，直接设置vnode.componentInstance = cache[key].componentInstance，然后将该组件在keys中移动到数组尾部，这样在之后patch过程中创建子组件时会直接使用componentInstance，而无需重新创建；如果这是第一次被访问，render函数会将子vnode设置到vnodeToCache属性中，在updated钩子触发时，将其保存到cache中。

```js
// 手写keep-alive
const MyKeepAlive = {
  name: 'MyKeepAlive',
  abstract: true, // 声明为抽象组件，不会实际渲染到 DOM
  created() {
    this.cache = Object.create(null)
  },
  render() {
    // 获取要渲染的子组件
    let vnode = this.$slots.default ? this.$slots.default[0] : null;

    if (vnode) {
      if (this.cache[vnode.tag]) {
        vnode.componentInstance = this.cache[vnode.tag].componentInstance
      } else {
        this.cache[vnode.tag] = vnode
      }
      // 记住写，patch过程的createElement使用这个标志来识别是否是内置的keep-alive
      vnode.data.keepAlive = true
    }
    return vnode; // 返回组件
  },
}
```

#### 独特生命周期钩子

被keep-alive组件包裹的组件有2个独特的生命周期钩子

- activated: 被 keep-alive 缓存的组件激活时调用。
- deactivated: 被 keep-alive 缓存的组件失活时调用。

### template

一个 `<template>` 元素当做不可见的包裹元素

Vue2的template不允许有多个根元素，可以简化patch过程。

Vue3支持多个根元素。





# Vue2和Vue3的区别

## 编译文件的区别

```ts
// vue2
function Vue(options) {
  this._init(options)
}

Vue.mixin = function () {}
Vue.prototype.__patch__ = function () {}

export default Vue
```

```ts
// vue3
function ref(value) {
  return createRef(value, true)
}

const createApp = (...args) => {
  // ...
}

export {
	ref,
  createApp,
}
```

# Vue3 API

## 响应式API

### ref & shallowRef & isRef

接受一个值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`。

```ts
// 源码
// ref函数,RefImpl类的工厂函数的一种情况
function ref(value) {
  return createRef(value, false)
}

// shallowRef函数,RefImpl类的工厂函数的另一种情况
function shallowRef(value) {
  return createRef(value, true)
}

// createRef函数,是RefImpl类的工厂函数
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue
  }
  
  return new RefImpl(rawValue, shallow)
}

// RefImpl类
class RefImpl {
  constructor(value, isShallow) {
    this.dep = new Dep()
    // ...
  }
  
  // value为getter和setter属性
  get value() {
    
  }
  
  set value(newValue) {
    
  }
}

// 工具函数
function isRef(value) {
  return value && value['__v_isRef'] === true
}
```

测试代码:

```ts
import { ref } from './vue.js'

const count = ref(0)
console.log(count.value) // 0

count.value = 1
console.log(count.value) // 1
```

### computed

```ts
// 源码
// computed函数是ComputedRefImpl类的工厂函数.
const computed = getterOrOptions => {
  let getter
  let setter
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  
  return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl {
  constructor(fn, setter) {
    this.fn = fn
    this.setter = setter
    this.dep = new Dep(this)
  }
  
  // value为getter和setter属性
  get value() {
    
  }
  
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue)
    }
  }
  
  // 和RefImpl类比,多了一个notify方法
  notify() {
    
  }
}
```

测试代码:

```ts
import {computed, ref} from "./vue.js"

const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误
```

```ts
import {computed, ref} from "./vue.js"

const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
   count.value = val - 1
  }
})

plusOne.value = 10
console.log(count.value) // 9
```

### reactive

返回一个对象的响应式代理。

```ts
// 源码
// 模块作用域变量,保存所有reactive函数定义的原始obj到proxy的映射关系
const reactiveMap = new WeakMap()

function reactive(obj) {
  // obj不是对象类型,直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  
  // 该对象已经被reactive处理过,直接返回缓存值
  if (reactiveMap.has(obj)) {
    return reactiveMap.get(obj)
  }
  
  const proxy = new Proxy(target, handlers)
  reactiveMap.set(obj, proxy)
  return proxy
}
```

测试代码:

```ts
import {reactive} from "./vue.js"

const obj = reactive({ count: 10 })
console.log(obj.count)// 10

obj.count++
console.log(obj.count)// 11
```

reactive会解包ref对象,即可以也必须省略.value属性来访问ref的值.

```ts
import {reactive, ref} from "./vue.js"

const count = ref(1)
const obj = reactive({ count })

// ref 会被解包
console.log(obj.count === count.value) // true

// 会更新 `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// 也会更新 `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```

注意当访问到某个响应式数组或 `Map` 这样的原生集合类型中的 ref 元素时，**不会**执行 ref 的解包：

```ts
import {reactive, ref} from "./vue.js"

const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

将一个 [ref](https://cn.vuejs.org/api/reactivity-core.html#ref) 赋值给一个 `reactive` 属性时，该 ref 会被自动解包：

```ts
import {reactive, ref} from "./vue.js"

const count = ref(1)
const obj = reactive({})

obj.count = count

console.log(obj.count) // 1
console.log(obj.count === count.value) // true
```

### watchEffect

立即运行一个函数,同时响应式的追踪其依赖,并在依赖更改时重新运行.

```ts
// 源码
function watchEffect(effect, options) {
  return doWatch(
    effect,
    null,
    options,
  )
}

function watchPostEffect(effect, options) {
  return doWatch(
    effect,
    null,
    {
      ...options,
      flush: 'post',
    },
  )
}

function watchSyncEffect(effect, options) {
  return doWatch(
    effect,
    null,
    {
      ...options,
      flush: 'sync',
    },
  )
}

function watch(source, cb, options) {
  return doWatch(source, cb, options)
}
```

测试代码: 

```ts
import {ref, watchEffect} from './vue.js'

const t1 = ref(10)
const t2 = ref(20)

watchEffect(() => {
	console.log(`t1: ${t1.value}, t2: ${t2.value}, t1 + t2 = ${t1.value + t2.value}`)
}, {
	flush: 'sync',
})

t1.value = 100
t2.value = 3000
```

### watch

侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数。

第一个参数是侦听器的**源**。这个来源可以是以下几种：

- 一个函数，返回一个值
- 一个 ref
- 一个响应式对象
- ...或是由以上类型的值组成的数组

第二个参数是在发生变化时要调用的回调函数。这个回调函数接受三个参数：新值、旧值.当侦听多个来源时，回调函数接受两个数组，分别对应来源数组中的新值和旧值。

watch的回调函数也会解包ref.

```ts
import {ref, watch} from './vue.js'

const t1 = ref(10)

watch([t1], (value, oldValue) => {
  console.log(`旧值: ${oldValue}, 新值: ${value}`)
}, {
  deep: true,
})

t1.value = 20
t1.value = 50
```

# Vue3

## Vue3如何获取props和触发事件

```vue
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

## Vue3的响应式原理

Vue3是使用了Proxy和effect和依赖追踪机制,Vue的响应式系统会在每个依赖数据的地方注册一个副作用函数(effect),这些副作用函数会在数据变化时被重新执行.

Vue3.5使用链表代替了Set数据结构,以提升副作用函数在频繁插入和删除时的效率.































