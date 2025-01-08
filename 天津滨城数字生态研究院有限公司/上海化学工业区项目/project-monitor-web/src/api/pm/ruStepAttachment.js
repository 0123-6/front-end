import request from '@/utils/request'

// 环节附件表-添加
export function ruStepAttachment_add(params) {
  return request({
    url: '/pm/ruStepAttachment/add',
    method: 'post',
    data: params
  })
}

// 环节附件表-通过id删除
export function ruStepAttachment_delete(params) {
  return request({
    url: '/pm/ruStepAttachment/delete' + `?id=${params.id}`,
    method: 'post',
    data: params
  })
}

// 环节附件表-批量删除
export function ruStepAttachment_deleteBatch(params) {
  return request({
    url: '/pm/ruStepAttachment/deleteBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 环节附件表-编辑
export function ruStepAttachment_edit(params) {
  return request({
    url: '/pm/ruStepAttachment/edit',
    method: 'put',
    data: params
  })
}

// 环节附件表-分页列表查询
export function ruStepAttachment_list(params) {
  return request({
    url: '/pm/ruStepAttachment/list',
    method: 'get',
    params
  })
}

// 环节附件表-通过id查询
export function ruStepAttachment_queryById(params) {
  return request({
    url: '/pm/ruStepAttachment/queryById',
    method: 'get',
    params
  })
}