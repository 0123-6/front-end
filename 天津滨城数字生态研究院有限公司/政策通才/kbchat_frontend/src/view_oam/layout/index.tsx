import React, {useEffect, useRef, useState} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import { useHistory } from 'react-router-dom';
import logoPng from "../../icon/logo2.svg";
import {Menu, MenuProps, message} from "antd";
import RecordArea from "../../view/layout/RecordArea";
import QuestionManagementSvg from "./icon/QuestionManagementSvg";
import PolicyHouseSvg from "./icon/PolicyHouseSvg";
import UsageManagementSvg from "./icon/UsageManagementSvg";
import PedigreeManagementSvg from "./icon/PedigreeManagementSvg";
import SessionManagement from "../question-management/session-management";
import QuestionManagement from "../question-management/question-management";
import PolicyLibrary from "../policy-library";
import UserManagement from "../user-management";
import SystemManagement from "../system-management";
import SessionManagementDetail from "../question-management/session-management/detail";
import QuestionManagementDetail from "../question-management/question-management/detail";
import PolicyLibraryList from "../policy-library/list";
import PolicyLibraryListDetail from "../policy-library/list/detail";
import UserManagementDetail from "../user-management/detail";
import UserManagementEdit from "../user-management/edit";
import UserComponent from "./components/UserComponent";
import UserCenter from "../user-center";

export default function LayoutOam() {
	// state
	const history = useHistory();
	const layoutOamRef = useRef(null);
	const [items, setItems] = useState<MenuProps['items']>([]);
	const [defaultOpenKeys,setDefaultOpenKeys] = useState<any[]>([]);
	const [defaultSelectedKeys,setDefaultSelectedKeys] = useState<any[]>([]);
	const allItems:MenuProps['items'] = [
		{
			label: '问题管理',
			key: '/oam/question-management',
			icon: <QuestionManagementSvg/>,
			children: [
				//会话管理
				{ label: '会话管理', key: '/oam/question-management/session-management' },
				//问题管理
				{ label: '问题管理', key: '/oam/question-management/question-management' },
			],
		},
		{
			label: '政策库',
			key: '/oam/policy-library',
			icon: <PolicyHouseSvg/>,
		},
		{
			label: '用户管理',
			key: '/oam/user-management',
			icon: <UsageManagementSvg/>,
		},
		{
			label: '系统管理',
			key: '/oam/system-management',
			icon: <PedigreeManagementSvg/>,
		},
	];
	// mounted
	useEffect(() => {
		setItems(allItems);
		const pathname = location.pathname;
		// 是否找到匹配的
		let isFind = false;
		for(let i=0;i<allItems.length;i++) {
			// 判断本级是否符合
			// @ts-ignore
			if(pathname.indexOf(allItems[i].key) !== -1) {
				isFind = true;
				setDefaultOpenKeys([allItems[i].key]);
				setDefaultSelectedKeys([allItems[i].key])
			}
			// @ts-ignore
			if(allItems[i].children) {
				// @ts-ignore
				for(let j=0;j<allItems[i].children.length;j++) {
					// @ts-ignore
					if(pathname.indexOf(allItems[i].children[j].key) !== -1) {
						isFind = true;
						setDefaultOpenKeys([allItems[i].key]);
						// @ts-ignore
						setDefaultSelectedKeys([allItems[i].children[j].key])
					}
				}
			}
		}
		if(!isFind) {
			setDefaultOpenKeys(['/oam/question-management']);
			setDefaultSelectedKeys(['/oam/question-management/session-management']);
		}
		//修改title为OAM-政策通才
		if(document.title !== 'OAM-政策通才') {
			document.title = 'OAM-政策通才';
		}
	}, []);
	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem('user') || 'null')?.user_info
		if(!userInfo || userInfo?.role !== 'admin') {
			message.error('您没有权限访问该页面')
			history.replace('/oam/login')
			return
		}
		layoutOamRef.current.scrollTo(0, 0);
	}, [location.pathname]);
	// methods
	// 点击菜单
	const onClickMenu = ({key}) => {
		if(location.pathname !== key) {
			history.push(key)
		}
	}
	const clickLogo = () => {
		// history.push('/oam')
	}
	// render
	return (
		<div className="w-screen min-w-[350px] h-screen bg-white flex flex-col overflow-auto">
			{/*头部区域*/}
			<div className={"w-full h-[60px] min-h-[60px] flex justify-between items-center"}>
				{/*左*/}
				<div className={"w-[192px] h-full flex justify-center items-center border-r border-[#f1f1f1]"}>
					{/*左logo*/}
					<img src={logoPng} width="132px" height="34px" alt=''
					     className={"cursor-pointer"} onClick={clickLogo}/>
				</div>
				{/*右*/}
				<div className="mr-11 h-full flex">
					<UserComponent/>
				</div>
			</div>
			{/*内容区域*/}
			<div className={"w-full flex"} style={{height:'calc(100% - 60px)'}}>
				{/*左侧菜单*/}
				<div className="w-[192px] h-full flex flex-col overflow-auto pt-[15px]"
				     style={{
							 borderRight:'1px solid #f1f1f1',
					     borderTop: '1px solid #fafafa',
				}}>
					{
						defaultSelectedKeys.length>0 &&
						<Menu
							defaultOpenKeys={defaultOpenKeys}
							defaultSelectedKeys={defaultSelectedKeys}
							mode="inline"
							items={items}
							onClick={onClickMenu}
						/>
					}
				</div>
				{/*右侧内容*/}
				<div id='layoutOamRef'
				     ref={layoutOamRef}
				     className="flex-1 h-full bg-[#f6f8fc] flex overflow-auto overflow-y-scroll">
					<div className={"w-full min-w-[1008px] min-h-full flex flex-col pl-4 pr-4"}>
						{/*内容区域*/}
						<div className="w-full flex-1 flex">
							<Switch>
								{/*个人中心*/}
								<Route path="/oam/user-center" component={UserCenter}/>
								{/*会话管理详情*/}
								<Route path="/oam/question-management/session-management/detail/:id" component={SessionManagementDetail}/>
								{/*会话管理*/}
								<Route path="/oam/question-management/session-management" component={SessionManagement}/>
								{/*问题管理详情*/}
								<Route path="/oam/question-management/question-management/detail/:id" component={QuestionManagementDetail}/>
								{/*问题管理*/}
								<Route path="/oam/question-management/question-management" component={QuestionManagement}/>
								{/*政策库列表详情*/}
								<Route path="/oam/policy-library/list/:city/detail/:id" component={PolicyLibraryListDetail}/>
								{/*政策库列表*/}
								<Route path="/oam/policy-library/list/:city" component={PolicyLibraryList}/>
								{/*政策库*/}
								<Route path="/oam/policy-library" component={PolicyLibrary}/>
								{/*用户管理编辑*/}
								<Route path="/oam/user-management/edit/:id" component={UserManagementEdit}/>
								{/*用户管理详情*/}
								<Route path="/oam/user-management/detail/:id" component={UserManagementDetail}/>
								{/*用户管理*/}
								<Route path="/oam/user-management" component={UserManagement}/>
								{/*系统管理*/}
								<Route path="/oam/system-management" component={SystemManagement}/>
								{/*默认跳转到会话管理*/}
								<Redirect path="/oam" to="/oam/question-management/session-management"/>
							</Switch>
						</div>
						{/*底部备案区域*/}
						<div className="w-full flex justify-center items-center"
						     style={{height:'40px',minHeight:'40px'}}>
							<RecordArea/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
