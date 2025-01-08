import {reactive, ref} from "vue";

// 方便恢复ref定义的数据
export const useResetRef = (factory: Function) => {
	const state = ref(factory())
	// 重置数据或修改数据
	const resetState = (newValue:any = undefined) => {
		state.value = newValue !== undefined ? newValue : factory()
	}

	return {
		state,
		resetState,
	}
}

// 方便恢复reactive定义的数据
export const useResetReactive = (factory: Function) => {
	const state = reactive(factory())
	// 重置数据或修改数据
	const resetState = (newValue:object|undefined|null = undefined) => {
		Object.assign(state, newValue ? newValue : factory())
	}

	return {
		state,
		resetState,
	}
}