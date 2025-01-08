import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import {Form, Input} from "antd";
import {useEffect} from "react";
import ButtonMain from "../../../../components/ButtonMain";
import ButtonSecond from "../../../../components/ButtonSecond";
import {handleKeyDownDisabled} from "../../../../utils/util";
import React from "react";

export default function ReviewModal(props: IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel,onReject,hint} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		if (show) {
			const params = {
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
					<div className={"mt-[2.8vh] flex items-center"}>
						<span className={"flex items-center"}>数据：</span>
						<span className={"ml-1 flex items-center text-main text-hidden"}
						      title={data?.name.length>13?data?.name:null}
						      style={{maxWidth:'186px'}}>{data?.name}</span>
					</div>
					{/*选择资源配置*/}
					<div className={"mt-[2.5vh] w-full flex flex-col"}
					     style={{paddingRight: '73px'}}>
						<Form.Item
							label="审核意见"
							className=''
							name="audit_msg"
							// rules={[{required: true, message: '请输入审核意见'}]}
						>
							<Input.TextArea maxLength={500} rows={10} showCount
							                autoComplete={"off"}
							                onKeyDown={e => e.stopPropagation()}
							                placeholder="请输入审核意见"/>
						</Form.Item>
						<span className={"pl-[147px] w-full flex items-center text-xs leading-[18px] text-[#B7B7B7]"}>{hint}</span>
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
