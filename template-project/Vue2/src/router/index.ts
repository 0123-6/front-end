// @ts-nocheck
/**
 * Vue Router插件，用来管理项目的路由相关功能，
 * 本文件是Vue Router的全局配置文件
 */
import VueRouter from "vue-router";
import NProgress from 'nprogress'
import '@/style/nprogress.css'
NProgress.configure({ showSpinner: false })

// 导入Vuex
import store from '@/store'
import errorMessage from "@/util/errorMessage.ts";

// routes属性，定义路由记录数组
const routes = [
	// 登录页面
	{
		name: 'login',
		path: '/login',

		component: () => import('@views/login/LoginPage.vue'),
		beforeEnter: (to, from, next) => {
			const user = store.state.user
			if (user) {
				next('/index')
			} else {
				next()
			}
		},
	},
	// 普通页面
	{
		path: '/',
		redirect: '/index',
		meta: {
			requiresAuth: true,
		},

		component: () => import('@/layout/LayoutPage.vue'),
		children: [
			// 首页
			{
				name: 'index',
				path: '/index',

				component: () => import('@views/index/IndexPage.vue'),
			},
			// 第2个模块
			{
				name: 'moduleTwo',
				path: '/module-two',

				component: () => import('@views/module-two/ModuleTwo.vue'),
			},
			// 第2个模块详情
			{
				name: 'moduleTwoDetail',
				path: '/module-two/detail/:id',
				props: true,

				component: () => import('@views/module-two/detail/ModuleTwoDetail.vue'),
			},
			// 第3个模块
			{
				name: 'moduleThree',
				path: '/module-three',

				component: () => import('@views/module-three/ModuleThree.vue'),
			},
			// 第3个模块详情
			{
				name: 'moduleThreeDetail',
				path: '/module-three/detail/:id',
				props: true,

				component: () => import('@views/module-three/detail/ModuleThreeDetail.vue'),
			},
			// 模块4
			{
				name: 'moduleFour',
				path: '/module-four',

				component: () => import('@views/module-four/ModuleFour.vue'),
			},
			// 管理员模块
			{
				name: 'manage',
				path: '/manage',
				meta: {
					onlyAdmin: true,
				},

				component: () => import('@views/manage/ManagePage.vue'),
				// 路由独享的守卫函数
				beforeEnter: (to, from, next) => {
					const user = store.state.user
					if (user && user?.isAdmin) {
						next()
					} else {
						errorMessage('您没有管理员权限')
						next(false)
						NProgress.done()
					}
				},
			},
			// 个人中心
			{
				name: 'personCenter',
				path: '/person-center',

				component: () => import('@views/person-center/PersonCenter.vue'),
			},
		],
	},
	// 测试
	{
		name: 'test',
		path: '/test',

		component: () => import('@views/test/TestComp.vue'),
	},
	// Element-ui
	{
		name: 'element-ui',
		path: '/element-ui',

		component: () => import('@views/element-ui/ElementUi.vue'),
	},
	// 404
	{
		name: 'notFound',
		path: '*',

		component: () => import('@views/not-found/NotFound.vue'),
	},
]

const router = new VueRouter({
	base: '/',
	mode: 'history',
	routes,
	scrollBehavior: () => ({
		x: 0,
		y: 0,
	}),
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		const user = store.state.user
		if (user) {
			next()
		} else {
			console.warn('请先登录')
			next({
				name: 'login',
				query: {
					origin: to.fullPath,
				}
			})
		}
	} else {
		// 确保一定要调用 next()
		next()
	}
})

// 进度条
router.beforeEach((to, from, next) => {
	// 开启进度条
	NProgress.start()
	next()
})

router.afterEach((to, from) => {
	// 关闭进度条,如果next(false)执行了，该守卫不会执行
	NProgress.done()
})

router.onError((error) => {
	debugger
	const pattern = /Loading chunk (\d)+ failed/g;
	const isChunkLoadFailed = error.message.match(pattern);
	if (isChunkLoadFailed) {
		window.location.reload();
	}
	if (isChunkLoadFailed === null) {
		window.location.reload();
	}
})

export default router

// 导入工具函数，跳转到登录页面
export function goLoginPage() {
	router.replace({
		name: 'login',
		query: {
			origin: window.location.pathname,
		},
	})
}
