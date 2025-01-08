# File

表示一个文件，继承自Blob。

# 构造函数

## File()

返回一个新构建的文件对象。

```js
const file = new File(bits, name, options)
```

- bits 一个包含[`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)，[`ArrayBufferView`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)，[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)，或者 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 对象的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) — 或者任何这些对象的组合。这是 UTF-8 编码的文件内容
- name 文件名称
- options options.type表示file的MIME类型，默认为''。

# 属性

## Blob的属性

## name

文件的名字

# 方法

无