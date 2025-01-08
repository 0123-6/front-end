import request from '@/utils/request';

/**
 * @author dym
 * 角色管理列表页，获取列表
 */
export function getRoleManagementList(params) {
  return request({
    url: '/user/sysRole?' + params,
    method: 'get'
  });
}
/**
 * @author dym
 * 获取权限菜单树
 */
export function getRoleManagementTree() {
  return request({
    url: '/user/sysMenu/treeSelect?',
    method: 'get'
  });
}
/**
 * @author dym
 * 获取对应ID的权限树
 */
export function getRoleIdTree(roleId) {
  return request({
    url: `/user/sysMenu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  });
}
/**
 * @author dym
 * 创建一个角色的数据
 */
export function addRoleList(sysRole) {
  return request({
    url: '/user/sysRole',
    method: 'post',
    data: sysRole
  });
}
/**
 * @author dym
 * 更新一个角色的数据
 */
export function updateRoleList(sysRole) {
  return request({
    url: '/user/sysRole',
    method: 'put',
    data: sysRole
  });
}
/**
 * @author dym
 * 创建一个用户的角色表数据
 */
//  export function addRoleTree(unionUserRoleDto) {
//     return request({
//       url: '/user/sysRole/batchUnionUserRole',
//       method: 'post',
//       data:unionUserRoleDto,
//     })
//   }
/**
 * @author dym
 * 创建一个用户的角色表数据
 */
export function getRoleOne(unionUserRoleDto) {
  return request({
    url: '/user/sysRole/batchUnionUserRole',
    method: 'post',
    unionUserRoleDto,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}
/**
 * @author dym
 * 删除一个角色
 */
export function deleteRoleOne(roleId) {
  return request({
    url: '/user/sysRole?roleId=' + roleId,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

export class addRoleTree {
}
