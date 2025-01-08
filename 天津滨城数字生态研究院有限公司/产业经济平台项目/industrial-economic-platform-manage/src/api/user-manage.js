import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getUserListData(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  });
}

export function getUserDetailData(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  });
}

export function addUserData(params) {
  return request({
    url: '/user',
    method: 'post',
    data: params
  });
}

export function updateUserData(params) {
  return request({
    url: '/user',
    method: 'put',
    data: params
  });
}

/**
 *
 * @param params
 * @returns {*}
 */
export function deleteUserData(params) {
  return request({
    url: '/user',
    method: 'delete',
    data: params
  });
}

export function stopUserData(params) {
  return request({
    url: '/user/ban',
    method: 'put',
    data: params
  });
}

export function startUserData(params) {
  return request({
    url: '/user/active',
    method: 'put',
    data: params
  });
}
