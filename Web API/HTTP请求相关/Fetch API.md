# Fetch API

Fetch API提供了一个获取资源的接口。

fetch()接收1个参数，为资源路径。它返回一个Promise，HTTP是404或500不会导致Promise被拒绝，只有网络故障或手动阻止请求才会导致Promise被拒绝。

fetch()不会发生跨域cookie，除非使用了*credentials* 的[初始化选项](https://developer.mozilla.org/zh-CN/docs/Web/API/fetch#参数)。

fetch()默认是get方法。

```js
Promise<Response> fetch(url)
Promise<Response> fetch(url, options)
```

url: 定义你想要获取的资源，可能是：

- 一个字符串，'http://www.baidu.com/search'
- 一个有toString()方法的对象，比如URL对象
- 一个Request对象

options是一个配置对象，包括：

- **method**：请求方法，默认值为**GET**，'GET', 'POST', 不区分大小写。
- **headers**：任意想要附加到请求的标头，可以是**Headers对象**或带有字符串值的**普通对象**，注意有些标头是禁止的。
- **body**：对应HTTP请求报文的body，可以是Blob，ArrayBuffer，FormData，URLSearchParams，字符串。请注意GET方法没有body属性。
- **signal**：一个**AbortSignal**实例，一般为AbortController实例的signal属性，可以中止请求

返回一个Promise，resolve是传Response对象。





```js
const res = await fetch('http://localhost:3000/register', {
  method: 'POST',
  headers: {
    // 指定的话，为application/json，否则为text/plain
    // 'Content-Type': 'application/json'
  },
  // body的格式为URLSearchParams,FormData,string
  body: JSON.stringify(user)
})
```









# HTTP报文

HTTP有2种报文类型，请求报文和响应报文。

## 请求报文

- HTTP方法，比如**GET**，**POST**
- HTTP协议版本号
- 可选标头headers
- 请求体body

## 响应报文

- 一个状态码，200,404
- 一个状态信息
- HTTP协议版本号
- 可选标头Headers
- 响应体body