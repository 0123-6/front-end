# Storage

作为Web Storage API的接口，Storage提供了访问特定域名下的会话存储或本地存储的功能。

# 属性

length

# 方法

## 修改

### setItem()

### removeItem()

### clear()

清空。

## 查找

### getItem()





# Web Storage API

Web Storage API提供了浏览器可以存储键值对的机制。

请注意: localStorage只支持**同源标签页面**数据获取,不同标签页面获取不到.

## sessionStorage

**sessionStorage**为每一个给定的源维持一个独立的存储区域

- 为每一个给定的源（origin）
- 页面会话期间可用
- 数据永远不会被传输到服务器
- 存储限额大于 cookie（最大 5MB）



### 当前测试页面有sessionStorage值为123，我F5强刷页面，sessionStorage值还在不在?

在

### 当前A页面有sessionStorage值为123，我复制A页面地址在浏览器新开一个TAB页面粘贴地址访问A页面，sessionStorage值123还在不在？

不在，打开多个相同URL的Tab页面，会创建各自的sessionStorage。

### 前A页面有sessionStorage值为123，我关闭A页面这个标签页，利用浏览器的打开历史记录页面恢复打开A页面，sessionStorage值还在不在？

不在

### 多tab之间的sessionStorage能不能直接共享访问

不同域名不能，同一域名直接url访问不能，在页面内打开新页面可以复制一份。







## localStorage

- 浏览器关闭，重新打开，依然可用。
- 存储限额是两者之间的最大值

























