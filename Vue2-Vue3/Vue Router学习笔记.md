# Vue Router是什么

Vue Router是Vue.js2和Vue.js3的官方路由.当然可以不使用Vue Router库,而自己实现简单的路由功能:

```ts
// src/router.ts
export interface IRouterParams {
  routes: object,
  updateCallback: Function,
}

export class Router {

  routes: object
  updateCallback: Function

  constructor(params: IRouterParams) {

    this.routes = params.routes
    this.updateCallback = params.updateCallback
    this.updateBind = this.update.bind(this)

    window.addEventListener('popstate', this.updateBind)
  }

  push(pathname: string) {
    history.pushState(null, '', pathname)
    this.updateCallback(this.getComponent())
  }

  replace(pathname: string) {
    history.replaceState(null, '', pathname)
    this.updateCallback(this.getComponent())
  }

  getComponent() {
    return this.routes[location.pathname] || this.routes['*']
  }

  update() {
    this.updateCallback(this.getComponent())
  }

  destroy() {
    window.removeEventListener('popstate', this.updateBind)
  }
}
```

```ts
import {Router} from "./router";

const IndexPage = {
	name: 'IndexPage',
	template: `
		<div style="width: 100%;height: 600px;background-color: orange;display: flex;flex-direction: column;">
			<span>首页</span>
			<span>{{number}}</span>
			<div style="width: 100%;display: flex;align-items: center;">
				<button @click="add">add</button>
				<button @click="dec">dec</button>
			</div>
		</div>
	`,
	data() {
		return {
			number: 0,
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

const CompOne = {
	name: 'CompOne',
	template: `
		<div style="width: 100%;height: 600px;background-color: deeppink;">
			<span>组件1</span>
			<span>{{number}}</span>
			<div style="width: 100%;display: flex;align-items: center;">
				<button @click="add">add</button>
				<button @click="dec">dec</button>
			</div>
		</div>
	`,
	data() {
		return {
			number: 0,
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

const CompTwo = {
	name: 'CompTwo',
	template: `
		<div style="width: 100%;height: 600px;background-color: green;">
			<span>组件2</span>
			<span>{{number}}</span>
			<div style="width: 100%;display: flex;align-items: center;">
				<button @click="add">add</button>
				<button @click="dec">dec</button>
			</div>
		</div>
	`,
	data() {
		return {
			number: 0,
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

let routeApp = null

const router = new Router({
	routes: {
		'/index': IndexPage,
		'/one': CompOne,
		'/two': CompTwo,
	},
	updateCallback: routeComp => {
		const routeElement = document.getElementById('routeApp') || routeApp.$el
		routeApp = new Vue(routeComp)
		routeApp.$mount(routeElement)
	}
})

// 1. 创建Vue根组件
const RootComp = {
	components: {
		IndexPage,
		CompOne,
		CompTwo,
	},
	template: `
			<!--最外层-->
			<div style="width: 100vw;height: 100vh;background-color: chartreuse;display: flex;flex-direction: column;">
				<!--大方块-->
				<div style="width: 300px;height: 300px;background-color: blue;"></div>
				<!--导航栏-->
				<div style="width: 100%;height: 100px;display: flex;align-items: center;">
					<button style="margin-right: 20px;" @click="goIndex">首页</button>
					<button style="margin-right: 20px;" @click="goCompOne">CompOne</button>
					<button style="margin-right: 20px;" @click="goCompTwo">CompTwo</button>
				</div>
				<!--路由渲染器-->
				<div id="routeApp"></div>
			</div>
		`,
	methods: {
		goIndex() {
			router.replace('/index')
		},
		goCompOne() {
			router.replace('/one')
		},
		goCompTwo() {
			router.replace('/two')
		},
	},
}

// 创建Vue根组件
const app = new Vue(RootComp)
// 获取document中Vue要挂载的根元素
const element = document.getElementById('app')
// 将根组件挂载到指定元素上
app.$mount(element)
```

路由功能很常用,所以Vue官方实现了一个库来实现这个功能,我们就不用自己开发了.

- Vue2对应Vue Router3
- Vue3对应Vue Router4

