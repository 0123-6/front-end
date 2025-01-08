import React from "react";
import CheckOrange from "../../../../icon/table/status/审核橙.svg";
import Downline from "../../../../icon/table/status/已下线.svg";
import RunError from "../../../../icon/table/status/运行失败.svg";
import RunSuccess from "../../../../icon/table/status/运行成功.svg";
import Running from "../../../../icon/table/status/运行中.svg";
import NotRun from "../../../../icon/table/status/未运行.svg";

interface Iprops {
	status: string,
	className?: string,
}

const modelStatusMap = {
	"未发布": {
		icon: NotRun,
		className: 'text-status-notrun bg-status-notrun-bg',
	},
	"发布中": {
		icon: Running,
		className: 'text-status-running bg-status-running-bg',
	},
	"发布失败": {
		icon: RunError,
		className: 'text-status-error bg-status-error-bg',
	},
	"已发布": {
		icon: RunSuccess,
		className: 'text-status-success bg-status-success-bg',
	},
	"已下线": {
		icon: Downline,
		className: 'text-status-white bg-status-white-bg',
	},
	"未上线": {
		icon: CheckOrange,
		className: 'text-status-orange bg-status-orange-bg',
	},
}

export default function StatusShow(props: Iprops) {
	const {status,className=''} = props
	return (
		<span style={{width: '85px', height: '23px'}}
		      className={`inline-flex items-center rounded-xl pl-2 ${modelStatusMap[status]?.className} ${className}`}>
			<img src={modelStatusMap[status]?.icon} alt="" style={{width: '14px', height: '14px'}} className={`${status==='发布中'?'rotate':''}`}/>
			<span className={"ml-1 inline-flex items-center text-xs font-medium leading-[12px]"}>{status}</span>
		</span>
	)
}
