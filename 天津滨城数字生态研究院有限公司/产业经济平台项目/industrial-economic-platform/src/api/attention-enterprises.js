import request from '@/utils/request';

export const attentionEnterprisesApis = {
  // 获取关注企业列表
  getAttentionEnterprisesList: (params) => request({
    url: '/user/companies/followed/page',
    method: 'post',
    data: params
  }),
  // 关注企业
  attentionEnterprises: (data) => request({
    url: '/user/companies/followed',
    method: 'post',
    data
  })
};
