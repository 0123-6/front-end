import request from '@/utils/request';

/**
 * 上传模型文件信息
 * @param data
 */
export function saveModelFile(data) {
  return request({
    url: '/backend/model/file/save',
    method: 'post',
    data: data
  });
}

/**
 * 上传图片
 * @author 韩佩江
 */
export function uploadImage(data) {
  return request({
    url: '/backend/file',
    method: 'post',
    data: data
  });
}

/**
 * 模型文件列表显示
 * @param data
 */
export function modelFilePage(data) {
  return request({
    url: '/backend/model/file/pageList',
    method: 'post',
    data: data
  });
}

/**
 * 删除模型文件信息
 * @param ids
 */
export function delModelFile(ids) {
  return request({
    url: `/backend/model/file/delete/${ids}`,
    method: 'delete'
  });
}

/**
 * 查看模型文件上传信息
 * @param id
 */
export function modelFileInfo(id) {
  return request({
    url: `/backend/model/file/info/${id}`,
    method: 'get'
  });
}

/**
 * 获取模型场景信息列表
 * hpj已测试
 */
export function modelScenesList() {
  return request({
    url: `/backend/modelScenes/allList`,
    method: 'get'
  });
}

/**
 * 获取模型类型信息列表
 * 韩佩江已测试
 */
export function modelTypeList() {
  return request({
    url: `/backend/modelType/allList`,
    method: 'get'
  });
}

/**
 * 获取模型版本信息列表
 */
export function modelVersionList() {
  return request({
    url: `/backend/modelVersion/allList`,
    method: 'get'
  });
}

/**
 * 创建模型信息
 * @param data
 */
export function createModel(data) {
  return request({
    url: `/backend/model/create`,
    method: 'post',
    data: data
  });
}

/**
 * 修改创建模型信息
 * @param data
 */
export function updateModel(data) {
  return request({
    url: `/backend/model/update`,
    method: 'post',
    data: data
  });
}

/**
 * 我的模型 我的 分页显示
 * @param data
 */
export function mineModelPage(data) {
  return request({
    url: '/backend/model/mine/page',
    method: 'post',
    data: data
  });
}

/**
 * 我的模型 授权 分页展示
 * @author hpj
 */
export function getMineModelAuthorizedModelList(data) {
  return request({
    url: '/backend/model/mine/permission',
    method: 'post',
    data
  });
}

/**
 * 删除我的模型信息
 * @param ids
 */
export function delMyModel(ids) {
  return request({
    url: `/backend/model/delete/${ids}`,
    method: 'delete'
  });
}

/**
 * 预览模型信息
 * @param id
 */
export function previewModel(id) {
  return request({
    url: `/backend/model/details/${id}`,
    method: 'get'
  });
}

/**
 * 上传模型文件信息
 * @param data
 */
export function applyReleaseModel(data) {
  return request({
    url: '/backend/resource/configure/apply',
    method: 'post',
    data: data
  });
}

/**
 * 获取场景类别列表
 * 韩佩江已测试
 * @author 韩佩江
 */
export function getSceneCategory() {
  return request({
    url: '/backend/modelScenes/allList',
    method: 'get'
  });
}

/**
 * 获取模型分类列表
 * 韩佩江已测试
 * @author 韩佩江
 */
export function getModelClassification() {
  return request({
    url: '/backend/modelType/allList',
    method: 'get'
  });
}

/**
 * 获取模型库列表
 * @author 韩佩江
 */
export function getModelBase(params) {
  return request({
    url: '/backend/model/repository/page',
    method: 'post',
    data: params
  });
}

/**
 * 模型管理页面，上线管理，获取模型列表
 * @author 韩佩江
 */
export function getModelList(params) {
  return request({
    url: '/backend/model/onlineSelectPage',
    method: 'post',
    data: params
  });
}
/**
 * 模型管理页面，上线管理，获取模型列表
 * @author 韩佩江
 */
export function getModelListV2(params) {
  return request({
    url: '/backend/model/page-v2',
    method: 'post',
    data: params
  });
}

/**
 * 根据id获取模型详情
 * @author 韩佩江
 */
export function getModelById(params) {
  return request({
    url: '',
    method: 'post',
    data: params
  });
}

