import request from '@/utils/request'

// 判断环节是否超时完成
export function ruStepAct_getDelayWorked(params) {
  return request({
    url: '/pm/ruStepAct/getDelayWorked',
    method: 'post',
    data: params
  })
}

// 运行环节表-获取环节详情
export function ruStepAct_getStepDetail(params) {
  return request({
    url: '/pm/ruStepAct/getStepDetail',
    method: 'get',
    params
  })
}

// 运行环节表-获取环节流程详情
export function ruStepAct_getStepFlowDetail(params) {
  return request({
    url: '/pm/ruStepAct/getStepFlowDetail',
    method: 'get',
    params
  })
}

// importExcelData
export function ruStepAct_importExcelData(params) {
  return request({
    url: '/pm/ruStepAct/importExcelData',
    method: 'post',
    data: params
  })
}

// 运行环节表-环节状态总览
export function ruStepAct_stepStatusStatistics(params) {
  return request({
    url: '/pm/ruStepAct/stepStatusStatistics',
    method: 'get',
    params
  })
}

// 运行环节表-内/外部环节分布
export function ruStepAct_stepTypeStatistics(params) {
  return request({
    url: '/pm/ruStepAct/stepTypeStatistics',
    method: 'get',
    params
  })
}

// 运行环节表-修改环节的状态
export function ruStepAct_updateStepStatus(params) {
  return request({
    url: '/pm/ruStepAct/updateStepStatus',
    method: 'post',
    data: params
  })
}