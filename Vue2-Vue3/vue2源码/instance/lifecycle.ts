import Watcher from '../observer/watcher'
import VNode from '../vdom/vnode'
import { updateComponentListeners } from './events'
import { resolveSlots } from './render-helpers/resolve-slots'
import { toggleObserving } from '../observer/index'
import { pushTarget, popTarget } from '../observer/dep'
import type { Component } from 'types/component'
import type { MountedComponentVNode } from 'types/vnode'

import {
  noop,
  remove,
  emptyObject,
  validateProp,
  invokeWithErrorHandling
} from '../util/index'
import { currentInstance, setCurrentInstance } from 'v3/currentInstance'
import { getCurrentScope } from 'v3/reactivity/effectScope'
import { syncSetupProxy } from 'v3/apiSetup'

export let activeInstance: any = null
export let isUpdatingChildComponent: boolean = false

/**
 * 设置活跃的vm
 * @param vm
 */
export function setActiveInstance(vm: Component) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}

/**
 * vm第一步，初始化生命周期
 * @param vm
 */
export function initLifecycle(vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._provided = parent ? parent._provided : Object.create(null)
  // vm._watcher指向vm对应的渲染函数的观察者对象
  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}

/**
 * lifecycleMixin函数，给Vue.prototype添加生命周期相关方法
 * Vue.prototype._update
 * Vue.prototype.$forceUpdate
 * Vue.prototype.$destroy
 */
export function lifecycleMixin(Vue: typeof Component) {
  /**
   * vm的组件更新方法,核心方法
   * @param vnode
   */
  Vue.prototype._update = function (vnode: VNode) {
    // 定义vm
    const vm: Component = this
    // 将vm.$el赋值给prevEl
    const prevEl = vm.$el
    // 将vm._vnode赋值给prevVnode
    const prevVnode = vm._vnode
    // 设置活跃的vm
    const restoreActiveInstance = setActiveInstance(vm)
    // 将vnode赋值给vm._vnode
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    // 如果prevVnode不存在，说明是第1次渲染
    if (!prevVnode) {
      // initial render
      // 精彩内容
      vm.$el = vm.__patch__(vm.$el, vnode, false, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    // 将活跃的vm复原
    // 基本完成更新操作
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    let wrapper: Component | undefined = vm
    while (
      wrapper &&
      wrapper.$vnode &&
      wrapper.$parent &&
      wrapper.$vnode === wrapper.$parent._vnode
    ) {
      wrapper.$parent.$el = wrapper.$el
      wrapper = wrapper.$parent
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }

  /**
   * 迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。
   */
  Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    // 如果vm被挂载，且没有被破坏，则存在vm._watcher指向vm的渲染函数对应的观察者对象
    if (vm._watcher) {
      // 执行update方法，强制渲染
      vm._watcher.update()
    }
  }

  /**
   * 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。
   * 在大多数场景中你不应该调用这个方法。最好使用 v-if 和 v-for 指令以数据驱动的方式控制子组件的生命周期。
   */
  Vue.prototype.$destroy = function () {
    const vm: Component = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // teardown scope. this includes both the render watcher and other
    // watchers created
    vm._scope.stop()
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }
}

/**
 * vm.$mount()方法的主体
 * @param vm
 * @param el
 */
export function mountComponent(
  vm: Component,
  el: Element | null | undefined
): Component {
  // 设置vm.$el = el
  vm.$el = el
  // 使用单文件组件的话，因为在编译时已经将template转换为render函数，所以无需使用vue的完整版，
  // 使用不带template编译的版本即可
  // 如果不存在render函数，那么将render函数设置为空VNode

  // 调用beforeMount钩子
  // 和created钩子基本在一起，中间做了将el或template编译为render的工作
  // 如果render已经存在，则基本没有做什么工作
  callHook(vm, 'beforeMount')
  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  // 将updateComponent作为函数传入watcher类

  // 定义一个无法被访问的观察者，updateComponent作为观察的函数，自动收集依赖？
  // 回调函数为空？那么变化时是如何触发更新的？
  new Watcher(
    vm,
    () => {
      // vm._render()重新生成最新的VNode，然后调用vm._update方法进行更新
      vm._update(vm._render())
    },
    noop,
    // watcher观察者的配置
    {
      // 观察者在更新前调用的函数，
      before() {
        // 如果vm存在，vm已挂载，而且vm没有被销毁，则调用beforeUpdate钩子
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate')
        }
      }
    },
    true /* isRenderWatcher */
  )
  // 此时DOM已经更新
  // flush buffer for flush: "pre" watchers queued in setup()
  // 为什么需要刷新观察者？
  // 为什么不需要刷新computed？
  const preWatchers = vm._preWatchers
  if (preWatchers) {
    for (let i = 0; i < preWatchers.length; i++) {
      preWatchers[i].run()
    }
  }

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    // 调用mounted钩子
    callHook(vm, 'mounted')
  }
  return vm
}

