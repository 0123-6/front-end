import {useResetReactive} from "@/util/hooks/useResetState";

export interface IUseFeedbackProps {
	dataFn?: () => object,
	resetHook?: Function,
	okHook?: Function,
}

// Drawer,Dialog组件使用
export const useElFeedback = (props: IUseFeedbackProps = {}) => {
	const {
		dataFn = () => ({}),
		resetHook = () => {},
		okHook = () => {},
	} = props

	const {
		state: data,
		resetState: resetData,
	} = useResetReactive(() => ({
		...dataFn(),
		// 是否显示
		isShow: false,
		// 表格的多选项
		selectItemList: [],
		// 选中的单个项
		selectItem: {},
	}))
	const reset = (newValue:undefined|object = undefined) => {
		// 赋值
		if (newValue) {
			resetData(newValue)
		} else {
			// 重置
			resetData()
			resetHook()
		}
	}

	const onOk = () => {
		reset()
		okHook()
	}

	const onCancel = () => {
		reset()
	}

	return {
		data,
		reset,
		onOk,
		onCancel,
	}
}