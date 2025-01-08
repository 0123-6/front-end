import React, {useEffect, useRef, useState} from "react";
import {Pagination, Popover, Spin, Table, Tooltip} from "antd";
import searchLightSvg from "../../icon/searchLightSvg.svg";
// import searchSvg from "../../icon/searchSvg.svg";
import NoSearchData from "./icon/NoSearchData.svg";
import { get } from "../../axios";
import {useHistory} from "react-router-dom";

interface IHistroyContentProps {
	// keyword: string;
	show: boolean;
	onclick: (keyword: string) => void;
}

const HistoryContent = (props: IHistroyContentProps) => {
	// state
	const {show,onclick} = props;
	// const {keyword} = props;
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	// mounted
	useEffect(() => {
		if(show) {
			search()
		} else {
			setData([])
		}
	}, [show]);
	// methods
	const search = async () => {
		// const params = {
		// 	keyword: keyword,
		// }
		setLoading(true)
		const {data} = await get('/search/history', null)
		setData(data)
		setLoading(false)

	}
	// render
	return (
		<Spin spinning={loading} size="default" tip="加载中...">
			<div className={"w-[800px] h-[240px] rounded-lg flex flex-col pt-2.5 pb-2.5"}
			     style={{
						 boxShadow: '0px 2px 8px 0px rgba(217,222,238,1)',
			     }}
			>
				{
					data.map((item, index) => (
						<div className={"h-[44px] hover:bg-[#f3f6ff] flex items-center pl-[22px] pr-[22px] cursor-pointer"}
						     key={index}
						     onClick={() => onclick(item.query)}
						>
							<span className={"text-base text-black-dark text-hidden"}>{item.query}</span>
						</div>
					))
				}
			</div>
		</Spin>
	)
}

