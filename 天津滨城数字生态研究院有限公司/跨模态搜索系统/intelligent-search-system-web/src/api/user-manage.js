/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-11-21 18:01:22
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-11-22 15:54:18
 * @FilePath: \intelligent-search-system-web\src\api\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

// 模型列表
export function getUserListData(params) {
  return request({
    url: '/user/page',
    method: 'post',
    data: params
  });
}

// 新增用户
export function addUser(params) {
  return request({
    url: '/user',
    method: 'post',
    data: params
  });
}

// 生成随机账号
export function generateUserName() {
  return request({
    url: '/user/generateUserName',
    method: 'get'
  });
}

// 删除用户
export function deleteUser(params) {
  return request({
    url: `/user/delete/${params.id}`,
    method: 'post'
  });
}

// 用户详情
export function getUserDetail(params) {
  return request({
    url: `/user/get/${params.id}`,
    method: 'post'
  });
}

// 用户详情
export function updateUser(params) {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  });
}

// 修改密码
export function modifyPassword(params) {
  return request({
    url: '/user/updatePwd',
    method: 'put',
    data: params
  });
}
