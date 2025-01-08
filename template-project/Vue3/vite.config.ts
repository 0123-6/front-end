// vue3的单文件组件支持插件
import vue from '@vitejs/plugin-vue';
// 导入通用vite配置
import {getViteConfig} from "./vite-common.config";

// 自定义原生
const customElementList = [
  'cropper-canvas',
  'cropper-image',
  'cropper-shade',
  'cropper-handle',
  'cropper-selection',
  'cropper-grid',
  'cropper-crosshair',
  'cropper-viewer',
]

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

    'vue3',
    'element-plus',
    'vue-router4',
    'vue-draggable-plus',
    '@vueuse/core',
  ],
  otherPlugin: [
    // vue3的单文件组件支持插件
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => customElementList.includes(tag),
        },
      },
    }),
  ],
})
