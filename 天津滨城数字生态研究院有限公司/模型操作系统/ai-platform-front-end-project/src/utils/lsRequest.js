/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-10-24 19:17:57
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-07 10:07:08
 * @FilePath: \ai-platform-front-end-project\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import axios from 'axios';
import store from '@/store';
import { getToken } from '@/utils/auth';

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_LS_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 10000 * 180, // 请求超时时间
  timeout: 3600 * 1000, // 请求超时时间
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': 'token d080a2576954dd32d250b2a94380d20292c67322'
  }
});

// request interceptor
service.interceptors.request.use(
  config => {
    // config.params = {
    //   ...config.params
    // };
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  });

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== '000000') {
    //   Message.closeAll();
    //   if(res.desc || res.msg){
    //     Message({
    //       message: res.desc || res.msg || 'Error',
    //       type: 'error',
    //       duration: 5 * 1000
    //     });
    //   }
    //   return res;
    // } else {
      return res;
    // }
  },
  error => {
    console.log('err' + error); // for debug
    return Promise.reject(error);
  });

export default service;
