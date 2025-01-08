// react支持插件
import react from '@vitejs/plugin-react'
// 导入通用vite配置
import {getViteConfig} from "./vite-common.config";
// cdn排除插件
import { viteExternalsPlugin as viteExternals } from 'vite-plugin-externals';

// cdn排除插件
const viteExternalsPlugin = viteExternals({
	'react': 'React',
	'react-dom': 'ReactDOM',
	'dayjs': 'dayjs',
	'antd': 'antd',
	'@remix-run/router': 'RemixRouter',
	'react-router': 'ReactRouter',
	'react-router-dom': 'ReactRouterDOM',
}, { disableInServe: true });

export default getViteConfig({
	cdnList: [
		'lodash',
		'echarts',
		'nprogress',
		'vanilla-lazyload',
		'clipboard',
		'dayjs',
		'cropperjs',
		'@toast-ui/editor',
		'xlsx',

		'react',
		'react-dom',
		'antd',
		'@remix-run/router',
		'react-router',
		'react-router-dom',
		'react-draggable',
		'react-beautiful-dnd',
	],
	otherPlugin: [
		// react支持插件
		react(),
		viteExternalsPlugin,
	],
})
