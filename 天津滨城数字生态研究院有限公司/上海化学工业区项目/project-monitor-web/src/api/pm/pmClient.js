import request from '@/utils/request'

// getComUsedDays
export function pmClient_pm_getComUsedDays(params) {
  return request({
    url: '/pm/pmClient/pm/getComUsedDays',
    method: 'get',
    params
  })
}

// getStepDelayedRank
export function pmClient_pm_getStepDelayedRank(params) {
  return request({
    url: '/pm/pmClient/pm/getStepDelayedRank',
    method: 'get',
    params
  })
}

// updateKnowledgeLabelNum
export function pmClient_pm_updateKnowledgeLabelNum(params) {
  return request({
    url: '/pm/pmClient/pm/updateKnowledgeLabelNum',
    method: 'post',
    data: params
  })
}