Vue Router是一个npm包，或者一个js文件，是Vue.js官方开发的路由管理器。Vue Router即VueRouter.js,和Vue.js的核心深度集成，主要用于构建SPA单页应用。

使用Vue.js，我们已经可以通过组合组件来组成应用程序，为了构建单页应用，也就是让应用程序可以和地址栏交互，我们引入Vue Router，建立URL和Vue组件的对应关系，应用程序的最外层使用\<RouterView/\>组件替换.

## Vue Router3(理解这5个概念)

- 嵌套的路由/视图表
- 模块化的、基于组件的路由配置
- 路由参数、查询、通配符
- 细粒度的导航控制
- HTML5 历史模式

## Vue Router4

- 嵌套路由
- 路由参数、通配符
- HTML5历史模式

## Vue2

```html
<!--html文件-->
<body>
<div id="app"></div>
</body>

const routes = [
  // 404
	{
		name: 'notFound',
		path: '*',

		component: () => import('@views/not-found/NotFound.vue'),
	}
]

const router = new VueRouter({
	base: '/',
	mode: 'history',
	routes,
})

new Vue({
	// 绑定的HTML根元素
	el: '#app',
	// 渲染函数
	render: h => h('RouterView'),
	// 路由器
	router: router,
})

<!--渲染之后-->
<body>
<router-view/>
</body>
```

\<router-view/\>是一个**函数式Vue组件**，用来渲染VueRouter和当前路由记录匹配的Vue组件。

## Vue3

```
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 404
  {
    name: 'notFound',
    // 删除了*通配符
    path: '/:pathMatch(.*)*',
    
    component: () => import('@views/not-found/NotFound.vue'),
  }
]

// 1. new Router变成了createRouter
const router = createRouter({
  // 2. base参数移除，之前的base配置被作为history函数的参数传递
  // 3. mode属性改为history属性,值改为一个函数
  history: createWebHistory('/')
  routes,
})
```

# 安装

## script标签形式

在Vue后面加载vue-router，它会自动安装的：

```js
// vue-router/src/router.js
if (window.Vue) {
  window.Vue.use(VueRouter)
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>vite-vue2</title>
	<!--导入Vue-->
	<script src="/node_modules_myself/vue/dist/vue.js"></script>
	<!--导入VueRouter3,适合Vue2-->
	<script src="https://cdn.jsdelivr.net/npm/vue-router@3.6.5/dist/vue-router.min.js"></script>
  <!--导入VueRouter4,适合Vue3-->
  <script src="https://cdn.jsdelivr.net/npm/vue-router@4.4.5/dist/vue-router.global.min.js"></script>
	<script type="module" src="/src/main.js"></script>
</head>
<body>
<div id="app"></div>
</body>
</html>
```

## npm包形式

```cmd
# Vue Router3,适配Vue2
npm install vue-router

# Vue Router4,适配Vue3
npm install vue-router@4
```

使用包管理器的项目通常会使用 ES 模块来访问 Vue Router，例如 `import { createRouter } from 'vue-router'`。

如果在一个模块化工程中使用它，必须通过Vue.use()明确地安装路由功能

```js
import Vue from 'vue'
import VueRouter from "vue-router"

Vue.use(VueRouter)
```

## Vue Router3 install方法

```ts
// vue-router/src/install.js
export function install (Vue) {
  // 1. 给Vue的实例添加2个钩子
  Vue.mixin({
    // 创建前，设置组件的_router和_route
    beforeCreate () {
      this._routerRoot = this
      this._router = this.$options.router
      // 初始化当前组件的路由相关
      this._router.init(this)
      // 设置_route
      Vue.util.defineReactive(this, '_route', this._router.history.current)
    },
    // vm销毁后
    destroyed () {
      
    },
  })
  
  // 2. 给Vue.prototype添加2个属性$router,$route,这样，我们可以在Vue实例中通过this.$router访问路由器，通过this.$route访问当前路由：
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
  
  // 3. 添加了一些组件配置选项
  // beforeRouteEnter
  // beforeRouteUpdate
  // beforeRouteLeave
  
  // 4. 注册全局组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
}
```

