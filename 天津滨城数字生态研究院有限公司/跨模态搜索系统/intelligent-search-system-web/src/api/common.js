import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function logout(params) {
  return request({
    url: '/user/logout',
    method: 'post',
    data: params
  });
}

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function login(params) {
  return request({
    url: '/user/login',
    method: 'post',
    data: params
  });
}

/**
 *
 * @returns {*}
 * @author chen song
 */
export function getAllDictData() {
  return request({
    url: '/dict/all/item-list',
    method: 'post'
  });
}

/**
 *
 * @returns {*}
 * @author chen song
 */
export function getUserInfo(id) {
  return request({
    url: `/user/get/${id}`,
    method: 'post'
  });
}

/**
 *
 * @returns {*}
 * @author chen song
 */
export function modifyUserInfo(params) {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  });
}

/**
 *
 * @returns {*}
 * @author chen song
 */
export function modifyPassword(params) {
  return request({
    url: '/user/updatePwd',
    method: 'put',
    data: params
  });
}
