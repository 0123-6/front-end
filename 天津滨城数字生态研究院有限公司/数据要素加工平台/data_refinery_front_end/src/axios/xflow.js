import http, {del, get, post} from './index'

/**
 * 获取首页列表
 */
export function getArticleList(){
	return  http("get",'/article/home/index');
}

/**
 * 运行组件
 */
export function runComponent(data) {
	return post('/drapi/kfp/component/run/v2',data);
}

/**
 * 查询组件状态
 */
export function queryComponentStatus(data) {
	return get('/drapi/kfp/run/status/v2',data)
}

/**
 * 保存实验
 */
export function saveExperiment(data) {
	return post('/drapi/kfp/experiment/save',data)
}

/**
 * 运行实验
 */
export function runExperiment(data) {
	return post('/drapi/kfp/experiment/run/v2',data)
}

/**
 * 查询实验列表
 */
export function getExperimentList(data) {
	return get('/drapi/kfp/experiment/list',data)
}

/**
 * 删除实验
 */
export function deleteExperiment(data) {
	return del('/drapi/kfp/experiment/delete',data)
}

/**
 * 根据id获取实验详情
 */
export function getExperimentById(data) {
	return get('/drapi/kfp/experiment',data)
}

/**
 * 停止运行实验
 */
export function stopRunExperiment(data) {
	return post('/drapi/kfp/experiment/stop_run',data)
}

/**
 * 保存加工流程 加工流程列表 增 改
 */
export function saveProcessingFlow(data) {
	return post('/drapi/kfp/pipeline/save',data)
}

/**
 * 删除加工流程 删
 */
export function deleteElementProcessing(data) {
	return del('/drapi/kfp/pipeline/delete',data)
}

/**
 * 删除加工流程 改 同增
 */

/**
 * 加工流程列表 查
 */
export function getElementProcessingList(data) {
	return get('/drapi/kfp/pipeline/list',data)
}

/**
 * 加工流程 申请发布
 */
export function elementProcessingApplyRelease(data) {
	return post('/drapi/kfp/pipeline/submit_audit',data);
}

/**
 * 加工流程 根据id查询详细信息
 */
export function getElementProcessingDetailById(data) {
	return get('/drapi/kfp/pipeline/detail',data)
}

/**
 * 获取用户信息
 */
export function getUserInfo(data) {
	return get(`/drapi/user/users/${data.user_id}`)
}





