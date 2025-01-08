/*
 * @Author: srcheng 17755456856@163.com
 * @Date: 2023-07-19 17:53:18
 * @LastEditors: srcheng 17755456856@163.com
 * @LastEditTime: 2023-07-20 15:30:20
 * @FilePath: \industrial-economic-platform\src\api\user-manager.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';

export const roleApis = {
  // 表格
  roleTable: (params) => request({
    url: '/user/role/page',
    method: 'get',
    params
  }),
  allRoleTable: (params) => request({
    url: '/user/role/list',
    method: 'get'
  }),
  // 详情
  roleDetail: (params) => request({
    url: '/user/role',
    method: 'get',
    params
  }),
  // 创建
  createRole: (data) => request({
    url: '/user/role',
    method: 'post',
    data
  }),
  // 编辑
  editRole: (data) => request({
    url: '/user/role',
    method: 'put',
    data
  }),
  // 删除
  deleteRole: (data) => request({
    url: '/user/role',
    method: 'delete',
    data
  }),
  // 获取菜单地区权限树
  getAreaTree: (params) => request({
    url: '/user/role/region/tree',
    method: 'get',
    params
  }),
  // 修改角色权限
  editRolePermission: (data) => request({
    url: '/user/role/update_permission',
    method: 'put',
    data
  }),
  // 获取角色权限
  getRolePermissionData: (params) => request({
    url: '/user/menu/meta/role',
    method: 'get',
    params
  }),
  // 地图全量地区数据
  getAllRegionsData: (params) => request({
    url: '/user/regin/tree',
    method: 'get',
    params
  })
};
