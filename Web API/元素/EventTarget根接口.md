# EventTarget

`EventTarget` 接口由可以接收事件、并且可以创建侦听器的对象实现。

- [`Element`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element) 及其子项
- [`document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)
- [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 



# 方法

## EventTarget.addEventListener()

在 `EventTarget` 上注册特定事件类型的事件处理程序。

## EventTarget.removeEventListener()

`EventTarget` 中删除事件侦听器。

## EventTarget.dispatchEvent()

将事件分派到此 `EventTarget`。

```javascript
var button = document.getElementById('myButton');

// 创建一个点击事件
var event = new Event('click');

// 分派事件，同步执行
button.dispatchEvent(event);

```

