import {createRouter, createWebHistory} from "vue-router";
import NProgress from 'nprogress'
import '@/plugin/nprogress.css'
import {isDev} from "@/util/env";

NProgress.configure({ showSpinner: false })

const routes = [
	// 登录页面
	{
		path: '/login',
		component: () => import('@views/login/LoginPage.vue'),
		beforeEnter: (to, from) => {
			// const {user} = useUserStore()
			// if (user.value?.username) {
			// 	return '/index'
			// }
		},
	},
	// 普通页面
	{
		path: '/',
		redirect: '/index',
		meta: {
			requiresAuth: true,
		},

		children: [
			// 首页
			{
				path: '/index',
				component: () => import('@views/index-page/IndexPage.vue'),
			},
			{
				path: '/module-two',
				component: () => import('@views/module-two/ModuleTwo.vue'),
			},
			{
				path: '/module-two/detail/:id',
				props: true,
				component: () => import('@views/module-two/detail/ModuleTwoDetail.vue'),
			},
			{
				path: '/module-three',
				component: () => import('@views/module-three/ModuleThree.vue'),
			},
			{
				path: '/module-four',
				component: () => import('@views/module-four/ModuleFour.vue'),
			},
			{
				path: '/module-five',
				component: () => import('@views/module-five/ModuleFive.vue'),
			},
			// 个人中心
			{
				path: '/person-center',
				component: () => import('@views/person-center/PersonCenter.vue'),
			},
			// 管理员页面
			{
				path: '/manage',
				meta: {
					onlyAdmin: true,
				},
				component: () => import('@views/admin/AdminPage.vue'),
				// 路由独享守卫
				// beforeEnter: (to, from) => {
				// 	const {user} = useUserStore()
				// 	if (user.value?.isAdmin) {
				// 		return
				// 	} else {
				// 		errorMessage('您没有管理员权限')
				// 		NProgress.done()
				// 		return false
				// 	}
				// }
			},
			// 表格模板
			{
				path: '/table-template',
				component: () => import('@views/table-template/TableTemplate.vue'),
			},
		],
	},
	// 404
	{
		path: '/:pathMatch(.*)*',
		component: () => import('@views/not-found/NotFound.vue'),
	},
	// 测试
	{
		path: '/test',
		component: () => import('@views/test/TestComp.vue'),
	},
]

const router = createRouter({
	history: isDev() ? createWebHistory('/') : createWebHistory('/OWS/cuckoo-portal/'),
	routes,
	scrollBehavior: () => ({
		left: 0,
		top: 0,
	}),
})

// 全局前置守卫
// router.beforeEach((to, from) => {
// 	if (to.matched.some(record => record.meta.requiresAuth)) {
// 		const {user} = useUserStore()
// 		console.log(user)
// 		debugger
// 		if (user.value?.username) {
// 			return
// 		} else {
// 			errorMessage('请先登录')
// 			return {
// 				name: 'login',
// 				query: {
// 					origin: to.fullPath,
// 				}
// 			}
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
	// router.replace({
	// 	name: 'login',
	// 	query: {
	// 		origin: location.pathname,
	// 	},
	// })
}
