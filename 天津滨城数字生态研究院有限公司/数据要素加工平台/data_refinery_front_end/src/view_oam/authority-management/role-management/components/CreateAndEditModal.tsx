import React, {useEffect} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import {Form, Input} from "antd";
import {handleKeyDownDisabled} from "../../../../utils/util";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";

export default function CreateAndEditModal(props: IDraggableModalProps) {
	// state
	// @ts-ignore
	const {title, show, data, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		form.resetFields()
		if (data) {
			form.setFieldsValue({
				role: data.role,
				role_desc: data.role_desc,
			})
		}
	},[show])
	// methods
	const onOkInner = async () => {
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
		                wrapClassName='modal-width-520 modal-height-466 label-width-147'
		                show={show}
		                onCancel={onCancel}>
			<Form
				form={form}
				onFinish={onOkInner}
				onKeyDown={handleKeyDownDisabled}
			>
				<div className={"w-full flex flex-col text-sm leading-[14px]"}>
					{/*角色名称*/}
					<Form.Item
						label="角色名称"
						style={{
							marginTop: '32px',
						}}
						name="role"
						className={'label-height-38'}
						rules={[
							{ required: true, message: '请输入角色名称'},
							{max: 20, message: '最多输入20个字符'},
						]}
					>
						<Input style={{width: '297px', height:'38px',borderRadius:'2px'}}
						       placeholder={"请输入角色名称"}
						       autoComplete={"off"}/>
					</Form.Item>
					{/*角色描述*/}
					<Form.Item
						label="角色描述"
						name="role_desc"
						className={'label-height-38'}
						rules={[
							{ required: true, message: '请输入角色描述'},
						]}>
						<Input.TextArea style={{width: '297px',borderRadius:'2px'}}
						                rows={11}
						                showCount={true}
						                maxLength={500}
						                placeholder={"请输入角色描述"}
						                autoComplete={"off"}/>
					</Form.Item>
					<div className={"pb-6 mt-[3px] w-full mt-[1px] flex justify-center items-center"}>
						<ButtonSecond text={'取消'} click={onCancelInner} style={{width: '61px', height: '32px'}}/>
						<ButtonMain text={'确认'} click={null} style={{width: '61px', height: '32px', marginLeft: '16px'}}/>
					</div>
				</div>
			</Form>
		</DraggableModal>
	)
}
