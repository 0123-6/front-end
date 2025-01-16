import {FormInstance, FormItemRule} from "element-plus";
import {Ref} from "vue";
import {useResetReactive} from "@/util/hooks/useResetState";

export const useElForm = <T extends Record<string, any>>(props: {
	formRef: Ref<FormInstance>,
	dataFn: () => T,
	rules?: Record<string, FormItemRule[]>,
}): {
	readonly formRef: Ref<FormInstance>,
	data: T,
	readonly rules: Record<string, FormItemRule[]>,
	reset: (newValue?: Partial<T>) => void,
	addResetHook: (fn: Function) => void,
	validate: () => Promise<boolean>,
} => {
	const {
		formRef,
		dataFn,
		rules = {}
	} = props

	const {
		state: data,
		resetState: resetData,
	} = useResetReactive(dataFn)

	// 订阅reset的函数,在reset执行时自动执行
	const resetHookSet = new Set<Function>()
	const addResetHook = (fn: Function) => {
		if (resetHookSet.has(fn)) {
			console.log(fn, '该函数已添加到hookSet,无需重复添加,请检查代码逻辑!')
			return
		}
		resetHookSet.add(fn)
	}

	// 重置表单组件
	const reset = (newValue?: Partial<T>) => {
		// 赋值
		if (newValue) {
			resetData(newValue)
		} else {
			// 重置
			resetData()
			formRef.value!.clearValidate()
			// 执行订阅的函数
			for (const hook of resetHookSet) {
				hook()
			}
		}
	}

	const validate = async (): Promise<boolean> => {
		try {
			await formRef.value!.validate()
			return true
		} catch (error) {
			console.log('校验失败', error)
			return false
		}
	}

	return {
		formRef,
		data,
		rules,
		reset,
		addResetHook,
		validate,
	}
}