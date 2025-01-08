import Vue from './instance/index'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'
import { version } from 'v3'
import config from './config'
import { set, del } from 'core/observer'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from './components/index'
import { observe } from 'core/observer'
import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from 'core/util'
import type { GlobalAPI } from 'types/global-api'
import { initExtend } from 'core/global-api/extend'
import { initAssetRegisters } from 'core/global-api/assets'

initGlobalAPI(Vue)

/**
 * 给Vue添加一些方法和属性
 * @param Vue
 */
function initGlobalAPI(Vue: GlobalAPI) {
  // config
  // 定义Vue.config属性
  const configDef: Record<string, any> = {}
  configDef.get = () => config
  // 定义Vue.config属性
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 定义Vue.util对象，包含4个方法
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  // 定义Vue.set
  Vue.set = set
  // 定义Vue.delete
  Vue.delete = del
  // 定义Vue.nextTick
  Vue.nextTick = nextTick

  // 让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。
  Vue.observable = (obj: object) => {
    observe(obj)
    return obj
  }

  // 定义Vue.options属性，保存全局component,全局directive,全局filter,_base为Vue本身
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // 把keep-alive组件放入Vue.options.components数组
  extend(Vue.options.components, builtInComponents)

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
  // 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例.
  Vue.mixin = function (mixin: Object) {
    // 将this.options和传入的mixin对象混合
    this.options = mergeOptions(this.options, mixin)
    return this
  }
  // 定义Vue.extend，用来实现继承
  initExtend(Vue)
  // 定义Vue.options对象的3个资源的定义方法
  initAssetRegisters(Vue)
}

/**
 * FunctionalRenderContext
 */
// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

/**
 * Vue.version
 */
Vue.version = version

export default Vue
