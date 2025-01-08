/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-09 10:30:25
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-20 16:33:34
 * @FilePath: \ai-platform-front-end-project\src\api\data-set.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';
// 获取数据集
export function getDataSetList(data) {
  return request({
    url: '/backend/data/set/pageList',
    method: 'post',
    data
  });
}

// 获取数据集平台
export function getDataSetListPlateform(data) {
  return request({
    url: '/backend/dataset/plat/select',
    method: 'POST',
    data
  });
}

// 获取数据集我的
export function getDataSetListMine(data) {
  return request({
    url: '/backend/dataset/page',
    method: 'POST',
    data
  });
}

// 读取JSON数据(数据集展示)
export function readJsonContent(data) {
  return request({
    url: `/backend/read/content?urlStr=${data.urlStr}`,
    method: 'post',
    data
  });
}
// 读取XML数据(数据集展示)
export function readXmlContent(data) {
  return request({
    url: `/backend/read/content?urlStr=${data.urlStr}`,
    method: 'post',
    data
  });
}
// 读取CSV(数据集展示)
export function readCsvContent(data) {
  return request({
    url: `/backend/read/csv?urlStr=${data.urlStr}`,
    method: 'post',
    data
  });
}

// 统计我的数据集
export function getDataSetStatistics() {
  return request({
    url: '/backend/dataset/statistics',
    method: 'get'
  });
}

// 获取我的数据集
export function getDataSetMineList(data) {
  return request({
    url: '/backend/dataset/page',
    method: 'post',
    data
  });
}

// 发布我的数据集
export function applyDataSet(id) {
  return request({
    url: `/backend/dataset/apply/${id}`,
    method: 'post'
  });
}

// 删除我的数据集
export function deleteDataSet(id) {
  return request({
    url: `/backend/dataset/${id}`,
    method: 'delete'
  });
}

// 创建我的数据集
export function createDataSet(data) {
  return request({
    url: '/backend/dataset/create',
    method: 'post',
    data
  });
}

// 更新我的数据集
export function updateDataSet(data) {
  return request({
    url: '/backend/dataset/update',
    method: 'post',
    data
  });
}

// 获取数据集编辑详情数据
export function getDataSetEditDetail(id) {
  return request({
    url: `/backend/dataset/${id}`,
    method: 'get'
  });
}

// 统计平台数据集
export function getPlatStatistics(userId) {
  return request({
    url: `/backend/dataset/plat/statistics/${userId}`,
    method: 'get'
  });
}

// 获取平台数据集
export function getDataSetPlatList(data) {
  return request({
    url: '/backend/dataset/plat/page',
    method: 'post',
    data
  });
}

// 获取平台数据集详情列表
export function getDataSetPlatDetail(id) {
  return request({
    url: `/backend/dataset/plat/info/${id}`,
    method: 'get'
  });
}

// 获取平台数据集详情列表
export function getDataSetPlatTaskList(data) {
  return request({
    url: '/backend/dataset/plat/tasks',
    method: 'post',
    data
  });
}

// 获取平台数据集详情列表标注详情
export function getDataSetPlatTaskDetail(data) {
  return request({
    url: '/backend/dataset/task/detail',
    method: 'post',
    data
  });
}

// 获取token
export function getLabelStudioToken() {
  return request({
    url: '/backend/dataset/getToken',
    method: 'post'
  });
}

// 判断是否存在过fork
export function checkVerify(data) {
  return request({
    url: '/backend/dataset/verify',
    method: 'post',
    data
  });
}

// fork功能
export function forkDataSet(data) {
  return request({
    url: '/backend/dataset/fork',
    method: 'post',
    data
  });
}
