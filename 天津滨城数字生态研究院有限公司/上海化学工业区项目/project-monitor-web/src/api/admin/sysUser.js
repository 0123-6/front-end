import request from '@/utils/request'

// 用户信息-添加
export function sysUser_add(params) {
  return request({
    url: '/admin/sysUser/add',
    method: 'post',
    data: params
  })
}

// 个人中心-更换头像
export function sysUser_avatarReplace(params) {
  return request({
    url: '/admin/sysUser/avatarReplace',
    method: 'put',
    data: params
  })
}

// 个人中心-修改密码
export function sysUser_changePassword(params) {
  return request({
    url: '/admin/sysUser/changePassword',
    method: 'put',
    data: params
  })
}

// 用户信息-通过id删除
export function sysUser_delete(params) {
  return request({
    url: '/admin/sysUser/delete' + `?id=${params.id}`,
    method: 'post',
    data: params
  })
}

// 用户信息-批量删除
export function sysUser_deleteBatch(params) {
  return request({
    url: '/admin/sysUser/deleteBatch',
    method: 'post',
    data: params
  })
}

// 用户信息-批量禁用
export function sysUser_disableBatch(params) {
  return request({
    url: '/admin/sysUser/disableBatch',
    method: 'post',
    data: params
  })
}

// 用户信息-编辑
export function sysUser_edit(params) {
  return request({
    url: '/admin/sysUser/edit',
    method: 'put',
    data: params
  })
}

// 用户信息-批量启用
export function sysUser_enableBatch(params) {
  return request({
    url: '/admin/sysUser/enableBatch',
    method: 'post',
    data: params
  })
}

// 用户信息-获取用户登录信息
export function sysUser_info(params) {
  return request({
    url: '/admin/sysUser/info',
    method: 'get',
    params
  })
}

// 成员列表-分页列表查询
export function sysUser_list(params) {
  return request({
    url: '/admin/sysUser/list',
    method: 'get',
    params
  })
}

// 用户-登录
export function sysUser_login(params) {
  return request({
    url: '/admin/sysUser/login',
    method: 'post',
    data: params
  })
}

// 用户-登出
export function sysUser_logout(params) {
  return request({
    url: '/admin/sysUser/logout',
    method: 'delete',
    data: params
  })
}

// 个人中心-获取用户信息
export function sysUser_personalCenterInfo(params) {
  return request({
    url: '/admin/sysUser/personalCenterInfo',
    method: 'get',
    params
  })
}

// 用户-刷新token
export function sysUser_refreshToken(params) {
  return request({
    url: '/admin/sysUser/refreshToken',
    method: 'put',
    data: params
  })
}