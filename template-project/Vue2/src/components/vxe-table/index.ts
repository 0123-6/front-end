// 导入虚拟表格vxe
import Vue from "vue";
import VXETable from 'vxe-table'

// 开发环境加载，生成环境通过CDN加载，这里无需加载
if (import.meta.env.DEV) {
	import('vxe-table/lib/style.css')
}

Vue.use(VXETable)
