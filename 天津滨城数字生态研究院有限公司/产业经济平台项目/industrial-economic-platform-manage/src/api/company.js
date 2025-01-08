import request from '@/utils/requestFront';

export function getCompanyList(params) {
  return request({
    url: '/api/analysis/company/admin/list',
    method: 'get',
    params
  });
}

// 获取全量字典
export const getDictAll = (params) => request({
  url: '/api/analysis/dict/all',
  method: 'get',
  params
});
