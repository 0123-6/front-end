/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-08-12 10:07:21
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-26 14:26:52
 * @FilePath: \ai-platform-front-end-project\src\store\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  login,
  logout,
  getInfo,
  getMenu,
  getExternalLink
} from '@/api/user';
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth';
import {
  resetRouter,
  constantRoutes
} from '@/router';
import _ from 'lodash';
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roleName: '',
    userId: '',
    menuList: [],
    menuNameList: [],
    whiteMenuList: ['/login', '/', '/404', '/personal-center', '*', '/reasoning-result', '/interface-demo'],
    operationPermissionsList: [], // 操作权限，目前用于区分有无初审终审
    grafanaUrl: '',
    kubeflowUrl: '',
    labelStudioUrl: ''
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USERID: (state, userId) => {
    state.userId = userId;
  },
  SET_ROLE_NAME: (state, roleName) => {
    state.roleName = roleName;
  },
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = [];
    constantRoutes.map(item => {
      // 这几个不用判断
      if (state.whiteMenuList.indexOf(item.path) >= 0) {
        state.menuList.push(item);
      } else if (item.path === '/model-base') {
        // model-base 没有子菜单
        if (menuList.findIndex(innerItem => { return innerItem.path === item.path; }) >= 0) {
          state.menuList.push(item);
        }
      } else {
        // 存在二级菜单的
        const menuListIndex = menuList.findIndex(innerItem => { return innerItem.path === item.path; });
        if (menuListIndex >= 0) {
          if (item.children.length > 0) {
            const childrenMenu = _.cloneDeep(item);
            childrenMenu.children = [];
            const menuChildrenList = menuList[menuListIndex].children;
            item.children.map(child => {
              if (menuChildrenList.findIndex(innerItem => { return innerItem.path === '/' + child.path; }) >= 0) {
                childrenMenu.children.push(child);
              }
            });
            state.menuList.push(childrenMenu);
          } else {
            state.menuList.push(item);
          }
        }
      }
    });
  },
  SET_MENU_NAME_LIST: (state) => {
    state.menuNameList = [];
    state.menuNameList.push('personalCenter');
    state.menuNameList.push('reasoningResult');
    state.menuNameList.push('InterfaceDemo');
    state.menuNameList.push('CreateNotebooks');
    state.menuNameList.push('NotebookLink');
    state.menuList.map((item) => {
      if (item.name) {
        state.menuNameList.push(item.name);
      }
      if (item.children && item.children.length > 0) {
        item.children.map(child => {
          if (child.name) {
            state.menuNameList.push(child.name);
          }
          if (child.children && child.children.length > 0) {
            child.children.map(innerChild => {
              if (innerChild.name) {
                state.menuNameList.push(innerChild.name);
              }
              if (innerChild.children && innerChild.children.length > 0) {
                innerChild.children.map(innerLastChild => {
                  if (innerLastChild.name) {
                    state.menuNameList.push(innerLastChild.name);
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  SET_EXTERNAL_LINK: (state, link) => {
    state.grafanaUrl = link && link.grafana;
    state.kubeflowUrl = link && link.kubeflow;
    state.labelStudioUrl = link && link.label_studio;
  },
  SET_OPERATION_PERMISSIONS_LIST: (state, list) => {
    state.operationPermissionsList = [];
    if (list.indexOf('ai:model:first-judge') >= 0) {
      state.operationPermissionsList.push('firstJudge');
    }
    if (list.indexOf('ai:model:final-judge') >= 0) {
      state.operationPermissionsList.push('finalJudge');
    }
    if (list.indexOf('ai:dataset:export') >= 0) {
      state.operationPermissionsList.push('dataSetExport');
    }
    if (list.indexOf('ai:dataset:label') >= 0) {
      state.operationPermissionsList.push('dataSetLabel');
    }
    if (state.roleName === '超级管理员') {
      state.operationPermissionsList.push('firstJudge');
      state.operationPermissionsList.push('finalJudge');
      state.operationPermissionsList.push('dataSetExport');
      state.operationPermissionsList.push('dataSetLabel');
    }
  }
};

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      userName,
      password
    } = userInfo;
    return new Promise((resolve, reject) => {
      login({
        userName: userName.trim(),
        password
      }).then(response => {
        const {
          data
        } = response;
        commit('SET_TOKEN', data.token);
        setToken(data.token);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response;

        if (!data) {
          return reject('Verification failed, please Login again.');
        }

        const {
          nickName,
          avatar,
          roleName,
          userId
        } = data.user;
        commit('SET_NAME', nickName);
        commit('SET_AVATAR', avatar || require('@/assets/images/profile/person.svg'));
        commit('SET_ROLE_NAME', roleName);
        commit('SET_USERID', userId);
        commit('SET_OPERATION_PERMISSIONS_LIST', data.permissions);
        resolve(data);
      }).catch(error => {
        reject(error);
        commit('SET_NAME', '演示用户');
        commit('SET_AVATAR', require('@/assets/images/profile/person.svg'));
        commit('SET_ROLE_NAME', '超级管理员');
        commit('SET_USERID', '');
        commit('SET_OPERATION_PERMISSIONS_LIST', ['*']);
        resolve();
      });
    });
  },

  // get user Menu
  getMenu({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getMenu(state.token).then(response => {
        if (!response) {
          commit('SET_MENU_LIST', []);
          commit('SET_MENU_NAME_LIST', []);
        }
        const {
          data
        } = response;

        if (!data) {
          return reject('Verification failed, please Login again.');
        }
        commit('SET_MENU_LIST', data);
        commit('SET_MENU_NAME_LIST');
        resolve(data);
      }).catch(error => {
        reject(error);
        commit('SET_MENU_LIST', []);
        commit('SET_MENU_NAME_LIST', []);
        resolve();
      });
    });
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken(); // must remove  token  first
        resetRouter();
        commit('RESET_STATE');
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve();
    });
  },

  // get external link
  getExternalLink({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getExternalLink(state.token).then(response => {
        const {
          data
        } = response;

        if (!data) {
          return reject('Verification failed, please Login again.');
        }
        commit('SET_EXTERNAL_LINK', data);
        resolve(data);
      }).catch(error => {
        commit('SET_EXTERNAL_LINK', {});
        reject(error);
        resolve();
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
