import request from '@/utils/request'

// 判断条件字典表查询
export function conditionItem_getAll(params) {
  return request({
    url: '/pm/conditionItem/getAll',
    method: 'get',
    params
  })
}