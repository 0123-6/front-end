import request from '@/utils/request'

// 首页显示设置-编辑
export function homePageShow_edit(params) {
  return request({
    url: '/admin/homePageShow/edit',
    method: 'put',
    data: params
  })
}

// 查询首页显示设置
export function homePageShow_list(params) {
  return request({
    url: '/admin/homePageShow/list',
    method: 'get',
    params
  })
}