export const modelStatusList = [
	{ text: '未发布', value: 1 },
	{ text: '发布审核中', value: 100 },
	{ text: '发布被驳回', value: 204 },
	{ text: '已发布', value: 200 },
	{ text: '下线审核中', value: 300 },
	{ text: '下线被驳回', value: 404 },
	{ text: '已下线', value: 400 },
]

export const modelTestList = [
	{ text: '未开始测试', value: 1 },
	{ text: '测试中', value: 2 },
	{ text: '测试成功', value: 3 },
	{ text: '测试失败', value: 4 },
]

export const modelFormatList = [
	{ label: 'TensorFlow', value: 'tensorflow' },
	{ label: 'PyTorch', value: 'pytorch' },
	{ label: 'XGBoost', value: 'xgboost' },
	{ label: 'Scikit-learn', value: 'sklearn' },
	{ label: 'LightGBM', value: 'lightgbm' },
	{ label: '自定义（上传镜像文件)', value: 'other' },
]

export const modelFormatToFileTypeMap = {
	tensorflow: '.zip',
	pytorch: '.zip',
	xgboost: '.bst',
	sklearn: '.joblib',
	lightgbm: '.bst',
	other: '.zip',
}
