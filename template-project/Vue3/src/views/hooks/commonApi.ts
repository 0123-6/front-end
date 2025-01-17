import {useResetRef} from "@/util/hooks/useResetState.ts";
import {useBaseFetch} from "@/util/hooks/useBaseFetch.ts";

interface Item {
	name: string,
	id: string|number|bigint,
}

// 1. 系统名称列表接口对接
export const useSystemList = () => {
	const {
		state: systemList,
		resetState: resetSystemList,
	} = useResetRef(() => [])

	const fetchSystemList = useBaseFetch({
		beforeFetchResetFn: resetSystemList,
		fetchOptionFn: () => ({
			url: '/getSystemList',
		}),
		transformResponseDataFn: (responseData: Item[]) => {
			systemList.value = responseData.map(item => ({
				label: `${item.name}[${item.id}]`,
				value: item.id,
			}))
		},
		microTask: true,
	})

	return {
		get systemList() {
			return systemList.value
		},
		get isFetching() {
			return fetchSystemList.isFetching
		}
	}
}

// 2. 告警类别接口对接
export const useAlarmTypeList = () => {
	const {
		state: alarmTypeList,
		resetState: resetAlarmTypeList,
	} = useResetRef(() => [])

	const fetchAlarmTypeList= useBaseFetch({
		beforeFetchResetFn: resetAlarmTypeList,
		fetchOptionFn: () => ({
			url: '/getAlarmTypeList',
		}),
		transformResponseDataFn: (responseData: Item[]) => {
			alarmTypeList.value = responseData.map(item => ({
				label: item.name,
				value: item.id,
			}))
		},
		microTask: true,
	})

	return {
		get alarmTypeList() {
			return alarmTypeList.value
		},
		get isFetching() {
			return fetchAlarmTypeList.isFetching
		},
	}
}

// 3. 所属团队接口对接
export const useTeamList = () => {
	const {
		state: teamList,
		resetState: resetTeamList,
	} = useResetRef(() => [])

	const fetchTeamList = useBaseFetch({
		beforeFetchResetFn: resetTeamList,
		fetchOptionFn: () => ({
			url: '/getTeamList',
		}),
		transformResponseDataFn: (responseData: Item[]) => {
			teamList.value = responseData.map(item => ({
				label: item.name,
				value: item.id,
			}))
		},
		microTask: true,
	})

	return {
		get teamList() {
			return teamList.value
		},
		get isFetching() {
			return fetchTeamList.isFetching
		},
	}
}

// 4. 场景列表接口对接
export const useSceneList = () => {
	const {
		state: sceneList,
		resetState: resetSceneList,
	} = useResetRef(() => [])

	const fetchSceneList = useBaseFetch({
		beforeFetchResetFn: resetSceneList,
		fetchOptionFn: () => ({
			url: '/getSceneList',
		}),
		transformResponseDataFn: (responseData: Item[]) => {
			sceneList.value = responseData.map(item => ({
				label: item.name,
				value: item.id,
			}))
		},
		microTask: true,
	})

	return {
		get sceneList() {
			return sceneList.value
		},
		get isFetching() {
			return fetchSceneList.isFetching
		}
	}
}


























