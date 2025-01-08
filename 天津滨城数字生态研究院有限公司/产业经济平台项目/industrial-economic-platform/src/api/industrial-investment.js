import request from '@/utils/request';

export const industrialInvestmentApis = {
  getIndustrialInvestmentList: (data) => request({
    url: '/analysis/investment/list',
    method: 'post',
    data
  }),

  getRecentSearchListData: (params) => request({
    url: '/analysis/investment/historyRecommendList',
    method: 'get',
    params
  }),

  clearRecentSearch: (data) => request({
    url: '/analysis/investment/clearUserHistory',
    method: 'delete',
    data
  }),

  clearItemRecentSearch: (data) => request({
    url: '/analysis/investment/deleteUserHistory',
    method: 'delete',
    data
  })
};