export default function Search() {
	// state
	const history = useHistory();
	// 搜索部分input是否聚焦
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	// 搜索分页相关
	const pageSize = useRef(10);
	const pageSizeChange = useRef(false);
	const pageNum = useRef(1);
	const [loading,setLoading] = useState(false)
	const [searchData,setSearchData] = useState([])
	// 全部数量
	const [pageSum, setPageSum] = useState(0);
	// 是否搜索了
	const [isSearched, setIsSearched] = useState(false);
	const [showPopover,setShowPopover] = useState(false)
	const searchInputRef = useRef(null)
	// search分页column
	const columns = [
		{
			title: <span className={"pl-2"}>名称</span>,
			dataIndex: 'title',
			key: 'title',
			width: 430,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>29)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full h-[33px] flex items-center cursor-pointer hover:text-main group"}
					     onClick={() => handleView(_index)}>
						<div className={"ml-2 flex-1 flex items-center text-hidden"}>{_text}</div>
					</div>
				</Tooltip>
			),
		},
		{
			title: '发文机构',
			dataIndex: 'pub_name',
			key: 'pub_name',
			width: 230,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>15)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full h-[33px] flex items-center"}>
						<span className={"text-hidden"}>{_text}</span>
					</div>
				</Tooltip>
			),
		},
		{
			title: '发布时间',
			dataIndex: 'pub_time',
			key: 'pub_time',
			width: 140,
			render: (_text, _record, _index) => (
				<div className={"w-full h-[33px] flex items-center"}>{_text?_text:'-'}</div>
			),
		},
	]
	// mounted
	useEffect(()=>{
		const oldUser = JSON.parse(localStorage.getItem('user') || 'null')
		if(oldUser){

		} else {
			history.replace('/login')
		}
	},[])
	useEffect(() => {
		// 如果searchData为空，就获取新的
		if (searchData.length === 0) {
			getNewPolicy()
		}
	}, [])
	// methods
	const onKeyDownSearch = (e) => {
		if (e.keyCode === 13) {
			pageNum.current = 1
			search()
		}
	}
	// 获取最新政策
	const getNewPolicy = async () => {
		setLoading(true)
		// const {data} = await get('/policy/new')
		// const {data} = await get('/policy/new')
		const {data} = await get('/search/latest/zc')
		// 给data.list的每一项添加key,为项的id
		data.list.forEach((item) => {
			item.key = item.id
		})
		setSearchData(data.list)
		setPageSum(data.total_num)
		setLoading(false)
	}
	// 搜索
	const search = async (e=null) => {
		if(e) {
			e.preventDefault()
			e.stopPropagation()
			pageNum.current = 1
		}
		setShowPopover(false)
		// 如果搜索内容为空，设置为未搜索
		if (searchInputRef.current.value === '') {
			setIsSearched(false)
			getNewPolicy()
			return
		}
		const params = {
			query: searchInputRef.current.value,
			page_num: pageNum.current,
			page_size: pageSize.current,
		}
		setLoading(true)
		const {data} = await get('/search/query', params)
		// 判断是否为特殊情况,data.total_num>0,但是data.list为空,而且pageNum.current>1
		if (data.total_num > 0 && data.list.length === 0 && pageNum.current > 1) {
			pageNum.current -= 1
			search()
			return
		}
		setIsSearched(true)
		// 给data.list的每一项添加key,为项的id
		data.list.forEach((item) => {
			item.key = item.id
		})
		setSearchData(data.list)
		setPageSum(data.total_num)
		setLoading(false)
	}
	const handleFocusSearch = () => {
		// 将search的input设置为true
		setIsSearchFocused(true)
	}
	const handleBlurSearch = () => {
		// 将search的input设置为false
		setIsSearchFocused(false)
	}
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
	// @ts-ignore
	const handleChange = (pagination, filters, sorter) => {
		// console.log('Various parameters', pagination, filters, sorter);
		// filterStatusList.current = filters.status_desc
		// orderByAsc.current = null
		// orderByDesc.current = null
		// if (sorter && sorter.order) {
		//   if (sorter.order === 'ascend') {
		//     orderByAsc.current = sorter.columnKey
		//   } else if (sorter.order === 'descend') {
		//     orderByDesc.current = sorter.columnKey
		//   }
		// }
		pageNum.current = 1
		search()
	};
	// @ts-ignore
	const handleView = (index) => {
		history.push(`/search/detail/${searchData[index].id}`)
	}
	const setSearchInputFocused = () => {
		searchInputRef.current.focus()
	}
	const handleOpenChange = (newOpen: boolean) => {
		setShowPopover(newOpen);
	};
	const clickHistoryItem = (keyword) => {
		// 将值赋值给searchInputRef
		searchInputRef.current.value = keyword
		search()
		setShowPopover(false)
	}
	// render
	return (
		<div className={"mt-[200px] w-full flex flex-col items-center"}>
			<Popover title={null}
			         overlayClassName={'search-popover'}
			         trigger="hover"
			         open={showPopover}
			         onOpenChange={handleOpenChange}
			         content={HistoryContent({show:showPopover,onclick:clickHistoryItem})}
			>
				{/*搜索框*/}
				<div className={`w-[800px] pl-[22px] pr-[22px] h-[60px] flex justify-between items-center bg-white rounded-2xl hover:outline hover:outline-1 hover:outline-main ${isSearchFocused?'outline outline-1 outline-main':''}`}
				     style={{
					     boxShadow: '0px 2px 8px 0px rgba(217,222,238,1)',
				     }}
				     onClick={setSearchInputFocused}
				>
					<input type="text"
					       ref={searchInputRef}
					       style={{
						       fontSize: '18px',
					       }}
					       autoComplete={"off"}
					       className={"flex-1"}
					       placeholder={"请输入要搜索的内容"}
					       onKeyDown={onKeyDownSearch}
					       onFocus={handleFocusSearch}
					       onBlur={handleBlurSearch}/>
					<span className={"flex items-center cursor-pointer"}
					      onClick={search}>
                  {/*<img src={searchInputRef.current?.value?searchLightSvg:searchSvg} alt=""/>*/}
                  <img src={searchLightSvg} alt=""/>
                </span>
				</div>
			</Popover>
			<div className={"w-[800px] flex flex-col"}>
				<span className={"mt-[35px] flex items-center text-black-dark font-semibold text-base"}>{isSearched?'搜索结果':'最新政策'}</span>
				{/*table*/}
				{
					(pageSum > 0 || loading) &&
					<div className={"mb-[200px] pb-6 w-full mt-4 bg-white rounded-2xl"}
							 style={{boxShadow: '0px 2px 8px 0px rgba(217,222,238,1)'}}>
						<Table
							size='small'
							loading={loading}
							dataSource={searchData}
							// @ts-ignore
							columns={columns}
							onChange={handleChange}
							pagination={false}
							scroll={{ x: 'max-content' }} // 设置自适应宽度
						/>
						{/*分页*/}
						{
							pageSum > 10 &&
							<div className="mt-6 w-full flex justify-center">
								{
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
						}
					</div>
				}
				{
					pageSum === 0 && isSearched && !loading &&
					<div className={"w-full flex flex-col items-center"}
							 style={{marginTop:'12.2vh'}}>
						<img src={NoSearchData} alt=""/>
						<span className={"mt-4 text-base text-black-dark"}>未搜索到结果</span>
					</div>
				}
			</div>
		</div>
	)
}
