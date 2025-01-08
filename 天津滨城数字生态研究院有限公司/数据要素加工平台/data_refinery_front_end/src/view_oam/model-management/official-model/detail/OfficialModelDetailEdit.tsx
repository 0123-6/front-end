import React, {useEffect, useState} from "react";
import {AutoComplete, Cascader, Form, Input, message, Select, Spin, Tooltip, Upload} from "antd";
import {uuidv4} from "@antv/xflow";
import {modelFormatList, modelFormatToFileTypeMap} from "../../../../view/my-model/static";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import UploadSvg from "../../../../view/my-model/create/icon/UploadSvg.svg";
import UploadDisabledSvg from "../../../../view/my-model/create/icon/UploadDisabledSvg.svg";
import {PlusOutlined} from "@ant-design/icons";
import Wenhao from "../../../../icon/wenhao";
import DeleteSvg from "../../../../icon/table/DeleteSvg";
import {modelVersionList} from "../../../../utils/static";
import {MarkdownEditor} from "../../../../dag/components/MarkdownEditor";
import ImageEditorModal from "../../../../view/my-model/create/components/ImageEditorModal";
import {get, post } from "../../../../axios";
import { JsonEditor as Editor } from 'jsoneditor-react';
import {inputTypeList, outputTypeList} from "../../../../view/my-model/create";
import {python} from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";
import {defaultEditorData, defaultInputNodeData, defaultOutputNodeData} from "../create";
import AddLabelMapping from "../../../../components/AddLabelMapping";

interface IProps {
	data: any,
	onOk: (_data: object) => void,
	onCancel: () => void,
}

