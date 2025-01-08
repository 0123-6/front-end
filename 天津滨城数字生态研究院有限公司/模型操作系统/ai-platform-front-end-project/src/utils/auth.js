/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-06-01 11:03:00
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-06-02 10:52:07
 * @FilePath: \ai-platform-front-end-project\src\utils\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Cookies from 'js-cookie';
import Config from '@/settings';

const TokenKey = 'Seller-Admin-Token';
const RefreshTokenKey = 'Seller-Admin-Refresh-Token';
const ExpiresInKey = 'Seller-Admin-Expires-In';
const LoginTimeKey = 'Seller-Admin-Login-time';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  if (Cookies.get('rememberMe')) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires });
  } else {
    return Cookies.set(TokenKey, token);
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1;
}

export function setExpiresIn(time) {
  if (Cookies.get('rememberMe')) {
    return Cookies.set(ExpiresInKey, time, { expires: Config.tokenCookieExpires });
  } else {
    return Cookies.set(ExpiresInKey, time);
  }
}

export function removeExpiresIn() {
  return Cookies.remove(ExpiresInKey);
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey);
}

export function setRefreshToken(token) {
  if (Cookies.get('rememberMe')) {
    return Cookies.set(RefreshTokenKey, token, { expires: Config.tokenCookieExpires });
  } else {
    return Cookies.set(RefreshTokenKey, token);
  }
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey);
}

export function getLoginTime() {
  return Cookies.get(LoginTimeKey);
}

export function setLoginTime(loginTime) {
  if (Cookies.get('rememberMe')) {
    return Cookies.set(LoginTimeKey, loginTime, { expires: Config.tokenCookieExpires });
  } else {
    return Cookies.set(LoginTimeKey, loginTime);
  }
}

export function removeLoginTime() {
  return Cookies.remove(LoginTimeKey);
}

// export function setKubesphereTokenKey () {
//   Cookies.set('lang', 'zh')
//   Cookies.set('oAuthLoginInfo', '')
//   if (Cookies.get('rememberMe')) {
//     return Cookies.set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQxNDI0NjEsImlhdCI6MTY1NDEzNTI2MSwiaXNzIjoia3ViZXNwaGVyZSIsInN1YiI6ImFkbWluIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsInVzZXJuYW1lIjoiYWRtaW4ifQ.y7ILqCfQmkheiqFBFnRFjm2wp2J6f7dnky4Qj5xqlSA', { expires: Config.tokenCookieExpires })
//   } else {
//     return Cookies.set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQxNDI0NjEsImlhdCI6MTY1NDEzNTI2MSwiaXNzIjoia3ViZXNwaGVyZSIsInN1YiI6ImFkbWluIiwidG9rZW5fdHlwZSI6ImFjY2Vzc190b2tlbiIsInVzZXJuYW1lIjoiYWRtaW4ifQ.y7ILqCfQmkheiqFBFnRFjm2wp2J6f7dnky4Qj5xqlSA')
//   }
// }
// export function setKubesphereExpire () {
//   if (Cookies.get('rememberMe')) {
//     return Cookies.set('expire', '1654142461856', { expires: Config.tokenCookieExpires })
//   } else {
//     return Cookies.set('expire', '1654142461856')
//   }
// }

// export function setKubesphereRefreshToken () {
//   if (Cookies.get('rememberMe')) {
//     return Cookies.set('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQxNDk2NjEsImlhdCI6MTY1NDEzNTI2MSwiaXNzIjoia3ViZXNwaGVyZSIsInN1YiI6ImFkbWluIiwidG9rZW5fdHlwZSI6InJlZnJlc2hfdG9rZW4iLCJ1c2VybmFtZSI6ImFkbWluIn0.4EWQN-X7vIUy2t552VsgsIsZCTpreZf5GuSUve9lPDs', { expires: Config.tokenCookieExpires })
//   } else {
//     return Cookies.set('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQxNDk2NjEsImlhdCI6MTY1NDEzNTI2MSwiaXNzIjoia3ViZXNwaGVyZSIsInN1YiI6ImFkbWluIiwidG9rZW5fdHlwZSI6InJlZnJlc2hfdG9rZW4iLCJ1c2VybmFtZSI6ImFkbWluIn0.4EWQN-X7vIUy2t552VsgsIsZCTpreZf5GuSUve9lPDs')
//   }
// }
