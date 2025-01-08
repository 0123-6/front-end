/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-23 16:11:29
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-07-12 10:00:52
 * @FilePath: \ai-platform-front-end-project\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';

import './plugins/element.js';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import '@/styles/index.scss'; // global css
import '@/icons'; // icon
import * as echarts from 'echarts';// 引入echarts
import VueHighlightJS from 'vue-highlightjs';
import 'highlight.js/styles/atom-one-dark.css';
import VueCodeMirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

import '@/permission'; // permission control

import './utils/directives.js';

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// main.js

import lodash from 'lodash';
import clipboard from 'clipboard';
import MarkdownEditor from '@/components/MarkdownEditor';
import VueHighLight from '@/utils/vue-high-light';

VueHighLight(Vue);
Vue.prototype.$lodash = lodash;

// 全局挂载组件
Vue.component('MarkdownEditor', MarkdownEditor);

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.use(VueHighlightJS);
Vue.use(VueCodeMirror);

Vue.prototype.$clipboard = clipboard;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
