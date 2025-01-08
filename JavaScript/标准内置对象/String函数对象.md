# String

String对象用来表示和操作字符序列。

```javascript

// 语法
// new String(thing)
// String(thing)
```

String()被调用时可以带或不带new，new出来的是对象，直接使用是原始类型。

# String属性(1个)

## length

返回字符串中的**码元数量**。JavaScript使用UTF-16编码，其中每个Unicode字符可以编码为一个或两个码元。因此length返回的值可能和字符串Unicode字符的实际数量不匹配。

# String方法(13个)

## 截取字符串(2个)

### String.prototype.slice()

slice()方法提取字符串的一部分。

```javascript
// 语法
// slice(indexStart)
// slice(indexStart, indexEnd)


// 废弃
// substr(start)
// substr(start, length)

// substring(indexStart)
// substring(indexStart, indexEnd)
```

### String.prototype.trim()

返回一个新的字符串，将原字符串的两端空白字符移除。

## 替换(3个)

### String.prototype.replace()

将所pattern替换为replacement。pattern可以是字符串或正则表达式。

如果pattern是字符串，替换第一个。

如果pattern是正则表达式，根据正则表达式替换。

```javascript
// 语法
// replace(pattern, replacement)
```

### String.prototype.toLowerCase()

将字符串转换为小写。

### String.prototype.toUpperCase()

将字符串转换为大写。

## 查找(4个)

### String.prototype.indexOf()

从前往后查找，返回第一个符合的index；找不到返回-1。

```javascript
// 语法
// indexOf(searchString)
// indexOf(searchString, position)

const str = '我是韩佩江，我爱美女';
console.log(str.indexOf('韩佩江'));// 2
console.log(str.indexOf('韩佩江', 3));// -1
```

searchString会被强制转为字符串。

### String.prototype.lastIndexOf()

和indexOf()类似，方向相反。

### String.prototype.search()

search()方法用于在String对象中执行正则表达式的搜索，和Array.find()类似。

### String.prototype.match()

match()方法检索自付出与正则表达式进行匹配的结果。

```javascript
// 语法
// match(regexp)
```

## 判断(3个)

### String.prototype.includes()

是否包含一个字符串。

```javascript
// 语法
// includes(searchString)
// includes(searchString, position)

const str = '我是韩佩江，我爱美女';
console.log(str.includes('美女'))// true
```

searchString会被强制转为字符串。

### String.prototype.startsWith()

判断字符串是否以指定字符串开头。

### String.prototype.endsWith()

判断一个字符串是否以指定字符串结尾。参数会被强制转为字符串,undefined会被转为'undefined'。

## 分割字符串(1个)

### String.prototype.split()

split()方法接收一个模式，分割字符串，返回分割后形成的数组。

```javascript
// 语法
// split(separator)
// split(separator, limit)
```











