import React, {useEffect, useRef, useState} from "react";
import ButtonMain from "../../../../../../../../components/ButtonMain";
import {message, Pagination, Table, Tooltip} from "antd";
import ButtonSecond from "../../../../../../../../components/ButtonSecond";
import SetDeadlineModal from "../../../../../components/SetDeadlineModal";
import ChangeDateSecondSvg from "../../../../../icon/ChangeDateSecondSvg";

interface IProps {
	defaultAllData: any
	onOk: (data) => void
	onCancel: () => void
}

export default function SecondAuthorizedModal(props: IProps) {
	// state
	// @ts-ignore
	const {defaultAllData, onOk, onCancel} = props
	const allData = useRef(defaultAllData)
	// 单选选择的项
	const selectedItem = useRef(null);
	const [showSetDeadlineModal, setShowSetDeadlineModal] = useState(false);
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
	// 多选选择的项
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
			width: 119,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>7)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}
					     onClick={() => handleView(_index)}>
						{_text}
					</div>
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
			width: 160,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center text-hidden"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '版本',
			dataIndex: 'version',
			key: 'version',
			width: 50,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '授权期限',
			dataIndex: 'authorization_term',
			key: 'authorization_term',
			sorter: true,
			width: 170,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
		{
			title: '操作',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 46,
			render: (_text, _record, index) => (
				<span className={"w-full inline-flex items-center text-table-icon"}>
					<Tooltip title="设置期限" overlayClassName={"operator-line"}>
            <span className={`hover:cursor-pointer hover:text-[#3683dd]`}
                  onClick={() => handleChangeDate(index)}><ChangeDateSecondSvg/></span>
          </Tooltip>
				</span>
			),
		},
	]
	// mounted
	useEffect(() => {
		search()
	}, [])
	// methods
	const handleChangeDate = (index) => {
		selectedItem.current = data[index]
		setShowSetDeadlineModal(true)
	}
	const onOkInner = () => {
		// 校验所有数据的authorization_term是否为空
		let flag = true
		allData.current.forEach(item => {
			if(!item.authorization_term) {
				flag = false
			}
		})
		if(!flag) {
			message.error('请设置所有模型的授权期限')
			return
		}
		onOk(allData.current)
	}
	const onCancelInner = (e) => {
		e.preventDefault()
		onCancel()
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
	// 确认弹框
	const setDeadlineModalOnOk = (_data) => {
		console.log('into setDeadlineModalOnOk, _data: ', _data)
		console.log('selectedItem.current.id: ', selectedItem.current?.id)
		const newAllData = allData.current.map(item => {
			const matched = selectedItem.current ? (selectedItem.current.id === item.id) : selectedRowKeys.includes(item.id)
			if(matched) {
				item.startTime = _data.startTime
				item.endTime = _data.endTime
				item.authorization_term = _data.startTime + '-' + _data.endTime
			}
			return item
		})
		console.log('newAllData: ', newAllData)
		allData.current = newAllData
		setSelectedRowKeys([])
		search()
		setShowSetDeadlineModal(false)
	}
	const setDeadlineModalOnCancel = () => {
		setShowSetDeadlineModal(false)
	}
	const clickBatchSetDeadline = () => {
		selectedItem.current = null
		setShowSetDeadlineModal(true)
	}
	// 多选选择的项
	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys: selectedRowKeys,
		onChange: onSelectChange,
	};
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
	const getFalseData = (params) => {
		return {
			"code": '200',
			"msg": "success",
			"data": {
				total_num: allData.current.length,
				list: allData.current.slice((params.page_num - 1) * params.page_size, params.page_num * params.page_size),
			},
		}
	}
	const search = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			model_type_id: filterTypeList.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
		}
		console.log(params)
		setLoading(true)
		// const res = await get('/drapi/oam/user/comps', params)
		const res = getFalseData(params)
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
	// render
	return (
		<>
			{/*搜索和按钮*/}
			<div className={"mt-[9px] pl-6 pr-6 w-full h-[36px] min-h-[36px] flex justify-between items-end"}>
				{/*search框筛选*/}
				<div className={"flex items-center"}>
					<span>你确定授权</span>
					<span className={"text-main"}>{allData.current?.length}</span>
					<span>个模型吗?</span>
				</div>
				{/*右*/}
				<div className={"flex items-end"}>
					<div className={"flex items-center"}>
						<span className={"flex items-center"}>已选</span>
						<span className={"flex items-center text-main"}>{selectedRowKeys?.length}</span>
						<span className={"flex items-center"}>项</span>
					</div>
					<ButtonMain text={'批量设置期限'}
					            disabled={selectedRowKeys?.length === 0}
					            click={clickBatchSetDeadline}
					            style={{width:'122px',height:'28px'}}
					            className={"ml-[9px]"}/>
				</div>
			</div>
			{/*表格和分页*/}
			<div className={"mt-2 pl-6 pr-6 flex-1 w-full overflow-x-hidden overflow-y-scroll"}>
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
			<div className="mt-6 w-full flex justify-center">
				{
					pageSum > 10 &&
					<Pagination showSizeChanger
											responsive={true}
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
			{/*按钮*/}
			<div className={"mb-6 flex justify-center items-center"}
			     style={{marginTop:'24px'}}>
				<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'32px'}}/>
				<ButtonMain text={'确定'} className={"ml-4"} click={onOkInner} style={{width:'61px',height:'32px'}}/>
			</div>
			{/*设置期限*/}
			<SetDeadlineModal title={'设置期限'}
			                  show={showSetDeadlineModal}
			                  data={selectedItem.current}
			                  onOk={setDeadlineModalOnOk}
			                  onCancel={setDeadlineModalOnCancel}/>
		</>
	)
}
