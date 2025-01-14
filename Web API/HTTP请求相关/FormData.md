# FormData

**FormData**接口提供了一种表示表单数据的键值对key/value的构造方式，并且可以轻松的将数据通过XMLHttpRequest.send()方法发生出去。key是字符串，values为**字符串**或**Blob对象**。

- 发送时，编码类型为"multipart/form-data"，它会使用和表单一样的格式
- 用于fetch的POST方法的body参数(URLSearchParams也可以，但最好使用FormData作为body)

# 构造函数

## FormData()

创建一个新的FormData对象。

```js
new FormData(form)
```

form为可选参数，一个 HTML 上的[`form`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form)表单元素——当指定了，这种方式创建的[`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)对象会自动将 form 中的表单值也包含进去，包括**文件内容**也会被编码之后包含进去。

# 属性(0个)

# 方法(9个)

## 遍历相关(3个)

### keys()

迭代对象

### values()

返回一个包含所有值的[`iterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)对象。

### entries()

返回迭代对象

## 修改(3个)

### append()

向FormData中添加新的属性值，FormData对应的属性值存在也不会覆盖原值，而是新增一个值。

如何添加文件？？？

文件内容如何编码？？？

```js
formData.append(name, value)
formData.append(name, value, filename)
```

- name: key
- value:值，可以是字符串，或Blob(包括子类型，File)
- **filename**: 传给服务器的文件名称 (一个 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)), 当一个 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 或 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 被作为第二个参数的时候， [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象的默认文件名是 "blob"。 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 对象的默认文件名是该文件的名称。

### set()

给 `FormData` 设置属性值，如果`FormData` 对应的属性值存在则覆盖原值，否则新增一项属性值。

### delete()

删除一个键值对。

## 查找和判断(3个)

### has()

是否包含某些值。

### get()

返回在FormData对象中与key关联的第一个值

### getAll()

返回对应key的数组











