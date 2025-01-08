import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getDeviceListData(params) {
  return request({
    url: '/device/page',
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
export function addDevice(params) {
  return request({
    url: '/device/add',
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
export function editDevice(params) {
  return request({
    url: '/device/update',
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
export function deleteDevice(params) {
  return request({
    url: '/device/delete',
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
export function getModelListData(params) {
  return request({
    url: '/model/modelManage',
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
export function addModelDevice(params) {
  return request({
    url: '/modelDevice/add',
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
export function cancelModelDevice(params) {
  return request({
    url: '/modelDevice/cancel',
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
export function getDeviceInfo(params) {
  return request({
    url: `/device/get/${params.id}`,
    method: 'post'
  });
}

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getDeviceStream(params) {
  return request({
    url: `/device/preview/${params.monitorPointId}`,
    method: 'post'
  });
}
