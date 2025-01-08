import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import NavigationComponent from "../../../components/NavigationComponent";
import ModelManagementSvg from "../../layout/icon/ModelManagementSvg";
import SearchBig from "../../../components/SearchBig";
import ButtonMain from "../../../components/ButtonMain";
import ButtonFifth from "../../../components/ButtonFifth";
import {message, Pagination, Popover, Table, Tooltip} from "antd";
import ViewSvg from "../../../icon/table/ViewSvg";
import {get, post} from "../../../axios";
import {PopoverContent} from "../../../view/data-element/common/PopoverContent";
import {formatPhone} from "../../../utils/util";
import {userModelStatusList} from "./util";
import StatusShow from "./components/StatusShow";
import TestingReportSvg from "../../icon/TestingReportSvg";
import RiskAssessmentSvg from "../../icon/RiskAssessmentSvg";
import ReviewSvg from "../../icon/ReviewSvg";
import OnlineSvg from "../../icon/OnlineSvg";
import OfflineSvg from "../../icon/OfflineSvg";
import ReviewModal from "./components/ReviewModal";
import OnlineModal from "../components/OnlineModal";
import OfflineModal from "../components/OfflineModal";
import BatchOfflineModal from "../components/BatchOfflineModal";
import RiskAssessmentModal from "../components/RiskAssessmentModal";
import BatchPassModal from "./components/BatchPassModal";
import BatchOnlineModal from "../components/BatchOnlineModal";
import BatchRejectModal from "./components/BatchRejectModal";

