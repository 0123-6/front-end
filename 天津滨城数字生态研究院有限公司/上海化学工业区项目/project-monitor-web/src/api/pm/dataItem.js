import request from '@/utils/request'

// 查询全量的字典表数据
export function dataItem_queryAll(params) {
  return request({
    url: '/pm/dataItem/queryAll',
    method: 'get',
    params
  })
}

// 通用字典表-通过id查询
export function dataItem_queryById(params) {
  return request({
    url: '/pm/dataItem/queryById',
    method: 'get',
    params
  })
}

// 根据字典类型，查询字典项
export function dataItem_queryByTypeCode(params) {
  return request({
    url: '/pm/dataItem/queryByTypeCode',
    method: 'get',
    params
  })
}

// 查询全量的关键环节信息
export function dataItem_queryKeyStepsAll(params) {
  return request({
    url: '/pm/dataItem/queryKeyStepsAll',
    method: 'get',
    params
  })
}