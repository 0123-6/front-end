import {FormInstance} from "element-plus";
import {Ref} from "vue";
import {useResetReactive} from "@/util/hooks/useResetState";

export interface IUseElFormProps {
	formRef: Ref<FormInstance | null>,
	dataFn: () => object,
	rules?: object,
}

export interface IUseElFormReturn {
	formRef: Ref<FormInstance | null>,
	data: object,
	rules: object,
	reset: Function,
	addResetHook: Function,
	validate: Function,
}

export const useElForm = (props: IUseElFormProps): IUseElFormReturn => {
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
	const reset = (newValue:undefined|object = undefined) => {
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

	const validate = async () => {
		await formRef.value!.validate()
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