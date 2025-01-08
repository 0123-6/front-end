// 定义初始state
const initState = {}

export const state = Vue.reactive({
  ...initState,
  ...JSON.parse(localStorage.getItem('state'))
})

// 添加浏览器事件,处理刷新和退出事件
window.addEventListener('beforeunload', () => {
  debugger
  localStorage.setItem('state', JSON.stringify(Vue.toRaw(state)))
})

// const { defineStore } = Pinia
//
// export const useCounterStore = defineStore('counter', {
//   state: () => {
//     return {
//       count: 0,
//     }
//   },
//   actions: {
//     incrment() {
//       this.count++
//     }
//   }
// })
