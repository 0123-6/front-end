import {useResetReactive} from "@/util/hooks/useResetState";

// Drawer,Dialog组件使用
export const useElFeedback = <T extends Record<string, any> = {}>(props: {
	dataFn?: () => T,
	resetHook?: () => void,
	okHook?: () => void,
} = {}): {
	data: T & {
		isShow: boolean,
		selectItemList: Record<string, any>[],
		selectItem: Record<string, any>,
	},
	reset: (newValue?: Partial<typeof data>) => void,
	onOk: () => void,
	onCancel: () => void,
} => {
	const {
		dataFn = () => ({} as T),
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
		selectItemList: [] as any[],
		// 选中的单个项
		selectItem: {} as Record<string, any>,
	}))
	const reset = (newValue?: Partial<typeof data>) => {
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