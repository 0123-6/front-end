import React, {useEffect, useRef, useState} from "react";
import SearchBig from "../../../../../../../../components/SearchBig";
import {message, Pagination, Table, Tooltip} from "antd";
import ButtonSecond from "../../../../../../../../components/ButtonSecond";
import ButtonMain from "../../../../../../../../components/ButtonMain";
import {roleList} from "../../../../../index";
import {createRandomArray} from "../../../../../../../../utils/util";
import {modelVersionList} from "../../../../../../../../utils/static";
import {resourceTypeList} from "../../../index";
import { get } from "../../../../../../../../axios";

interface IProps {
	onOk: (data) => void
	onCancel: () => void
}

export default function FirstAuthorizedModal(props: IProps) {
	// state
	const {onOk, onCancel} = props
	const keyword = useRef('')
	// 单选选择的项
	const selectedItem = useRef(null);
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
	const [selectedRows, setSelectedRows] = useState([]);
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
			width: 184,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>12)?(_text):null} overlayClassName='my-model-table'>
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
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
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
			title: '发布时间',
			dataIndex: 'published_at',
			key: 'published_at',
			sorter: true,
			width: 151,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'—'}</div>
			),
		},
	]
	// mounted
	useEffect(() => {
		pageNum.current = 1
		pageSize.current = 10
		setSelectedRowKeys([])
		setSelectedRows([])
		init()
	}, [])
	// methods
	const init = async () => {
		await getModelTypeList()
	}
	const getModelTypeList = async () => {
		setLoading(true)
		const {data} = await get('/drapi/comp/model/types')
		let list = []
		for (let i = 0; i < data.model_types.length; i++) {
			list.push({
				key: data.model_types[i].id,
				text: data.model_types[i].name,
				value: data.model_types[i].id,
			})
		}
		modelTypeList.current = list
		search()
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
					const ci = Math.floor(Math.random()*4)
					let name = '模型名称'+index
					for(let j = 0; j < ci; j++) {
						name += '模型名称'+index
					}
					data.list[i].name = name
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
					data.list[i].nickname = '昵称'+index
					data.list[i].avatar = 'http://minio.model-hubs.cn/web-static/avatar/202308/OumTUByZN5.png'
					data.list[i].email = '909458209@qq.com'
					data.list[i].model_type_desc = modelTypeList.current[index%modelTypeList.current.length].text
					data.list[i].version = modelVersionList[index%modelVersionList.length].label
					data.list[i].published_at = '2021-08-12 12:12:12'
					data.list[i].authorized_at = '2021-08-12 12:12:12'
					data.list[i].service_start_at = '2021-08-12 12:12:12'
					data.list[i].service_end_at = '2023-08-12 12:12:12'
					data.list[i].resource_type = resourceTypeList[index%resourceTypeList.length].text
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
			model_type_id: filterTypeList.current,
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
	const onOkInner = () => {
		if(selectedRowKeys.length === 0) {
			message.error('请选择要授权的模型')
			return
		}
		onOk(selectedRows)
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
	// 多选选择的项
	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys);
		let newSelectedRows = []
		newSelectedRowKeys.forEach(
			(item) => {
				for (let i = 0; i < data.length; i++) {
					if (data[i].id === item) {
						newSelectedRows.push(data[i])
					}
				}
			}
		)
		setSelectedRows(newSelectedRows)
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys: selectedRowKeys,
		onChange: onSelectChange,
	};
	// render
	return (
		<>
			{/*搜索和按钮*/}
			<div className={"mt-[9px] pl-6 pr-6 w-full h-[36px] min-h-[36px] flex justify-between items-end"}>
				{/*search框筛选*/}
				<SearchBig placeholder='请输入模型名称'
				           ml={false}
				           style={{width: '284px'}}
				           defaultValue={keyword.current}
				           change={e => keyword.current = e.target.value}
				           keyDown={e => keydown(e)}/>
				{/*右*/}
				<div className={"flex items-center"}>
					<span className={"flex items-center"}>已选</span>
					<span className={"flex items-center text-main"}>{selectedRowKeys?.length}</span>
					<span className={"flex items-center"}>项</span>
				</div>
			</div>
			{/*表格和分页*/}
			<div className={"mt-2 pl-6 pr-6 flex-1 w-full overflow-x-auto overflow-y-scroll"}>
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
		</>
	)
}
