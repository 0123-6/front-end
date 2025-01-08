/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2022-06-01 11:03:00
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2022-09-09 10:40:01
 * @FilePath: \ai-platform-front-end-project\src\api\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request({
    url: '/user/getInfo',
    method: 'get',
    params: { token }
  });
}
export function getMenu(token) {
  return request({
    url: '/user/getRouters',
    method: 'get',
    params: { token }
  });
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}

export function getProfile() {
  return request({
    url: '/user/sysUser/profile',
    method: 'get'
  });
}

export function putProfile(data) {
  return request({
    url: '/user/sysUser',
    method: 'put',
    data
  });
}

export function updatePw(data) {
  return request({
    url: '/user/sysUser/profile/updatePwd',
    method: 'put',
    data
  });
}

export function getExternalLink(data) {
  return request({
    url: '/user/sysConfig/external_link',
    method: 'get',
    data
  });
}

/**
 * @author 韩佩江
 * 获取用户列表
 */
export function getUserList(params) {
  return request({
    url: '/user/sysUser?' + params,
    method: 'get',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * @author hpj
 * 通过id查询用户
 */
export function getUserById(params) {
  return request({
    url: '/user/sysUser/' + params.userId,
    method: 'get',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * 获取用户信息
 * @author hpj
 */
export function getUserById2(params) {
  return request({
    url: '/user/sysUser/profile',
    method: 'get'
  });
}

/**
 * 修改用户信息
 * @author hpj
 */
export function updateUserInfo(data) {
  return request({
    url: '/user/sysUser/profile',
    method: 'put',
    data
  });
}

/**
 * 头像上传
 * @author hpj
 */
export function uploadAvatar(data) {
  return request({
    url: '/user/sysUser/profile/avatar',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

/**
 * 修改密码
 * @author hpj
 */
export function updateUserPassword(params) {
  return request({
    url: '/sysUser/profile/updatePwd?' + params,
    method: 'put'
  });
}

/**
 * 用户角色统计接口
 * @author hpj
 */
export function userRoleNumList(params) {
  return request({
    url: '/user/sysUser/statisticsRole',
    method: 'post'
    // headers:{'Content-Type':'application/x-www-form-urlencoded'},
  });
}

/**
 * 获取角色列表
 * @author hpj
 */
export function getRoleList() {
  return request({
    url: '/user/sysRole/list',
    method: 'get'
  });
}

/**
 * @author hpj
 * 新增用户
 */
export function createUser(data) {
  return request({
    url: '/user/sysUser',
    method: 'post',
    data
  });
}

/**
 * 批量新增用户
 * @author hpj
 */
export function batchCreateUser(data) {
  return request({
    url: '/user/sysUser/batchAddUser',
    method: 'post',
    data
  });
}

/**
 * 生成随机可用账号
 * @author hpj
 */
export function getUsername(params) {
  return request({
    url: '/user/sysUser/generateUserName?' + params,
    method: 'get'
  });
}

/**
 * @author hpj
 * 通过主键删除数据
 */
export function deleteUser(params) {
  return request({
    url: '/user/sysUser?' + params,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

/**
 * @author hpj
 * 批量设置账号开始时间结束时间
 */
export function batchSetUserTime(data) {
  return request({
    url: '/user/sysUser/limit',
    method: 'post',
    data
  });
}

/**
 * @author hpj
 * 重置密码
 */
export function resetPassword(params) {
  return request({
    url: '/user/sysUser/resetPassword?' + params,
    method: 'post'
  });
}

/**
 * @author hpj
 * 用户角色统计
 */
export function getUserRoleList() {
  return request({
    url: '/user/sysUser/statisticsRole',
    method: 'post'
  });
}

/**
 * @author hpj
 * 数据集和模型，取消授权
 */
export function cancelAuthorize(id) {
  return request({
    url: '/backend/data/permission/cancel/' + id,
    method: 'post'
  });
}

/**
 * @author hpj
 * 批量操作模型授权和取消授权
 */
export function batchModelAuthorize(data) {
  return request({
    url: '/backend/data/permission/model/batch',
    method: 'post',
    data
  });
}

/**
 * @author hpj
 * 批量操作数据集授权
 */
export function batchDataSetAuthorize(data) {
  return request({
    url: '/backend/data/permission/dataset/batch',
    method: 'post',
    data
  });
}

/**
 * @author hpj
 * 获取用户全部模型列表
 */
export function getModelListAll(params) {
  return request({
    url: '',
    method: 'post',
    data: params
  });
}

/**
 * 为用户单个模型续期
 * @author hpj
 */
export function modelRenew(data) {
  return request({
    url: '/backend/data/permission/model/renewal',
    method: 'post',
    data
  });
}

export function sendEmailCode(data) {
  return request({
    url: '/user/code/email',
    method: 'post',
    data
  });
}

export function sendPhoneCode(data) {
  return request({
    url: '/user/code/phone',
    method: 'post',
    data
  });
}

export function forgetPwdEmail(data) {
  return request({
    url: '/user/forgetPwd/email',
    method: 'post',
    data
  });
}

export function forgetPwdPhone(data) {
  return request({
    url: '/user/forgetPwd/phone',
    method: 'post',
    data
  });
}

export function userValid(data) {
  return request({
    url: '/user/forgetPwd/valid',
    method: 'post',
    data
  });
}

export function permissionDatasetList(data) {
  return request({
    url: '/backend/dataset/role/permission',
    method: 'post',
    data
  });
}

export function permissionModelList(data) {
  return request({
    url: '/backend/model/role/permission',
    method: 'post',
    data
  });
}

//根据用户用户id获取notebook资源配置明细
export function getNotebookConfByUserId(data){
  return request({
    url:'/backend/notebook-resources?' + data,
    method:'get',
  })
}

//改变用户notebook配置
export function changeNotebookConf(data){
  return request({
    url:'/backend/notebook-resources',
    method:'post',
    data,
  })
}
