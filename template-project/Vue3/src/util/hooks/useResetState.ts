import {reactive, Ref, ref} from "vue";

// 方便恢复ref定义的数据
export const useResetRef = <T>(factory: () => T): {
	state: Ref<T>,
	setState: (newValue: T) => void,
	resetState: () => void,
} => {
	const state = ref(factory()) as Ref<T>
	// 修改数据
	const setState = (newValue: T) => {
		state.value = newValue
	}
	// 重置数据
	const resetState = () => {
		state.value = factory()
	}

	return {
		state,
		setState,
		resetState,
	}
}

// 方便恢复reactive定义的数据
export const useResetReactive = <T extends Record<string, any>>(factory: () => T): {
	state: T,
	setState: (newValue: Partial<T>) => void,
	resetState: () => void,
} => {
	const state = reactive(factory()) as T
	// 修改数据
	const setState = (newValue: Partial<T>) => {
		Object.assign(state, newValue)
	}
	// 重置数据
	const resetState = () => {
		Object.assign(state, factory())
	}

	return {
		state,
		setState,
		resetState,
	}
}