## Vue Router4 install方法

```ts
// app为createRouter()创建的Vue对象
install(app: App) {
  // this为router对象
  const router = this
  // 1. 全局注册RouterLink组件，RouterView组件
  app.component('RouterLink', RouterLink)
  app.component('RouterView', RouterView)
  
  // 2. 添加全局的$router和$route属性
  app.config.globalProperties.$router = router
  Object.defineProperty(app.config.globalProperties, '$route', {
     enumerable: true,
     get: () => unref(currentRoute),
  })
  // 3. 启用useRouter()和useRoute()组合式函数
  // 4. 触发路由器解析初始路由
}
```

# 起步

我们使用Vue,通过组合组件已经可以构建应用程序.通过Vue Router,可以将组件可以和URL建立关系,我们需要将组件映射到路由,并指定渲染位置.

## Vue Router3

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>学习Vue Router3</title>
  <style>
	  * {
		  margin: 0;
		  padding: 0;
      box-sizing: border-box;
      flex-shrink: 0;
	  }
  </style>
  <!--引入主js文件-->
  <script type="module" src="src/index.ts"></script>
</head>
<body>
<div id="app"></div>
</body>
</html>
```

```ts
// src/index.ts
import Vue from 'vue/dist/vue.esm.browser.js'
import VueRouter from '../../../dist/vue-router.esm.browser.js'
import router from './router'

// 手动安装VueRouter
Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h('RouterView'),
  // 添加一个自定义参数router,在VueRouter的install函数有用,
  // 通过自定义参数router，我们可以在任何组件内通过 this.$router 访问路由器，
  // 也可以通过 this.$route 访问当前路由：
  router
})

```

```ts
// src/router/index.ts
import VueRouter from '../../../../dist/vue-router.esm.browser.js'

// 定义路由器
const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: () => import('../views/login/LoginPage'),
    },
    {
      path: '/',
      redirect: '/index',
      meta: {
        requireAuth: true,
      },

      component: () => import('../views/layout/LayoutPage'),
      children: [
        {
          path: '/index',
          component: () => import('../views/index/IndexPage'),
        },
        {
          path: '/module-two',
          component: () => import('../views/module-two/ModuleTwo'),
        },
        {
          path: '/person-center',
          component: () => import('../views/person-center/PersonCenter')
        },
      ],
    }
  ],
})

export default router

```

```ts
// views/layout/LayoutPage.ts
// 最外层框架组件
export default {
  name: 'LayoutPage',
  template: `
    <div style="width: 100vw;height: 100vh;display: flex;flex-direction: column;background-color: orange">
      <!--导航栏-->
      <div style="width: 100%;height: 60px;display: flex;background-color: green;align-items: center;gap: 30px;">
        <RouterLink to="/index">index</RouterLink>
        <RouterLink to="/module-two">module-two</RouterLink>
        <RouterLink to="/person-center">person-center</RouterLink>
      </div>
      <!--内容区-->
      <RouterView/>
    </div>
  `,
}
```

## Vue Router4

请注意,在Vue3 + Vue Router4中,引入的Vue版本和Vue2不同,在Vue2引入esm-browswe版本,但是在Vue3中引入esm-bundler版本.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>学习Vue Router4</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			flex-shrink: 0;
		}
	</style>
	<script type="module" src="src/index.ts"></script>
</head>
<body></body>
</html>
```

```ts
// src/index.ts
import {createApp} from "vue/dist/vue.esm-bundler.js";
import router from "./router";

// 创建Vue实例,这里我们将根模版设置为RouterView组件
const app = createApp({
	template: `<RouterView/>`,
})
// 使用的不是createRouter本身,而是执行创造的对象,类似createApp.
app.use(router)
// 绑定DOM
app.mount(document.body)
```

