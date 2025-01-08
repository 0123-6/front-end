import React, {useEffect, useRef, useState} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import { useHistory } from 'react-router-dom';
import logoPng from "../../icon/logo2.svg";
import UserComponent from "../../view/layout/UserComponent";
import {Menu, MenuProps} from "antd";
// import AuditManagementSvg from "./icon/AuditManagementSvg";
// import TaskManagementSvg from "./icon/TaskManagementSvg";
// import TagManagementSvg from "./icon/TagManagementSvg";
import ModelManagementSvg from "./icon/ModelManagementSvg";
// import StatisticsManagementSvg from "./icon/StatisticsManagementSvg";
import AuthorityManagementSvg from "./icon/AuthorityManagementSvg";
import RecordArea from "../../view/layout/RecordArea";
import UserModel from "../model-management/user-model";
import OfficialModel from "../model-management/official-model";
import ModelCatalog from "../model-management/model-catalog";
import UserModelDetail from "../model-management/user-model/UserModelDetail";
import UserModelTestReport from "../model-management/user-model/TestReport";
import UserModelRiskAssessmentReport from "../model-management/user-model/RiskAssessmentReport";
import OfficialModelCreate from "../model-management/official-model/create";
import OfficialModelDetail from "../model-management/official-model/detail/OfficialModelDetail";
import UserData from "../data-management/user-data";
import OfficialData from "../data-management/official-data";
import OfficialDataCreate from "../data-management/official-data/create";
import OfficialDataDetail from "../data-management/official-data/detail";
import UserDataDetail from "../data-management/user-data/detail";
import DataManagementSvg from "./icon/DataManagement";
import UserManagement from "../authority-management/user-management";
import UserManagementDetail from "../authority-management/user-management/detail";
import RoleManagement from "../authority-management/role-management";

