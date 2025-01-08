// 判断当前是否是开发环境
export const isDev = () => {
	return import.meta.env.DEV
}

// 获取父网站origin
export const getParentUrl = () => {
	if (isDev()) {
		return 'http://localhost:4000'
	} else {
		return location.origin
	}
}

interface IOpenNewTab {
	pathname: string,
	search?: any
}

// 打开新页面
export const openNewTab = (props: IOpenNewTab) => {
	let {pathname, search} = props
	if (search) {
		search = '?' + new URLSearchParams(search).toString()
	} else {
		search = ''
	}
	// 如果是子网站iframe
	if (window.parent !== window) {
		window.parent.postMessage({
			type: 'openNewTab',
			data: JSON.stringify({
				pathnameAndSearch: pathname + search,
			}),
		}, getParentUrl())
	} else {
		// 单独项目
		window.open(location.origin + pathname + search)
	}
}

// 跳转到登陆页面
export const goLoginPage = () => {
	// 如果是子网站
	if (window.parent !== window) {
		window.parent.postMessage({
			type: 'goLoginPage',
			data: JSON.stringify(null),
		}, getParentUrl())
	}
}