import request from '@/utils/request'

// 根据各阶段的判断条件获取环节流程图
export function stepBaseFlow_stepFlow(params) {
  return request({
    url: '/pm/stepBaseFlow/stepFlow',
    method: 'post',
    data: params
  })
}