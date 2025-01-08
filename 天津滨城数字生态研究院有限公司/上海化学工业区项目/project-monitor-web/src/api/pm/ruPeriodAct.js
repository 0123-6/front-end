import request from '@/utils/request'

// 运行时-阶段表-阶段流程详情
export function ruPeriodAct_getPeriodFLow(params) {
  return request({
    url: '/pm/ruPeriodAct/getPeriodFLow',
    method: 'get',
    params
  })
}