import React, {useEffect} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../components/draggable-modal";
import {handleKeyDownDisabled} from "../../../utils/util";
import {Form, Select} from "antd";
import ButtonMain from "../../../components/ButtonMain";
import ButtonSecond from "../../../components/ButtonSecond";
import {modelCpuConfigurationList, modelGpuConfigurationList} from "../../../utils/static";

export default function ApplyPublishModal(props: IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		if (show) {
			const params = {
				cpu: (data?.cpu && data?.memory) ? JSON.stringify({cpu:data?.cpu,memory:data?.memory}) : null,
				gpu: data?.gpu ? data?.gpu : 0,
			}
			form.setFieldsValue(params)
		}
	},[show])



	// methods
	const onOkInner = () => {
		const formData = form.getFieldsValue(true)
		const {cpu,memory} = JSON.parse(formData.cpu)
		const params = {
			cpu,
			memory,
			gpu: formData.gpu,
		}
		onOk(params)
	}
	const onCancelInner = (e) => {
		e.preventDefault()
		onCancel()
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='my-model-apply-publish'
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
						<span className={"flex items-center"}>确定申请发布</span>
						<span className={"ml-1 flex items-center text-main text-hidden"}
						      title={data?.name.length>13?data?.name:null}
						      style={{maxWidth:'186px'}}>{data?.name}</span>
						<span className={"ml-1 flex items-center"}>模型吗？</span>
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
								// style={{width:'calc(100% + 29px)'}}
								size={'large'}
								placeholder={'请选择CPU规格'}
								options={modelCpuConfigurationList}/>
						</Form.Item>
						<Form.Item
							label="GPU"
							className='label-height-38'
							name="gpu"
							rules={[{required: true, message: '请选择GPU规格'}]}
						>
							<Select
								// style={{width:'calc(100% + 29px)'}}
								size={'large'}
								placeholder={'请选择GPU规格'}
								options={modelGpuConfigurationList}/>
						</Form.Item>
					</div>
					{/*按钮*/}
					<div className={"mb-8 flex"}
					     style={{marginTop:'76px'}}>
						<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'32px'}}/>
						<ButtonMain text={'提交申请'} className={"ml-4"} click={null} style={{width:'85px',height:'32px'}}/>
					</div>
				</div>
			</Form>
		</DraggableModal>
	)
}
