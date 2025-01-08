export const modelVersionList = [
	{ label: 'V1', value: 'V1' },
	{ label: 'V2', value: 'V2' },
	{ label: 'V3', value: 'V3' },
	{ label: 'V4', value: 'V4' },
	{ label: 'V5', value: 'V5' },
]

export const modelCpuConfigurationList = [
	{ label: '1 vCPU 1 GiB', value: JSON.stringify({cpu:1,memory:1}) },
	{ label: '1 vCPU 2 GiB', value: JSON.stringify({cpu:1,memory:2}) },
	{ label: '1 vCPU 4 GiB', value: JSON.stringify({cpu:1,memory:4}) },
	{ label: '2 vCPU 4 GiB', value: JSON.stringify({cpu:2,memory:4}) },
	{ label: '2 vCPU 8 GiB', value: JSON.stringify({cpu:2,memory:8}) },
	{ label: '4 vCPU 8 GiB', value: JSON.stringify({cpu:4,memory:8}) },
	{ label: '4 vCPU 16 GiB', value: JSON.stringify({cpu:4,memory:16}) },
	{ label: '8 vCPU 16 GiB', value: JSON.stringify({cpu:8,memory:16})},
]

export const modelGpuConfigurationList = [
	{ label: '0', value: 0 },
	{ label: '1', value: 1 },
	{ label: '2', value: 2 },
	{ label: '3', value: 3 },
	{ label: '4', value: 4 },
]

export const dataTypeMap = {
	text: '文本',
	csv: '表格',
	image: '图片',
	video: '视频',
	audio: '音频',
}

export const dataTypeList = [
	{
		label: '文本',
		text: '文本',
		value: 'text',
	},
	{
		label: '表格',
		text: '表格',
		value: 'csv',
	},
	{
		label: '图片',
		text: '图片',
		value: 'image',
	},
	{
		label: '视频',
		text: '视频',
		value: 'video',
	},
	{
		label: '音频',
		text: '音频',
		value: 'audio',
	},
]

export const applicationFieldList = [
	'智慧交通',
	'身份认证',
	'金融科技',
	'保险科技',
	'数字政务',
	'智慧城市',
	'智慧医疗',
	'智慧文旅',
	'智能制造',
	'民生服务',
	'教育科技',
	'气象气候',
	'人工智能',
	'智慧物流',
	'消费互联网',
	'其他',
]

export const applicationFieldListWithAll = [
	'全部',
	'智慧交通',
	'身份认证',
	'金融科技',
	'保险科技',
	'数字政务',
	'智慧城市',
	'智慧医疗',
	'智慧文旅',
	'智能制造',
	'民生服务',
	'教育科技',
	'气象气候',
	'人工智能',
	'智慧物流',
	'消费互联网',
	'其他',
]