/**
 * 更新子组件，当父组件更新时，可能需要更新子组件的属性、监听器、插槽等。
 * @param vm 子组件实例
 * @param propsData 更新后的props数据
 * @param listeners 更新后的事件监听器
 * @param parentVnode 父组件的VNode
 * @param renderChildren 子组件中的子节点（插槽内容）
 */
export function updateChildComponent(
  vm: Component,
  propsData: Record<string, any> | null | undefined,
  listeners: Record<string, Function | Array<Function>> | undefined,
  parentVnode: MountedComponentVNode,
  renderChildren?: Array<VNode> | null
) {
  if (__DEV__) {
    isUpdatingChildComponent = true
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  // 检查是否有动态作用域插槽，可能需要强制更新。
  const newScopedSlots = parentVnode.data.scopedSlots
  const oldScopedSlots = vm.$scopedSlots
  const hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key) ||
    (!newScopedSlots && vm.$scopedSlots.$key)
  )

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  // 确定是否需要强制更新，这通常发生在父组件的静态插槽或动态作用域插槽发生变化时。
  let needsForceUpdate = !!(
    renderChildren || // has new static slots
    vm.$options._renderChildren || // has old static slots
    hasDynamicScopedSlot
  )
  // 更新组件的虚拟节点和父节点信息
  const prevVNode = vm.$vnode
  vm.$options._parentVnode = parentVnode
  // 更新组件的占位VNode
  vm.$vnode = parentVnode // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    // 更新子树的父节点
    vm._vnode.parent = parentVnode
  }
  // 更新插槽子节点
  vm.$options._renderChildren = renderChildren

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  // 更新$attrs和$listeners，确保它们的响应性
  const attrs = parentVnode.data.attrs || emptyObject
  if (vm._attrsProxy) {
    // force update if attrs are accessed and has changed since it may be
    // passed to a child component.
    // 如果$attrs改变，强制更新子组件
    if (
      syncSetupProxy(
        vm._attrsProxy,
        attrs,
        (prevVNode.data && prevVNode.data.attrs) || emptyObject,
        vm,
        '$attrs'
      )
    ) {
      needsForceUpdate = true
    }
  }
  vm.$attrs = attrs

  // update listeners
  // 更新事件监听器
  listeners = listeners || emptyObject
  const prevListeners = vm.$options._parentListeners
  if (vm._listenersProxy) {
    syncSetupProxy(
      vm._listenersProxy,
      listeners,
      prevListeners || emptyObject,
      vm,
      '$listeners'
    )
  }
  vm.$listeners = vm.$options._parentListeners = listeners
  updateComponentListeners(vm, listeners, prevListeners)

  // update props
  // 更新props
  if (propsData && vm.$options.props) {
    // 暂时关闭观察，避免额外的响应式操作
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      // 更新prop，而子组件props是响应式的，自然触发了子组件的vm._watcher.update()方法,
      // update方法会将该watcher放入调度程序的queue中，从而动态更新
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    // 恢复观察
    toggleObserving(true)
    // keep a copy of raw propsData
    // 保持propsData的副本
    vm.$options.propsData = propsData
  }

  // resolve slots + force update if has children
  // 解析插槽，如果需要，强制更新组件
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context)
    vm.$forceUpdate()
  }

  if (__DEV__) {
    isUpdatingChildComponent = false
  }
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) return true
  }
  return false
}

export function activateChildComponent(vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}

export function deactivateChildComponent(vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = true
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true
    for (let i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i])
    }
    callHook(vm, 'deactivated')
  }
}

/**
 * 调用钩子函数的方法
 * @param vm
 * @param hook
 * @param args
 * @param setContext
 */
export function callHook(
  vm: Component,
  hook: string,
  args?: any[],
  setContext = true
) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const prevInst = currentInstance
  const prevScope = getCurrentScope()
  setContext && setCurrentInstance(vm)
  // 从vm.$options中获取指定hook，比如beforeCreate
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, args || null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  if (setContext) {
    setCurrentInstance(prevInst)
    prevScope && prevScope.on()
  }

  popTarget()
}
