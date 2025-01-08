import errorMessage from "@/util/errorMessage.ts";
import {goLoginPage} from "@/router";

// 防抖函数
export function debounce(fn: () => void, delay: number = 1000) {
	let timer: ReturnType<typeof setTimeout> | null = null

	return function () {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
		timer = setTimeout(() => {
			// @ts-ignore
			fn.apply(this, arguments)
			clearTimeout(timer!)
			timer = null
		}, delay)
	}
}

// 节流函数
export function throttle(fn: () => void, delay: number = 1000) {
	let timer: ReturnType<typeof setTimeout> | null = null

	return function () {
		if (!timer) {
			// @ts-ignore
			fn.apply(this, arguments)
			timer = setTimeout(() => {
				clearTimeout(timer!)
				timer = null
			}, delay)
		}
	}
}

// api请求
const apiPrefix = '/api'

export interface IMyFetch {
	url: string

	method?: 'get' | 'post'
	headers?: Record<string, string>
	signal?: AbortSignal

	data?: Record<string, any>
	isJson?: boolean
}

interface IResponseData {
	// 正常情况下为0
	code: number
	// 描述信息
	desc: string
	// 真正的数据
	data: Record<string, any>
}

// 没有超时功能
// 没有重试机制
export async function myFetch(props: IMyFetch): Promise<Record<string, any> | void> {
	let {
		url,

		method = 'get',
		headers = {},
		signal,

		data,
		isJson = true,
	} = props
	// 添加前缀，通过代理方式解决跨域报错
	url = apiPrefix + url
	let body: string | object | undefined = undefined

	// 设置data属性和content-type
	if (data) {
		if (method === 'get') {
			url += `?${new URLSearchParams(data).toString()}`
		} else if (method === 'post') {
			if (isJson) {
				body = JSON.stringify(data)
				headers = {
					...headers,
					// 小写即可
					'content-type': 'application/json',
				}
			} else {
				// 不是json，比如FormData
				body = data
			}
		}
	}

	try {
		// @ts-ignore
		const response = await fetch(url, {
			method,
			headers,
			// @ts-ignore
			body,
			signal,
		})

		// 接口无效或服务器错误
		if (!response.ok) {
			errorMessage('api请求失败：' + response.status + ' 接口无效或服务器错误')
			return
		}

		// 格式为{code:'',desc:'',data: object}
		const responseData: IResponseData = await response.json()
		// code正常情况为0，具体业务错误
		if (responseData.code) {
			errorMessage(responseData.desc)
			// 如果接口code为1000，代表账号超时，需要重新登录
			if (responseData.code === 1000) {
				goLoginPage()
			}
			return
		}

		// 没有任何错误，返回真正的业务数据
		return responseData.data || null
	} catch (e) {
		if ((e as Error).name === 'AbortError') {
			console.log('手动停止的错误')
			return
		}
		// 可能存在bug，手动触发无需报错
		errorMessage('api请求失败：网络错误')
	}
}



























