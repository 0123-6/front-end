import React, {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import {Form, Input, message, Spin, Upload} from "antd";
import ButtonMain from "../../components/ButtonMain";
import {handleKeyDownDisabled} from "../../utils/util";

// @ts-ignore
import {get, post} from "../../axios";
import NavigationComponent from "../../components/NavigationComponent";
import personSvg from "../../icon/person.jpg";
import CameraSvg from "./icon/CameraSvg";

export default function UserCenter(props) {
	const [form] = Form.useForm();
	// 获取用户信息
	const userInfo = JSON.parse(localStorage.getItem('userInfo'))
	console.log(props)
	// state
	const history = useHistory();
	// @ts-ignore
	const [isLoading,setIsLoading] = useState(false)
	// @ts-ignore
	const [imageUrl,setImageUrl] = useState('')

	// mounted
	useEffect(() => {
		setIsLoading(true)
		form.setFieldsValue(userInfo)
		if (userInfo.avatar) {
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
		await post(`/drapi/user/users/${nowValue.id}`, params)
		message.success('更新个人信息成功')
		// 更新localStorage
		localStorage.setItem('userInfo',JSON.stringify(params))

		// 更新header
		// 根据id获取avatar1，并将src修改为params.avatar
		const avatar1 = document.getElementById('avatar1')
		if (avatar1) {
			avatar1.setAttribute('src',params.avatar)
		}
		// 根据id获取avatar2，并将src修改为params.avatar
		const avatar2 = document.getElementById('avatar2')
		if (avatar2) {
			avatar2.setAttribute('src',params.avatar)
		}
		// 根据id获取nickname1，并将innerText修改为params.nickname
		const nickname1 = document.getElementById('nickname1')
		if (nickname1) {
			nickname1.innerText = params.nickname
		}
		// 根据id获取nickname2，并将innerText修改为params.nickname
		const nickname2 = document.getElementById('nickname2')
		if (nickname2) {
			nickname2.innerText = params.nickname
		}
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
		<div className="w-full flex flex-col items-center bg">
			<NavigationComponent data={[
				{label:'个人中心',disabled:true},
			]}/>
			{/*主体内容*/}
			<div className="pb-8 flex flex-col bg-white pt-6 pl-8 pr-8 shadow-card rounded mb-16 label-width-136"
			     style={{width: '960px'}}>
				{/*内容部分*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					<Form form={form}
					      onFinish={clickOk}
					      onKeyDown={handleKeyDownDisabled}
					>
						<div className={"flex flex-col"}
						     style={{width:'866px'}}>
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
										action={`http://${location.host}/drapi/file/upload`}
										data={{
											business_type:'avatar',
											user_id:JSON.parse(localStorage.getItem("userInfo")).id
										}}
										headers={{
											Authorization: `token ${localStorage.getItem("token")}`
										}}
										beforeUpload={beforeUpload}
										onChange={_data => handleChange(_data)}
									>
										<div className="flex cursor-pointer relative"
										     style={{width:'62px',height:'62px'}}>
											{/*头像*/}
											<div className="w-full h-full rounded-full overflow-hidden outline-2 outline outline-white-divide">
												<img className="" src={imageUrl?imageUrl:personSvg} alt="" style={{width:'100%',height:'100%'}}/>
											</div>
											{/*小图标*/}
											<div style={{width:'24px',height:'24px',border: '0.6px solid rgba(215,215,215,1)'}}
											     className={"bg-white rounded-full flex justify-center items-center absolute right-0 bottom-0"}>
												<CameraSvg/>
											</div>
										</div>
									</Upload>
								</Form.Item>
								{/*昵称*/}
								<Form.Item
									style={{marginTop:'8px'}}
									label="昵称"
									name="nickname"
									className={'label-height-38'}
									rules={[
										{ required: true, message: '请输入昵称' },
										{ max: 5, message: '昵称最长5个字符' }
									]}
								>
									<Input style={{height:'38px'}} placeholder={"请输入昵称"} autoComplete={"off"}/>
								</Form.Item>
								{/*角色*/}
								<Form.Item
									label="角色"
									name="role_name"
									className={'label-height-38'}
									rules={[{ required: true, message: '请输入角色'}]}
								>
									<Input disabled style={{height:'38px'}} placeholder={"请输入角色"} autoComplete={"off"}/>
								</Form.Item>
								{/*手机号*/}
								<Form.Item
									style={{marginTop:'8px'}}
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
									style={{marginTop:'8px'}}
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
								{/*注册时间*/}
								<Form.Item
									style={{marginTop:'8px'}}
									label="注册时间"
									name="date_joined"
									className={'label-height-38'}
									rules={[{ required: true, message: '请输入注册时间' }]}
								>
									<Input disabled style={{height:'38px'}} placeholder={"请输入注册时间"} autoComplete={"off"}/>
								</Form.Item>
								{/*个人简介*/}
								<Form.Item
									label="个人简介"
									name="description"
									className={'label-height-38'}
									rules={[{ required: true, message: '请输入个人简介' }]}
								>
									<Input.TextArea showCount maxLength={200}
									                style={{height:'185px'}}
									                onKeyDown={e => e.stopPropagation()}
									                placeholder={'请输入个人简介'}/>
								</Form.Item>
							</div>
						</div>
						{/*按钮*/}
						<div className={"w-full"} style={{height:'10vh'}}/>
						<div className="w-full flex justify-center items-center">
							{/*<ButtonSecond style={{width:'61px',height:'32px',lineHeight:'14px'}}*/}
							{/*              text={'取消'}*/}
							{/*              click={e=>goBack(e)}/>*/}
							<ButtonMain className=""
							            style={{width:'133px',height:'32px',lineHeight:'14px'}}
							            text={'更新个人信息'}
							            click={null}/>
						</div>
					</Form>
				</Spin>
			</div>
		</div>
	)
}
