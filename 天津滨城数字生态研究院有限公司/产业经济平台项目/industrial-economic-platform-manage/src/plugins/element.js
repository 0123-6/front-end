/*eslint-disable*/
import Vue from 'vue';
import '@/styles/element-#356DF6/index.css';
import Element from 'element-ui';
// 引入重写的resetMessage.js文件
import { myMessage } from '@/plugins/resetMessage';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Element, { size: 'medium' });

// 注意：挂载自定义$message必须放在Vue.use(ElementUI)后面，才能覆盖element-ui默认的message，不然没有效果
Vue.prototype.$message = myMessage;
