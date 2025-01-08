import React, {useEffect} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import {Form, Input, Select, Tooltip} from "antd";
import {handleKeyDownDisabled} from "../../../../utils/util";
import { roleList } from "..";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import Wenhao from "../../../../icon/wenhao";

export default function CreateModal(props: IDraggableModalProps) {
	// state
	// @ts-ignore
	const {title, show, data, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		if (show) {
			form.resetFields()
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
		                wrapClassName='oam-user-management-create-modal label-width-130'
		                show={show}
		                onCancel={onCancel}>
			<Form
				form={form}
				onFinish={onOkInner}
				onKeyDown={handleKeyDownDisabled}
			>
				<div className={"w-full flex flex-col text-sm leading-[14px]"}>
					{/*账号*/}
					<Form.Item
						style={{
							marginTop: '27px',
						}}
						label="手机号/账号"
						name="mobile"
						className={'label-height-38'}
						rules={[
							{ required: true, message: '请输入手机号'},
							{ pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确' }
						]}
					>
						<div className={"flex items-center relative"}>
							<Input style={{width: '295px', height:'38px',borderRadius:'2px'}} placeholder={"请输入手机号"} autoComplete={"off"}/>
							<Tooltip title={'手机号就是账号，账号就是手机号'}
							         overlayClassName={'create-user'}>
								<div className={"ml-2 flex items-center text-black-light"}>
									<Wenhao/>
								</div>
							</Tooltip>
						</div>
					</Form.Item>
					{/*姓名*/}
					<Form.Item
						label="姓名"
						name="name"
						className={'label-height-38'}
						rules={[
							{ required: true, message: '请输入姓名'},
						]}
					>
						<Input style={{width: '295px', height:'38px',borderRadius:'2px'}} placeholder={"请输入姓名"} autoComplete={"off"}/>
					</Form.Item>
					{/*单位*/}
					<Form.Item
						label="单位"
						name="company"
						className={'label-height-38'}
						rules={[
							{ required: true, message: '请输入单位名称'},
						]}
					>
						<Input style={{width: '295px', height:'38px',borderRadius:'2px'}} placeholder={"请输入单位名称"} autoComplete={"off"}/>
					</Form.Item>
					<Form.Item
						// style={{marginTop:'16px'}}
						label="角色"
						className={'label-height-38'}
						name="role"
						rules={[
							{ required: true, message: '请选择角色'},
						]}
					>
						<Select size={'large'}
						        style={{
											width: '295px',
						        }}
						        placeholder={"请选择角色"}
						        options={roleList}/>
					</Form.Item>
					{/*邮箱*/}
					<Form.Item
						label="邮箱"
						name="email"
						className={'label-height-38'}
						rules={[
							// { required: true, message: '请输入邮箱' },
							{ pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' },
						]}
					>
						<Input style={{width: '295px', height:'38px'}} placeholder={"请输入邮箱"} autoComplete={"off"}/>
					</Form.Item>
					<div className={"pb-6 w-full mt-[1px] flex justify-center items-center"}>
						<ButtonSecond text={'取消'} click={onCancelInner} style={{width: '61px', height: '32px'}}/>
						<ButtonMain text={'确认'} click={null} style={{width: '61px', height: '32px', marginLeft: '16px'}}/>
					</div>
				</div>
			</Form>
		</DraggableModal>
	)
}
