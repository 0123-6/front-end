# Vue3学习

Vue3不再支持el属性，需要调用vm.mount()手动挂载。

```js
import MyTest from './MyTest.js'

// Vue.createApp()返回的是一个单纯的对象，包含mount()方法
let myVue = Vue.createApp(MyTest)
// vm.mount()返回的才是项目中实际用到的，绑定了DOM的Vue实例
myVue = myVue.mount('#app')

window.myVue = myVue
```

# Vue3的初始化过程

## 引入Vue3

在html文件中引入Vue3

```html
<!--引入vue3，会产生全局变量Vue-->
<script src="../../dist/vue.global.js"></script>
<!--自己的主js文件-->
<script type="module" src="./index.js"></script>
```

定义第1个Vue组件

```js
// 定义1个Vue组件
export default {
  name: 'MyTest',
  // 模板
  template: `
   <div style="display: flex;flex-direction: column;">
    <span>{{name}}</span>
    <span>{{age}}</span>
    <span @click="inc">添加</span>
   </div>
  `,
  data() {
   return {
    name: '夏翀',
    age: 25,
   }
  },
  beforeCreate() {
   console.log('进入了beforeCreate钩子')
  },
  created() {
   console.log('进入了created钩子')
  },
  beforeMount() {
   console.log('进入了beforeMount钩子')
  },
  mounted() {
   console.log('进入了mounted钩子')
  },
  beforeUpdate() {
   console.log('进入了beforeUpdate钩子')
  },
  updated() {
   console.log('进入了updated钩子')
  },
  methods: {
   inc() {
    this.age++
   }
  },
}
```

在主js文件index.js中引入

```js
// 引入MyTest组件
import MyTest from './MyTest.js'

// 使用Vue.createApp()创建一个vm实例
let myVue = Vue.createApp(MyTest)

// 将实例绑定到真实DOM上
myVue = myVue.mount('#app')

window.myVue = myVue
```

## 执行ensureRenderer()获取渲染者

**Vue.createApp()**方法的定义位于core/packages/runtime-dom/src/index.ts

```js
export const createApp = (...args) => {
  // 调用ensureRenderer().createApp()生成vm
  const app = ensureRenderer().createApp(...args)
  // 获取并改造vm.mount()方法
  const {mount} = app
  app.mount = () => {
    // ...具体实现
  }
  // 返回vm
  return app
}
```

现在进入**ensureRender()**方法，renderer对象不存在，调用createRenderer()函数。

```js
// 渲染者缓存对象
let renderer
// 获取渲染者对象
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions))
}
```

**createRenderer()**位于core/packages/runtime-core/src/renderer.ts文件

```js
export function createRenderer(options) {
  // 返回baseCreateRenderer(options)
  return baseCreateRenderer(options)
}
```

进入baseCreateRenderer(options)函数

```js
function baseCreateRenderer(options) {
  // 从options解构出实用方法
  const {
    insert,
    remove,
    createElement,
    // ...
  } = options
  // 定义patch函数
  const patch = (n1, n2) => {}
  // 定义processText函数
  const processText = (n1, n2) => {}
  // ...其它函数
  // 定义patchElement
  const patchElement = (n1, n2) => {}
  // 定义mountComponent
  const mountComponent = () => {}
  // 定义patchChildren
  const patchChildren = (n1, n2) => {}
  // 定义render函数
  const render = (vnode) => {}
  
  // 至此，渲染者创建完成，返回
  return {
    // 渲染函数
    render,
    // 最外层ensureRenderer().createApp()即是调用此方法
    createApp: createAppAPI(render)
  }
}
```

至此，基本到了ensureRenderer()函数的末端，此时调用堆栈为：

- 用户代码，Vue.createApp(MyTest)
- runtime-dom/src/index.ts的createApp
- 同文件的ensureRenderer()函数 666
- runtime-core/src/renderer.ts的createRenderer()函数 666
- 同文件的baseCreateRenderer()函数 666
- runtime-core/src/apiCreateApp.ts文件的createAppAPI函数，返回闭包createApp()函数 6666

