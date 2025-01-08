import request from '@/utils/request'

// 消息通知表-添加
export function msgBaseinfo_add(params) {
  return request({
    url: '/pm/msgBaseinfo/add',
    method: 'post',
    data: params
  })
}

// 消息通知表-通过id删除
export function msgBaseinfo_delete(params) {
  return request({
    url: '/pm/msgBaseinfo/delete' + `?id=${params.id}`,
    method: 'post',
    data: params
  })
}

// 消息通知表-批量删除
export function msgBaseinfo_deleteBatch(params) {
  return request({
    url: '/pm/msgBaseinfo/deleteBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 消息通知表-编辑
export function msgBaseinfo_edit(params) {
  return request({
    url: '/pm/msgBaseinfo/edit',
    method: 'put',
    data: params
  })
}

// 消息通知表-分页列表查询
export function msgBaseinfo_list(params) {
  return request({
    url: '/pm/msgBaseinfo/list',
    method: 'get',
    params
  })
}

// 消息通知表-通过id查询
export function msgBaseinfo_queryById(params) {
  return request({
    url: '/pm/msgBaseinfo/queryById',
    method: 'get',
    params
  })
}