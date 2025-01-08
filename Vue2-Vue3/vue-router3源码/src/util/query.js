/* @flow */
// 导入警告函数，用于在开发环境中提示警告
import { warn } from './warn'

// 正则表达式，用于匹配需要特殊编码的字符，全局查找 !'()* 这5个字符
const encodeReserveRE = /[!'()*]/g
// 替换函数，将字符转换为百分号编码的十六进制表示
const encodeReserveReplacer = c => '%' + c.charCodeAt(0).toString(16)
// 逗号正则表达式
const commaRE = /%2C/g

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
// 编码函数，对给定字符串编码以适应URL格式，将[!'()*]特殊编码，但保留逗号
const encode = str =>
  encodeURIComponent(str)
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ',')

// 解码函数
export function decode (str: string) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, `Error decoding "${str}". Leaving it intact.`)
    }
  }
  return str
}

/**
 * 解析查询字符串，将额外查询参数与解析后的查询参数合并
 * @param query
 * @param extraQuery
 * @return {*}
 */
export function resolveQuery (
  query: ?string,
  extraQuery: Dictionary<string> = {},
): Dictionary<string> {
  let parsedQuery
  try {
    parsedQuery = parseQuery(query || '')
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message)
    parsedQuery = {}
  }
  for (const key in extraQuery) {
    const value = extraQuery[key]
    parsedQuery[key] = Array.isArray(value)
      ? value.map(castQueryParamValue)
      : castQueryParamValue(value)
  }
  return parsedQuery
}

// 转换函数，如果value是基本类型，将其转换为字符串
const castQueryParamValue = value => (value == null || typeof value === 'object' ? value : String(value))

/**
 * 解析查询字符串，将其转化为键值对对象
 * @param query
 * @return {{}}
 */
function parseQuery (query: string): Dictionary<string> {
  const res = {}
  // 去掉查询字符串的前导符号
  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(param => {
    const parts = param.replace(/\+/g, ' ').split('=')
    const key = decode(parts.shift())
    const val = parts.length > 0 ? decode(parts.join('=')) : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
}

/**
 * 将obj字符串化,相当于URL环境的JSON.stringify
 * @param obj
 * @return {`?${*|string}`|string}
 */
export function stringifyQuery (obj: Dictionary<string>): string {
  const res = obj
    ? Object.keys(obj)
      .map(key => {
        const val = obj[key]

        if (val === undefined) {
          return ''
        }

        if (val === null) {
          return encode(key)
        }

        if (Array.isArray(val)) {
          const result = []
          val.forEach(val2 => {
            if (val2 === undefined) {
              return
            }
            if (val2 === null) {
              result.push(encode(key))
            } else {
              result.push(encode(key) + '=' + encode(val2))
            }
          })
          return result.join('&')
        }

        return encode(key) + '=' + encode(val)
      })
      .filter(x => x.length > 0)
      .join('&')
    : null
  return res ? `?${res}` : ''
}
