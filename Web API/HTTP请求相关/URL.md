# URL

URL接口提供了方便URL操作的实用方法。

# 构造函数

## new URL()

创建一个URL对象。

# 属性

**protocol**: 控制协议,比如'https:' 或 'http:'

**hostname**: IP地址或域名

**port**: 端口号(如果存在)否则''



**pathname**: 路径，'/'开头的origin后面的内容，不包括查询字符串。

**search**: '?' + 后面的内容

**hash**：如果存在'#'，则为'#' + 后面的内容，location.hash = 'eee'和location.hash = '#eee'完全等效，需要hash页面不会重新加载。



**host**: 如果端口号不为空，IP地址或域名 + ':' + 端口号；否则 IP地址或域名。

**origin**: protocol//hostname:port

**href**: 完整的URL

# 方法

## createObjectURL()

**同步**方法，创建一个指定Blob或File的url链接，可以在img中作为src。不再需要时，需要调用URL.revokeObjectURL()释放内存。

FileReader().readAsDataURL(file)和URL.createObjectURL(file)都可以得到图片文件对应的URL，推荐使用URL.createObjectURL(file)方法。

## revokeObjectURL()

**`URL.revokeObjectURL()`** 静态方法用来释放一个之前已经存在的、通过调用 [`URL.createObjectURL()`](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL_static) 创建的 URL 对象。当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。



































