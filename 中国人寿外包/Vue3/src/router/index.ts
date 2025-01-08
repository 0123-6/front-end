// @ts-nocheck
import {createRouter, createWebHistory} from "vue-router";
import NProgress from 'nprogress'
import '@/style/nprogress.css'

NProgress.configure({ showSpinner: false })

const routes = [
	// 首页
	{
		name: 'module-one',
		path: '/module-one',

		component: () => import('@views/module-one/ModuleOne.vue'),
	},
	{
		name: 'module-two',
		path: '/module-two',

		component: () => import('@views/module-two/ModuleTwo.vue'),
	},
	{
		name: 'module-three',
		path: '/module-three',

		component: () => import('@views/module-three/ModuleThree.vue'),
	},
	{
		name: 'module-four',
		path: '/module-four',

		component: () => import('@views/module-four/ModuleFour.vue'),
	},
]

const router = createRouter({
	history: createWebHistory('/'),
	routes,
})

// 全局前置守卫
// router.beforeEach((to, from, next) => {
// 	if (to.matched.some(record => record.meta.requiresAuth)) {
// 		const user = null
// 		if (user) {
// 			return
// 		} else {
// 			console.warn('请先登录')
// 			next({
// 				name: 'login',
// 				query: {
// 					origin: to.fullPath,
// 				}
// 			})
// 		}
// 	}
// })

// 进度条
router.beforeEach(() => {
	// 开启进度条
	NProgress.start()
})

router.afterEach(() => {
	// 关闭进度条,如果next(false)执行了，该守卫不会执行
	NProgress.done()
})

// router.onError((error) => {
// 	const pattern = /Loading chunk (\d)+ failed/g;
// 	const isChunkLoadFailed = error.message.match(pattern);
// 	if (isChunkLoadFailed) {
// 		window.location.reload();
// 	}
// 	if (isChunkLoadFailed === null) {
// 		window.location.reload();
// 	}
// })

export default router

// 导入工具函数,跳转到登录页面
export function goLoginPage() {
	router.replace({
		name: 'login',
		query: {
			origin: location.pathname,
		},
	})
}

window.addEventListener('message', event => {
	if (event.origin !== 'https://jiangjiang0123.cn') {
		console.log('无效的message')
		console.log(event)
		return
	}

	router.replace(`/${event.data}`)
})
