import request from '@/utils/request'

// 通用字典表-添加
export function dataItem_add(params) {
  return request({
    url: '/admin/dataItem/add',
    method: 'post',
    data: params
  })
}

// 通用字典表-通过id删除
export function dataItem_delete(params) {
  return request({
    url: '/admin/dataItem/delete' + `?id=${params.id}`,
    method: 'post',
    data: params
  })
}

// 通用字典表-批量删除
export function dataItem_deleteBatch(params) {
  return request({
    url: '/admin/dataItem/deleteBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 通用字典表-编辑
export function dataItem_edit(params) {
  return request({
    url: '/admin/dataItem/edit',
    method: 'put',
    data: params
  })
}

// 通用字典表-分页列表查询
export function dataItem_list(params) {
  return request({
    url: '/admin/dataItem/list',
    method: 'get',
    params
  })
}

// 通用字典表-通过id查询
export function dataItem_queryById(params) {
  return request({
    url: '/admin/dataItem/queryById',
    method: 'get',
    params
  })
}