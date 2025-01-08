# History历史记录

**History**接口允许你操作当前标签页的会话历史记录。

# 属性(2个)

## length

History.length 是一个只读属性，返回当前 标签页 中的 history 个数，包含当前页面在内。举个例子，对于新开一个 tab 加载的页面当前属性返回值 1。

## state



# 方法(5个)

## back()

当前标签页 返回到 历史记录里的上一个页面，如果不存在上一个页面，则不执行任何操作。

## forward()

当前标签页 前进到 历史记录里的 下一个页面，如果不存在，则不执行任何操作。

## go()

加载历史记录里的指定页面。

```javascript
window.history.go(delta);
```

- [`delta`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/go#delta) 可选

  相对于当前页面你要去往历史页面的位置。负值表示向后移动，正值表示向前移动。因此，例如：`history.go(2)`向前移动两页，`history.go(-2)`则向后移动两页。如果未向该函数传参或`delta`相等于 0，则该函数与调用`location.reload()`具有相同的效果。

## pushState()

pushState()方法会向历史记录添加新记录，而replaceState()方法则会更新当前记录。这两种方法都接收一个state参数，当浏览器导航到该历史记录时，浏览器会触发popstate事件，其中包含state，为pushState的state参数的拷贝。

这些API的只要目的是支持像单页应用这样的网站，它们使用JavaScript API如axios来更新页面的内容，而不是加载整个新页面。

问题在于，它破坏了浏览器“后退”和“前进”按钮的预期行为。

从用户的角度来看，他们点击了一个链接，页面就更新了，所以看起来像是一个新页面。如果用户按下浏览器的“后退”按钮，就会返回到点击链接之前的状态。

但在浏览器看来，最后一个链接并没有加载新页面，因此“后退”按钮会将浏览器带回到用户打开 SPA 之前加载的页面。

这正是 `pushState()`、`replaceState()` 和 `popstate` 事件所要解决的问题。它们使我们能够合成历史条目，并在当前会话历史条目更改为这些条目之一（例如，由于用户按下了“后退”或“前进”按钮）时收到通知。



在 [HTML](https://developer.mozilla.org/zh-CN/docs/Web/HTML) 文档中，**`history.pushState()`** 方法向浏览器的会话历史栈增加了一个条目。

```javascript
pushState(state, unused)
pushState(state, unused, url)
```

### [参数](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState#参数)

- [`state`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState#state)

  `state` 对象是一个 JavaScript 对象，其与通过 `pushState()` 创建的新历史条目相关联。每当用户导航到新的 `state`，都会触发 [`popstate`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event) 事件，并且该事件的 `state` 属性包含历史条目 `state` 对象的副本。`state` 对象可以是任何可以序列化的对象。因为 Firefox 将 `state` 对象保存到用户的磁盘上，以便用户重启浏览器可以恢复，我们对 `state` 对象序列化的表示施加了 16 MiB 的限制。如果你传递的 `state` 对象的序列化表示超出了 `pushState()` 可接受的大小，该方法将抛出异常。如果你需要更多的空间，建议使用 [`sessionStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage) 和/或 [`localStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)。

- [`unused`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState#unused)

  由于历史原因，该参数存在且不能忽略；传递一个空字符串是安全的，以防将来对该方法进行更改。

- [`url`](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState#url) 可选

  新历史条目的 URL。请注意，浏览器不会在调用 `pushState()` 之后尝试加载该 URL，但是它可能会在以后尝试加载该 URL，例如，在用户重启浏览器之后。新 URL 可以不是绝对路径；如果它是相对的，它将相对于当前的 URL 进行解析。新的 URL 必须与当前 URL 同[源](https://developer.mozilla.org/zh-CN/docs/Glossary/Origin)；否则，`pushState()` 将抛出异常。如果该参数没有指定，则将其设置为当前文档的 URL。

### [返回值](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState#返回值)

无（[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)）。

## [描述](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState#描述)

从某种程度来说，调用 `pushState()` 类似于 `window.location = "#foo"`，它们都会在当前的文档中创建和激活一个新的历史条目。但是 `pushState()` 有以下优势：

- 新的 URL 可以是任何和当前 URL 同源的 URL。然而，如果你仅修改 hash，将其设置到 [`window.location`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location)，将使你留在同一文档中。改变的范围大。
- 改变页面的 URL 是可选的。相反，设置 `window.location = "#foo";` 仅仅会在当前 hash 不是 `#foo` 情况下，创建一条新的历史条目。URL也可以不改变。
- 你可以使用你的新历史条目关联任意数据。使用基于 hash 的方式，你需要将所有相关的数据编码为一个短字符串。state可以使用任意类型，location.hash只能是字符串。

注意，`pushState()` 从未引起 [`hashchange`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/hashchange_event) 事件的触发，即使新 URL 与旧 URL 仅在 hash 上不同。

## replaceState()

替换当前历史记录。

