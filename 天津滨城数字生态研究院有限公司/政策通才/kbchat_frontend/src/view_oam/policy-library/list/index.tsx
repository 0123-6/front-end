import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {DatePicker, message, Pagination, Table, Tooltip} from "antd";
import ViewSvg from "../../icon/ViewSvg";
import DeleteSvg from "../../../icon/DeleteSvg";
import NavigationComponent from "../../../components/NavigationComponent";
import SearchBig from "../../../components/SearchBig";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";
import {del, get } from "../../../axios";

export default function PolicyLibraryList(props) {
	// state
	const history = useHistory();
	const keyword = useRef('')
	// 表格筛选开始时间
	const startDate = useRef('')
	// 表格筛选结束时间
	const endDate = useRef('')
	// 升降序
	// 升序
	const orderByAsc = useRef('')
	const orderByDesc = useRef('')
	const filterIsWorkingList = useRef([])
	const filterTypeList = useRef([])
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
			title: '政策文件标题',
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
			title: '发文字号',
			dataIndex: 'pub_no',
			key: 'pub_no',
			width: 330,
			sorter: true,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>22)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center text-hidden"}
					     onClick={null}>{_text?_text:'—'}</div>
				</Tooltip>
			),
		},
		{
			title: '发文日期',
			dataIndex: 'pub_date',
			key: 'pub_date',
			sorter: true,
			width: 90,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '实施日期',
			dataIndex: 'effect_date',
			key: 'effect_date',
			sorter: true,
			width: 90,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '发文机构',
			dataIndex: 'pub_organ',
			key: 'pub_organ',
			width: 340,
			// sorter: true,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>23)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center text-hidden"}
					     onClick={null}>{_text?_text:'—'}</div>
				</Tooltip>
			),
		},
		{
			title: '文件类型',
			dataIndex: 'type',
			key: 'type',
			width: 100,
			filters: [
				{ text: '政策文件', value: '政策文件' },
				{ text: '政府文件', value: '政府文件' },
				{ text: '政策解读', value: '政策解读' },
			],
			// sorter: true,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>16)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center text-hidden"}
					     onClick={null}>{_text?_text:'—'}</div>
				</Tooltip>
			),
		},
		{
			title: '有效性',
			dataIndex: 'is_working',
			key: 'is_working',
			width: 90,
			filters: [
				{ text: '有效', value: 1 },
				{ text: '无效', value: 0 },
			],
			// sorter: true,
			render: (_text, _record, _index) => (
				<Tooltip title={_text===1?'有效':'无效'} overlayClassName='my-model-table'>
					<div className={"w-full flex justify-center items-center"}>
						<div className={"w-[28px] h-[28px] flex justify-center items-center rounded-lg"}
						     style={{
							     background: _text===1?'rgba(221,249,225,0.40)':'rgba(188,198,189,0.17)',
							     color: _text===1?'#59A87E':'#8C8C8C',
						     }}
						     onClick={null}>{_text===1?'有':'否'}</div>
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
			pathname: `/oam/policy-library/list/${props.match.params.city}/detail/${data[index].id}`,
		})
	};
	// 展示删除弹框
	const handleDelete = (index) => {
		selectedItem.current = data[index]
		setShowDeleteModal(true)
	}
	const deleteModalOnOk = async () => {
		await del(`/oam/city/policy/${props.match.params.city}/${selectedItem.current.id}`, null)
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
			city: props.match.params.city,
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
			// 提问时间
			start_date: startDate.current,
			end_date: endDate.current,
			// 有效性
			is_working: filterIsWorkingList.current,
			// 文件类型
			type: filterTypeList.current,
		}
		console.log(params)
		setLoading(true)
		const res = await get('/oam/city/policy', params)
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
		filterIsWorkingList.current = filters.is_working
		filterTypeList.current = filters.type
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
					{label: '政策库管理', router: '/oam/policy-library'},
					{label: (props.match.params.city==='bj'?'北京':'宁夏')+'政策库', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
				<span className={"text-base font-medium"}>{(props.match.params.city==='bj'?'北京':'宁夏')+'政策库'}</span>
				{/*搜索和按钮*/}
				<div className={"mt-4 w-full h-[36px] flex items-center"}>
					{/*search框筛选*/}
					<SearchBig placeholder='标题/发文机构/发文字号'
					           ml={false}
					           style={{width: '284px'}}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e => keydown(e)}/>
					<div className={"ml-[3vw] flex items-center"}>
						<span className={"mr-[0.5vw]"}>创建日期</span>
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
			{/*删除弹框*/}
			<DraggableModalPrompt
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-base text-black-dark flex items-center">确定删除<span className="max-w-[180px] text-main pl-1 pr-1 text-hidden">{selectedItem.current?.title}</span>政策文件吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
