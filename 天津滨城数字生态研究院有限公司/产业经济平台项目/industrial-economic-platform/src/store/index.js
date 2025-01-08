/*
 * @Date: 2023-09-06 11:30:51
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-11 17:03:44
 * @FilePath: /industrial-economic-platform/src/store/index.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
import getters from '@/store/getters';
import Common from '@/store/modules/common';
import account from '@/store/modules/account';
import menu from '@/store/modules/menu';
import user from '@/store/modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Common,
    account,
    menu,
    user
  },
  getters
});

export default store;
