import personSvg from "../../../icon/DefaultAvatarSvg.svg"
import {Popover} from "antd";
import {CaretDownOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom'
import UserSvg from './icon/UserSvg.svg'
import QuitSvg from './icon/QuitSvg.svg'
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";

interface IPropsContent {
	userInfo: any,
	newTab?: boolean;
	setShowPopover: (showPopover: boolean) => void;
}

const PopoverContent = (props:IPropsContent) => {
	// @ts-ignore
	const {userInfo,newTab=false,setShowPopover} = props
	const history = useHistory()
	const [showQuitModal,setShowQuitModal] = useState(false)
	// methods
	const logout = () => {
		setShowPopover(false)
		setShowQuitModal(true)
	}
	const goPersonCenter = () => {
		setShowPopover(false)
		// 判断是否是oam
		const pathname = location.pathname
		if (pathname.includes('/oam')) {
			history.push('/oam/user-center')
		} else {
			history.push('/user-center')
		}
	}
	// 退出登录
	const quitModalOnOk = () => {
		setShowQuitModal(false)
		localStorage.removeItem('user')
		// 判断是否是oam
		const pathname = location.pathname
		if (pathname.includes('/oam')) {
			history.replace('/oam/login')
		} else {
			history.replace('/login')
		}
	}
	const quitModalOnCancel = () => {
		setShowQuitModal(false)
	}
	return (
		<div className={"bg-white rounded-2xl flex flex-col"}
		     style={{
			     width:'211px',
			     height:'95px',
			     border: '1px solid rgba(240,240,240,1)',
			     boxShadow: '0px 2px 8px 0px rgba(217,222,238,0.35)',
		     }}>
			<div className={"mt-3 w-full flex flex-col"}>
				{/*个人中心*/}
				<div className={"w-full flex items-center pl-[21px] text-sm hover:cursor-pointer hover:bg-[#F7F7F7] group"}
				     style={{height:'36px',borderRadius: '1px',lineHeight:'14px'}} onClick={goPersonCenter}>
					<img src={UserSvg} alt=""/>
					<span className={"ml-1.5 group-hover:font-medium"}>个人中心</span>
				</div>
				{/*退出*/}
				<div className={"w-full flex items-center pl-[21px] text-sm hover:cursor-pointer hover:bg-[#F7F7F7] group"}
				     style={{height:'36px',borderRadius: '1px',lineHeight:'14px'}} onClick={logout}>
					<img src={QuitSvg} alt=""/>
					<span className="ml-1.5 group-hover:font-medium">退出</span>
				</div>
			</div>
			{/*退出弹框*/}
			<DraggableModalPrompt
				show={showQuitModal}
				onOk={quitModalOnOk}
				onCancel={quitModalOnCancel}>
				<span className="flex items-center">是否退出登录？</span>
			</DraggableModalPrompt>
		</div>
	)
}

export default function UserComponent(props:{newTab?:boolean})  {
	// state
	const {newTab=false} = props
	// 用户信息
	const [userInfo,setUserInfo] = useState(null)
	const [showPopover,setShowPopover] = useState(false)
	// effect
	// 获取用户信息
	useEffect(()=>{
		const data = JSON.parse(localStorage.getItem('user'))?.user_info
		setUserInfo(data)
	},[])
	// methods
	const handleOpenChange = (newOpen: boolean) => {
		setShowPopover(newOpen);
	};
	// render
	return (
		<Popover title={null}
		         style={{background:'yellow'}}
		         overlayClassName={'person-popover'}
		         trigger="hover"
		         open={showPopover}
		         onOpenChange={handleOpenChange}
		         content={PopoverContent({userInfo,newTab,setShowPopover})}
		>
			{/*头像区域*/}
			<div className={"h-full flex items-center"}>
				{/*头像*/}
				<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
				     style={{width:'32px',height:'32px'}}>
					<img className="avatar" src={userInfo?.avatar ? userInfo?.avatar : personSvg} alt="" style={{width:'100%',height:'100%'}}/>
				</div>
				{/*昵称*/}
				<span className="nickname ml-2 text-sm text-black font-semibold">{(userInfo?.nickname) ? (userInfo?.nickname) : (userInfo?.mobile)}</span>
				<CaretDownOutlined style={{color:'#b7b7b7'}}/>
			</div>
		</Popover>
	)
}
