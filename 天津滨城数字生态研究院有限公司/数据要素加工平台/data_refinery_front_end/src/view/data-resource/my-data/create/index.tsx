import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import {Form, Input, message, Select, Spin, Table, Upload} from "antd";
import NavigationComponent from "../../../../components/NavigationComponent";
import DataResource from "../../detail/icon/DataResource.svg";
import DataResourceLight from "../../detail/icon/DataResourceLight.svg";
import {getRandomNItems, handleKeyDownDisabled} from "../../../../utils/util";
import ProgressBarComponent from "../../../my-model/create/components/ProgressBarComponent";
import {PlusOutlined} from "@ant-design/icons";
import {applicationFieldList, dataTypeList, dataTypeMap} from "../../../../utils/static";
import UploadSvg from "../../../my-model/create/icon/UploadSvg.svg";
import { post } from "../../../../axios";
import ButtonMain from "../../../../components/ButtonMain";
import ButtonSecond from "../../../../components/ButtonSecond";
import TypeList from "../../../../components/TypeList";
import ProcessingLine from "../components/ProcessingLine";
import ImageEditorModal from "../../../my-model/create/components/ImageEditorModal";
import * as XLSX from 'xlsx/xlsx.mjs';
import EditTable from "../../../../components/EditTable";
import {dataPreviewColumnsMap, dataResourceTypeToFileTypeMap} from "../../static";

export const getHeaderRow = sheet => {
	const headers = [];
	const range = XLSX.utils.decode_range(sheet['!ref']);
	let C;
	const R = range.s.r;
	/* start in the first row */
	for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
		const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
		/* find the cell in the first row */
		let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
		if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
		headers.push(hdr);
	}
	return headers;
}

