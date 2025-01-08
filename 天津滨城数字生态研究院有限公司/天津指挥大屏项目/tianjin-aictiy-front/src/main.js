import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview.js'
import './plugins/directives'
import '../public/index.css'
import '../public/hpj.css'
import '../public/iview.css'
import request from "@/plugins/axios/request";
import myAxios from '@/plugins/axios/interceptor'

// 在原型上扩展,这样不用在每个页面都导入request
Vue.prototype.$request = request;
Vue.prototype.$axios = myAxios

import '../public/css/DrawingManager.css'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
// import * as echarts from 'echarts/core';
import * as echarts from 'echarts';
// 引入柱状图图表，图表后缀都为 Chart
// import { BarChart,LineChart,PieChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   DatasetComponent,
//   TransformComponent,
//   ToolboxComponent,
//   LegendComponent,
//   MarkLineComponent,
//   MarkPointComponent
// } from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
// import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
// import { CanvasRenderer } from 'echarts/renderers';
// 注册必须的组件
// echarts.use([
//   TitleComponent,
//   TooltipComponent,
//   GridComponent,
//   DatasetComponent,
//   TransformComponent,
//   BarChart,
//   LabelLayout,
//   UniversalTransition,
//   CanvasRenderer,
//   LineChart,
//   ToolboxComponent,
//   LegendComponent,
//   MarkLineComponent,
//   MarkPointComponent,
//   PieChart,
// ]);

Vue.config.productionTip = false
Vue.prototype.$store = store

Vue.prototype.$echarts = echarts

import "video.js/dist/video-js.css";
const hls = require("videojs-contrib-hls");

Vue.use(hls);

//滚动条自动隐藏
var t1 = 0;
var t2 = 0;
var timer = null; // 定时器
document.styleSheets[0].addRule('*::-webkit-scrollbar-thumb','display:none;');

// scroll监听
document.onscroll = function() {
  clearTimeout(timer);
  timer = setTimeout(isScrollEnd, 1000);
  t1 = document.documentElement.scrollTop || document.body.scrollTop;
  document.styleSheets[0].addRule('*::-webkit-scrollbar-thumb','display:block;');
}

function isScrollEnd() {
  t2 = document.documentElement.scrollTop || document.body.scrollTop;
  if(t2 == t1){
    document.styleSheets[0].addRule('*::-webkit-scrollbar-thumb','display:none;');
  }
}

window.abcVue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
