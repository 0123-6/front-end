/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-09 14:02:39
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-07-15 11:15:23
 * @FilePath: \ai-platform-front-end-project\src\api\model-indicator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';
// 获取评估指标选择项
export function getModelIndicatorList(params) {
  return request({
    url: `/backend/modelIndicator/findByModelTypeId/${params.modelTypeId}`,
    method: 'get',
    params
  });
}
// 获取评估指标选择项
export function getModelPerformanceIndicatorList() {
  return request({
    url: `/backend/aiModelPerformanceIndicator/list`,
    method: 'get'
  });
}

