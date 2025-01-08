import View from './components/view'
import Link from "./components/link";

export let _Vue

/**
 * VueRouter的install方法
 * @param Vue
 * @return {*}
 */
export function install (Vue) {
  // 如果已经安装，直接返回
  // 在Vue.use已经做了1次判断，这次判断是否多余？
  if (install.installed && _Vue === Vue) return
  // 设置install.installed = true
  install.installed = true

  // 全局VueRouter安装的Vue
  _Vue = Vue

  const isDef = v => v !== undefined

  // 注册实例
  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  // 给Vue的实例全局添加2个钩子
  Vue.mixin({
    // vm创建前
    beforeCreate () {
      // 如果vm.$options.router存在
      if (isDef(this.$options.router)) {
        // 定义2个变量,vm._routerRoot指向vm, vm._router指向vm.$options.router
        this._routerRoot = this
        this._router = this.$options.router
        // router调用init方法初始化
        this._router.init(this)
        // 将vm._route属性可观察化，值为router.history.current
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // vm.$options.router不存在
        // 什么时候触发？
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      // 注册实例
      registerInstance(this, this)
    },
    // vm销毁后
    destroyed () {
      // 注册实例
      registerInstance(this)
    }
  })

  // 给Vue.prototype添加$router属性
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  // 给Vue.prototype添加$route属性
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // Vue全局注册组件View
  Vue.component('RouterView', View)
  // Vue全局注册组件Link
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
