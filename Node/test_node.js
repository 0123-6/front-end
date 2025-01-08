const http = require('http');
const url = require('url');

// 模拟的数据
const data = [
	{ name: '夏翀', age: 25, love: 91, province: '河南省', },
	{ name: '李雷', age: 28, love: 85, province: '河南省', },
	{ name: '韩梅梅', age: 22, love: 78, province: '北京市', },
	{ name: '王刚', age: 30, love: 93, province: '天津市', },
	// 更多数据...
];
for (let i = 0; i < 100; i++) {
	data.push({
		name: '美女' + i,
		age: 18,
		love: 92,
		province: ['河南省', '北京市', '天津市'][i%3],
	});
}

// 创建HTTP服务器
const server = http.createServer((req, res) => {
	// 解析请求的URL
	const parsedUrl = url.parse(req.url, true);
	
	// 设置CORS响应头
	// res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源
	// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 允许的方法
	// res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 允许的请求头
	
	// 处理OPTIONS预检请求
	if (req.method === 'OPTIONS') {
		res.writeHead(204); // 无内容响应
		res.end();
		return;
	}

	// 检查请求路径是否为 /search
	if (parsedUrl.pathname === '/search' && req.method === 'GET') {
		// 获取查询参数
		const { key, pageIndex, pageSize } = parsedUrl.query;

		// 过滤和分页数据
		const filteredData = data.filter(item => (key ? item.name.includes(key) : true));
		const page = parseInt(pageIndex, 10) || 1;
		const size = parseInt(pageSize, 10) || 10;
		const start = (page - 1) * size;
		const end = start + size;
		const pagedData = filteredData.slice(start, end);

		// 构造响应数据
		const response = {
			code: 0,
			desc: '成功',
			data: {
				list: pagedData,
				totalNumber: filteredData.length,
			},
		};

		// 设置响应头并返回数据
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(response));
	} else if (parsedUrl.pathname === '/login' && req.method === 'POST') {
		let body = '';

		// 监听数据传输
		req.on('data', chunk => {
			body += chunk;
		});
		// 监听数据传输结束
		req.on('end', () => {
			setTimeout(() => {
				try {
					const { phone, password } = JSON.parse(body);
					// 检查用户名和密码
					const isValidPassword = password === 'han1pei6';
					const response = {
						code: isValidPassword ? 0 : 1,
						desc: isValidPassword ? '' : '账号或密码错误',
						data: {
							userInfo: isValidPassword ? {
								phone,
								avatar: '/default_avatar.jpg',
								sex: '女',
								signature: '',
							} : undefined,
						},
					};
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response));
				} catch (e) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ code: 1, desc: 'Invalid JSON', data: {} }));
				}
			}, 5000);
		});
	} else if (parsedUrl.pathname === '/sendVerificationCode' && req.method === 'POST') {
		let body = '';

		// 监听数据传输
		req.on('data', chunk => {
			body += chunk;
		});

		// 监听数据传输结束
		req.on('end', () => {
			setTimeout(() => {
				try {
					const { phone } = JSON.parse(body);

					// 模拟50%的概率异常
					const isSuccess = Math.random() >= 0.5;
					const response = {
						code: isSuccess ? 0 : 1,
						desc: isSuccess ? '' : '验证码发送失败，请稍后再试',
						data: {},
					};

					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response));
				} catch (e) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ code: 1, desc: 'Invalid JSON', data: {} }));
				}
			}, 5000)
		});
	} else if (parsedUrl.pathname === '/register' && req.method === 'POST') {
		let body = '';

		// 监听数据传输
		req.on('data', chunk => {
			body += chunk;
		});

		// 监听数据传输结束
		req.on('end', () => {
			setTimeout(() => {
				try {
					const { phone, verificationCode, password, password2 } = JSON.parse(body);

					// 模拟50%的概率异常
					const isSuccess = Math.random() >= 0.5;
					const response = {
						code: isSuccess ? 0 : 1,
						desc: isSuccess ? '注册成功' : '注册失败，请稍后再试',
						data: {},
					};

					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response));
				} catch (e) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ code: 1, desc: 'Invalid JSON', data: {} }));
				}
			}, 5000)
		});
	} else if (parsedUrl.pathname === '/reset' && req.method === 'POST') {
		let body = '';

		// 监听数据传输
		req.on('data', chunk => {
			body += chunk;
		});

		// 监听数据传输结束
		req.on('end', () => {
			setTimeout(() => {
				try {
					const { phone, verificationCode, password, password2 } = JSON.parse(body);

					// 模拟50%的概率异常
					const isSuccess = Math.random() >= 0.5;
					const response = {
						code: isSuccess ? 0 : 1,
						desc: isSuccess ? '密码重置成功' : '密码重置失败，请稍后再试',
						data: {},
					};

					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify(response));
				} catch (e) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ code: 1, desc: 'Invalid JSON', data: {} }));
				}
			}, 5000)
		});
	} else {
		// 路径或方法不匹配时返回 404
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Not Found');
	}
});

// 监听端口
server.listen(8080, () => {
	console.log('Server is listening on port 8080');
});
