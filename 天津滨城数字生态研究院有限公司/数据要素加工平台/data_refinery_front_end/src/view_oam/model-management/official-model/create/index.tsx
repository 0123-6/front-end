import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import NavigationComponent from "../../../../components/NavigationComponent";
import ModelManagementSvg from "../../../layout/icon/ModelManagementSvg";
import {
	AutoComplete,
	Cascader,
	Form,
	Input,
	message,
	Pagination,
	Popover,
	Select,
	Spin,
	Table,
	Tooltip,
	Upload
} from "antd";
import {modelFormatList, modelFormatToFileTypeMap} from "../../../../view/my-model/static";
import ImageEditorModal from "../../../../view/my-model/create/components/ImageEditorModal";
import {formatPhone} from "../../../../utils/util";
import ProgressBarComponent from "../../../../view/my-model/create/components/ProgressBarComponent";
import UploadSvg from "../../../../view/my-model/create/icon/UploadSvg.svg";
import UploadDisabledSvg from "../../../../view/my-model/create/icon/UploadDisabledSvg.svg";
import ButtonMain from "../../../../components/ButtonMain";
import {PlusOutlined} from "@ant-design/icons";
import Wenhao from "../../../../icon/wenhao";
import DeleteSvg from "../../../../icon/table/DeleteSvg";
import ButtonSecond from "../../../../components/ButtonSecond";
import {modelVersionList} from "../../../../utils/static";
import {MarkdownEditor} from "../../../../dag/components/MarkdownEditor";
import {get, post} from "../../../../axios";
import SearchBig from "../../../../components/SearchBig";
import {PopoverContent} from "../../../../view/data-element/common/PopoverContent";
import ViewSvg from "../../../../icon/table/ViewSvg";
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import {DescriptionComponent, inputTypeList, outputTypeList} from "../../../../view/my-model/create";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import AddLabelMapping from "../../../../components/AddLabelMapping";

interface IProps {
	type: string,
	[key: string]: any
}

const menuList = {
	'0': {
		name: '新建模型',
		value: 2,
	},
	'1': {
		name: '基于ModelOS创建',
		value: 3,
	},
	'2': {
		name: '新建非部署模型',
		value: 1,
	},
}

const progressBarComponentNameListMap = {
	'0': ['上传文件','填写基本信息'],
	'1': ['选择模型','填写基本信息'],
	'2': ['填写基本信息','填写组件信息'],
}

// 参数
export const defaultEditorData = []
// 输入桩
export const defaultInputNodeData = []
// 输出桩
export const defaultOutputNodeData = []

