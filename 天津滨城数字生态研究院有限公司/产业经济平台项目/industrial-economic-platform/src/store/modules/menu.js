/*
 * @Date: 2023-09-11 16:21:57
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-12 10:40:07
 * @FilePath: /industrial-economic-platform/src/store/modules/menu.js
 */
function readMenuList(list, map, permissions) {
  list.forEach((n) => {
    if (n.path && /[a-zA-Z]/g.test(n.path)) {
      // eslint-disable-next-line no-param-reassign
      map[n.path] = n.id;
    }
    if (n.perms) {
      permissions.push(n.perms);
    }
    if (n.children) {
      readMenuList(n.children, map, permissions);
    }
  });
}

export default {
  namespaced: true,
  state: {
    menuMap: {},
    permissions: []
  },
  mutations: {
    setMenuMap(state, val) {
      const map = {};
      const permissions = [];
      readMenuList(val, map, permissions);
      state.menuMap = map;
      state.permissions = permissions;
    }
  }
};
