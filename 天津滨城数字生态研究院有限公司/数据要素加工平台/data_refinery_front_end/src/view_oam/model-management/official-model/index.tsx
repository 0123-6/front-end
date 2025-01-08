import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import NavigationComponent from "../../../components/NavigationComponent";
import ModelManagementSvg from "../../layout/icon/ModelManagementSvg";
import SearchBig from "../../../components/SearchBig";
import ButtonMain from "../../../components/ButtonMain";
import ButtonFifth from "../../../components/ButtonFifth";
import {message, Pagination, Popover, Table, Tooltip} from "antd";
import ViewSvg from "../../../icon/table/ViewSvg";
import {del, get, post} from "../../../axios";
import {PopoverContent} from "../../../view/data-element/common/PopoverContent";
import {formatPhone} from "../../../utils/util";
import {officialModelStatusList} from "./util";
import StatusShow from "./components/StatusShow";
// import TestingReportSvg from "../../icon/TestingReportSvg";
import RiskAssessmentSvg from "../../icon/RiskAssessmentSvg";
import OnlineSvg from "../../icon/OnlineSvg";
import OfflineSvg from "../../icon/OfflineSvg";
import {modelTestList} from "../../util";
import EditSvg from "../../../icon/table/EditSvg";
import TestSvg from "../../../icon/table/TestSvg";
import RiskAssessmentModal from "../components/RiskAssessmentModal";
import BatchOfflineModal from "../components/BatchOfflineModal";
import BatchOnlineModal from "../components/BatchOnlineModal";
import OnlineModal from "../components/OnlineModal";
import OfflineModal from "../components/OfflineModal";
import DeleteSvg from "../../../icon/table/DeleteSvg";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";
import RunSuccess from "../../../icon/table/status/运行成功.svg";
import RunError from "../../../icon/table/status/运行失败.svg";
import CreateModal from "./components/CreateModal";
import Running from "../../../icon/table/status/运行中.svg";
import TestModal from "../../../view/my-model/components/TestModal";
import TestModalSecond from "../../../view/my-model/components/TestModalSecond";
import {saveExperiment} from "../../../axios/xflow";

