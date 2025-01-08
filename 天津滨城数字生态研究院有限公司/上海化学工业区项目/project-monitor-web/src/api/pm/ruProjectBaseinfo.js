import request from '@/utils/request'

// 项目管理操作-添加备注
export function ruProjectBaseinfo_addRemarks(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/addRemarks',
    method: 'put',
    data: params
  })
}

// 项目已完成情况统计
export function ruProjectBaseinfo_comStatusStatistics(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/comStatusStatistics',
    method: 'get',
    params
  })
}

// 项目完成情况列表
export function ruProjectBaseinfo_completionStatusList(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/completionStatusList',
    method: 'post',
    data: params
  })
}

// 项目基本信息-项目创建
export function ruProjectBaseinfo_create(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/create',
    method: 'post',
    data: params
  })
}

// 项目基本信息-批量删除
export function ruProjectBaseinfo_deleteBatch(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/deleteBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 项目草稿列表-批量删除
export function ruProjectBaseinfo_deleteDraftBatch(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/deleteDraftBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 调度转办
export function ruProjectBaseinfo_dispatchTransfer(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/dispatchTransfer',
    method: 'post',
    data: params
  })
}

// 项目基本信息-项目编辑
export function ruProjectBaseinfo_edit(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/edit',
    method: 'post',
    data: params
  })
}

// 判断项目代码、名称是否存在(remark:0项目代码，1项目名称)
export function ruProjectBaseinfo_existCodeOrName(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/existCodeOrName',
    method: 'get',
    params
  })
}

// 项目管理列表-默认导出
export function ruProjectBaseinfo_export(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/export',
    method: 'post',
    data: params
  })
}

// 项目管理列表-自定义导出
export function ruProjectBaseinfo_exportCustom(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/exportCustom',
    method: 'post',
    data: params
  })
}

// 项目态势-导出报表
export function ruProjectBaseinfo_exportProjectSituation(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/exportProjectSituation' + `?endTime=${params.endTime}&startTime=${params.startTime}`,
    method: 'post',
    data: params
  })
}

// 项目创建-一键获取
export function ruProjectBaseinfo_getAllInfo(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/getAllInfo' + `?projectCode=${params.projectCode}&projectName=${params.projectName}`,
    method: 'post',
    data: params
  })
}

// 关键环节分布
export function ruProjectBaseinfo_keyStepDistribution(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/keyStepDistribution',
    method: 'post',
    data: params
  })
}

// 项目未完成情况统计
export function ruProjectBaseinfo_notCompleteStatistics(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/notCompleteStatistics',
    method: 'get',
    params
  })
}

// 项目增长分布
export function ruProjectBaseinfo_projectAddSituation(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/projectAddSituation',
    method: 'post',
    data: params
  })
}

// 项目详情页-进度总览
export function ruProjectBaseinfo_projectAllProgress(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/projectAllProgress',
    method: 'get',
    params
  })
}

// 项目草稿列表
export function ruProjectBaseinfo_projectDraft(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/projectDraft',
    method: 'get',
    params
  })
}

// 项目投资分布
export function ruProjectBaseinfo_projectInvestDistribute(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/projectInvestDistribute',
    method: 'post',
    data: params
  })
}

// 项目阶段分布
export function ruProjectBaseinfo_projectProcessProgress(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/projectProcessProgress',
    method: 'post',
    data: params
  })
}

// 项目详情页-项目进度统计
export function ruProjectBaseinfo_projectProgress(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/projectProgress',
    method: 'get',
    params
  })
}

// 项目状态分布
export function ruProjectBaseinfo_projectStatus(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/projectStatus',
    method: 'post',
    data: params
  })
}

// 工程性质数量分布
export function ruProjectBaseinfo_projectType(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/projectType',
    method: 'post',
    data: params
  })
}

// 项目管理操作-正常推进
export function ruProjectBaseinfo_propel(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/propel',
    method: 'put',
    data: params
  })
}

// 项目基本信息-通过id查询
export function ruProjectBaseinfo_queryById(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/queryById',
    method: 'get',
    params
  })
}

// 查询首页显示设置
export function ruProjectBaseinfo_queryHomePage(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/queryHomePage',
    method: 'get',
    params
  })
}

// 项目管理列表-分页列表查询
export function ruProjectBaseinfo_queryProjectManagePage(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/queryProjectManagePage',
    method: 'post',
    data: params
  })
}

// 项目基本信息-项目编辑(回显数据查询)
export function ruProjectBaseinfo_selectDraftProject(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/selectDraftProject',
    method: 'get',
    params
  })
}

// 项目管理操作-项目终止
export function ruProjectBaseinfo_terminate(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/terminate',
    method: 'put',
    data: params
  })
}

// 项目详情页-测试
export function ruProjectBaseinfo_test(params) {
  return request({
    url: '/pm/ruProjectBaseinfo/test',
    method: 'get',
    params
  })
}