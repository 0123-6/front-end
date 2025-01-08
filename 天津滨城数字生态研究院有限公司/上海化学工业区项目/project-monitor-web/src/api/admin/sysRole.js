import request from '@/utils/request'

// 用户角色表-添加
export function sysRole_add(params) {
  return request({
    url: '/admin/sysRole/add',
    method: 'post',
    data: params
  })
}

// 用户角色表-通过id删除
export function sysRole_delete(params) {
  return request({
    url: '/admin/sysRole/delete' + `?id=${params.id}`,
    method: 'post',
    data: params
  })
}

// 用户角色表-编辑
export function sysRole_edit(params) {
  return request({
    url: '/admin/sysRole/edit',
    method: 'put',
    data: params
  })
}

// 用户角色表-查询全部列表
export function sysRole_getAll(params) {
  return request({
    url: '/admin/sysRole/getAll',
    method: 'get',
    params
  })
}

// 用户角色表-分页列表查询
export function sysRole_list(params) {
  return request({
    url: '/admin/sysRole/list',
    method: 'get',
    params
  })
}

// 用户角色表-通过id查询
export function sysRole_queryById(params) {
  return request({
    url: '/admin/sysRole/queryById',
    method: 'get',
    params
  })
}