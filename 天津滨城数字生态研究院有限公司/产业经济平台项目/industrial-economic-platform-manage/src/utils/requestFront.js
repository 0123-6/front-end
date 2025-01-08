/* eslint-disable */
import axios from 'axios';
import { myMessage } from '@/plugins/resetMessage';
import store from '@/store';
import $router from '@/router';

const service = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 6000 * 10 // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.TOKEN) {
      const now = new Date().getTime;
      const {
        refreshToken, refreshTokenExpiresIn, token, tokenExpiresIn
      } = store.getters.TOKEN;
      // 登录截止现在时间超过登录时获取refreshToken的有效期，前往登录页
      if ((now - store.getters.TOKEN.beginTime) >= refreshTokenExpiresIn) {
        $router.push('/login');
        // store.commit('Common/CLEAR_STORE');
      } else if (now - store.getters.TOKEN.beginTime >= (tokenExpiresIn - 600)) {
        // 登录截止现在时间超过了登录时获取token的有效期或前10分钟，使用refreshToken获取数据
        // config.headers.Authorization = refreshToken;
        axios.put(`${process.env.VUE_APP_BASE_API}/api/admin/refreshToken`, { refreshToken }, {
          headers: {
            Authorization: token,
            appCode: 'iep-platform'
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
      config.headers.appCode = 'iep-admin';
    }
    return config;
  },

  (error) => Promise.reject(error)
  // console.log(error) // for debug
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === '10001') {
      myMessage({
        message: '登录已过期，请重新登录!',
        type: 'error'
      });
      $router.push('/login');
      // store.commit('Common/CLEAR_STORE');
    }
    if (res.code !== '00000' && !(res instanceof Blob)) {
      // myMessage({
      //   message: res.desc || res.msg || 'Error',
      //   type: 'error'
      // });
      // return Promise.reject(new Error(res.desc || res.msg || 'Error'));
    }
    if (res instanceof Blob) {
      res.filename = decodeURI(response.headers.filename);
    }
    return res;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.log(`err${error}`); // for debug
    // myMessage({
    //   message: error.desc || '服务繁忙，请稍后刷新页面后重试!',
    //   type: 'error'
    // });
    return Promise.reject(error);
  }
);

export default service;
