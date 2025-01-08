/* eslint-disable */
import axios from 'axios';
import { myMessage } from '@/plugins/resetMessage';
import store from '@/store';
import $router from '@/router';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
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
        store.commit('Common/CLEAR_STORE');
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
            // console.log(err);
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
      store.commit('Common/CLEAR_STORE');
    }
    if (res.code !== '00000' && !(res instanceof Blob)) {
      myMessage({
        message: res.desc || res.msg || 'Error',
        type: 'error'
      });
      // return Promise.reject(new Error(res.desc || res.msg || 'Error'));
    }
    if (res instanceof Blob) {
      res.filename = decodeURI(response.headers.filename);
    }
    return res;
  },
  (error) => {
    myMessage({
      message: error.desc || '服务繁忙，请稍后刷新页面后重试!',
      type: 'error'
    });
    return Promise.reject(error);
  }
);

export default service;

// 封装get请求
// @ts-ignore
export function get(url, params = {}) {
  // 禁用ts检查
  // @ts-ignore
  // const newUrl = `https://mock.apifox.com/m1/3431813-0-default${url}`;
  const newUrl = `/pythonApi${url}`;
  if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
  }
  return new Promise((resolve, reject) => {
    axios.get(newUrl, {
      params,
      headers: {
        Authorization: `${store.getters.TOKEN.token}`,
        'Is-From-Admin': 1,
      },
    }).then((response) => {
      if (response.data.code !== 0) {
        reject(response.data);
      }
      resolve(response.data);
    })
      .catch((error) => {
        reject(error);
      });
  });
}

// 封装post请求
// @ts-ignore
export function post(url, data = {}, config = {}) {
  config.headers = {
    Authorization: `${store.getters.TOKEN.token}`,
    'Is-From-Admin': 1,
  };
  // @ts-ignore
  // const newUrl = `https://mock.apifox.com/m1/3431813-0-default${url}`;
  const newUrl = `/pythonApi${url}`;
  if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
    // url = url.substring(5)
  }
  return new Promise((resolve, reject) => {
    axios.post(newUrl, data, config).then(
      (response) => {
        if (response.data.code !== 0) {
          reject(response.data);
        }
        resolve(response.data);
      },
      (err) => {
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
  // const newUrl = `https://mock.apifox.com/m1/3431813-0-default${url}`;
  const newUrl = `/pythonApi${url}`;
  if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
    // url = url.substring(5)
  }
  return new Promise((resolve, reject) => {
    axios.delete(newUrl, {
      data,
      headers: {
        Authorization: `${store.getters.TOKEN.token}`,
        'Is-From-Admin': 1,
      },
    }).then(
      (response) => {
        if (response.data.code !== 0) {
          reject(response.data);
        }
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

// 根据code判断，如果为401，跳转到登录页
function checkCode(code) {
  if (code === 401) {
    $router.push('/login');
    store.commit('Common/CLEAR_STORE');
  }
}
