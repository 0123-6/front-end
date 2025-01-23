# Express学习笔记

express是快速,灵活且极其简单的Node.js Web框架.

- 借助众多可用的 HTTP 实用方法和中间件，构建强大的 API 变得快速而简单。
- 

```cmd
pnpm add express@latest
# 最新版本为5.0.1,需要Nodejs 18及以上
pnpm add express@5.0.1
```

```ts
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## 基础的路由

```ts
// app是exporess的一个实例
// METHOD是HTTP方法的小写
// PATH是路径
// HANDLER是一个处理函数
app.METHOD(PATH, HANDLER)
```

```ts
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})

app.get('/about', (req, res) => {
  res.send('about')
})

app.get('/random.text', (req, res) => {
  res.send('random.text')
})

// path使用正则表达式
app.get(/a/, (req, res) => {
  res.send('/a/')
})

app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/')
})
```

### 路由参数

路由参数是命名的 URL 段，用于捕获 URL 中指定位置的值。捕获的值会填充到 `req.params` 对象中，路由路径中指定的路由参数名称将作为它们各自的键。

```ts
// Route path: /users/:userId/books/:bookId
// Request URL: http://localhost:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }

app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
```

### 处理函数

你可以提供多个回调函数，它们像中间件一样处理请求。

路由处理函数可以是一个函数、一个函数数组，或者两者的组合.

```ts
app.get('/example/a', (req, res) => {
  res.send('Hello from A!')
})

// 在多个处理函数时,需要调用next函数
app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})
```

```ts
const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

const cb2 = function (req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])
```

```ts
const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from D!')
})
```

### Response对象

以下表格中列出的响应对象（`res`）的方法可以向客户端发送响应，并终止请求-响应周期。如果在路由处理函数中没有调用这些方法，客户端的请求将会处于挂起状态。

| Method                                                       | Description                                    |
| ------------------------------------------------------------ | ---------------------------------------------- |
| [res.download()](https://expressjs.com/en/5x/api.html#res.download) | 提示下载文件                                   |
| [res.end()](https://expressjs.com/en/5x/api.html#res.end)    | 结束响应过程。                                 |
| [res.json()](https://expressjs.com/en/5x/api.html#res.json)  | 发送 JSON 响应。                               |
| [res.redirect()](https://expressjs.com/en/5x/api.html#res.redirect) | 重定向请求。                                   |
| [res.send()](https://expressjs.com/en/5x/api.html#res.send)  | 发送各种类型的响应。                           |
| [res.sendFile()](https://expressjs.com/en/5x/api.html#res.sendFile) | 以 octet 流的形式发送文件。                    |
| [res.sendStatus()](https://expressjs.com/en/5x/api.html#res.sendStatus) | 设置响应状态码并将其字符串表示作为响应体发送。 |

### app.route()

方便处理不同的method.

```ts
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })
```

## 处理静态文件

```ts
express.static(root, [options])

app.use(express.static('public'))

// http://localhost:3000/images/kitten.jpg
// http://localhost:3000/css/style.css
// http://localhost:3000/js/app.js
// http://localhost:3000/images/bg.png
// http://localhost:3000/hello.html
```

# Express5.x API

## express()

express是一个默认export的函数

```ts
import express from 'express'

const app = express()
```

### express.json()

express.json本身为一个工厂函数,express.json()得到一个具体的中间件函数,它解析带有JSON负载的传入请求.

在中间件处理后,一个包含解析数据的新body对象会被填充到请求对象中(即req.body),如果没有内容需要解析或者Content-Type不匹配或者发生错误,会返回一个空对象{}.

### express.static()

这是 Express 中的一个内置中间件函数。它用于提供静态文件，并基于 `serve-static` 实现。

注意：为了获得最佳效果，请使用反向代理缓存来提高静态资源的提供性能。

`root` 参数指定提供静态资产的根目录。该函数通过将 `req.url` 与提供的根目录结合来确定要提供的文件。当未找到文件时，函数不会发送 404 响应，而是调用 `next()` 继续传递给下一个中间件，从而实现中间件的堆叠和回退。

下表描述了选项对象的属性。

### express.Router()

## Application

`app` 对象通常表示 Express 应用程序。通过调用 Express 模块导出的顶级 `express()` 函数来创建它。

```ts
import express from 'express'

const app = express()
app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000)
```

### app.all()

### app.delete()

### app.disable()

### app.disabled()

### app.enable()

### app.enabled()

### app.engine()

### app.get()

### app.listen()

监听一个端口,如果没有参数,则自动找到一个可用的端口.

### app.METHOD()

### app.param()

### app.path()

### app.post()

### app.set()

### app.use()

挂载中间件函数.

## Request

### req.app

### req.baseUrl

### req.body

### req.host

### req.hostname

### req.ip

### req.method

### req.params

### req.path

### req.query

### req.route

## Response

### res.app

### res.append()

### res.cookie()

### res.clearCookie()

### res.download()

### res.end()

### res.format()

### res.get()

### res.json()

### res.send()

### res.sendFile()

### res.set()

### res.status()

## Router

### router.all()

### router.METHOD()

### router.param()

### router.route()

### router.use()























































