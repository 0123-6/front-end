import request from '@/utils/request'

// 判断条件字典表-添加
export function conditionItem_add(params) {
  return request({
    url: '/admin/conditionItem/add',
    method: 'post',
    data: params
  })
}

// 判断条件字典表-通过id删除
export function conditionItem_delete(params) {
  return request({
    url: '/admin/conditionItem/delete' + `?id=${params.id}`,
    method: 'post',
    data: params
  })
}

// 判断条件字典表-批量删除
export function conditionItem_deleteBatch(params) {
  return request({
    url: '/admin/conditionItem/deleteBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 判断条件字典表-编辑
export function conditionItem_edit(params) {
  return request({
    url: '/admin/conditionItem/edit',
    method: 'put',
    data: params
  })
}

// 判断条件字典表-分页列表查询
export function conditionItem_list(params) {
  return request({
    url: '/admin/conditionItem/list',
    method: 'get',
    params
  })
}

// 判断条件字典表-通过id查询
export function conditionItem_queryById(params) {
  return request({
    url: '/admin/conditionItem/queryById',
    method: 'get',
    params
  })
}