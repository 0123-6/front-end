# FileReader 过时

FileReader可以读取File对象。其中file对象可能来自这几个地方

- input type=file的onchange事件
- 拖放操作生成的DataTransfer对象
- HTMLCanvasElement的toBlob()方法产生Blob对象

# 构造函数

## FileReader()

返回一个新的FileReader对象。

# 属性

## readyState

表示`FileReader`状态的数字。取值如下：

| 常量名    | 值   | 描述                   |
| :-------- | :--- | :--------------------- |
| `EMPTY`   | `0`  | 还没有加载任何数据。   |
| `LOADING` | `1`  | 数据正在被加载。       |
| `DONE`    | `2`  | 已完成全部的读取请求。 |

## result

文件的内容。

# 方法

## fileReader.readAsArrayBuffer() 过时

开始读取指定的 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)中的内容，一旦完成，result 属性中保存的将是被读取文件的 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 数据对象。

旧方法，不推荐使用。

推荐使用Blob.prototype.arrayBuffer()

## fileReader.readAsText() 过时

开始读取指定的[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)中的内容。一旦完成，`result`属性中将包含一个字符串以表示所读取的文件内容。

旧方法，不推荐使用。

推荐使用Blob.prototype.text()

## fileReader.readAsDataURL() 过时

开始读取指定的[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)中的内容。一旦完成，`result`属性中将包含一个`data:` URL 格式的 Base64 字符串以表示所读取文件的内容。

旧方法，不推荐使用。

推荐使用URL.createObjectURL()

# 事件处理

## onload 过时

该事件在读取操作完成时触发。

