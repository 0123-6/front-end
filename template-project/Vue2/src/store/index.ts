import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 定义初始state
const initState = {
	user: null,
}

// Vuex配置项
const storeOptions = {
	state: {
		...initState,
		// 如果存在之前缓存的vuex,则使用缓存
		// @ts-ignore
		...JSON.parse(localStorage.getItem('vuexState')),
	},
	getters: {

	},
	mutations: {
		// 清空所有state
		// state是store._vm.$$state的引用，
		// 所以直接重置state本身无效,重置state相当于把函数的形参state指向了你设置的对象
		// store._vm.$$state并没有被改变
		// this指向临时store，注意这个store和真实的store很相似，但不是真正的store,
		// this.state = initState会报错，因为state没有setter方法，只有getter方法
		clear(state: any) {
			Object.assign(state, initState)
		},
		setUser(state, payload) {
			state.user = payload || null
		},
	},
	actions: {

	},

}

const store = new Vuex.Store(storeOptions)

// 添加浏览器事件,处理刷新和退出事件
window.addEventListener('beforeunload', () => {
	localStorage.setItem('vuexState', JSON.stringify(store.state))
})

export default store