```ts
// src/router.ts
import {createRouter, createWebHistory} from '../../../dist/vue-router.esm-browser.js'

// 路由器实例是通过createRouter()函数创建的
const router = createRouter({
  // history取代mode选项,base参数被移除,现在将其作为createWebHistory的参数
	history: createWebHistory('/'),
	routes: [
		// 登录页面
		{
			path: '/login',
			component: () => import('../views/login/LoginPage'),
		},
		{
			path: '/',
			redirect: '/index',
			component: () => import('../views/layout/LayoutPage'),

			children: [
				{
					path: '/index',
					component: () => import('../views/index/IndexPage'),
				},
			],
		},
		// 404
		{
			path: '/:pathMatch(.*)*',
			component: () => import('../views/not-found/NotFound'),
		},
	],
})

export default router
```

```ts
// src/views/login/LoginPage.ts
import {ref} from "vue/dist/vue.esm-browser.js";
import {useRouter} from '../../../../dist/vue-router.esm-browser.js'

export default {
	name: 'LoginPage',
	template: `<div style="width: 100vw;height: 100vh;display: flex;flex-direction: column;justify-content: center;align-items: center;background-color: red;">
		<div style="width: 600px;height: 600px;display: flex;flex-direction: column;gap: 20px;">
			<span>登录页面</span>
			<div style="display: flex;align-items: center;">
				<span>账户: </span>
				<input type="text" v-model="username" autocomplete="off">
			</div>
			<div style="display: flex;align-items: center;">
				<span>密码: </span>
				<input type="password" v-model="password" autocomplete="off">
			</div>
			<button @click="login"></button>
		</div>
</div>`,
	setup() {
		const username = ref('')
		const password = ref('')

		function login() {
			if (password.value !== 'password') {
				alert('密码错误')
				return
			}
			alert('登录成功')
			const router = useRouter()
			router.replace('/index')
		}

		return {
			username,
			password,
			login,
		}
	}
}

```

```ts
// src/views/not-found/NotFound.ts
export default {
	template: `<div>404</div>`,
}
```

```ts
// src/views/layout/LayoutPage.ts
export default {
	name: 'LayoutPage',
	template: `<div style="width: 100vw;height: 100vh;background-color: orange;display: flex;flex-direction: column;">
	<!--导航部分-->
	<div style="width: 100%;height: 60px;background-color: green;display: flex;align-items: center;">
		<RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/login">Go to Login</RouterLink>
	</div>
	<!--内容部分-->
	<RouterView/>
</div>`,
}
```

在LayoutPage.ts中,我们使用了2个VueRouter提供的组件,RouterLink和RouterView.

- 通用方法,在src/router/index.ts导出router,在需要的地方导入这个对象.

- 在模板中,可以通过$router和$route访问路由器和当前路由
- 在setup函数和script setup中,通过useRouter和useRoute访问
- 在methods选项中,通过this.$router和this.$route访问.

```ts
// src/views/index/IndexPage.ts
export default {
	template: `
		<div style="width: 100vw;height: 600px;background-color: orange;"></div>
	`,
}
```

# 动态路由匹配&路由组件传参

我们经常需要把某种模式匹配到的所有路由，全都映射到同一个组件。

为了避免Vue组件和路由耦合，我们可以设置路由记录的配置，将得到的params参数作为props传递给组件。

```js
const routes = [
  {
    // 可以给路由记录设置名字，称为命名路由
    name: 'moduleTwoDetail',
		path: '/module-two/detail/:id',
		props: true,
    
		component: () => import('@views/module-two/detail/ModuleTwoDetail.vue'),
	},
]
```

一个“路径参数”使用冒号 `:` 标记。当匹配到一个路由时，参数值会被设置到 `this.$route.params`，可以在每个组件内使用。如果设置了props为true，则会将params传递给匹配的组件props。

- $route.params 匹配的动态参数
- $route.query URL ？后面的参数
- $route.hash URL hash

## 获取动态参数的3种模式

在组件中使用 `$route` 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。

this.$route.params.id

Vue3的组合式函数为useRoute()函数.

### 布尔模式

如果props设置为true，route.params将会被设置为**组件属性**。

但是需要注意，从路由的params传递的都是string字符串，可能需要转换为数字类型。

```vue
<template>
	<!--最外层-->
	<div class="w-full h-full flex flex-col">
		<span class="text-3xl">模块2的详情页面</span>
		<span>{{id}}</span>
	</div>
</template>

<script>
export default {
	name: "ModuleTwoDetail",
	props: {
		id: {
			type: Number | String,
			required: true,
		}
	}
}
</script>
```

