// client.js
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', () => {
	console.log('连接到服务器');
});

socket.addEventListener('message', (event) => {
	console.log(`收到服务器消息: ${event.data}`);
});

socket.addEventListener('close', () => {
	console.log('连接已断开');
});

const element = document.getElementById('app')
const inputElement = document.getElementById('input')

element.addEventListener('click', () => {
	const text = inputElement.value
	socket.send(text)
	console.log('浏览器向服务器发送了: ', text)
})

