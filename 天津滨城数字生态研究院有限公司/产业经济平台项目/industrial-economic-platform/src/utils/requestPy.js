/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-06-12 14:12:54
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-12 09:58:45
 * @FilePath: /industrial-economic-platform/src/utils/request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import store from '@/store';
import $router from '@/router';
import { myMessage } from '@/plugins/resetMessage';

const service = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 6000 * 10 // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.iep_platform_TOKEN) {
      const now = new Date().getTime;
      const {
        refreshToken, refreshTokenExpiresIn, token, tokenExpiresIn
      } = store.getters.iep_platform_TOKEN;
      // 登录截止现在时间超过登录时获取refreshToken的有效期，前往登录页
      if ((now - store.getters.iep_platform_TOKEN.beginTime) >= (refreshTokenExpiresIn * 1000)) {
        $router.push('/login');
        store.commit('Common/CLEAR_STORE');
      } else if (now - store.getters.iep_platform_TOKEN.beginTime >= (tokenExpiresIn - 600) * 100) {
        // 登录截止现在时间超过了登录时获取token的有效期或前10分钟，使用refreshToken获取数据
        axios.put(`${process.env.VUE_APP_BASE_API}/api/admin/refreshToken`, { refreshToken }, {
          headers: {
            Authorization: token,
            appCode: 'iep-platform',
            traceId: uuidv4()
          }
        })
          .then((result) => {
            const newToken = result.data;
            token.beginTime = new Date().getTime();
            store.commit('Common/ADD_TOKEN', newToken);
          }).catch((err) => {
            console.log(err);
          });
      } else {
        // 登录截止现在时间小于登录时获取token的有效期或前10分钟，使用token
        config.headers.Authorization = token;
      }
      config.headers.appCode = 'iep-platform';
      config.headers.traceId = uuidv4();
    }
    return config;
  },

  (error) => Promise.reject(error)
  // console.log(error) // for debug
);

export default service;
