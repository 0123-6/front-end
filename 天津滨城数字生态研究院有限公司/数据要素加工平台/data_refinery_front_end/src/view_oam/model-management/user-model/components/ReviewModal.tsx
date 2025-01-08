import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import {Form, Input, Select} from "antd";
import {modelCpuConfigurationList, modelGpuConfigurationList} from "../../../../utils/static";
import {useEffect} from "react";
import ButtonMain from "../../../../components/ButtonMain";
import ButtonSecond from "../../../../components/ButtonSecond";
import {handleKeyDownDisabled} from "../../../../utils/util";
import React from "react";

export default function ReviewModal(props: IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel,onReject} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		if (show) {
			const params = {
				cpu: (data?.cpu && data?.memory) ? JSON.stringify({cpu:data?.cpu,memory:data?.memory}) : JSON.stringify({cpu:1, memory:2}),
				gpu: data?.gpu ? data?.gpu : 0,
				audit_msg: null
			}
			form.setFieldsValue(params)
		}
	},[show])
	// methods
	const onOkInner = async (e) => {
		e.stopPropagation()
		e.preventDefault()
		let ok = true
		const formData = form.getFieldsValue(true)
		// 校验cpu，gpu,memory
		// if (formData.cpu === null) {
		// 	form.setFields([{
		// 		name: 'cpu',
		// 		errors: ['请选择CPU规格']
		// 	}])
		// 	ok = false
		// }
		// if (formData.gpu === null) {
		// 	form.setFields([{
		// 		name: 'gpu',
		// 		errors: ['请选择GPU规格']
		// 	}])
		// 	ok = false
		// }
		// if(!formData.audit_msg){
		// 	form.setFields([{
		// 		name: 'audit_msg',
		// 		errors: ['请输入审核意见']
		// 	}])
		// 	ok = false
		// }
		if (!ok) return
		const params = {
			...formData,
			...JSON.parse(formData.cpu),
		}
		onOk(params)
	}
	const onRejectInner = async (e) => {
		e.stopPropagation()
		e.preventDefault()
		// 清除cpu，gpu的错误信息
		form.setFields([
			{
				name: 'cpu',
				errors: null
			},
			{
				name: 'gpu',
				errors: null
			}
			])
		//校验remark
		// await form.validateFields(['audit_msg'])
		const formData = form.getFieldsValue(['audit_msg'])
		onReject(formData)
	}
	const changeCpu = () => {
		//将cpu的错误信息清除
		form.setFields([{
			name: 'cpu',
			errors: null
		}])
	}
	const changeGpu = () => {
		//将gpu的错误信息清除
		form.setFields([{
			name: 'gpu',
			errors: null
		}])
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='oam-user-model-review-modal label-width-147'
		                show={show}
		                onCancel={onCancel}>
			<Form
				form={form}
				onFinish={null}
				onKeyDown={handleKeyDownDisabled}
			>
				<div className={"w-full flex flex-col items-center text-sm leading-[14px]"}>
					{/*提示*/}
					<div className={"mt-4 flex items-center"}>
						<span className={"flex items-center"}>模型：</span>
						<span className={"ml-1 flex items-center text-main text-hidden"}
						      title={data?.name.length>13?data?.name:null}
						      style={{maxWidth:'186px'}}>{data?.name}</span>
					</div>
					{/*选择资源配置*/}
					<div className={"mt-5 w-full flex flex-col"}
					     style={{paddingRight: '73px'}}>
						<div className={"flex items-center pl-[106px]"}>请选择资源配置</div>
						<Form.Item
							label="CPU"
							className='label-height-38'
							style={{marginTop: '16px'}}
							name="cpu"
							rules={null}
						>
							<Select
								size={'large'}
								placeholder={'请选择CPU规格'}
								onChange={changeCpu}
								options={modelCpuConfigurationList}/>
						</Form.Item>
						<Form.Item
							label="GPU"
							className='label-height-38'
							name="gpu"
							rules={null}
						>
							<Select
								size={'large'}
								placeholder={'请选择GPU规格'}
								onChange={changeGpu}
								options={modelGpuConfigurationList}/>
						</Form.Item>
						<Form.Item
							label="审核意见"
							className=''
							name="audit_msg"
							// rules={[{required: true, message: '请输入审核意见'}]}
						>
							<Input.TextArea maxLength={500} rows={5} showCount
							                autoComplete={"off"}
							                onKeyDown={e => e.stopPropagation()}
							                placeholder="请输入审核意见"/>
						</Form.Item>
						<span className={"pl-[147px] w-full flex items-center text-xs leading-[18px] text-[#B7B7B7]"}>审核通过，允许该模型发布，请点击“通过”。审核不通过，请点击“驳回”。</span>
					</div>
					{/*按钮*/}
					<div className={"mt-[44px] mb-6 flex"}>
						<ButtonSecond text={'驳回'} click={onRejectInner} style={{width:'61px',height:'32px'}}/>
						<ButtonMain text={'通过'} className={"ml-4"} click={onOkInner} style={{width:'61px',height:'32px'}}/>
					</div>
				</div>
			</Form>
		</DraggableModal>
	)
}
