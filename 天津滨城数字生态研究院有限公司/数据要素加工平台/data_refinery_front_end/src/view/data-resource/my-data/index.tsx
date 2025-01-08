import React, {useEffect, useRef, useState} from "react";
import { useHistory } from 'react-router-dom';
import ButtonMain from "../../../components/ButtonMain";
// @ts-ignore
import {del, get, post} from "../../../axios";
import {message, Pagination, Table, Tooltip} from "antd";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";
import SearchBig from "../../../components/SearchBig";
import ViewSvg from "../../../icon/table/ViewSvg";
import EditSvg from "../../../icon/table/EditSvg";
import DeleteSvg from "../../../icon/table/DeleteSvg";
import {applicationFieldList, dataTypeList} from "../../../utils/static";
import StatusShow, { statusList } from "./components/StatusShow";
import OnlineSvg from "../../../view_oam/icon/OnlineSvg";
import OfflineSvg from "../../../view_oam/icon/OfflineSvg";
import {createRandomArray} from "../../../utils/util";

export default function DataResourceMyData() {
	// state
	const history = useHistory();
	const keyword = useRef('')
	// 类型
	const filterTypeList = useRef([])
	const filterStatusList = useRef([])
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
	// 上线弹框
	const [showOnlineModal, setShowOnlineModal] = useState(false);
	// 下线弹框
	const [showOfflineModal, setShowOfflineModal] = useState(false);
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
			dataIndex: 'type_desc',
			filters: dataTypeList,
			width: 161,
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
			title: '大小',
			dataIndex: 'size',
			key: 'size',
			width: 100,
			sorter: true,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '样本',
			dataIndex: 'sample',
			key: 'sample',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '行业',
			dataIndex: 'industry',
			key: 'industry',
			filters: applicationFieldList.map(item => ({text: item, value: item})),
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '已授权',
			dataIndex: 'authorized',
			key: 'authorized',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '已使用',
			dataIndex: 'used',
			key: 'used',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '样例',
			dataIndex: 'example',
			key: 'example',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}
				     onClick={() => handleView(_index)}>查看</div>
			),
		},
		{
			title: '状态',
			dataIndex: 'status_desc',
			filters: statusList,
			width: 110,
			render: (_text, _record, _index) => (
				<StatusShow status={_text}/>
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
			title: '操作',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 166,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex items-center text-table-icon"}>
          <Tooltip title="查看" overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-[#0083e4]`}
                  onClick={() => handleView(index)}><ViewSvg /></span>
          </Tooltip>
          <Tooltip title="编辑" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='未上线' || _record.status_desc==='驳回上线' || _record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未上线' || _record.status_desc==='驳回上线' || _record.status_desc==='已下线')?()=>handleEdit(index):null}><EditSvg /></span>
          </Tooltip>
					<Tooltip title="上线" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='未上线'||_record.status_desc==='驳回上线'||_record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未上线'||_record.status_desc==='驳回上线'||_record.status_desc==='已下线')?() => handleOnline(index):null}><OnlineSvg/></span>
          </Tooltip>
					<Tooltip title="下线" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='已上线'||_record.status_desc==='驳回下线')?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='已上线'||_record.status_desc==='驳回下线')?() => handleOffline(index):null}><OfflineSvg/></span>
          </Tooltip>
					<Tooltip title="删除" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='未上线' || _record.status_desc==='驳回上线' || _record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未上线' || _record.status_desc==='驳回上线' || _record.status_desc==='已下线')?()=>handleDelete(index):null}><DeleteSvg /></span>
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

	const getFalseData = async (_params) => {
		return new Promise<any>((resolve, _reject) => {
			setTimeout(() => {
				let data = {
					list: createRandomArray(),
					total_num: 100,
				}
				for(let i = 0; i < data.list.length; i++) {
					data.list[i].type = dataTypeList[i%dataTypeList.length].value
					data.list[i].type_desc = dataTypeList[i%dataTypeList.length].text
					data.list[i].created_at = '2021-08-12 12:12:12'
					data.list[i].size = '100M'
					data.list[i].sample = 10
					data.list[i].industry = applicationFieldList[i%applicationFieldList.length]
					data.list[i].authorized = 10
					data.list[i].used = 5
					data.list[i].status = statusList[i%statusList.length].value
					data.list[i].status_desc = statusList[i%statusList.length].text
					data.list[i].description = data.list[i].name+'的描述'
					data.list[i].coverUrl = 'http://minio.model-hubs.cn/web-static/dataset-cover/202308/9FgEYdc1TC.png'
					data.list[i].company = '公司'+i
				}
				const res = {
					"code": 0,
					"msg": "success",
					"data": data
				}
				resolve(res);
			}, 200);
		});
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
			type_id: filterTypeList.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
		}
		if(first.current) {

		}
		setLoading(true)
		// const res = await get('/drapi/comp/mycomps', params)
		const res = await getFalseData(params)
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
			pathname: '/data-resource/my-data/create',
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
		filterTypeList.current = filters.type_desc
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
		// 将内容写入缓存
		localStorage.setItem('selectedItem', JSON.stringify(selectedItem.current))
		history.push({
			pathname: '/data-resource/my-data/detail/'+data[index].id,
		})
	};
	// 跳转到编辑页面
	const handleEdit = (index) => {
		selectedItem.current = data[index]
		// 将内容写入缓存
		localStorage.setItem('selectedItem', JSON.stringify(selectedItem.current))
		history.push({
			pathname: '/data-resource/my-data/detail/'+data[index].id,
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
	const handleOnline = (index) => {
		selectedItem.current = data[index]
		setShowOnlineModal(true)
	}
	const handleOffline = (index) => {
		selectedItem.current = data[index]
		setShowOfflineModal(true)
	}
	const onlineModalOnOk = async () => {
		// await post('/drapi/comp/mycomps/'+selectedItem.current.id+'/online', null)
		message.success('上线成功')
		search()
		setShowOnlineModal(false)
	}
	const onlineModalOnCancel = () => {
		setShowOnlineModal(false)
	}
	const offlineModalOnOk = async () => {
		// await post('/drapi/comp/mycomps/'+selectedItem.current.id+'/offline', null)
		message.success('下线成功')
		search()
		setShowOfflineModal(false)
	}
	const offlineModalOnCancel = () => {
		setShowOfflineModal(false)
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
					<SearchBig placeholder='请输入名称'
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e=>keydown(e)}
					           ml={false}
					           style={{width:'284px',fontSize:'12px',lineHeight:'12px',}}
					/>
					{/*右*/}
					<div className={"h-full flex items-center"}>
						<ButtonMain text={'创建数据'}
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
				title={'删除'}
				hint={'如果删除该数据后，则该条数据无法恢复，请确认是否需要删除数据'}
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-sm text-black flex items-center">确定删除<span className="text-main pl-1 pr-1 max-w-[180px] text-hidden">{selectedItem.current?.name}</span>吗？</span>
			</DraggableModalPrompt>
			{/*上线弹框*/}
			<DraggableModalPrompt
				title={'上线'}
				hint={'确认是否需要上线数据，数据将进入审核流程，审核流程中无法进行再次编辑信息'}
				show={showOnlineModal}
				onOk={onlineModalOnOk}
				onCancel={onlineModalOnCancel}>
				<span className="text-sm text-black flex items-center">确认上线<span className="text-main pl-1 pr-1 max-w-[180px] text-hidden">{selectedItem.current?.name}</span>吗？</span>
			</DraggableModalPrompt>
			{/*下线弹框*/}
			<DraggableModalPrompt
				title={'下线'}
				hint={'确认是否下线数据，下线数据后该数据将无法使用，并数据将进入审核流程，审核流程中无法进行再次编辑信息'}
				show={showOfflineModal}
				onOk={offlineModalOnOk}
				onCancel={offlineModalOnCancel}>
				<span className="text-sm text-black flex items-center">确认下线<span className="text-main pl-1 pr-1 max-w-[180px] text-hidden">{selectedItem.current?.name}</span>吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
