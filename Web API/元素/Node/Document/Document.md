# Document

document，即DOM树对象。document.documentElement指向DOM树的根节点**HTML标签**。

# 属性

## characterSet

**`Document.characterSet`** 只读属性返回当前文档的字符编码。该字符编码是用于渲染此文档的字符集，可能与该页面指定的编码不同。

一般是'UTF-8'

## title

文档的标题

## head

返回文档的\<head\>元素

## body

当前文档的\<body\>元素

# 方法

## createElement

创建一个DOM元素

```js
const newDiv = document.createElement('div');
```

## createTextNode

创建文本节点

## createComment

创建备注节点
