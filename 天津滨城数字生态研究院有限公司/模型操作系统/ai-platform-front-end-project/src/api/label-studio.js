/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-10-24 19:11:19
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-07 09:00:08
 * @FilePath: \ai-platform-front-end-project\src\api\label-studio.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/lsRequest';

// 上传文件
export function importFile(data, id) {
  const contentType = data instanceof FormData
    ? 'multipart/form-data' // usual multipart for usual files
    : 'application/x-www-form-urlencoded';
  return request({
    url: `/lsApi/projects/${id}/import?commit_to_project=false`,
    method: 'post',
    data,
    headers: { 'Content-Type': contentType }
  });
}

// 获取上传展示的文件列表
export function getUploadFileList(params, id) {
  return request({
    url: `/lsApi/projects/${id}/file-uploads`,
    method: 'get',
    params
  });
}

// 导入文件到ls
export function reimportFile(data, id) {
  return request({
    url: `/lsApi/projects/${id}/reimport`,
    method: 'post',
    data
  });
}

// 删除上传展示的文件列表
export function deleteUploadFileList(data, id) {
  return request({
    url: `/lsApi/projects/${id}/file-uploads`,
    method: 'delete',
    data
  });
}

// 获取标签集导入的分类和格式化信息配置
export function getLabelDatasetConfig() {
  return request({
    url: `/lsApi/aipark/import/label_dataset/config`,
    method: 'get'
  });
}

// 获取标签集导入的分类和格式化信息配置
export function getLabelDatasetFormateConfig() {
  return request({
    url: `/lsApi/templates/formate_config`,
    method: 'get'
  });
}

// 获取标签集详情
export function getLabelDatasetDetail(id) {
  return request({
    url: `/lsApi/dm/project?project=${id}`,
    method: 'get'
  });
}

// 选择平台数据集导入
export function importFromDataset(from_project_id, id, data) {
  return request({
    url: `/lsApi/aipark/${id}/import/from/${from_project_id}`,
    method: 'post',
    data
  });
}

// 导入文件到ls-有标签
export function submitFile(data, id) {
  return request({
    url: `/lsApi/aipark/${id}/submit/upload/label_dataset`,
    method: 'post',
    data
  });
}

// 导入成功后已经通知用户后修改导入状态
export function changeImportHistory(project_id, import_history_id) {
  return request({
    url: `/lsApi/projects/${project_id}/import-history/${import_history_id}/status`,
    method: 'post'
  });
}
