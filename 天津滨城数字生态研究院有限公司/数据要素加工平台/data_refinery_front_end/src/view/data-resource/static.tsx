import React from "react";

export const columns1 = [
	{
		title: '字段名称',
		dataIndex: 'name',
		key: 'name',
		width: '20%',
	},
	{
		title: '字段类型',
		dataIndex: 'type',
		key: 'type',
		width: '20%',
	},
	{
		title: '字段说明',
		dataIndex: 'description',
		key: 'description',
		width: '60%',
	},
]

export const data1 = [
	{
		key: '0',
		name: 'ent_id',
		type: '数值型',
		description: '企业ID',
	},
	{
		key: '1',
		name: 'registered_fund',
		type: '数值型',
		description: '注册资金',
	},
	{
		key: '2',
		name: 'employee_cnt',
		type: '数值型',
		description: '员工数量',
	},
	{
		key: '3',
		name: 'assgro',
		type: '数值型',
		description: '资产总额（万元）',
	},
	{
		key: '4',
		name: 'liagro',
		type: '数值型',
		description: '负债总额（万元）',
	},
	{
		key: '5',
		name: 'vendinc',
		type: '数值型',
		description: '营业总收入（万元）',
	},
	{
		key: '6',
		name: 'maibusinc',
		type: '数值型',
		description: '主营业务收入（万元）',
	},
	{
		key: '7',
		name: 'progro',
		type: '数值型',
		description: '利润总额（万元）',
	},
	{
		key: '8',
		name: 'netinc',
		type: '数值型',
		description: '净利润（万元）',
	},
	{
		key: '9',
		name: 'ratgro',
		type: '数值型',
		description: '纳税总额（万元）',
	},
	{
		key: '10',
		name: 'totequ',
		type: '数值型',
		description: '所有者权益合计',
	},
	{
		key: '11',
		name: 'pat_cnt',
		type: '数值型',
		description: '专利数量',
	},
	{
		key: '12',
		name: 'mark_cnt',
		type: '数值型',
		description: '商标数量',
	},
	{
		key: '13',
		name: 'soft_end',
		type: '数值型',
		description: '软著数量',
	},
]

export const dataResourceTypeToFileTypeMap = {
	text: ['.txt',],
	csv: ['.xls','.xlt','.xlxs','.csv', '.xlsx'],
	image: ['.jpg','.jpeg','.svg'],
	video: ['.mp4','.avi'],
	audio: ['.mp3', '.wma', '.wav', '.mp3pro', '.asf', '.aac', '.vqf'],
}

export const dataPreviewColumnsMap = {
	text: [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center font-medium"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '文本',
			dataIndex: 'text',
			key: 'text',
			width: 600,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center font-medium text-hidden"}>{_text?_text:'-'}</div>
			),
		}
	],
	csv: [
		{
			title: 'ent_id',
			dataIndex: 'ent_id',
			key: 'ent_id',
		},
		{
			title: 'registered_fund',
			dataIndex: 'registered_fund',
			key: 'registered_fund',
		},
		{
			title: 'employee_cnt',
			dataIndex: 'employee_cnt',
			key: 'employee_cnt',
		},
		{
			title: 'assgro',
			dataIndex: 'assgro',
			key: 'assgro',
		},
		{
			title: 'liagro',
			dataIndex: 'liagro',
			key: 'liagro',
		},
		{
			title: 'vendinc',
			dataIndex: 'vendinc',
			key: 'vendinc',
		},
		{
			title: 'maibusinc',
			dataIndex: 'maibusinc',
			key: 'maibusinc',
		},
		{
			title: 'progro',
			dataIndex: 'progro',
			key: 'progro',
		},
		{
			title: 'netinc',
			dataIndex: 'netinc',
			key: 'netinc',
		},
	],
	image: [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center font-medium"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			width: 251,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden font-medium"}
				     onClick={null}>{_text}</div>
			),
		},
		{
			title: '图片',
			dataIndex: 'url',
			key: 'url',
			width: 251,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>
					<img src={_text} alt="" className={"w-10 h-10"} style={{borderRadius: '4px'}} />
				</div>
			),
		},
		{
			title: '格式',
			dataIndex: 'format',
			key: 'format',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center font-medium"}>{_text?_text:'-'}</div>
			),
		},
	],
	video: [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center font-medium"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			width: 251,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden font-medium"}
				     onClick={null}>{_text}</div>
			),
		},
		{
			title: '视频',
			dataIndex: 'url',
			key: 'url',
			width: 251,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>
					<div className={"w-20 h-10 rounded"}>
						<video autoPlay muted src={_text} style={{width:'100%',height:'100%',borderRadius: '4px'}}/>
					</div>
				</div>
			),
		},
		{
			title: '格式',
			dataIndex: 'format',
			key: 'format',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center font-medium"}>{_text?_text:'-'}</div>
			),
		},
	],
	audio: [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center font-medium"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			width: 251,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden font-medium"}
				     onClick={null}>{_text}</div>
			),
		},
		{
			title: '音频',
			dataIndex: 'url',
			key: 'url',
			width: 251,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>
					<audio src={_text} controls style={{height:'28px'}}/>
				</div>
			),
		},
		{
			title: '格式',
			dataIndex: 'format',
			key: 'format',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center font-medium"}>{_text?_text:'-'}</div>
			),
		},
	],
}

