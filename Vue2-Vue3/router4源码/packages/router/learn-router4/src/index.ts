import {createApp} from "vue/dist/vue.esm-bundler.js";
import router from "./router";

// 创建Vue实例
const app = createApp({
	template: `<RouterView/>`,
})
// 使用的不是createRouter本身,而是执行创造的对象,类似createApp.
app.use(router)
// 绑定DOM
app.mount(document.body)
