import request from '@/utils/request'

// 绩效管理-各阶段耗时分布
export function performance_getComUsedDays(params) {
  return request({
    url: '/pm/performance/getComUsedDays',
    method: 'get',
    params
  })
}

// 绩效管理-各环节完成情况
export function performance_getStepCompletion(params) {
  return request({
    url: '/pm/performance/getStepCompletion',
    method: 'post',
    data: params
  })
}

// 绩效管理-各环节延期次数排名统计
export function performance_getStepDelayedRank(params) {
  return request({
    url: '/pm/performance/getStepDelayedRank',
    method: 'get',
    params
  })
}