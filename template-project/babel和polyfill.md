# babel和polyfill

## babel

babel是语法转换工具,可以将ES6+语法 -> ES5语法

## polyfill

polyfill是补丁文件,可以提供目标环境为提供的标准JavaScript方法.

常见的polyfill: 

- core-js: JavaScript标准库polyfill
- 

## 总结

babel工具通常集成了polyfill的功能,

- 将高版本语法 -> 目标环境可理解的语法
- 高版本代码特有的方法,低版本环境并没有提供,通过引入polyfill来补充低版本环境,让低版本环境支持高版本方法.

# Nodejs库

undici

undici是Nodejs官方维护的HTTP客户端库.undici的fetch和FormData接口与浏览器API完全一致.

undici是Nodejs环境中支持现代Web API的最佳选择.

# ESBuild

EsBuild将新语法转换为ES6,且不提供自动polyfill注入.