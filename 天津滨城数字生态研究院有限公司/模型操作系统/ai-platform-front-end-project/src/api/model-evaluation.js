import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getTaskList(params) {
  return request({
    url: '/backend/modelEvaluationJob/page',
    method: 'post',
    data: params
  });
}

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function stopTaskEvaluation(params) {
  return request({
    url: '/backend/modelEvaluationJob/stopEvaluationJob',
    method: 'post',
    data: params
  });
}

export function deleteTaskEvaluation(params) {
  return request({
    url: `/backend/modelEvaluationJob/${params.id}`,
    method: 'delete'
  });
}

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getModelEvaluationData(params) {
  return request({
    url: `/backend/model/evaluationjob/result/getByEvaluationId/${params.id}`,
    method: 'get'
  });
}

/**
 *
 * @returns {*}
 * @author chen song
 * @param id
 */
export function getModelEvaluationInfo(id) {
  return request({
    url: `/backend/model/info/${id}`,
    method: 'get'
  });
}

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function createTask(params) {
  return request({
    url: '/backend/modelEvaluationJob/save',
    method: 'post',
    data: params
  });
}

/**
 *
 * @param id
 * @returns {*}
 * @author chen song
 */
// 结果对比-数据集
export function getTaskEvaluationResult(id) {
  return request({
    url: `/backend/data/set/info/${id}`,
    method: 'get'
  });
}

export function downloadConfusionMatrix(params) {
  return request({
    url: '/backend/model/evaluationjob/result/download',
    method: 'post',
    data: params
  });
}
