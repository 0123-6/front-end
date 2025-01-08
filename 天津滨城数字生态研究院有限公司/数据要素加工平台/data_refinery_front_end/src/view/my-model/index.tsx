import React, {useEffect, useRef, useState} from "react";
import SearchBig from "../../components/SearchBig";
import { useHistory } from 'react-router-dom';
import {message, Pagination, Table, Tooltip} from "antd";
import ViewSvg from "../../icon/table/ViewSvg";
import EditSvg from "../../icon/table/EditSvg";
import DeleteSvg from "../../icon/table/DeleteSvg";
import {
	modelStatusList,
	modelTestList,
} from "./static";
import PublishSvg from "../../icon/table/PublishSvg";
import TestSvg from "../../icon/table/TestSvg";
import OfflineSvg from "../../icon/table/OfflineSvg";
import StatusShow from "./components/StatusShow";
import RunSuccess from "../../icon/table/status/运行成功.svg";
import RunError from "../../icon/table/status/运行失败.svg";
import ButtonMain from "../../components/ButtonMain";
import ApplyPublishModal from "./components/ApplyPublishModal";
import TestModal from "./components/TestModal";
import TestModalSecond from "./components/TestModalSecond";
import ApplyOfflineModal from "./components/ApplyOfflineModal";
import {del, get, post} from "../../axios";
import DraggableModalPrompt from "../../components/draggable-modal/draggable-modal-prompt";
import Running from "../../icon/table/status/运行中.svg";

