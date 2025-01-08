/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-08 10:19:16
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-04-19 11:08:33
 * @FilePath: \ai-platform-front-end-project\src\api\model-monitoring.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';
import qs from 'qs';
/**
 * 获取模型选择下拉框数据
 * @param data
 */
export function getInfomationList(data) {
  return request({
    url: '/backend/model/deployment/infomation/page',
    method: 'post',
    data
  });
}

/**
 * 模型监控页面，获取首页各种指标
 */
export function getMonitorIndex() {
  return request({
    url: '/backend/monitor/statistics',
    method: 'get'
  });
}

/**
 * 模型监控页面，获取模型列表
 */
export function getModelList(params) {
  return request({
    url: '/backend/monitor/list?' + qs.stringify(params),
    method: 'get'
  });
}

/**
 * 获取性能页面数据
 */
export function getMonitorPerformance(data) {
  return request({
    url: '/backend/monitor/effect',
    method: 'post',
    data
  });
}

/**
 * 获取输入页面数据
 */
export function getMonitorInput(data) {
  return request({
    url: '/backend/monitor/input',
    method: 'post',
    data
  });
}

/**
 * 获取输出页面数据
 */
export function getMonitorOutput(data) {
  return request({
    url: '/backend/monitor/output',
    method: 'post',
    data
  });
}

export function getMonitorOutputTimeCost(data) {
  return request({
    url: '/backend/monitor/resource/timeCost',
    method: 'post',
    data
  });
}

export function getMonitorOutputAggregation(data) {
  return request({
    url: '/backend/monitor/resource/aggregation',
    method: 'post',
    data
  });
}

export function getMonitorResourcesWithNode(data) {
  return request({
    url: '/backend/monitor/resource/node',
    method: 'post',
    data
  });
}

export function getMonitorResourcesWithPod(data) {
  return request({
    url: '/backend/monitor/resource/pod',
    method: 'post',
    data
  });
}
