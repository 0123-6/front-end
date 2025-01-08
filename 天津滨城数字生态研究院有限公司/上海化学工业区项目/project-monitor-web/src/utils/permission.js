import useUserStore from '@/store/modules/user'

/**
 * 字符权限校验
 * @param {Array|String} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
  const permissions = useUserStore().permissions
  if (typeof value == 'string') {
    return permissions.indexOf(value) > -1
  } else if (value instanceof Array) {
    return permissions.filter(n => {
      return value.indexOf(n) > -1
    }).length == value.length
  } else {
    return false
  }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useUserStore().roles
    const permissionRoles = value
    const super_admin = "admin";

    const hasRole = roles.some(role => {
      return super_admin === role || permissionRoles.includes(role)
    })

    if (!hasRole) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`)
    return false
  }
}