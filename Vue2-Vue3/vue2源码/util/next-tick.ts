// src/core/util/next-tick.ts

// 模块作用域,回调函数数组
const callbacks = []
// 待办
let pending = false

// nextTick实用函数，用于将一个函数添加到异步任务中
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
