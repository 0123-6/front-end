# Node学习笔记

DOM树，即Node树。

document，即DOM树（Node树）对象。document.documentElement指向DOM树的根节点**HTML标签**。



其它接口继承Node接口。

- **Document**
- **Element** 
- **Attr** 
- **CharacterData** 

在方法和属性不相关的特定情况下，这些接口可能返回null。

# 属性

## nodeType

表示Node节点的类型，1代表Element元素，2代表Element的属性,即Attr,3代表文本Text,8代表注释节点Comment

## parentNode

返回指定的节点在 DOM 树中的父节点

## parentElement

和parentNode类似,但当其父元素不是Element元素时,返回null.

## childNodes

子节点的集合,返回类型为NodeList，是一种类数组格式

## nextSibling

**`Node.nextSibling`** 是一个只读属性，返回其父节点的 [`childNodes`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/childNodes) 列表中紧跟在其后面的节点，如果指定的节点为最后一个节点，则返回 `null`。

## baseUrl

Node.baseUrl是只读属性，返回一个节点的决定基址URL。

和浏览器相关的URL从window.location 或 document.location获取

```javascript
window.location === document.location // true
```



```javascript
// https://developer.mozilla.org/zh-CN/docs/Web/API/Node/baseURI网站的baseUrl
document.baseURI// https://developer.mozilla.org/zh-CN/docs/Web/API/Node/baseURI

// https://baike.baidu.com/item/SD/8059050?fr=ge_ala网站的baseUrl
document.baseURI// https://baike.baidu.com/item/SD/8059050?fr=ge_ala
```



# 方法

## removeChild

移除一个子节点.

## insertBefore

```js
var insertedNode = parentNode.insertBefore(newNode, referenceNode);
```

在parentNode的下插入newNode，插入到parentNode.referenceNode元素之前。

























































