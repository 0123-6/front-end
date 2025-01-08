# Blob

**Blob**对象表示一个不可变，原始数据的类文件对象。

Blob表示的不一定是JavaScript原生格式的数据。File接口基于Blob，继承了Blob的功能，并将其拓展以支持文件。

# 构造函数

## Blob()

返回一个新创建的 `Blob` 对象，其内容由参数中给定的数组拼接组成。

```js
new Blob(array)
new Blob(array, options)
```

- array: 一个可迭代对象,ArrayBuffer表示底层二进制数据.
- options：options.type表示数据的MIME类型，默认为''。

# 属性

## blob.size

`Blob` 对象中所包含数据的大小（字节）.

## blob.type

一个字符串，表明该 `Blob` 对象所包含数据的 MIME 类型。如果类型未知，则该值为空字符串。

通过input文件时，浏览器根据文件后缀假设MIME类型。

# 方法

## blob.arrayBuffer()

返回一个Promise，其会兑现一个包含blob所有内容的二进制格式的ArrayBuffer。

## blob.text()

返回一个promise，其会兑现一个包含blob所有内容的UTF-8格式的字符串。

## blob.stream()

返回一个能读取blob内容的ReadableStream。