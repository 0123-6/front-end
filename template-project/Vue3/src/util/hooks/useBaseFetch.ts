import {baseFetch, IBaseFetch} from "@/util/api";
import {useResetRef} from "@/util/hooks/useResetState";

export interface IUseBaseFetchParams {
	// 在beforeFetch中需要重置的状态的重置函数
	beforeFetchResetFn?: () => void,
	// 因为这是要多次执行的,所以不能传递一个一次性值,而是一个函数,获取当时的期待值
	fetchOptionFn: () => IBaseFetch,
	// 对response.data的自定义处理函数
	transformResponseDataFn?: (any) => void,
	// 立即加入微任务队列
	microTask?: boolean,
}

// 通用fetch封装
export const useBaseFetch = (props: IUseBaseFetchParams) => {
	const {
		beforeFetchResetFn,
		fetchOptionFn,
		transformResponseDataFn,
		microTask = false,
	} = props

	// 前置hook函数
	const beforeFetchHookSet = new Set<Function>()
	let abortController = new AbortController()
	const {
		state: isFetching,
		resetState: resetIsFetching,
	} = useResetRef(() => false)
	const beforeFetch = () => {
		for (const beforeFetchHook of beforeFetchHookSet) {
			beforeFetchHook()
		}
		abortController.abort()
		abortController = new AbortController()
		setTimeout(() => {
			isFetching.value = true
			if (beforeFetchResetFn) {
				beforeFetchResetFn()
			}
		}, 0)
	}
	const doFetch = async (): Promise<boolean> => {
		beforeFetch()
		try {
			const fetchObject = await baseFetch({
				signal: abortController.signal,
				...fetchOptionFn(),
			})
			if (!fetchObject.isOk) {
				return false
			}
			if (transformResponseDataFn) {
				transformResponseDataFn(fetchObject.responseData?.data)
			}
			return true
		} finally {
			resetIsFetching()
		}
	}
	if (microTask) {
		queueMicrotask(doFetch)
	}

	return {
		beforeFetchHookSet,
		get isFetching() {
			return isFetching.value
		},
		beforeFetch,
		doFetch,
	}
}