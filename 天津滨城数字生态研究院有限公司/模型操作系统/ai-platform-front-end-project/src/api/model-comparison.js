/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-09 09:47:14
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-07-22 10:58:12
 * @FilePath: \ai-platform-front-end-project\src\api\model-comparison.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import request from '@/utils/request';
// 获取对比任务列表数据
export function getTaskList(data) {
  return request({
    url: '/backend/aiModelEvaluationComparisonJob/page',
    method: 'post',
    data
  });
}
// 创建对比任务
export function createTask(data) {
  return request({
    url: '/backend/aiModelEvaluationComparisonJob/create',
    method: 'post',
    data
  });
}
// 开始对比
export function startTask(params) {
  return request({
    url: `/backend/aiModelEvaluationComparisonJob/start/${params.id}`,
    method: 'get'
  });
}
// 停止对比
export function stopTask(params) {
  return request({
    url: `/backend/aiModelEvaluationComparisonJob/stop/${params.id}`,
    method: 'get'
  });
}

// 结果对比-数据集
export function getTaskResult(params) {
  return request({
    url: `/backend/aiModelEvaluationComparisonJob/compare/result/${params.id}`,
    method: 'get'
  });
}

// 结果对比-性能指标
export function getModelLogList(data) {
  return request({
    url: '/backend/modelLog/list',
    method: 'post',
    data
  });
}
// 删除对比任务
export function deleteTask(params) {
  return request({
    url: `/backend/aiModelEvaluationComparisonJob/compare/${params.id}`,
    method: 'delete'
  });
}
