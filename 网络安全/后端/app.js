const http = require('http');
const url = require('url');
const { parse } = require('querystring');

let users = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // 设置CORS头信息
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    console.log(parsedUrl.pathname)
    if (req.method === 'POST' && parsedUrl.pathname === '/register') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                console.log(body)
                const { username, password } = JSON.parse(body);
                users.push({ username, password });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User registered successfully' }));
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
            }
        });
    } else if (req.method === 'GET' && parsedUrl.pathname === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
