import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {message, Pagination, Table, Tooltip} from "antd";
import { formatPhone } from "../../../utils/util";
// import { PopoverContent } from "../../../components/PopoverContent";
import DeleteSvg from "../../../icon/DeleteSvg";
import ViewSvg from "../../icon/ViewSvg";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";
import { del, get } from "../../../axios";
import NavigationComponent from "../../../components/NavigationComponent";
import SearchBig from "../../../components/SearchBig";
import DefaultAvatarSvg from "../../../icon/DefaultAvatarSvg.svg";

interface IUserAvatarAndName {
	user: any
}

export const UserAvatarAndName = (props:IUserAvatarAndName) => {
	// state
	const {user} = props
	// render
	return (
		<div className={"flex"}
		     style={{height: '22px'}}>
			{/*头像*/}
			<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
			     style={{width: '22px', minWidth: '22px', height: '22px'}}>
				<img className="" src={(user?.avatar) ? (user?.avatar) : DefaultAvatarSvg} alt=""
				     style={{width: '100%', height: '100%'}}/>
			</div>
			{/*姓名*/}
			<div className={"ml-1.5 h-full flex items-center"}>
				<span className={"flex items-center text-hidden"}>
					<span>{(user?.nickname) ? (user?.nickname) : ((user?.mobile) ? formatPhone(user?.mobile) : '静态内容')}</span>
				</span>
			</div>
		</div>
	)
}

export default function SessionManagement() {
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
	const [showDeleteModal,setShowDeleteModal] = useState(false);
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
			title: '会话',
			dataIndex: 'title',
			key: 'title',
			width: 505,
			sorter: true,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>34)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}
					     onClick={() => handleView(_index)}>{_text}</div>
				</Tooltip>
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
						<UserAvatarAndName user={_text}/>
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
					<Tooltip title="删除" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 ${true?'hover:cursor-pointer hover:text-[#fd4932]':'text-table-icon-disable hover:cursor-not-allowed '}`}
                  onClick={true?()=>handleDelete(index):null}><DeleteSvg /></span>
          </Tooltip>
				</span>
			),
		}
	]
	// mount
	useEffect(() => {
		search()
	}, [])
	// methods
	const handleView = (index) => {
		console.log(`View record at index ${index}`);
		selectedItem.current = data[index]
		history.push({
			pathname: '/oam/question-management/session-management/detail/' + data[index].id,
		})
	};
	// 展示删除弹框
	const handleDelete = (index) => {
		selectedItem.current = data[index]
		setShowDeleteModal(true)
	}
	const deleteModalOnOk = async () => {
		await del('/oam/converse/'+selectedItem.current.id, null)
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
		const res = await get('/oam/converse', params)
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
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '问题管理', disabled: true},
					{label: '会话管理', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
				<span className={"text-base font-medium"}>会话管理</span>
				{/*搜索和按钮*/}
				<div className={"mt-4 w-full h-[36px] flex justify-between items-center"}>
					{/*search框筛选*/}
					<SearchBig placeholder='请输入会话名称/问题/提问人名称'
					           ml={false}
					           style={{width: '284px'}}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e => keydown(e)}/>
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
			{/*删除弹框*/}
			<DraggableModalPrompt
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-base text-black-dark flex items-center">确定删除<span className="max-w-[180px] text-main pl-1 pr-1 text-hidden">{selectedItem.current?.title}</span>会话吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
