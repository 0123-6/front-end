import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {Form, Input, message, Radio, Select, Spin, Upload} from "antd";
import {handleKeyDownDisabled, updateUser} from "../../utils/util";
import CameraSvg from "../../view/user-center/icon/CameraSvg";
import DefaultAvatarSvg from "../../icon/DefaultAvatarSvg.svg";
import { post } from "../../axios";
import NavigationComponent from "../../components/NavigationComponent";
import ButtonMain from "../../components/ButtonMain";
import ButtonFifth from "../../components/ButtonFifth";
import ChangePasswordSvg from './icon/ChangePasswordSvg.svg'
import ChangePasswordModal from "./components/ChangePasswordModal";

export default function UserCenter() {
	// state
	// @ts-ignore
	const history = useHistory();
	const [form] = Form.useForm();
	const [isLoading,setIsLoading] = useState(false)
	// @ts-ignore
	const [imageUrl,setImageUrl] = useState('')
	const [showChangePasswordModal,setShowChangePasswordModal] = useState(false)
	// 获取用户信息
	const userInfo = JSON.parse(localStorage.getItem('user'))?.user_info
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
	// 确认按钮,更新个人信息
	const clickOk = async () => {
		const nowValue = form.getFieldsValue(true)
		const params = {
			...nowValue,
			avatar:imageUrl,
			user_id: userInfo.id,
		}
		const {data} = await post('/oam/user', params)
		message.success('更新个人信息成功')
		// 更新localStorage
		const user = JSON.parse(localStorage.getItem('user'))
		const newUser = {
			...user,
			user_info: data,
		}
		localStorage.setItem('user',JSON.stringify(newUser))
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
		const res = await post('/oam/user/pwd/reset',params)
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
		<div className={"w-full bg-[#f6f8fc] flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '个人中心', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"flex-1 w-full pb-[140px] pt-6 pl-8 pr-8 label-width-136 flex flex-col rounded-lg bg-white"}>
				{/*加载效果*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{/*最外层*/}
					<div className={"w-full flex flex-col"}>
						<span className={"text-base font-medium mb-[3.8vh]"}>个人中心</span>
						<Form form={form}
						      onFinish={clickOk}
						      onKeyDown={handleKeyDownDisabled}
						>
							<div className={"flex flex-col"}
							     style={{width:'740px'}}>
								{/*基本信息*/}
								<div className={"w-full flex flex-col"}>
									{/*头像*/}
									<Form.Item
										className={'label-height-62'}
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
											     style={{width:'64px',height:'64px'}}>
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
									{/*联系方式*/}
									<Form.Item
										label="联系方式"
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
									<Form.Item
										label="角色"
										name="role"
										className={'label-height-38'}
										rules={[{ required: true, message: '请选择角色'}]}
									>
										<Select placeholder={'请选择角色'}
										        disabled
										        size={'large'}
											// style={{height:'38px'}}
											      options={[
												      {label:'管理员',value:'admin'},
												      {label:'用户',value:'user'}
											      ]}
										/>
									</Form.Item>
									{/*邮箱*/}
									{/*<Form.Item*/}
									{/*	label="邮箱"*/}
									{/*	name="email"*/}
									{/*	className={'label-height-38'}*/}
									{/*	rules={[*/}
									{/*		{ required: true, message: '请输入邮箱' },*/}
									{/*		{ pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' },*/}
									{/*	]}*/}
									{/*>*/}
									{/*	<Input style={{height:'38px'}} placeholder={"请输入邮箱"} autoComplete={"off"}/>*/}
									{/*</Form.Item>*/}
									{/*/!*注册时间*!/*/}
									{/*<Form.Item*/}
									{/*	label="注册时间"*/}
									{/*	name="date_joined"*/}
									{/*	className={'label-height-38'}*/}
									{/*	rules={[{ required: true, message: '请输入注册时间' }]}*/}
									{/*>*/}
									{/*	<Input disabled style={{height:'38px'}} placeholder={"请输入注册时间"} autoComplete={"off"}/>*/}
									{/*</Form.Item>*/}
									{/*个人简介*/}
									{/*<Form.Item*/}
									{/*	label="个人简介"*/}
									{/*	name="description"*/}
									{/*	className={'label-height-38'}*/}
									{/*	rules={[{ required: true, message: '请输入个人简介' }]}*/}
									{/*>*/}
									{/*	<Input.TextArea showCount maxLength={200}*/}
									{/*	                style={{height:'185px'}}*/}
									{/*	                onKeyDown={e => e.stopPropagation()}*/}
									{/*	                placeholder={'请输入个人简介'}/>*/}
									{/*</Form.Item>*/}
								</div>
							</div>
							{/*按钮*/}
							{/*修改密码*/}
							<ButtonFifth click={clickChangePassword}
							             style={{width:'93px',height:'34px',marginLeft:'136px'}}
							             text={
															<div className={"flex items-center"}>
																<img src={ChangePasswordSvg} alt=""/>
																<span className={""}>修改密码</span>
															</div>
													 }
							/>
							<div className={"w-full"} style={{height:'16px'}}/>
							<div className="w-full pl-[136px] flex items-center">
								<ButtonMain className=""
								            style={{width:'386px',height:'44px',lineHeight:'14px'}}
								            text={'更新信息'}
								            click={null}/>
							</div>
						</Form>
					</div>
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