/**
 * 模型管理，批量驳回
 * @author 韩佩江
 */
export function batchRejection(params) {
  return request({
    url: '/backend/model/update/reject/batch',
    method: 'post',
    data: params
  });
}

/**
 * 模型管理，批量上线
 * @author 韩佩江
 */
export function batchPushing(params) {
  return request({
    url: '/backend/model/update/online/batch',
    method: 'post',
    data: params
  });
}

/**
 * 模型管理，批量下线
 * @author 韩佩江
 */
export function batchLeaving(params) {
  return request({
    url: '/backend/model/update/offline/batch',
    method: 'post',
    data: params
  });
}

/**
 * 模型状态统计
 * @author 韩佩江
 */
export function getModelStatusStatistics() {
  return request({
    url: '/backend/model/statistics',
    method: 'get'
  });
}

/**
 * 模型管理，初审通过
 * @author 韩佩江
 */
export function firstJudgeOk(params) {
  return request({
    url: '/backend/model/firstJudgeOk',
    method: 'post',
    data: params
  });
}

/**
 * 初审驳回
 * @author 韩佩江
 */
export function firstJudgeReject(params) {
  return request({
    url: '/backend/model/firstJudgeReject',
    method: 'post',
    data: params
  });
}

/**
 * 终审通过
 * @author 韩佩江
 */
export function finalJudgeOk(params) {
  return request({
    url: '/backend/model/finalJudgeOk',
    method: 'post',
    data: params
  });
}

/**
 * 终审驳回
 * @author 韩佩江
 */
export function finalJudgeReject(params) {
  return request({
    url: '/backend/model/finalJudgeReject',
    method: 'post',
    data: params
  });
}

/**
 * 模型上线
 * @author 韩佩江
 */
export function modelLaunch(params) {
  return request({
    url: '/backend/model/update/online',
    method: 'post',
    data: params
  });
}

/**
 * 模型体验
 * @author 韩佩江
 */
export function modelExperience(modelId) {
  return request({
    url: `/backend/modelDataSet/result/${modelId}`,
    method: 'get'
  });
}

/**
 * 模型体验v2
 * @author 韩佩江
 */
export function modelExperienceV2(modelId) {
  return request({
    url: `/backend/modelDataSet/result/${modelId}`,
    method: 'get'
  });
}

/**
 * 模型下线
 * @author 韩佩江
 */
export function modelOffline(params) {
  return request({
    url: '/backend/model/update/offline',
    method: 'post',
    data: params
  });
}

export function cancelDataSet(modelId) {
  return request({
    url: `/backend/modelDataSet/cancel/${modelId}`,
    method: 'get'
  });
}

/**
 * 模型详情（zip代码）
 */
export function modelInfoWithCode(params) {
  return request({
    url: '/backend/model/preview',
    method: 'post',
    data: params
  });
}

/**
 * 模型校验，创建校验
 */
export function createModelValidation(data) {
  return request({
    url: '/backend/model/validation/validation',
    method: 'post',
    data
  });
}

/**
 * 模型校验，校验详情
 */
export function getModelValidationDetail(modelId) {
  return request({
    url: `/backend/model/validation/result/${modelId}`,
    method: 'get'
  });
}

/**
 * @author hpj
 * 获取模型库状态列表
 */
export function getStatusList(userId) {
  return request({
    url: `/backend/model/resp/statistics/${userId}`,
    method: 'get'
  });
}

export function getDataSetList(data) {
  return request({
    url: `/backend/modelTypeDataSetType/dataSetPage`,
    method: 'post',
    data: data
  });
}

export function getSelectedDataSet(modelId) {
  return request({
    url: `/backend/modelDataSet/dataSet/${modelId}`,
    method: 'get'
  });
}

export function dataSetPredict(data) {
  return request({
    url: `/backend/model/v2/experience`,
    method: 'post',
    data: data
  });
}

export function unionDataSet(data) {
  return request({
    url: `/backend/modelDataSet/add`,
    method: 'post',
    data: data
  });
}

export function getDataSetPredict(data) {
  return request({
    url: `/backend/modelDataSet/cache/result/${data.modelId}/${data.datasetId}`,
    method: 'get'
  });
}

