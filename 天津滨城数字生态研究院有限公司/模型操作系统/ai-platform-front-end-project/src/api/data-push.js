import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getDataPushList(params) {
  return request({
    url: '/backend/dataset/line/page',
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
export function getDataPushStatistics(params) {
  return request({
    url: '/backend/dataset/line/statistics',
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
export function batchDelete(params) {
  return request({
    url: '/backend/dataset/line/delete/batch',
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
export function batchOnline(params) {
  return request({
    url: '/backend/dataset/line/online/batch',
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
export function batchOffline(params) {
  return request({
    url: '/backend/dataset/line/offline/batch',
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
export function dataSetOffline(params) {
  return request({
    url: '/backend/dataset/line/offline',
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
export function dataSetOnline(params) {
  return request({
    url: '/backend/dataset/line/online',
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
export function dataSetDelete(id) {
  return request({
    url: `/backend/dataset/line/${id}`,
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
export function dataSetUpdate(params) {
  return request({
    url: `/backend/dataset/line/update`,
    method: 'post',
    data: params
  });
}
