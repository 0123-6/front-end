import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {del, get } from "../../../../axios";
import {DatePicker, message, Pagination, Spin, Table, Tooltip} from "antd";
import NavigationComponent from "../../../../components/NavigationComponent";
import {UserAvatarAndName} from "../index";
import FeedbackLikeSvg from "../../../icon/FeedbackLikeSvg.svg";
import FeedbackUnlikeSvg from "../../../icon/FeedbackUnlikeSvg.svg";
import ViewSvg from "../../../icon/ViewSvg";
import DeleteSvg from "../../../../icon/DeleteSvg";
import DraggableModalPrompt from "../../../../components/draggable-modal/draggable-modal-prompt";

export default function SessionManagementDetail(props) {
	// state
	const history = useHistory();
	const [data,setData] = useState(null)
	// 表格数据
	const [tableData,setTableData] = useState([])
	const [isLoading,setIsLoading] = useState(false)
	const [tableLoading,setTableLoading] = useState(false)
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
	// 单选选择的项
	const selectedItem = useRef(null);
	const [showDeleteModal,setShowDeleteModal] = useState(false);
	// 表格筛选开始时间
	const startDate = useRef('')
	// 表格筛选结束时间
	const endDate = useRef('')
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
			title: '提问内容',
			dataIndex: 'question',
			key: 'question',
			width: 420,
			// sorter: true,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>28)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}
					     onClick={() => handleView(_index)}>{_text}</div>
				</Tooltip>
			),
		},
		{
			title: '反馈',
			dataIndex: 'like',
			align: 'center',
			key: 'like',
			width: 50,
			render: (_text, _record, _index) => (
				<div className={"w-full flex justify-center items-center"}>
					{_text===1 && <img src={FeedbackLikeSvg} alt=""/>}
					{_text===0 && <span>-</span>}
					{_text===-1 && <img src={FeedbackUnlikeSvg} alt=""/>}
				</div>
			)
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
			title: '反馈时间',
			dataIndex: 'updated_at',
			key: 'updated_at',
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
				<span className={"w-full inline-flex items-center text-table-icon"}>
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
	// mounted
	useEffect(()=>{
		getData()
		search()
	},[])
	// methods
	// 点击问题列表查看
	const handleView = (index) => {
		console.log(`View record at index ${index}`);
		selectedItem.current = tableData[index]
		history.push({
			pathname: '/oam/question-management/question-management/detail/' + tableData[index].id,
		})
	};
	const getData = async () => {
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		const {data} = await get(`/oam/converse/${params.id}`)
		setData(data)
		setIsLoading(false)
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
	const search = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
			converse_id: Number(props.match.params.id),
			// 提问时间
			start_date: startDate.current,
			end_date: endDate.current,
		}
		console.log(params)
		setTableLoading(true)
		const res = await get('/oam/question', params)
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
		setTableData(res.data.list)
		// @ts-ignore
		setPageSum(res.data.total_num)
		setTableLoading(false)
		first.current = false
	}
	// 展示删除弹框
	const handleDelete = (index) => {
		selectedItem.current = tableData[index]
		setShowDeleteModal(true)
	}
	const deleteModalOnOk = async () => {
		await del('/oam/question/'+selectedItem.current.id, null)
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
					{label: '问题管理', disabled: true},
					{label: '会话管理', router: '/oam/question-management/session-management'},
					{label: '会话详情', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pb-[140px] mb-8 flex flex-col rounded-lg"}>
				{/*加载效果*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{/*最外层*/}
					<div className={"w-full flex flex-col"}>
						{/*上面*/}
						<div className={"w-full flex flex-col pl-[32px] pr-[32px] pt-6 pb-[22px]"}
						     style={{
							     backgroundImage: 'linear-gradient(171deg, rgba(162, 182, 255, 0.05), white)',
							     borderRadius: '8px 8px 0px 0px',
						     }}>
							<span className={"text-base font-medium"}>会话详情</span>
							<div className={"mt-[29px] flex items-center"}>
								<UserAvatarAndName user={data?.user}/>
								<span className={"ml-[19px]"}>创建时间 {data?.created_at}</span>
							</div>
							<div className={"mt-[18px] flex items-start"}>
								<div className={"w-[52px] h-[27px] flex justify-center items-center"}
								     style={{
									     background: 'rgba(1,71,235,0.22)',
									     borderRadius: '8px 8px 0px 8px',
								     }}>
									<span className={"flex items-center text-sm text-[#0147EB]"}>会话</span>
								</div>
								<span className={"ml-[9px] flex-1 flex-wrap text-[22px] leading-[27px] text-black-dark font-medium"}>{data?.title}</span>
							</div>
						</div>
						{/*下面*/}
						<div className={"bg-white flex flex-col pl-8 pr-8 mt-[27px]"}>
							{/*问题列表*/}
							<div className={"flex items-center"}>
								<div className={"w-[4px] h-[12px] bg-main rounded-sm"}/>
								<span className={"ml-2 text-base text-black-dark"}>问题列表</span>
							</div>
							{/*提问时间*/}
							<div className={"mt-4 flex items-center"}>
								<span className={"mr-[9px]"}>提问时间</span>
								<DatePicker.RangePicker onChange={changeRangeDate} format={'YYYY/MM/DD'} allowClear={false}/>
							</div>
							{/*表格和分页*/}
							<div className={"mt-2 w-full"}>
								<Table
									size='small'
									loading={tableLoading}
									dataSource={tableData}
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
					</div>
				</Spin>
			</div>
			{/*删除弹框*/}
			<DraggableModalPrompt
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-base text-black-dark flex items-center">确定删除<span className="max-w-[180px] text-main pl-1 pr-1 text-hidden">{selectedItem.current?.question}</span>问题吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
