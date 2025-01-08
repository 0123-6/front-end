/* @flow */

/**
 * 用于解析相对路径并生成一个绝对路径，基于给定的基础路径。
 * @param relative
 * @param base
 * @param append
 * @return {string}
 */
export function resolvePath (
  relative: string,
  base: string,
  append?: boolean
): string {
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

/**
 * 这个函数用于解析路径中的哈希和查询参数，并返回包含路径、查询字符串和哈希的对象
 * @param path
 * @return {{path: string, query: string, hash: string}}
 */
export function parsePath (path: string): {
  path: string;
  query: string;
  hash: string;
} {
  let hash = ''
  let query = ''

  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path,
    query,
    hash
  }
}

/**
 * 清理路径中多余的斜杠
 * @param path
 * @return {string}
 */
export function cleanPath (path: string): string {
  return path.replace(/\/(?:\s*\/)+/g, '/')
}
