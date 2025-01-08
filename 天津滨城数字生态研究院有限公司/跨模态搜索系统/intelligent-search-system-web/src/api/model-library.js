import request from '@/utils/request';

/**
 *
 * @param params
 * @returns {*}
 * @author chen song
 */
export function getModelListData(params) {
  return request({
    url: '/model/getModelList',
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
export function getModelDetailData(params) {
  return request({
    url: `/model/getModelDetail/${params.modelId}`,
    method: 'post'
  });
}