export default function LayoutOam() {
	// state
	console.log(location.href)
	const history = useHistory();
	const layoutOamRef = useRef(null);
	const [items, setItems] = useState<MenuProps['items']>([]);
	const [defaultOpenKeys,setDefaultOpenKeys] = useState<any[]>([]);
	const [defaultSelectedKeys,setDefaultSelectedKeys] = useState<any[]>([]);
	const allItems:MenuProps['items'] = [
		// {
		// 	label: '审核管理',
		// 	key: '/oam/audit-management',
		// 	icon: <AuditManagementSvg />,
		// 	children: [
		// 		{ label: '静态内容1', key: '/oam/audit-management/静态内容1' },
		// 		{ label: '静态内容2', key: '/oam/audit-management/静态内容2' },
		// 		{ label: '静态内容3', key: '/oam/audit-management/静态内容3' },
		// 	]
		// },
		// {
		// 	label: '任务管理',
		// 	key: '/oam/task-management',
		// 	icon: <TaskManagementSvg/>,
		// },
		// {
		// 	label: '标签管理',
		// 	key: '/oam/tag-management',
		// 	icon: <TagManagementSvg/>,
		// 	children: [
		// 		{ label: '静态内容1', key: '/oam/tag-management/静态内容1' },
		// 		{ label: '静态内容2', key: '/oam/tag-management/静态内容2' },
		// 		{ label: '静态内容3', key: '/oam/tag-management/静态内容3' },
		// 	]
		// },
		{
			label: '数据管理',
			key: '/oam/data-management',
			icon: <DataManagementSvg/>,
			children: [
				{ label: '用户数据', key: '/oam/data-management/user-data' },
				{ label: '官方数据', key: '/oam/data-management/official-data' },
			],
		},
		{
			label: '模型管理',
			key: '/oam/model-management',
			icon: <ModelManagementSvg/>,
			children: [
				{ label: '用户模型', key: '/oam/model-management/user-model' },
				{ label: '官方模型', key: '/oam/model-management/official-model' },
				{ label: '模型目录', key: '/oam/model-management/model-catalog' },
			],
		},
		// {
		// 	label: '统计管理',
		// 	key: '/oam/statistics-management',
		// 	icon:<StatisticsManagementSvg/>,
		// 	children: [
		// 		{ label: '静态内容1', key: '/oam/statistics-management/静态内容1' },
		// 		{ label: '静态内容2', key: '/oam/statistics-management/静态内容2' },
		// 		{ label: '静态内容3', key: '/oam/statistics-management/静态内容3' },
		// 	]
		// },
		{
			label: '权限管理',
			key: '/oam/authority-management',
			icon:<AuthorityManagementSvg/>,
			children: [
				{ label: '用户管理', key: '/oam/authority-management/user-management' },
				{ label: '角色管理', key: '/oam/authority-management/role-management' },
			]
		},
	];

	if (!localStorage.getItem('token')) {
		history.replace('/login')
	}
	useEffect(() => {
		setItems(allItems);
		const pathname = location.pathname;
		for(let i=0;i<allItems.length;i++) {
			// @ts-ignore
			if(allItems[i].children) {
				// @ts-ignore
				for(let j=0;j<allItems[i].children.length;j++) {
					// @ts-ignore
					if(pathname.indexOf(allItems[i].children[j].key) !== -1) {
						setDefaultOpenKeys([allItems[i].key]);
						// @ts-ignore
						setDefaultSelectedKeys([allItems[i].children[j].key])
					}
				}
			}
		}
		//修改title为OAM-Datarefinery
		if(document.title !== 'OAM-DataRefinery') {
			document.title = 'OAM-DataRefinery';
		}
	}, []);
	useEffect(() => {
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
				     className="flex-1 h-full bg-[#fafafa] flex overflow-auto overflow-y-scroll">
					<div className={"w-full min-w-[1008px] min-h-full flex flex-col pl-4 pr-4"}>
						{/*内容区域*/}
						<div className="w-full flex-1 flex">
							<Switch>
								{/*权限管理-角色管理*/}
								<Route path="/oam/authority-management/role-management" component={RoleManagement}/>
								{/*权限管理-用户管理-详情*/}
								<Route path="/oam/authority-management/user-management/detail/:id" component={UserManagementDetail}/>
								{/*权限管理-用户管理*/}
								<Route path="/oam/authority-management/user-management" component={UserManagement}/>
								{/*数据管理-用户数据-详情*/}
								<Route path="/oam/data-management/user-data/detail/:id" component={UserDataDetail}/>
								{/*数据管理-用户数据*/}
								<Route path="/oam/data-management/user-data" component={UserData}/>
								{/*数据管理-官方数据-创建*/}
								<Route path="/oam/data-management/official-data/create" component={OfficialDataCreate}/>
								{/*数据管理-官方数据-详情*/}
								<Route path="/oam/data-management/official-data/detail/:id" component={OfficialDataDetail}/>
								{/*数据管理-官方数据*/}
								<Route path="/oam/data-management/official-data" component={OfficialData}/>
								{/*用户模型风险评估报告*/}
								<Route path="/oam/model-management/user-model/risk-assessment-report/:id" component={UserModelRiskAssessmentReport}/>
								{/*用户模型测试报告*/}
								<Route path="/oam/model-management/user-model/test-report/:id" component={UserModelTestReport}/>
								{/*用户模型详情*/}
								<Route path="/oam/model-management/user-model/detail/:id" component={UserModelDetail}/>
								{/*用户模型*/}
								<Route path="/oam/model-management/user-model" component={UserModel}/>
								{/*官方模型-创建页面*/}
								<Route path="/oam/model-management/official-model/create/:method" component={OfficialModelCreate}/>
								{/*官方模型-详情页面*/}
								<Route path="/oam/model-management/official-model/detail/:id" component={OfficialModelDetail}/>
								{/*官方模型*/}
								<Route path="/oam/model-management/official-model" component={OfficialModel}/>
								{/*模型目录*/}
								<Route path="/oam/model-management/model-catalog" component={ModelCatalog}/>
								{/*默认跳转到用户模型*/}
								<Redirect path="/oam" to="/oam/model-management/user-model"/>
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
