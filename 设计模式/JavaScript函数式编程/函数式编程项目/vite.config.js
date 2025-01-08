// vite的默认配置，vite.config.js默认使用这个配置
import {defineConfig} from "vite";
// gzip插件，压缩代码
import {compression} from "vite-plugin-compression2";
// cdn插件
import {Plugin as cdn} from "vite-plugin-cdn-import";

// 插件部分
// gzip插件,压缩代码
const compression2Plugin = compression({
	// 只压缩js,css文件
	include: /\.(js|css)$/,
	// 阈值10KB,文件太小压缩没有意义
	threshold: 10240,
	// 算法
	algorithm: 'gzip',
	// 是否删除原始文件
	deleteOriginalAssets: false,
	// 是否跳过压缩后体积不减小的文件
	skipIfLargerOrEqual: true,
	// 压缩后的文件名称
	filename: '[path][base].gz',
})
// cdn-import插件，从cdn导入依赖
const cdnMap = new Map();
cdnMap.set('lodash', {
	name: 'lodash',
	var: '_',
	path: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/lodash.js/4.17.21/lodash.min.js',
});
cdnMap.set('axios', {
	name: 'axios',
	var: 'axios',
	path: 'https://cdn.jsdelivr.net/npm/axios@1.6.8/dist/axios.min.js',
});
cdnMap.set('echarts', {
	name: 'echarts',
	var: 'echarts',
	path: 'https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js',
});
cdnMap.set('web-vitals', {
	name: 'web-vitals',
	var: 'webVitals',
	path: 'https://cdn.jsdelivr.net/npm/web-vitals@3.5.2/dist/web-vitals.attribution.iife.min.js',
});

const cdnPlugin = cdn({
	modules: [
		cdnMap.get('lodash'),
		cdnMap.get('axios'),
		cdnMap.get('echarts'),
		cdnMap.get('web-vitals'),
	],
});

// build构建部分
// 自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。
const rollupOptions = {
	// 输出配置
	output: {
		// 分包策略，该选项允许你创建自定义的公共 chunk
		manualChunks: id => {
			// 将node_modules中的代码单独打包成一个文件
			if (id.includes('node_modules')) {
				// return id.toString().split('node_modules/')[1].split('/')[0].toString();
				// 2选1，如果node_modules所有文件不大，可以合并为1个文件
				return 'vendor';
			}
		},
	},
}

// 导出vite配置
export default defineConfig({
	// 插件数组
	plugins: [
		// 其他插件...
		// gzip插件
		compression2Plugin,
		// cdn插件
		cdnPlugin,
	],
	// 构建配置
	build: {
		// rollup部分
		rollupOptions,
	},
});