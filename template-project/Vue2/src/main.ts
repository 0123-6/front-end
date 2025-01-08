// tailwindcss入口文件，包含tailwindcss定义和全局base css
import '@/index.css'

// 导入Vue
import Vue from 'vue'
import VueRouter from "vue-router";
import Vuex from "vuex";
// 导入element-ui
import ElementUI from 'element-ui'
// element-ui对应的css文件，可自定义主题
import '@/style/element-ui.scss'
// 为Vue注册插件，element-ui
Vue.use(ElementUI);

// VueRouter对应的入口文件
import router from "@/router"
Vue.use(VueRouter)

// Vuex的配置文件
import store from '@/store'
Vue.use(Vuex)

// 导入指令
import '@/directive/index.ts'

// 导入虚拟表格
import '@/components/vxe-table/index.ts'

new Vue({
	// 绑定的HTML根元素
	el: '#app',
	// 渲染函数
	render: h => h('RouterView'),
	// 路由器，Vue组件可以通过this.$options.router获取到,
	// 然后设置this.$router和this.$route属性
	router,
	// 设置store
	store,
})

// Vue无关，将滚动条改为好看的样式
import overlayScrollbar from "@/util/overlayScrollbar.ts";

overlayScrollbar({
	element: document.body,
	autoHide: false,
})
