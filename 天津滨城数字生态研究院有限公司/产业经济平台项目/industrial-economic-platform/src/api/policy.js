import request from '@/utils/requestPy';

// 最新政策列表
export const getLatestPolicy = (params) => request({
  url: '/pythonApi/policy/latest',
  method: 'get',
  params
});

// 区域信息来源列表
export const getDepartmentList = (params) => request({
  url: `/pythonApi/policy/source_department/list/${params.area_code}`,
  method: 'get'
});

// 政策查询-搜索列表
export const getPolicyList = (params) => request({
  url: '/pythonApi/policy/list',
  method: 'get',
  params
});

// 政策详情
export const getPolicyDetail = (params) => request({
  url: `/pythonApi/policy/detail/${params.policy_id}`,
  method: 'get'
});

// 政策查询-数量统计
export const getPolicyAmount = (params) => request({
  url: `/pythonApi/policy/static/num/by/area/${params.area_code}`,
  method: 'get',
});

// 政策查询-热门搜索
export const getPolicyHotkeywords = () => request({
  url: '/pythonApi/policy/hotkeywords',
  method: 'get'
});

// 政策匹配-搜索列表
export const getPolicyAwardList = (params) => request({
  url: '/pythonApi/policy/award/list',
  method: 'get',
  params
});

// 政策匹配-匹配企业
export const getAwardPolicyDetail = (params) => request({
  url: `/pythonApi/policy/award/${params.policy_id}`,
  method: 'get',
});

// 政策匹配-匹配企业
export const getPolicyCompanyList = (params) => request({
  url: `/pythonApi/policy/award/match/${params.policy_id}`,
  method: 'get',
  params
});

// 政策匹配-产业分类
export const getIndustryCategoryList = () => request({
  url: '/pythonApi/policy/industry/category',
  method: 'get'
});
