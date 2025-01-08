// tailwindcss入口文件，包含tailwindcss定义和全局base css
import '@/index.css'
// 自己项目的css
import '@/style/index.css'

// 导入Vue
import {createApp, h} from 'vue'

// 导入element-plus
import ElementPlus, {ElConfigProvider} from 'element-plus'
// element-plus对应的css文件，可自定义主题
import '@/style/element-plus.scss'
import LazyLoad from "vanilla-lazyload";
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 懒加载
const lazyLoadInstance = new LazyLoad({
	elements_selector: '.lazy'
})

import router from "@/router/index.ts";
import {RouterView} from "vue-router";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'


// 使用Vue
const app = createApp({
	render: () => h(
		ElConfigProvider,
		{locale: zhCn},
		() => h(RouterView),
	)
})
app.use(ElementPlus)
app.directive('lazyload', {
	mounted: (el) => {
		el.classList.add('lazy')
		lazyLoadInstance.update()
	},
	unmounted: (el) => {
		el.classList.remove('lazy')
	},
})
app.use(router)
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
// 	app.component(key, component)
// }
app.mount('#app')
