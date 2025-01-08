import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {UserAvatarAndName} from "../question-management/session-management";
import {DatePicker, message, Pagination, Switch, Table, Tooltip} from "antd";
import ViewSvg from "../icon/ViewSvg";
import NavigationComponent from "../../components/NavigationComponent";
import SearchBig from "../../components/SearchBig";
import { get, post } from "../../axios";
import EditSvg from "../../icon/EditSvg";

export default function UserManagement() {
	// state
	const history = useHistory();
	const keyword = useRef('')
	// 升降序
	// 升序
	const orderByAsc = useRef('')
	const orderByDesc = useRef('')
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
	// 表格筛选开始时间
	const startDate = useRef('')
	// 表格筛选结束时间
	const endDate = useRef('')
	// 筛选角色
	const filterRoleList = useRef([])
	// 筛选状态
	const filterIsActiveList = useRef([])
	const columns = [
		{
			title: '序号',
			dataIndex: 'id',
			key: 'id',
			width: 70,
			sorter: true,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '头像/昵称',
			dataIndex: 'user',
			key: 'user',
			width: 116,
			render: (_text, _record, _index) => (
				<div className={"w-full flex"}>
					{
						_record &&
						<UserAvatarAndName user={_record}/>
						// <Popover title={null}
						// 				 placement="leftTop"
						// 				 overlayClassName={'person-popover-2'}
						// 				 trigger="hover"
						// 				 content={PopoverContent({user: _text,showPhone: true})}
						// >
						//
						// </Popover>
					}
					{
						!_record &&
						<span>—</span>
					}
				</div>
			),
		},
		{
			title: '用户名',
			dataIndex: 'username',
			key: 'username',
			width: 116,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text ? _text:'—'}</div>
			),
		},
		{
			title: '角色',
			dataIndex: 'role',
			key: 'role',
			width: 70,
			filters: [
				{ text: '管理员', value: 'admin' },
				{ text: '用户', value: 'user' },
			],
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text ? (_text==='admin'?'管理员':'用户') : '—'}</div>
			),
		},
		{
			title: '机构名称',
			dataIndex: 'organization',
			key: 'organization',
			width: 129,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>8)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center text-hidden"}
					     onClick={() => handleView(_index)}>{_text}</div>
				</Tooltip>
			),
		},
		{
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
			width: 110,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}
				     onClick={() => handleView(_index)}>{_text}</div>
			),
		},
		{
			title: '注册日期',
			dataIndex: 'date_joined',
			key: 'date_joined',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '状态',
			dataIndex: 'is_active',
			key: 'is_active',
			filters: [
				{ text: '启用', value: true },
				{ text: '禁用', value: false },
			],
			width: 80,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>
					<Switch defaultChecked={_text}
					        size={'small'}
					        onChange={(checked) => changeStatus(_index,checked)}/>
					<span className={"ml-1"}>{_text?'启用':'禁用'}</span>
				</div>
			),
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 70,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex justify-center items-center text-table-icon"}>
					<Tooltip title="查看" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-main`}
                  onClick={() => handleView(index)}><ViewSvg/></span>
          </Tooltip>
					<Tooltip title="编辑" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${true?'hover:cursor-pointer hover:text-[#01bceb]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={true?()=>handleEdit(index):null}><EditSvg /></span>
          </Tooltip>
				</span>
			),
		}
	]
	// mounted
	useEffect(() => {
		search()
	}, [])
	// methods
	const handleView = (index) => {
		console.log(`View record at index ${index}`);
		selectedItem.current = data[index]
		history.push({
			pathname: `/oam/user-management/detail/${data[index].id}`,
		})
	};
	// 展示删除弹框
	const handleEdit = (index) => {
		selectedItem.current = data[index]
		history.push({
			pathname: `/oam/user-management/edit/${data[index].id}`,
		})
	}
	const search = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
			start_date: startDate.current,
			end_date: endDate.current,
			role: filterRoleList.current && filterRoleList.current[0],
			is_active: filterIsActiveList.current && filterIsActiveList.current[0],
		}
		console.log(params)
		setLoading(true)
		const res = await get('/oam/user', params)
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
	const keydown = (e) => {
		if (e.keyCode === 13) {
			changeKeyword()
		}
	}
	const changeKeyword = () => {
		pageNum.current = 1
		search()
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
		filterRoleList.current = filters.role
		filterIsActiveList.current = filters.is_active
		orderByAsc.current = null
		orderByDesc.current = null
		if (sorter && sorter.order) {
			if (sorter.order === 'ascend') {
				orderByAsc.current = sorter.columnKey
			} else if (sorter.order === 'descend') {
				orderByDesc.current = sorter.columnKey
			}
		}
		pageNum.current = 1
		search()
	};
	// 修改状态
	const changeStatus = async (_index, checked) => {
		console.log(_index, checked)
		const params = {
			user_id: data[_index].id,
			is_active: checked,
		}
		await post('/oam/user', params)
		message.success('修改状态成功')
		search()
	}
	const changeRangeDate = (values) => {
		startDate.current = values[0].format('YYYY-MM-DD')
		endDate.current = values[1].format('YYYY-MM-DD')
		pageNum.current = 1
		search()
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '用户管理', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
				<span className={"text-base font-medium"}>用户管理</span>
				{/*搜索和按钮*/}
				<div className={"mt-4 w-full h-[36px] flex items-center"}>
					{/*search框筛选*/}
					<SearchBig placeholder='昵称/用户名/手机号/角色/机构名称'
					           ml={false}
					           style={{width: '284px'}}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e => keydown(e)}/>
					<div className={"ml-[3vw] flex items-center"}>
						<span className={"mr-[0.5vw]"}>注册日期</span>
						<DatePicker.RangePicker onChange={changeRangeDate} format={'YYYY/MM/DD'} allowClear={false}/>
					</div>
					{/*右*/}
					<div className={"flex items-center"}>
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
		</div>
	)
}
