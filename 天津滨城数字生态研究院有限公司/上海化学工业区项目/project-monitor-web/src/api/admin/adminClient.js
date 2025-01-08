import request from '@/utils/request'

// queryHomePageShowListByUserId
export function adminClient_homePageShow_listByUserId(params) {
  return request({
    url: '/admin/adminClient/homePageShow/listByUserId',
    method: 'get',
    params
  })
}

// queryByDeptId
export function adminClient_sysDepartment_queryByDeptId(params) {
  return request({
    url: '/admin/adminClient/sysDepartment/queryByDeptId',
    method: 'get',
    params
  })
}

// queryDepartmentByIds
export function adminClient_sysDepartment_queryDepartmentByIds(params) {
  return request({
    url: '/admin/adminClient/sysDepartment/queryDepartmentByIds',
    method: 'get',
    params
  })
}

// queryById
export function adminClient_sysUser_queryById(params) {
  return request({
    url: '/admin/adminClient/sysUser/queryById',
    method: 'get',
    params
  })
}