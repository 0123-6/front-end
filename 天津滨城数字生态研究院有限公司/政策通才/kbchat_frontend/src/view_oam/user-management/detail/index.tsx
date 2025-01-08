import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {DatePicker, message, Pagination, Spin, Switch, Table, Tooltip} from "antd";
import FeedbackLikeSvg from "../../icon/FeedbackLikeSvg.svg";
import FeedbackUnlikeSvg from "../../icon/FeedbackUnlikeSvg.svg";
import { get, post } from "../../../axios";
import NavigationComponent from "../../../components/NavigationComponent";
import DefaultAvatarSvg from "../../../icon/DefaultAvatarSvg.svg";
import QuestionNumberSvg from "../../icon/QuestionNumberSvg.svg";

export default function UserManagementDetail(props) {
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
			width: 641,
			// sorter: true,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>44)?(_text):null} overlayClassName='my-model-table'>
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
			title: '提问时间',
			dataIndex: 'created_at',
			key: 'created_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
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
		const {data} = await get(`/oam/user/${params.id}`)
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
			// 提问时间
			start_date: startDate.current,
			end_date: endDate.current,
			user_id: Number(props.match.params.id)
		}
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
	// 修改状态
	const changeStatus = async (checked) => {
		const params = {
			user_id: Number(props.match.params.id),
			is_active: checked,
		}
		await post('/oam/user', params)
		message.success('修改状态成功')
	}
	// render
	return (
		// 最外层
		<div className={"w-full flex flex-col bg-white"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '用户管理', router: '/oam/user-management'},
					{label: '用户详情', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full flex flex-col rounded-lg"}>
				{/*加载效果*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{/*最外层*/}
					<div className={"w-full bg-[#f6f8fc] flex flex-col"}>
						{/*上面*/}
						<div className="flex flex-shrink-0 items-start bg-white rounded-lg pl-[1.7vw] pt-[2.3vh] pb-[2.1vh]"
						     style={{
									 backgroundImage: 'linear-gradient(178deg, #F7F9FF 0%, #FFFFFF 100%)',
							     boxShadow: '0px 0px 4px 0px rgba(230,230,230,0.5)',
						     }}
						>
							{/*头像*/}
							<div className="w-[60px] h-[60px] rounded-full overflow-hidden outline-2 outline outline-white-divide">
								<img className="" src={(data?.avatar) ? (data?.avatar) : DefaultAvatarSvg} alt=""
								     style={{width: '100%', height: '100%'}}/>
							</div>
							{/*用户信息*/}
							<div className={"ml-4 flex flex-col"}>
								<span className="text-[17px] text-[#0D162A] font-semibold">{data?.nickname}</span>
								<div className={"mt-[1vh] flex items-center"}>
									<span className={"flex items-center"}>用户名：{data?.username}</span>
									<span className={"ml-[2.5vw] flex items-center"}>手机号：{data?.mobile}</span>
									{/*<span className={"ml-[2.5vw] flex items-center"}></span>*/}
								</div>
								<div className={"mt-[1vh] flex items-center"}>
									<span className={"flex items-center"}>机构名称：{data?.organization}</span>
								</div>
								<div className={"mt-[1vh] flex items-center"}>
									<span className={"flex items-center"}>注册时间：{data?.date_joined}</span>
								</div>
								<div className={"mt-[1vh] flex items-center"}>
									{
										data?.is_active &&
										<>
											<Switch defaultChecked={data?.is_active}
															size={'small'}
															onChange={(checked) => changeStatus(checked)}/>
											<span className={"ml-1"}>{data?.is_active?'启用':'禁用'}</span>
										</>
									}
								</div>
							</div>
							{/*问题数量*/}
							<div className={"ml-[8vw] mt-[1.6vh] flex flex-col items-center"}>
								<img src={QuestionNumberSvg} alt=""/>
								<span className="mt-[0.7vh] flex items-center text-[18px] font-medium">{pageSum}</span>
								<span className={"mt-1.5 flex items-center"}>提问数</span>
							</div>
						</div>
						{/*下面*/}
						<div className={"mt-3 flex flex-col bg-white pl-8 pr-8 pt-[34px] rounded-lg"}>
							{/*TA的提问*/}
							<div className={"flex items-center"}>
								<div className={"w-[4px] h-[12px] bg-main rounded-sm"}/>
								<span className={"ml-2 text-base text-black-dark"}>TA的提问</span>
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
		</div>
	)
}
