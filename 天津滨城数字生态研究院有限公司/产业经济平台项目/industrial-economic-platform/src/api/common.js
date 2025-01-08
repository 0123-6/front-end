/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-06-12 14:12:54
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-19 14:15:06
 * @FilePath: \industrial-economic-platform\src\api\common.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';
import adminRequest from '@/utils/admin-request';

export const commonApis = {
  // 登出
  logout: () => request({
    url: '/user/logout',
    method: 'delete'
  }),
  // 登录
  login: (data) => request({
    url: '/user/login',
    method: 'post',
    data
  }),
  // 注册
  register: (data) => request({
    url: '/user/register',
    method: 'post',
  }),
  // 获取用户信息
  getUserInfo: () => request({
    url: '/user/info',
    method: 'get'
  }),
  // 获取所属机构
  getOrgInfo: () => request({
    url: '/user/user/org',
    method: 'get'
  }),
  // 获取路由信息
  getRouters: () => request({
    url: '/user/menu/checkedMenu',
    method: 'get'
  }),
  // 修改密码
  changePassword: (data) => request({
    url: '/sysUser/updatePwd',
    method: 'post',
    data
  }),
  uploadFile: (data) => request({
    url: '/admin/file/upload',
    method: 'post',
    data
  }),
  saveAdminUserInfo: (data) => adminRequest({
    url: '/tenant/updateTenantLogo',
    method: 'post',
    data
  }),
  // 获取菜单元数据
  getMenuMeta: (params) => request({
    url: '/user/menu/meta/role',
    method: 'get',
    params
  }),

  // 获取菜单数据范围
  getMenuDataScopeData: (params) => request({
    url: '/user/role/all/region/tree',
    method: 'get',
    params
  }),

  // 获取地区字典
  getRegionAll: (params) => request({
    url: '/user/regin/tree',
    method: 'get',
    params
  }),

  // 获取全量字典
  getDictAll: (params) => request({
    url: '/analysis/dict/all',
    method: 'get',
    params
  }),

  addUsers: (params) => adminRequest({
    url: '/tenant/addUsers',
    method: 'post',
    data: params
  })
};
