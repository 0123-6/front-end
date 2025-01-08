/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-07-19 17:53:18
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-20 11:36:46
 * @FilePath: \industrial-economic-platform\src\api\user-manager.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

export const userApis = {
  // 表格
  userTable: (params) => request({
    url: '/user/user/page',
    method: 'get',
    params
  }),
  // 详情
  userDetail: (params) => request({
    url: '/user/user',
    method: 'get',
    params
  }),
  // 创建
  createUser: (data) => request({
    url: '/user/user',
    method: 'post',
    data
  }),
  // 编辑
  editUser: (data) => request({
    url: '/user/user',
    method: 'put',
    data
  }),
  // 删除
  deleteUser: (data) => request({
    url: '/user/user',
    method: 'delete',
    data
  }),
  // 停用
  banUser: (data) => request({
    url: '/user/user/ban',
    method: 'put',
    data
  }),
  // 启用
  activeUser: (data) => request({
    url: '/user/user/active',
    method: 'put',
    data
  })
};
