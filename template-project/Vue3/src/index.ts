// 导入Vue
import {createApp} from 'vue'
import {setDirectiveForApp} from "@/directive.ts";
import {setPluginForApp} from "@/plugin";
import overlayScrollbar from "@/util/overlayScrollbar.ts";
// tailwindcss入口文件，包含tailwindcss定义和全局base css
// 放在后面,使其可以覆盖之前的CSS
import '@/index.css'
import LayoutPage from '@/views/layout-page/LayoutPage.vue'

// 使用Vue
const app = createApp(LayoutPage)
// 设置指令
setDirectiveForApp(app)
// 设置插件
setPluginForApp(app)
// 将app绑定到DOM
app.mount(document.body)

// Vue无关，将滚动条改为好看的样式
overlayScrollbar({
	element: document.body,
	autoHide: false,
})