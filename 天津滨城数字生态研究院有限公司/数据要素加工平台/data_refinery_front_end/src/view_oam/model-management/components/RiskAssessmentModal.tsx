import React, {useEffect, useRef, useState} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../components/draggable-modal";
import TypeShowComponent from "../user-model/components/TypeShowComponent";
import ButtonFifth from "../../../components/ButtonFifth";
import ButtonMain from "../../../components/ButtonMain";
import SearchBig from "../../../components/SearchBig";
import {message, Pagination, Table, Tooltip} from "antd";
import {get} from "../../../axios";
import ViewSvg from "../../../icon/table/ViewSvg";

export default function RiskAssessmentModal(props: IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel} = props;
	const [tableData,setTableData] = React.useState([])
	const keyword = useRef('')
	const pageSize = useRef(10);
	const pageSizeChange = useRef(false);
	// 升序
	const orderByAsc = useRef('')
	const orderByDesc = useRef('')
	const pageNum = useRef(1);
	const [pageSum, setPageSum] = useState(0);
	const [selectedDataResource, setSelectedDataResource] = useState(null)
	const [showTable, setShowTable] = useState(false)
	const [loading,setLoading] = useState(false);
	// 是否是首次加载
	const [first,setFirst] = useState(true)
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: '10%',
		},
		{
			title: '名称',
			dataIndex: 'title',
			key: 'title',
			width: '60%',
			render: (_text, _record, _index) => (
				<span className={"w-full flex hover:cursor-pointer hover:text-main hover:font-medium text-hidden"}
				      onClick={() => handleView(_index)}>{_text}</span>
			),
		},
		{
			title: '类型',
			dataIndex: 'data_type',
			key: 'data_type',
			width: '10%',
		},
		{
			title: '样本',
			dataIndex: 'count',
			key: 'count',
			width: '10%',
		},
		{
			title: '操作',
			key: 'action',
			width: '10%',
			render: (_text, _record, index) => (
				<span className={"inline-flex items-center text-table-icon"}>
					<Tooltip title="查看" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-blue`}
                  onClick={() => handleView(index)}><ViewSvg/></span>
          </Tooltip>
				</span>
			),
		}
	]
	// mounted
	useEffect(()=>{
		if(show) {
			const defaultDataResource = {
				id: 1,
				title: '数据资源1',
				data_type: '表格',
				count: 100,
			}
			setSelectedDataResource(defaultDataResource)
		}
		return () => {
			setSelectedDataResource(null)
			setShowTable(false)
			setTableData([])
			keyword.current = ''
			pageNum.current = 1
			pageSize.current = 10
		}
	},[show])
	// methods
	const onOkInner = () => {
		if(selectedDataResource === null){
			message.warning('请先选择数据资源')
			return
		}
		onOk(selectedDataResource)
	}
	// @ts-ignore
	const onCancelInner = () => {
		onCancel()
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
	const search = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
			type: 2,
		}
		console.log(params)
		setLoading(true)
		const {data} = await get('/drapi/dataset/datasets',params)
		// 判断是否为特殊情况,data.total_num>0,但是data.list为空,而且pageNum.current>1
		if (data.total_num > 0 && data.list.length === 0 && pageNum.current > 1) {
			pageNum.current -= 1
			search()
			return
		}
		setTableData(data.list.map((item,_index)=>{
			return {
				...item,
				key: item.id,
			}
		}))
		setPageSum(data.total_num)
		setLoading(false)
		if (first) {
			setFirst(false)
		}
	}
	const handleView = (index) => {
		console.log('into handleView, index: ', index)
		// window.open(location.origin)
	}
	// 表格相关
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
		search()
	};
	const rowSelection = {
		onChange: (selectedRowKeys: React.Key[], selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			setSelectedDataResource(selectedRows[0])
		},
	};
	const clickChangeDataResource = () => {
		if(!showTable) {
			setShowTable(true)
			search()
		}
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='oam-user-model-risk-assessment-modal'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full flex flex-col"}>
				{/*上*/}
				<div className={"w-full h-[189px] pl-[58px] pr-[51px] flex justify-between items-center"}>
					{/*左*/}
					<div className={"flex flex-col"}>
						<div className={"flex items-center text-base"}>
							<span className={"flex items-center"}>模型:</span>
							<span className={"ml-4 flex items-center text-hidden"}
							      title={data?.name.length>13?data?.name:null}
							      style={{}}>{data?.name}</span>
						</div>
						<div className={"mt-2.5 w-full h-[22px] flex items-center"}>
							{
								data?.model_type_desc &&
								<TypeShowComponent name={data?.model_type_desc}
																	 style={{background:'#e3f2f3',color:'#4CAAB4'}}/>
							}
						</div>
						<div className={"mt-[21px] flex items-center text-base"}>
							<span className={"flex items-center"}>数据:</span>
							<span className={"ml-4 flex items-center text-hidden"}
							      title={selectedDataResource?.title?.length>13?selectedDataResource?.title:null}
							      style={{}}>{selectedDataResource?.title}</span>
						</div>
						<ButtonFifth text={'更换'}
						             click={clickChangeDataResource}
						             style={{width: '48px', height: '22px'}}
						             className={"mt-2.5"}/>
					</div>
					{/*右*/}
					<div className={"flex"}>
						<ButtonMain text={'开始评估'}
						            disabled={selectedDataResource === null}
						            click={onOkInner}
						            style={{width: '85px', height: '32px'}}/>
					</div>
				</div>
				{/*线*/}
				<div className={"w-full h-[1px] flex bg-[#F7F7F7]"}></div>
				{/*下*/}
				<div className={"w-full h-[524px] pl-[51px] pr-[51px] flex flex-col"}>
					{
						showTable &&
						<div className={"w-full h-full flex flex-col"}>
							{/*搜索*/}
							<div className={"mt-4 w-full"}>
								{/*search框筛选*/}
								<SearchBig placeholder='请输入数据集名称'
													 ml={false}
													 style={{width: '208px',height:'28px'}}
													 defaultValue={keyword.current}
													 change={e => keyword.current = e.target.value}
													 keyDown={e => keydown(e)}/>
							</div>
							{/*table*/}
							<div className={"w-full mt-4 overflow-auto"}>
								<Table
									style={{height:'330px'}}
									scroll={{ y: 288 }}
									size='small'
									loading={loading}
									dataSource={tableData}
									columns={columns}
									onChange={handleChange}
									pagination={false}
									rowSelection={{
										type: 'radio',
										...rowSelection,
									}}
								/>
							</div>
							{/*分页*/}
							<div className="mt-[38px] w-full flex justify-center">
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
						</div>
					}
				</div>
			</div>
		</DraggableModal>
	)
}
