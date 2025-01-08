import {Redirect, Route, Switch} from "react-router-dom";
import Layout from "./view/layout";
import UserPage from "./view/login/UserPage";
import LayoutOam from "./view_oam/layout";

function App() {
	// 判断是否是iframe嵌入其它系统
	const isIframe = window.location !== window.parent.location;
	if (isIframe) {
		// 设置一个固定账户
		localStorage.setItem('user', JSON.stringify({
			"token": "2c1260ea2bb8761cb8ee26dc67e542088a4d6b35",
			"user_info": {
				"id": 37,
				"username": "CHAT15000001",
				"nickname": "产业经济",
				"mobile": "15000000001",
				"email": "",
				"last_login": "2023-09-14 14:37:48",
				"avatar": "",
				"organization": "产业经济iframe用户",
				"sex": 1,
				"description": null,
				"date_joined": "2023-09-05 18:11:20",
				"updated_at": "2023-09-06 14:16:50",
				"role": "user"
			}
		}))
	}

	return (
		<Switch>
			{/*oam登录页面*/}
			<Route path="/oam/login" component={UserPage}/>
			{/*oam*/}
			<Route path="/oam" component={LayoutOam}/>
			{/*登录页面*/}
			<Route path="/login" component={UserPage}/>
			{/*首页*/}
			<Route path="/" component={Layout}/>
			{/*默认实验页面*/}
			<Redirect to='/'/>
		</Switch>
	);
}

export default App;
