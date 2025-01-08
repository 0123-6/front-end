// vue2的单文件支持插件
import vue from '@vitejs/plugin-vue2';
// 导入通用vite配置
import {getViteConfig} from "./vite-common.config.ts";

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
    'overlayscrollbars',

    'vue2',
    'element-ui',
    'vue-router3',
    'vuex3',
    'xe-utils',
    'vxe-table',
    'vue-draggable-plus',
  ],
  otherPlugin: [
    // vue2的单文件支持插件
    vue(),
  ],
})
