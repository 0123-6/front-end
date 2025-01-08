import DraggableModal, {IDraggableModalProps} from "../../../components/draggable-modal";
import {Form, Input} from "antd";
import React, {useEffect} from "react";
import {handleKeyDownDisabled} from "../../../utils/util";
import ButtonSecond from "../../../components/ButtonSecond";
import ButtonMain from "../../../components/ButtonMain";

export default function ApplyOfflineModal(props:IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		if (show) {
			const params = {
				reason: null,
			}
			form.setFieldsValue(params)
		}
	},[show])
	// methods
	const onOkInner = () => {
		const params = form.getFieldsValue(true)
		onOk(params)
	}
	const onCancelInner = (e) => {
		e.preventDefault()
		onCancel()
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='my-model-apply-offline'
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
						<span className={"flex items-center"}>确定申请将</span>
						<span className={"ml-1 flex items-center text-main text-hidden"}
						      title={data?.name.length>13?data?.name:null}
						      style={{maxWidth:'186px'}}>{data?.name}</span>
						<span className={"ml-1 flex items-center"}>模型下线吗？</span>
					</div>
					{/*选择资源配置*/}
					<div className={"mt-7 w-full flex flex-col"}
					     style={{paddingLeft: '60px', paddingRight: '60px'}}>
						<div className={"flex items-center"}>请填写需要下线的原因</div>
						<Form.Item
							label={null}
							className='label-height-38'
							style={{marginTop: '16px'}}
							name="reason"
							rules={[{required: true, message: '请填写需要下线的原因'}]}
						>
							<Input.TextArea maxLength={500} rows={8} showCount
							                autoComplete={"off"}
							                onKeyDown={e => e.stopPropagation()}
							                placeholder="请填写需要下线的原因"/>
						</Form.Item>
					</div>
					{/*按钮*/}
					<div className={"mb-8 flex"}
					     style={{marginTop:'12px'}}>
						<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'32px'}}/>
						<ButtonMain text={'提交申请'} className={"ml-4"} click={null} style={{width:'85px',height:'32px'}}/>
					</div>
				</div>
			</Form>
		</DraggableModal>
	)
}
