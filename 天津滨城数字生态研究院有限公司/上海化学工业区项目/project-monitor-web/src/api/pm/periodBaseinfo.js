import request from '@/utils/request'

// 获取不同项目类型的阶段流程
export function periodBaseinfo_periodFlow(params) {
  return request({
    url: '/pm/periodBaseinfo/periodFlow',
    method: 'get',
    params
  })
}