export default function OfficialModelDetailEdit(props: IProps) {
	// state
	const [form] = Form.useForm();
	// @ts-ignore
	const {data, onOk, onCancel} = props
	const [modelFileUrlList, setModelFileUrlList] = useState(null);
	// 模型格式
	const [modelFormat, setModelFormat] = useState('');
	const [modelFileUrl, setModelFileUrl] = useState('');
	// 镜像文件
	const [mirrorImage, setMirrorImage] = useState(null);
	const [modelCoverUrl, setModelCoverUrl] = useState('');
	const [modelCoverLoading, setModelCoverLoading] = useState(false);
	const [modelDescription, setModelDescription] = useState('');
	const [showMarkdownEditor, setShowMarkdownEditor] = useState(false);
	const [labelMapping,setLabelMapping] = useState([]);

	// 模型类型列表
	const [modelTypeList, setModelTypeList] = useState([]);
	// 模型分类列表
	const [modelClass, setModelClass] = useState([]);
	const [modelClassList, setModelClassList] = useState([]);
	// 模型图标列表
	const [modelIconList, setModelIconList] = useState([]);
	const [modelIcon, setModelIcon] = useState(null);
	// 展示弹框
	const [showImageEditorModal, setShowImageEditorModal] = useState(false)
	// 创建方式
	const [modelCreateType, setModelCreateType] = useState(null)
	// 非部署模型
	// @ts-ignore
	const [editorData, setEditorData] = useState(defaultEditorData);
	// 输入桩
	const [inputNodeData, setInputNodeData] = useState(defaultInputNodeData);
	// 输出桩
	const [outputNodeData, setOutputNodeData] = useState(defaultOutputNodeData);
	// 功能函数
	// @ts-ignore
	const [functionNodeData, setFunctionNodeData] = useState(null);
	// 是否点击了保存按钮
	const [isClickSave, setIsClickSave] = useState(false);
	// mounted
	useEffect(() => {
		return () => {
			setIsClickSave(false)
		}
	}, [])
	useEffect(() => {
		if(data) {
			setModelCreateType(data?.modelCreateType)
			console.log('data: ', data)
			let labelMapping = []
			for (const key in data?.labelMapping) {
				if (data?.labelMapping.hasOwnProperty(key)) {
					labelMapping.push({ key, value: data?.labelMapping[key] });
				}
			}
			setLabelMapping(labelMapping)
			console.log('labelMapping: ', labelMapping)
			let newData = {
				...data,
				modelClass: getModelClassListByChild(data?.modelClassList, data?.modelClass),
				labelMapping: labelMapping,
			}
			if (newData?.modelFileUrl) {
				setModelFileUrlList([{uid: uuidv4(), name: newData?.modelFileUrl, status: 'done',}])
			} else {
				setModelFileUrlList([])
			}
			form.setFieldsValue(newData)
			setModelFormat(newData?.modelFormat)
			setModelFileUrl(newData?.modelFileUrl)
			setMirrorImage(newData?.mirrorImage)
			setModelCoverUrl(newData?.modelCoverUrl)
			setModelDescription(newData?.modelDescription)
			setShowMarkdownEditor(true)
			changeModelClass(newData?.modelClass,false)
			setModelClassList(newData?.modelClassList)
			setModelIcon(newData?.modelIcon)
			setModelTypeList(newData?.modelTypeList)
			if(newData?.modelCreateType === 1) {
				setEditorData(newData?.editorData)
				form.setFieldValue('editorData', newData?.editorData)
				setInputNodeData(newData?.inputNodeData)
				form.setFieldValue('inputNodeData', newData?.inputNodeData)
				setOutputNodeData(newData?.outputNodeData)
				form.setFieldValue('outputNodeData', newData?.outputNodeData)
				setFunctionNodeData(newData?.functionNodeData)
				form.setFieldValue('functionNodeData', newData?.functionNodeData)
			}
		}
	}, [data])
	// methods
	const getModelClassListByChild = (modelClassList,childId) => {
		console.log('getModelClassListByChild: ', childId, modelClassList)
		let list = []
		for(let i=0;i<modelClassList.length;i++){
			if(modelClassList[i].value === childId){
				list.push(modelClassList[i].value)
				console.log('getModelClassListByChild: ', list)
				return list
			} else {
				for(let j=0;j<modelClassList[i].children.length;j++){
					if(modelClassList[i].children[j].value === childId){
						list.push(modelClassList[i].value)
						list.push(childId)
						console.log('getModelClassListByChild: ', list)
						return list
					}
				}
			}
		}
	}

	// 编辑模型
	const clickEditOk = async () => {

		// 校验
		if(modelFormat !== 'other') {

		} else {
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
		const formData = form.getFieldsValue(true);
		let label_mapping_object = {}
		for (let i = 0; i < labelMapping.length; i++) {
			label_mapping_object[labelMapping[i].key] = labelMapping[i].value
		}

		let params = {
			type: modelCreateType,
			id: data.id,
			model_framework: formData.modelFormat,
			model_addr: formData?.modelFileUrl ? formData?.modelFileUrl : null,
			mirror_image: formData?.mirrorImage ? formData?.mirrorImage : null,
			model_file: {
				path: formData.modelFileUrl,
			},
			name: formData.modelName,
			cover: formData.modelCoverUrl,
			model_type_id: formData?.modelType,
			comp_menu_id: formData.modelClass[formData.modelClass.length - 1],
			icon_id: formData.modelIcon[0],
			label_mapping: label_mapping_object,
			input_type: formData.inputType,
			output_type: formData.outputType,
			version: formData.modelVersion,
			abstract: formData.modelSimpleDescription,
			description: formData.modelDescription,
		}
		if(modelCreateType === 1) {
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
		setIsClickSave(true)
		const res = await post('/drapi/oam/platform/comps', params)
		message.success('编辑成功')
		onOk(res.data)
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
		const params = {
			business_type: 'avatar',
			avatar: imageFile,
		}
		setModelCoverUrl(URL.createObjectURL(imageFile))
		form.setFieldValue('modelCoverUrl', null)

		setModelCoverLoading(true)
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


	const clickCancel = (e) => {
		e.preventDefault()
		e.stopPropagation()
		onCancel()
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
	const changeModelClass = (value,reset=true) => {
		setModelClass(value)
		form.setFieldValue('modelClass', value)
		form.validateFields(['modelClass'])
		console.log('value: ', value)
		const id = value[value.length-1]
		getModelIconList(id,reset)
	}
	const changeModelIcon = (value) => {
		setModelIcon(value)
		form.setFieldValue('modelIcon', value)
		form.validateFields(['modelIcon'])
	}
	const getModelIconList = async (id,reset=true) => {
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
		if(reset){
			setModelIcon(null)
			form.setFieldValue('modelIcon', null)
		}
	}
	const changeModelFormat = (value) => {
		setModelFormat(value)
		// 重置镜像文件
		setMirrorImage(null)
		form.setFieldValue('mirrorImage', null)
	}
	const changeEditorData = (value) => {
		setEditorData(value)
		form.setFieldValue('editorData', value)
		form.validateFields(['editorData'])
	}
	const changeInputNodeData = (value) => {
		setInputNodeData(value)
		form.setFieldValue('inputNodeData', value)
		form.validateFields(['inputNodeData'])
	}
	const changeOutputNodeData = (value) => {
		setOutputNodeData(value)
		form.setFieldValue('outputNodeData', value)
		form.validateFields(['outputNodeData'])
	}
	// @ts-ignore
	const changeFunctionNodeData = (value) => {
		setFunctionNodeData(value)
		form.setFieldValue('functionNodeData', value)
		form.validateFields(['functionNodeData'])
	}

	// render
	return (
		//最外层
		<div className={"w-full flex flex-col label-width-93 relative"}>
			<Form form={form}
			      onFinish={clickEditOk}>
				{/*按钮*/}
				<div className={"w-full max-w-[1166px] flex justify-end items-center relative z-10"}>
					<ButtonSecond text={'取消'} click={clickCancel} style={{width: '88px', height: '32px'}}/>
					<ButtonMain text={'保存'} click={null} style={{width: '88px', height: '32px'}} className={"ml-6"} disabled={isClickSave}/>
				</div>
				<div className={"w-full flex flex-col"} style={{marginTop: '-13px'}}>
					{/*模型格式*/}
					{
						modelCreateType === 2 &&
						<Form.Item
							style={{}}
							className={`label-height-38 `}
							label="模型格式"
							name="modelFormat"
							rules={[{required: true, message: '请选择模型格式'}]}
						>
							<Select
								size={'large'}
								style={{width: 600}}
								options={modelFormatList}
								placeholder={'请选择模型格式'}
								onChange={changeModelFormat}
							/>
						</Form.Item>
					}
					{/*模型文件*/}
					{
						modelCreateType === 2 &&
						<Form.Item
							label="模型文件"
							className={``}
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
							{
								modelFileUrlList &&
								<div className={"relative"} style={{width: '298px', height: '120px'}}>
									<Upload.Dragger
										defaultFileList={modelFileUrlList}
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
										<div className={"w-full flex flex-col items-center text-xs leading-[12px]"}
												 style={{color: '#B7B7B7'}}>
											<img src={(!modelFileUrl && !mirrorImage) ? UploadSvg : UploadDisabledSvg} alt="" style={{width:'37px',height:'40px'}}/>
											<span className={"mt-3 flex items-center"}>拖拽到区域或点击上传模型文件</span>
											{
												modelFormat &&
												<span className={"mt-2"}>仅支持上传{modelFormatToFileTypeMap[modelFormat]}格式文件</span>
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
							}
						</Form.Item>
					}
					{
						modelCreateType === 2 &&
						<div style={{}}
								 className={`w-full`}>
							{/*镜像文件*/}
							{
								modelFormat === 'other' &&
								<Form.Item
									style={{marginTop: '44px'}}
									className={`label-height-38`}
									label="镜像文件"
									name="mirrorImage"
									rules={[
										// {required: true, message: '请输入镜像文件地址'},
									]}
								>
									<Input style={{width: 600}}
												 placeholder={'请输入镜像文件地址'}
												 autoComplete={"off"}
												 disabled={!!modelFileUrl}
												 onChange={(e) => setMirrorImage(e.target.value)}
									/>
								</Form.Item>
							}
						</div>
					}
					{/*模型名称*/}
					<Form.Item
						style={{marginTop: (modelCreateType===2 && modelFormat !== 'other') ? '44px': ''}}
						className={`label-height-38 `}
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
						<Input style={{width: 600}} placeholder={'请输入模型名称'} autoComplete={"off"}/>
					</Form.Item>
					{/*模型封面*/}
					<Form.Item
						className={``}
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
						modelCreateType !== 1 &&
						<Form.Item
							className={`label-height-38 `}
							label="模型类型"
							name="modelType"
							rules={[{required: true, message: '请选择模型类型'}]}
						>
							<Select
								size={'large'}
								style={{width: 600}}
								options={modelTypeList}
								placeholder={'请选择模型类型'}
							/>
						</Form.Item>
					}
					{/*分类*/}
					<Form.Item
						className={`label-height-38`}
						label="分类"
						name="modelClass"
						rules={[{required: true, message: '请选择分类'}]}
					>
						<div className={"flex items-center my-model-select-type"}>
							<Cascader size={'large'}
							          expandTrigger="hover"
							          dropdownClassName={'my-model-select-type-dropdown'}
							          style={{width: 600}}
							          value={modelClass}
							          options={modelClassList}
							          placeholder="请选择分类"
							          onChange={value=>changeModelClass(value,true)}
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
						className={`label-height-38`}
						label="图标"
						name="modelIcon"
						rules={[{required: true, message: '请选择图标'}]}
					>
						<div className={"flex items-center my-model-select-type"}>
							<Cascader size={'large'}
							          value={modelIcon}
							          expandTrigger="hover"
							          dropdownClassName={'my-model-select-type-dropdown-icon'}
							          style={{width: 600}}
							          options={modelIconList}
							          placeholder="请选择图标"
							          onChange={changeModelIcon}
							/>
						</div>
					</Form.Item>
					{/*标签映射*/}
					<Form.Item
						className={`label-height-38 `}
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
											       style={{width: '150px'}}
											       placeholder={'请输入键'}/>
											<span className={"ml-4 flex items-center"}>值：</span>
											<Input autoComplete={"off"} value={item.value}
											       onChange={(e)=>changeLabelMapping(e,index,'value')}
											       style={{width: '150px'}}
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
						modelCreateType !== 1 &&
						<Form.Item
							className={`label-height-38`}
							label="输入格式"
							name="inputType"
							rules={[{required: true, message: '请选择输入格式'}]}
						>
							<Select
								size={'large'}
								style={{width: 600}}
								options={inputTypeList}
								placeholder={'请选择输入格式'}
							/>
						</Form.Item>
					}
					{/*输出格式*/}
					{
						modelCreateType !== 1 &&
						<Form.Item
							className={`label-height-38`}
							label="输出格式"
							name="outputType"
							rules={[{required: true, message: '请选择输出格式'}]}
						>
							<Select
								size={'large'}
								style={{width: 600}}
								options={outputTypeList}
								placeholder={'请选择输出格式'}
							/>
						</Form.Item>
					}
					{/*版本信息*/}
					<Form.Item
						className={`label-height-38 `}
						label="版本信息"
						name="modelVersion"
						rules={[{required: true, message: '请选择版本信息'}]}
					>
						<AutoComplete
							size={'large'}
							options={modelVersionList}
							style={{ width: 600 }}
							placeholder="请选择版本信息"
						/>
					</Form.Item>
					{/*模型简介*/}
					<Form.Item
						className={`label-height-38 `}
						label="模型简介"
						name="modelSimpleDescription"
						rules={[{required: true, message: '请输入模型简介'}]}
					>
						<Input.TextArea style={{width: '600px', height: '129px'}} showCount maxLength={500}
						                onKeyDown={e => e.stopPropagation()}
						                placeholder={"请输入模型简介"}/>
					</Form.Item>
					{/*模型描述*/}
					<Form.Item
						className={`label-height-100`}
						label="模型描述"
						name="modelDescription"
						rules={[{required: true, message: '请输入模型描述'}]}
					>
						<div className={"w-[600px] flex flex-col"}>
							<div className={"w-full flex justify-end items-center"}>
								<ButtonSecond text={'+Markdown'} click={clickAddMarkdownFile}
								              style={{width: '79px', height: '24px', fontSize: '12px', lineHeight: '12px'}}/>
							</div>
							<div style={{width: '600px', height: '335px'}}
							     className={"mt-1"}
							     onKeyDown={e => e.stopPropagation()}>
								{
									showMarkdownEditor &&
									<MarkdownEditor value={modelDescription}
																	height={'335px'}
																	change={changeModelDescription}/>
								}
							</div>
						</div>
					</Form.Item>
					{/*非部署模型参数*/}
					{
						modelCreateType===1 &&
						<Form.Item
							className={`label-height-40`}
							style={{marginTop:'44px'}}
							label="参数"
							name="editorData"
							rules={[{required: true, message: '请输入参数'}]}
						>
							<div className={""} style={{width: '600px',height:'249px'}}>
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
						modelCreateType===1 &&
						<Form.Item
							className={`label-height-40`}
							style={{marginTop:'65px'}}
							label="输入桩"
							name="inputNodeData"
							rules={[{required: true, message: '请输入输入桩内容'}]}
						>
							<div className={""} style={{width: '600px',height:'249px'}}>
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
						modelCreateType===1 &&
						<Form.Item
							className={`label-height-40`}
							style={{marginTop:'65px'}}
							label="输出桩"
							name="outputNodeData"
							rules={[{required: true, message: '请输入输出桩内容'}]}
						>
							<div className={""} style={{width: '600px',height:'249px'}}>
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
						modelCreateType===1 &&
						<Form.Item
							className={`label-height-40`}
							style={{marginTop:'65px'}}
							label="功能函数"
							name="functionNodeData"
							rules={[{required: true, message: '请输入功能函数内容'}]}
						>
							<CodeMirror
								value={null}
								height="249px"
								width={'600px'}
								extensions={[python()]}
								onChange={changeFunctionNodeData}
								placeholder={"请输入功能函数内容"}
							/>
						</Form.Item>
					}
				</div>
			</Form>
			<ImageEditorModal title='编辑图片'
			                  show={showImageEditorModal}
			                  data={{imageFile: modelCoverFile}}
			                  onOk={imageEditorModalOnOk}
			                  onCancel={imageEditorModalOnCancel}/>
		</div>
	)
}
