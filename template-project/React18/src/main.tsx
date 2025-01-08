// tailwindcss入口文件，包含tailwindcss定义和全局base css
import '@/index.css'
// 自己项目的css
import '@/style/index.css'

// 导入react
import React from 'react'
// 导入react-dom
import ReactDOM from 'react-dom/client'
// 导入dayjs，antd依赖这个
import dayjs from "dayjs";
// dayjs的中文包
import 'dayjs/locale/zh-cn'
// 导入antd顶层组件
import {ConfigProvider} from "antd"
// antd的中文包
import zhCN from 'antd/locale/zh_CN'
// antd的reset.css文件
import '@/style/antd-reset.css'
// React对应的入口文件
import {RouterProvider} from "react-router-dom";
// 导入路由
import {router} from "@/router";

// 将dayjs语言设置为中文
dayjs.locale('zh-cn')
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		{/*antd包装组件，影响全局antd*/}
		<ConfigProvider
			// 设置antd为中文
			locale={zhCN}
			// 自定义主题
			theme={{
				token: {
					colorPrimary: '#1677ff',
					colorError: '#ff4d4f',
				},
			}}
		>
			<RouterProvider router={router}/>
		</ConfigProvider>
	</React.StrictMode>,
)
