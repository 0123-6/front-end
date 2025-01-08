/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-06 09:53:19
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-08-10 14:28:20
 * @FilePath: \ai-platform-front-end-project\src\plugins\element.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import Element from 'element-ui';
import Cookies from 'js-cookie';
import '../styles/element-ui.scss';
// 引入重写的resetMessage.js文件
import { myMessage } from './resetMessage';

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
});
// 注意：挂载自定义$message必须放在Vue.use(ElementUI)后面，才能覆盖element-ui默认的message，不然没有效果
Vue.prototype.$message = myMessage;
