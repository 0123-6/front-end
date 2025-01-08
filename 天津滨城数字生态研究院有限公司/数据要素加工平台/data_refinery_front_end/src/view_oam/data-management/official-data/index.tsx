import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {message, Pagination, Popover, Table, Tooltip} from "antd";
import {applicationFieldList, dataTypeList} from "../../../utils/static";
import ViewSvg from "../../../icon/table/ViewSvg";
import OnlineSvg from "../../icon/OnlineSvg";
import OfflineSvg from "../../icon/OfflineSvg";
import {PopoverContent} from "../../../view/data-element/common/PopoverContent";
import {createRandomArray, formatPhone} from "../../../utils/util";
import StatusShow, { statusList } from "./components/StatusShow";
import NavigationComponent from "../../../components/NavigationComponent";
import SearchBig from "../../../components/SearchBig";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";
import {del, post } from "../../../axios";
import DataManagementSvg from "../../layout/icon/DataManagement";
import EditSvg from "../../../icon/table/EditSvg";
import DeleteSvg from "../../../icon/table/DeleteSvg";
import ButtonMain from "../../../components/ButtonMain";

export default function OfficialData() {
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
	// 行业
	const filterIndustryList = useRef([])
	// 降序
	const pageSize = useRef(10);
	const pageSizeChange = useRef(false);
	const pageNum = useRef(1);
	const [pageSum, setPageSum] = useState(0);
	// 是否是首次加载
	const first = useRef(true)
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	// 单选选择的项
	const selectedItem = useRef(null);
	// 弹框
	// 上线弹框
	const [showOnlineModal, setShowOnlineModal] = useState(false);
	// 下线弹框
	const [showOfflineModal, setShowOfflineModal] = useState(false);
	const [showDeleteModal,setShowDeleteModal] = useState(false);
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
			title: '提供者',
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
            <span className={`ml-1 ${(_record.status_desc==='未上线' || _record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未上线' || _record.status_desc==='已下线')?()=>handleEdit(index):null}><EditSvg /></span>
          </Tooltip>
					<Tooltip title="上线" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='未上线'||_record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未上线'||_record.status_desc==='已下线')?() => handleOnline(index):null}><OnlineSvg/></span>
          </Tooltip>
					<Tooltip title="下线" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='已上线')?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='已上线')?() => handleOffline(index):null}><OfflineSvg/></span>
          </Tooltip>
					<Tooltip title="删除" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='未上线' || _record.status_desc==='已下线')?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='未上线' || _record.status_desc==='已下线')?()=>handleDelete(index):null}><DeleteSvg /></span>
          </Tooltip>
        </span>
			),
		},
	]
	// mounted
	useEffect(() => {
		search()
	}, [])
	// methods
	const keydown = (e) => {
		if (e.keyCode === 13) {
			changeKeyword()
		}
	}
	const changeKeyword = () => {
		pageNum.current = 1
		search()
	}

	// 跳转到详情页面
	const handleView = (index) => {
		console.log(`View record at index ${index}`);
		selectedItem.current = data[index]
		// 将内容写入缓存
		localStorage.setItem('selectedItem', JSON.stringify(selectedItem.current))
		history.push({
			pathname: `/oam/data-management/official-data/detail/${data[index].id}`
		})
	};

	const handleOnline = (index) => {
		selectedItem.current = data[index]
		setShowOnlineModal(true)
	}
	const handleOffline = (index) => {
		selectedItem.current = data[index]
		setShowOfflineModal(true)
	}
	// 跳转到编辑页面
	const handleEdit = (index) => {
		selectedItem.current = data[index]
		// 将内容写入缓存
		localStorage.setItem('selectedItem', JSON.stringify(selectedItem.current))
		history.push({
			pathname: '/oam/data-management/official-data/detail/'+data[index].id,
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
	const search = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			// model_type_id: filterTypeList.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
		}
		console.log(params)
		setLoading(true)
		// const res = await get('/drapi/oam/official/comps', params)
		const res = await getFalseData(params)
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
		filterTypeList.current = filters.type_desc
		filterIndustryList.current = filters.industry
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
	// 弹框
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
	// 跳转到创建页面
	const goCreatePage = () => {
		history.push({
			pathname: '/oam/data-management/official-data/create',
		})
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '数据管理', iconSvg: DataManagementSvg, disabled: true},
					{label: '官方数据', router: '/oam/data-management/official-data', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
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
					<div className={"h-full flex items-center"}>
						<ButtonMain text={'创建数据'}
						            click={goCreatePage}
						            style={{width:'88px',height:'28px',}}
						            showShadow={true}/>
					</div>
				</div>
				{/*表格和分页*/}
				<div className={"mt-2 w-full"}>
					<Table
						size='small'
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
				hint={'如果上线该数据后，则该条数据可以进行权限分配等操作，请确认是否需要上线数据'}
				show={showOnlineModal}
				onOk={onlineModalOnOk}
				onCancel={onlineModalOnCancel}>
				<span className="text-sm text-black flex items-center">确认上线<span className="text-main pl-1 pr-1 max-w-[180px] text-hidden">{selectedItem.current?.name}</span>吗？</span>
			</DraggableModalPrompt>
			{/*下线弹框*/}
			<DraggableModalPrompt
				title={'下线'}
				hint={'如果下线该数据后，则该条数据无法进行分配权限，请确认是否需要下线数据'}
				show={showOfflineModal}
				onOk={offlineModalOnOk}
				onCancel={offlineModalOnCancel}>
				<span className="text-sm text-black flex items-center">确认下线<span className="text-main pl-1 pr-1 max-w-[180px] text-hidden">{selectedItem.current?.name}</span>吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
