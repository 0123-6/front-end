# Location位置

Location接口表示其链接到的对象的URL。

 [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 和 [`Window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 接口都有这样一个链接的 Location，分别通过 [`Document.location`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/location)和[`Window.location`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location) 访问。

Location接口是描述当前网站的URL信息的接口。

浏览器中，window.location === document.location，是同一个Location对象，表示当前网站的URL信息。

给location赋值时，可以采用不同的方式来实现不同的效果。

1. **绝对 URL 或相对 URL**：赋值一个 URL 字符串会导致页面加载该 URL。

   ```javascript
   location = 'https://www.example.com/newpage'; // 加载新页面
   ```

2. **只修改哈希部分**：赋值一个带有哈希标记的字符串会导致页面滚动到具有相同哈希标记的元素，但不会重新加载。

   ```javascript
   location = '#xyz'; // 页面滚动到具有 id 为 "xyz" 的元素处，但不加载新页面
   ```

3. **空字符串**：赋值一个空字符串会导致页面重新加载当前页面的原始 URL。

   当给 `location` 对象赋值为空字符串时，它会导致页面重新加载当前页面的原始 URL。这意味着页面将会重新加载当前页面最初加载时的 URL。

   例如，假设当前页面的 URL 是 `https://www.example.com/page1#section1`，执行 `location = '';` 将会导致页面重新加载 `https://www.example.com/page1`。

   这个行为与用户点击浏览器的刷新按钮类似，它会重新加载页面的初始 URL，并且会导致页面上所有资源的重新加载，包括 JavaScript、CSS、图片等。

   ```javascript
   location = ''; // 重新加载当前页面的原始 URL
   ```

4. 

# 属性(9个)

**protocol**: 控制协议,比如'https:' 或 'http:'

**hostname**: IP地址或域名

**port**: 端口号(如果存在)否则''



**pathname**: 路径，'/'开头的origin后面的内容，不包括查询字符串。

**search**: '?' + 后面的内容

**hash**：如果存在'#'，则为'#' + 后面的内容，location.hash = 'eee'和location.hash = '#eee'完全等效，需要hash页面不会重新加载。



**host**: 如果端口号不为空，IP地址或域名 + ':' + 端口号；否则 IP地址或域名。

**origin**: protocol//hostname:port

**href**: 完整的URL

# 方法(4个)

## assign

**`Location.assign()`** 方法会触发窗口加载并显示指定的 URL 的内容。添加到History中。

## reload

**`location.reload()`** 方法用来刷新当前页面，就像刷新按钮一样。

## replace

**`Location.replace()`** 方法以给定的 URL 来替换当前的资源。替换History当前内容。

## toString

返回URL。它是[`Location.href`](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/href)的只读版本。































































