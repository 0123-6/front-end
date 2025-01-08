// 项目处理进度分布
export const projectHandleScheduleDistributionMap = {
	'即将处理': 'project_start_soon',
	'正在处理': 'project_processing',
	'已处理': 'project_processed',
}

// 工程性质
export const projectTypeMap = {
	'产业项目': 'industry_project',
	'市政项目': 'municipal_project',
	'路桥项目': 'bridge_project',
	'公共设施项目': 'facility_project',
	// 值转为文字
	'industry_project': '产业项目',
	'municipal_project': '市政项目',
	'bridge_project': '路桥项目',
	'facility_project': '公共设施项目',
}

// 项目状态
export const projectStatusMap = {
	'正常推进': '1',
	// '即将延期': '2',
	'已延期': '3',
	'已终止': '4',
	// 值转为文字
	'1': '正常推进',
	// '2': '即将延期',
	'3': '已延期',
	'4': '已终止',
}

// 阶段状态
export const periodStatusMap = {
	'未开始': '0',
	'正常推进': '1',
	'已完成': '2',
}

// 环节状态
export const stepStatusMap = {
	'未开始': '0',
	'正常推进': '1',
	'已暂停': '2',
	'已完成': '3',
	'已延期': '4',
	'延期完成': '5',
}

// 知识库文件状态
export const knowledgeStatusMap = {
	'待生效': '0',
	'生效中': '1',
	'已失效': '2',
}

// 工作台设置
export const workbenchSettingMap = {
	'项目处理进度分布': 'project_handle_schedule_distribution',
	'项目状态分布': 'project_status_distribution',
	'项目阶段统计': 'project_schedule_distribution',
}

// 测试代码
