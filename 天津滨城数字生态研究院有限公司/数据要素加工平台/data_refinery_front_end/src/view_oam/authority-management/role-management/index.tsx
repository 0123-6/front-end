import React, {useEffect, useRef, useState} from "react";
import {message, Pagination, Table, Tooltip} from "antd";
import ViewSvg from "../../../icon/table/ViewSvg";
import NavigationComponent from "../../../components/NavigationComponent";
import AuthorityManagementSvg from "../../layout/icon/AuthorityManagementSvg";
import SearchBig from "../../../components/SearchBig";
import ButtonMain from "../../../components/ButtonMain";
import CreateAndEditModal from "./components/CreateAndEditModal";
import EditSvg from "../../../icon/table/EditSvg";
import KeySvg from "./icon/KeySvg";
import AuthorityModal from "./components/AuthorityModal";

export default function RoleManagement() {
	// state
	const keyword = useRef('')
	// 升降序
	// 升序
	const orderByAsc = useRef('')
	const orderByDesc = useRef('')
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
	const [showCreateAndEditModal, setShowCreateAndEditModal] = useState(false);
	const [showAuthorityModal, setShowAuthorityModal] = useState(false);
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
			title: '角色',
			dataIndex: 'role',
			key: 'role',
			width: 120,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>7)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center text-hidden"}
					     onClick={null}>{_text}</div>
				</Tooltip>
			),
		},
		{
			title: '角色描述',
			dataIndex: 'role_desc',
			key: 'role_desc',
			width: 499,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>34)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center text-hidden"}
					     onClick={null}>
						{_text}
					</div>
				</Tooltip>
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
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 102,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex items-center text-table-icon"}>
					<Tooltip title="查看" overlayClassName={"operator-line"}>
            <span className={`hover:cursor-pointer hover:text-[#3683dd]`}
                  onClick={() => handleView(index)}><ViewSvg/></span>
          </Tooltip>
					<Tooltip title="编辑" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${_record.role!=='超级管理员'?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={_record.role!=='超级管理员'?()=>handleEdit(index):null}><EditSvg/></span>
          </Tooltip>
					<Tooltip title="设置权限" overlayClassName={"operator-line"}>
            <span className={`ml-1 ${(_record.role!=='超级管理员' && false)?'hover:cursor-pointer hover:text-[#00b677]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={(_record.role!=='超级管理员' && false)?()=>handleAuthority(index):null}><KeySvg/></span>
          </Tooltip>
				</span>
			)
		},
	]
	// mounted
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
	};
	const getFalseData = async (_params) => {
		return new Promise<any>((resolve, _reject) => {
			setTimeout(() => {
				let data = {
					list: [
						{
							id: 1,
							key: '1',
							role: '超级管理员',
							role_desc: '超级管理员拥有平台中最高权限，拥有系统的所有功能。',
							created_at: '2021-08-12 12:00:00',
						},
						{
							id: 2,
							key: '2',
							role: '模型开发者',
							role_desc: '模型开发者拥有模型库、模型开发、数据管理功能权限，可以利用平台提供的开发环境进行模型开发、训练、测试等任务。',
							created_at: '2021-08-12 12:00:00',
						},
						{
							id: 3,
							key: '3',
							role: '数据要素加工者',
							role_desc: '数据要素加工者可以拥有，实验，要素加工，数据要素，操作权限，可查看模型库，产品市场，数据资源模块。',
							created_at: '2021-08-12 12:00:00',
						},
						{
							id: 4,
							key: '4',
							role: '数据提供者',
							role_desc: '数据提供者拥有在数据资源操作的权限，可查看产品市场以及模型库模块。',
							created_at: '2021-08-12 12:00:00',
						},
						{
							id: 5,
							key: '5',
							role: '平台运营',
							role_desc: '平台运营人员，拥有除角色管理以外的所有功能权限。',
							created_at: '2021-08-12 12:00:00',
						}
					],
					total_num: 5,
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
		// filterTypeList.current = filters.model_type_desc
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
	// 弹框相关
	const clickCreate = () => {
		selectedItem.current = null
		setShowCreateAndEditModal(true)
	}
	const handleEdit = (index) => {
		selectedItem.current = data[index]
		setShowCreateAndEditModal(true)
	}
	const createAndEditModalOnOk = (_data) => {
		const params = {
			id: selectedItem.current?.id,
			role: _data.role,
			role_desc: _data.role_desc,
		}
		console.log('into createAndEditModalOnOk, params: ', params)
		// 发送请求
		message.success(selectedItem.current ? '编辑成功' : '创建成功')
		pageNum.current = 1
		search()
		setShowCreateAndEditModal(false)
	}
	const createAndEditModalOnCancel = () => {
		setShowCreateAndEditModal(false)
	}
	const handleAuthority = (index) => {
		selectedItem.current = data[index]
		setShowAuthorityModal(true)
	}
	const authorityModalOnOk = (_data) => {
		const params = {
			id: selectedItem.current?.id,
			..._data,
		}
		console.log('into authorityModalOnOk, params: ', params)
		// 发送请求
		message.success('设置权限成功')
		search()
		setShowAuthorityModal(false)
	}
	const authorityModalOnCancel = () => {
		setShowAuthorityModal(false)
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '权限管理', iconSvg: AuthorityManagementSvg, disabled: true},
					{label: '角色管理', router: '/oam/authority-management/role-management',disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
				{/*搜索和按钮*/}
				<div className={"mt-4 w-full h-[36px] flex justify-between items-center"}>
					{/*search框筛选*/}
					<SearchBig placeholder='请输入角色名称'
					           ml={false}
					           style={{width: '284px'}}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e => keydown(e)}/>
					{/*右*/}
					<div className={"flex items-center"}>
						<ButtonMain text={'创建'}
						            click={clickCreate}
						            style={{width: '90px', height: '28px'}}
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
			{/*弹框*/}
			<CreateAndEditModal title={selectedItem.current ? '编辑角色' : '创建角色'}
			                    show={showCreateAndEditModal}
			                    data={selectedItem.current}
			                    onOk={createAndEditModalOnOk}
			                    onCancel={createAndEditModalOnCancel}/>
			<AuthorityModal title={'设置权限'}
			                show={showAuthorityModal}
			                data={selectedItem.current}
			                onOk={authorityModalOnOk}
			                onCancel={authorityModalOnCancel}/>
		</div>
	)
}
