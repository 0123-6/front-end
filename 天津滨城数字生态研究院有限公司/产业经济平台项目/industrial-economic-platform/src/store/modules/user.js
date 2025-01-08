/*
 * @Date: 2023-09-11 16:21:57
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-12 11:02:51
 * @FilePath: /industrial-economic-platform/src/store/modules/user.js
 */
/*eslint-disable*/
import { commonApis } from '@/api/common';
import { myMessage } from '@/plugins/resetMessage';
import router from '@/router';
import {
  getMenuMeta, getDictAll, getRegionAll
} from '@/utils/storage';
import { getLevelByCode } from '@/utils';

export default {
  namespaced: true,
  state: {
    orgRegion: {},
  },
  mutations: {
    setOrgRegion(state, val) {
      state.orgRegion = val;
    }
  },
  actions: {
    async getUserInfo({
      commit,
      dispatch
    }, {
      isRedirect,
      callback,
      complete
    }) {
      try {
        const { code, data, msg } = await commonApis.getUserInfo();
        if (code === '00000') {
          commit('Common/ADD_USER_INFO', data, {
            root: true
          });
          const { menus = [] } = data;
          // 无论menus是否有值，都要存储到本地，否则在home页面登录没有权限的用户，菜单会显示默认的全部，而不是空
          commit('Common/ADD_ROUTERS_INFO', menus, {
            root: true
          });
          commit('menu/setMenuMap', menus, {
            root: true
          });
          if (!menus || menus.length === 0) {
            getDictAll();
            // 如果当前页面不是home页面，跳转到home页面
            if (router.currentRoute.path !== '/home') {
              router.replace('/home');
            }
          } else {
            // 获取用户机构信息
            const orgInfo = await commonApis.getOrgInfo();
            const { province, city, district, provinceName, cityName, districtName } = orgInfo.data;
            const regionCode = district || city || province
            commit('user/setOrgRegion', {
              regionPath: ['china', province, city, district].filter(n => n),
              regionCode,
              regionName: [provinceName, cityName, districtName].filter(n => n).join('/'),
              regionLevel: getLevelByCode(regionCode),
              province, city, district
            }, {
              root: true
            });

            if (isRedirect) {
              myMessage({
                message: '登录成功',
                type: 'success',
                duration: 1500
              });
              const toRoute = menus[0].children[0] || menus[0];
              commit('Common/ADD_MENU_ID', toRoute.id, {
                root: true
              });
              router.replace(toRoute.path);
            }
            if (callback) callback();

            getMenuMeta({ id: data.id });
            getDictAll();
            getRegionAll();
          }
        } else {
          myMessage({
            message: msg,
            type: 'error',
            duration: 1500
          });
        }
        if (complete) complete();
      } catch (error) {
        if (complete) complete();
        router.replace('/login');
      }
    }
  }
};