### 对象模式

如果 `props` 是一个对象，它会被按原样设置为组件属性。当 `props` 是静态的时候有用。

### 函数模式

你可以创建一个函数返回 `props`。这样你便可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。

```js
const router = new VueRouter({
  routes: [
    {
      path: '/search',
      component: SearchUser,
      props: route => ({ query: route.query.q })
    }
  ]
})
```

URL `/search?q=vue` 会将 `{query: 'vue'}` 作为属性传递给 `SearchUser` 组件。

请尽可能保持 `props` 函数为无状态的，因为它只会在路由发生变化时起作用。如果你需要状态来定义 `props`，请使用包装组件，这样 Vue 才可以对状态变化做出反应。

## 如何响应路由参数变化

一般不会出现这种情况。

当路由参数变化时，匹配的组件会被复用，因此不会触发路由的一些生命周期钩子。

- 使用watch响应$route的变化

  ```js
  const User = {
    template: '...',
    watch: {
      $route(to, from) {
        // 对路由变化作出响应...
      }
    }
  }
  ```

- 使用beforeRouteUpdate组件内守卫

  ```js
  const User = {
    template: '...',
    beforeRouteUpdate(to, from, next) {
      // react to route changes...
      // don't forget to call next()
    }
  }
  ```
  
- 在Vue3的组合式写法中,使用watch

  ```ts
  export default {
    setup() {
      const route = useRoute()
      
      watch(() => route.params.id, (newId, oldId) => {
        console.log(`路由参数从${oldId} -> ${newId}`)
      })
      
    },
  }
  ```

  

- 



## 404

```js
const routes = [
  // 404
	{
		name: 'notFound',
		path: '*',

		component: () => import('@views/not-found/NotFound.vue'),
	}
]
```

## 匹配优先级

路由定义得越早，优先级就越高。

# 嵌套路由

router-view渲染的组件内部依然可以有router-view组件来表达层级关系，比如我们的Vue实例最外层的render函数返回一个router-view实例，所有routes定义的路由记录的component都是由它渲染。但是我们的LayoutPage组件内部依然有2级router-view，用来匹配它的children的component。

- LayoutPage组件在new Vue(render: h => h('RouterView'))这个第一级RouterView上渲染
- /module-three等在LayoutPage内部的RouterView上渲染

这样形成的router-view的嵌套关系，我们称之为嵌套路由。

# 编程式的导航

## 导航方式

- 使用RouterLink组件
- 使用js代码

除了使用router-link创建a标签来定义导航链接，我们还可以直接使用router的方法来实现。

- router.push()
- router.replace()
- router.go()
- router.forward()
- router.back()

```ts
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

注意，如果使用了path，则params会被忽略，因为params本来就是从path得来的，既然已经存在path，params自然多余了。

## Vue3

在组件内部，我们可以使用$router属性访问路由器。如果使用组合式API，我们可以使用**useRouter()**来访问。

```ts
import { useRouter } from 'vue-router'

export default {
  setup() {
    // state
    const router = useRouter()
    // methods
    function goBack() {
      router.back()
    }
  },
}
```

# 路由模式

## hash

vue-router默认使用hash模式，使用URL的hash来模拟一个完整的URL，于是当URL改变时，页面不会重新加载，因为hash的变化不会导致页面重新加载。

## history

如果不想要很丑的hash，我们可以使用history模式，这种模式充分利用history,pushState API来完成URL跳转而无须重新加载页面。需要配置nginx服务器。

# 导航守卫

“导航”表示路由正在发生改变。在pushState或replaceState前，会先执行一系列的守卫函数，我们可以校验用户是否登录，是否存在权限等一些操作，可以中止导航或者改变导航。

**在前端点击复杂,但是需要在路由跳转时做一些操作,导航守卫会很有用.**

## 全局前置守卫

```js
// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
   const user = JSON.parse(sessionStorage.getItem('user'))
   if (user) {
    next()
   } else {
    alert('请先登录')
    next({
     name: 'login',
     query: {
      origin: to.fullPath,
     }
    })
   }
  } else {
   // 确保一定要调用 next()
   next()
  }
})

