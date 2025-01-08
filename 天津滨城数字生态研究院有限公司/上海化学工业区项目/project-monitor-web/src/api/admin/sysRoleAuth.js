import request from '@/utils/request'

// 角色权限表-添加
export function sysRoleAuth_add(params) {
  return request({
    url: '/admin/sysRoleAuth/add',
    method: 'post',
    data: params
  })
}

// 角色权限表-通过id删除
export function sysRoleAuth_delete(params) {
  return request({
    url: '/admin/sysRoleAuth/delete',
    method: 'post',
    data: params
  })
}

// 角色权限表-批量删除
export function sysRoleAuth_deleteBatch(params) {
  return request({
    url: '/admin/sysRoleAuth/deleteBatch',
    method: 'post',
    data: params
  })
}

// 角色权限表-编辑
export function sysRoleAuth_edit(params) {
  return request({
    url: '/admin/sysRoleAuth/edit',
    method: 'put',
    data: params
  })
}

// 角色权限表-分页列表查询
export function sysRoleAuth_list(params) {
  return request({
    url: '/admin/sysRoleAuth/list',
    method: 'get',
    params
  })
}

// 角色权限表-通过id查询
export function sysRoleAuth_queryById(params) {
  return request({
    url: '/admin/sysRoleAuth/queryById',
    method: 'get',
    params
  })
}