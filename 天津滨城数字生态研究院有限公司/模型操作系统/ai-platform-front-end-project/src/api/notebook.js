/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-09-07 13:58:43
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-07 14:59:13
 * @FilePath: \ai-platform-front-end-project\src\api\notebook.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

/**
 * 获取namespace
 */
export function getNamespaceList() {
  return request({
    url: '/backend/kubeflow/workgroup/env-info',
    method: 'post'
  });
}

/**
 * notebook列表页，获取列表
 */
export function getNoteBookList(params) {
  return request({
    url: `/backend/notebook/${params.namespace}/list`,
    method: 'get',
    params
  });
}

/**
 * notebook删除接口
 */
export function deleteNotebook(params) {
  return request({
    url: `/backend/notebook/${params.namespace}/${params.name}`,
    method: 'delete'
  });
}

/**
 * 获取notebook创建页面默认配置
 */
export function getCreateNotebookConfig() {
  return request({
    url: '/backend/jupyter/api/config',
    method: 'get'
  });
}

export function getAllNoteBookNameList(namespace) {
  return request({
    url: `/notebook/${namespace}/list/names`,
    method: 'get'
  });
}

/**
 * notebook创建接口
 */
export function createNotebook(namespace, data) {
  return request({
    url: `/backend/notebook/${namespace}`,
    method: 'post',
    data: data
  });
}

/**
 * 获取 authserviceSession
 */
export function getAuthserviceSession() {
  return request({
    url: '/backend/kubeflow/authservice-session',
    method: 'get'
  });
}

/**
 * notebook上下线
 */
export function setNotebookStatus(params, data) {
  return request({
    url: `/backend/notebook/${params.namespace}/${params.name}`,
    method: 'patch',
    data: data
  });
}

/**
 * 获取oldc
 */
export function getOidcUrl() {
  return request({
    url: '/backend/kubeflow/oidcUrl',
    method: 'get'
  });
}

