import React from "react";
import RecordArea from "../RecordArea";
import Login from "./components/Login";
import Register from "./components/Register";
import bg from './icon/bg.svg'
import logo from './icon/logo.svg'

export default function UserPage() {
	// state
	const [page,setPage] = React.useState('登录')// 登录/注册/忘记密码
	// mounted
	// methods
	// render
	return (
		// 最外层
		<div className={"w-screen h-screen min-w-[1200px] flex"}>
			{/*左*/}
			<div className={"w-2/5 h-full flex flex-col items-center bg-main bg-cover bg-center"}
			     style={{backgroundImage:`url(${bg})`}}>
				<div className={"w-full"} style={{height:'31%'}}/>
				<img src={logo} alt="" width={'320px'}/>
			</div>
			{/*右*/}
			<div className={"w-3/5 h-full flex"}
			     style={{background:'#f8fffd'}}>
				<div className={"h-full"} style={{width:'18%'}}/>
				{/*主体*/}
				<div className={"w-[480px] h-full flex flex-col justify-between"}>
					{/*上*/}
					{page === '登录' && <Login changePage={name => setPage(name)}/>}
					{page === '注册' && <Register page={'注册'} changePage={name => setPage(name)}/>}
					{page === '忘记密码' && <Register page={'忘记密码'} changePage={name => setPage(name)}/>}
					{/*下备案号*/}
					<div className={"pb-4 w-full flex items-center"}>
						<RecordArea/>
					</div>
				</div>
			</div>
		</div>
	)
}
