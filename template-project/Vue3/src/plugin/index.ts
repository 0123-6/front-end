import type {App} from "vue";
// element-plus对应的css文件，可自定义主题
import '@/plugin/element-plus.scss'
import ElementPlus from "element-plus";
import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs';
// element-plus对于的dayjs的中文化
import 'dayjs/locale/zh-cn'
// Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import router from "@/plugin/vue-router.ts";
import {createPinia} from "pinia";

// 设置插件
export const setPluginForApp = (app: App) => {
	// 设置Element Plus插件
	app.use(ElementPlus, {
		locale: zhCn,
	})
	// 设置Element Plus图标
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}
	// 使用路由
	app.use(router)
	// 使用pinia
	app.use(createPinia())
}