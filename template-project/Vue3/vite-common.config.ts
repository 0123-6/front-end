import * as path from "path";
// 压缩代码插件
import {compression} from "vite-plugin-compression2";
import * as zlib from "zlib";
// vite的默认配置，vite.config.js默认使用这个配置
import {defineConfig, PluginOption} from "vite";
// cdn插件
import {Plugin as cdn} from "vite-plugin-cdn-import";

// cdn-import插件，从cdn导入依赖
const cdnMap = new Map();
// 通用库
cdnMap.set('lodash', {
	name: 'lodash',
	var: '_',
	path: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
});
cdnMap.set('echarts', {
	name: 'echarts',
	var: 'echarts',
	path: 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js',
});
cdnMap.set('vanilla-lazyload', {
	name: 'vanilla-lazyload',
	var: 'LazyLoad',
	path: 'https://cdn.jsdelivr.net/npm/vanilla-lazyload@19.1.3/dist/lazyload.min.js',
})
cdnMap.set('nprogress', {
	name: 'nprogress',
	var: 'NProgress',
	path: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
	// 自定义css，下载下来作为本地css引入
	// css: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
})
cdnMap.set('clipboard', {
	name: 'clipboard',
	var: 'ClipboardJS',
	path: 'https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js',
})
// antd依赖dayjs
cdnMap.set('dayjs', {
	name: 'dayjs',
	var: 'dayjs',
	path: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js',
});
// 图片裁剪
cdnMap.set('cropperjs', {
	name: 'cropperjs',
	var: 'Cropper',
	path: 'https://cdn.jsdelivr.net/npm/cropperjs@2.0.0-rc.2/dist/cropper.min.js',
	// 自定义，不使用CDN
	// css: 'https://cdn.jsdelivr.net/npm/cropperjs@1.6.2/dist/cropper.min.css',
})
// Markdown编辑器
cdnMap.set('@toast-ui/editor', {
	name: '@toast-ui/editor',
	var: 'toastui',
	path: 'https://cdn.jsdelivr.net/npm/toast-ui-editor-all@3.2.9/toastui-editor-all.min.js',
	css: 'https://cdn.jsdelivr.net/npm/toast-ui-editor-all@3.2.9/toastui-editor.css',
})
// XLSX读取和导出
cdnMap.set('xlsx', {
	name: 'xlsx',
	var: 'XLSX',
	path: 'https://cdn.jsdelivr.net/npm/xlsx-hpj@1.0.203/xlsx.full.min.js',
})
// 好看的滚动条
cdnMap.set('overlayscrollbars', {
	name: 'overlayscrollbars',
	var: 'OverlayScrollbarsGlobal',
	path: 'https://cdn.jsdelivr.net/npm/overlayscrollbars@2.10.0/browser/overlayscrollbars.browser.es6.min.js',
	// 我感觉这个css文件没有需要自定义配置的地方，所以就引入CDN CSS了
	css: 'https://cdn.jsdelivr.net/npm/overlayscrollbars@2.10.0/styles/overlayscrollbars.min.css',
})

// Vue2和Vue3公共库
cdnMap.set('vue-draggable-plus', {
	name: 'vue-draggable-plus',
	var: 'VueDraggablePlus',
	path: 'https://cdn.jsdelivr.net/npm/vue-draggable-plus@0.5.3/dist/vue-draggable-plus.iife.min.js',
})

// Vue3库
cdnMap.set('vue3', {
	name: 'vue',
	var: 'Vue',
	path: 'https://cdn.jsdelivr.net/npm/vue@3.5.12/dist/vue.global.min.js',
});
cdnMap.set('element-plus', {
	name: 'element-plus',
	var: 'ElementPlus',
	path: 'https://cdn.jsdelivr.net/npm/element-plus@2.8.1/dist/index.full.min.js',
	// 自定义主题，不使用默认主题
	// css: 'https://cdn.jsdelivr.net/npm/element-plus@2.6.2/dist/index.min.css',
});
cdnMap.set('vue-router4', {
	name: 'vue-router',
	var: 'VueRouter',
	path: 'https://cdn.jsdelivr.net/npm/vue-router@4.4.3/dist/vue-router.global.min.js',
})
cdnMap.set('@vueuse/core', {
	name: '@vueuse/core',
	// 可能有问题，未验证
	var: 'VueUse',
	path: 'https://cdn.jsdelivr.net/npm/@vueuse/core@11.0.1/index.iife.min.js',
})

