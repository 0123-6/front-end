import React from "react";

interface IProps {
	user: any;
	showPhone?: boolean;
}

export const PopoverContent = (props:IProps) => {
	const {user,showPhone=false} = props
	return (
		<div className={"bg-white rounded-lg flex flex-col pl-5"}
		     style={{
			     width:'219px',
			     height:'223px',
			     border: '1px solid rgba(240,240,240,1)',
			     boxShadow: '0px 1px 13px 0px rgba(226,226,226,0.5)'}}>
			{/*上*/}
			<div className={"mt-[18px] w-full flex"}>
				{/*头像*/}
				<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
				     style={{width:'50px',minWidth:'50px',height:'50px',}}>
					<img className="" src={(user?.avatar)?(user?.avatar):null} alt="" style={{width:'100%',height:'100%'}}/>
				</div>
				{/*右侧*/}
				<div className="ml-2.5 mr-5 flex flex-col">
					{/*账号*/}
					<div className="flex text-sm font-medium leading-[14px]"
					>
						{(user?.nickname)?(user?.nickname):(user?.mobile)}
					</div>
					{/*角色*/}
					<div className="mt-2.5 pl-2 pr-2 flex justify-center items-center text-sm rounded-xl text-black-light"
					     style={{height:'24px',lineHeight:'14px',background: '#EEEEEE',width:'auto'}}>
						<span className={"flex items-center text-hidden"}>{(user?.role_name)}</span>
					</div>
				</div>
			</div>
			{/*分割线*/}
			<div className={"mt-4 flex bg-white-border"}
			     style={{width:'calc(100%)',height:'1px'}}/>
			{/*下*/}
			<div className={"mb-2 pr-2 w-full text-sm text-black-light leading-[20px] scrollbar overflow-y-auto"}
			     style={{height:'136px'}}>
				<div className={"mt-3 w-full flex flex-col "}>
					{
						showPhone &&
						<div className={"flex items-center mb-2"}>
							<span className={"flex items-center"}>手机号:</span>
							<span className={"flex items-center"}>{user?.mobile}</span>
						</div>
					}
					{user?.description}
				</div>
			</div>
		</div>
	)
}
