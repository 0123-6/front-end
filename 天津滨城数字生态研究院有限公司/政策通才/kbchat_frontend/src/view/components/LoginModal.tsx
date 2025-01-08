import React, {useEffect} from "react";
import DraggableModal, {IDraggableModalProps} from "../../components/draggable-modal";
import {handleKeyDownDisabled} from "../../utils/util";
import {Form, Input} from "antd";
// @ts-ignore
import ButtonSendSmsCode from "../login/components/ButtonSendSmsCode";
import ButtonSecond from "./ButtonSecond";
import { post } from "../../axios";

export default function LoginModal(props: IDraggableModalProps) {
	// state
	// @ts-ignore
	const {title, show, data, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// @ts-ignore
	const [isSend,setIsSend] = React.useState(false)
	const [beforeSecondSend,setBeforeSecondSend] = React.useState(60)
	const timer = React.useRef(null)
	// mounted
	useEffect(()=>{
		// 重置表单
		form.resetFields()
		initTimer()
	},[show])
	useEffect(()=>{
		if (beforeSecondSend === 0) {
			initTimer()
		}
	},[beforeSecondSend])
	// methods
	// 初始化定时器
	const initTimer = () => {
		clearInterval(timer.current)
		setIsSend(false)
		setBeforeSecondSend(60)
	}
	const onOkInner = () => {
		login()
	}
	// const onCancelInner = (e) => {
	// 	e.preventDefault()
	// 	onCancel()
	// }
	// 获取验证码
	// @ts-ignore
	const sendVerificationCode = async (_e) => {
		_e.stopPropagation()
		_e.preventDefault()
		try {
			// 校验手机号是否正确,正确则获取手机号
			const {mobile} = await form.validateFields(['mobile'])
			const params = {
				mobile
			}
			// 获取验证码
			const res = await post(`/user/sms/signup`, params)
			console.log('res: ',res)
			setIsSend(true)
			timer.current = setInterval(() => {
				setBeforeSecondSend((oldValue) => {
					return oldValue - 1
				})
			}, 1000)
		} catch (_e) {
			console.log('手机号未通过校验')
		}
	}
	// 注册
	const login = async () => {
		const nowValue = await form.getFieldsValue(true)
		const params = {
			...nowValue,
		}
		onOk(params)
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='login-modal'
		                show={show}
		                onCancel={onCancel}>
			<Form
				form={form}
				onFinish={onOkInner}
				layout="vertical"
				onKeyDown={handleKeyDownDisabled}
			>
				<div className={"w-full flex flex-col text-sm leading-[14px] pl-[67px] pr-[67px] pb-[69px]"}>
					{/*手机号*/}
					<Form.Item
						style={{marginTop:'38px'}}
						label="手机号"
						name="mobile"
						rules={[
							{ required: true, message: '请输入手机号'},
							{ pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确' }
						]}
					>
						<Input style={{height:'40px',borderRadius:'8px'}} placeholder={"请输入手机号"} autoComplete={"off"}/>
					</Form.Item>
					{/*密码*/}
					<Form.Item
						label="密码"
						name="password"
						rules={[
							{ required: true, message: '请输入登录密码' }
						]}
					>
						<Input style={{height:'40px',borderRadius:'8px'}} type="password" placeholder={"请输入登录密码"} autoComplete={"off"}/>
					</Form.Item>
					{/*按钮*/}
					<ButtonSecond text={'登录'} click={null} style={{width:'100%',height:'44px'}} className={"mt-6"}/>
				</div>
			</Form>
		</DraggableModal>
	)
}