export default function MyModel() {
	// state
	const history = useHistory();
	const keyword = useRef('')
	// 类型
	const filterTypeList = useRef([])
	const filterStatusList = useRef([])
	const filterTestStatusList = useRef([])
	// 升降序
	// 升序
	const orderByAsc = useRef('')
	// 降序
	const orderByDesc = useRef('')

	const pageSize = useRef(10);
	const pageSizeChange = useRef(false);
	const pageNum = useRef(1);
	const [pageSum, setPageSum] = useState(0);
	const [loading,setLoading] = useState(false);
	const [data, setData] = useState([]);
	// 单选选择的项
	const selectedItem = useRef(null);
	// 展示弹框
	const [showDeleteModal,setShowDeleteModal] = useState(false);
	// 申请发布弹框
	const [showApplyPublishModal,setShowApplyPublishModal] = useState(false);
	// 测试弹框
	const [showTestModal,setShowTestModal] = useState(false);
	// 测试弹框2
	const [showTestModalSecond,setShowTestModalSecond] = useState(false);
	// 申请下线弹框
	const [showApplyOfflineModal,setShowApplyOfflineModal] = useState(false);
	// 模型类型列表
	const modelTypeList = useRef([]);
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
			width: 56,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '创建时间',
			dataIndex: 'created_at',
			key: 'created_at',
			sorter:true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '模型状态',
			dataIndex: 'status_desc',
			filters: modelStatusList,
			width: 110,
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
			title: '反馈时间',
			dataIndex: 'updated_at',
			key: 'updated_at',
			sorter:true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '备注',
			dataIndex: 'audit_info',
			key: '备注',
			width: 100,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text?.report) && (_text?.report)?.length>6)?(_text?.report):null} overlayClassName='my-model-table'>
					<span className={'w-full text-hidden'}>{(_text?.report)?(_text?.report):'—'}</span>
				</Tooltip>
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
			title: '操作',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 196,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex items-center text-table-icon"}>
          <Tooltip title="查看" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-[#0083e4]`}
                  onClick={() => handleView(index)}><ViewSvg /></span>
          </Tooltip>
          <Tooltip title="编辑" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='未发布' || _record.status_desc==='发布被驳回' || _record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未发布' || _record.status_desc==='发布被驳回' || _record.status_desc==='已下线')?()=>handleEdit(index):null}><EditSvg /></span>
          </Tooltip>
					<Tooltip title="测试" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='未发布' || _record.status_desc==='发布被驳回' || _record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#00aab4]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未发布' || _record.status_desc==='发布被驳回' || _record.status_desc==='已下线')?()=>handleTest(index):null}><TestSvg /></span>
          </Tooltip>
					<Tooltip title="申请发布" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${((_record.status_desc==='未发布'||_record.status_desc==='已下线')&&_record.test_status===3 || _record.status_desc==='发布被驳回')?'hover:cursor-pointer hover:text-[#844ad6]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={((_record.status_desc==='未发布'||_record.status_desc==='已下线')&&_record.test_status===3 || _record.status_desc==='发布被驳回')?()=>handleApplyPublish(index):null}><PublishSvg /></span>
          </Tooltip>
					<Tooltip title="下线" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='已发布' || _record.status_desc==='下线被驳回')?'hover:cursor-pointer hover:text-[#e57f3f]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='已发布' || _record.status_desc==='下线被驳回')?()=>handleApplyOffline(index):null}><OfflineSvg /></span>
          </Tooltip>
					<Tooltip title="删除" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='未发布' || _record.status_desc==='发布被驳回' || _record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未发布' || _record.status_desc==='发布被驳回' || _record.status_desc==='已下线')?()=>handleDelete(index):null}><DeleteSvg /></span>
          </Tooltip>
        </span>
			),
		},
	]
	// 是否是首次加载
	const first = useRef(true)
	// 轮询
	const timer = useRef(null)
	// 最高轮询次数
	const maxCount = useRef(30 * 60 / 5)
	// 当前轮询次数
	const autoQueryCount = useRef(0)
	// effect
	useEffect(() => {
		init()
		return () => {
			clearInterval(timer.current)
			timer.current = null
		}
	}, []);
	// methods
	const init = async () => {
		await getModelTypeList()
	}
	const getModelTypeList = async () => {
		setLoading(true)
		const {data} = await get('/drapi/comp/model/types')
		let list = []
		for(let i=0;i<data.model_types.length;i++){
			list.push({
				key: data.model_types[i].id,
				text: data.model_types[i].name,
				value: data.model_types[i].id,
			})
		}
		modelTypeList.current = list
		timer.current = setInterval(()=>{
			search(true)
		},5000)
		search()
	}
	const keydown = (e) => {
		if(e.keyCode === 13) {
			changeKeyword()
		}
	}
	const changeKeyword = () => {
		pageNum.current = 1
		search()
	}
	// auto,表明是否是自动轮询
	const search = async (auto=false) => {
		console.log('auto: ', auto)
		if(auto) {
			console.log('into auto')
			autoQueryCount.current++
			if(autoQueryCount.current > maxCount.current) {
				clearInterval(timer.current)
				timer.current = null
			}
		}else {
			console.log('into not auto')
			autoQueryCount.current = 0
			if(!timer.current) {
				timer.current = setInterval(()=>{
					search(true)
				},5000)
			}
		}
		console.log('into search method')
		// @ts-ignore
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			status: filterStatusList.current,
			model_type_id: filterTypeList.current,
			filter_test_status: filterTestStatusList.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
		}
		if(first.current) {
			setLoading(true)
		}
		const res = await get('/drapi/comp/mycomps', params)
		for (let i = 0; i < res.data.list.length; i++) {
			res.data.list[i] = {
				...res.data.list[i],
				key: res.data.list[i].id,
			}
		}
		// 判断是否为特殊情况,data.total_num>0,但是data.list为空,而且pageNum.current>1
		if (res.data.total_num > 0 && res.data.list.length === 0 && pageNum.current > 1) {
			pageNum.current -= 1
			search()
			return
		}
		setData(res.data.list)
		setPageSum(res.data.total_num)
		setLoading(false)
		first.current = false
		// 如果结果没有运行中的，则删除计时器
		if (res.data.list.every(item => item.test_status !== 2)) {
			clearInterval(timer.current)
			timer.current = null
		}
	}
	// 跳转到创建页面
	const goCreatePage = () => {
		history.push({
			pathname: '/my-model/create',
		})
	}
	// 分页相关
	const onShowSizeChange = (_current, newPageSize) => {
		console.log('into onShowSizeChange: _current: ',_current,' ,newPageSize: ',newPageSize)
		console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
		pageNum.current = 1
		pageSize.current = newPageSize
		pageSizeChange.current = true
		console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
	};
	const changePageNum = (value) => {
		console.log('into changePageNum,嘿嘿嘿,传入的value为：',value)
		console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
		if (pageSizeChange.current === true) {
			pageSizeChange.current = false
		} else {
			pageNum.current = value
		}
		console.log('pageNum: ',pageNum.current,' ,pageSize: ',pageSize.current)
		search()
	}
	const handleChange = (pagination, filters, sorter) => {
		console.log('Various parameters', pagination, filters, sorter);
		filterTypeList.current = filters.model_type_desc
		filterStatusList.current = filters.status_desc
		// filterTestStatusList.current = filters.test
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
	// 跳转到详情页面
	const handleView = (index) => {
		selectedItem.current = data[index]
		history.push({
			pathname: '/my-model/detail/'+data[index].id,
		})
	};
	// 跳转到编辑页面
	const handleEdit = (index) => {
		selectedItem.current = data[index]
		history.push({
			pathname: '/my-model/detail/'+data[index].id,
			params: {
				isEdit: true,
			}
		})
	}
	// 展示删除弹框
	const handleDelete = (index) => {
		selectedItem.current = data[index]
		setShowDeleteModal(true)
	}

	const deleteModalOnOk = async () => {
		await del('/drapi/comp/mycomps/'+selectedItem.current.id, null)
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
	// 展示申请发布弹框
	const handleApplyPublish = (index) => {
		selectedItem.current = data[index]
		setShowApplyPublishModal(true)
	}
	const applyPublishModalOnOk = async (_data) => {
		console.log('into applyPublishModalOnOk, _data: ', _data)
		await post('/drapi/comp/apply/audit/' + selectedItem.current.id, _data)
		message.success('申请发布成功')
		setShowApplyPublishModal(false)
		search()
	}
	const applyPublishModalOnCancel = () => {
		setShowApplyPublishModal(false)
	}
	// 展示测试弹框
	const handleTest = (index) => {
		selectedItem.current = data[index]
		// (0, "未知状态") ok
		// (1, "未开始测试") ok
		// (2, "测试中") ok
		// (3, "测试成功")
		// (4, "测试失败")
		if(selectedItem.current.test_status === 1 || selectedItem.current.test_status === 0) {
			setShowTestModal(true)
		} else if (selectedItem.current.test_status === 2 || selectedItem.current.test_status === 3 || selectedItem.current.test_status === 4) {
			// 如果存在experiment_id，则跳转到实验详情页面,否则打开test的第二个弹框
			if (selectedItem.current.experiment_id) {
				window.open(location.origin+'/experiment/drag/test/'+selectedItem.current.experiment_id)
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
		const res = await post('/drapi/comp/test', params)
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
	// 申请下线相关方法
	const handleApplyOffline = (index) => {
		selectedItem.current = data[index]
		setShowApplyOfflineModal(true)
	}
	const applyOfflineModalOnOk = async (_data) => {
		console.log('into applyOfflineModalOnOk, _data: ', _data)
		await post('/drapi/comp/apply/offline/' + selectedItem.current.id, _data)
		message.success('申请下线成功')
		setShowApplyOfflineModal(false)
		search()
	}
	const applyOfflineModalOnCancel = () => {
		setShowApplyOfflineModal(false)
	}
	// render
	return (
		// 最外层
		<div className="w-full flex justify-center">
			{/*主体内容*/}
			<div className="w-[1036px] big:w-[1388px] flex flex-col">
				{/*头部*/}
				<div className="mt-6 w-full flex justify-between items-center"
				     style={{height:'36px'}}>
					{/*左*/}
					<SearchBig placeholder='请输入模型名称'
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e=>keydown(e)}
					           ml={false}
					           style={{width:'284px',fontSize:'12px',lineHeight:'12px',}}
					/>
					{/*右*/}
					<div className={"h-full flex items-end"}>
						<ButtonMain text={'创建模型'}
						            click={goCreatePage}
						            style={{width:'88px',height:'28px',}}
						            showShadow={true}/>
					</div>
				</div>
				{/*表格*/}
				<div className={"w-full mt-4"}>
					<Table
						size='small'
						loading={loading}
						dataSource={data}
						// @ts-ignore
						columns={columns}
						onChange={handleChange}
						pagination={false}
						scroll={{ x: 'max-content' }} // 设置自适应宽度
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
												pageSizeOptions={[10,20,30,40]}
												current={pageNum.current}
												total={pageSum} />
					}
				</div>
			</div>
			{/*弹窗*/}
			{/*删除弹框*/}
			<DraggableModalPrompt
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-sm text-black">确定删除<span className="text-main pl-1 pr-1">{selectedItem.current?.name}</span>模型吗？</span>
			</DraggableModalPrompt>
			<ApplyPublishModal title={'申请发布'}
			                   show={showApplyPublishModal}
			                   data={selectedItem.current}
			                   onOk={applyPublishModalOnOk}
			                   onCancel={applyPublishModalOnCancel}/>
			<TestModal title={'启动测试服务'}
			           show={showTestModal}
			           data={selectedItem.current}
			           onOk={testModalOnOk}
			           onCancel={testModalOnCancel}/>
			<TestModalSecond title='提示'
			                 show={showTestModalSecond}
			                 data={{
												 ...selectedItem.current,
				                 url:'/drapi/comp/test',
			                 }}
			                 onReset={resetTest}
			                 onCancel={testModalSecondOnCancel}/>
			<ApplyOfflineModal title={'申请下线'}
			                   show={showApplyOfflineModal}
			                   data={selectedItem.current}
			                   onOk={applyOfflineModalOnOk}
			                   onCancel={applyOfflineModalOnCancel}/>
		</div>
	)
}
