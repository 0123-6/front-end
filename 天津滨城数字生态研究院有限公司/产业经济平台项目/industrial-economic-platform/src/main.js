/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-10 12:08:49
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-01-29 11:27:45
 * @FilePath: \company-template\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import * as echarts from 'echarts';
import G6 from '@antv/g6';
import { debounce } from 'lodash';
import { china } from '@/components/MapChart/china.js';
import { thousands, formatUnit, isNumber, getLevelByCode, getRowIndex } from '@/utils';
import EeCascader from '@/components/EeCascader.vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import './plugins/element.js';
import '@/icons'; // icon
import './styles/element-ui.less'; // global css
import './styles/site.less'; // global css
import '@/utils/directives.js';
import './styles/tailwind/output.css';
import './styles/toastui-editor.css';
import './styles/markdown.css';

Vue.component(EeCascader.name, EeCascader);

Vue.config.productionTip = false;

Vue.prototype.$echarts = echarts;
Vue.prototype.$G6 = G6;
Vue.prototype.$debounce = debounce;
Vue.prototype.$china = china;
Vue.prototype.$isNumber = isNumber;
Vue.prototype.$thousands = thousands;
Vue.prototype.$formatUnit = formatUnit;
Vue.prototype.$getLevelByCode = getLevelByCode;
Vue.prototype.$eventBus = new Vue()
Vue.prototype.$getRowIndex = getRowIndex;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
