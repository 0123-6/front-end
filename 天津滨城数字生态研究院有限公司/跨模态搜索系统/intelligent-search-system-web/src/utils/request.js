import axios from 'axios';
import { Message } from 'element-ui';
import $router from '@/router';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 6000 * 10 // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => config, // do something before request is sent

  // if (store.getters.token) {
  //   config.headers['access_token'] = getToken()
  //   config.headers['refresh_token'] = getRefreshToken()
  // }

  (error) => Promise.reject(error)
  // console.log(error) // for debug
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== '000000' && !(res instanceof Blob)) {
      Message({
        message: res.desc || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(new Error(res.desc || 'Error'));
    }
    if (res.code === '300024') {
      $router.push({
        name: 'LoginPage'
      });
    }
    if (res instanceof Blob) {
      res.filename = decodeURI(response.headers.filename);
    }
    return res;
  },
  (error) => {
    console.log(`err${error}`); // for debug
    Message({
      message: error.desc || '服务繁忙，请稍后刷新页面后重试!',
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
