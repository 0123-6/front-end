import {Ref} from "vue";
import {TableInstance} from "element-plus";
import {useBaseFetch} from "@/util/hooks/useBaseFetch";
import {camelToSnake} from "@/util/stringUtil";
import {useResetReactive} from "@/util/hooks/useResetState";

export const useElTable = (props: {
	tableRef: Ref<TableInstance>,
	fetchUrl: string,
	fetchData?: () => Record<string, any>,
	fetchMicroTask?: boolean,
}): {
	tableRef: Ref<TableInstance>,
	params: {
		pageNum: number,
		pageSize: number,
		// 排序属性
		orderFiled: string,
		// '', asc升序,desc降序
		orderStatus: string,
	},
	reset: (newValue?: Partial<typeof params> | boolean) => void,
	data: {
		total: number,
		list: any[],
	},
	changeSort: (args: { prop: string; order?: string }) => Promise<void>,
	beforeFetchHookSet: Set<Function>,
	readonly isFetching: boolean,
	beforeFetch: () => void,
	doFetch: () => Promise<boolean>,
} => {
	const {
		tableRef,
		fetchUrl,
		fetchData = () => null,
		fetchMicroTask = true,
	} = props

	const {
		state: params,
		resetState: resetParams,
	} = useResetReactive(() => ({
		pageNum: 1,
		pageSize: 10,
		// 排序属性
		orderFiled: '',
		// '', asc升序,desc降序
		orderStatus: '',
	}))
	// 只重置params,不重置data,因为分页器依赖total属性
	// undefined: 重置一切
	// object: 更新params
	// true: 只重置位置
	const reset = (newValue?: Partial<typeof params>|boolean) => {
		// 重置位置
		tableRef.value!.setScrollTop(0)
		tableRef.value!.setScrollLeft(0)
		// undefined: 重置一切
		if (newValue === undefined) {
			resetParams()
			tableRef.value!.clearSelection()
			tableRef.value!.clearSort()
			tableRef.value!.clearFilter()
		} else if (typeof newValue === 'object') {
			resetParams(newValue)
		} else if (newValue === true) {
		}
	}

	const {
		state: data,
		resetState: resetData,
	} = useResetReactive(() => ({
		total: 0,
		list: [],
	}))

	const fetchTable = useBaseFetch({
		beforeFetchResetFn: () => reset(true),
		fetchOptionFn: () => ({
			url: fetchUrl,
			data: {
				...params,
				...fetchData(),
			},
		}),
		transformResponseDataFn: responseData => {
			responseData.list = responseData.list.map((item, index) => ({
				...item,
				index: index + 1 + params.pageSize * (params.pageNum - 1)
			}))
			resetData(responseData)
		},
		microTask: fetchMicroTask,
	})

	// 排序
	const changeSort = async ({prop, order = ''}) => {
		if (order === 'ascending') {
			order = 'asc'
		} else if (order === 'descending') {
			order = 'desc'
		}
		reset({
			pageNum: 1,
			pageSize: 10,
			orderFiled: order ? camelToSnake(prop) : '',
			orderStatus: order,
		})
		await fetchTable.doFetch()
	}

	return {
		tableRef,
		params,
		reset,
		data,
		changeSort,
		beforeFetchHookSet: fetchTable.beforeFetchHookSet,
		get isFetching() {
			return fetchTable.isFetching
		},
		beforeFetch: fetchTable.beforeFetch,
		doFetch: fetchTable.doFetch,
	}
}