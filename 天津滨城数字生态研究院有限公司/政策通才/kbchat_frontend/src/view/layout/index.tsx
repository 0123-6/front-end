import React, {useEffect, useRef} from "react";
import MyHeader from "./MyHeader";
import {Route, Switch, Redirect} from "react-router-dom";
import Chat from "../chat";
import Search from "../search";
import SearchDetail from "../search/detail";
import bgSvg from '../../icon/bg.svg'
import UserCenter from "../user-center";

export default function Layout() {
	// state
	let minWidth = '1195px'
	const layoutRef = useRef(null);
	// 判断是否是iframe嵌入其它系统
	const isIframe = window.location !== window.parent.location;
	// mounted
	useEffect(() => {
	  layoutRef.current.scrollTo(0, 0);
	}, [location.pathname]);
	// render
	return (
		<div id='layoutRef' ref={layoutRef}
		     className="w-screen h-screen overflow-auto overflow-scroll bg-[#edf3fe] bg-cover"
		     style={{
					 scrollBehavior: "smooth",
			     backgroundImage: `url(${bgSvg})`
		     }}
		>
			<div className="w-full min-h-full relative flex flex-col"
			     style={{minWidth:minWidth}}>
				{/*头部区域*/}
				{
					!isIframe && <MyHeader/>
				}
				{/*内容区域*/}
				<div className="w-full flex-1 flex">
					<Switch>
						{/*个人中心页面*/}
						<Route path={"/user-center"} component={UserCenter}/>
						{/*对话页面*/}
						<Route path={"/chat"} component={Chat}/>
						{/*搜索详情页面*/}
						<Route path={"/search/detail/:id"} component={SearchDetail}/>
						{/*搜索页面*/}
						<Route path={"/search"} component={Search}/>
						{/*重定向到'/chat'*/}
						<Redirect to="/chat" />
					</Switch>
				</div>
			</div>
		</div>
	)
}
