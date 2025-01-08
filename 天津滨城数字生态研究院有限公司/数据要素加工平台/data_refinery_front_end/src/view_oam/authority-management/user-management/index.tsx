import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import SetDeadlineModal from "./components/SetDeadlineModal";
import {message, Pagination, Popover, Table, Tooltip} from "antd";
import {PopoverContent} from "../../../view/data-element/common/PopoverContent";
import {createRandomArray, formatPhone} from "../../../utils/util";
import ViewSvg from "../../../icon/table/ViewSvg";
import NavigationComponent from "../../../components/NavigationComponent";
import SearchBig from "../../../components/SearchBig";
import ButtonMain from "../../../components/ButtonMain";
import ButtonFifth from "../../../components/ButtonFifth";
import CreateModal from "./components/CreateModal";
import BatchCreateModal from "./components/BatchCreateModal";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";
import DeleteSvg from "../../../icon/table/DeleteSvg";
import AuthorityManagementSvg from "../../layout/icon/AuthorityManagementSvg";

export const roleList = [
	{
		name: '超级管理员',
		label: '超级管理员',
		text: '超级管理员',
		value: '超级管理员',
	},
	{
		name: '要素加工者',
		label: '要素加工者',
		text: '要素加工者',
		value: '要素加工者',
	},
	{
		name: '模型开发者',
		label: '模型开发者',
		text: '模型开发者',
		value: '模型开发者',
	},
	{
		name: '数据提供者',
		label: '数据提供者',
		text: '数据提供者',
		value: '数据提供者',
	},
	{
		name: '平台运营',
		label: '平台运营',
		text: '平台运营',
		value: '平台运营',
	},
	{
		name: '平台运维',
		label: '平台运维',
		text: '平台运维',
		value: '平台运维',
	}
]

const statusDescList = [
	{
		name: '正常',
		label: '正常',
		text: '正常',
		value: '正常',
	},
	{
		name: '过期',
		label: '过期',
		text: '过期',
		value: '过期',
	}
]

export default function UserManagement() {
	// state
	// @ts-ignore
	const history = useHistory();
	const keyword = useRef('')
	// 升降序
	// 升序
	const orderByAsc = useRef('')
	const orderByDesc = useRef('')
	// 筛选
	const filterRoleList = useRef([])
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
	// 弹框
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showBatchCreateModal, setShowBatchCreateModal] = useState(false);
	const [showSetDeadlineModal, setShowSetDeadlineModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	// 顶部状态数量
	const [statusNumStatList, setStatusNumStatList] = useState([]);
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
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '账号/手机号',
			dataIndex: 'mobile',
			key: 'mobile',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '姓名',
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
			title: '单位',
			dataIndex: 'company',
			key: 'company',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '角色',
			dataIndex: 'role_name',
			filters: roleList,
			width: 161,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '创建时间',
			dataIndex: 'created_at',
			key: 'created_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '到期时间',
			dataIndex: 'finished_at',
			key: 'finished_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '状态',
			dataIndex: 'status_desc',
			filters: statusDescList,
			width: 110,
			// align: 'center',
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>
					{
						_text === '正常' &&
						<div className={"w-[8px] h-[8px] bg-main rounded-full"}></div>
					}
					{
						_text === '过期' &&
						<div className={"w-[8px] h-[8px] bg-[#CFD1D8] rounded-full"}></div>
					}
					<span className={"ml-2"}>{_text}</span>
				</div>
			),
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 72,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex items-center text-table-icon"}>
					<Tooltip title="查看" overlayClassName={"operator-line"}>
            <span className={`hover:cursor-pointer hover:text-[#3683dd]`}
                  onClick={() => handleView(index)}><ViewSvg/></span>
          </Tooltip>
					<Tooltip title="删除" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.status_desc==='过期')?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.status_desc==='过期')?()=>handleDelete(index):null}><DeleteSvg /></span>
          </Tooltip>
				</span>
			)
		},
	];
	// mounted
	// 初始化函数
	useEffect(() => {
		search()
	}, []);
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
			pathname: `/oam/authority-management/user-management/detail/${data[index].id}`,
		})
	};

	// 展示删除弹框
	const handleDelete = (index) => {
		selectedItem.current = data[index]
		setShowDeleteModal(true)
	}
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
					data.list[i].status_desc = statusDescList[index%statusDescList.length].text
					data.list[i].nickname = '昵称'+index
					data.list[i].avatar = 'http://minio.model-hubs.cn/web-static/avatar/202308/OumTUByZN5.png'
					data.list[i].email = '909458209@qq.com'
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
	// @ts-ignore
	const search = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			// model_type_id: filterTypeList.current,
			status: filterStatusList.current,
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
		// filterTypeList.current = filters.model_type_desc
		filterStatusList.current = filters.sub_status_desc
		filterRoleList.current = filters.role_name
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
	// 弹框
	const createModalOnOk = (_data) => {
		// 发送请求
		message.success('创建成功')
		pageNum.current = 1
		search()
		setShowCreateModal(false)
	}
	const createModalOnCancel = () => {
		setShowCreateModal(false)
	}
	const batchCreateModalOnOk = (_data) => {
		message.success('批量创建成功')
		pageNum.current = 1
		search()
		setShowBatchCreateModal(false)
	}
	const batchCreateModalOnCancel = () => {
		setShowBatchCreateModal(false)
	}
	const deleteModalOnOk = async () => {
		// await del('/drapi/oam/platform/comps/'+selectedItem.current.id, null)
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
	const setDeadlineModalOnOk = (_data) => {
		// 发送请求
		message.success('设置期限成功')
		setSelectedRowKeys([])
		search()
		setShowSetDeadlineModal(false)
	}
	const setDeadlineModalOnCancel = () => {
		setShowSetDeadlineModal(false)
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '权限管理', iconSvg: AuthorityManagementSvg, disabled: true},
					{label: '用户管理', router: '/oam/authority-management/user-management',disabled: true},
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
					<SearchBig placeholder='请输入/手机号/姓名/单位'
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
						<ButtonFifth text={'批量创建'}
						             click={()=>setShowBatchCreateModal(true)}
						             style={{width: '90px', height: '28px'}}
						             className={"ml-4"}/>
						<ButtonFifth text={'设置期限'}
						             disabled={selectedRowKeys.length === 0}
						             click={()=>setShowSetDeadlineModal(true)}
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
			{/*	弹框 */}
			<CreateModal title={'创建'}
			             show={showCreateModal}
			             data={null}
			             onOk={createModalOnOk}
			             onCancel={createModalOnCancel}/>
			<BatchCreateModal title={'批量创建'}
			                  show={showBatchCreateModal}
			                  data={null}
			                  onOk={batchCreateModalOnOk}
			                  onCancel={batchCreateModalOnCancel}/>
			{/*设置期限*/}
			<SetDeadlineModal title={'设置期限'}
			                  show={showSetDeadlineModal}
			                  data={null}
			                  onOk={setDeadlineModalOnOk}
			                  onCancel={setDeadlineModalOnCancel}/>
			{/*删除弹框*/}
			<DraggableModalPrompt
				title={'删除'}
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-sm text-black flex items-center">确定删除<span className="text-main pl-1 pr-1 max-w-[180px] text-hidden">{selectedItem.current?.name}</span>吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
