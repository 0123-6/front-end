import React, {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import {Form, Input, message, Radio, Spin, Upload} from "antd";
import ButtonMain from "../../components/ButtonMain";
import {handleKeyDownDisabled, updateUser} from "../../utils/util";
import DefaultAvatarSvg from "../../icon/DefaultAvatarSvg.svg";
import {post} from "../../axios";
import CameraSvg from "./icon/CameraSvg";
import ButtonFifth from "../../components/ButtonFifth";
import ChangePasswordSvg from "../../view_oam/user-center/icon/ChangePasswordSvg.svg";
import ChangePasswordModal from "./components/ChangePasswordModal";

export default function UserCenter() {
	const [form] = Form.useForm();
	// 获取用户信息
	const userInfo = JSON.parse(localStorage.getItem('user'))?.user_info
	console.log(userInfo)
	// state
	const history = useHistory();
	// @ts-ignore
	const [isLoading,setIsLoading] = useState(false)
	// @ts-ignore
	const [imageUrl,setImageUrl] = useState('')
	const [showChangePasswordModal,setShowChangePasswordModal] = useState(false)

	// mounted
	useEffect(() => {
		setIsLoading(true)
		form.setFieldsValue(userInfo)
		if (userInfo?.avatar) {
			setImageUrl(userInfo.avatar)
		}
		setIsLoading(false)
	},[])
	// methods
	// @ts-ignore
	const goBack = (e=undefined) => {
		if (e) {
			e.preventDefault()
		}
		history.goBack()
	}

	// 确认按钮,更新个人信息
	const clickOk = async () => {
		const nowValue = form.getFieldsValue(true)
		const params = {
			...nowValue,
			avatar:imageUrl
		}
		const {data} = await post(`/user/users/${nowValue.id}`, params)
		message.success('更新个人信息成功')
		// 更新localStorage
		const user = JSON.parse(localStorage.getItem('user'))
		const newUser = {
			...user,
			user_info: data,
		}
		localStorage.setItem('user', JSON.stringify(newUser))
		updateUser(params)
	}
	const beforeUpload = () => {
		console.log('into 上传图片')
	}
	const handleChange = (_data) => {
		console.log('into handleChange')
		console.log('_data: ',_data)
		if (_data.file.status === 'done') {
			setImageUrl(_data.file.response.data.urls[0])
		}
	}
	const clickChangePassword = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setShowChangePasswordModal(true)
	}
	const changePasswordModalOnOk = async (_data) => {
		const params = {
			..._data,
			mobile: userInfo.mobile,
		}
		const res = await post('user/pwd/update',params)
		localStorage.setItem('user', JSON.stringify(res.data))
		message.success('修改密码成功')
		setShowChangePasswordModal(false)
	}
	const changePasswordModalOnCancel = () => {
		setShowChangePasswordModal(false)
	}
	// render
	return (
		// 最外层
		<div className="mt-[90px] w-full flex flex-col items-center">
			{/*主体内容*/}
			<div className="pb-8 flex flex-col bg-white shadow-card rounded-2xl mb-16 label-width-126"
			     style={{
						 width: '62.5vw',
				     minWidth: '800px',
			     }}
			>
				<div className={"h-[5vh] min-h-[30px] pl-8 pr-8 flex items-center"}
				     style={{
							 borderRadius: '16px 16px 0 0',
				     }}>
					<span className={"text-black-dark font-medium"}>个人中心</span>
				</div>
				<div className={"mb-6 w-full h-[1px] bg-[#F2F2F2]"}/>
				{/*内容部分*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					<Form form={form}
					      onFinish={clickOk}
					      onKeyDown={handleKeyDownDisabled}
					>
						<div className={"flex flex-col"}
						     style={{
									 width:'38vw',
							     minWidth:'600px',
						     }}>
							{/*基本信息*/}
							<div className={"w-full flex flex-col"}>
								{/*头像*/}
								<Form.Item
									className={'label-height-62'}
									style={{marginTop:'8px'}}
									label="头像"
									name="picture"
								>
									<Upload
										name="avatar"
										accept={"image/*"}
										listType="picture-card"
										className="avatar-uploader"
										showUploadList={false}
										action={`${location.origin}/chatapi/file/upload`}
										data={{
											business_type:'avatar',
											user_id:JSON.parse(localStorage.getItem("user"))?.user_info?.id
										}}
										headers={{
											Authorization: `token ${JSON.parse(localStorage.getItem("user"))?.token}`
										}}
										beforeUpload={beforeUpload}
										onChange={_data => handleChange(_data)}
									>
										<div className="flex cursor-pointer relative"
										     style={{width:'62px',height:'62px'}}>
											{/*头像*/}
											<div className="w-full h-full rounded-full overflow-hidden outline-2 outline outline-white-divide">
												<img className="" src={imageUrl?imageUrl:DefaultAvatarSvg} alt="" style={{width:'100%',height:'100%'}}/>
											</div>
											{/*小图标*/}
											<div style={{width:'24px',height:'24px',border: '0.6px solid rgba(215,215,215,1)'}}
											     className={"bg-white rounded-full flex justify-center items-center absolute right-0 bottom-0"}>
												<CameraSvg/>
											</div>
										</div>
									</Upload>
								</Form.Item>
								{/*用户名*/}
								<Form.Item
									style={{marginTop:'8px'}}
									label="用户名"
									name="username"
									className={'label-height-38'}
									rules={[
										{ required: true, message: '请输入用户名' },
									]}
								>
									<Input disabled style={{height:'38px'}} placeholder={"请输入用户名"} autoComplete={"off"}/>
								</Form.Item>
								{/*昵称*/}
								<Form.Item
									// style={{marginTop:'8px'}}
									label="昵称"
									name="nickname"
									className={'label-height-38'}
									rules={[
										// { required: true, message: '请输入昵称' },
										{ max: 5, message: '昵称最长5个字符' }
									]}
								>
									<Input style={{height:'38px'}} placeholder={"请输入昵称"} autoComplete={"off"}/>
								</Form.Item>
								{/*性别*/}
								<Form.Item
									// style={{marginTop:'8px'}}
									label="性别"
									name="sex"
									className={'label-height-38'}
									rules={[{ required: true, message: '请选择性别'}]}
								>
									<Radio.Group options={[
										{ label: '男', value: 1 },
										{ label: '女', value: 0 },
									]}
									             style={{
																 height: '38px',
										             display: 'flex',
										             alignItems: 'center',
									             }}
									/>
								</Form.Item>
								{/*角色*/}
								{/*<Form.Item*/}
								{/*	label="角色"*/}
								{/*	name="role"*/}
								{/*	className={'label-height-38'}*/}
								{/*	rules={[{ required: true, message: '请输入角色'}]}*/}
								{/*>*/}
								{/*	<Input disabled style={{height:'38px'}} placeholder={"请输入角色"} autoComplete={"off"}/>*/}
								{/*</Form.Item>*/}
								{/*手机号*/}
								<Form.Item
									// style={{marginTop:'8px'}}
									label="手机号"
									name="mobile"
									className={'label-height-38'}
									rules={[
										{ required: true, message: '请输入手机号' },
										{ pattern: /^1[3456789]\d{9}$/, message: '手机格式不正确' }
									]}
								>
									<Input disabled style={{height:'38px'}} placeholder={"请输入手机号"} autoComplete={"off"}/>
								</Form.Item>
								{/*邮箱*/}
								<Form.Item
									// style={{marginTop:'8px'}}
									label="邮箱"
									name="email"
									className={'label-height-38'}
									rules={[
										{ required: true, message: '请输入邮箱' },
										{ pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' },
									]}
								>
									<Input style={{height:'38px'}} placeholder={"请输入邮箱"} autoComplete={"off"}/>
								</Form.Item>
								{/*机构名称*/}
								<Form.Item
									label="机构名称"
									name="organization"
									className={'label-height-38'}
									rules={[
										{ required: true, message: '请输入机构名称' },
										{ max: 30, message: '机构名称最长30个字符' },
									]}
								>
									<Input style={{height:'38px'}} placeholder={"请输入机构名称"} autoComplete={"off"}/>
								</Form.Item>
								{/*角色*/}
								{/*<Form.Item*/}
								{/*	label="角色"*/}
								{/*	name="role"*/}
								{/*	className={'label-height-38'}*/}
								{/*	rules={[{ required: true, message: '请选择角色'}]}*/}
								{/*>*/}
								{/*	<Select placeholder={'请选择角色'}*/}
								{/*	        disabled*/}
								{/*	        size={'large'}*/}
								{/*		// style={{height:'38px'}}*/}
								{/*		      options={[*/}
								{/*			      {label:'管理员',value:'admin'},*/}
								{/*			      {label:'用户',value:'user'}*/}
								{/*		      ]}*/}
								{/*	/>*/}
								{/*</Form.Item>*/}
							</div>
						</div>
						{/*按钮*/}
						{/*<div className={"w-full"} style={{height:'10vh'}}/>*/}
						{/*修改密码*/}
						<ButtonFifth click={clickChangePassword}
						             style={{width:'93px',height:'34px',marginLeft:'126px'}}
						             text={
							             <div className={"flex items-center"}>
								             <img src={ChangePasswordSvg} alt=""/>
								             <span className={""}>修改密码</span>
							             </div>
						             }
						/>
						<div className={"w-full"} style={{height:'12.9vh'}}/>
						<div className="w-full flex justify-center items-center">
							<ButtonMain className="mb-8"
							            style={{width:'386px',height:'44px',lineHeight:'14px'}}
							            text={'保存'}
							            click={null}/>
						</div>
					</Form>
				</Spin>
			</div>
			{/*弹框*/}
			<ChangePasswordModal title={'修改密码'}
			                     show={showChangePasswordModal}
			                     data={null}
			                     onOk={changePasswordModalOnOk}
			                     onCancel={changePasswordModalOnCancel}/>
		</div>
	)
}
