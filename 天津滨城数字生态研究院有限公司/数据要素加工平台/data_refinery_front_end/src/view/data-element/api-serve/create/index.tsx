import {useHistory} from 'react-router-dom';
import {Form, Input, message, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import SelectProcessingModal from "../../../element-processing/production-task/create/components/SelectProcessingModal";
import NavigationComponent from "../../../../components/NavigationComponent";
import {handleKeyDownDisabled} from "../../../../utils/util";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import {CloseCircleFilled} from "@ant-design/icons";
import {post} from "../../../../axios";
import {modelCpuConfigurationList} from "../../../../utils/static";
import DataElementActive from "../../icon/DataElementActive.svg";
import DataElement from "../../icon/DataElement.svg";
import ApiServe from "../../icon/ApiServe.svg";
import ApiServeActive from "../../icon/ApiServeActive.svg";

export default function ApiServeCreate() {
	// state
	const history = useHistory();
	const [form] = Form.useForm();
	// 选择的加工流程
	const [selectProcessing, setSelectProcessing] = useState(null)
	// @ts-ignore
	const [isLoading, setIsLoading] = useState(false);
	// 展示弹框
	const [showSelectProcessModal, setShowSelectProcessModal] = useState<boolean>(false);
	// mounted
	useEffect(() => {
		return () => {
			form.resetFields()
			setSelectProcessing(null)
		}
	}, [])
	// methods
	// @ts-ignore
	const goBack = (e = undefined) => {
		if (e) {
			e.preventDefault()
			e.stopPropagation()
		}
		history.goBack()
	}
	const create = async () => {
		const {name,description,resource} = form.getFieldsValue(true)
		const {cpu,gpu} = JSON.parse(resource)
		const params = {
			"pipeline_id": selectProcessing?.id,
			name,
			description,
			cpu,
			gpu,
		}
		await post('/drapi/apidr/drs', params)
		message.success('创建成功')
		goBack()
	}
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	}
	const clickSelectProcessing = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setShowSelectProcessModal(true)
	}
	// 选择加工流程
	const selectProcessingModalOnOk = (data) => {
		console.log('into selectProcessingModalOnOk,data=', data)
		setSelectProcessing(data)
		setShowSelectProcessModal(false)
		form.setFieldValue('processing',data)
		form.setFieldValue('name',data.name)
		form.setFieldValue('description',data.description)
		form.validateFields(['processing','name','description'])
	}
	const selectProcessingModalOnCancel = () => {
		console.log('into selectProcessingModalOnCancel')
		setShowSelectProcessModal(false)
	}

	// 删除选择的加工流程
	const delelteSelectProcessing = () => {
		setSelectProcessing(null)
		form.setFieldValue('processing',null)
		form.validateFields(['processing'])
	}
	// render
	return (
		// 最外层
		<div className="w-full flex flex-col items-center bg text-sm leading-[14px]">
			<NavigationComponent data={[
				{label:'数据要素',router:'/data-element/offline-packet',icon:DataElement,iconActive:DataElementActive},
				{label:'API服务',router:'/data-element/api-serve',icon:ApiServe,iconActive:ApiServeActive},
				{label:'创建',disabled:true},
			]}/>
			{/*主体内容*/}
			<div className={`mb-16 flex flex-col bg-white pt-10 shadow-card rounded label-width-178`}
			     style={{width: '960px'}}>
				{/*内容部分*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					<Form form={form}
					      onFinish={create}
					      onFinishFailed={onFinishFailed}
					      onKeyDown={handleKeyDownDisabled}>
						<div className={"w-[908px] flex flex-col"}>
							{/*加工流程*/}
							<Form.Item
								style={{}}
								label="加工流程"
								name="processing"
								className={"label-height-38"}
								rules={[
									{required: true, message: '请选择加工流程'},
								]}
							>
								<div className={"w-full h-[38px] flex items-center"}>
									{
										!selectProcessing &&
										<ButtonSecond text={'+选择加工流程'} click={clickSelectProcessing} style={{width:'187px',height:'38px'}}/>
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
							</Form.Item>
							{/*名称*/}
							<Form.Item
								style={{}}
								label="名称"
								name="name"
								className={"label-height-38"}
								rules={[
									{required: true, message: '请输入名称'},
									() => ({
										validator(_, value) {
											if (value && value.length > 20) {
												return Promise.reject(new Error('名称不能超过20个字符'))
											}
											return Promise.resolve()
										}
									})
								]}
							>
								<Input placeholder={'请输入名称'} autoComplete={"off"}/>
							</Form.Item>
							{/*简介*/}
							<Form.Item
								label="简介"
								name="description"
								rules={[{required: true, message: '请输入简介'}]}
							>
								<Input.TextArea style={{height: '131px'}} showCount maxLength={500}
								                onKeyDown={e => e.stopPropagation()}
								                placeholder={"请输入简介"}/>
							</Form.Item>
							{/*配置资源(CPU)*/}
							<Form.Item
								style={{}}
								label="配置资源(CPU)"
								name="resource"
								className={"label-height-38"}
								rules={[
									{required: true, message: '请选择资源'},
								]}
								initialValue={modelCpuConfigurationList[0].value}
							>
								<Select
									size={'large'}
									placeholder={'请选择资源'}
									options={modelCpuConfigurationList}/>
							</Form.Item>
						</div>
						{/*底部按钮*/}
						<div className={`mb-8 w-full flex justify-center items-center`}
						     style={{marginTop: '28vh'}}>
							<ButtonSecond style={{width: '86px', height: '32px', lineHeight: '14px'}}
							              text={'取消'}
							              click={goBack}/>
							<ButtonMain className="ml-6"
							            style={{width: '86px', height: '32px', lineHeight: '14px'}}
							            text={'提交申请'}
							            click={null}/>
						</div>
					</Form>
				</Spin>
			</div>
			{/*选择加工流程*/}
			<SelectProcessingModal data={null}
			                       showWhich={2}
			                       show={showSelectProcessModal}
			                       onCancel={selectProcessingModalOnCancel}
			                       onOk={data=>selectProcessingModalOnOk(data)}/>
		</div>
	)
}
