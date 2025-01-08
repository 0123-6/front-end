import React, {useEffect, useRef, useState} from "react";
import DraggableModal from "../../../../components/draggable-modal";
import SearchBig from "../../../../components/SearchBig";
import {message, Pagination, Table} from "antd";
import { get } from "../../../../axios";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";

interface IProps {
	title: string;
	api: string;
	table_head_list: ITableHead[];
	show: boolean;
	onOk: (params: any) => void;
	onCancel: () => void;
}

interface ITableHead {
	key: string;
	title: string;
}

export default function AutoModal(props: IProps): JSX.Element {
	// state
	let {title, api, table_head_list, show,onOk, onCancel} = props;
	if(table_head_list) {
		table_head_list = table_head_list.map(item => {
			return {
				...item,
				width: item?.key==='id'?100:null,
				dataIndex: item?.key
			}
		})
	}
	const keyword = useRef('')
	const pageSize = useRef(10);
	const pageSizeChange = useRef(false);
	const pageNum = useRef(1);
	const [pageSum, setPageSum] = useState(0);
	// 是否是首次加载
	const [first,setFirst] = useState(true)
	const [loading,setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [selectItem,setSelectItem] = useState(null);
	// mounted
	// 初始化函数
	useEffect(() => {
		if(props.show) {
			keyword.current = ''
			search()
		}
	},[show]);
	// methods
	// 点击确定按钮
	const modalOnOk = () => {
		if (selectItem) {
			onOk({
				...selectItem,
			})
			setSelectItem(null)
		} else {
			message.warn('请'+title)
		}
	}
	const modalOnCancel = (e) => {
		e.preventDefault();
		onCancel();
	}
	const keydown = (e) => {
		if(e.keyCode === 13) {
			changeKeyword()
		}
	}
	const changeKeyword = () => {
		pageNum.current = 1
		search()
	}
	const search = async () => {
		const params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
		}
		setLoading(true)
		const {data} = await get('/drapi' + api, params)
		// 判断是否为特殊情况,data.total_num>0,但是data.list为空,而且pageNum.current>1
		if (data.total_num > 0 && data.list.length === 0 && pageNum.current > 1) {
			pageNum.current -= 1
			search()
			return
		}
		setData(data.list.map(item => {
			return {
				...item,
				key: item.id
			}
		}))
		setPageSum(data.total_num)
		setLoading(false)
		if (first) {
			setFirst(false)
		}
	}
	// 分页相关
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
	const rowSelection = {
		onChange: (selectedRowKeys: React.Key[], selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			setSelectItem(selectedRows[0])
		},
	};
	// render
	return (
		<DraggableModal
			title={title}
			wrapClassName={'processing-create'}
			onCancel={modalOnCancel}
			show={show}
		>
			{
				show &&
				<div className={"w-full flex flex-col pl-6 pr-6"} style={{}}>
					{/*搜索*/}
					<div className={"mt-4 w-full"} style={{height:'40px'}}>
						{/*search框筛选*/}
						<SearchBig placeholder={`${title}`}
											 ml={false}
											 defaultValue={keyword.current}
											 change={e => keyword.current = e.target.value}
											 keyDown={e => keydown(e)}/>
					</div>
					{/*table*/}
					<div className={"w-full mt-4 overflow-auto"}>
						<Table
							style={{height:'422px'}}
							scroll={{ y: 380 }}
							size='small'
							loading={loading}
							dataSource={data}
							columns={table_head_list}
							pagination={false}
							rowSelection={{
								type: 'radio',
								...rowSelection,
							}}
						/>
					</div>
					{/*分页*/}
					{
						(pageSum > 10 || true) &&
						<div className="mt-4 pb-6 w-full flex justify-center">
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
						</div>
					}
					{/*按钮*/}
					<div className="mt-6 pb-6 w-full flex justify-center items-center">
						<ButtonSecond text={'取消'} click={onCancel} style={{width:'61px',height:'32px'}}/>
						<ButtonMain text={'确定'} className={"ml-4"} click={modalOnOk} style={{width:'61px',height:'32px'}}/>
					</div>
				</div>
			}
		</DraggableModal>
	)
}
