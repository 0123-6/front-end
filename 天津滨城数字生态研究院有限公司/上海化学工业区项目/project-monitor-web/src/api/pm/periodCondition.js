import request from '@/utils/request'

// 阶段和条件关联表-添加
export function periodCondition_add(params) {
  return request({
    url: '/pm/periodCondition/add',
    method: 'post',
    data: params
  })
}

// 阶段和条件关联表-通过id删除
export function periodCondition_delete(params) {
  return request({
    url: '/pm/periodCondition/delete' + `?id=${params.id}`,
    method: 'post',
    data: params
  })
}

// 阶段和条件关联表-批量删除
export function periodCondition_deleteBatch(params) {
  return request({
    url: '/pm/periodCondition/deleteBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 阶段和条件关联表-编辑
export function periodCondition_edit(params) {
  return request({
    url: '/pm/periodCondition/edit',
    method: 'put',
    data: params
  })
}

// 阶段和条件关联表-分页列表查询
export function periodCondition_list(params) {
  return request({
    url: '/pm/periodCondition/list',
    method: 'get',
    params
  })
}

// 阶段和条件关联表-通过id查询
export function periodCondition_queryById(params) {
  return request({
    url: '/pm/periodCondition/queryById',
    method: 'get',
    params
  })
}

// 获取每个阶段的判断条件
export function periodCondition_queryByPeriodId(params) {
  return request({
    url: '/pm/periodCondition/queryByPeriodId',
    method: 'get',
    params
  })
}