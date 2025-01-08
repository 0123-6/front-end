/*
 * @Author: zywu 1061096367@qq.com
 * @Date: 2023-09-09 17:48:12
 * @LastEditors: zywu 1061096367@qq.com
 * @LastEditTime: 2023-09-09 17:50:49
 * @FilePath: \industrial-economic-platform\src\api\economy-monitor.js
 * @Description: 经济运行监测
 */
import request from '@/utils/request';

export default {
  // 当前区域统计GDP总值
  basicStatistics: (params) => request({
    url: '/analysis/economicOpMonitoring/basicStatistics',
    method: 'get',
    params
  }),
  // 对比区域统计GDP总值
  gdpCompare: (params) => request({
    url: '/analysis/economicOpMonitoring/gdpCompare',
    method: 'post',
    data: params
  }),
  // 规上工业增加值
  industryCompare: (params) => request({
    url: '/analysis/economicOpMonitoring/industryCompare',
    method: 'post',
    data: params
  }),
  // 固定资产
  fixedAssetCompare: (params) => request({
    url: '/analysis/economicOpMonitoring/fixedAssetCompare',
    method: 'post',
    data: params
  }),
  // 社会消费品零售总额
  retailCompare: (params) => request({
    url: '/analysis/economicOpMonitoring/retailCompare',
    method: 'post',
    data: params
  }),
  // 进出口总额
  ineximCompare: (params) => request({
    url: '/analysis/economicOpMonitoring/ineximCompare',
    method: 'post',
    data: params
  }),
  // 居民收入消费
  pcdiCompare: (params) => request({
    url: '/analysis/economicOpMonitoring/pcdiCompare',
    method: 'post',
    data: params
  }),
  // 居民消费价格指数
  cpiCompare: (params) => request({
    url: '/analysis/economicOpMonitoring/cpiCompare',
    method: 'post',
    data: params
  }),
};
