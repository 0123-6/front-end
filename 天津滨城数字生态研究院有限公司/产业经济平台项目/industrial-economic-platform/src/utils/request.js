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
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
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

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === '10001') {
      if ($router.history.current.path !== '/login') {
        $router.replace('/login');
      }
      store.commit('Common/CLEAR_STORE');
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    if (res.code !== '00000' && res.code !== '99999' && !(res instanceof Blob)) {
      myMessage({
        message: res.msg || 'Error',
        type: 'error'
      });

      return Promise.reject(new Error(res.msg || 'Error'));
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

// 封装get请求
// @ts-ignore
export function get(url, params = {}) {
  // 禁用ts检查
  // @ts-ignore
  // const newUrl = `https://mock.apifox.cn/m1/3431805-0-default${url}`;
  const newUrl = `/pythonApi${url}`;
  if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
  }
  return new Promise((resolve, reject) => {
    let getParams = {
      params,
    }
    if (store?.getters?.iep_platform_TOKEN?.token) {
      getParams = {
        ...getParams,
        headers: {
          Authorization: `${store.getters.iep_platform_TOKEN.token}`,
        },
      }
    }
    axios.get(newUrl, getParams).then((response) => {
      if (response.data.code !== 0) {
        reject(response.data);
      }
      resolve(response.data);
    }, (err) => {
      // 提示错误信息
      myMessage({
        message: err.response.data?.desc || 'Error',
        type: 'error'
      });
      reject(err);
    })
      .catch((error) => {
        reject(error);
      });
  });
}

// 封装post请求
// @ts-ignore
export function post(url, data = {}, config = {}) {
  if (store?.getters?.iep_platform_TOKEN?.token) {
    config.headers = {
      Authorization: `${store.getters.iep_platform_TOKEN.token}`,
    };
  }
  // @ts-ignore
  // const newUrl = `https://mock.apifox.cn/m1/3431805-0-default${url}`;
  const newUrl = `/pythonApi${url}`;
  if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
    // url = url.substring(5)
  }
  return new Promise((resolve, reject) => {
    axios.post(newUrl, data, config).then(
      (response) => {
        if (response.data.code !== 0) {
          // 提示错误信息
          if (response?.data?.desc) {
            myMessage({
              message: response.data.desc || 'Error',
              type: 'error'
            });
          }
          reject(response.data);
        }
        resolve(response.data);
      },
      (err) => {
        // 提示错误信息
        if (err?.response?.data?.desc) {
          myMessage({
            message: err.response.data?.desc || 'Error',
            type: 'error'
          });
        }
        reject(err);
      }
    ).catch((error) => {
      console.log('axios post error: ', error);
      reject(error);
    });
  });
}

export function del(url, data) {
  // @ts-ignore
  // const newUrl = `https://mock.apifox.cn/m1/3431805-0-default${url}`;
  const newUrl = `/pythonApi${url}`;
  if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
    // url = url.substring(5)
  }
  return new Promise((resolve, reject) => {
    axios.delete(newUrl, {
      data,
      headers: {
        Authorization: `${store.getters.iep_platform_TOKEN.token}`,
      },
    }).then(
      (response) => {
        if (response.data.code !== 0) {
          reject(response.data);
        }
        resolve(response.data);
      },
      (err) => {
        // 提示错误信息
        myMessage({
          message: err.response.data?.desc || 'Error',
          type: 'error'
        });
        reject(err);
      }
    );
  });
}
