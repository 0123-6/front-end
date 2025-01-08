import {Form, Input, InputNumber, message, Select} from "antd";
import { useHistory } from 'react-router-dom';
import ButtonMain from "../../../../components/ButtonMain";
import React, {useEffect} from "react";
import ButtonSendSmsCode from "./ButtonSendSmsCode";
import {handleKeyDownDisabled} from "../../../../utils/util";
import {post} from "../../../../axios";

const roleList = [
	{label:'模型开发者',value:'模型开发者'},
	{label:'数据提供者',value:'数据提供者'},
	{label:'要素加工者',value:'要素加工者'},
]

export default function Register(props) {
	// state
	const [form] = Form.useForm();

	// @ts-ignore
	const history = useHistory();
	const [page,setPage] = React.useState('')
	const [isSend,setIsSend] = React.useState(false)
	const [beforeSecondSend,setBeforeSecondSend] = React.useState(60)
	const timer = React.useRef(null)
	// mounted
	useEffect(()=>{
		if(props.page === '注册') {
			// form.resetFields()
		} else if (props.page === '忘记密码') {
			// form.resetFields()
		}
		setPage(props.page)
	},[props.page])
	useEffect(()=>{
		console.log(beforeSecondSend)
		if (beforeSecondSend === 0) {
			clearInterval(timer.current)
			setIsSend(false)
			setBeforeSecondSend(60)
		}
	},[beforeSecondSend])
	// methods
	// 跳转到登录页面
	const goLogin = (_e:null) => {
		props.changePage('登录')
	}
	// 发送验证码
	const sendVerificationCode = async (_e) => {
		_e.stopPropagation()
		_e.preventDefault()
		try {
			// 校验手机号是否正确,正确则获取手机号
			const {mobile} = await form.validateFields(['mobile'])
			const params = {
				mobile
			}
			// 发送验证码
			const res = await post(`/drapi/user/sms/${page === '注册' ? 'signup' : 'forgot_pwd'}`, params)
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
	const register = async () => {
		const nowValue = await form.getFieldsValue(true)
		const params = {
			...nowValue,
			sms_code:Number(nowValue.sms_code),
		}
		await post('/drapi/user/signup',params)
		message.success('注册成功')
		setTimeout(()=>{
			goLogin(null)
		},100)
	}
	// 重置密码
	const resetPassword = async () => {
		const nowValue = await form.getFieldsValue(true)
		const params = {
			...nowValue,
			sms_code:Number(nowValue.sms_code),
		}
		await post('/drapi/user/forgot_pwd',params)
		message.success('重置密码成功')
		setTimeout(()=>{
			goLogin(null)
		},100)
	}
	// render
	return (
		<div className={"w-full flex flex-col"}>
			<div className={"w-full"} style={{height:'12vh'}}/>
			<div className={"font-bold text-black-dark"}
			     style={{fontSize:'32px'}}>
				{page==='注册'?'欢迎注册':'找回密码'}
			</div>
			<div className={"mt-2 flex items-center text-sm leading-[14px]"}>
				<span className={'flex items-center text-black-light'}>{page==='注册'?'已有账号':'返回'}</span>
				<span className={'flex items-center text-main cursor-pointer'} onClick={goLogin}>登录</span>
			</div>
			{/*表单*/}
			<Form className={"login"}
			      form={form}
			      layout="vertical"
			      onFinish={page === '注册' ?register:resetPassword}
			      onKeyDown={handleKeyDownDisabled}>
				{/*账号*/}
				<Form.Item
					style={{marginTop:'8px'}}
					label="账号"
					name="mobile"
					rules={[
						{ required: true, message: '请输入手机号'},
						{ pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确' }
					]}
				>
					<Input style={{height:'45px',borderRadius:'8px'}} placeholder={"请输入手机号"} autoComplete={"off"}/>
				</Form.Item>
				{/*验证码*/}
				<Form.Item
					// style={{marginTop:'34px'}}
					label="验证码"
					name="sms_code"
					rules={[{ required: true, message: '请输入验证码' }]}
				>
					<div className={"w-full relative"}>
						<InputNumber style={{height:'45px',borderRadius:'8px',display:'flex',alignItems:'center'}}
						             placeholder={"请输入验证码"}
						             autoComplete={"off"}
						             controls={false}/>
						<ButtonSendSmsCode style={{width:'125px',height:'29px'}}
						                   className={'absolute right-2 top-2 z-10'}
						                   disabled={isSend}
						                   text={!isSend?'发送验证码':`已发送(${beforeSecondSend}s)`}
						                   click={_e => sendVerificationCode(_e)}/>
					</div>
				</Form.Item>
				{/*密码*/}
				<Form.Item
					// style={{marginTop:'24px'}}
					label="密码"
					name="password"
					rules={[
						{ required: true, message: '请输入登录密码' }
					]}
				>
					<Input style={{height:'45px',borderRadius:'8px'}} type="password" placeholder={"请输入登录密码"} autoComplete={"off"}/>
				</Form.Item>
				{/*确认密码*/}
				<Form.Item
					// style={{marginTop:'24px'}}
					label="确认密码"
					name="password2"
					rules={[
						{ required: true, message: '请再次输入登录密码' },
						({ getFieldValue }) => ({
							validator(_rule, value) {
								if (!value || getFieldValue('password') === value) {
									return Promise.resolve();
								}
								return Promise.reject('两次输入的密码不一致!');
							}
						})
					]}
				>
					<Input style={{height:'45px',borderRadius:'8px'}} type="password" placeholder={"请再次输入登录密码"} autoComplete={"off"}/>
				</Form.Item>
				{
					page === '注册' &&
					<Form.Item
						// style={{marginTop:'16px'}}
						label="选择角色"
						name="role"
						rules={[
							{ required: true, message: '请选择角色'},
						]}
					>
						<Select size={'large'}
						        className={'select-h-45'}
						        style={{height:'45px'}}
						        placeholder={"请选择角色"}
						        options={roleList}/>
					</Form.Item>
				}
				{/*登录按钮*/}
				<div className={"w-full"} style={{height:'1vh'}}/>
				<ButtonMain style={{width:'100%',height:'45px'}} text={page==='注册'?'注册':'重置'} click={null}/>
			</Form>
		</div>
	)
}