export default function OfficialModelCreate(props:IProps) {
	// state
	const [createType, setCreateType] = useState(null);
	const [progressBarComponentNameList, setProgressBarComponentNameList] = useState([]);
	const history = useHistory();
	const [form] = Form.useForm();
	// 模型格式
	const [modelFormat, setModelFormat] = useState('');
	const [number, setNumber] = useState(1);
	const [modelFileUrl, setModelFileUrl] = useState('');
	// 镜像文件
	const [mirrorImage, setMirrorImage] = useState(null);
	const [modelCoverUrl, setModelCoverUrl] = useState('');
	const [modelCoverLoading, setModelCoverLoading] = useState(false);
	const [modelDescription,setModelDescription] = useState('');
	const [labelMapping,setLabelMapping] = useState([]);
	// 模型类型列表
	const [modelTypeList, setModelTypeList] = useState([]);
	// 模型分类列表
	const [modelClassList, setModelClassList] = useState([]);
	// 模型图标列表
	const [modelIconList, setModelIconList] = useState([]);
	const [modelIcon, setModelIcon] = useState(null);
	// 展示弹框
	const [showImageEditorModal, setShowImageEditorModal] = useState(false);
	// 基于modelos创建
	const keyword = useRef('');
	const pageSize = useRef(10);
	const pageSizeChange = useRef(false);
	const pageNum = useRef(1);
	const [pageSum, setPageSum] = useState(0);
	// 是否是首次加载
	const first = useRef(true)
	const [loading, setLoading] = useState(false);
	const [modelOsData, setModelOsData] = useState([]);
	const [selectModelOsItem, setSelectModelOsItem] = useState(null);
	// 升降序
	// 升序
	const orderByAsc = useRef('')
	const orderByDesc = useRef('')
	// 非部署模型
	// @ts-ignore
	const [editorData, setEditorData] = useState(defaultEditorData);

	const [inputNodeData, setInputNodeData] = useState(defaultInputNodeData);

	const [outputNodeData, setOutputNodeData] = useState(defaultOutputNodeData);
	// 功能函数
	// @ts-ignore
	const [functionNodeData, setFunctionNodeData] = useState(null);
	// mounted
	useEffect(() => {
		console.log('props: ', props)
		setCreateType(props.match.params.method+'')
		setProgressBarComponentNameList(progressBarComponentNameListMap[props.match.params.method+''])
		form.resetFields()
		getModelTypeList()
		getModelClassList()
	}, [])
	useEffect(() => {
		if(props.match.params.method==='1'){
			searchModelOs()
		}
	},[modelTypeList])
	useEffect(() => {
		if(createType === '2'){
			form.setFieldValue('editorData',defaultEditorData)
			form.setFieldValue('inputNodeData',defaultInputNodeData)
			form.setFieldValue('outputNodeData',defaultOutputNodeData)
		}
	},[createType])
	// methods
	const getModelClassList = async () => {
		const {data} = await get('/drapi/comp/menu/1')
		let list = []
		for(let i=0;i<data.length;i++){
			let item = {
				label: data[i].name,
				value: data[i].id,
				children: []
			}
			for(let j=0;j<data[i].children.length;j++){
				item.children.push({
					label: data[i].children[j].name,
					value: data[i].children[j].id,
				})
			}
			list.push(item)
		}
		console.log('ModelClassList: ', list)
		setModelClassList(list)
	}
	const getModelIconList = async (id) => {
		const {data} = await get(`/drapi/comp/menu/icons/${id}`)
		let list = []
		for(let i=0;i<data.icons.length;i++){
			list.push({
				// label: <img src={`${(location.origin.indexOf('localhost')!==-1?'http://test.datarefinery.cn':location.origin)+data.icons[i].icon}`} alt={''}/>,
				label: <img src={`${data.icons[i].icon}`} alt={''}/>,
				value: data.icons[i].id,
			})
		}
		setModelIconList(list)
		setModelIcon(null)
		form.setFieldValue('modelIcon', null)
	}
	const getModelTypeList = async () => {
		const {data} = await get('/drapi/comp/model/types')
		let list = []
		for(let i=0;i<data.model_types.length;i++){
			list.push({
				label: data.model_types[i].name,
				value: data.model_types[i].id,
			})
		}
		setModelTypeList(list)
	}
	const goBack = (e = undefined) => {
		if (e) {
			e.preventDefault()
		}
		history.goBack()
	}

	// 创建模型
	const createModel = async () => {
		const formData = form.getFieldsValue(true);
		let label_mapping_object = {}
		for (let i = 0; i < labelMapping.length; i++) {
			label_mapping_object[labelMapping[i].key] = labelMapping[i].value
		}
		let params = {
			type: menuList[createType].value,
			model_framework: formData.modelFormat,
			model_addr: formData?.modelFileUrl ? formData?.modelFileUrl : null,
			mirror_image: formData?.mirrorImage ? formData?.mirrorImage : null,
			name: formData.modelName,
			cover: formData.modelCoverUrl,
			model_type_id: formData.modelType,
			comp_menu_id: formData.modelClass[formData.modelClass.length - 1],
			icon_id: formData.modelIcon[0],
			label_mapping: label_mapping_object,
			input_type: formData?.inputType,
			output_type: formData?.outputType,
			version: formData.modelVersion,
			abstract: formData.modelSimpleDescription,
			description: formData.modelDescription,
		}
		if(menuList[createType].value === 1) {
			params = {
				...params,
				// @ts-ignore
				config: editorData,
				// @ts-ignore
				input: inputNodeData,
				// @ts-ignore
				output: outputNodeData,
				// @ts-ignore
				"core_function": formData.functionNodeData,
			}
		}
		await post('/drapi/oam/platform/comps', params)
		message.success('创建成功')
		goBack()
	}
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	}
	const modelFileBeforeUpload = (_file) => {
		console.log('before into 上传')
		if (modelFileUrl) {
			console.log('ssssss')
			return false
		}
	}
	const modelFileHandleChange = (_data) => {
		console.log('into handleChange')
		console.log('_data: ', _data)
		if (_data.file.status === 'done') {
			form.setFieldValue('modelFileUrl', _data.file.response.data.urls[0])
			form.validateFields(['modelFileUrl'])
			setModelFileUrl(_data.file.response.data.urls[0])
		}
	}
	// 点击下一步
	const clickNextStep = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		try {
			if(createType==='0') {
				if(modelFormat !== 'other') {
					await form.validateFields(['modelFormat','modelFileUrl'])
				} else {
					await form.validateFields(['modelFormat'])
					// 模型文件和镜像文件必须而且只能存在一个
					const mirrorImage = form.getFieldValue('mirrorImage')
					if (modelFileUrl && mirrorImage) {
						message.warn('模型文件和镜像文件不能同时存在')
						return
					}
					if(!modelFileUrl && !mirrorImage){
						message.warn('模型文件和镜像文件必须存在一个')
						return
					}
				}
			} else if (createType==='1') {
				if(selectModelOsItem===null){
					message.warn('请选择模型')
					return
				}
			} else if (createType==='2') {
				await form.validateFields(['modelName', 'modelCoverUrl', 'modelClass', 'modelIcon', 'modelVersion', 'modelSimpleDescription', 'modelDescription'])
			}
			setNumber(2)
			document.getElementById('layoutOamRef')?.scrollTo(0, 0)
		} catch (error) {
			console.log('error: ', error)
		}
	}
	// 点击上一步
	const clickBeforeStep = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setNumber(1)
		document.getElementById('layoutOamRef')?.scrollTo(0, 0)
	}
	// 删除文件
	const modelFileHandleRemove = (_file = null) => {
		form.setFieldValue('modelFileUrl', null)
		form.validateFields(['modelFileUrl'])
		setModelFileUrl('')
	}
	// 停止上传
	const modelFileStopUpload = () => {
		if (modelFileUrl) {
			message.warn('请先删除已上传的模型文件')
		}
		if(mirrorImage) {
			message.warn('请先删除镜像文件')
		}
	}
	// 添加markdown文件
	const clickAddMarkdownFile = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const input = document.createElement('input');
		input.type = 'file';
		// 上传markdown格式文件
		input.accept = ".md,.markdown,.mdown,.mkd,.mkdn";
		input.onchange = (event) => {
			// @ts-ignore
			const file = event.target.files[0];
			// 解析markdown文件

			const reader = new FileReader();
			reader.onload = () => {
				console.log('reader.result: ', reader.result)
				setModelDescription(reader.result.toString())
			};
			reader.readAsText(file);
		};
		input.click();
	}
	// markdown文件change
	const changeModelDescription = (value) => {
		form.setFieldValue('modelDescription', value)
		form.validateFields(['modelDescription'])
		setModelDescription(value)
	}

	const [modelCoverFile, setModelCoverFile] = useState(null)

	const clickUploadModelCover = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (event) => {
			// @ts-ignore
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				setModelCoverFile(file);
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
		setModelCoverUrl(URL.createObjectURL(imageFile))
		form.setFieldValue('modelCoverUrl', null)
		setModelCoverLoading(true)
		const params = {
			business_type: 'model-cover',
			avatar: imageFile,
		}
		const res = await post('/drapi/file/upload', params, {headers: {'Content-Type': 'multipart/form-data'}})
		const url = res.data.urls[0]
		setModelCoverUrl(url)
		form.setFieldValue('modelCoverUrl', url)
		form.validateFields(['modelCoverUrl'])
		setModelCoverLoading(false)
	}
	const imageEditorModalOnCancel = () => {
		setShowImageEditorModal(false)
	}
	// 添加标签映射
	const addLabelMapping = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const newLabelMapping = [...labelMapping]
		newLabelMapping.push({key: '', value: ''})
		setLabelMapping(newLabelMapping)
		form.setFieldValue('labelMapping', newLabelMapping)
	}
	// @ts-ignore
	const modelFileUrlOnDrop = (e) => {
		const {name} = e.dataTransfer.files[0]
		const fileName = name
		if (modelFormat && fileName) {
			const fileType = fileName.split('.').pop()
			const modelFormatFileType = modelFormatToFileTypeMap[modelFormat]
			if (modelFormatFileType.indexOf(fileType) === -1) {
				message.warn('模型文件格式不正确')
			}
		}
	}
	const changeLabelMapping = (e, index, key) => {
		e.preventDefault()
		e.stopPropagation()
		const newLabelMapping = [...labelMapping]
		newLabelMapping[index][key] = e.target.value
		setLabelMapping(newLabelMapping)
		form.setFieldValue('labelMapping', newLabelMapping)
	}
	const deleteLabelMapping = (index) => {
		const newLabelMapping = [...labelMapping]
		newLabelMapping.splice(index, 1)
		setLabelMapping(newLabelMapping)
		form.setFieldValue('labelMapping', newLabelMapping)
	}
	const changeModelClass = (value) => {
		form.setFieldValue('modelClass', value)
		form.validateFields(['modelClass'])
		console.log('value: ', value)
		const id = value[value.length-1]
		getModelIconList(id)
	}
	const changeModelIcon = (value) => {
		setModelIcon(value)
		form.setFieldValue('modelIcon', value)
		form.validateFields(['modelIcon'])
	}
	// 基于modelos创建
	const keydown = (e) => {
		if (e.keyCode === 13) {
			changeKeyword()
		}
	}
	const changeKeyword = () => {
		pageNum.current = 1
		searchModelOs()
	}
	const getSearchModelOsFalse = async (params) => {
		console.log('params: ', params)
		return new Promise((resolve, _reject) => {
			setTimeout(() => {
				let list = []
				for (let i = pageSize.current * (pageNum.current-1); i < pageSize.current * pageNum.current; i++) {
					list.push(
						{
							id: i+1,
							name: '一二三四五六七八九十静态名称' + (i+1),
							model_type: 1,
							model_type_desc: modelTypeList[Math.floor((Math.random()*modelTypeList.length)) % modelTypeList.length].label,
							version: modelVersionList[i % modelVersionList.length].value,
							创建者: {
								"id": 6,
								"username": "DRuNhpZW3y",
								"nickname": i%2==0?"oam":null,
								"mobile": "17796723651",
								"email": "909458209@qq.com",
								"last_login": "2023-06-05 17:08:32",
								"avatar": "http://minio.model-hubs.cn/web-static/avatar/202305/0ShCGn3j7y.jpg",
								"description": "这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人简介，这是个人",
								"date_joined": "2023-04-12 11:29:54",
								"updated_at": "2023-06-05 17:37:12",
								"role_name": "数据要素加工者"
							},
							上架时间: '2021-08-10 12:00:00',
						},
					)
				}
				resolve({
					code: 200,
					data: {
						list,
						total_num: 100,
					},
					desc: '',
				})
			}, 200)
		})
	}
	const searchModelOs = async () => {
		console.log('into search method')
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			// filter_model_type: filterTypeList.current,
			// status: filterStatusList.current,
			order_by_desc: orderByDesc.current,
			order_by_asc: orderByAsc.current,
		}
		console.log(params)
		setLoading(true)
		// const res = await get('/drapi/kfp/pipeline/task/list/v2', params)
		const res = await getSearchModelOsFalse(params)
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
		// @ts-ignore
		if (res.data.total_num > 0 && res.data.list.length === 0 && pageNum.current > 1) {
			pageNum.current -= 1
			searchModelOs()
			return
		}
		// @ts-ignore
		setModelOsData(res.data.list)
		// @ts-ignore
		setPageSum(res.data.total_num)
		setLoading(false)
		first.current = false
	}
	const rowSelection = {
		onChange: (selectedRowKeys: React.Key[], selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			setSelectModelOsItem(selectedRows[0])
		},
	};
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
		searchModelOs()
	};
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
		searchModelOs()
	}
	const handleModelOsView = (index) => {
		console.log('into handleModelOsView,传入的index为：',index)
		console.log('selectItem: ',selectModelOsItem)
	}
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			render: (_text, _record, _index) => (
				<span className={"w-full flex hover:cursor-pointer hover:text-main text-hidden"}
				      onClick={() => handleModelOsView(_index)}>{_text}</span>
			),
		},
		{
			title: '类型',
			dataIndex: 'model_type_desc',
			filters: modelTypeList,
		},
		{
			title: '版本',
			dataIndex: 'version',
			key: 'version',
		},
		{
			title: '创建者',
			dataIndex: '创建者',
			render: (_text, _record, _index) => (
				<div className={"flex"}>
					<Popover title={null}
					         placement="leftTop"
					         overlayClassName={'person-popover-2'}
					         trigger="hover"
					         content={PopoverContent({user: _text,showPhone: true})}
					>
						<div className={"flex"}
						     style={{height: '22px'}}>
							{/*头像*/}
							<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
							     style={{width: '22px', minWidth: '22px', height: '22px'}}>
								<img className="" src={(_text?.avatar) ? (_text?.avatar) : null} alt=""
								     style={{width: '100%', height: '100%'}}/>
							</div>
							{/*姓名*/}
							<div className={"ml-1.5 h-full flex items-center"}>
								<span className={"flex items-center text-hidden"}>
									<span>{(_text?.nickname) ? (_text?.nickname) : ((_text?.mobile) ? formatPhone(_text?.mobile) : '静态内容')}</span>
								</span>
							</div>
						</div>
					</Popover>
				</div>
			),
		},
		{
			title: '上架时间',
			dataIndex: '上架时间',
			key: '上架时间',
			sorter: true,
			render: (_text, _record, _index) => (
				<span>{_text ? _text : '—'}</span>
			),
		},
		{
			title: '操作',
			key: 'action',
			align: 'center',
			fixed: 'right',
			render: (_text, _record, index) => (
				<span className={"inline-flex items-center text-table-icon"}>
					<Tooltip title="查看" mouseEnterDelay={0} mouseLeaveDelay={0} overlayClassName={"operator-line"}>
            <span className={`ml-1 hover:cursor-pointer hover:text-blue`}
                  onClick={() => handleModelOsView(index)}><ViewSvg/></span>
          </Tooltip>
				</span>
			),
		}
	]
	const changeModelFormat = (value) => {
		setModelFormat(value)
		// 重置镜像文件
		setMirrorImage(null)
		form.setFieldValue('mirrorImage', null)
	}
	// 参数
	const changeEditorData = (value) => {
		setEditorData(value)
		form.setFieldValue('editorData', value)
		form.validateFields(['editorData'])
	}
	// 输入桩
	const changeInputNodeData = (value) => {
		setInputNodeData(value)
		form.setFieldValue('inputNodeData', value)
		form.validateFields(['inputNodeData'])
	}
	// 输出桩
	const changeOutputNodeData = (value) => {
		setOutputNodeData(value)
		form.setFieldValue('outputNodeData', value)
		form.validateFields(['outputNodeData'])
	}
	// 功能函数
	const changeFunctionNodeData = (value) => {
		console.log('into changeFunctionNodeData,传入的value为：',value)
		setFunctionNodeData(value)
		form.setFieldValue('functionNodeData', value)
		form.validateFields(['functionNodeData'])
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '模型管理', iconSvg: ModelManagementSvg, disabled: true},
					{label: '官方模型', router: '/oam/model-management/official-model'},
					{label: '创建模型', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 pb-[140px] flex flex-col rounded-lg"}>
				<div className={"flex items-center text-base leading-4 font-medium"}>{menuList[createType]?.name}</div>
				{/*主体内容*/}
				<div className={`w-full pl-[18px] flex flex-col pt-10 label-width-78`}>
					<Form form={form}
					      onFinish={createModel}
					      onFinishFailed={onFinishFailed}
					      // onKeyDown={handleKeyDownDisabled}
					>
						<div className={"w-full flex flex-col"}>
							{/*进度条组件*/}
							{
								progressBarComponentNameList &&
								<ProgressBarComponent nameList={progressBarComponentNameList}
								                      number={number}
								                      isCenter={false}
								                      style={{paddingLeft:'140px'}}/>
							}
							{
								createType === '0' &&
								<>
									{/*模型格式*/}
									<Form.Item
										style={{marginTop: '54px'}}
										className={`label-height-38 ${number === 1 ? '' : 'hidden'}`}
										label="模型格式"
										name="modelFormat"
										rules={[{required: true, message: '请选择模型格式'}]}
									>
										<Select
											size={'large'}
											style={{width: 451}}
											options={modelFormatList}
											placeholder={'请选择模型格式'}
											onChange={changeModelFormat}
										/>
									</Form.Item>
									{/*镜像文件*/}
									{
										modelFormat === 'other' &&
										<Form.Item
											// style={{marginTop: '44px'}}
											className={`label-height-38 ${number === 1 ? '' : 'hidden'}`}
											label="镜像文件"
											name="mirrorImage"
											rules={[
												// {required: true, message: '请输入镜像文件地址'},
											]}
										>
											<Input style={{width: 451}}
														 placeholder={'请输入镜像文件地址'}
														 autoComplete={"off"}
														 disabled={!!modelFileUrl}
														 onChange={(e) => setMirrorImage(e.target.value)}
											/>
										</Form.Item>
									}
									{/*模型文件*/}
									<Form.Item
										label="模型文件"
										className={`${number === 1 ? '' : 'hidden'}`}
										name="modelFileUrl"
										dependencies={['modelFormat']}
										// 模型文件格式需要和模型格式指定的模型文件格式一致
										rules={[
											{required: modelFormat !== 'other', message: '请上传模型文件'},
											() => ({
												validator(_, fileName) {
													// modelFormat为空时，还没有选择模型格式，不需要检验
													// fileName为空时，还说明没有上传文件，不需要校验
													if (modelFormat && fileName) {
														const fileType = fileName.split('.').pop()
														const modelFormatFileType = modelFormatToFileTypeMap[modelFormat]
														if (modelFormatFileType.indexOf(fileType) === -1) {
															return Promise.reject(new Error('模型文件格式不正确'))
														}
													}
													return Promise.resolve()
												}
											})
										]}
									>
										<div className={"relative"} style={{width: '451px', height: '165px'}}>
											<Upload.Dragger
												showUploadList={{
													showRemoveIcon: true,
													showPreviewIcon: false,
												}}
												name="modelFileUrl"
												multiple={false}
												accept={modelFormatToFileTypeMap[modelFormat]}
												action={`http://${location.host}/drapi/file/upload`}
												data={{
													business_type: 'model-file',
													user_id: JSON.parse(localStorage.getItem("userInfo")).id
												}}
												headers={{
													Authorization: `token ${localStorage.getItem("token")}`
												}}
												beforeUpload={modelFileBeforeUpload}
												onChange={_data => modelFileHandleChange(_data)}
												onDrop={modelFileUrlOnDrop}
												onRemove={modelFileHandleRemove}
											>
												<div className={"w-full flex flex-col items-center text-sm leading-[14px]"}
														 style={{color: '#B7B7B7'}}>
													<img src={(!modelFileUrl && !mirrorImage) ? UploadSvg : UploadDisabledSvg} alt=""/>
													<span className={"mt-4 flex items-center"}>拖拽到区域或点击上传模型文件</span>
													{
														modelFormat &&
														<div className={"mt-2 flex items-center"}>
															<span className={"flex items-center mr-1"}>仅支持上传{modelFormatToFileTypeMap[modelFormat]}格式文件</span>
															<Popover title={null}
																			 placement="rightTop"
																			 overlayClassName={'create-model-popover'}
																			 trigger="hover"
																			 content={ modelFormat!=='other' ? DescriptionComponent({modelFormat}) : null}
															>
																<div className={"flex items-center text-black-light"}>
																	<Wenhao/>
																</div>
															</Popover>
														</div>
													}
												</div>
											</Upload.Dragger>
											{
												(modelFileUrl || mirrorImage) &&
												<div className={"absolute w-full h-full bg-main cursor-not-allowed z-30 top-0 left-0"}
														 style={{backgroundColor: 'rgba(0,0,0,0)'}}
														 onClick={modelFileStopUpload}/>
											}
										</div>
									</Form.Item>
									<div style={{height:'10vh'}}
											 className={`w-full ${number === 1 ? '' : 'hidden'}`}>
									</div>
								</>
							}
							{
								createType === '1' &&
								<div className={`mt-[34px] w-full max-w-[1024px] flex flex-col ${number === 1 ? '' : 'hidden'}`}>
									{/*search框筛选*/}
									<SearchBig placeholder='请输入模型名称'
														 ml={false}
														 style={{width: '284px',height:'40px'}}
														 defaultValue={keyword.current}
														 change={e => keyword.current = e.target.value}
														 keyDown={e => keydown(e)}/>
									{/*表格和分页*/}
									<div className={"mt-2 w-full"}>
										<Table
											size='small'
											rowSelection={{
												type: 'radio',
												...rowSelection,
											}}
											loading={loading}
											dataSource={modelOsData}
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
							}
							{/*模型名称*/}
							<Form.Item
								style={{marginTop: '32px'}}
								className={`label-height-38 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
								label="模型名称"
								name="modelName"
								rules={[
									{required: true, message: '请输入模型名称'},
									() => ({
										validator(_, value) {
											if (value && value.length > 20) {
												return Promise.reject(new Error('模型名称不能超过20个字符'))
											}
											return Promise.resolve()
										}
									})
								]}
							>
								<Input style={{width: 656}} placeholder={'请输入模型名称'} autoComplete={"off"}/>
							</Form.Item>
							{/*模型封面*/}
							<Form.Item
								className={`${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
								label="模型封面"
								name="modelCoverUrl"
								rules={[
									{required: true, message: '请上传模型封面'},
								]}
							>
								<div className={"relative"}>
									{
										!modelCoverUrl &&
										<div className={"w-[196px] h-[112px]"}>
											<Spin spinning={modelCoverLoading} size="small" tip="上传中...">
												<div
													className="group w-full h-full flex justify-center items-center cursor-pointer relative rounded-lg bg-white border-2 border-dashed border-[#e7eaee] hover:border-main-hover-border transition-all duration-300"
													style={{width: '192px', height: '108px'}}
													onClick={clickUploadModelCover}
												>
													<PlusOutlined
														className="text-[#E1E1E1] group-hover:text-main-hover-border text-[15px] transition-all duration-300"/>
												</div>
											</Spin>
										</div>
									}
									{
										modelCoverUrl &&
										<div className={"w-[196px] h-[112px]"}>
											<Spin spinning={modelCoverLoading} size="small" tip="上传中...">
												<img src={modelCoverUrl} alt=""
														 onClick={clickUploadModelCover}
														 className={"cursor-pointer relative rounded-lg border-2 border-dashed border-[#e7eaee] hover:border-main-hover-border transition-all duration-300"}
														 style={{width: '192px', height: '108px',}}/>
											</Spin>
										</div>
									}
									<span
										className={"mt-2 flex text-xs leading-[12px] text-white-disable-text"}>图片文件类型支持png、jpg、jpeg、bmp等，图片大小不超过2M</span>
								</div>
							</Form.Item>
							{/*模型类型*/}
							{
								(createType==='0'||createType==='1') &&
								<Form.Item
									className={`label-height-38 ${( (createType==='0'||createType==='1') && number === 2 )  ? '' : 'hidden'}`}
									label="模型类型"
									name="modelType"
									rules={[{required: true, message: '请选择模型类型'}]}
								>
									<Select
										size={'large'}
										style={{width: 656}}
										options={modelTypeList}
										placeholder={'请选择模型类型'}
									/>
								</Form.Item>
							}
							{/*分类*/}
							<Form.Item
								className={`label-height-38 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
								label="分类"
								name="modelClass"
								rules={[{required: true, message: '请选择分类'}]}
							>
								<div className={"flex items-center my-model-select-type"}>
									<Cascader size={'large'}
									          expandTrigger="hover"
									          dropdownClassName={'my-model-select-type-dropdown'}
									          style={{width: 656}}
									          options={modelClassList}
									          placeholder="请选择分类"
									          onChange={changeModelClass}
									/>
									<Tooltip title={'分类说明目录说明目录说明目录说明目录说明目\u2028录说明目录说明目录说明目录说明目录说明目录\n' +
										'说明目录说明'}
									         overlayClassName={'my-model-table'}>
										<div className={"ml-2 flex items-center text-black-light"}>
											<Wenhao/>
										</div>
									</Tooltip>
								</div>
							</Form.Item>
							{/*icon*/}
							<Form.Item
								className={`label-height-38 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
								label="图标"
								name="modelIcon"
								rules={[{required: true, message: '请选择图标'}]}
							>
								<div className={"flex items-center my-model-select-type"}>
									<Cascader size={'large'}
									          value={modelIcon}
									          expandTrigger="hover"
									          dropdownClassName={'my-model-select-type-dropdown-icon'}
									          style={{width: 656}}
									          options={modelIconList}
									          placeholder="请选择图标"
									          onChange={changeModelIcon}
									/>
								</div>
							</Form.Item>
							{/*标签映射*/}
							<Form.Item
								className={`label-height-38 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
								label="标签映射"
								name="labelMapping"
							>
								<div className={"flex flex-col"}>
									{
										labelMapping.map((item, index) => {
											return (
												<div key={index} className={"mb-4 w-full flex items-center"}>
													<span className={"flex items-center"}>键：</span>
													<Input autoComplete={"off"} value={item.key}
													       onChange={(e)=>changeLabelMapping(e,index,'key')}
													       style={{width:'150px'}}
													       placeholder={'请输入键'}/>
													<span className={"ml-4 flex items-center"}>值：</span>
													<Input autoComplete={"off"} value={item.value}
													       onChange={(e)=>changeLabelMapping(e,index,'value')}
													       style={{width:'150px'}}
													       placeholder={'请输入值'}/>
													<div className={"ml-4 flex items-center text-black-light cursor-pointer hover:text-red-hover"}
													     onClick={()=>deleteLabelMapping(index)}>
														<DeleteSvg/>
													</div>
												</div>
											)
										})
									}
									<AddLabelMapping click={addLabelMapping}/>
								</div>
							</Form.Item>
							{/*输入格式*/}
							{
								(createType==='0'||createType==='1') &&
								<Form.Item
									className={`label-height-38 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
									label="输入格式"
									name="inputType"
									rules={[{required: true, message: '请选择输入格式'}]}
								>
									<Select
										size={'large'}
										style={{width: 656}}
										options={inputTypeList}
										placeholder={'请选择输入格式'}
									/>
								</Form.Item>
							}
							{/*输出格式*/}
							{
								(createType==='0'||createType==='1') &&
								<Form.Item
									className={`label-height-38 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
									label="输出格式"
									name="outputType"
									rules={[{required: true, message: '请选择输出格式'}]}
								>
									<Select
										size={'large'}
										style={{width: 656}}
										options={outputTypeList}
										placeholder={'请选择输出格式'}
									/>
								</Form.Item>
							}
							{/*版本信息*/}
							<Form.Item
								className={`label-height-38 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
								label="版本信息"
								name="modelVersion"
								rules={[{required: true, message: '请选择版本信息'}]}
							>
								<AutoComplete
									size={'large'}
									options={modelVersionList}
									style={{ width: 656 }}
									placeholder="请选择版本信息"
								/>
							</Form.Item>
							{/*模型简介*/}
							<Form.Item
								className={`label-height-38 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
								label="模型简介"
								name="modelSimpleDescription"
								rules={[{required: true, message: '请输入模型简介'}]}
							>
								<Input.TextArea style={{width: '656px', height: '129px'}} showCount maxLength={500}
								                onKeyDown={e => e.stopPropagation()}
								                placeholder={"请输入模型简介"}/>
							</Form.Item>
							{/*模型描述*/}
							<Form.Item
								className={`label-height-100 ${( ((createType==='0'||createType==='1') && number === 2)  || (createType==='2' && number === 1) ) ? '' : 'hidden'}`}
								label="模型描述"
								name="modelDescription"
								rules={[{required: true, message: '请输入模型描述'}]}
							>
								<div className={"w-[656px] flex flex-col"}>
									<div className={"w-full flex justify-end items-center"}>
										<ButtonSecond text={'+Markdown'} click={clickAddMarkdownFile}
										              style={{width: '79px', height: '24px', fontSize: '12px', lineHeight: '12px'}}/>
									</div>
									<div style={{width: '656px', height: '335px'}}
									     className={"mt-1"}
									     onKeyDown={e => e.stopPropagation()}>
										<MarkdownEditor value={modelDescription}
										                height={'335px'}
										                change={changeModelDescription}/>
									</div>
								</div>
							</Form.Item>
							{/*参数*/}
							{
								createType==='2' &&
								<Form.Item
									className={`label-height-40 ${(createType==='2' && number === 2) ? '' : 'hidden'}`}
									style={{marginTop:'44px'}}
									label="参数"
									name="editorData"
									// rules={[{required: true, message: '请输入参数'}]}
								>
									<div className={""} style={{width: '656px',height:'249px'}}>
										<Editor
											value={editorData}
											mode='code'
											navigationBar={false}
											statusBar={false}
											search={false}
											sortObjectKeys={false}
											onChange={changeEditorData}
										/>
									</div>
								</Form.Item>
							}
							{/*输入桩*/}
							{
								createType==='2' &&
								<Form.Item
									className={`label-height-40 ${(createType==='2' && number === 2) ? '' : 'hidden'}`}
									style={{marginTop:'65px'}}
									label="输入桩"
									name="inputNodeData"
									rules={[{required: true, message: '请输入输入桩内容'}]}
								>
									<div className={""} style={{width: '656px',height:'249px'}}>
										<Editor
											value={inputNodeData}
											mode='code'
											navigationBar={false}
											statusBar={false}
											search={false}
											sortObjectKeys={false}
											onChange={changeInputNodeData}
										/>
									</div>
								</Form.Item>
							}
							{/*输出桩*/}
							{
								createType==='2' &&
								<Form.Item
									className={`label-height-40 ${(createType==='2' && number === 2) ? '' : 'hidden'}`}
									style={{marginTop:'65px'}}
									label="输出桩"
									name="outputNodeData"
									rules={[{required: true, message: '请输入输出桩内容'}]}
								>
									<div className={""} style={{width: '656px',height:'249px'}}>
										<Editor
											value={outputNodeData}
											mode='code'
											navigationBar={false}
											statusBar={false}
											search={false}
											sortObjectKeys={false}
											onChange={changeOutputNodeData}
										/>
									</div>
								</Form.Item>
							}
							{/*功能函数*/}
							{
								createType==='2' &&
								<Form.Item
									className={`label-height-40 ${(createType==='2' && number === 2) ? '' : 'hidden'}`}
									style={{marginTop:'65px'}}
									label="功能函数"
									name="functionNodeData"
									rules={[{required: true, message: '请输入功能函数内容'}]}
								>
									<CodeMirror
										value={null}
										height="249px"
										width={'656px'}
										extensions={[python()]}
										onChange={changeFunctionNodeData}
										placeholder={"请输入功能函数内容"}
									/>
								</Form.Item>
							}
							{/*下一步*/}
							<div style={{marginTop: createType==='0'?'':'7vh'}}
							     className={`w-full flex items-center ${number === 1 ? '' : 'hidden'}`}>
								<ButtonMain text={'下一步'} click={clickNextStep} style={{width: '87px', height: '32px'}}/>
							</div>
							{/*按钮*/}
							<div className={`w-full flex items-center ${number === 2 ? '' : 'hidden'}`}
							     style={{marginTop: '6.66vh'}}>
								<ButtonSecond style={{width: '86px', height: '32px', lineHeight: '14px'}}
								              text={'上一步'}
								              click={clickBeforeStep}/>
								<ButtonMain className="ml-6"
								            style={{width: '86px', height: '32px', lineHeight: '14px'}}
								            text={'确定'}
								            click={null}/>
							</div>
						</div>
					</Form>
				</div>
			</div>
			{/*弹框*/}
			<ImageEditorModal title='编辑图片'
			                  show={showImageEditorModal}
			                  data={{imageFile: modelCoverFile}}
			                  onOk={imageEditorModalOnOk}
			                  onCancel={imageEditorModalOnCancel}/>
		</div>
	)
}
