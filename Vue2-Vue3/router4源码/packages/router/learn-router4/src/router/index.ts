import {createRouter, createWebHistory} from '../../../dist/vue-router.esm-browser.js'

const router = createRouter({
	history: createWebHistory('/'),
	routes: [
		// 登录页面
		{
			path: '/login',
			component: () => import('../views/login/LoginPage'),
		},
		{
			path: '/',
			redirect: '/index',
			component: () => import('../views/layout/LayoutPage'),

			children: [
				{
					path: '/index',
					component: () => import('../views/index/IndexPage'),
				},
			],
		},
		// 404
		{
			path: '/:pathMatch(.*)*',
			component: () => import('../views/not-found/NotFound'),
		},
	],
})

export default router
