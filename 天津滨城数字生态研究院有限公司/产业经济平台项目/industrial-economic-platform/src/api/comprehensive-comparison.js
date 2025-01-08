import request from '@/utils/request';

export const comparisonApis = {
  // 产业链查询
  getChainList: (params) => request({
    url: '/analysis/industryChain/getChainList',
    method: 'get',
    params
  }),
  // 分析选项查询
  getAnalyseItems: (params) => request({
    url: '/analysis/industryCompare/getAnalyseItems',
    method: 'get',
    params
  }),
  // 企业分析查询
  getEnterpriseComparison: (data) => request({
    url: '/analysis/industryCompare/enterpriseComparison',
    method: 'post',
    data
  }),
  // 知识产权查询
  getCopyrightComparison: (data) => request({
    url: '/analysis/industryCompare/copyrightComparison',
    method: 'post',
    data
  }),
  // 投融资查询
  getInvestComparison: (data) => request({
    url: '/analysis/industryCompare/investComparison',
    method: 'post',
    data
  }),
  // 产业综合对比中数据解析
  getAiModelAnalyse: (data) => request({
    url: '/analysis/industryCompare/aiModelAnalyse',
    method: 'post',
    data
  })
};
