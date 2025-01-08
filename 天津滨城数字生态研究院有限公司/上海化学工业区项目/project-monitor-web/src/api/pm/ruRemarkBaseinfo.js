import request from '@/utils/request'

// 查询项目或环节的历史备注信息
export function ruRemarkBaseinfo_historyList(params) {
  return request({
    url: '/pm/ruRemarkBaseinfo/historyList',
    method: 'get',
    params
  })
}