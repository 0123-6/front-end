# Vue Router3 API

# 内置组件

## \<RouterLink\>

- to 目标URL,类型为string | Location
- replace 是否是替换模式

## \<RouterView\>

是一个函数组件，没有属性和方法

# Router的构造参数

```js
// 路由器构造函数的参数
declare type RouterOptions = {
  // 应用的基路径，默认为'/', 如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
  base?: string;
  // 模式,hash默认 或 history
  mode?: string;
  // 路由记录配置项
  routes?: Array<RouteConfig>;
}

// 路由记录构造参数
declare type RouteConfig = {
  // 路由记录名称
  name?: string;
  // 匹配路径,必填
  path: string;
  
  // 重定向
  redirect?: string | Location | Function;
  // 导航卫士
  beforeEnter?: (to: Route, from: Route, next: Function) => void;
  // 路由记录元信息
  meta?: any;
  // 属性模式
  props?: boolean | Object | Function;
  
  // path对应的Vue组件
  component?: Component;
  // 子路由,嵌套路由
  children?: Array<RouteConfig>;
}

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes,
})
```

# Router的实例属性

没有有用的.

# Router的实例方法

## 导航守卫或导航错误

```ts
router.beforeEach((to, from, next) => {
  /* 必须调用 `next` */
})

router.beforeResolve((to, from, next) => {
  /* 必须调用 `next` */
})

router.afterEach((to, from) => {})

router.onError(callback)
```

## 路由跳转

```ts
router.push(location, onComplete?, onAbort?)
router.replace(location, onComplete?, onAbort?)
router.go(n)
router.back()
router.forward()
```

# 路由对象

一个**路由对象 (route object)** 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的**路由记录 (route records)**。

路由对象是不可变 (immutable) 的，每次成功的导航后都会产生一个新的对象。

```js
// 路由对象,即this.$route
declare type Route = {
  // 路由参数对象，包含了动态片段和全匹配片段
  params: object;
  // URL查询参数对象，'/foo?user=1',则$route.query.user=1
  query: object;
  // 对应hash值(带'#'),如果没有hash值，则为空字符串
  hash: string;
  
  // 匹配的具体的路由记录数组,其中RouteRecord对象包含meta属性,可以获取到路由定义时的meta属性.
  matched: Array<RouteRecord>;
}
```













































