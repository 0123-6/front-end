import React, {useEffect, useState} from "react"
import logo2 from "../../icon/logo2.svg"
import chatSvg from "../../icon/chatSvg.svg"
import chatLightSvg from "../../icon/chatLightSvg.svg"
import searchSvg from "../../icon/searchSvg.svg"
import searchLightSvg from "../../icon/searchLightSvg.svg"
import RegisterModal from "../components/RegisterModal";
import {message} from "antd";
import {get, post } from "../../axios";
import LoginModal from "../components/LoginModal";
import {useHistory} from "react-router-dom";
import bg2Top from "../../icon/bg2Top.png";
import UserComponent from "../../view_oam/layout/components/UserComponent";

const modeList = [
	{
		key: 'chat',
		text: '对话',
		icon: chatSvg,
		activeIcon: chatLightSvg,
		route: '/chat',
	},
	{
		key: 'search',
		text: '搜索',
		icon: searchSvg,
		activeIcon: searchLightSvg,
		route: '/search',
	}
]

export default function MyHeader() {
	// state
	// @ts-ignore
	const history = useHistory();
	// 用户信息
	const [userInfo,setUserInfo] = useState(null)
	// 政策库信息
	const [policyInfo,setPolicyInfo] = useState(null)
	// 展示注册弹框
	const [showRegisterModal,setShowRegisterModal] = useState(false)
	// 展示登录弹框
	const [showLoginModal,setShowLoginModal] = useState(false)
	// 模式，对话/搜索
	const [mode, setMode] = useState(null)
	// mounted
	useEffect(()=>{
		const oldUser = JSON.parse(localStorage.getItem('user') || 'null')
		if(oldUser){
			setUserInfo(oldUser?.user_info)
		} else {
			history.replace('/login')
		}
		return () => {
			setUserInfo(null)
		}
	},[])
	useEffect(()=>{
		const mode = location.pathname.split('/')[1]
		if(mode) {
			setMode(mode)
		}
	}, [location.pathname])
	useEffect(()=>{
		getPolicyInfo()
	},[])
	// methods
	// get政策库信息
	const getPolicyInfo = async () => {
		const {data} = await get('/chat/city/config')
		setPolicyInfo(data)
	}
	// 注册弹框确认
	const registerModalOnOk = async (_data) => {
		await post('/user/signup',_data)
		message.success('注册成功')
		setShowRegisterModal(false)
		setShowLoginModal(true)
	}
	// 注册弹框取消
	const registerModalOnCancel = () => {
		setShowRegisterModal(false)
	}
	// 登录弹框确认
	const loginModalOnOk = async (_data) => {
		console.log('into loginModalOnOk, _data: ', _data)
		const {data} = await post('/user/signin', _data)
		message.success('登录成功')
		setShowLoginModal(false)
		if(!data?.user_info?.avatar) {
			data.user_info.avatar = location.protocol + '//minio.model-hubs.cn/web-static/avatar/202306/ykTCbx1Ql9.jpg'
		}
		setUserInfo(data?.user_info)
		localStorage.setItem('user', JSON.stringify(data))
		location.reload()
	}
	// 登录弹框取消
	const loginModalOnCancel = () => {
		setShowLoginModal(false)
	}
	const changeMode = (item) => {
		setMode(item.key)
		history.replace(item.route)
	}
	// render
	return (
		//最外层
		<div className={"flex-shrink-0 flex justify-between fixed top-0 z-50 bg-cover"}
		     style={{
					 width: 'calc(100% - 5px)',
			     minWidth: '880px',
			     backgroundImage: `url(${bg2Top})`,
		}}>
			{/*左*/}
			<div className={"self-start mt-[25px] pl-9 flex items-center"}>
				{/*icon*/}
				<img src={logo2} alt="" style={{marginRight: '82px'}}/>
				{
					modeList.map((item,index)=>(
						<div key={index}
						     className={`h-[34px] flex items-center cursor-pointer border-b-2 ${mode===item.key?'border-main':'border-[#edf3fe]'} ${index===1?'ml-[52px]':''}`}
						     onClick={()=>changeMode(item)}
						>
							{/*icon*/}
							<img src={mode===item.key?item.activeIcon:item.icon} alt=""/>
							{/*text*/}
							<span className={`ml-2 flex items-center ${mode===item.key?'text-main font-medium':''}`}>{item.text}</span>
						</div>
					))
				}
			</div>
			{/*右*/}
			<div className={"flex items-center"}>
				{/*政策库*/}
				<div className={"mt-10 mr-[40px] flex items-center"}>
					<span className={"flex items-center"}>当前政策库：{policyInfo?.from_name}</span>
				</div>
				{/*头像区域*/}
				{
					userInfo &&
					<div className="mt-10 mr-[40px] h-full flex items-center">
						<UserComponent/>
					</div>
				}
			</div>
			{/*注册弹框*/}
			<RegisterModal title={'注册'}
			               show={showRegisterModal}
			               data={null}
			               onOk={registerModalOnOk}
			               onCancel={registerModalOnCancel}/>
			{/*登录弹框*/}
			<LoginModal title={'登录'}
			            show={showLoginModal}
			            data={null}
			            onOk={loginModalOnOk}
			            onCancel={loginModalOnCancel}/>
		</div>
	)
}
