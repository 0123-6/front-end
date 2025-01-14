/* @flow */

// 引用VueRouter类型
import type VueRouter from './index'
// 用于解析路径的工具函数
import { resolvePath } from './util/path'
import { assert, warn } from './util/warn'
// 创建路由的函数
import { createRoute } from './util/route'
// 用于填充路径参数
import { fillParams } from './util/params'
// 创建路由映射
import { createRouteMap } from './create-route-map'
// 标准化位置
import { normalizeLocation } from './util/location'
// 用于解码查询参数
import { decode } from './util/query'

// Matcher接口定义
export type Matcher = {
  // 获取匹配路由，只能获取1个路由？
  match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route;
  // 添加一组路由
  addRoutes: (routes: Array<RouteConfig>) => void;
  // 添加单个路由
  addRoute: (parentNameOrRoute: string | RouteConfig, route?: RouteConfig) => void;
  // 获取所有路由记录
  getRoutes: () => Array<RouteRecord>;
};

// 创建匹配器
export function createMatcher (
  routes: Array<RouteConfig>,// 路由配置数组
  router: VueRouter// Vue Router实例
): Matcher {
  // 创建路由映射，包括路径列表，路径映射和名称映射
  const { pathList, pathMap, nameMap } = createRouteMap(routes)

  // 添加一组新路由到路由映射中
  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }

  // 添加单个路由
  function addRoute (parentOrRoute, route) {
    const parent = (typeof parentOrRoute !== 'object') ? nameMap[parentOrRoute] : undefined
    // $flow-disable-line
    createRouteMap([route || parentOrRoute], pathList, pathMap, nameMap, parent)
  }

  // 获取所有路由记录
  function getRoutes () {
    return pathList.map(path => pathMap[path])
  }
  
  // 匹配路由
  function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
    const location = normalizeLocation(raw, currentRoute, false, router)
    // 获取名称
    const { name } = location

    if (name) {
      const record = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
      if (!record) return _createRoute(null, location)
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }

      location.path = fillParams(record.path, location.params, `named route "${name}"`)
      return _createRoute(record, location, redirectedFrom)
    } else if (location.path) {
      location.params = {}
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record: RouteRecord,
    location: Location
  ): Route {
    const originalRedirect = record.redirect
    let redirect = typeof originalRedirect === 'function'
      ? originalRedirect(createRoute(record, location, null))
      : originalRedirect

    if (typeof redirect === 'string') {
      redirect = { path: redirect }
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, `invalid redirect option: ${JSON.stringify(redirect)}`
        )
      }
      return _createRoute(null, location)
    }

    const re: Object = redirect
    const { name, path } = re
    let { query, hash, params } = location
    query = re.hasOwnProperty('query') ? re.query : query
    hash = re.hasOwnProperty('hash') ? re.hash : hash
    params = re.hasOwnProperty('params') ? re.params : params

    if (name) {
      // resolved named direct
      const targetRecord = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, `redirect failed: named route "${name}" not found.`)
      }
      return match({
        _normalized: true,
        name,
        query,
        hash,
        params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      const rawPath = resolveRecordPath(path, record)
      // 2. resolve params
      const resolvedPath = fillParams(rawPath, params, `redirect route with path "${rawPath}"`)
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query,
        hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, `invalid redirect option: ${JSON.stringify(redirect)}`)
      }
      return _createRoute(null, location)
    }
  }

  // 创建一个路由对象
  function _createRoute (
    record: ?RouteRecord,
    location: Location,
    redirectedFrom?: Location
  ): Route {
    // 如果路由记录需要重定向，则重定向
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    
    return createRoute(record, location, redirectedFrom)
  }

  return {
    match,
    addRoute,
    getRoutes,
    addRoutes
  }
}

// 判断path和regex是否匹配
function matchRoute (
  regex: RouteRegExp,
  path: string,
  params: Object
): boolean {
  const m = path.match(regex)

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  // 匹配成功，给传入的params赋值
  for (let i = 1, len = m.length; i < len; ++i) {
    const key = regex.keys[i - 1]
    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = typeof m[i] === 'string' ? decode(m[i]) : m[i]
    }
  }

  return true
}

function resolveRecordPath (path: string, record: RouteRecord): string {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}
