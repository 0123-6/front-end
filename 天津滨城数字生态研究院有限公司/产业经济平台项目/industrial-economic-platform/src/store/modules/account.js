/*
 * @Date: 2023-09-11 16:21:57
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-11 18:09:30
 * @FilePath: /industrial-economic-platform/src/store/modules/account.js
 */
import { commonApis } from '@/api/common';

export default {
  namespaced: true,
  state: {
  },
  actions: {
    login({
      commit,
      dispatch
    }, {
      username,
      password,
      remember,
      complete
    }) {
      // 开始请求登录接口
      commonApis.login({
        username,
        password
      })
        .then(async (res) => {
          const token = res.data;
          token.beginTime = new Date().getTime();
          commit('Common/ADD_TOKEN', token, {
            root: true
          });

          dispatch('user/getUserInfo', {
            isRedirect: true,
            complete
          }, {
            root: true
          });

          if (remember) {
            localStorage.setItem(
              'user',
              JSON.stringify({
                username
              })
            );
          } else {
            localStorage.removeItem('user');
          }
        })
        .catch((err) => {
          console.log('err: ', err);
          complete();
        });
    }
  }
};
