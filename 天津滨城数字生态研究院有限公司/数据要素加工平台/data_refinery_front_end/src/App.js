import {Redirect, Route, Switch} from "react-router-dom";
import Layout from "./view/layout";
import Demo from "./dag";
import UserPage from "./view/layout/Login/UserPage";
import LayoutOam from "./view_oam/layout";

function App() {
	return (
		<Switch>
			{/*数据资源*/}
			<Route path="/data-resource" component={Layout}/>
			{/*XFlow测试页面*/}
			<Route path="/experiment/drag/test/:id" component={Demo}/>
			{/*XFlow核心页面*/}
			<Route path="/experiment/drag/:id" component={Demo}/>
			{/*实验*/}
			<Route path="/experiment" component={Layout}/>
			{/*要素加工*/}
			<Route path="/element-processing" component={Layout}/>
			{/*数据要素*/}
			<Route path="/data-element" component={Layout}/>
			{/*数据市场*/}
			<Route path="/element-market" component={Layout}/>
			{/*模型库*/}
			<Route path="/model-library" component={Layout}/>
			{/*我的模型*/}
			<Route path="/my-model" component={Layout}/>
			{/*登录页面*/}
			<Route path="/login" component={UserPage}/>
			{/*个人中心页面*/}
			<Route path="/user-center" component={Layout}/>
			{/*官方模型测试页面*/}
			<Route path="/oam/experiment/drag/test/:id" component={Demo}/>
			{/*OAM后台管理系统*/}
			<Route path="/oam" component={LayoutOam}/>
			{/*首页*/}
			<Route path="/" component={Layout}/>
			{/*默认实验页面*/}
			<Redirect to='/'/>
		</Switch>
	);
}

export default App;
