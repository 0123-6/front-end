import {goLoginPage} from "@/util/env";
import errorMessage from "@/util/errorMessage.ts";
import {exportFile} from "@/util/file";
import {ElMessage} from "element-plus";

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
const apiPrefix = '/mock'

export interface IBaseFetch {
	url: string

	method?: 'get' | 'post'
	headers?: Record<string, string>
	signal?: AbortSignal

	data?: Record<string, any>
	isJson?: boolean

	// 前置钩子函数数组
	beforeHookList?: Function[]
	// 后置钩子函数数组
	afterHookList?: Function[]

	// 返回的是不是文件流
	isFile?: boolean,
}

interface IResponseData {
	// 正常情况下为200
	code: number
	// 描述信息
	msg?: string
	message?: string
	// 真正的数据
	data: Record<string, any>
}

interface IBaseFetchReturn {
	// 是否成功
	isOk: boolean,
	// 返回数据
	responseData?: IResponseData,
}

// 没有超时功能
// 没有重试机制
export async function baseFetch(props: IBaseFetch): Promise<IBaseFetchReturn> {
	let {
		url,

		method = 'post',
		headers = {},
		signal,

		data,
		isJson = true,
		beforeHookList = [],
		afterHookList = [],
		isFile = false,
	} = props
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
		// 执行前缀钩子函数数组
		for (const beforeHook of beforeHookList) {
			beforeHook()
		}
		// 添加前缀，通过代理方式解决跨域报错
		// @ts-ignore
		const response = await fetch(apiPrefix + url, {
			method,
			headers,
			// @ts-ignore
			body,
			signal,
		})

		// 接口无效或服务器错误
		if (!response.ok) {
			errorMessage('api请求失败：' + response.status + ' 接口无效或服务器错误')
			return {
				isOk: false,
			}
		}

		// 如果是json格式
		const contentType = response.headers.get('Content-Type')
		if (contentType && contentType.includes('application/json')) {
			// 格式为{code:'',msg:'',data: object}
			const responseData: IResponseData = await response.json()
			// code正常情况为200，具体业务错误
			if (responseData.code != 200) {
				errorMessage(responseData.msg || responseData.message || '')
				// 如果接口code为901，代表账号超时，需要重新登录
				if (responseData.code == 901) {
					goLoginPage()
				}
				return {
					isOk: false,
				}
			} else if (isFile) {
				// 文件类型得到json表示错误
				ElMessage.warning('文件下载失败: ' + responseData?.msg || responseData?.message || '')
				return {
					isOk: false,
				}
			}
			return {
				isOk: true,
				responseData,
			}
		} else {
			// 文件类型
			// 提取文件名
			const contentDisposition = response.headers.get('Content-Disposition');
			let fileName = 'downloaded-file'; // 默认文件名
			if (contentDisposition) {
				const match = contentDisposition.match(/filename\*=utf-8''([^;]+)$/i);
				if (match && match[1]) {
					fileName = decodeURIComponent(match[1]); // 解码文件名，解决乱码
				}
			}
			const responseBlob = await response.blob()
			if (responseBlob.size === 0) {
				ElMessage.warning('文件为空文件,无法下载')
				return {
					isOk: false,
				}
			}

			const file = new File([responseBlob], fileName, {type: responseBlob.type,})
			exportFile({
				file,
				callback: () => {
					ElMessage.success('文件下载成功')
				},
				callbackError: text => {
					ElMessage.error(text)
				}
			})
			return {
				isOk: true,
			}
		}
	} catch (e) {
		if ((e as Error).name === 'AbortError') {
			console.log('手动停止的错误')
			return {
				isOk: false,
			}
		} else {
			errorMessage('api请求失败：网络错误')
			return {
				isOk: false,
			}
		}
	} finally {
		// 执行后置钩子
		for (const afterHook of afterHookList) {
			afterHook()
		}
	}
}



























