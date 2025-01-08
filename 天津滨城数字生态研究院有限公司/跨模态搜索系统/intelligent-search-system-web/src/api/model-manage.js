/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-21 09:47:29
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-21 14:23:31
 * @FilePath: \intelligent-search-system-web\src\api\model-manager.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

// 模型列表
export function getModelListData(params) {
  return request({
    url: '/model/modelManage',
    method: 'post',
    data: params
  });
}

// 应用弹框列表
export function getDialogDeviceListData(params) {
  return request({
    url: '/device/page',
    method: 'post',
    data: params
  });
}

// 新增关联
export function addModelDevice(params) {
  return request({
    url: '/modelDevice/add',
    method: 'post',
    data: params
  });
}

// 取消关联
export function cancelModelDevice(params) {
  return request({
    url: '/modelDevice/cancel',
    method: 'post',
    data: params
  });
}
