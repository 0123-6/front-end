import request from '@/utils/request'

// 项目中的判断条件信息-根据项目编号查询已选择的判断条件
export function projectCondition_getProjectConditionList(params) {
  return request({
    url: '/pm/projectCondition/getProjectConditionList',
    method: 'get',
    params
  })
}