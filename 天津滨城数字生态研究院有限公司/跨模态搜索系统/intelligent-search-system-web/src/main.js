/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-10 12:08:49
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-28 11:08:50
 * @FilePath: \company-template\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import './plugins/element.js';
import '@/utils/date.js';
import '@/utils/scroll.js';
import '@/icons'; // icon
import './styles/output.css';
import './styles/markdown.css';
import './styles/element-ui.less'; // global css
import '@/utils/directives.js';
import VueHighLight from '@/utils/vue-high-light';

import 'video.js/dist/video-js.css';

VueHighLight(Vue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