// 进度条
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()
  next()
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是**异步解析**执行，此时导航在所有守卫resolve完成之前一直处于**等待中**。

每个守卫方法接收三个参数：

- **`to: Route`**: 即将要进入的目标 [路由对象](https://v3.router.vuejs.org/zh/api/#路由对象)
- **`from: Route`**: 当前导航正要离开的路由
- **`next: Function`**: 一定要调用该方法来 **resolve** 这个钩子。执行效果依赖 `next` 方法的调用参数。
  - **`next()`**: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 **confirmed** (确认的)。
  - **`next(false)`**: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
  - **`next('/')` 或者 `next({ path: '/' })`**: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'` 之类的选项以及任何用在 [`router-link` 的 `to` prop](https://v3.router.vuejs.org/zh/api/#to) 或 [`router.push`](https://v3.router.vuejs.org/zh/api/#router-push) 中的选项。
  - **`next(error)`**: (2.4.0+) 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 [`router.onError()`](https://v3.router.vuejs.org/zh/api/#router-onerror) 注册过的回调。

**确保 `next` 函数在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错**。

## VueRouter3和VueRouter4的区别

- VueRouter3是调用next()
- VueRouter4是返回true或undefined代表正确，返回false代表失败。

## 全局解析守卫

这和router.beforeEach类似，区别是在导航被确认之前，同时在所有组件内守卫和异步组件被解析之后执行。

## 全局后置钩子

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```js
router.afterEach((to, from) => {
  // 关闭进度条,如果next(false)执行了，该守卫不会执行
  NProgress.done()
})
```

## 路由独享的守卫

为单个路由定义自己的beforeEnter守卫函数

```js
const routes = [
  {
    name: 'login',
    path: '/login',
    
    component: () => import('@views/login/LoginPage.vue'),
		beforeEnter: (to, from, next) => {
			const user = JSON.parse(sessionStorage.getItem('user'))
			if (user) {
				next('/index')
			} else {
				next()
			}
		},
  },
  // 管理员模块
  {
    name: 'manage',
    path: '/manage',
    // 定义路由元信息,可以用来标识路由是否需要用户登录，或者验证权限是否满足等
    meta: {
      onlyAdmin: true,
    },
    
    component: () => import('@views/manage/ManagePage.vue'),
		// 路由独享的守卫函数
		beforeEnter: (to, from, next) => {
			const user = JSON.parse(sessionStorage.getItem('user'))
			if (user && user?.isAdmin) {
				next()
			} else {
				alert('您没有管理员权限')
				next(false)
				NProgress.done()
			}
		},
  },
]
```

## 组件内守卫

- beforeRouteEnter
- beforeRouteUpdate
- beforeRouteLeave

```js
const Foo = {
  template: `...`,
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // 离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消。
  }
}
```

## 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在路由配置里调用 `beforeEnter`。
5. 导航被确认，调用全局的 `afterEach` 钩子，触发 DOM 更新。

# 导航错误

```js
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
   window.location.reload();
  }
  if (isChunkLoadFailed === null) {
   window.location.reload();
  }
})
```

# 路由元信息

定义路由的时候可以配置 `meta` 字段：

```ts
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```

那么如何访问这个 `meta` 字段呢？

首先，我们称呼 `routes` 配置中的每个路由对象为 **路由记录**。路由记录可以是嵌套的，因此，当一个路由匹配成功后，他可能匹配多个路由记录

例如，根据上面的路由配置，`/foo/bar` 这个 URL 将会匹配父路由记录以及子路由记录。

一个路由匹配到的所有路由记录会暴露为 `$route` 对象 (还有在导航守卫中的路由对象) 的 `$route.matched` 数组。因此，我们需要遍历 `$route.matched` 来检查路由记录中的 `meta` 字段。

下面例子展示在全局导航守卫中检查元字段：

## Vue Router3

```ts
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```

## Vue Router4

一个路由匹配到的所有路由记录会暴露为 `route` 对象(还有在导航守卫中的路由对象)的`route.matched` 数组。我们需要遍历这个数组来检查路由记录中的 `meta` 字段，但是 Vue Router 还为你提供了一个 `route.meta` 方法，它是一个非递归合并**所有 `meta`** 字段（从父字段到子字段）的方法。这意味着你可以简单地写

```ts
router.beforeEach((to, from) => {
  // 而不是去检查每条路由记录
  // to.matched.some(record => record.meta.requiresAuth)
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    // 此路由需要授权，请检查是否已登录
    // 如果没有，则重定向到登录页面
    return {
      path: '/login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    }
  }
})
```



# 面试问题

## $router和$route分别是什么？

- $router执行全局的new Router()的那个对象，可以执行push(),replace(),forward(),back()等方法。
- $route是$router.history.current的别名，指当前路由对象，每次URL变化时，都会产生新的路由对象。保存了URL的一些参数信息和匹配到的matched数组。

## 如何监听路由的变化

- watch $route
- 监听props设置为true后对应的属性
- beforeRouteUpdate onBeforeRouteUpdate(Vue Router4)

## 如何重定向页面

- 在routes路由记录的配置中使用redirect属性 √
- 在导航守卫中next('/login') Vue Router3
- 在导航守卫中return '/login' Vue Router4

```js
const routes = [
  // 普通页面
  {
    path: '/',
    // 重定向页面
    redirect: '/index',
  }
]
```

## 如何配置404页面

使用路由通配符

```js
// Vue Router3
const routes = [
  {
    name: 'notFound',
    path: '*',
    
    component: () => import('')
  }
]
```

```js
// Vue Router4
const routes = [
  {
    name: 'notFound',
    path: '/:pathMatch(.*)*',
    
    component: () => import('')
  }
]
```

## 切换路由时，需要保存草稿的功能，如何实现？

使用keep-alive

```vue
<template>
<KeepAlive :include="include">
  <RouterView/>
</KeepAlive>
</template>
```

## 路由有几种模式？区别？

在前端浏览器开发中，常用的有2种模式，History模式和hash模式。

|           | History                                                    | Hash                                                         |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| URL       | 好看                                                       | 有#前缀，难看                                                |
| Nginx配置 | 需要配置，当找不到时重定向到index.html文件                 | 无需配置                                                     |
| 底层实现  | 使用HTML5新增的history.pushState()和history.replaceState() | 使用HTML5新增的history.pushState()和history.replaceState()，或location.hash |
| 兼容性    | 只支持支持HTML5的浏览器，但现在几乎所有浏览器都支持HTML5   | 适用于所有浏览器，但Vue Router4的hash模式底层实现依然是History，只支持支持HTML5的浏览器 |

# 说一下导航守卫工作流程

在我们触发路由跳转时，Vue Router内部会执行一系列守卫函数，我们可以在其中校验和拦截，改变路由默认行为。

- 导航被触发

- 离开的组件调用beforeRouteLeave钩子(Vue Router3)，onBeforeRouteLeave()钩子(Vue Router4)
- 全局beforeEach(to, from)钩子
- 路由独享守卫beforeEnter()钩子
- 全局后置守卫afterEach()钩子，路由跳转已完成，不可以使用next()

## 路由导航守卫和Vue实例生命周期钩子函数的执行顺序？

路由独享守卫先执行。

## 路由导航的参数定义

### Vue Router3

- to 目标路由对象
- from 源路由对象
- next 必须调用next()来传递，否则会卡住，next()代表接着往下走，next(false)代表失败,next()字符串或Location对象代表重定向

### Vue Router4

- to 目标路由对象
- from 源路由对象
- next 不推荐使用，函数不返回或返回true代表成功，返回false代表失败，返回字符串或者Location对象代表重定向

## 在组件的beforeRouteEnter可以使用this吗

不可以，因为此时组件还未创建，不过，你可以通过传一个回调给 `next`来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。

# 在什么场景下会用到嵌套路由

- 最外层LayoutPage
- 复杂组件

## 如何获取路由传递的参数

根据路由记录的props属性设置不同而不同

- 不存在，使用this.$route.params来获取动态匹配参数
- true 自动转换为了组件props

















