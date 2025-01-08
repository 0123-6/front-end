/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-05 22:28:20
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-06 09:41:39
 * @FilePath: \ai-platform-front-end-project\src\utils\error-types.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Message } from 'element-ui';

// 异常拦截处理器
export const errorHandler = (error) => {
  const status = error.response?.status;
  switch (status) {
    /* eslint-disable no-param-reassign */
    case 400:
      error.message = '请求错误';
      break;
    case 401:
      error.message = '未授权，请登录';
      // 处理跳转登陆
      break;
    case 403:
      error.message = '拒绝访问';
      break;
    case 404:
      error.message = `请求地址出错`;
      break;
    case 408:
      error.message = '请求超时';
      break;
    case 500:
      error.message = '服务器内部错误';
      break;
    case 501:
      error.message = '服务未实现';
      break;
    case 502:
      error.message = '网关错误';
      break;
    case 503:
      error.message = '服务不可用';
      break;
    case 504:
      error.message = '网关超时';
      break;
    case 505:
      error.message = 'HTTP版本不受支持';
      break;
    default:
      break;
  }
  Message.closeAll();
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  });
  return Promise.reject(error);
};
