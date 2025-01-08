/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-06-25 17:33:37
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-05 15:53:29
 * @FilePath: \industrial-economic-platform\src\api\industry-map.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

export const chainApis = {
  // 图谱列表
  getChainList: (params) => request({
    url: '/analysis/industryChain/chainList',
    method: 'get',
    params
  }),
  // 产业链编号查询产业链图谱
  getChainById: (params) => request({
    url: '/analysis/industryChain/getChainById',
    method: 'get',
    params
  }),
  // 产业链编号查询企业列表
  getEnterprisesByChainId: (params) => request({
    url: '/analysis/industryChain/getEnterprisesByChainId',
    method: 'post',
    data: params
  })
};
