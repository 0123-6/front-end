# URLSearchParams

**URLSearchParams**接口定义了一些方法来处理URL的查询字符串。URLSearchParams不支持嵌套,值全部会被转为**字符串**,如需使用类型,需要**手动转换类型**.

# 构造函数

## URLSearchParams()

返回一个URLSearchParams对象。

```js
new URLSearchParams()
new URLSearchParams(options)
```

options可以是以下之一：

- 一个字符串，这个字符串从 `application/x-www-form-urlencoded` 的格式解析而来。开头的 `'?'` 字符会被忽略
- 普通对象

```js
const url1 = new URL('https://www.baidu.com/search?name=韩佩江&age=25')
const params1 = new URLSearchParams(url1.search)
console.log(params1.get('name'))

const params2 = new URLSearchParams({
  name: '我爱你',
  age: 24
})
console.log(params2.get('name'))
```

# 属性

## size

参数个数

# 方法(10个)

## 遍历相关(3个)

### keys()

迭代对象

### values()

返回一个包含所有值的[`iterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)对象。

### entries()

返回迭代对象。

## 修改(3个)

### append()

插入一个新搜索参数。不会覆盖已有属性的值。

### set()

给参数设置值，会覆盖已有的。

### delete()

删除一个键值对。

## 查找和判断(3个)

### has()

是否包含某些值。

### get()

get()方法返回第一个与搜索参数对应的值。

### getAll()

返回对应key的数组。一般不使用.

## 转换(1个)

### toString()

返回适用在 URL 中的查询字符串。

可以利用这个方法实现普通对象到URL查询字符串的转换。















































