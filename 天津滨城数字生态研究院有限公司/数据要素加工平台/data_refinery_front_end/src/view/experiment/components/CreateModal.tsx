import {Form, Input, Radio} from "antd";
import React, {useEffect} from "react";
import {handleKeyDownDisabled} from "../../../utils/util";
import DraggableModal from "../../../components/draggable-modal";
import ButtonSecond from "../../../components/ButtonSecond";
import ButtonMain from "../../../components/ButtonMain";

interface IProps {
	title: string;
	show: boolean;
	onOk: (params: any) => void;
	onCancel: () => void;
}

export default function CreateModal(props:IProps) {
	// state
	const {title,show, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		if (show) {
			const params = {
				name:'',
				description:'',
				type:1,
			}
			form.setFieldsValue(params)
		}
	},[show])
	// methods
	const modalCreateOk = () => {
		const params = form.getFieldsValue(true)
		onOk(params)
	}
	const modalCreateCancel = (e) => {
		e.preventDefault()
		onCancel()
	}
	// render
	return (
		<DraggableModal
			title={title}
			wrapClassName={'experiment-create'}
			onCancel={modalCreateCancel}
			show={show}
		>
			<Form
				form={form}
				onFinish={modalCreateOk}
				onKeyDown={handleKeyDownDisabled}
			>
				<Form.Item
					label="名称"
					className='label-height-38'
					name="name"
					rules={[{ required: true, message: '请输入实验名称' }]}
				>
					<Input placeholder="请输入实验名称" autoComplete={"off"}/>
				</Form.Item>

				<Form.Item
					label="简介"
					name="description"
					rules={[{ required: true, message: '请输入实验简介' }]}
				>
					<Input.TextArea maxLength={500} rows={10} showCount
					                autoComplete={"off"}
					                onKeyDown={e => e.stopPropagation()}
					                placeholder="请输入实验简介"/>
				</Form.Item>
				<Form.Item label="类型" name='type'
				           rules={[{ required: true, message: '请选择实验方式' }]}>
					<Radio.Group>
						<Radio value={1}>拖拽式</Radio>
						<Radio value={2}>编码式</Radio>
					</Radio.Group>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 0, span: 24 }}>
					<div className="pb-6 w-full flex justify-center items-center">
						<ButtonSecond text={'取消'} click={(e)=>modalCreateCancel(e)} style={{width:'61px',height:'32px'}}/>
						<ButtonMain text={'确定'} className={"ml-4"} click={null} style={{width:'61px',height:'32px'}}/>
					</div>
				</Form.Item>
			</Form>
		</DraggableModal>
	)
}
