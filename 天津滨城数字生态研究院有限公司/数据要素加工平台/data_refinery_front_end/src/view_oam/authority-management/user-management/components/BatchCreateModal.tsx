import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import {Form, message, Pagination, Select, Table, Tooltip} from "antd";
import ProgressBarComponent from "../../../../view/my-model/create/components/ProgressBarComponent";
import {getHeaderRow} from "../../../../view/data-resource/my-data/create";
import * as XLSX from 'xlsx/xlsx.mjs';
import ButtonMain from "../../../../components/ButtonMain";
import ButtonFifth from "../../../../components/ButtonFifth";
import {DeleteOutlined} from "@ant-design/icons";
import {roleList} from "../index";
import successSvg from '../icon/success.svg'

export default function BatchCreateModal(props: IDraggableModalProps) {
	// state
	// @ts-ignore
	const history = useHistory();
	const contentRef = useRef(null);
	// const [form] = Form.useForm();
	const [number, setNumber] = useState(1);
	// @ts-ignore
	const {title, show, data, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// 数据预览全部数据
	const [fileName, setFileName] = useState('')
	const [fileErrorMessage, setFileErrorMessage] = useState('')
	const [tableAllData, setTableAllData] = useState([])
	const [tableErrorAllData, setTableErrorAllData] = useState([])
	// 数据预览表头
	const tableColumns = [
		{
			title: '序号',
			dataIndex: 'id',
			key: 'id',
			width: 50,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '姓名',
			dataIndex: '*姓名',
			key: '*姓名',
			width: 90,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					{
						_text &&
						<div className={"w-full flex items-center text-hidden"}>{_text}</div>
					}
					{
						!_text &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>*姓名必填</div>
					}
				</Tooltip>
			),
		},
		{
			title: '手机号',
			dataIndex: '*手机号',
			key: '*手机号',
			width: 120,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					{
						_text && (/^1[3456789]\d{9}$/.test(_text)) &&
						<div className={"w-full flex items-center text-hidden"}>{_text}</div>
					}
					{
						_text && !(/^1[3456789]\d{9}$/.test(_text)) &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>手机号格式错误</div>
					}
					{
						!_text &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>*手机号必填</div>
					}
				</Tooltip>
			),
		},
		{
			title: '单位',
			dataIndex: '*单位',
			key: '*单位',
			width: 230,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					{
						_text &&
						<div className={"w-full flex items-center text-hidden"}>{_text}</div>
					}
					{
						!_text &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>*单位必填</div>
					}
				</Tooltip>
			),
		},
		{
			title: '邮箱',
			dataIndex: '邮箱',
			key: '邮箱',
			width: 180,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					{
						_text && (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_text)) &&
						<div className={"w-full flex items-center text-hidden"}>{_text}</div>
					}
					{
						_text && !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_text)) &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>邮箱格式错误</div>
					}
				</Tooltip>
			),
		},
	]
	// 设置角色表头
	const tableRoleColumns = [
		{
			title: '序号',
			dataIndex: 'id',
			key: 'id',
			width: 50,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '姓名',
			dataIndex: '*姓名',
			key: '*姓名',
			width: 70,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					{
						_text &&
						<div className={"w-full flex items-center text-hidden"}>{_text}</div>
					}
					{
						!_text &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>*姓名必填</div>
					}
				</Tooltip>
			),
		},
		{
			title: '手机号',
			dataIndex: '*手机号',
			key: '*手机号',
			width: 100,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					{
						_text && (/^1[3456789]\d{9}$/.test(_text)) &&
						<div className={"w-full flex items-center text-hidden"}>{_text}</div>
					}
					{
						_text && !(/^1[3456789]\d{9}$/.test(_text)) &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>手机号格式错误</div>
					}
					{
						!_text &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>*手机号必填</div>
					}
				</Tooltip>
			),
		},
		{
			title: '密码',
			dataIndex: '*密码',
			key: '*密码',
			width: 50,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center text-hidden"}>******</div>
				</Tooltip>
			),
		},
		{
			title: '单位',
			dataIndex: '*单位',
			key: '*单位',
			width: 128,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					{
						_text &&
						<div className={"w-full flex items-center text-hidden"}>{_text}</div>
					}
					{
						!_text &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>*单位必填</div>
					}
				</Tooltip>
			),
		},
		{
			title: '邮箱',
			dataIndex: '邮箱',
			key: '邮箱',
			width: 100,
			render: (_text, _record, _index) => (
				<Tooltip title={null} overlayClassName='my-model-table'>
					{
						_text && (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_text)) &&
						<div className={"w-full flex items-center text-hidden"}>{_text}</div>
					}
					{
						_text && !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_text)) &&
						<div className={"w-full flex items-center text-hidden text-[#F06B7C]"}>邮箱格式错误</div>
					}
				</Tooltip>
			),
		},
		{
			title: '角色设置',
			dataIndex: 'role_name',
			key: 'role_name',
			fixed: 'right',
			width: 140,
			render: (_text, _record, _index) => (
				<Select size={'small'}
				        style={{width: '124px'}}
				        placeholder={"请选择角色"}
				        options={roleList}
				        value={_text}
				        onChange={value => changeRole(_record.id, value)}/>
			),
		},
	]
	const [tableShowData, setTableShowData] = useState([])
	// 表格是否通过校验
	const [isTableDataPass, setIsTableDataPass] = useState(false)
	// 总数
	// 第三部
	const [batchRole, setBatchRole] = useState(null)
	const pageSize = useRef(10);
	const pageSizeChange = useRef(false);
	const pageNum = useRef(1);
	const [pageSum, setPageSum] = useState(0);
	// mounted
	useEffect(() => {
		init()
	},[show])
	useEffect(()=>{
		if (number === 1) {

		} else if (number === 2) {
			setSelectedRowKeys([])
			setBatchRole(null)
		} else if (number === 3) {

		} else if (number === 4) {
			setSelectedRowKeys([])
			setBatchRole(null)
		}
		contentRef.current?.scrollTo(0, 0)
	}, [number])
	// methods
	const changeRole = (id, value) => {
		const newTableAllData = tableAllData.map(item => {
			if (item.id === id) {
				item.role_name = value
			}
			return item
		})
		setTableAllData(newTableAllData)
		search()
	}
	const onOkInner = async (_e) => {
		onOk(null)
	}
	// const onCancelInner = (e) => {
	// 	e.preventDefault()
	// 	onCancel()
	// }
	// 点击下一步
	const clickNextStep = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		try {
			if (number === 1) {
				if(!fileName) {
					if(!fileErrorMessage) {
						setFileErrorMessage('未选择任何文件，请上传文件')
					}
					return
				}
				search()
			} else if (number === 2) {
				if (!isTableDataPass) {
					message.error('请先修正表格中的错误')
					return
				}
				pageNum.current = 1
				search()
			} else if (number === 3) {
				// 校验是否有未设置角色的用户，如果有，提示用户
				const noRoleUser = tableAllData.find(item => !item.role_name)
				if (noRoleUser) {
					message.error('请先设置所有用户的角色')
					return
				}
			} else if (number === 4) {

			}
			setNumber(number + 1)
			document.getElementById('layoutRef')?.scrollTo(0, 0)
		} catch (e) {
			console.log(e)
		}
	}
	// 点击上一步
	const clickBeforeStep = (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (number === 1) {

		} else if (number === 2) {
			pageNum.current = 1
			search()
		} else if (number === 3) {
			pageNum.current = 1
			search()
		} else if (number === 4) {

		}
		setNumber(number - 1)
		// document.getElementById('layoutRef')?.scrollTo(0, 0)
	}
	const clickDownload = (e) => {
		e.preventDefault()
		e.stopPropagation()
		window.open(location.origin + '/新建用户名单模板.xlsx')
	}
	const clickUploadFile = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.xlsx, .xls';
		// 读取数量为1个
		input.multiple = false;
		input.onchange = (event) => {
			const files = event.target['files'];
			if (files && files.length > 0) {
				const file = files[0];
				const reader = new FileReader();
				reader.onload = e => {
					const data = e.target.result;
					const workbook = XLSX.read(data, { type: 'array' });
					const firstSheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[firstSheetName];
					const header = getHeaderRow(worksheet);
					let results = XLSX.utils.sheet_to_json(worksheet);
					// this.generateData({ header, results, });
					console.log('header: ', header)
					console.log('results: ', results)
					console.log('name: ', file.name)
					let ok = true
					if (header.length !== 4) {
						ok = false
					}
					if (header[0] !== '*姓名' || header[1] !== '*手机号' || header[2] !== '*单位' || header[3] !== '邮箱') {
						ok = false
					}
					if (!ok) {
						setFileErrorMessage('请使用正确的模板')
						return
					} else if (results.length === 0) {
						setFileErrorMessage('上传的文件中用户数据为空，请重新上传文件')
						return
					}
					results = results.map((item,index) => ({
						...item,
						key: (index+1)+'',
						id: (index+1)+'',
						role_name: null,
					}))

					// 判断数据是否通过校验
					let pass = true
					let errorAllData = []
					for (let i = 0; i < results.length; i++) {
						const item = results[i]
						let itemPass = true
						if(!item['*姓名']) {
							itemPass = false
						} else if(!item['*手机号'] || !(/^1[3456789]\d{9}$/.test(item['*手机号']))) {
							itemPass = false
						} else if(!item['*单位']) {
							itemPass = false
						} else if(item['邮箱'] && !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(item['邮箱']))) {
							itemPass = false
						}
						if(!itemPass) {
							errorAllData.push(item)
							pass = false
						}
					}
					setIsTableDataPass(pass)
					setTableErrorAllData(errorAllData)

					setFileName(file.name)
					setTableAllData(results)
					setFileErrorMessage('')
				}
				reader.readAsArrayBuffer(file);
			}
		}
		input.click();
	}
	// 删除文件
	const deleteFile = () => {
		init()
	}
	const init = () => {
		pageNum.current = 1
		pageSize.current = 10
		form.resetFields()
		setNumber(1)
		setFileName('')
		setFileErrorMessage('')
		setTableAllData([])
		setTableErrorAllData([])
		setTableShowData([])
		setIsTableDataPass(false)
		setBatchRole(null)
	}
	// 分页相关
	const onShowSizeChange = (_current, newPageSize) => {
		pageNum.current = 1
		pageSize.current = newPageSize
		pageSizeChange.current = true
	};
	const changePageNum = (value) => {
		if (pageSizeChange.current === true) {
			pageSizeChange.current = false
		} else {
			pageNum.current = value
		}
		search()
	}
	const search = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
		}
		console.log(params)
		// const res = await get('/drapi/oam/user/comps', params)
		const res = await getShowData()
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
		setTableShowData(res.data.list)
		// @ts-ignore
		setPageSum(res.data.total_num)
	}
	const changeBatchRole = (value) => {
		setBatchRole(value)
		// 遍历tableAllData，如果id在selectedRowKeys中，就修改role_name
		let newTableAllData = []
		for (let i = 0; i < tableAllData.length; i++) {
			let item = tableAllData[i]
			if (selectedRowKeys.indexOf(item.id) !== -1) {
				item.role_name = value
			}
			newTableAllData.push(item)
		}
		setTableAllData(newTableAllData)
		// 更新tableShowData
		search()
	}
	const getShowData = () => {
		// 根据pageNum和pageSize获取当前页面的数据
		let showData = []
		let start = (pageNum.current - 1) * pageSize.current
		let end = start + pageSize.current
		const dataResource = isTableDataPass ? tableAllData : tableErrorAllData
		if (end > dataResource.length) {
			end = dataResource.length
		}
		for (let i = start; i < end; i++) {
			showData.push(dataResource[i])
		}
		return {
			data: {
				total_num: dataResource.length,
				list: showData,
			}
		}
	}
	// 多选选择的项
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	// const [selectedRows, setSelectedRows] = useState<any[]>([]);
	// 多选选择的项
	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys);
		let newSelectedRows = []
		newSelectedRowKeys.forEach(
			(item) => {
				for (let i = 0; i < tableAllData.length; i++) {
					if (tableAllData[i].id === item) {
						newSelectedRows.push(tableAllData[i])
					}
				}
			}
		)
		// setSelectedRows(newSelectedRows)
		setSelectedRowKeys(newSelectedRowKeys);
		setBatchRole(null)
	};
	const rowSelection = {
		selectedRowKeys: selectedRowKeys,
		onChange: onSelectChange,
	};
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='oam-user-management-batch-create-modal label-width-130'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full h-[55.74vh] min-h-[400px] flex flex-col"}>
				{/*进度条组件*/}
				<ProgressBarComponent number={number}
				                      style={{
																marginTop: '4.44vh',
				                      }}
				                      lineWidth={'4.94vw'}
				                      nameList={['上传文件', '数据校验', '设置角色', '完成创建']}/>
				<div ref={contentRef} className={"mt-1 mb-1 flex-1 w-full flex flex-col overflow-x-hidden overflow-y-auto"}>
					{/*第一步*/}
					<div className={`flex-1 ${number===1?'flex':'hidden'} flex-col mt-[7.5vh] pl-[14.06vw]`}>
						{/*下载*/}
						<div className={"flex items-center"}>
							<span>下载：</span>
							<span className={"ml-3 cursor-pointer text-main hover:text-main-hover active:text-main-focus"} onClick={clickDownload}>下载模版</span>
						</div>
						{/*上传*/}
						<div className={"mt-5 flex items-start"}>
							<span className={"h-[42px] flex items-center"}>上传：</span>
							<div className={"ml-3 w-[320px] min-h-[42px] flex items-center"}>
								{
									fileName &&
									<div className="w-full h-[26px] pl-2 pr-4 flex justify-between items-center group hover:bg-[#f3f9fa] rounded-sm">
										<span className={"flex-1 text-hidden"}>{fileName}</span>
										<Tooltip title={"删除"} overlayClassName={'user-batch-create-modal-delete-svg'}>
											<div className={"flex justify-center items-center text-[#949a9b] hover:text-[#FD4932] cursor-pointer"}
											     onClick={deleteFile}
											>
												<DeleteOutlined style={{fontSize: '16px'}}/>
											</div>
										</Tooltip>
									</div>
								}
								{
									!fileName &&
									<div className={"w-full flex flex-col"}>
										<button className={"w-full h-[42px] flex justify-center items-center border border-[#4DA9B4] bg-[#e6f3f4] rounded-lg"}
														onClick={clickUploadFile}
										>
											<span className={"text-main"}>+选择文件</span>
										</button>
										{
											fileErrorMessage &&
											<div className={"mt-2 text-[#F17584]"}>{fileErrorMessage}</div>
										}
									</div>
								}
							</div>
						</div>
					</div>
					{/*第二步*/}
					{
						number===2 &&
						<div className={`flex-1 ${number===2?'flex':'hidden'} flex-col pl-[1.7vw] pr-[1.7vw]`}>
							{/*提示*/}
							<div className="mt-[2.5vh] h-[34px] flex items-center pl-[11px] pr-[11px] text-xs rounded bg-[#f0f8f8]">
								<span>共</span>
								<span className={"text-main"}>{tableAllData.length}</span>
								<span>条数据，可导入</span>
								<span className={"text-[#00AB5A]"}>{tableAllData.length - tableErrorAllData.length}</span>
								{
									isTableDataPass &&
									<span className={'text-hidden'}>条数据，确定要全部导入吗？确定请点击【下一步】</span>
								}
								{
									!isTableDataPass &&
									<div className={"flex items-center"}>
										<span>条数据，</span>
										<span className={"text-[#FD5E3A]"}>{tableErrorAllData.length}</span>
										<span>条数据校验未通过，按照以下提示修改源文件后重新导入。</span>
									</div>
								}
							</div>
							{/*表格*/}
							<div className={"mt-2 w-full overflow-table"}>
								<Table
									size='small'
									dataSource={tableShowData}
									// @ts-ignore
									columns={tableColumns}
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
					}
					{/*第三步*/}
					{
						number===3 &&
						<div className={`flex-1 ${number===3?'flex':'hidden'} flex-col pl-[1.7vw] pr-[1.7vw]`}>
							{/*提示*/}
							<div className="mt-[2.5vh] h-[34px] flex justify-between items-center pl-[11px] pr-[11px] text-xs rounded bg-[#f0f8f8]">
								{/*左*/}
								<div className={"flex items-center"}>
									<span>共</span>
									<span className={"text-main"}>{tableAllData.length}</span>
									<span>条数据，可导入</span>
									<span className={"text-[#00AB5A]"}>{tableAllData.length - tableErrorAllData.length}</span>
									{
										isTableDataPass &&
										<span className={'text-hidden'}>条数据，确定要全部导入吗？确定请点击【下一步】</span>
									}
								</div>
								{/*右*/}
								<div className={"flex items-center"}>
									<div className={"flex items-center"}>
										<span>已选</span>
										<span className={"text-[#4DA9B4]"}>{selectedRowKeys?.length}</span>
										<span>项</span>
									</div>
									<div className={"ml-[15px] flex items-center"}>
										<Select size={'small'}
														disabled={selectedRowKeys?.length === 0}
														style={{width: '164px'}}
														placeholder={"批量设置角色"}
														options={roleList}
														value={batchRole}
														onChange={value => changeBatchRole(value)}/>
									</div>
								</div>
							</div>
							{/*表格*/}
							<div className={"mt-2 w-full overflow-table"}>
								<Table
									size='small'
									rowSelection={rowSelection}
									dataSource={tableShowData}
									// @ts-ignore
									columns={tableRoleColumns}
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
					}
					{/*第四步*/}
					{
						number===4 &&
						<div className={`flex-1 ${number===4?'flex':'hidden'} flex-col mt-[8.6vh] items-center`}>
							<img src={successSvg} alt=""/>
							<div className="mt-[2.3vh] flex items-center font-medium">
								<span>成功创建</span>
								<span className={"text-main"}>{tableAllData.length}</span>
								<span>个账号</span>
							</div>
						</div>
					}
				</div>
				{/*按钮区域*/}
				{
					<div className={"w-full pb-[2.96vh] flex justify-center items-center"}>
						{
							number > 1 && number < 4 &&
							<ButtonFifth text={'上一步'} click={clickBeforeStep} style={{width:'72px',height:'33px'}} className={'mr-6'}/>
						}
						{
							number < 4 &&
							<ButtonMain text={'下一步'} click={clickNextStep} style={{width:'72px',height:'33px'}}/>
						}
						{
							number === 4 &&
							<ButtonMain text={'完成'} click={onOkInner} style={{width:'72px',height:'33px'}}/>
						}
					</div>
				}
			</div>
		</DraggableModal>
	)
}
