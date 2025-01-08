/**
 * 网络请求配置
 */
import axios from "axios";
import {message} from "antd";
import {stringify} from "../utils/myJson";

axios.defaults.timeout = 100000;
axios.defaults.baseURL = 'http://'+location.host;

/**
 * http request 拦截器
 */
axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = "token "+token;
		}
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo && config.data) {
			config.data.user_id = JSON.parse(userInfo).id;
			if (config.headers["Content-Type"] !== "multipart/form-data") {
				config.headers["Content-Type"] = "application/json";
				config.data = stringify(config.data);
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
	(response) => {
		console.log('response',response)
		if (response.data.code !== 0) {
			console.error("请求出错：", response.data.desc);
			message.error(response.data.desc)
			// 如果为401，跳转到登录页面
			if (response.data.code === 401) {
				localStorage.clear();
				console.log('准备跳转到登录页面')
				window.location.href = "/login";
				console.log('跳转到登录页面了')
			}
		}
		return response;
	},
	(error) => {
		console.log('into error: ',error)
		const {response} = error;
		if (response.data.code !== 0) {
			console.error("请求出错：", response.data.desc);
			message.error(response.data.desc)
			// 如果为401，跳转到登录页面
			if (response.data.code === 401) {
				localStorage.clear();
				console.log('准备跳转到登录页面')
				window.location.href = "/login";
				console.log('跳转到登录页面了')
			}
		}
	}
);

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
	if (process.env.NODE_ENV === 'production') {
		console.log('生产环境');
		// url = url.substring(5)
	}
	params.user_id = JSON.parse(localStorage.getItem("userInfo")).id
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params,
		}).then((response) => {
			if(response.data.code !== 0) {
				reject(response.data)
			}
			resolve(response.data);
		})
			.catch((error) => {
				reject(error);
			});
	});
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @param config
 * @returns {Promise}
 */

export function post(url, data={},config={}) {
	if (process.env.NODE_ENV === 'production') {
		console.log('生产环境');
		// url = url.substring(5)
	}
	return new Promise((resolve, reject) => {
		axios.post(url, data,config).then(
			(response) => {
				if(response.data.code !== 0) {
					reject(response.data)
				}
				resolve(response.data);
			},
			(err) => {
				reject(err);
			}
		);
	});
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @return {Promise}
 */
export function del(url,data) {
	if (process.env.NODE_ENV === 'production') {
		console.log('生产环境');
		// url = url.substring(5)
	}
	return new Promise((resolve, reject) => {
		axios.delete(url, {data}).then(
			(response) => {
				if(response.data.code !== 0) {
					reject(response.data)
				}
				resolve(response.data);
			},
			(err) => {
				reject(err);
			}
		);
	});
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(url, data).then(
			(response) => {
				resolve(response.data);
			},
			(err) => {
				msag(err);
				reject(err);
			}
		);
	});
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.put(url, data).then(
			(response) => {
				resolve(response.data);
			},
			(err) => {
				msag(err);
				reject(err);
			}
		);
	});
}

//统一接口处理，返回数据
export default function (fecth, url, param) {
	let _data = "";
	return new Promise((resolve, reject) => {
		switch (fecth) {
			case "get":
				console.log("begin a get request,and url:", url);
				get(url, param)
					.then(function (response) {
						resolve(response);
					})
					.catch(function (error) {
						console.log("get request GET failed.", error);
						reject(error);
					});
				break;
			case "post":
				post(url, param)
					.then(function (response) {
						resolve(response);
					})
					.catch(function (error) {
						console.log("get request POST failed.", error);
						reject(error);
					});
				break;
			default:
				break;
		}
	});
}

//失败提示
function msag(err) {
	if (err && err.response) {
		switch (err.response.status) {
			case 400:
				alert(err.response.data.error.details);
				break;
			case 401:
				alert("未授权，请登录");
				break;

			case 403:
				alert("拒绝访问");
				break;

			case 404:
				alert("请求地址出错");
				break;

			case 408:
				alert("请求超时");
				break;

			case 500:
				alert("服务器内部错误");
				break;

			case 501:
				alert("服务未实现");
				break;

			case 502:
				alert("网关错误");
				break;

			case 503:
				alert("服务不可用");
				break;

			case 504:
				alert("网关超时");
				break;

			case 505:
				alert("HTTP版本不受支持");
				break;
			default:
		}
	}
}

/**
 * 查看返回的数据
 * @param url
 * @param params
 * @param data
 */
function landing(url, params, data) {
	if (data.code !== 0) {
	}
}

