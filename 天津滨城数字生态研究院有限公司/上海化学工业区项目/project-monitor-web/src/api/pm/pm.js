import request from '@/utils/request'

// 绩效管理-各阶段耗时分布
export function pm_getComUsedDays(params) {
  return request({
    url: '/pm/pm/getComUsedDays',
    method: 'get',
    params
  })
}

// 绩效管理-绩效管理表
export function pm_getPerformanceList(params) {
  return request({
    url: '/pm/pm/getPerformanceList',
    method: 'get',
    params
  })
}

// 绩效管理-各环节完成情况
export function pm_getStepCompletion(params) {
  return request({
    url: '/pm/pm/getStepCompletion',
    method: 'get',
    params
  })
}

// 绩效管理-各环节延期次数排名统计
export function pm_getStepDelayedRank(params) {
  return request({
    url: '/pm/pm/getStepDelayedRank',
    method: 'get',
    params
  })
}