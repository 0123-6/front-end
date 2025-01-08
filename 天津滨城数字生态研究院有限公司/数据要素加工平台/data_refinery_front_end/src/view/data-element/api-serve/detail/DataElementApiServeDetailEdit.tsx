import {Form, Input, message, Select} from "antd";
import React, {useEffect, useState} from "react";
import {handleKeyDownDisabled} from "../../../../utils/util";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import {CloseCircleFilled} from "@ant-design/icons";
import SelectProcessingModal from "../../../element-processing/production-task/create/components/SelectProcessingModal";
import {post} from "../../../../axios";
import {modelCpuConfigurationList} from "../../../../utils/static";

interface IProps {
	data: any,
	onOk: (_data: object) => void,
	onCancel: () => void,
}

export default function DataElementApiServeDetailEdit(props: IProps) {
	// state
	const [form] = Form.useForm();
	const {data, onOk, onCancel} = props
	// 选择的加工流程
	const [selectProcessing, setSelectProcessing] = useState(null)
	// @ts-ignore
	const [isLoading, setIsLoading] = useState(false);
	// 展示弹框
	const [showSelectProcessModal, setShowSelectProcessModal] = useState<boolean>(false);
	// effect
	useEffect(() => {
		if(data) {
			form.setFieldsValue({
				...data,
				processing: data.pipeline,
			})
			setSelectProcessing(data.pipeline)
		}
		return () => {
			form.resetFields()
			setSelectProcessing(null)
		}
	}, [data])
	// methods
	const clickEditOk = async () => {
		const {name,description,resource} = form.getFieldsValue(true)
		const {cpu,gpu} = JSON.parse(resource)
		const params = {
			id: data.id,
			"pipeline_id": selectProcessing?.id,
			name,
			description,
			cpu,
			gpu,
		}
		await post('/drapi/apidr/drs', params)
		message.success(`编辑成功`)
		onOk({
			...data,
			...params,
		})
	}

	const clickCancel = (e) => {
		e.preventDefault()
		e.stopPropagation()
		onCancel()
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
		//最外层
		<div className={"mt-[22px] w-[908px] flex flex-col label-width-178 relative"}>
			<Form form={form}
			      onFinish={clickEditOk}
			      onFinishFailed={onFinishFailed}
			      onKeyDown={handleKeyDownDisabled}>
				{/*按钮*/}
				<div className={"w-full flex justify-end items-center relative z-10"}>
					<ButtonSecond text={'取消'} click={clickCancel} style={{width: '88px', height: '32px'}}/>
					<ButtonMain text={'保存'} click={null} style={{width: '88px', height: '32px'}} className={"ml-6"}/>
				</div>
				<div className={"w-full flex flex-col"}>
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
					<div className={"w-full"} style={{height:'30vh'}}></div>
				</div>
			</Form>
			{/*选择加工流程*/}
			<SelectProcessingModal data={null}
			                       showWhich={2}
			                       show={showSelectProcessModal}
			                       onCancel={selectProcessingModalOnCancel}
			                       onOk={data=>selectProcessingModalOnOk(data)}/>
		</div>
	)
}
