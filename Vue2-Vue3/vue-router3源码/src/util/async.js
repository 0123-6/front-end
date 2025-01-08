/* @flow */

/**
 * 按照顺序执行queue中的每个异步函数
 * @param queue // 要运行的导航守卫队列
 * @param fn // 对每个队列元素调用的函数
 * @param cb // 当队列完成后调用的回调函数
 */
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  // `step` 是递归函数，递归地处理队列中的每个元素
  const step = index => {
    // 如果队列已经到达尾部，则调用完成后的回调函数
    if (index >= queue.length) {
      cb()
    } else {
      // 如果当前队列元素存在
      if (queue[index]) {
        // 调用 `fn` 函数处理队列元素，并传递 `step` 以继续执行下一个
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        // 如果当前队列元素不存在，直接跳到下一个
        step(index + 1)
      }
    }
  }
  // 从队列的第一个元素开始执行
  step(0)
}
