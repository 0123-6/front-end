/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-12 10:59:38
 * @FilePath: /industrial-economic-platform/src/store/modules/common.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const state = {
  iep_platform_user_info: {},
  iep_platform_token: JSON.parse(localStorage.getItem('iep_platform_token')) || {},
  iep_platform_routers_info: [],
  iep_platform_search_info: JSON.parse(localStorage.getItem('iep_platform_search_info')) || {},
  iep_platform_menu_id: ''
};

const mutations = {
  ADD_TOKEN: (value, msg) => {
    state.iep_platform_token = msg;
    localStorage.setItem('iep_platform_token', JSON.stringify(msg));
  },
  ADD_USER_INFO: (value, msg) => {
    state.iep_platform_user_info = msg;
  },
  ADD_ROUTERS_INFO: (value, msg) => {
    state.iep_platform_routers_info = msg;
  },
  ADD_SEARCH_INFO: (value, msg) => {
    state.iep_platform_search_info = msg;
    localStorage.setItem('iep_platform_search_info', JSON.stringify(msg));
  },
  ADD_MENU_ID: (value, msg) => {
    state.iep_platform_menu_id = msg;
  },
  CLEAR_TOKEN: () => {
    state.iep_platform_token = {};
    localStorage.removeItem('iep_platform_token');
  },
  CLEAR_STORE: () => {
    state.iep_platform_user_info = {};
    state.iep_platform_token = {};
    localStorage.removeItem('iep_platform_token');
    state.iep_platform_routers_info = [];
    state.iep_platform_search_info = {};
    localStorage.removeItem('iep_platform_search_info');
    state.iep_platform_menu_id = '';
    localStorage.removeItem('iep_platform_menu_meta');
    localStorage.removeItem('iep_platform_region_dict');
    localStorage.removeItem('iep_platform_all_dict');
  }
};

const actions = {
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
