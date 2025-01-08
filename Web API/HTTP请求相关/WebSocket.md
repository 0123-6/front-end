# WebSocket

WebSocket全局内置对象提供了用于创建和管理WebSocket连接的API. WebSocket连接一般由浏览器主动创建和主动关闭.

# 构造函数WebSocket

```ts
// 创建一个WebSocket对象,没有open方法,创建即连接.
WebSocket(url[, options])

const socket = new WebSocket('ws://localhost:8080')
const socket = new WebSocket('wss://localhost:8080')
```

# 方法

## send

发送数据,

```ts
// 参数为字符串,Blob对象,
socket.send(text)
```

## close

关闭当前连接.

```ts
socket.close()
```

# 事件

使用addEventListener()或将一个事件监听器赋值给本接口的onevevntname属性,来监听事件.

## message

当通过WebSocket收到数据时触发.

```ts
socket.addEventListener('message', (event) => {
  console.log(`收到服务器消息: ${event.data}`);
});
```

## error

当一个WebSocket连接因错误而触发关闭时触发,例如无法发送数据.

```ts
// Create WebSocket connection
// 创建一个 WebSocket 连接
const socket = new WebSocket("ws://localhost:8080");

// Listen for possible errors
// 监听可能发生的错误
socket.addEventListener("error", function (event) {
  console.log("WebSocket error: ", event);
});
```

## open

当一个WebSocket连接成功时触发.

```ts
socket.addEventListener('open', () => {
  console.log('连接到服务器');
});
```

## close

当一个WebSocket被关闭时触发.

```ts
socket.addEventListener('close', () => {
	console.log('连接已断开');
})
```

