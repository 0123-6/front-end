// 唯一API
export function create(createState) {
	// 保存全局状态
	let state = undefined
	// 保存订阅者
	const listeners = new Set()
	
	const setState = changeFn => {
		state = {
			...state,
			...changeFn(state),
		}
		listeners.forEach(listener => listener(state))
	}
	
	const subscribe = listener => {
		listeners.add(listener)
		
		return () => listeners.delete(listener)
	}
	
	// 初始化state
	state = createState(setState)
	
	return () => React.useSyncExternalStore(subscribe, () => state)
}
