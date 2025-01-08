import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getRoleListData(params) {
  return request({
    url: '/role/page',
    method: 'get',
    params
  });
}

export function getRoleListAllData() {
  return request({
    url: '/role/list',
    method: 'get'
  });
}

export function getRoleDetailData(params) {
  return request({
    url: '/role',
    method: 'get',
    params
  });
}

/**
 *
 * @param params
 * @returns {*}
 */
export function createRoleData(params) {
  return request({
    url: '/role',
    method: 'post',
    data: params
  });
}

/**
 *
 * @param params
 * @returns {*}
 */
export function updateRoleData(params) {
  return request({
    url: '/role',
    method: 'put',
    data: params
  });
}
/**
 *
 * @param params
 * @returns {*}
 */
export function deleteRoleData(params) {
  return request({
    url: '/role',
    method: 'delete',
    data: params
  });
}

export function getRoleMenuData(params) {
  return request({
    url: '/menu/tree/role',
    method: 'get',
    params
  });
}
