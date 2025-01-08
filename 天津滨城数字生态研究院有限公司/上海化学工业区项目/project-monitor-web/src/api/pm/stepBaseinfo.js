import request from '@/utils/request'

// 环节全量信息查询
export function stepBaseinfo_getAll(params) {
  return request({
    url: '/pm/stepBaseinfo/getAll',
    method: 'get',
    params
  })
}

// 查询所有环节和判断条件作为知识库标签
export function stepBaseinfo_getAllStepAndConditions(params) {
  return request({
    url: '/pm/stepBaseinfo/getAllStepAndConditions',
    method: 'get',
    params
  })
}

// 根据阶段查询阶段中所有环节
export function stepBaseinfo_getByPeriodId(params) {
  return request({
    url: '/pm/stepBaseinfo/getByPeriodId',
    method: 'get',
    params
  })
}