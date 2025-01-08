import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {isDev} from "@/util/env";

export const useCounterStore = defineStore('counter', () => {
	const count = ref(0)
	const doubleCount = computed(() => count.value * 2)

	function increment() {
		count.value++
	}

	return {count, doubleCount, increment}
})


export const useUserStore = defineStore('user', () => {
	const user = ref({})

	return {
		user,
	}
})

// 保存全局权限
export const usePermissionsStore = defineStore('permissions', () => {
	// 按钮权限数组
	const permissions = ref<String[]>(['fetchSystemList', 'edit', ''])
	// 是否有某个权限
	const isPermission = (permission:string) => {
		return permissions.value.includes(permission) || isDev()
	}

	return {
		permissions,
		isPermission,
	}
})

// 是否没有某个权限
export const isPermission = permission => {
	const {isPermission} = usePermissionsStore()
	return isPermission(permission)
}

// 添加浏览器事件,处理刷新和退出事件
// window.addEventListener('beforeunload', () => {
// 	localStorage.setItem('vuexState', JSON.stringify(store.state))
// })