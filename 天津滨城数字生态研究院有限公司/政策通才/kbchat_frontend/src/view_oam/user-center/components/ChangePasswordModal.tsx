import React, {useEffect} from "react";
import DraggableModal, { IDraggableModalProps } from "../../../components/draggable-modal";
import {Form, Input} from "antd";
import {handleKeyDownDisabled} from "../../../utils/util";
import ButtonMain from "../../../components/ButtonMain";

export default function ChangePasswordModal(props:IDraggableModalProps) {
	// state
	const {title, show, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		if (show) {
			const params = {}
			form.setFieldsValue(params)
		}
	},[show])
	// methods
	const onOkInner = () => {
		const params = form.getFieldsValue(true)
		onOk(params)
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='change-password-modal'
		                show={show}
		                onCancel={onCancel}>
			<Form
				form={form}
				layout="vertical"
				onFinish={onOkInner}
				onKeyDown={handleKeyDownDisabled}
			>
				<div className={"mt-[3.6vh] w-full flex flex-col"}
				     style={{
							 paddingLeft: '3.5vw',
					     paddingRight: '3.5vw',
					     height: '35.7vh',
					     minHeight: '300px',
				     }}>
					{/*输入新密码*/}
					<Form.Item
						label="输入新密码"
						name="password"
						rules={[{ required: true, message: '请输入新密码' }]}
					>
						<Input style={{height:'40px',borderRadius:'8px'}} type="password" placeholder={"请输入新密码"} autoComplete={"off"}/>
					</Form.Item>
					{/*再次输入新密码*/}
					<Form.Item
						label="再次输入新密码"
						name="password2"
						rules={[{ required: true, message: '请再次输入新密码' }]}
					>
						<Input style={{height:'40px',borderRadius:'8px'}} type="password" placeholder={"请再次输入新密码"} autoComplete={"off"}/>
					</Form.Item>
					<ButtonMain text={'重置'} className={"mt-4"} click={null} style={{width:'100%',height:'44px'}}/>
				</div>
			</Form>
		</DraggableModal>
	)
}