export default function OfficialModel() {
	// state
	// @ts-ignore
	const history = useHistory();
	const keyword = useRef('')
	// 升降序
	// 升序
	const orderByAsc = useRef('')
	const orderByDesc = useRef('')
	// 类型
	const filterTypeList = useRef([])
	// 状态
	const filterStatusList = useRef([])
	// 降序

	const pageSize = useRef(10);
	const pageSizeChange = useRef(false);
	const pageNum = useRef(1);
	const [pageSum, setPageSum] = useState(0);
	// 是否是首次加载
	const first = useRef(true)
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	// 模型类型列表
	const modelTypeList = useRef([]);
	// 上线弹框
	const [showOnlineModal, setShowOnlineModal] = useState(false);
	// 下线弹框
	const [showOfflineModal, setShowOfflineModal] = useState(false);
	// 批量上线弹框
	const [showBatchOnlineModal, setShowBatchOnlineModal] = useState(false);
	// 批量下线弹框
	const [showBatchOfflineModal, setShowBatchOfflineModal] = useState(false);
	// 风险评估弹框
	const [showRiskAssessmentModal, setShowRiskAssessmentModal] = useState(false);
	// 批量删除弹框
	const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
	const [showDeleteModal,setShowDeleteModal] = useState(false);
	// 批量部署弹框
	// @ts-ignore
	const [showBatchDeploymentModal, setShowBatchDeploymentModal] = useState(false);
	// 测试弹框
	const [showTestModal,setShowTestModal] = useState(false);
	// 测试弹框2
	const [showTestModalSecond,setShowTestModalSecond] = useState(false);
	// 创建弹框
	const [showCreateModal, setShowCreateModal] = useState(false);
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 40,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			width: 251,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>16)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}
					     onClick={() => handleView(_index)}>{_text}</div>
				</Tooltip>
			),
		},
		{
			title: '类型',
			dataIndex: 'model_type_desc',
			filters: modelTypeList.current,
			width: 161,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '版本',
			dataIndex: 'version',
			key: 'version',
			width: 56,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '创建者',
			dataIndex: 'user',
			key: 'user',
			width: 116,
			render: (_text, _record, _index) => (
				<div className={"w-full flex"}>
					{
						_text &&
						<Popover title={null}
										 placement="leftTop"
										 overlayClassName={'person-popover-2'}
										 trigger="hover"
										 content={PopoverContent({user: _text,showPhone: true})}
						>
							<div className={"w-full flex"}
									 style={{height: '22px'}}>
								{/*头像*/}
								<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
										 style={{width: '22px', minWidth: '22px', height: '22px'}}>
									<img className="" src={(_text?.avatar) ? (_text?.avatar) : null} alt=""
											 style={{width: '100%', height: '100%'}}/>
								</div>
								{/*姓名*/}
								<div className={"ml-1.5 h-full flex items-center"}>
								<span className={"flex items-center text-hidden"}>
									<span>{(_text?.nickname) ? (_text?.nickname) : ((_text?.mobile) ? formatPhone(_text?.mobile) : '静态内容')}</span>
								</span>
								</div>
							</div>
						</Popover>
					}
					{
						!_text &&
						<span>—</span>
					}
				</div>
			),
		},
		{
			title: '创建时间',
			dataIndex: 'created_at',
			key: 'created_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '创建方式',
			dataIndex: 'type_desc',
			key: 'type_desc',
			width: 136,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '状态',
			dataIndex: 'sub_status_desc',
			filters: officialModelStatusList,
			width: 101,
			render: (_text, _record, _index) => (
				<StatusShow status={_text}/>
			),
		},
		{
			title: '实例配置',
			dataIndex: '实例配置',
			key: '实例配置',
			width: 102,
			render: (_text, _record, _index) => (
				<span className={"w-full flex"}>
					{
						_record?.cpu && _record?.memory &&
						<span>{`${_record?.cpu} vCPU ${_record?.memory} GiB`}</span>
					}
					{
						!(_record?.cpu && _record?.memory) &&
						<span>—</span>
					}
				</span>
			),
		},
		{
			title: '操作者',
			dataIndex: 'audit_info',
			key: '操作者',
			width: 116,
			render: (_text, _record, _index) => (
				<div className={"w-full flex"}>
					{
						_text?.auditor &&
						<Popover title={null}
										 placement="leftTop"
										 overlayClassName={'person-popover-2'}
										 trigger="hover"
										 content={PopoverContent({user: _text?.auditor,showPhone: true})}
						>
							<div className={"w-full flex"}
									 style={{height: '22px'}}>
								{/*头像*/}
								<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
										 style={{width: '22px', minWidth: '22px', height: '22px'}}>
									<img className="" src={(_text?.auditor?.avatar) ? (_text?.auditor?.avatar) : null} alt=""
											 style={{width: '100%', height: '100%'}}/>
								</div>
								{/*姓名*/}
								<div className={"ml-1.5 h-full flex items-center"}>
								<span className={"flex items-center text-hidden"}>
									<span>{(_text?.auditor?.nickname) ? (_text?.auditor?.nickname) : ((_text?.auditor?.mobile) ? formatPhone(_text?.auditor?.mobile) : '静态内容')}</span>
								</span>
								</div>
							</div>
						</Popover>
					}
					{
						!_text?.auditor &&
						<span>—</span>
					}
				</div>
			),
		},
		{
			title: '操作时间',
			dataIndex: 'audit_time',
			key: 'audit_time',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '测试',
			dataIndex: 'test_status',
			key: 'test_status',
			align: 'center',
			filters: modelTestList,
			width: 70,
			render: (_text, _record, _index) => (
				//(1, "未开始测试") (2, "测试中") (3, "测试成功") (4, "测试失败")
				<span className={"w-full h-full inline-flex justify-center items-center"}>
					{
						_text === 1 && <span className={'flex items-center'}>—</span>
					}
					{
						_text === 2 && <img src={Running} alt="" style={{width: '14px', height: '14px'}} className={'rotate'}/>
					}
					{
						_text === 3 && <img src={RunSuccess} alt="" style={{width: '14px', height: '14px'}}/>
					}
					{
						_text === 4 && <img src={RunError} alt="" style={{width: '14px', height: '14px'}}/>
					}
				</span>
			),
		},
		{
			title: '风险报告',
			dataIndex: '风险报告',
			align: 'center',
			width: 72,
			render: (_text, _record, _index) => (
				<div className={"w-full flex justify-center items-center text-xs leading-3"}>
					{
						_text &&
						<div className={"flex justify-center items-center"}>
							{
								_text.status === '评估中' &&
								<span className={"flex items-center font-medium text-[#4A83D6]"}>评估中...</span>
							}
							{
								_text.status === '评估失败' &&
								<span className={"flex items-center font-medium text-[#F17584]"}>评估失败</span>
							}
							{
								_text.status === '评估成功' &&
								<div className={`w-[24px] h-[24px] flex justify-center items-center rounded-xl cursor-pointer
							${_text.number<=3?"bg-[#f2f9fa] text-[#55ADB7] hover:text-[#358B94]":""}
							${(_text.number>3 && _text.number<8)?"bg-[#fffaf4] text-[#E69322] hover:text-[#C57C18]":""}
							${_text.number>=8?"bg-[#fff4f2] text-[#FE6450] hover:text-[#D54735]":""}
					 `} onClick={_e=>goRiskAssessmentReport(_index)}>
									{_text.number}
								</div>
							}
						</div>
					}
					{
						!_text && <span className={'w-full flex items-center'}>—</span>
					}
				</div>
			),
		},
		{
			title: '备注',
			dataIndex: 'audit_info',
			width: 130,
			render: (_text, _record, _index) => (
				<Tooltip title={(_text?.report && _text?.report.length > 8) ? _text?.report : null}
				         overlayClassName='my-model-table'>
					<span className={'w-full text-hidden'}>{_text?.report ? _text?.report : '—'}</span>
				</Tooltip>
			),
		},
		{
			title: '操作',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 226,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex items-center text-table-icon"}>
					<Tooltip title="查看" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-[#3683dd]`}
                  onClick={() => handleView(index)}><ViewSvg/></span>
          </Tooltip>
					<Tooltip title="编辑" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.sub_status_desc!=='发布中' && _record.sub_status_desc!=='已发布')?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.sub_status_desc!=='发布中' && _record.sub_status_desc!=='已发布')?()=>handleEdit(index):null}><EditSvg /></span>
          </Tooltip>
					<Tooltip title="测试" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.sub_status_desc!=='发布中' && _record.sub_status_desc!=='已发布')?'hover:cursor-pointer hover:text-[#00aab4]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.sub_status_desc!=='发布中' && _record.sub_status_desc!=='已发布')?()=>handleTest(index):null}><TestSvg /></span>
          </Tooltip>
					<Tooltip title="风险评估" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record?.风险报告?.status!=='评估中')?'hover:cursor-pointer hover:text-[#E57F3F]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record?.风险报告?.status!=='评估中')?() => handleRiskAssessment(index):null}><RiskAssessmentSvg/></span>
          </Tooltip>
					<Tooltip title="上线" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${( (_record.sub_status_desc==='未发布'&&_record.test_status===3) || _record.sub_status_desc==='发布失败' || _record.sub_status_desc==='已下线' || _record.sub_status_desc==='未上线')?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={( (_record.sub_status_desc==='未发布'&&_record.test_status===3) || _record.sub_status_desc==='发布失败' || _record.sub_status_desc==='已下线' || _record.sub_status_desc==='未上线')?() => handleOnline(index):null}><OnlineSvg/></span>
          </Tooltip>
					<Tooltip title="下线" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.sub_status_desc==='已发布')?'hover:cursor-pointer hover:text-[#f47929]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.sub_status_desc==='已发布')?() => handleOffline(index):null}><OfflineSvg/></span>
          </Tooltip>
					<Tooltip title="删除" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.sub_status_desc!=='发布中' && _record.sub_status_desc!=='已发布')?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.sub_status_desc!=='发布中' && _record.sub_status_desc!=='已发布')?()=>handleDelete(index):null}><DeleteSvg /></span>
          </Tooltip>
				</span>
			),
		},
	]
	// mounted
	// 初始化函数
	useEffect(() => {
		init()
	}, []);
	// methods
	const init = async () => {
		await getModelTypeList()
	}
	const getModelTypeList = async () => {
		setLoading(true)
		const {data} = await get('/drapi/comp/model/types')
		let list = []
		for (let i = 0; i < data.model_types.length; i++) {
			list.push({
				key: data.model_types[i].id,
				text: data.model_types[i].name,
				value: data.model_types[i].id,
			})
		}
		modelTypeList.current = list
		search()
	}
	const keydown = (e) => {
		if (e.keyCode === 13) {
			changeKeyword()
		}
	}
	const changeKeyword = () => {
		pageNum.current = 1
		search()
	}
	// 跳转到测试报告页面
	// @ts-ignore
	const goTestReport = (index) => {
		console.log(`goTestReport record at index ${index}`);
		selectedItem.current = data[index]
		history.push({
			pathname: '/oam/model-management/official-model/test-report/' + data[index].id,
		})
	}
	// 跳转到风险评估报告页面
	const goRiskAssessmentReport = (index) => {
		console.log(`goRiskAssessmentReport record at index ${index}`);
		selectedItem.current = data[index]
		history.push({
			pathname: '/oam/model-management/official-model/risk-assessment-report/' + data[index].id,
		})
	}
	const handleView = (index) => {
		console.log(`View record at index ${index}`);
		selectedItem.current = data[index]
		history.push({
			pathname: '/oam/model-management/official-model/detail/' + data[index].id,
		})
	};
	const handleRiskAssessment = (index) => {
		console.log(`RiskAssessment record at index ${index}`);
		selectedItem.current = data[index]
		setShowRiskAssessmentModal(true)
	}
	const handleOnline = (index) => {
		selectedItem.current = data[index]
		setShowOnlineModal(true)
	}
	const handleOffline = (index) => {
		selectedItem.current = data[index]
		setShowOfflineModal(true)
	}
	// @ts-ignore
	const getListFlase = (_params) => {
		return new Promise((resolve, _reject) => {
			setTimeout(() => {
				let list = []
				for (let i = pageSize.current * (pageNum.current-1); i < pageSize.current * pageNum.current; i++) {
					list.push(
						{
							"model_file": {
								"mirror_image": "harbor.aiforgovernance.com/ai/custom-model-paddlespeech:latest"
							},
							"model_framework": "other",
							"cover": "http://minio.model-hubs.cn/web-static/model-cover/202306/tnxecsvSIw.png",
							"abstract": "人脸识别001",
							"description": "# 一、模型任务：\n图像分类，根据各自在图像信息中所反映的不同特征，把不同类别的目标区分开来的图像处理方法。它利用计算机对图像进行定量分析，把图像或图像中的每个像元或区域划归为若干个类别中的某一种，以代替人的视觉判读。\n![](http://minio.model-hubs.cn/web-static/avatar/202306/SFEyqQmWIr.png)\n# 二、模型场景：\n道路积雪识别有助于大雪天气的道路路面实时预警，提醒城市环卫及时打扫，有助于城市智能化管理。\n![](http://minio.model-hubs.cn/web-static/avatar/202306/LYi3juTVPx.png)\n# 三、模型描述：\n深度残差网络（ResNet）由微软研究院的何恺明、张祥雨、任少卿、孙剑提出。研究动机是为了解决深度网络的退化问题，不同于过去的网络是通过学习去拟合一个分布，ResNet通过学习去拟合相对于上一层输出的残差。实验表明，ResNet能够通过增加深度来提升性能，而且易于优化，参数量更少，在许多常用数据集上有非常优秀的表现。ResNet 在2015 年的ILSVRC（ImageNet Large Scale Visual Recognition Challenge）中取得了冠军。\n# 四、训练数据：\n训练数据7000张路面有雪无雪图片\n\n| 标签 | 编码 |\n| --- | --- |\n| 有雪 | 0 |\n| 没雪 | 1 |\n# 五、训练流程\n深度残差网络（ResNet）由微软研究院的何恺明、张祥雨、任少卿、孙剑提出。研究动机是为了解决深度网络的退化问题，不同于过去的网络是通过学习去拟合一个分布，ResNet通过学习去拟合相对于上一层输出的残差。实验表明，ResNet能够通过增加深度来提升性能，而且易于优化，参数量更少，在许多常用数据集上有非常优秀的表现。ResNet 在2015 年的ILSVRC（ImageNet Large Scale Visual Recognition Challenge）中取得了冠军。",
							"comp_menu_id": 26,
							"icon_id": 19,
							"model_addr": null,
							"mirror_image": "harbor.aiforgovernance.com/ai/custom-model-paddlespeech:latest",
							"label_mapping": {
								"女": "1",
								"男": "0"
							},
						},
					)
				}
				resolve({
					code: 200,
					data: {
						list,
						total_num: 100,
					},
					desc: '',
				})
			}, 200)
		})
	}
	// @ts-ignore
	const search = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			model_type_id: filterTypeList.current,
			sub_status: filterStatusList.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
		}
		console.log(params)
		setLoading(true)
		const res = await get('/drapi/oam/platform/comps', params)
		// const res = await getListFlase(params)
		// @ts-ignore
		for (let i = 0; i < res.data.list.length; i++) {
			// @ts-ignore
			res.data.list[i] = {
				// @ts-ignore
				...res.data.list[i],
				// @ts-ignore
				key: res.data.list[i].id,
			}
		}
		// 判断是否为特殊情况,data.total_num>0,但是data.list为空,而且pageNum.current>1
		if (res.data.total_num > 0 && res.data.list.length === 0 && pageNum.current > 1) {
			pageNum.current -= 1
			search()
			return
		}
		// @ts-ignore
		setData(res.data.list)
		// @ts-ignore
		setPageSum(res.data.total_num)
		setLoading(false)
		first.current = false
	}
	// 分页相关
	const onShowSizeChange = (_current, newPageSize) => {
		console.log('into onShowSizeChange: _current: ', _current, ' ,newPageSize: ', newPageSize)
		console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
		pageNum.current = 1
		pageSize.current = newPageSize
		pageSizeChange.current = true
		console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
	};
	const changePageNum = (value) => {
		console.log('into changePageNum,嘿嘿嘿,传入的value为：', value)
		console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
		if (pageSizeChange.current === true) {
			pageSizeChange.current = false
		} else {
			pageNum.current = value
		}
		console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
		search()
	}
	const handleChange = (pagination, filters, sorter) => {
		console.log('Various parameters', pagination, filters, sorter);
		filterTypeList.current = filters.model_type_desc
		filterStatusList.current = filters.sub_status_desc
		orderByAsc.current = null
		orderByDesc.current = null
		if (sorter && sorter.order) {
			if (sorter.order === 'ascend') {
				orderByAsc.current = sorter.columnKey
			} else if (sorter.order === 'descend') {
				orderByDesc.current = sorter.columnKey
			}
		}
		search()
	};
	// 多选选择的项
	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys);
		let newSelectedRows = []
		newSelectedRowKeys.forEach(
			(item) => {
				for (let i = 0; i < data.length; i++) {
					if (data[i].id === item) {
						newSelectedRows.push(data[i])
					}
				}
			}
		)
		setSelectedRows(newSelectedRows)
		setSelectedRowKeys(newSelectedRowKeys);
	};
	// 多选选择的项
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	// @ts-ignore
	const [selectedRows, setSelectedRows] = useState<any[]>([]);
	// 单选选择的项
	const selectedItem = useRef(null);
	const rowSelection = {
		selectedRowKeys: selectedRowKeys,
		onChange: onSelectChange,
	};
	// 弹框
	// 上线弹框
	const onlineModalOnOk = async (_data) => {
		console.log('into OnlineModalOnOk')
		console.log(_data)
		let params = null
		if(selectedItem.current.type_desc!=='新建非部署模型') {
			params = {
				..._data,
			}
		}
		await post(`/drapi/oam/comps/publish/${selectedItem.current.id}`, params)
		setShowOnlineModal(false)
		message.success('上线成功')
		search()
	}
	const onlineModalOnCancel = () => {
		console.log('into OnlineModalOnCancel')
		setShowOnlineModal(false)
	}
	// 下线弹框
	const offlineModalOnOk = async (_data) => {
		console.log('into OfflineModalOnOk')
		console.log(_data)
		await post(`/drapi/oam/comps/offline/${selectedItem.current.id}`)
		setShowOfflineModal(false)
		message.success('下线成功')
		search()
	}
	const offlineModalOnCancel = () => {
		console.log('into OfflineModalOnCancel')
		setShowOfflineModal(false)
	}
	// 批量下线
	const batchOfflineModalOnOk = (_data) => {
		console.log('into BatchOfflineModalOnOk')
		console.log(_data)
		setShowBatchOfflineModal(false)
		message.success('批量下线成功')
	}
	const batchOfflineModalOnCancel = () => {
		console.log('into BatchOfflineModalOnCancel')
		setShowBatchOfflineModal(false)
	}
	// 风险评估弹框
	const RiskAssessmentModalOnOk = (_data) => {
		console.log('into RiskAssessmentModalOnOk')
		console.log(_data)
		setShowRiskAssessmentModal(false)
		message.success('开始风险评估成功')
		search()
	}
	const RiskAssessmentModalOnCancel = () => {
		console.log('into RiskAssessmentModalOnCancel')
		setShowRiskAssessmentModal(false)
	}
	// 批量上线弹框
	const batchOnlineModalOnOk = (_data) => {
		console.log('into BatchOnlineModalOnOk')
		console.log(_data)
		setShowBatchOnlineModal(false)
		message.success('批量上线成功')
	}
	const batchOnlineModalOnCancel = () => {
		console.log('into BatchOnlineModalOnCancel')
		setShowBatchOnlineModal(false)
	}
	// 跳转到编辑页面
	const handleEdit = (index) => {
		selectedItem.current = data[index]
		history.push({
			pathname: '/oam/model-management/official-model/detail/' + data[index].id,
			params: {
				data: data[index],
				isEdit: true,
			}
		})
	}
	// 展示测试弹框
	const handleTest = async (index) => {
		selectedItem.current = data[index]
		// (0, "未知状态") ok
		// (1, "未开始测试") ok
		// (2, "测试中") ok
		// (3, "测试成功")
		// (4, "测试失败")
		if (selectedItem.current.type_desc === '新建非部署模型') {
			if (selectedItem.current?.experiment_id) {
				window.open(location.origin + '/oam/experiment/drag/test/' + selectedItem.current.experiment_id)
			} else {
				const params = {
					name: '测试实验-' + selectedItem.current.name,
					description: '测试实验-' + selectedItem.current.name,
					type: 1,
					is_test: 1,
					comp_id: selectedItem.current.id,
				}
				const {data} = await saveExperiment(params)
				message.success('创建实验成功')
				search()
				window.open(location.origin + '/oam/experiment/drag/test/' + data.id)
			}
			return
		}
		if (selectedItem.current.test_status === 1 || selectedItem.current.test_status === 0) {
			setShowTestModal(true)
		} else if (selectedItem.current.test_status === 2 || selectedItem.current.test_status === 3 || selectedItem.current.test_status === 4) {
			// 如果存在experiment_id，则跳转到实验详情页面,否则打开test的第二个弹框
			if (selectedItem.current.experiment_id) {
				window.open(location.origin + '/oam/experiment/drag/test/' + selectedItem.current.experiment_id)
			} else {
				setShowTestModalSecond(true)
			}
		}
	}
	const testModalOnOk = async (_data) => {
		console.log('into testModalOnOk, _data: ', _data)
		const params = {
			comp_id: selectedItem.current.id,
			..._data,
		}
		const res = await post('/drapi/oam/platform/comps/test', params)
		console.log('res: ', res)
		setShowTestModal(false)
		search()
		setShowTestModalSecond(true)
	}
	const testModalOnCancel = () => {
		setShowTestModal(false)
	}
	// 展示测试弹框second
	const resetTest = () => {
		setShowTestModalSecond(false)
		setShowTestModal(true)
	}
	const testModalSecondOnCancel = () => {
		setShowTestModalSecond(false)
		search()
	}
	// 批量删除弹框
	const batchDeleteModalOnOk = (_data) => {
		console.log('into BatchDeleteModalOnOk')
		console.log(_data)
		setShowBatchDeleteModal(false)
		message.success('批量删除成功')
	}
	const batchDeleteModalOnCancel = () => {
		console.log('into BatchDeleteModalOnCancel')
		setShowBatchDeleteModal(false)
	}
	// 展示删除弹框
	const handleDelete = (index) => {
		selectedItem.current = data[index]
		setShowDeleteModal(true)
	}

	const deleteModalOnOk = async () => {
		await del('/drapi/oam/platform/comps/'+selectedItem.current.id, null)
		message.success('删除成功')
		if (data.length === 1 && pageNum.current > 1) {
			pageNum.current -= 1
		}
		search()
		setShowDeleteModal(false)
	}
	const deleteModalOnCancel = () => {
		setShowDeleteModal(false)
	}
	// 创建弹框
	const createModalOnOk = (_data) => {
		console.log('into CreateModalOnOk')
		console.log(_data)
		setShowCreateModal(false)
		history.push({
			pathname: '/oam/model-management/official-model/create/'+_data.type,
		})
	}
	const createModalOnCancel = () => {
		console.log('into CreateModalOnCancel')
		setShowCreateModal(false)
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '模型管理', iconSvg: ModelManagementSvg, disabled: true},
					{label: '官方模型', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
				{/*搜索和按钮*/}
				<div className={"w-full h-[36px] flex justify-between items-center"}>
					{/*search框筛选*/}
					<SearchBig placeholder='请输入模型名称'
					           ml={false}
					           style={{width: '284px'}}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e => keydown(e)}/>
					{/*右*/}
					<div className={"flex items-center"}>
						<ButtonMain text={'创建'}
						            click={()=>setShowCreateModal(true)}
						            style={{width: '90px', height: '28px'}}
						            showShadow={true}/>
						<ButtonFifth text={'批量上线'}
						             disabled={selectedRows.length === 0 || !selectedRows.every(_item=>( (_item.sub_status_desc==='未发布'&&_item.test_status===3) || _item.sub_status_desc==='发布失败' || _item.sub_status_desc==='已下线' || _item.sub_status_desc==='未上线'))}
						             click={()=>setShowBatchOnlineModal(true)}
						             style={{width: '90px', height: '28px'}}
						             className={"ml-4"}/>
						<ButtonFifth text={'批量下线'}
						             disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.sub_status_desc==='已发布'))}
						             click={()=>setShowBatchOfflineModal(true)}
						             style={{width: '90px', height: '28px'}}
						             className={"ml-4"}/>
						<ButtonFifth text={'批量删除'}
						             disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.sub_status_desc!=='发布中' && _item.sub_status_desc!=='已发布'))}
						             click={()=>setShowBatchDeleteModal(true)}
						             style={{width: '90px', height: '28px'}}
						             className={"ml-4"}/>
					</div>
				</div>
				{/*表格和分页*/}
				<div className={"mt-2 w-full"}>
					<Table
						size='small'
						rowSelection={rowSelection}
						loading={loading}
						dataSource={data}
						// @ts-ignore
						columns={columns}
						onChange={handleChange}
						pagination={false}
						scroll={{x: 'max-content'}} // 设置自适应宽度
					/>
				</div>
				{/*分页*/}
				<div className="mt-6 pb-6 w-full flex justify-center">
					{
						pageSum > 10 &&
						<Pagination showSizeChanger
												showQuickJumper
												showTitle={false}
												showTotal={total => `共${total}条`}
												onShowSizeChange={onShowSizeChange}
												onChange={value => changePageNum(value)}
												defaultPageSize={pageSize.current}
												defaultCurrent={1}
												pageSizeOptions={[10, 20, 30, 40]}
												current={pageNum.current}
												total={pageSum}/>
					}
				</div>
			</div>
			{/*弹窗*/}
			{/*上线弹框*/}
			<OnlineModal title={'上线'}
			             show={showOnlineModal && selectedItem.current.type_desc!=='新建非部署模型'}
			             data={selectedItem.current}
			             onOk={onlineModalOnOk}
			             onCancel={onlineModalOnCancel}/>
			{/*非部署模型上线*/}
			<DraggableModalPrompt
				show={showOnlineModal && selectedItem.current.type_desc==='新建非部署模型'}
				onOk={onlineModalOnOk}
				onCancel={onlineModalOnCancel}>
				<span className="text-sm text-black">确定上线<span className="text-main pl-1 pr-1">{selectedItem.current?.name}</span>模型吗？</span>
			</DraggableModalPrompt>
			<OfflineModal title={'下线'}
			              show={showOfflineModal}
			              data={selectedItem.current}
			              onOk={offlineModalOnOk}
			              onCancel={offlineModalOnCancel}/>
			<RiskAssessmentModal title={'风险评估'}
			                     show={showRiskAssessmentModal}
			                     data={selectedItem.current}
			                     onOk={RiskAssessmentModalOnOk}
			                     onCancel={RiskAssessmentModalOnCancel}/>
			<BatchOnlineModal title={'批量上线'}
			                  show={showBatchOnlineModal}
			                  data={selectedRows}
			                  onOk={batchOnlineModalOnOk}
			                  onCancel={batchOnlineModalOnCancel}/>
			<BatchOfflineModal title={'批量下线'}
			                   show={showBatchOfflineModal}
			                   data={selectedRows}
			                   onOk={batchOfflineModalOnOk}
			                   onCancel={batchOfflineModalOnCancel}/>
			<TestModal title={'启动测试服务'}
			           show={showTestModal}
			           data={selectedItem.current}
			           onOk={testModalOnOk}
			           onCancel={testModalOnCancel}/>
			<TestModalSecond title='提示'
			                 show={showTestModalSecond}
			                 data={{
												 ...selectedItem.current,
				                 url: '/drapi/oam/platform/comps/test',
			                 }}
			                 onReset={resetTest}
			                 onCancel={testModalSecondOnCancel}/>
			{/*批量删除弹框*/}
			<DraggableModalPrompt show={showBatchDeleteModal}
			                      onOk={batchDeleteModalOnOk}
			                      onCancel={batchDeleteModalOnCancel}>
				<span className={"flex items-center text-sm leading-[14px]"}>确定批量删除<span className={"ml-1 mr-1 flex items-center text-main"}>{selectedRows.length}</span>个模型吗?</span>
			</DraggableModalPrompt>
			{/*删除弹框*/}
			<DraggableModalPrompt
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-sm text-black">确定删除<span className="text-main pl-1 pr-1">{selectedItem.current?.name}</span>模型吗？</span>
			</DraggableModalPrompt>
			{/*创建弹框*/}
			<CreateModal title={'请选择创建方式'}
			             show={showCreateModal}
			             data={null}
			             onOk={createModalOnOk}
			             onCancel={createModalOnCancel}/>
		</div>
	)
}
