import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getDataCheckList(params) {
  return request({
    url: '/backend/dataset/check/page',
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
export function getDataCheckStatistics(params) {
  return request({
    url: '/backend/dataset/check/statistics',
    method: 'get',
    data: params
  });
}
/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function batchReject(params) {
  return request({
    url: '/backend/dataset/check/reject/batch',
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
export function batchPass(params) {
  return request({
    url: '/backend/dataset/check/pass/batch',
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
export function batchDelete(params) {
  return request({
    url: '/backend/dataset/check/delete/batch',
    method: 'post',
    data: params
  });
}
/**
 *
 * @returns {*}
 * @author chen song
 * @param id
 */
export function dataCheckDelete(id) {
  return request({
    url: `/backend/dataset/check/${id}`,
    method: 'delete',
    data: id
  });
}

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function dataCheckPass(params) {
  return request({
    url: '/backend/dataset/check/pass',
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
export function dataCheckReject(params) {
  return request({
    url: '/backend/dataset/check/reject',
    method: 'post',
    data: params
  });
}

/**
 *
 * @returns {*}
 * @author chen song
 * @param id
 */
export function dataCheckInfo(id) {
  return request({
    url: `/backend/dataset/check/info/${id}`,
    method: 'get'
  });
}

