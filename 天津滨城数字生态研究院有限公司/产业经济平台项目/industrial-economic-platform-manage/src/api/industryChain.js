import request from '@/utils/requestFront';

export function getIndustryChainList(params) {
  return request({
    url: '/api/analysis/industryChain/admin/list',
    method: 'get',
    params
  });
}

export function getIndustrySelectList() {
  return request({
    url: '/api/analysis/industryChain/getChainList',
    method: 'get'
  });
}

export function getIndustryDetail(params) {
  return request({
    url: '/api/analysis/industryChain/getIndustryDetail',
    method: 'get',
    params
  });
}

// 产业链编号查询产业链图谱
export function getChainById(params) {
  return request({
    url: '/api/analysis/industryChain/getChainById',
    method: 'get',
    params
  });
}

// 产业链编号查询企业列表
export function getEnterprisesByChainId(params) {
  return request({
    url: '/analysis/industryChain/getEnterprisesByChainId',
    method: 'post',
    data: params
  });
}
