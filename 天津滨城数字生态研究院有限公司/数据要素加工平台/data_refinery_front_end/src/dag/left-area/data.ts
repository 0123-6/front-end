interface IProps {
	label: string;
	name: string;
	description: string;
	input_list: any[];
	config: IConfig[];
	output_list: any[];
}

interface IConfig {
	label: string;
	value: any;
	source_data?: any;
	type: 'str' | 'int' | 'bool' | 'select' | 'select_mul' | 'dict' | 'enum';
	style?: IStyle;
	source_input_index?: number | null;
	source_input_sub_index?: number | null;
}

interface IStyle {
	same_line?: boolean;
}

const data: IProps[] = [
	{
		label: '读取数据',
		name: "load_data",
		description: '读取数据',
		input_list: [],
		config: [
			{
				label: '数据类型',
				value: 'csv',
				source_data: [
					{"label": "文本", "value": "text"},
					{"label": "表格", "value": "csv"},
					{"label": "图片", "value": "image"},
					{"label": "视频", "value": "video"},
					{"label": "音频", "value": "audio"},
				],
				type: 'select',
				style: {
					same_line: true,
				}
			},
			{
				label: "数据路径",
				value: "",
				type: "str", // str int float list dict enum
			},
		],
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'table',
				},
				{
					label: '"表格数据列列表(name type)',
					value: [],
					type: 'select_mul',
				},
			]
		],
	},
	{
		label: '数据按列值排序',
		description: '数据按列值排序',
		// 节点自己的参数
		name: "data_cols_sort",
		// 输入参数
		"input_list": [
			[{
				"value": "",
				"label": "输入数据",
				"type": "table"
			}, {
				"value": "",
				"label": "表格数据列列表(name type)",
				"type": "select_mul"
			}]
		],
		"config": [{
			"value": [],
			"label": "排序列",
			"type": "select_mul",
			"source_input_sub_index": 1,
			"style": {}
		}, {
			"value": false,
			"label": "降序排列",
			"type": "bool",
			"style": {}
		}],
		// 输出参数
		"output_list": [
			[{
				"value": "",
				"label": "输出数据",
				"type": "table"
			}, {
				"value": [],
				"label": "表格数据列列表(name type)",
				"type": "select_mul"
			}]
		],
	},
	{
		label: '调整图片尺寸',
		description: '根据设定调整图片尺寸',
		name: "resize_image",
		input_list: [
			[
				{
					label: '上一步输出',
					value: '',
					type: 'image',
				},
			]
		],
		config: [
			{
				label: "图片宽度",
				value: 1920,
				type: "int",
			},
			{
				label: "图片高度",
				value: 1080,
				type: "int",
			},
		],
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'image',
				},
			]
		],
	},
	{
		label: '视频解码',
		description: '从url读取视频数据转图片,每一帧都抽出来',
		// 节点自己的参数  -->
		name: "video_extract",
		// 输入参数
		input_list: [
			[
				{
					label: '上一步输出',
					value: '',
					type: 'video',
				},
			]
		],
		config: [],
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'image',
				},
			]
		],
	},
	{
		label: '车辆检测',
		description: '交通视频图片车辆检测',
		// 节点自己的参数
		name: "yolov5_car_detect",
		// 输入参数
		input_list: [
			[
				{
					label: '上一步输出',
					value: '',
					type: 'table',
				},
			]
		],
		config: [],
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'image',
				},
			]
		],
	},
	{
		label: '车流量统计',
		description: '交通车流量统计',
		name: "traffic_analysis",
		// 输入参数
		input_list: [
			[
				{
					label: '上一步输出',
					value: '',
					type: 'image',
				}
			]
		],
		"config": [{
			"label": "x1",
			"value": 769,
			"type": "int",
			style: {
				same_line: true,
			}
		}, {
			"label": "y1",
			"value": 259,
			"type": "int",
			style: {
				same_line: true,
			}
		}, {
			"label": "x2",
			"value": 1444,
			"type": "int",
			style: {
				same_line: true,
			}
		}, {
			"label": "y2",
			"value": 299,
			"type": "int",
			style: {
				same_line: true,
			}
		}, {
			"label": "x3",
			"value": 1477,
			"type": "int",
			style: {
				same_line: true,
			}
		}, {
			"label": "y3",
			"value": 619,
			"type": "int",
			style: {
				same_line: true,
			}
		}, {
			"label": "x4",
			"value": 137,
			"type": "int",
			style: {
				same_line: true,
			}
		}, {
			"label": "y4",
			"value": 453,
			"type": "int",
			style: {
				same_line: true,
			}
		}],

		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'image',
				}
			]
		],
	},
	{
		label: '实体抽取模型推理',
		description: '处理完毕的文本调用中台模型得到推理结果',
		name: "policy_enterprise_extraction",
		// 输入参数
		input_list: [
			[
				{
					label: '上一步输出',
					value: '',
					type: 'json',
				},
			]
		],
		"config": [],
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'text',
				},
			]
		],
	},
	{
		label: '文本前处理',
		description: '文本前处理',
		name: "textentityextraction_text_preprocessing",
		// 输入参数
		input_list: [
			[
				{
					label: '上一步输出',
					value: '',
					type: 'text',
				},
			]
		],
		"config": [{
			"label": "是否自定义替换",
			"value": false,
			"type": "bool"
		}, {
			"label": "替换正则表达式",
			"value": '',
			"type": "str"
		}, {
			"label": "是否自定义匹配",
			"value": false,
			"type": "bool"
		}, {
			"label": "匹配正则表达式",
			"value": '',
			"type": "str"
		}],
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'json',
				},
			]
		],
	},
	{
		label: '数据筛选',
		description: '通过选择行、列与列条件筛选的方式来选择数据',
		name: 'data_screening',
		// 输入参数
		input_list: [
			[
				{
					label: '上一步输出',
					value: '',
					type: 'table',
				},
				{
					label: '传入的全部列名列表',
					value: [],
					type: 'select_mul',
				}
			]
		],
		config: [
			{
				label: '列选择筛选',// 用户筛选的列名列表
				value: [],
				source_input_sub_index: 1,
				type: 'select_mul',
			}
		],
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'table',
				},
				{
					label: '"表格数据列列表(name type)',
					value: [],
					type: 'select_mul',
				},
			]
		],
	},
	{
		label: 'Min-Max标准化',
		description: '对数据中某特征取值进行MinMax标准化',
		name: 'min_max_scale',
		// 输入参数
		input_list: [
			[
				{
					label: '上一步输出',
					value: '',
					type: 'table',
				},
				{
					label: '传入的全部列名列表',
					value: [],
					type: 'select_mul',
				}
			]
		],
		config: [
			{
				label: '列处理',// 列处理
				value: [],
				source_input_sub_index: 1,
				type: 'select_mul',
			},
			{
				label: '最小值',// 最小值
				value: 0,
				type: 'int',
			},
			{
				label: '最大值',// 列处理
				value: 100,
				type: 'int',
			},
		],
		// 节点输出属性
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'table',
				},
				{
					label: '"表格数据列列表(name type)',
					value: [],
					type: 'select_mul',
				},
			]
		],
	},
	{
		label: '熵权法',
		description: '对构建的指标体系进行熵权法计算得到指数结果',
		name: 'entropy_weight_method',
		// 输入参数
		input_list: [
			[
				{
					label: '输入数据',
					value: '',
					type: 'table',
				},
				{
					label: '传入的全部列名列表',
					value: [],
					type: 'select_mul',
				}
			]
		],
		config: [
			{
				label: '正向指标',// 正向指标
				value: [],
				source_input_sub_index: 1,
				type: 'select_mul',
			},
			{
				label: '负向指标',// 负向
				value: [],
				source_input_sub_index: 1,
				type: 'select_mul',
			},
			{
				label: '指数列名称',// 指数列名称
				value: '',
				type: 'str',
			},
			{
				label: '选择输出列',// 用户筛选列名列表
				value: [],
				source_input_sub_index: 1,
				type: 'select_mul',
			},
		],
		// 输出参数
		output_list: [
			[
				{
					label: '输出数据',
					value: '',
					type: 'table',
				},
				{
					label: '"表格数据列列表(name type)',
					value: [],
					type: 'select_mul',
				},
			]
		],
	},
	{
		label: '月增长率计算',
		description: '月增长率计算',
		name: 'monthly_growth_rate_cal',
		// 输入参数
		"input_list": [
			[{
				"value": "",
				"label": "输入数据",
				"type": "table"
			}, {
				"value": "",
				"label": "表格数据列列表(name type)",
				"type": "select_mul"
			}]
		],
		"config": [
			{
				"label": "主键",
				"value": "",
				"type": "select",//单选
				"source_input_sub_index": 1,
				"style": {}
			},
			{
				"label": "计算列",
				"value": "",
				"type": "select",//单选
				"source_input_sub_index": 1,
				"style": {}
			},
			{
				"label": "时间列",
				"value": "",
				"type": "select",//单选
				"source_input_sub_index": 1,
				"style": {}
			},
			{
				"label": "时间格式",
				"value": "%Y-%m",
				"type": "str",
				"style": {}
			},
			{
				"label": "增长率列名",
				"value": 'monthly_growth_rate',
				"type": "str",
				"style": {}
			},
			{
				"label": "保留小数位",
				"value": 2,
				"type": "int",
				"style": {}
			}
		],
		// 输出参数
		"output_list": [
			[{
				"value": "",
				"label": "输出数据",
				"type": "table"
			}, {
				"value": [],
				"label": "表格数据列列表(name type)",
				"type": "select_mul"
			}]
		],
	},
	{
		"label": "频谱图提取",
		"name": "audio_to_spectrogram",
		"description": "频谱图提取",
		"input_list": [[{
			"label": "上一步输出",
			"value": "",
			"type": "audio"
		}]],
		"output_list": [[{
			"label": "输出数据",
			"value": "",
			"type": "json"
		}]],
		"config": [{
			"label": "提取方式",
			"value": 'mel',
			"type": "select",
			"source_data": [
				{"label": " 梅尔频谱", "value": "mel"},
				// {"label":" 梅尔倒谱","value":"mfcc"},
			]
		}, {
			"label": "采样率",
			"value": 22050,
			"type": "int"
		}, {
			"label": "窗口大小",
			"value": 2048,
			"type": "int"
		}, {
			"label": "帧移长度",
			"value": 512,
			"type": "int"
		}, {
			"label": "窗口长度",
			"value": 2048,
			"type": "int"
		}, {
			"label": "梅尔滤波器数量",
			"value": 128,
			"type": "int"
		}, {
			"label": "最小谱图频率",
			"value": 0,
			"type": "int"
		}, {
			"label": "最大谱图频率",
			"value": 11025,
			"type": "int"
		},
			// 	{
			// 	"label": "MFCC数量",
			// 	"value":20 ,
			// 	"type": "int"
			// }
		]
	},
	{
		"label": "城市音频分类",
		"name": "audio_classification",
		"description": "城市音频分类",
		"input_list": [[{
			"label": "上一步输出",
			"value": "",
			"type": "json"
		}]],
		"output_list": [[{
			"label": "输出数据",
			"value": "",
			"type": "text"
		}]],
		"config": []
	},
	{
		"label": "人脸位置识别",
		"name": "retinaface",
		"description": "人脸位置识别",
		"input_list": [[{
			"label": "上一步输出",
			"value": "",
			"type": "image"
		}]],
		"output_list": [[{
			"label": "输出数据",
			"value": "",
			"type": "zip"
		}]],
		"config": []
	},
	{
		"label": "人脸特征向量提取",
		"name": "arcface",
		"description": "人脸特征向量提取",
		"input_list": [[{
			"label": "上一步输出",
			"value": "",
			"type": "zip"
		}]],
		"output_list": [[{
			"label": "输出数据",
			"value": "",
			"type": "zip"
		}]],
		"config": []
	},
	{
		"label": "视频分类前处理",
		"name": "video_classification_preprocessing",
		"description": "视频分类前处理",
		"input_list": [[{
			"label": "上一步输出",
			"value": "",
			"type": "video"
		}]],
		"output_list": [[{
			"label": "输出数据",
			"value": "",
			"type": "text"
		}]],
		"config": []
	},
	{
		"label": "犯罪视频分类",
		"name": "video_classification",
		"description": "犯罪视频分类",
		"input_list": [[{
			"label": "上一步输出",
			"value": "",
			"type": "text"
		}]],
		"output_list": [[{
			"label": "输出数据",
			"value": "",
			"type": "text"
		}]],
		"config": []
	},
	{
		"label": "Clip特征提取",
		"name": "clip_img_or_text",
		"description": "Clip特征提取",
		"input_list": [[{
			"label": "上一步输出",
			"value": "",
			"type": "url"
		}]],
		"output_list": [[{
			"label": "输出数据",
			"value": "",
			"type": "text"
		}]],
		"config": [
			{
				"label": "数据类型",
				"value": "images",
				"type": "select",
				"source_data": [
					{"label": "图片", "value": "images"},
					{"label": "文本", "value": "text"}
				]
			}
		]
	},
]
