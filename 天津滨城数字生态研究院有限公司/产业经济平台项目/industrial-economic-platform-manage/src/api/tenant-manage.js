import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getTenantListData(params) {
  return request({
    url: '/tenant/page',
    method: 'get',
    params
  });
}

/**
 *
 * @param params
 * @returns {*}
 */
export function getTenantDetailData(params) {
  return request({
    url: '/tenant',
    method: 'get',
    params
  });
}

export function getTenantLimitDetailData(params) {
  return request({
    url: '/tenant/meta/tenant',
    method: 'get',
    params
  });
}

export function addTenantData(params) {
  return request({
    url: '/tenant',
    method: 'post',
    data: params
  });
}

export function updateTenantData(params) {
  return request({
    url: '/tenant/account',
    method: 'put',
    data: params
  });
}

export function updateTenantLimitData(params) {
  return request({
    url: '/tenant/service',
    method: 'put',
    data: params
  });
}

/**
 *
 * @param params
 * @returns {*}
 */
export function deleteTenantData(params) {
  return request({
    url: '/tenant',
    method: 'delete',
    params
  });
}

export function trialToFormalData(params) {
  return request({
    url: '/tenant/trial2formal',
    method: 'put',
    data: params
  });
}

export function checkUsernameData(params) {
  return request({
    url: '/tenant/user/exist',
    method: 'get',
    params
  });
}

// 机构用户验证码
export function randomCode(params) {
  return request({
    url: '/tenant/randomCode',
    method: 'get',
    params
  });
}

// 机构成员
export function getUserListData(params) {
  return request({
    url: '/tenant/getUserList',
    method: 'post',
    data: params
  });
}

// 查询访客列表
export function getVisitorUsers(params) {
  return request({
    url: '/tenant/getVisitorUsers',
    method: 'post',
    data: params
  });
}

// 添加机构用户
export function addUsers(params) {
  return request({
    url: '/tenant/addUsers',
    method: 'post',
    data: params
  });
}

// 移出机构用户
export function removeUser(params) {
  return request({
    url: '/tenant/removeUser',
    method: 'post',
    data: params
  });
}

// 更新机构用户权限信息
export function updateUserAuth(params) {
  return request({
    url: '/tenant/user_service',
    method: 'put',
    data: params
  });
}

// 机构用户详情
export function getOrgUserDetail(params) {
  return request({
    url: '/tenant/getUserDetail',
    method: 'get',
    params
  });
}

// 查询机构成员权限元数据
export function getOrgUserMetaMenu(params) {
  return request({
    url: '/role/menu/userMeta',
    method: 'get',
    params
  });
}

// 根据用户id查询成员权限数据
export function getOrgUserMenuDetail(params) {
  return request({
    url: '/tenant/meta/user',
    method: 'get',
    params
  });
}
