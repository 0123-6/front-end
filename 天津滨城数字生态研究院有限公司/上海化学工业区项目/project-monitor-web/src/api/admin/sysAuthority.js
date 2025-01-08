import request from '@/utils/request'

// 权限全量信息查询
export function sysAuthority_getAll(params) {
  return request({
    url: '/admin/sysAuthority/getAll',
    method: 'get',
    params
  })
}