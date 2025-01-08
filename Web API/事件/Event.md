# Event

**`Event`** 接口表示在 DOM 中出现的事件。

- 用户触发的，例如鼠标或键盘事件；
- 事件也可以通过编程方式触发，例如对元素调用 [`HTMLElement.click()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/click) 方法
- 使用 [`EventTarget.dispatchEvent()`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/dispatchEvent) 方法将自定义事件派发往指定的目标（target）

很多 DOM 元素可以被设计接收 (或者监听) 这些事件，并且执行代码去响应（或者处理）它们。通过 [`EventTarget.addEventListener()`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener) 方法可以将事件处理器绑定到不同的 [HTML 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)上（比如 `<button>`、`<div>`、`<span>` 等等）。这种方式基本替换了老版本中使用 HTML [事件处理器属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes)的方式。此外，在正确添加后，还可以使用 [`removeEventListener()`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener) 方法移除这些事件处理器。

# 谁继承了Event

- KeyboardEvent：
- MouseEvent
- 

# 属性

## event.bubbles(只读)

返回一个布尔值，表明当前事件是否会向DOM树上层元素冒泡。

## Event.target

[`Event`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 接口的 **`target`** 只读属性是对事件分派到的对象的引用。当事件处理器在事件的冒泡或捕获阶段被调用时，它与 [`event.currentTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/currentTarget) 不同。

# 方法

## preventDefault()

阻止默认行为。

## stopPropagation()

阻止传播