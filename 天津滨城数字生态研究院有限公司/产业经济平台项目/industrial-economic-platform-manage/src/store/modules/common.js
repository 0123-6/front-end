/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-01-04 14:10:59
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-01-29 11:22:52
 * @FilePath: \smart search web\src\store\modules\common.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import router from '@/router';

const handleCityOptions = (data) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    if (data[i].children && data[i].children.length > 0) {
      handleCityOptions(data[i].children);
    } else {
      // eslint-disable-next-line no-param-reassign
      data[i].children = undefined;
    }
  }
};

const state = {
  token: JSON.parse(sessionStorage.getItem('token')) || {},
  user_info: JSON.parse(sessionStorage.getItem('user_info')) || {},
  router_tags: [],
  meta_menu: JSON.parse(sessionStorage.getItem('meta-menu')) || [],
  menu_tree: JSON.parse(sessionStorage.getItem('menu-tree')) || [],
  city_options: JSON.parse(sessionStorage.getItem('city-options')) || []
};

const mutations = {
  ADD_TOKEN: (value, msg) => {
    state.token = msg;
    sessionStorage.setItem('token', JSON.stringify(msg));
  },
  ADD_USER_INFO: (value, msg) => {
    state.user_info = msg;
    sessionStorage.setItem('user_info', JSON.stringify(msg));
  },
  ADD_ROUTER_TAG: (value, msg) => {
    if (msg.path === '/login') return;
    if (state.router_tags.length === 0) {
      state.router_tags.push(msg);
    }
    // eslint-disable-next-line no-unused-expressions
    state.router_tags.every((item) => item.path !== msg.path) && state.router_tags.push(msg);
  },
  REMOVE_ROUTER_TAG: (value, msg) => {
    const index = state.router_tags.indexOf(msg);
    if (index !== -1) {
      state.router_tags.splice(index, 1);
    }
  },
  CLEAR_ROUTER_TAG: (value, msg) => {
    state.router_tags = [];
  },
  ADD_META_MENU: (value, msg) => {
    sessionStorage.setItem('meta-menu', JSON.stringify(msg));
    state.meta_menu = msg;
  },
  ADD_MENU_TREE: (value, msg) => {
    sessionStorage.setItem('menu-tree', JSON.stringify(msg));
    state.menu_tree = msg;
  },
  ADD_CITY_OPTIONS: (value, msg) => {
    handleCityOptions(msg);
    sessionStorage.setItem('city-options', JSON.stringify(msg));
    state.city_options = msg;
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
