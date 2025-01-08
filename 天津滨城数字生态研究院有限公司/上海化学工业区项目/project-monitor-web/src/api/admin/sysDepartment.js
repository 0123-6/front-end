import request from '@/utils/request'

// 部门表-添加
export function sysDepartment_add(params) {
  return request({
    url: '/admin/sysDepartment/add',
    method: 'post',
    data: params
  })
}

// 部门表-通过id删除
export function sysDepartment_delete(params) {
  return request({
    url: '/admin/sysDepartment/delete' + `?id=${params.id}`,
    method: 'post',
    data: params
  })
}

// 部门表-批量删除
export function sysDepartment_deleteBatch(params) {
  return request({
    url: '/admin/sysDepartment/deleteBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 部门表-编辑
export function sysDepartment_edit(params) {
  return request({
    url: '/admin/sysDepartment/edit',
    method: 'put',
    data: params
  })
}

// 部门全量信息查询
export function sysDepartment_getAll(params) {
  return request({
    url: '/admin/sysDepartment/getAll',
    method: 'get',
    params
  })
}

// 部门表-分页列表查询
export function sysDepartment_list(params) {
  return request({
    url: '/admin/sysDepartment/list',
    method: 'get',
    params
  })
}

// 部门表-通过id查询
export function sysDepartment_queryById(params) {
  return request({
    url: '/admin/sysDepartment/queryById',
    method: 'get',
    params
  })
}