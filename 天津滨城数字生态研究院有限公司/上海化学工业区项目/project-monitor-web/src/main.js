import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import '@/styles/element/css-vars.css'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言

import * as echarts from 'echarts';
import dayjs from 'dayjs'
import mermaid from 'mermaid-elk'
import { debounce } from 'lodash';

import '@/styles/index.scss' // global css

import '@/styles/tailwind/prelight.css' // tailwind css
import '@/styles/tailwind/output.css' // tailwind css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import EeTag from '@/components/EeTag'
import EeTitle from '@/components/EeTitle'

import './permission' // permission control

import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'
import { checkPermi } from './utils/permission'
import baseProps from './utils/baseProps'
import { thousands, formatUnit, isNumber, getDictName } from '@/utils';

const app = createApp(App)

app.config.globalProperties.$echarts = echarts;
app.config.globalProperties.$debounce = debounce;
app.config.globalProperties.$dayjs = dayjs;
app.config.globalProperties.$mermaid = mermaid;

// 全局方法挂载
app.config.globalProperties.getDictName = getDictName
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.checkPermi = checkPermi
app.config.globalProperties.baseProps = baseProps
app.config.globalProperties.$isNumber = isNumber;
app.config.globalProperties.$thousands = thousands;
app.config.globalProperties.$formatUnit = formatUnit;

app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.component('svg-icon', SvgIcon)
app.component('ee-tag', EeTag)
app.component('ee-title', EeTitle)

directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: 'default'
})

app.mount('#app')
