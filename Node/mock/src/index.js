import express from 'express'

const app = express()
app.use(express.json())
// app.use((err, req, res, next) => {
// 	if (err) {
// 		console.error('Error:', err);
// 		res.status(500).json({ msg: 'Internal Server Error', code: 500 });
// 	} else {
// 		next();
// 	}
// });

app.get('/', (req, res) => {
	res.send('Hello World')
})

app.post('/getSystemList', (req, res) => {
	setTimeout(() => {
		res.json({
			msg: '成功',
			code: 200,
			data: [
				{name: '系统1', id: 1,},
				{name: '系统2', id: 2,},
			],
		})
	}, 2000)
})

app.post('/getAlarmTypeList', (req, res) => {
	setTimeout(() => {
		res.json({
			msg: '成功',
			code: 200,
			data: [
				{name: '告警类型1', id: 1,},
				{name: '告警类型2', id: 2,},
			],
		})
	}, 2000)
})

app.post('/getTeamList', (req, res) => {
	setTimeout(() => {
		res.json({
			msg: '成功',
			code: 200,
			data: [
				{name: '团队1', id: 1,},
				{name: '团队2', id: 2,},
			],
		})
	}, 2000)
})

app.post('/getSceneList', (req, res) => {
	setTimeout(() => {
		res.json({
			msg: '成功',
			code: 200,
			data: [
				{name: '场景1', id: 1,},
				{name: '场景2', id: 2,},
			],
		})
	}, 2000)
})

app.post('/getTableData', (req, res) => {
	setTimeout(() => {
		res.json({
			msg: '成功',
			code: 200,
			data: {
				total: 52,
				list: new Array(20).map((item, index) => ({
					id: index + 1,
					name: "名字" + (index + 1),
				})),
			}
		})
	}, 2000)
})



app.listen(3000, () => {
	console.log('服务3000,启动成功!')
})