export default function UserModel() {
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
	// 审核弹框
	const [showReviewModal, setShowReviewModal] = useState(false);
	// 上线弹框
	const [showOnlineModal, setShowOnlineModal] = useState(false);
	// 下线弹框
	const [showOfflineModal, setShowOfflineModal] = useState(false);
	// 批量通过弹框
	const [showBatchPassModal, setShowBatchPassModal] = useState(false);
	// 批量驳回弹框
	const [showBatchRejectModal, setShowBatchRejectModal] = useState(false);
	// 批量上线弹框
	const [showBatchOnlineModal, setShowBatchOnlineModal] = useState(false);
	// 批量下线弹框
	const [showBatchOfflineModal, setShowBatchOfflineModal] = useState(false);
	// 风险评估弹框
	const [showRiskAssessmentModal, setShowRiskAssessmentModal] = useState(false);
	// 顶部状态数量
	const [statusNumStatList, setStatusNumStatList] = useState([]);
	// 多选选择的项
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	// @ts-ignore
	const [selectedRows, setSelectedRows] = useState<any[]>([]);
	// 单选选择的项
	const selectedItem = useRef(null);

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 40,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
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
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '版本',
			dataIndex: 'version',
			key: 'version',
			width: 56,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '提交者',
			dataIndex: 'user',
			width: 116,
			render: (_text, _record, _index) => (
				<div className={"w-full flex"}>
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
				</div>
			),
		},
		{
			title: '提交时间',
			dataIndex: 'apply_time',
			key: 'apply_time',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '申请资源',
			dataIndex: '申请资源',
			key: '申请资源',
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
			title: '状态',
			dataIndex: 'sub_status_desc',
			filters: userModelStatusList,
			width: 110,
			render: (_text, _record, _index) => (
				<StatusShow status={_text}/>
			),
		},
		{
			title: '审核者',
			dataIndex: 'audit_info',
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
			title: '处理时间',
			dataIndex: 'audit_time',
			key: 'audit_time',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '测试报告',
			dataIndex: '测试报告',
			align: 'center',
			width: 72,
			render: (_text, _record, _index) => (
				<div className={"w-full flex justify-center items-center cursor-pointer text-[#55ADB7] hover:text-[#358B94]"}
				     onClick={_e=>goTestReport(_index)}>
					<TestingReportSvg/>
				</div>
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
						_text?.status === '评估中' &&
						<span className={"flex items-center font-medium text-[#4A83D6]"}>评估中...</span>
					}
					{
						_text?.status === '评估失败' &&
						<span className={"flex items-center font-medium text-[#F17584]"}>评估失败</span>
					}
					{
						_text?.status === '评估成功' &&
						<div className={`w-[24px] h-[24px] flex justify-center items-center rounded-xl cursor-pointer
							${_text.number<=3?"bg-[#f2f9fa] text-[#55ADB7] hover:text-[#358B94]":""}
							${(_text.number>3 && _text.number<8)?"bg-[#fffaf4] text-[#E69322] hover:text-[#C57C18]":""}
							${_text.number>=8?"bg-[#fff4f2] text-[#FE6450] hover:text-[#D54735]":""}
					 `} onClick={_e=>goRiskAssessmentReport(_index)}>
							{_text.number}
						</div>
					}
					{
						<span className={"w-full flex items-center"}>{'—'}</span>
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
			width: 166,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex items-center text-table-icon"}>
					<Tooltip title="查看" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-[#3683dd]`}
                  onClick={() => handleView(index)}><ViewSvg/></span>
          </Tooltip>
					<Tooltip title="风险评估" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.sub_status_desc!=='发布中')?'hover:cursor-pointer hover:text-[#00aab4]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.sub_status_desc!=='发布中')?() => handleRiskAssessment(index):null}><RiskAssessmentSvg/></span>
          </Tooltip>
					<Tooltip title="审核" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.sub_status_desc==='发布审核中'||_record.sub_status_desc==='下线审核中')?'hover:cursor-pointer hover:text-[#f47929]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.sub_status_desc==='发布审核中'||_record.sub_status_desc==='下线审核中')?() => handleReview(index):null}><ReviewSvg/></span>
          </Tooltip>
					<Tooltip title="上线" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.sub_status_desc==='发布失败'||_record.sub_status_desc==='已下线')?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.sub_status_desc==='发布失败'||_record.sub_status_desc==='已下线')?() => handleOnline(index):null}><OnlineSvg/></span>
          </Tooltip>
					<Tooltip title="下线" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.sub_status_desc==='已发布')?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.sub_status_desc==='已发布')?() => handleOffline(index):null}><OfflineSvg/></span>
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
	const goTestReport = (index) => {
		console.log(`goTestReport record at index ${index}`);
		selectedItem.current = data[index]
		history.push({
			pathname: '/oam/model-management/user-model/test-report/' + data[index].id,
		})
	}
	// 跳转到风险评估报告页面
	const goRiskAssessmentReport = (index) => {
		console.log(`goRiskAssessmentReport record at index ${index}`);
		selectedItem.current = data[index]
		history.push({
			pathname: '/oam/model-management/user-model/risk-assessment-report/' + data[index].id,
		})
	}
	const handleView = (index) => {
		console.log(`View record at index ${index}`);
		selectedItem.current = data[index]
		history.push({
			pathname: '/oam/model-management/user-model/detail/' + data[index].id,
		})
	};
	const handleRiskAssessment = (index) => {
		console.log(`RiskAssessment record at index ${index}`);
		selectedItem.current = data[index]
		setShowRiskAssessmentModal(true)
	}
	const handleReview = (index) => {
		selectedItem.current = data[index]
		setShowReviewModal(true)
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
				}
				resolve({
					code: 200,
					data: {
						list,
						total_num: 100,
					},
					desc: '',
				})
			}, 1000)
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
		const res = await get('/drapi/oam/user/comps', params)
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
		setStatusNumStatList(res.data.status_num_stat)
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
	const rowSelection = {
		selectedRowKeys: selectedRowKeys,
		onChange: onSelectChange,
	};
	// 弹框
	// 审核弹框
	const reviewModalOnOk = async (_data) => {
		console.log('into ReviewModalOnOk')
		console.log(_data)
		const params = {
			comp_id: selectedItem.current.id,
			audit_status: 1,
			..._data,
		}
		await post('/drapi/oam/user/comps/audit', params)
		setShowReviewModal(false)
		message.success('审核通过成功')
		search()
	}
	const reviewModalOnCancel = () => {
		console.log('into ReviewModalOnCancel')
		setShowReviewModal(false)
	}
	const reviewModalOnReject = async (_data) => {
		console.log('into ReviewModalOnReject')
		console.log(_data)
		const params = {
			comp_id: selectedItem.current.id,
			audit_status: 2,
			..._data,
		}
		await post('/drapi/oam/user/comps/audit', params)
		setShowReviewModal(false)
		message.success('审核驳回成功')
		search()
	}
	// 上线弹框
	const onlineModalOnOk = async (_data) => {
		console.log('into OnlineModalOnOk')
		console.log(_data)
		const params = {
			..._data,
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
	// 批量驳回
	const batchRejectModalOnOk = (_data) => {
		console.log('into BatchRejectModalOnOk')
		console.log(_data)
		setShowBatchRejectModal(false)
		message.success('批量驳回成功')
	}
	const batchRejectModalOnCancel = () => {
		console.log('into BatchRejectModalOnCancel')
		setShowBatchRejectModal(false)
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
	// 批量通过
	const batchPassModalOnOk = (_data) => {
		console.log('into BatchPassModalOnOk')
		console.log(_data)
		setShowBatchPassModal(false)
		message.success('批量通过成功')
	}
	const batchPassModalOnCancel = () => {
		console.log('into BatchPassModalOnCancel')
		setShowBatchPassModal(false)
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
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '模型管理', iconSvg: ModelManagementSvg, disabled: true},
					{label: '用户模型', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
				{/*标签*/}
				<div className={"w-full h-[14px] flex"}>
					{
						statusNumStatList?.map((item, index) => (
							<span key={index}
							      className={"w-[155px] flex items-center text-sm leading-[14px]"}>{item?.key}({item?.value})</span>
						))
					}
				</div>
				{/*搜索和按钮*/}
				<div className={"mt-4 w-full h-[36px] flex justify-between items-center"}>
					{/*search框筛选*/}
					<SearchBig placeholder='请输入模型名称'
					           ml={false}
					           style={{width: '284px'}}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e => keydown(e)}/>
					{/*右*/}
					<div className={"flex items-center"}>
						<ButtonMain text={'批量通过'}
						            disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.sub_status_desc==='发布审核中'||_item.sub_status_desc==='发布被驳回'||_item.sub_status_desc==='下线审核中'||_item.sub_status_desc==='下线被驳回'))}
						            click={()=>setShowBatchPassModal(true)}
						            style={{width: '90px', height: '28px'}}
						            showShadow={true}/>
						<ButtonFifth text={'批量驳回'}
						             disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.sub_status_desc==='发布审核中'||_item.sub_status_desc==='发布被驳回'||_item.sub_status_desc==='下线审核中'||_item.sub_status_desc==='下线被驳回'))}
						             click={()=>setShowBatchRejectModal(true)}
						             style={{width: '90px', height: '28px'}}
						             className={"ml-4"}/>
						<ButtonFifth text={'批量下线'}
						             disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.sub_status_desc==='已发布'))}
						             click={()=>setShowBatchOfflineModal(true)}
						             style={{width: '90px', height: '28px'}}
						             className={"ml-4"}/>
						<ButtonFifth text={'批量上线'}
						             disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.sub_status_desc==='发布失败'||_item.sub_status_desc==='已下线'))}
						             click={()=>setShowBatchOnlineModal(true)}
						             style={{width: '90px', height: '28px'}}
						             className={"ml-4"}/>
						<ButtonFifth text={'批量评估'}
						             disabled={selectedRows.length === 0 || !selectedRows.every(_item=>(_item.sub_status_desc!=='发布中'))}
						             click={null}
						             style={{width: '90px', height: '28px'}}
						             className={"ml-4 hidden"}/>
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
			<ReviewModal title={'审核'}
			             show={showReviewModal}
			             data={selectedItem.current}
			             onOk={reviewModalOnOk}
			             onCancel={reviewModalOnCancel}
			             onReject={reviewModalOnReject}/>
			<OnlineModal title={'上线'}
			             show={showOnlineModal}
			             data={selectedItem.current}
			             onOk={onlineModalOnOk}
			             onCancel={onlineModalOnCancel}/>
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
			<BatchRejectModal title={'批量驳回'}
			                  show={showBatchRejectModal}
			                  data={selectedRows}
			                  onOk={batchRejectModalOnOk}
			                  onCancel={batchRejectModalOnCancel}/>
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
			<BatchPassModal title={'批量通过'}
			                   show={showBatchPassModal}
			                   data={selectedRows}
			                   onOk={batchPassModalOnOk}
			                   onCancel={batchPassModalOnCancel}/>
		</div>
	)
}