export const dataPreviewDataMap = {
	text: [
		{
			id: '1',
			text: '这是一段文本',
		},
		{
			id: '2',
			text: '这是第2段文本',
		},
		{
			id: '3',
			text: '这是第3段文本',
		},
		{
			id: '4',
			text: '这是第4段文本,这是第4段文本这是第4段文本这是第4段文本这是第4段文本这是第4段文本这是第4段文本这是第4段文本这是第4段文本这是第4段文本这是第4段文本',
		},
	],
	csv: [
		{
			key: '0',
			ent_id: '11727762',
			registered_fund: '300.0',
			employee_cnt: '2',
			assgro: '525.0000',
			liagro: '240.0000',
			vendinc: '490.0000',
			maibusinc: '490.0000',
			progro: '53.0000',
			netinc: '51.7000',
		},
		{
			key: '1',
			ent_id: '12198120',
			registered_fund: '100.0',
			employee_cnt: '3',
			assgro: '5.0500',
			liagro: '12.0500',
			vendinc: '51.0500',
			maibusinc: '51.0500',
			progro: '-0.0500',
			netinc: '-0.84000',
		},
		{
			key: '2',
			ent_id: '12885649',
			registered_fund: '1000.0',
			employee_cnt: '7',
			assgro: '65.4800',
			liagro: '48.4800',
			vendinc: '86.4800',
			maibusinc: '86.4800',
			progro: '-6.4800',
			netinc: '6.9800',
		},
		{
			key: '3',
			ent_id: '12885802',
			registered_fund: '1000.0',
			employee_cnt: '3',
			assgro: '70/90723',
			liagro: '15.00723',
			vendinc: '43.90723',
			maibusinc: '43.00723',
			progro: '-1.90723',
			netinc: '-1.90723',
		},
		{
			key: '4',
			ent_id: '13004853',
			registered_fund: '1000.0',
			employee_cnt: '2',
			assgro: '21.8100',
			liagro: '24.8100',
			vendinc: '151.8100',
			maibusinc: '151.8100',
			progro: '0.8100',
			netinc: '-0.28100',
		},
	],
	image: [
		{
			id: '1',
			name: '图片1',
			url: 'http://minio.model-hubs.cn/web-static/dataset-cover/202308/auIMcgO2Pt.png',
			format: 'png',
		},
		{
			id: '2',
			name: '图片2',
			url: 'http://minio.model-hubs.cn/web-static/dataset-cover/202308/fZuQ9AtE6j.png',
			format: 'png',
		},
		{
			id: '3',
			name: '图片3',
			url: 'http://minio.model-hubs.cn/web-static/dataset-cover/202308/vkgLM3AJRm.png',
			format: 'png',
		},
		{
			id: '4',
			name: '图片4',
			url: 'http://minio.model-hubs.cn/web-static/dataset-cover/202308/klw21dX5vq.png',
			format: 'png',
		},
	],
	video: [
		{
			id: '1',
			name: '视频1',
			url: 'http://minio.model-hubs.cn/web-static/dataset-file/202308/GK8wcM3JB2.mp4',
			format: 'mp4',
		},
		{
			id: '2',
			name: '视频2',
			url: 'http://minio.model-hubs.cn/web-static/dataset-file/202308/Z7NgexGPfR.mp4',
			format: 'mp4',
		},
		{
			id: '3',
			name: '视频3',
			url: 'http://minio.model-hubs.cn/web-static/dataset-file/202308/NltCB0hnOE.mp4',
			format: 'mp4',
		},
		{
			id: '4',
			name: '视频4',
			url: 'http://minio.model-hubs.cn/web-static/dataset-file/202308/GoRWNtKY0e.mp4',
			format: 'mp4',
		},
	],
	audio: [
		{
			id: '1',
			name: '音频1',
			url: 'http://minio.model-hubs.cn/web-static/dataset-file/202308/kS502EpivH.mp3',
			format: 'mp3',
		},
		{
			id: '2',
			name: '音频2',
			url: 'http://minio.model-hubs.cn/web-static/dataset-file/202308/kS502EpivH.mp3',
			format: 'mp3',
		},
		{
			id: '3',
			name: '音频3',
			url: 'http://minio.model-hubs.cn/web-static/dataset-file/202308/kS502EpivH.mp3',
			format: 'mp3',
		},
		{
			id: '4',
			name: '音频4',
			url: 'http://minio.model-hubs.cn/web-static/dataset-file/202308/kS502EpivH.mp3',
			format: 'mp3',
		}
	],
}
