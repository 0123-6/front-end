import request from '@/utils/request'

// 知识库-批量删除
export function knowledgeBase_deleteBatch(params) {
  return request({
    url: '/repository/knowledgeBase/deleteBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 知识库-编辑pdf文件
export function knowledgeBase_editKnowledgeFile(params) {
  return request({
    url: '/repository/knowledgeBase/editKnowledgeFile',
    method: 'post',
    data: params
  })
}

// 知识库-批量失效
export function knowledgeBase_invalidateBatch(params) {
  return request({
    url: '/repository/knowledgeBase/invalidateBatch' + `?ids=${params.ids}`,
    method: 'post',
    data: params
  })
}

// 知识库-分页列表查询
export function knowledgeBase_list(params) {
  return request({
    url: '/repository/knowledgeBase/list',
    method: 'post',
    data: params
  })
}

// 上传文件通用
export function knowledgeBase_uploadFile(params) {
  return request({
    url: '/repository/knowledgeBase/uploadFile' + `?bucketName=${params.bucketName}`,
    method: 'post',
    data: params
  })
}