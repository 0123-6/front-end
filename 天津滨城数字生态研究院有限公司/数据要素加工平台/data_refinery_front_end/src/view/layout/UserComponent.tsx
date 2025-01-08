import personSvg from "../../icon/person.jpg";
import {Popover} from "antd";
import {CaretDownOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom'

interface IPropsContent {
	userInfo: any,
	newTab?: boolean;
	setShowPopover: (showPopover: boolean) => void;
}

const PopoverContent = (props:IPropsContent) => {
	const {userInfo,newTab=false,setShowPopover} = props
	const history = useHistory()
	const logout = () => {
		setShowPopover(false)
		localStorage.removeItem('token')
		history.push('/login')
	}
	const goPersonCenter = () => {
		setShowPopover(false)
		if(newTab){
			window.open(location.origin+'/user-center')
		} else {
			history.push('/user-center')
		}
	}
	return (
		<div className={"bg-white rounded flex flex-col"}
		     style={{
			     width:'211px',
			     height:'180px',
			     border: '1px solid rgba(240,240,240,1)',
			     boxShadow: '0px 1px 13px 0px rgba(226,226,226,0.5)'}}>
			{/*上*/}
			<div className={"mt-3 w-full pl-4 pr-4 flex"}>
				{/*头像*/}
				<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
				     style={{width:'48px',height:'48px'}}>
					<img id='avatar2' src={userInfo?.avatar?userInfo?.avatar:personSvg} alt="" style={{width:'100%',height:'100%'}}/>
				</div>
				{/*右侧*/}
				<div className={"ml-3 flex flex-col"}>
					{/*账号*/}
					<div id='nickname2' className="mt-1.5 flex text-sm font-medium" style={{lineHeight:'14px'}}>{(userInfo?.nickname)?(userInfo?.nickname):(userInfo?.mobile)}</div>
					{/*角色*/}
					<div className="mt-2.5 pl-2 pr-2 flex justify-center items-center text-sm rounded-xl text-black-light"
					     style={{height:'24px',lineHeight:'14px',background: '#EEEEEE',}}>
						{userInfo?.role_name}
					</div>
				</div>
			</div>
			{/*下*/}
			<div className={"mt-3 w-full flex flex-col"}>
				{/*个人中心*/}
				<div className={"w-full flex items-center pl-4 text-sm hover:cursor-pointer hover:bg-white-bg-person"}
				     style={{height:'32px',borderRadius: '1px',lineHeight:'14px'}} onClick={goPersonCenter}>
					个人中心
				</div>
				{/*退出*/}
				<div className={"mt-2 w-full flex items-center pl-4 text-sm hover:cursor-pointer hover:bg-white-bg-person"}
				     style={{height:'32px',borderRadius: '1px',lineHeight:'14px'}} onClick={logout}>
					退出
				</div>
			</div>
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
		const data = JSON.parse(localStorage.getItem('userInfo'))
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
				     style={{width:'36px',height:'36px'}}>
					<img id='avatar1' className="" src={userInfo?.avatar?userInfo?.avatar:personSvg} alt="" style={{width:'100%',height:'100%'}}/>
				</div>
				{/*昵称*/}
				<span id='nickname1' className="ml-2 text-sm text-black font-semibold">{(userInfo?.nickname)?(userInfo?.nickname):(userInfo?.mobile)}</span>
				<CaretDownOutlined style={{color:'#b7b7b7'}}/>
			</div>
		</Popover>
	)
}
