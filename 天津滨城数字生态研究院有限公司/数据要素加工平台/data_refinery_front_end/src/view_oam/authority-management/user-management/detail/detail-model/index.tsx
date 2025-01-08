import React, {useEffect, useRef, useState} from "react";
import {message, Pagination, Table, Tooltip} from "antd";
import SearchBig from "../../../../../components/SearchBig";
import ButtonMain from "../../../../../components/ButtonMain";
import ButtonFifth from "../../../../../components/ButtonFifth";
import ChangeDateModal from "./components/ChangeDateModal";
import DraggableModalPrompt from "../../../../../components/draggable-modal/draggable-modal-prompt";
import ChangeDateSvg from "../../icon/ChangeDateSvg";
import {createRandomArray} from "../../../../../utils/util";
import {roleList} from "../../index";
import { get } from "../../../../../axios";
import CancelAuthorizedSvg from "../../icon/CancelAuthorizedSvg";
import {modelVersionList} from "../../../../../utils/static";
import AuthorizedModal from "./components/authorized-modal";

export const resourceTypeList = [
	{
		text: '官方模型',
		label: '官方模型',
		value: '官方模型',
	},
	{
		text: '用户模型',
		label: '用户模型',
		value: '用户模型',
	}
]

export default function DetailModel() {
	// state
	const keyword = useRef('')
	// 升降序
	// 升序
	const orderByAsc = useRef('')
	const orderByDesc = useRef('')
	// 筛选
	const filterTypeList = useRef([])
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
	// 弹框
	// 授权弹框
	const [showAuthorizedModal, setShowAuthorizedModal] = useState(false);
	const [showBatchCancelAuthorizedModal, setShowBatchCancelAuthorizedModal] = useState(false);
	const [showChangeDateModal, setShowChangeDateModal] = useState(false);
	const [showCancelAuthorizedModal, setShowCancelAuthorizedModal] = useState(false);
	// 多选选择的项
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
			title: '来源',
			dataIndex: 'resource_type',
			key: 'resource_type',
			width: 80,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
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
			title: '发布时间',
			dataIndex: 'published_at',
			key: 'published_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '授权时间',
			dataIndex: 'authorized_at',
			key: 'authorized_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '服务开始时间',
			dataIndex: 'service_start_at',
			key: 'service_start_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '服务到期时间',
			dataIndex: 'service_end_at',
			key: 'service_end_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '操作',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 76,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex items-center text-table-icon"}>
					<Tooltip title="续期" overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-[#3683dd]`}
                  onClick={() => handleChangeDate(index)}><ChangeDateSvg/></span>
          </Tooltip>
					<Tooltip title="取消授权" overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-[#3683dd]`}
                  onClick={() => handleCancelAuthorized(index)}><CancelAuthorizedSvg/></span>
          </Tooltip>
				</span>
			),
		},

	]

	// mounted
	// 初始化函数
	useEffect(() => {
		init()
	}, [])
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
	// 跳转到详情页面
	const handleView = (index) => {
		console.log(`View record at index ${index}`);
		selectedItem.current = data[index]
		// 将内容写入缓存
		localStorage.setItem('selectedItem', JSON.stringify(selectedItem.current))
		if(selectedItem.current.resource_type === '官方模型') {
			window.open(location.origin + '/oam/model-management/official-model/detail/' + selectedItem.current.id)
		} else {
			window.open(location.origin + '/oam/model-management/user-model/detail/' + selectedItem.current.id)
		}
	};
	// @ts-ignore
	const getFalseData = async (_params) => {
		return new Promise<any>((resolve, _reject) => {
			setTimeout(() => {
				let status_num_stat = []
				roleList.forEach((item) => {
					status_num_stat.push({
						key: item.value,
						value: Math.floor(Math.random()*1000)
					})
				})

				let data = {
					list: createRandomArray(pageSize.current),
					total_num: 100,
					status_num_stat: status_num_stat,
				}
				for(let i = 0; i < data.list.length; i++) {
					const index = pageSize.current * (pageNum.current - 1) + (i+1)
					data.list[i].key = index
					data.list[i].id = index
					data.list[i].name = '模型名称'+index
					data.list[i].mobile = '13888888888'
					data.list[i].user = {
						id: index,
						name: '用户'+index,
						role_name: roleList[index%roleList.length].text,
						nickname: '昵称'+index,
						avatar: 'http://minio.model-hubs.cn/web-static/avatar/202308/OumTUByZN5.png',
						mobile: '13888888888',
					}
					data.list[i].company = '静态公司名称'+index
					data.list[i].role_name = roleList[index%roleList.length].text
					data.list[i].created_at = '2021-08-12 12:12:12'
					data.list[i].finished_at = '2023-08-12 12:12:12'
					data.list[i].nickname = '昵称'+index
					data.list[i].avatar = 'http://minio.model-hubs.cn/web-static/avatar/202308/OumTUByZN5.png'
					data.list[i].email = '909458209@qq.com'
					data.list[i].model_type_desc = modelTypeList.current[index%modelTypeList.current.length].text
					data.list[i].version = modelVersionList[index%modelVersionList.length].label
					data.list[i].published_at = '2021-08-12 12:12:12'
					data.list[i].authorized_at = '2021-08-12 12:12:12'
					data.list[i].service_start_at = '2021-08-12 12:12:12'
					data.list[i].service_end_at = '2023-08-12 12:12:12'
					data.list[i].resource_type = resourceTypeList[index%resourceTypeList.length].text
				}
				const res = {
					"code": 0,
					"msg": "success",
					"data": data,
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
			model_type_id: filterTypeList.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
		}
		console.log(params)
		setLoading(true)
		// const res = await get('/drapi/oam/user/comps', params)
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
		filterTypeList.current = filters.model_type_desc
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
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys: selectedRowKeys,
		onChange: onSelectChange,
	};
	// 弹框相关
	const authorizedModalOnOk = async (_data) => {
		const params = {
			..._data,
		}
		console.log(params)
		message.success('授权成功')
		pageNum.current = 1
		search()
		setShowAuthorizedModal(false)
	}
	const authorizedModalOnCancel = () => {
		setShowAuthorizedModal(false)
	}
	const handleChangeDate = (index) => {
		selectedItem.current = data[index]
		setShowChangeDateModal(true)
	}
	const changeDateModalOnOk = async (_data) => {
		// 发送网络请求
		message.success('续期成功')
		search()
		setShowChangeDateModal(false)
	}
	const changeDateModalOnCancel = () => {
		setShowChangeDateModal(false)
	}
	// 取消授权
	const handleCancelAuthorized = (index) => {
		selectedItem.current = data[index]
		setShowCancelAuthorizedModal(true)
	}
	const cancelAuthorizedModalOnOk = async (_data) => {
		// 发送网络请求
		message.success('取消授权成功')
		if (data.length === 1 && pageNum.current > 1) {
			pageNum.current -= 1
		}
		search()
		setShowCancelAuthorizedModal(false)
	}
	const cancelAuthorizedModalOnCancel = () => {
		setShowCancelAuthorizedModal(false)
	}
	// 批量取消授权
	const batchCancelAuthorizedModalOnOk = async (_data) => {
		// 发送网络请求
		message.success('批量取消授权成功')
		setSelectedRowKeys([])
		pageNum.current = 1
		search()
		setShowBatchCancelAuthorizedModal(false)
	}
	const batchCancelAuthorizedModalOnCancel = () => {
		setShowBatchCancelAuthorizedModal(false)
	}
	// render
	return (
		// 最外层
		<div className={"w-full flex flex-col pl-8 pr-8"}>
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
					<ButtonMain text={'授权'}
					            click={()=>setShowAuthorizedModal(true)}
					            style={{width: '90px', height: '28px'}}
					            showShadow={true}/>
					<ButtonFifth text={'批量取消授权'}
					             disabled={selectedRowKeys.length === 0}
					             click={()=>setShowBatchCancelAuthorizedModal(true)}
					             style={{width: '121px', height: '28px'}}
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
			{/*弹窗*/}
			<AuthorizedModal title={'授权'}
			                 show={showAuthorizedModal}
			                 data={null}
			                 onOk={authorizedModalOnOk}
			                 onCancel={authorizedModalOnCancel}/>
			<ChangeDateModal title={'续期'}
			                 show={showChangeDateModal}
			                 data={selectedItem.current}
			                 onOk={changeDateModalOnOk}
			                 onCancel={changeDateModalOnCancel}/>
			{/*批量取消授权弹框*/}
			<DraggableModalPrompt
				show={showBatchCancelAuthorizedModal}
				onOk={batchCancelAuthorizedModalOnOk}
				onCancel={batchCancelAuthorizedModalOnCancel}>
				<span className="text-sm text-black">确定批量取消授权<span className="text-main pl-1 pr-1">{selectedRowKeys?.length}</span>个模型吗？</span>
			</DraggableModalPrompt>
			{/*取消授权弹框*/}
			<DraggableModalPrompt
				show={showCancelAuthorizedModal}
				onOk={cancelAuthorizedModalOnOk}
				onCancel={cancelAuthorizedModalOnCancel}>
				<span className="text-sm text-black">确定取消授权<span className="text-main pl-1 pr-1">{selectedItem.current?.name}</span>模型吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
