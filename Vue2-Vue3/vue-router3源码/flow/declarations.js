declare var document: Document;

declare class RouteRegExp extends RegExp {
  keys: Array<{ name: string, optional: boolean }>;
}

declare module 'path-to-regexp' {
  declare module.exports: {
    (path: string, keys?: Array<?{ name: string }>): RouteRegExp;
    compile: (path: string) => (params: Object) => string;
  }
}

declare type Dictionary<T> = { [key: string]: T }

// 导航卫士
declare type NavigationGuard = (
  to: Route,
  from: Route,
  next: (to?: RawLocation | false | Function | void) => void
) => any

declare type AfterNavigationHook = (to: Route, from: Route) => any

/**
 * 路由器构造函数的参数
 */
declare type RouterOptions = {
  // 应用的基路径，默认为'/', 如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
  base?: string;
  // 模式
  mode?: string;
  // 路由记录配置项
  routes?: Array<RouteConfig>;
}

declare type RedirectOption = RawLocation | ((to: Route) => RawLocation)

// 路由记录构造参数
declare type RouteConfig = {
  // 路由记录名称
  name?: string;
  // 匹配路径,必填
  path: string;
  
  // path对应的Vue组件
  component?: any;
  // 子路由,嵌套路由
  children?: Array<RouteConfig>;
  
  
  // 重定向
  redirect?: RedirectOption;
  // 导航卫士
  beforeEnter?: NavigationGuard;
  // 路由记录元信息
  meta?: any;
  // 属性模式
  props?: boolean | Object | Function;
}

/**
 * 路由记录
 */
declare type RouteRecord = {
  // 路由记录名称
  name: ?string;
  // 路径,必填
  path: string;
  
  // 对应的正则表达式
  regex: RouteRegExp;
  // component instance enteredCb原来都有s，我手动删除了，可能存在bug
  // 关联的组件
  component: any;
  // 储存组件实例，键是组件名称，值是对应的实例
  instance: any;
  // 记录组件实例进入时的回调函数
  enteredCb: Array<Function>;
  
  // 父路由记录，用于表示嵌套路由
  parent: ?RouteRecord;
  // 重定向选项
  redirect: ?RedirectOption;
  // 路由进入前的导航守卫
  beforeEnter: ?NavigationGuard;
  // 元信息
  meta: any;
  // 路由props属性设置
  props: boolean | Object | Function | Dictionary<boolean | Object | Function>;
}

/**
 * Location位置定义
 */
declare type Location = {
  // 名称
  name?: string;
  // 路径,如果path存在，params会被忽略
  path?: string;
  
  // 参数相关
  // 路由参数对象，包含了动态片段和全匹配片段
  params?: Dictionary<string>;
  // URL查询参数对象，'/foo?user=1',则$route.query.user=1
  query?: Dictionary<string>;
  // 对应hash值(带'#'),如果没有hash值，则为空字符串
  hash?: string;
  
  // 配置项
  // 是否追加模式，默认false
  append?: boolean;
  // 是否替换当前history
  replace?: boolean;
  // ???
  _normalized?: boolean;
}

// URL对象，可能是string，可能是Location对象
declare type RawLocation = string | Location

/**
 * 路由对象
 */
declare type Route = {
  // 当前路由的名称，如果有的话
  name: ?string;
  // 对应路径pathname，总是解析为绝对路径
  path: string;
  // 完成解析后的 URL，包含查询参数和 hash 的完整路径
  fullPath: string;
  
  // 参数相关
  // 路由参数对象，包含了动态片段和全匹配片段
  params: Dictionary<string>;
  // URL查询参数对象，'/foo?user=1',则$route.query.user=1
  query: Dictionary<string>;
  // 对应hash值(带'#'),如果没有hash值，则为空字符串
  hash: string;
  
  // 路由相关
  // 匹配的具体的路由记录数组
  matched: Array<RouteRecord>;
  // 如果存在重定向，即为重定向来源的路由的名字
  redirectedFrom?: string;
  // 路由的其它信息
  meta?: any;
}