至此，ensureRenderer()函数执行完毕，renderer被保存在runtime-dom/src/index.ts的renderer属性中。

## 执行ensureRenderer().createApp()方法

ensureRenderer()执行完毕，开始执行ensureRenderer().createApp()方法

```js
// Vue.createApp()方法定义
export const createApp = (...args) => {
  // 开始执行ensureRenderer().createApp()方法
  const app = ensureRenderer().createApp(...args)
}
```

createApp()方法定义在runtime-core/src/apiCreateApp.ts的createAppAPI的闭包中。

```js
function createApp(rootComponent) {
  // 创建上下文对象
  const context = createAppContext()
  // 已安装的插件
  const installedPlugins = new WeakSet()
  // 是否已绑定到实际DOM
  let isMounted = false
  
  // 定义app
  const app = {
    _uid: uid++,
    _component: rootComponent,
    _context: context,
    
    use(plugin) {},
    mixin(mixin) {},
    component(name, component) {},
    // mount()为核心方法，将vue渲染到实际DOM
    mount() {},
  }
  // 返回app对象
  return app
}
```

进入createAppContext()函数，位于同一文件：

```js
export function createAppContext() {
  return {
    app: null,
    config: {},
    mixins: [],
    components: {},
    // ...其它属性
  }
}
```

createAppContext()执行完毕后，定义app对象并返回，至此，ensureRenderer().createApp()执行完毕。

app是返回的对象，内部属性大多保存在app.\_context属性中。

## 改造app.mount

```js
const {mount} = app
app.mount = () => {}

return app
```

至此，Vue.createApp()执行完毕。

## 总结

Vue3不是通过new一个Vue来实现的，而是通过一系列函数来实现，Vue.createApp(MyComponent)是程序的入口点，该方法首先调用ensureRenderer()定义了一个渲染者对象，然后调用该渲染者对象的createApp()方法，产生一个app对象，app对象即是最终返回的对象，app.\_context属性保存了大部分内部属性，app上定义了大部分Vue的方法，比如use,mount等。

const app = ensureRenderer().createApp()执行完毕后，改造app.mount方法，然后返回app对象。

# 通过Vue.createApp()定义的vm的mount过程

感觉Vue.createApp()本身没有做什么事情，连data响应式都没有做，没有触发Vue的任何生命周期钩子。

mount()方法才是重头戏。

mount()方法的定义在runtime-dom/src/index.ts的createApp函数中。

```js
export const createApp = (...args) => {
  //... 其它代码
  const {mount} = app
  // 重新定义app.mount
  app.mount = (selector) => {
    // 获取实际DOM
    const container = normalizeContainer(selector)
    // 清空要绑定的实际DOM
    container.innerHTML = ''
    // 调用app原来的mount方法开始绑定
    const proxy = mount(container)
    // 返回mount()返回的proxy
    return proxy
  }
}
```

app原来的mount()函数定义在runtime-core/src/apiCreateApp.ts文件，createApp()创建的app对象上，这个对象也是vm本身。

```js
const app = {
  mount(rootContainer) {
    // 如果已经绑定
    if (isMounted) {
      console.error('已经绑定了，请检查')
      return
    }
    
    // 获取vnode实例，参数为vue组件
    const vnode = createVNode(rootComponent, rootProps)
    // 设置vnode对应的vue实例的上下文对象
    vnode.appContext = context
    // 将vnode渲染到实际DOM上
    render(vnode, rootContainer)
    // 设置已渲染标记为true
    isMounted = true
    // app._container保存着vm对应的实际DOM
    app._container = rootContainer
    
    // 返回proxy，什么proxy？？？
    return getExposeProxy(vnode.component) || vnode.component.proxy
  },
}
```

我们看createVNode()函数,该函数定义在runtime-core/src/vnode.ts文件，

```js
// 创建VNode
export const createVNode = _createVNode

// type为类型，
function _createVNode(type, props) {
  
}
```



# Vue指令分类

## 编译指令

## 普通指令

v-model：runtime-dom/src/directives/vModel.ts

v-on: runtime-dom/src/directives/vOn.ts

































































































































