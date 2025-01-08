import React, {useEffect, useState} from "react";
import NavigationComponent from "../../../../components/NavigationComponent";
import AuthorityManagementSvg from "../../../layout/icon/AuthorityManagementSvg";
import ButtonFifth from "../../../../components/ButtonFifth";
import TypeList from "../../../../components/TypeList";
import DetailModel from "./detail-model";
import DetailData from "./detail-data";
import DetailConfig from "./detail-config";
import {message, Spin} from "antd";
import DraggableModalPrompt from "../../../../components/draggable-modal/draggable-modal-prompt";
import SetDeadlineModal from "../components/SetDeadlineModal";

export default function UserManagementDetail(props) {
	// state
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)
	const menuList = ['模型','数据','资源配置']
	const [menu,setMenu] = useState('')
	// 弹框
	const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
	const [showSetDeadlineModal, setShowSetDeadlineModal] = useState(false);
	// mounted
	useEffect(()=>{
		setMenu('模型')
		getData()
	},[])
	// methods
	const changeMenu = (value) => {
		setMenu(value + '')
	}
	const getFalseData = async (_params) => {
		return new Promise<any>((resolve, _reject) => {
			setTimeout(() => {
				const userInfo = JSON.parse(localStorage.getItem('selectedItem') || '{}' )
				const res = {
					code: '200',
					data: userInfo,
				}
				resolve(res)
			}, 200)
		})
	}
	const getData = async () => {
		const params = {
			id: Number(props.match.params.id)
		}
		setLoading(true)
		// const {data} = await get(`/drapi/oam/user/${params.id}`)
		const {data} = await getFalseData(params)
		setData(data)
		setLoading(false)
	}
	// 弹框
	const resetPasswordModalOnOk = () => {
		// 发送网络请求
		message.success('重置密码成功')
		getData()
		setShowResetPasswordModal(false)
	}
	const resetPasswordModalOnCancel = () => {
		setShowResetPasswordModal(false)
	}
	const setDeadlineModalOnOk = (_data) => {
		// 发送请求
		message.success('设置期限成功')
		getData()
		setShowSetDeadlineModal(false)
	}
	const setDeadlineModalOnCancel = () => {
		setShowSetDeadlineModal(false)
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '权限管理', iconSvg: AuthorityManagementSvg, disabled: true},
					{label: '用户管理', router: '/oam/authority-management/user-management',disabled: false},
					{label: '查看详情', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pb-6 flex flex-col rounded-lg"}>
				{/*上面*/}
				{
					<Spin spinning={loading} size="default" tip="加载中...">
						<div className={"h-[19.6vh] min-h-[200px] flex flex-col pl-8 pr-8"}
						     style={{
							     backgroundImage: 'linear-gradient(90deg, #FBFFFF 0%, #FFFFFF 70%)',
							     borderRadius: '8px 8px 0px 0px',
						     }}>
							<span className="mt-[2.2vh] text-base leading-4 font-medium">查看</span>
							{/*头像*/}
							<div className={"mt-[1.8vh] flex"}>
								<img src={data?.avatar} alt="" style={{width: '56px',height: '56px',borderRadius:'5000px'}}/>
								<div className={"h-[56px] ml-[11px] flex flex-col justify-between"}>
									<span className={"text-base leading-4 text-black-dark font-medium"}>{data?.nickname}</span>
									<div className="w-[97px] h-[24px] flex justify-center items-center bg-[#EEEEEE] rounded-xl">
										<span className={"text-sm leading-[14px] text-black-light"}>{data?.role_name}</span>
									</div>
								</div>
							</div>
							{/*第一行属性*/}
							<div className="mt-[3.05vh] flex items-center text-base leading-4">
								<div className={"w-1/4 flex items-center"}>
									<span>账号/手机号：{data?.mobile}</span>
								</div>
								<div className={"w-1/4 flex items-center"}>
									<span>密码：******</span>
									<ButtonFifth text={'重置密码'} click={()=>setShowResetPasswordModal(true)} style={{width:'90px',height:'26px'}} className={"ml-[17px]"}/>
								</div>
								<div className={"w-1/2 flex items-center"}>
									<span>单位：{data?.company}</span>
								</div>
							</div>
							{/*第2行属性*/}
							<div className="mt-[18px] flex items-center text-base leading-4">
								<div className={"w-1/4 flex items-center"}>
									<span>邮箱：{data?.email}</span>
								</div>
								<div className={"w-1/4 flex items-center"}>
									<span>创建时间：{data?.created_at}</span>
								</div>
								<div className={"w-1/2 flex items-center"}>
									<span className={"text-hidden"}>到期时间：{data?.finished_at}</span>
									<ButtonFifth text={'设置期限'} click={()=>setShowSetDeadlineModal(true)} style={{width:'90px',height:'26px'}} className={"ml-3"}/>
								</div>
							</div>
						</div>
					</Spin>
				}
				{/*下面*/}
				<div className={"mt-4 flex flex-col pl-8 pr-8"}>
					{/*选项菜单栏*/}
					<TypeList list={menuList} value={menu} change={changeMenu} showLine={false}/>
					{menu === '模型' && <DetailModel/>}
					{menu === '数据' && <DetailData/>}
					{menu === '资源配置' && <DetailConfig/>}
				</div>
			</div>
			{/*重置密码弹框*/}
			<DraggableModalPrompt
				show={showResetPasswordModal}
				onOk={resetPasswordModalOnOk}
				onCancel={resetPasswordModalOnCancel}>
				<span className="text-sm text-black">账号 <span className="text-main pl-1 pr-1">{data?.mobile}</span>确定要重置密码吗？</span>
			</DraggableModalPrompt>
			{/*设置期限*/}
			<SetDeadlineModal title={'设置期限'}
			                  show={showSetDeadlineModal}
			                  data={null}
			                  onOk={setDeadlineModalOnOk}
			                  onCancel={setDeadlineModalOnCancel}/>
		</div>
	)
}