// React库
cdnMap.set('react', {
	name: 'react',
	var: 'React',
	path: 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js',
});
cdnMap.set('react-dom', {
	name: 'react-dom',
	var: 'ReactDOM',
	path: 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js',
});
cdnMap.set('antd', {
	name: 'antd',
	var: 'antd',
	path: 'https://cdn.jsdelivr.net/npm/antd@5.20.2/dist/antd.min.js',
	// reset css不大，无需通过cdn引入，本地打包即可
	// css: 'https://cdn.jsdelivr.net/npm/antd@5.15.3/dist/reset.min.css',
});
cdnMap.set('@remix-run/router', {
	name: '@remix-run/router',
	var: 'RemixRouter',
	path: 'https://cdn.jsdelivr.net/npm/@remix-run/router@1.19.1/dist/router.umd.min.js',
})
cdnMap.set('react-router', {
	name: 'react-router',
	var: 'ReactRouter',
	path: 'https://cdn.jsdelivr.net/npm/react-router@6.26.1/dist/umd/react-router.production.min.js',
})
cdnMap.set('react-router-dom', {
	name: 'react-router-dom',
	var: 'ReactRouterDOM',
	path: 'https://cdn.jsdelivr.net/npm/react-router-dom@6.26.1/dist/umd/react-router-dom.production.min.js',
})
cdnMap.set('react-draggable', {
	name: 'react-draggable',
	var: 'ReactDraggable',
	path: 'https://cdn.jsdelivr.net/npm/react-draggable@4.4.6/build/web/react-draggable.min.js',
})
cdnMap.set('react-beautiful-dnd', {
	name: 'react-beautiful-dnd',
	var: 'ReactBeautifulDnd',
	path: 'https://cdn.jsdelivr.net/npm/react-beautiful-dnd@13.1.1/dist/react-beautiful-dnd.min.js',
})

// Vue2库
cdnMap.set('vue2', {
	name: 'vue',
	var: 'Vue',
	path: 'https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.min.js',
});
cdnMap.set('element-ui', {
	name: 'element-ui',
	var: 'ELEMENT',
	path: 'https://cdn.jsdelivr.net/npm/element-ui@2.15.14/lib/index.min.js',
	// 自定义主题色，需要重新生成css，不可以用默认的css
	// css: 'https://cdn.jsdelivr.net/npm/element-ui@2.15.14/lib/theme-chalk/index.min.css',
});
cdnMap.set('vue-router3', {
	name: 'vue-router',
	var: 'VueRouter',
	path: 'https://cdn.jsdelivr.net/npm/vue-router@3.6.5/dist/vue-router.min.js',
});
cdnMap.set('vuex3', {
	name: 'vuex',
	var: 'Vuex',
	path: 'https://cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.min.js',
})
// vxe依赖
cdnMap.set('xe-utils', {
	name: 'xe-utils',
	var: 'XEUtils',
	path: 'https://cdn.jsdelivr.net/npm/xe-utils@3.5.30/dist/xe-utils.umd.min.js',
})
// vxe
cdnMap.set('vxe-table', {
	name: 'vxe-table',
	var: 'VXETable',
	path: 'https://cdn.jsdelivr.net/npm/vxe-table@3.8.22/lib/index.umd.min.js',
	// css太大了，还是通过CDN加载吧
	css: 'https://cdn.jsdelivr.net/npm/vxe-table@3.8.22/lib/style.min.css',
})

export {
	// cdn-import插件，从cdn导入依赖
	cdnMap,
};

interface IProps {
	cdnList: string[],
	otherPlugin: PluginOption[],
}

export function getViteConfig(props: IProps) {
	const {cdnList, otherPlugin} = props

	const cdnPlugin = cdn({
		modules: cdnList.map(cdnName => cdnMap.get(cdnName)),
	});

	return defineConfig({
		// 构建配置
		build: {
			// 只支持最新浏览器
			target: 'esnext',
			// 自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。
			rollupOptions: {
				// 输出配置
				output: {
					// 分包策略，该选项允许你创建自定义的公共 chunk
					manualChunks: (id: string) => {
						// 将node_modules中的代码单独打包成一个文件
						if (id.includes('node_modules')) {
							// return id.toString().split('node_modules/')[1].split('/')[0].toString();
							// 2选1，如果node_modules所有文件不大，可以合并为1个文件
							return 'vendor';
						}
					},
				},
			},
			// 无需报告gzip压缩后大小
			reportCompressedSize: false,
		},
		// css配置
		css: {
			// 指定传递给 CSS 预处理器的选项
			preprocessorOptions: {
				// scss预处理器
				scss: {
					// 关闭warning
					quietDeps: true,
					api: 'modern-compiler',
				},
			},
		},
		// 设置别名，方便文件引用
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@views': path.resolve(__dirname, 'src/views'),
			}
		},
		// 不排除node_modules目录，方便调试源代码
		server: {
			sourcemapIgnoreList: false,
			proxy: {
				'/api': {
					target: 'http://localhost:8080',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
				'/mock': {
					target: 'http://localhost:3000',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/mock/, ''),
				}
			},
			// 配置HTTPS
			// https: {
			// 	key: './localhost.key',
			// 	cert: './localhost.crt',
			// },
		},
		// 插件配置
		plugins: [
			// 压缩插件
			compression({
				// 算法
				algorithm: 'brotliCompress',
				// 压缩选项
				compressionOptions: {
					params: {
						[zlib.constants.BROTLI_PARAM_QUALITY]: 11,
					},
				},
				// 压缩后的文件名称
				filename: '[path][base].br',
			}),
			// cdn插件
			cdnPlugin,
			// 其他插件，比如Vue2的单文件支持插件
			otherPlugin,
		],
	})
}
