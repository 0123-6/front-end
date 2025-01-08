import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import { get, post } from "../../../axios";
import NavigationComponent from "../../../components/NavigationComponent";
import {Form, Input, message, Radio, Select, Spin, Upload} from "antd";
import {handleKeyDownDisabled} from "../../../utils/util";
import ButtonMain from "../../../components/ButtonMain";
import CameraSvg from "../../../view/user-center/icon/CameraSvg";
import DefaultAvatarSvg from "../../../icon/DefaultAvatarSvg.svg";

export default function UserManagementEdit(props) {
	// state
	// @ts-ignore
	const history = useHistory();
	const [form] = Form.useForm();
	const [isLoading,setIsLoading] = useState(false)
	// @ts-ignore
	const [imageUrl,setImageUrl] = useState('')
	// mounted
	useEffect(() => {
		getData()
	}, [])
	// methods
	const getData = async () => {
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		const {data} = await get(`/oam/user/${params.id}`)
		if (data?.avatar) {
			setImageUrl(data.avatar)
		}
		form.setFieldsValue(data)
		setIsLoading(false)
	}
	// 确认按钮,更新个人信息
	const clickOk = async () => {
		const nowValue = form.getFieldsValue(true)
		const params = {
			...nowValue,
			avatar:imageUrl,
			user_id: Number(props.match.params.id)
		}
		await post('/oam/user', params)
		message.success('编辑用户信息成功')
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
	// render
	return (
		// 最外层
		<div className={"w-full bg-[#f6f8fc] flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '用户管理', router: '/oam/user-management'},
					{label: '用户编辑', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"flex-1 w-full pb-[140px] pt-6 pl-8 pr-8 label-width-136 flex flex-col rounded-lg bg-white"}>
				{/*加载效果*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{/*最外层*/}
					<div className={"w-full flex flex-col"}>
						<span className={"text-base font-medium mb-[3.8vh]"}>编辑</span>
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
							<div className={"w-full"} style={{height:'16px'}}/>
							<div className="w-full pl-[136px] flex items-center">
								{/*<ButtonSecond style={{width:'61px',height:'32px',lineHeight:'14px'}}*/}
								{/*              text={'取消'}*/}
								{/*              click={e=>goBack(e)}/>*/}
								<ButtonMain className=""
								            style={{width:'104px',height:'36px',lineHeight:'14px'}}
								            text={'保存'}
								            click={null}/>
							</div>
						</Form>
					</div>
				</Spin>
			</div>
		</div>
	)
}
