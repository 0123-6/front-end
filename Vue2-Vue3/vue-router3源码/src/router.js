/* @flow */
// Flow 是一个静态类型检查工具

// Vue Router 的安装函数
import { install } from './install'
// 初始路由对象
import { START } from './util/route'
// 用于调试和警告
import { assert, warn } from './util/warn'
// 清理路径中的多余斜杠
import { cleanPath } from './util/path'
// 创建路由匹配器
import { createMatcher } from './create-matcher'
// 标准化位置
import { normalizeLocation } from './util/location'
import { isNavigationFailure, NavigationFailureType } from './util/errors'

// 使用哈希模式的历史记录
import { HashHistory } from './history/hash'
// 使用 HTML5 模式的历史记录
import { HTML5History } from './history/html5'

import type { Matcher } from './create-matcher'

/**
 * VueRouter类，负责处理路由相关的各种操作
 */
export default class VueRouter {
  // 静态属性
  // 安装方法
  static install: () => void
  // 版本号
  static version: string
  // 判断导航是否失败的方法
  static isNavigationFailure: Function
  // 导航失败类型
  static NavigationFailureType: any
  // 初始路由对象
  static START_LOCATION: Route
  
  // Vue 应用实例
  app: any
  // 存储已注册的 Vue 应用实例的数组
  apps: Array<any>
  // 标记路由器是否已准备好
  ready: boolean
  // 路由器准备好后的回调函数数组
  readyCbs: Array<Function>
  // 路由器的选项
  options: RouterOptions
  // 路由模式，分为hash模式和history模式
  mode: string
  // history对象
  history: HashHistory | HTML5History
  // 路由匹配器
  matcher: Matcher
  // 导航前的钩子数组
  beforeHooks: Array<?NavigationGuard>
  // 导航解析前的钩子数组
  resolveHooks: Array<?NavigationGuard>
  // 导航后的钩子数组
  afterHooks: Array<?AfterNavigationHook>

  // 构造函数
  constructor (options: RouterOptions = {}) {
    if (process.env.NODE_ENV !== 'production') {
      warn(this instanceof VueRouter, `Router must be called with the new operator.`)
    }
    // 初始没有 Vue 应用实例
    this.app = null
    // 初始化为空数组
    this.apps = []
    // 保存路由器选项
    this.options = options
    // 初始化前置钩子为空数组
    this.beforeHooks = []
    // 初始化解析钩子为空数组
    this.resolveHooks = []
    // 初始化后置函数为空数组
    this.afterHooks = []
    // 创建路由匹配器
    this.matcher = createMatcher(options.routes || [], this)

    // 路由器模式
    this.mode = options.mode || 'hash'
    // 设置this.history
    if (this.mode === 'history') {
      this.history = new HTML5History(this, options.base)
    } else if (this.mode === 'hash') {
      this.history = new HashHistory(this, options.base)
    }
  }
  
  // 路由匹配
  match (raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    // 使用匹配器匹配路由
    return this.matcher.match(raw, current, redirectedFrom)
  }

  // 获取当前路由
  get currentRoute (): ?Route {
    return this.history && this.history.current
  }

  // 初始化路由器
  init (app: any /* Vue component instance */) {
    this.apps.push(app)

    // set up app destroyed handler
    // https://github.com/vuejs/vue-router/issues/2639
    app.$once('hook:destroyed', () => {
      // clean out app from this.apps array once destroyed
      const index = this.apps.indexOf(app)
      if (index > -1) this.apps.splice(index, 1)
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this.app === app) this.app = this.apps[0] || null

      if (!this.app) this.history.teardown()
    })

    // main app previously initialized
    // return as we don't need to set up new history listener
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History || history instanceof HashHistory) {
      const handleInitialScroll = routeOrError => {
        const from = history.current
      }
      const setupListeners = routeOrError => {
        history.setupListeners()
        handleInitialScroll(routeOrError)
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupListeners,
        setupListeners
      )
    }

    history.listen(route => {
      this.apps.forEach(app => {
        app._route = route
      })
    })
  }

  beforeEach (fn: Function): Function {
    return registerHook(this.beforeHooks, fn)
  }

  beforeResolve (fn: Function): Function {
    return registerHook(this.resolveHooks, fn)
  }

  afterEach (fn: Function): Function {
    return registerHook(this.afterHooks, fn)
  }

  onReady (cb: Function, errorCb?: Function) {
    this.history.onReady(cb, errorCb)
  }

  onError (errorCb: Function) {
    this.history.onError(errorCb)
  }
  
  /**
   * router.push(location)方法将location添加到history中
   * @param location 新的路由对象
   * @param onComplete 成功的回调函数
   * @param onAbort 失败的回调函数
   * @return {Promise<unknown>}
   */
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort) {
      return new Promise((resolve, reject) => {
        this.history.push(location, resolve, reject)
      })
    } else {
      this.history.push(location, onComplete, onAbort)
    }
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort) {
      return new Promise((resolve, reject) => {
        this.history.replace(location, resolve, reject)
      })
    } else {
      this.history.replace(location, onComplete, onAbort)
    }
  }

  go (n: number) {
    this.history.go(n)
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }

  getMatchedComponents (to?: RawLocation | Route): Array<any> {
    const route: any = to
      ? to.matched
        ? to
        : this.resolve(to).route
      : this.currentRoute
    if (!route) {
      return []
    }
    return [].concat.apply(
      [],
      route.matched.map(m => {
        return [m.component]
      })
    )
  }

  resolve (
    to: RawLocation,
    current?: Route,
    append?: boolean
  ): {
    location: Location,
    route: Route,
    href: string,
    // for backwards compat
    normalizedTo: Location,
    resolved: Route
  } {
    current = current || this.history.current
    const location = normalizeLocation(to, current, append, this)
    const route = this.match(location, current)
    const fullPath = route.redirectedFrom || route.fullPath
    const base = this.history.base
    const href = createHref(base, fullPath, this.mode)
    return {
      location,
      route,
      href,
      // for backwards compat
      normalizedTo: location,
      resolved: route
    }
  }

  getRoutes () {
    return this.matcher.getRoutes()
  }

  addRoute (parentOrRoute: string | RouteConfig, route?: RouteConfig) {
    this.matcher.addRoute(parentOrRoute, route)
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
    }
  }

  addRoutes (routes: Array<RouteConfig>) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, 'router.addRoutes() is deprecated and has been removed in Vue Router 4. Use router.addRoute() instead.')
    }
    this.matcher.addRoutes(routes)
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
    }
  }
}

function registerHook (list: Array<any>, fn: Function): Function {
  list.push(fn)
  return () => {
    const i = list.indexOf(fn)
    if (i > -1) list.splice(i, 1)
  }
}

function createHref (base: string, fullPath: string, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath
  return base ? cleanPath(base + '/' + path) : path
}

// We cannot remove this as it would be a breaking change
VueRouter.install = install
VueRouter.version = '__VERSION__'
VueRouter.isNavigationFailure = isNavigationFailure
VueRouter.NavigationFailureType = NavigationFailureType
VueRouter.START_LOCATION = START

if (window.Vue) {
  window.Vue.use(VueRouter)
}
