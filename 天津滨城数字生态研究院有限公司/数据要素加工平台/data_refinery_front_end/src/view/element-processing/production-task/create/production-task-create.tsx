import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {Form, Input, message, Select, Spin} from "antd";
import SelectProcessingModal from "./components/SelectProcessingModal";
import SelectDataResourceModal from "./components/SelectDataResourceModal";
import {get, post} from "../../../../axios";
import {CloseCircleFilled} from "@ant-design/icons";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import NavigationComponent from "../../../../components/NavigationComponent";
import {applicationFieldList} from "../../../data-element/common";
import {handleKeyDownDisabled} from "../../../../utils/util";
import ElementProcessing from "../../icon/ElementProcessing.svg";
import ElementProcessingActive from "../../icon/ElementProcessingActive.svg";
import ProductionTask from "../../icon/ProductionTask.svg";
import ProductionTaskActive from "../../icon/ProductionTaskActive.svg";

export default function ProductionTaskCreate(props) {
	// state
	const history = useHistory();
	const [form] = Form.useForm();
	// 是否为编辑模式
	const [isEditMode, setIsEditMode] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	// 加工流程
	const [selectProcessing, setSelectProcessing] = useState(null)
	const [selectProcessingModal, setSelectProcessingModal] = useState(false);
	// 数据资源
	const [selectDataResource, setSelectDataResource] = useState(null)
	const [selectDataResourceModal, setSelectDataResourceModal] = useState(false);
	// 数据要素类型
	// @ts-ignore
	const [dr_type, setDr_type] = useState('offline_data_packet')
	// 数据要素应用领域

	// mounted
	useEffect(() => {
		if (props?.match?.url.indexOf('edit') !== -1) {
			setIsEditMode(true)
			const params = {
				id: props?.match?.params?.id
			}
			setIsLoading(true)
			get('/drapi/kfp/pipeline/task/detail', params).then(res => {
				form.setFieldsValue(res.data)
				setSelectProcessing({
					name: res.data.pipeline_name,
					id: res.data.pipeline_id
				})
				setSelectDataResource({
					id: res.data?.dataset?.id,
					title: res.data?.dataset?.title,
					address: res.data?.dataset?.address,
				})
				setDr_type(res.data.dr_type)
				setIsLoading(false)
			})
		}
	}, [])
	// methods
	const goBack = (e = undefined) => {
		if (e) {
			e.preventDefault()
		}
		history.goBack()
	}
	// 选择加工流程
	// 点击选择加工流程按钮
	const clickSelectProcessing = (e) => {
		e.preventDefault()
		setSelectProcessingModal(true)
	}
	const selectProcessingModalOnOk = (data) => {
		console.log('into selectProcessingModalOnOk,data=', data)
		setSelectProcessing(data)
		setSelectProcessingModal(false)
		form.setFieldValue('name',data.name)
		form.setFieldValue('description',data.description)
		form.validateFields(['name','description'])
	}
	const selectProcessingModalOnCancel = () => {
		console.log('into selectProcessingModalOnCancel')
		setSelectProcessingModal(false)
	}
	// 删除选择的加工流程
	const delelteSelectProcessing = () => {
		setSelectProcessing(null)
	}
	// 选择数据源
	const clickSelectDataResourceModal = (e) => {
		e.preventDefault()
		setSelectDataResourceModal(true)
	}
	const selectDataResourceModalOnOk = (data) => {
		console.log('into selectDataResourceModalOnOk: ',data)
		setSelectDataResource(data)
		setSelectDataResourceModal(false)
	}
	const selectDataResourceModalOnCancel = () => {
		console.log('into selectDataResourceModalOnCancel')
		setSelectDataResourceModal(false)
	}
	const delelteSelectDataResource = () => {
		setSelectDataResource(null)
	}

	// 确认按钮
	const clickOk = () => {
		if (!selectProcessing) {
			message.warn("请先选择加工流程")
			return
		}
		if (!selectDataResource) {
			message.warn("请先选择数据资源")
			return
		}
		const nowValue = form.getFieldsValue(true)
		const params = {
			...nowValue,
			"pipeline_id": selectProcessing?.id,
			dataset_id: selectDataResource?.id,
			dataset_url: selectDataResource?.address,
			"dr_type": 'offline_data_packet',
		}
		post('/drapi/kfp/pipeline/task/save', params).then(res => {
			console.log(res)
			message.success(`${isEditMode ? '编辑' : '创建'}生产任务成功`)
			goBack()
		})
	}
	return (
		// 最外层
		<div className="w-full flex flex-col items-center bg">
			<NavigationComponent data={[
				{label:'要素加工',router:'/element-processing',icon:ElementProcessing,iconActive:ElementProcessingActive},
				{label:'生产任务',router:'/element-processing/production-task',icon:ProductionTask,iconActive:ProductionTaskActive},
				{label: (isEditMode ? '编辑' : '创建') + '生产任务', disabled: true},
			]}/>
			{/*主体内容*/}
			<div className="pb-8 flex flex-col bg-white pt-6 pl-8 pr-8 shadow-card rounded mb-16 label-width-136"
			     style={{width: '960px'}}>
				{/*内容部分*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					<Form form={form}
					      onFinish={clickOk}
					      onKeyDown={handleKeyDownDisabled}>
						<div className={"flex flex-col"}
						     style={{width: '866px'}}>
							{/*基本信息*/}
							<div className={"w-full flex flex-col"}>
								{/*名称*/}
								<Form.Item
									style={{marginTop: '8px'}}
									className={'label-height-38'}
									label="名称"
									name="name"
									rules={[{required: true, message: '请输入名称'}]}
								>
									<Input style={{height: '38px'}} placeholder={"请输入名称"} autoComplete={"off"}/>
								</Form.Item>
								{/*简介*/}
								<Form.Item
									label="简介"
									className={'label-height-38'}
									name="description"
									rules={[{required: true, message: '请输入简介'}]}
								>
									<Input.TextArea style={{height: '90px'}} showCount maxLength={500}
									                onKeyDown={e => e.stopPropagation()}
									                placeholder={'请输入简介'}/>
								</Form.Item>
							</div>
							{/*加工流程*/}
							<div className={"w-full flex items-center"}
							     style={{height: '38px'}}>
								{/*左*/}
								<div className={"flex justify-end items-center text-sm text-black"}
								     style={{width: '120px'}}>
									<span className={"text-red"}>*</span>加工流程
								</div>
								{/*右*/}
								<div className={"ml-4 h-full flex items-center"}
								     style={{}}>
									{
										!selectProcessing &&
										<ButtonSecond style={{width: '187px', height: '38px', lineHeight: '14px'}}
																	text={'+选择加工流程'}
																	click={_e => clickSelectProcessing(_e)}/>
									}
									{
										selectProcessing &&
										<div className={"h-full flex items-center pl-4 pr-4"}
												 style={{borderRadius: '2px', background: '#F0F2F5'}}>
												<span className={"flex items-center text-sm"}
															style={{color: '#919399'}}>{selectProcessing.name}</span>
											<CloseCircleFilled style={{color: '#C0C4CC',width:'10px',height:'10px'}} className={"ml-2 flex items-center"}
																				 onClick={delelteSelectProcessing}/>
										</div>
									}
								</div>
							</div>
							{/*数据资源*/}
							<div className={"mt-4 w-full flex items-center"}
							     style={{height: '38px'}}>
								{/*左*/}
								<div className={"flex justify-end items-center text-sm text-black"}
								     style={{width: '120px'}}>
									<span className={"text-red"}>*</span>数据资源
								</div>
								{/*右*/}
								<div className={"ml-4 h-full flex items-center"}
								     style={{}}>
									{
										!selectDataResource &&
										<ButtonSecond style={{width: '187px', height: '38px', lineHeight: '14px'}}
																	text={'+选择数据资源'}
																	click={_e => clickSelectDataResourceModal(_e)}/>
									}
									{
										selectDataResource &&
										<div className={"h-full flex items-center pl-4 pr-4"}
												 style={{borderRadius: '2px', background: '#F0F2F5'}}>
												<span className={"flex items-center text-sm"}
															style={{color: '#919399'}}>{selectDataResource.title}</span>
											<CloseCircleFilled style={{color: '#C0C4CC',width:'10px',height:'10px'}} className={"ml-2 flex items-center"}
																				 onClick={delelteSelectDataResource}/>
										</div>
									}
								</div>
							</div>
							{/*设置输出参数*/}
							<div className={"mt-4 w-full flex flex-col"}>
								{/*数据要素类型*/}
								<div style={{lineHeight: '14px'}}
								     className={"w-full flex items-center"}>
									{/*左*/}
									<div className={"flex justify-end items-center text-sm text-black"}
									     style={{width: '120px'}}>
										<span className={"text-red"}/>数据要素类型
									</div>
									{/*右*/}
									<div className={"ml-4 h-full flex items-center"}
									     style={{width: '730px'}}>
										离线数据包
									</div>
								</div>
								{/*数据要素名称*/}
								<Form.Item
									style={{marginTop: '16px'}}
									label="数据要素名称"
									className={'label-height-38'}
									name="dr_name"
									rules={[{required: true, message: '请输入数据要素名称'}]}
								>
									<Input style={{height: '38px'}} placeholder={'请输入数据要素名称'} autoComplete={"off"}/>
								</Form.Item>
								{/*应用领域*/}
								<Form.Item
									label="应用领域"
									className={'label-height-38'}
									name="dr_application_field"
									rules={[{required: true, message: '请选择应用领域'}]}
								>
									<Select
										size={'large'}
										style={{width: 730}}
										options={applicationFieldList}
										placeholder={'请选择应用领域'}
										mode="multiple" maxTagCount="responsive"
									/>
								</Form.Item>
								{/*数据要素简介*/}
								<Form.Item
									label="数据要素简介"
									className={'label-height-38'}
									name="dr_description"
									rules={[{required: true, message: '请输入数据要素简介'}]}
								>
									<Input.TextArea style={{height: '90px'}} showCount maxLength={500}
									                onKeyDown={e => e.stopPropagation()}
									                placeholder={"请输入数据要素简介"}/>
								</Form.Item>
							</div>
						</div>
						{/*按钮*/}
						<div className={"w-full"} style={{height: '10vh'}}/>
						<div className="w-full flex justify-center items-center">
							<ButtonSecond style={{width: '61px', height: '32px', lineHeight: '14px'}}
							              text={'取消'}
							              click={e => goBack(e)}/>
							<ButtonMain className="ml-4"
							            style={{width: '61px', height: '32px', lineHeight: '14px'}}
							            text={'确定'}
							            click={null}/>
						</div>
					</Form>
				</Spin>
			</div>
			{/*弹框*/}
			{/*选择加工流程*/}
			<SelectProcessingModal data={null}
			                       showWhich={1}
			                       show={selectProcessingModal}
			                       onCancel={selectProcessingModalOnCancel}
			                       onOk={data => selectProcessingModalOnOk(data)}/>
			{/*选择数据源*/}
			<SelectDataResourceModal data={null}
			                         show={selectDataResourceModal}
			                         onCancel={selectDataResourceModalOnCancel}
			                         onOk={selectDataResourceModalOnOk}/>
		</div>
	)
}
