import {Form, Input, message} from "antd";
import { useHistory } from 'react-router-dom';
import ButtonMain from "../../../components/ButtonMain";
import React, {useEffect} from "react";
import {post} from "../../../axios";

export default function Login(props) {
	// state
	const [form] = Form.useForm();
	// @ts-ignore
	const history = useHistory();
	// mounted
	useEffect(()=>{
		// 判断location.pathname是否包含oam
		const pathname = location.pathname
		if(pathname.includes('oam')) {
			document.title = 'OAM-政策通才';
		} else {
			document.title = '政策通才';
		}
	},[])
	// methods
	// 点击登录按钮
	const login = async () => {
		// 清空localStorage
		localStorage.clear()
		const nowValue = await form.getFieldsValue(true)
		const res = await post('/user/signin', nowValue)
		// 判断location.pathname是否包含oam
		const pathname = location.pathname
		if(pathname.includes('oam') && res.data.user_info.role !== 'admin') {
			message.error('您不是管理员，无法登录OAM')
			return
		}
		localStorage.setItem('user', JSON.stringify(res.data))
		if(pathname.includes('oam')) {
			history.push('/oam')
		} else {
			history.push('/')
		}
	}

	// 跳转到注册页面
	const goRegister = (_e) => {
		props.changePage('注册')
	}
	// 跳转到忘记密码页面
	const goFindPassword = (_e) => {
		props.changePage('忘记密码')
	}
	// render
	return (
		<div className={"w-full flex flex-col"}>
			<div className={"w-full"} style={{height:'12vh'}}/>
			<div className={"font-bold text-black-dark"} style={{fontSize:'32px'}}>欢迎登录</div>
			{/*表单*/}
			<Form className={"login"}
			      form={form}
			      layout="vertical"
			      onFinish={login}>
				{/*账号*/}
				<Form.Item
					style={{marginTop:'38px'}}
					label="账号"
					name="mobile"
					rules={[
						{ required: true, message: '请输入手机号' },
						{ pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确', }
					]}
				>
					<Input style={{height:'50px',borderRadius:'8px'}} placeholder={"请输入手机号"} autoComplete={"off"}/>
				</Form.Item>
				{/*密码*/}
				<Form.Item
					style={{marginTop:'38px'}}
					label="密码"
					name="password"
					rules={[{ required: true, message: '请输入登录密码' }]}
				>
					<Input style={{height:'50px',borderRadius:'8px'}} type="password" placeholder={"请输入登录密码"} autoComplete={"off"}/>
				</Form.Item>
				{/*登录按钮*/}
				<div className={"w-full"} style={{height:'3.70vh'}}/>
				<ButtonMain style={{width:'100%',height:'50px'}} text='登录' click={null}/>
			</Form>
			{/*其它*/}
			<div className={"mt-4 w-full flex justify-between items-center text-sm text-black-light leading-[14px]"}>
				<span className={"flex items-center cursor-pointer hover:text-main active:text-main-hover"} onClick={goRegister}>注册</span>
				<span className={"flex items-center cursor-pointer hover:text-main active:text-main-hover"} onClick={goFindPassword}>忘记密码</span>
			</div>
		</div>
	)
}
