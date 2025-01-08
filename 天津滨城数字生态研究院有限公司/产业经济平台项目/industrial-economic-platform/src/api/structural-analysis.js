/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-06-25 09:24:25
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-03 17:03:18
 * @FilePath: \industrial-economic-platform\src\api\structural-analysis.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

export const analysisApis = {
  // 产业总览查询
  getIndustryItems: (params) => request({
    url: '/analysis/industryAnalyse/industryItems',
    method: 'get',
    params
  }),
  // 区域列表查询
  getRegionItems: (params) => request({
    url: '/analysis/industryAnalyse/regionTree',
    method: 'get',
    params
  }),
  // 企业分析图表
  getCompanyAnalyse: (params) => request({
    url: '/analysis/industryAnalyse/companyAnalyse',
    method: 'get',
    params
  }),
  // 技术创新图表
  getTechInnovation: (params) => request({
    url: '/analysis/industryAnalyse/techInnovation',
    method: 'get',
    params
  }),
  // 区域分布图表
  getRegionAnalyse: (params) => request({
    url: '/analysis/industryAnalyse/regionAnalyse',
    method: 'get',
    params
  }),
  // 投融资图表
  getInvestAnalyse: (params) => request({
    url: '/analysis/industryAnalyse/investAnalyse',
    method: 'get',
    params
  }),
  // 产业评估图表
  getEvaluation: (params) => request({
    url: '/analysis/industryChain/devEvaluation',
    method: 'get',
    params
  }),
  // 投资公司表格
  getInvestList: (params) => request({
    url: '/analysis/industryAnalyse/investList',
    method: 'get',
    params
  }),
  // 地图全量地区数据
  getAllRegions: (params) => request({
    url: '/analysis/industryAnalyse/allRegions',
    method: 'get',
    params
  })
};