export default function DataResourceMyDataCreate() {
	// state
	const history = useHistory();
	const [form] = Form.useForm();
	const [number, setNumber] = useState(1);
	const [type, setType] = useState('');
	// 多个文件list 组件用
	const [fileUrlList, setFileUrlList] = useState([]);
	const [coverUrl, setCoverUrl] = useState('');
	const [coverLoading, setCoverLoading] = useState(false);
	// 展示弹框
	const [showImageEditorModal, setShowImageEditorModal] = useState(false)
	const [coverFile, setCoverFile] = useState(null)
	// 数据预览
	const dataPreviewIndex = useRef('前10')
	const dataPreviewIndexList = ['前10','后10','随机10']
	// 数据预览全部数据
	const [dataPreviewAllData, setDataPreviewAllData] = useState([])
	const [dataPreviewData, setDataPreviewData] = useState([])
	// 抽样
	const [samplingProgress, setSamplingProgress] = useState(0)
	const timer = useRef(null)
	// 第5步
	const [editTableData, setEditTableData] = useState([])
	// mounted
	useEffect(() => {
		form.resetFields()
	}, [])
	useEffect(() => {
		if(number === 1) {

		} else if(number === 2) {

		} else if(number === 3) {
			dataPreviewIndex.current = '前10'
			getDataPreview()
		} else if(number === 4) {

		}
	}, [number])
	// methods
	// @ts-ignore
	const goBack = (e = undefined) => {
		if (e) {
			e.preventDefault()
		}
		history.goBack()
	}
	const create = async () => {
		console.log('create')
	}
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	}
	const fileHandleChange = (_data) => {
		console.log('into handleChange')
		console.log('_data: ', _data)
		form.setFieldValue('fileUrlList', _data.fileList)
		form.validateFields(['fileUrlList'])
		setFileUrlList(_data.fileList)
		const newFileList = _data.fileList.filter(item => item.status === 'done')
		if(type === 'text') {
			const newTextList = []
			newFileList.forEach(item => {
				// 获取原始file
				const file = item.originFileObj
				// 解析txt内容
				const reader = new FileReader()
				reader.onload = (e) => {
					const text = e.target.result
					newTextList.push(text)

					console.log('newTextList: ', newTextList)
					setDataPreviewAllData(newTextList.map((item, index) => ({
						key: index,
						text: item,
						id: index,
					})))

				}
				reader.readAsText(file)
			})
		} else if(type === 'csv') {
			if(newFileList.length === 0) {
				return
			}
			// 获取原始file
			const file = newFileList[0].originFileObj
			// 解析表格内容
			const reader = new FileReader();
			reader.onload = e => {
				const data = e.target.result;
				const workbook = XLSX.read(data, { type: 'array' });
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];
				const header = getHeaderRow(worksheet);
				const results = XLSX.utils.sheet_to_json(worksheet);
				// this.generateData({ header, results, });
				console.log('header: ', header)
				console.log('results: ', results)
				dataPreviewColumnsMap.csv = header.map(item => ({
					title: item,
					dataIndex: item,
					key: item,
				}))
				setEditTableData(header.map((item,index) => ({
					key: (index+1)+'',
					name: item,
					type: 'string',
					description: '',
				})))
				const newResults = results.map((item, index) => ({
					...item,
					key: (index+1)+'',
				}))
				setDataPreviewAllData(newResults)
			};
			reader.readAsArrayBuffer(file);
		} else if(type === 'image') {
			setDataPreviewAllData(newFileList.map(item => ({
				name: item.name.split('.')[0],
				url: item.response.data.urls[0],
				format: item.name.split('.')[1],
			})))
		} else if(type === 'video') {
			setDataPreviewAllData(newFileList.map(item => ({
				name: item.name.split('.')[0],
				url: item.response.data.urls[0],
				format: item.name.split('.')[1],
			})))
		} else if(type === 'audio') {
			setDataPreviewAllData(newFileList.map(item => ({
				name: item.name.split('.')[0],
				url: item.response.data.urls[0],
				format: item.name.split('.')[1],
			})))
		}
	}

	// 抽样
	const getSampling = () => {
		if(!timer.current) {
			timer.current = setInterval(() => {
				console.log('samplingProgress: ', samplingProgress)
				setSamplingProgress(prevState => {
					const newValue = Math.min(100, prevState + 10)
					console.log('newValue: ', newValue)
					if(newValue === 100) {
						clearInterval(timer.current)
						timer.current = null
					}
					return newValue;
				})
			}, 200)
		}
	}
	// 点击下一步
	const clickNextStep = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		try {
			if(number === 1) {
				await form.validateFields(['name', 'coverUrl', 'type', 'industry', 'description'])
			} else if(number === 2) {
				await form.validateFields(['fileUrlList'])
			} else if(number === 3) {
				getSampling()
			}
			setNumber(number + 1)
			document.getElementById('layoutRef')?.scrollTo(0, 0)
		} catch (error) {
			console.log('error: ', error)
		}
	}
	// 点击上一步
	const clickBeforeStep = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setSamplingProgress(0)
		setNumber(number - 1)
		document.getElementById('layoutRef')?.scrollTo(0, 0)
	}
	// 删除文件
	const fileHandleRemove = (_file = null) => {
		console.log('into handleRemove')
		console.log('_file: ', _file)
		const newFileList = fileUrlList.filter(item => item.uid !== _file.uid)
		setFileUrlList(newFileList)
		setDataPreviewAllData(newFileList)
		form.setFieldValue('fileUrlList', newFileList)
		form.validateFields(['fileUrlList'])
	}
	const clickUploadDatasetCover = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (event) => {
			// @ts-ignore
			const file = event.target.files[0];
			console.log('file: ', file)
			const reader = new FileReader();
			reader.onload = () => {
				setCoverFile(file);
				setShowImageEditorModal(true)
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}
	// 编辑图片弹框事件
	const imageEditorModalOnOk = async (_data) => {
		const {imageFile} = _data
		setShowImageEditorModal(false)
		setCoverUrl(URL.createObjectURL(imageFile))
		form.setFieldValue('coverUrl', null)
		setCoverLoading(true)
		const params = {
			business_type: 'dataset-cover',
			avatar: imageFile,
		}
		const res = await post('/drapi/file/upload', params, {headers: {'Content-Type': 'multipart/form-data'}})
		const url = res.data.urls[0]
		setCoverUrl(url)
		form.setFieldValue('coverUrl', url)
		form.validateFields(['coverUrl'])
		setCoverLoading(false)
	}
	const imageEditorModalOnCancel = () => {
		setShowImageEditorModal(false)
	}
	// @ts-ignore
	const fileUrlOnDrop = (e) => {
		console.log('into onDrop')
		console.log('e: ', e)
		const {name} = e.dataTransfer.files[0]
		const fileName = name
		if (type && fileName) {
			const fileType = fileName.split('.').pop()
			const formatFileTypeList = dataResourceTypeToFileTypeMap[type]
			let ok = false
			for(let i=0;i<formatFileTypeList.length;i++) {
				if(formatFileTypeList[i].includes(fileType)) {
					ok = true
					break
				}
			}
			if(!ok) {
				message.warn('文件格式不正确')
			}
		}
	}
	// 停止上传
	// @ts-ignore
	// const fileStopUpload = () => {
	// 	if (fileUrl) {
	// 		message.warn('请先删除已上传的文件')
	// 	}
	// }
	const fileBeforeUpload = (_file) => {
		console.log('before into 上传')
		// if (fileUrl) {
		// 	console.log('ssssss')
		// 	return false
		// }
	}
	const changeDataPreviewIndex = (value) => {
		dataPreviewIndex.current = value + ''
		// message.success('点击了' + value)
		getDataPreview()
	}
	// 数据预览接口
	const getDataPreview = async () => {
		let newData = []
		if (dataPreviewIndex.current === '前10') {
			newData = dataPreviewAllData.slice(0, 10)
		} else if (dataPreviewIndex.current === '后10') {
			newData = dataPreviewAllData.slice(-10)
		} else if (dataPreviewIndex.current === '随机10') {
			newData = getRandomNItems(dataPreviewAllData, 10)
		}
		for(let i=0;i<newData.length;i++) {
			newData[i] = {
				...newData[i],
				key: i+1,
				id: i+1,
				url: newData[i].url,
				format: newData[i].format,
			}
		}
		setDataPreviewData(newData)
	}
	const clickResample = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setSamplingProgress(0)
		setTimeout(() => {
			getSampling()
		}, 300)
	}
	// render
	return (
		// 最外层
		<div className="w-full flex flex-col items-center bg text-sm leading-[14px]">
			<NavigationComponent width={1080} data={[
				{label: '数据资源', router: '/data-resource',icon:DataResource,iconActive:DataResourceLight},
				{label: '我的数据', router: '/data-resource/my-data',},
				{label: '创建数据', disabled: true},
			]}/>
			{/*主体内容*/}
			<div className={`flex-1 mb-7 flex flex-col bg-white pt-10 shadow-card rounded ${number === 1 ? 'label-width-139' : 'label-width-355'} `}
			     style={{width: '1080px'}}>
				<Form form={form}
				      className={"w-full flex-1 flex flex-col"}
				      onFinish={create}
				      onFinishFailed={onFinishFailed}
				      onKeyDown={handleKeyDownDisabled}>
					<div className={"w-full flex-1 flex flex-col"}>
						{/*进度条组件*/}
						<ProgressBarComponent number={number}
						                      nameList={['填写基本信息', '上传数据', '数据预览', '抽样']}/>
						{/*名称*/}
						<Form.Item
							style={{marginTop: '32px'}}
							className={`label-height-38 ${number === 1 ? '' : 'hidden'}`}
							label="名称"
							name="name"
							rules={[
								{required: true, message: '请输入数据集名称'},
								() => ({
									validator(_, value) {
										if (value && value.length > 20) {
											return Promise.reject(new Error('数据集名称不能超过20个字符'))
										}
										return Promise.resolve()
									}
								})
							]}
						>
							<Input style={{width: 656}} placeholder={'请输入数据集名称'} autoComplete={"off"}/>
						</Form.Item>
						{/*封面*/}
						<Form.Item
							className={`${number === 1 ? '' : 'hidden'}`}
							label="封面"
							name="coverUrl"
							rules={[
								{required: true, message: '请上传封面'},
							]}
						>
							<div className={"relative"}>
								{
									!coverUrl &&
									<div className={"w-[196px] h-[112px]"}>
										<Spin spinning={coverLoading} size="small" tip="上传中...">
											<div
												className="group w-full h-full flex justify-center items-center cursor-pointer relative rounded-lg bg-white border-2 border-dashed border-[#e7eaee] hover:border-main-hover-border transition-all duration-300"
												style={{width: '192px', height: '108px'}}
												onClick={clickUploadDatasetCover}
											>
												<PlusOutlined
													className="text-[#E1E1E1] group-hover:text-main-hover-border text-[15px] transition-all duration-300"/>
											</div>
										</Spin>
									</div>
								}
								{
									coverUrl &&
									<div className={"w-[196px] h-[112px]"}>
										<Spin spinning={coverLoading} size="small" tip="上传中...">
											<img src={coverUrl} alt=""
													 onClick={clickUploadDatasetCover}
													 className={"cursor-pointer relative rounded-lg border-2 border-dashed border-[#e7eaee] hover:border-main-hover-border transition-all duration-300"}
													 style={{width: '192px', height: '108px',}}/>
										</Spin>
									</div>
								}
								<span
									className={"mt-2 flex text-xs leading-[12px] text-white-disable-text"}>图片文件类型支持png、jpg、jpeg、bmp等，图片大小不超过2M</span>
							</div>
						</Form.Item>
						{/*类型*/}
						<Form.Item
							className={`label-height-38 ${number === 1 ? '' : 'hidden'}`}
							label="类型"
							name="type"
							rules={[{required: true, message: '请选择数据集类型'}]}
						>
							<Select
								size={'large'}
								style={{width: 656}}
								options={dataTypeList}
								placeholder={'请选择数据集类型'}
								onChange={value => setType(value)}
							/>
						</Form.Item>
						{/*行业*/}
						<Form.Item
							className={`label-height-38 ${number === 1 ? '' : 'hidden'}`}
							label="行业"
							name="industry"
							rules={[{required: true, message: '请选择所属行业'}]}
						>
							<Select
								size={'large'}
								style={{width: 656}}
								options={applicationFieldList.map(item => ({label: item, value: item}))}
								placeholder={'请选择所属行业'}
							/>
						</Form.Item>
						{/*描述*/}
						<Form.Item
							className={`label-height-38 ${number === 1 ? '' : 'hidden'}`}
							label="描述"
							name="description"
							rules={[{required: true, message: '请输入数据集描述'}]}
						>
							<Input.TextArea style={{width: '656px', height: '129px'}} showCount maxLength={500}
							                onKeyDown={e => e.stopPropagation()}
							                placeholder={"请输入数据集描述"}/>
						</Form.Item>
						{/*上传数据*/}
						<Form.Item
							style={{marginTop: '12.3vh'}}
							label="上传数据"
							className={`${number === 2 ? '' : 'hidden'}`}
							name="fileUrlList"
							dependencies={['type']}
							// 文件格式需要和格式指定的文件格式一致
							rules={[
								{required: true, message: '请上传文件'},
								() => ({
									validator(_, fileList) {
										console.log('into validator')
										console.log('_:', _)
										console.log('fileList:', fileList)
										// type为空时，还没有选择格式，不需要检验
										// fileName为空时，还说明没有上传文件，不需要校验
										if(Array.isArray(fileList)) {
											if (type && fileList && fileList.length > 0) {
												let ok = true
												for (let i = 0; i < fileList.length; i++) {
													const fileName = fileList[i].name
													const fileType = fileName.split('.').pop()
													const formatFileTypeList = dataResourceTypeToFileTypeMap[type]
													let isHas = false
													for(let i=0;i<formatFileTypeList.length;i++) {
														if(formatFileTypeList[i].includes(fileType)) {
															isHas = true
															break
														}
													}
													if(!isHas) {
														ok = false
														break
													}
												}
												if(!ok) {
													return Promise.reject(new Error('文件格式不正确'))
												}
											}
										} else {
											const fileName = fileList
											if (type && fileName) {
												const fileType = fileName.split('.').pop()
												const formatFileTypeList = dataResourceTypeToFileTypeMap[type]
												let ok = false
												for(let i=0;i<formatFileTypeList.length;i++) {
													if(formatFileTypeList[i].includes(fileType)) {
														ok = true
														break
													}
												}
												if(!ok) {
													return Promise.reject(new Error('文件格式不正确'))
												}
											}
										}
										return Promise.resolve()
									}
								})
							]}
						>
							<div className={"relative"} style={{width: '451px', minHeight: '165px'}}>
								<Upload.Dragger
									fileList={fileUrlList}
									showUploadList={{
										showRemoveIcon: true,
										showPreviewIcon: false,
									}}
									name="file"
									multiple={true}
									accept={dataResourceTypeToFileTypeMap[type]}
									action={`http://${location.host}/drapi/file/upload`}
									data={{
										business_type: 'dataset-file',
										user_id: JSON.parse(localStorage.getItem("userInfo")).id
									}}
									headers={{
										Authorization: `token ${localStorage.getItem("token")}`
									}}
									beforeUpload={fileBeforeUpload}
									onChange={_data => fileHandleChange(_data)}
									onDrop={fileUrlOnDrop}
									onRemove={fileHandleRemove}
								>
									<div className={"w-full h-[165px] flex flex-col justify-center items-center text-sm leading-[14px]"}
									     style={{color: '#B7B7B7'}}>
										{/*<img src={(!fileUrl) ? UploadSvg : UploadDisabledSvg} alt=""/>*/}
										<img src={UploadSvg} alt=""/>
										<span className={"mt-4 flex items-center"}>拖拽到区域或点击上传文件</span>
										{
											type &&
											<div className={"mt-2 flex items-center"}>
												<span className={"flex items-center mr-1"}>支持多个文件上传，{dataTypeMap[type]}格式：{dataResourceTypeToFileTypeMap[type]}</span>
												{/*<Popover title={null}*/}
												{/*				 placement="rightTop"*/}
												{/*				 overlayClassName={'create-model-popover'}*/}
												{/*				 trigger="hover"*/}
												{/*				 content={ type!=='other' ? DescriptionComponent({type}) : null}*/}
												{/*>*/}
												{/*	<div className={"flex items-center text-black-light"}>*/}
												{/*		<Wenhao/>*/}
												{/*	</div>*/}
												{/*</Popover>*/}
											</div>
										}
									</div>
								</Upload.Dragger>
								{/*{*/}
								{/*	(fileUrl) &&*/}
								{/*	<div className={"absolute w-full h-full bg-main cursor-not-allowed z-30 top-0 left-0"}*/}
								{/*			 style={{backgroundColor: 'rgba(0,0,0,0)'}}*/}
								{/*			 onClick={fileStopUpload}/>*/}
								{/*}*/}
							</div>
						</Form.Item>
						{/*<div style={{height:'20vh'}}*/}
						{/*     className={`w-full ${number === 1 ? '' : 'hidden'}`}/>*/}
						{
							(number === 3 || number === 4) &&
							<div className={"mt-[3.7vh] w-full pl-[50px] pr-[50px] flex flex-col"}>
								{
									number === 3 &&
									<TypeList list={dataPreviewIndexList}
														value={dataPreviewIndex.current}
														change={changeDataPreviewIndex}/>
								}
								{
									number === 4 &&
									<div className={"h-[40px] flex items-center"}>
										<ProcessingLine percent={samplingProgress} text={'正在抽样'} finishText={'抽样完成'}/>
									</div>
								}
								{/*表格*/}
								<div className={"w-full mt-2"}>
									<Table
										size='small'
										dataSource={dataPreviewData}
										// @ts-ignore
										columns={dataPreviewColumnsMap[type]}
										pagination={false}
										scroll={{ x: 'max-content' }} // 设置自适应宽度
									/>
								</div>
							</div>
						}
						{
							number === 5 && type === 'csv' &&
							<div className="mt-[4.3vh] w-full pl-[50px] pr-[50px]">
								<EditTable
									data={editTableData}
									columns={[
										{
											title: '字段名称',
											dataIndex: 'name',
											width: '20%',
										},
										{
											title: '字段类型',
											dataIndex: 'type',
											width: '20%',
										},
										{
											title: '字段说明',
											dataIndex: 'description',
											width: '60%',
											editable: true,
										},
									]}
									change={data=>setEditTableData(data)}/>
							</div>
						}
					</div>
					{/*按钮*/}
					<div className={`mt-[6.66vh] mb-[4.35vh] w-full flex justify-center items-center`}>
						{
							number > 1 &&
							<ButtonSecond style={{width: '86px', height: '32px', lineHeight: '14px'}}
														className={"mr-6"}
														text={'上一步'}
														click={clickBeforeStep}/>
						}
						{
							number === 4 &&
							<ButtonSecond className="mr-6"
														style={{width: '86px', height: '32px', lineHeight: '14px'}}
														text={'重新抽样'}
														click={clickResample}/>
						}
						{
							(number < 4 || number === 4 && type === 'csv') &&
							<ButtonMain text={'下一步'} click={clickNextStep} style={{width: '87px', height: '32px'}}/>
						}
						{
							(number === 4 && type !== 'csv' || number === 5 && type === 'csv') &&
							<ButtonMain className=""
													style={{width: '86px', height: '32px', lineHeight: '14px'}}
													text={'确定'}
													click={null}/>
						}
					</div>
				</Form>
			</div>
			{/*弹框*/}
			<ImageEditorModal title='编辑图片'
			                  show={showImageEditorModal}
			                  data={{imageFile: coverFile}}
			                  onOk={imageEditorModalOnOk}
			                  onCancel={imageEditorModalOnCancel}/>
		</div>
	)
}
