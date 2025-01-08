/* @flow */

import type VueRouter from '../index'
// 从query.js导入stringifyQuery函数
import { stringifyQuery } from './query'
// 匹配字符串中结尾可能包含的可选斜杠 /
const trailingSlashRE = /\/?$/

// 创建路由对象Route的工厂函数
export function createRoute (
  record: ?RouteRecord,// 匹配到的路由记录
  location: Location,// 路由的位置信息
  redirectedFrom?: ?Location,// 可选的重定向来源位置
): Route {
  // 复制查询对象，防止对原查询进行更改
  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  // 定义一个路由对象，居然是这样定义的，而不是使用new
  const route: Route = {
    // 路由的名称
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    // 路由的pathname
    path: location.path || '/',
    // 路由的hash
    hash: location.hash || '',
    // 路由的查询参数
    query,
    // 路由的匹配的动态片段和全匹配片段
    params: location.params || {},
    // 全path
    fullPath: getFullPath(location),
    // 匹配的路由
    matched: record ? formatMatch(record) : []
  }
  // 如果存在重定向
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom)
  }
  return Object.freeze(route)
}

/**
 * 自定义复制函数
 * @param value
 * @return {{}|*}
 */
function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    const res = {}
    for (const key in value) {
      res[key] = clone(value[key])
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
// c初始路由，表示默认状态
export const START = createRoute(null, {
  path: '/'
})

function formatMatch (record: ?RouteRecord): Array<RouteRecord> {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}

/**
 * 获取全路径
 * @param path
 * @param query
 * @param hash
 * @return {string}
 */
function getFullPath (
  { path, query = {}, hash = '' },
): string {
  return (path || '/') + stringifyQuery(query) + hash
}

export function isSameRoute (a: Route, b: ?Route, onlyPath: ?boolean): boolean {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') && (onlyPath ||
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query))
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      (onlyPath || (
        a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params))
      )
    )
  } else {
    return false
  }
}

function isObjectEqual (a = {}, b = {}): boolean {
  // handle null value #1566
  if (!a || !b) return a === b
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every((key, i) => {
    const aVal = a[key]
    const bKey = bKeys[i]
    if (bKey !== key) return false
    const bVal = b[key]
    // query values can be null and undefined
    if (aVal == null || bVal == null) return aVal === bVal
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

export function isIncludedRoute (current: Route, target: Route): boolean {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current: Dictionary<string>, target: Dictionary<string>): boolean {
  for (const key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

export function handleRouteEntered (route: Route) {
  for (let i = 0; i < route.matched.length; i++) {
    const record = route.matched[i]
    
    const instance = record.instance
    const cbs = record.enteredCb
    if (!instance || !cbs) continue
    delete record.enteredCb
    for (let i = 0; i < cbs.length; i++) {
      if (!instance._isBeingDestroyed) cbs[i](instance)
    }
  }
}
