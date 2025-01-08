import DraggableModal, {IDraggableModalProps} from "../../../components/draggable-modal";
import {Form, Select} from "antd";
import {useEffect, useState} from "react";
import {handleKeyDownDisabled} from "../../../utils/util";
import React from "react";
import ButtonSecond from "../../../components/ButtonSecond";
import ButtonMain from "../../../components/ButtonMain";
import {modelCpuConfigurationList} from "../../../utils/static";

export default function TestModal(props:IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// 是否已提交
	const [isSubmit, setIsSubmit] = useState(false)
	// mounted
	useEffect(()=>{
		if (show) {
			const params = {
				cpu: (data?.cpu && data?.memory) ? JSON.stringify({cpu:data?.cpu,memory:data?.memory}) : JSON.stringify({cpu:1, memory:2 }),
			}
			form.setFieldsValue(params)
			setIsSubmit(false)
		}
	},[show])
	// methods
	const onOkInner = async () => {
		const formData = form.getFieldsValue(true)
		const params = JSON.parse(formData.cpu)
		setIsSubmit(true)
		await onOk(params)
	}
	const onCancelInner = (e) => {
		e.preventDefault()
		onCancel()
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='my-model-test'
		                show={show}
		                onCancel={onCancel}>
			<Form
				form={form}
				onFinish={onOkInner}
				onKeyDown={handleKeyDownDisabled}
			>
				<div className={"w-full flex flex-col items-center text-sm leading-[14px]"}>
					{/*提示*/}
					<div className={"mt-10 flex items-center"}>
						<span className={"flex items-center"}>模型：</span>
						<span className={"ml-1 flex items-center text-main text-hidden"}
						      title={data?.name.length>13?data?.name:null}
						      style={{maxWidth:'186px'}}>{data?.name}</span>
					</div>
					{/*选择资源配置*/}
					<div className={"mt-7 w-full flex flex-col"}
					     style={{paddingLeft: '109px', paddingRight: '73px'}}>
						<div className={"flex items-center"}>请选择资源配置</div>
						<Form.Item
							label="CPU"
							className='label-height-38'
							style={{marginTop: '16px'}}
							name="cpu"
							rules={[{required: true, message: '请选择CPU规格'}]}
						>
							<Select
								size={'large'}
								placeholder={'请选择CPU规格'}
								options={modelCpuConfigurationList}/>
						</Form.Item>
					</div>
					{/*按钮*/}
					<div className={"mb-8 flex"}
					     style={{marginTop:'138px'}}>
						<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'32px'}}/>
						<ButtonMain text={'提交申请'+(isSubmit?'中':'')}
						            className={"ml-4"}
						            click={null}
						            style={{width:'85px',height:'32px'}}
						            disabled={isSubmit}
						/>
					</div>
				</div>
			</Form>
		</DraggableModal>
	)
}
