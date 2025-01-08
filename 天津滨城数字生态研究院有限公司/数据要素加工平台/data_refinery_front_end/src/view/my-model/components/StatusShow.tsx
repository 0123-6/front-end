import NotRun from "../../../icon/table/status/未运行.svg";
import RunError from "../../../icon/table/status/运行失败.svg";
import RunSuccess from "../../../icon/table/status/运行成功.svg";
import React from "react";
import CheckBlue from "../../../icon/table/status/审核蓝.svg";
import CheckOrange from "../../../icon/table/status/审核橙.svg";
import DownlineRejected from "../../../icon/table/status/被驳回.svg";
import Downline from "../../../icon/table/status/已下线.svg";

interface Iprops {
	status: string,
	className?: string,
}

const modelStatusMap = {
	"未发布": {
		icon: NotRun,
		className: 'text-status-notrun bg-status-notrun-bg',
	},
	"发布审核中": {
		icon: CheckOrange,
		className: 'text-status-orange bg-status-orange-bg',
	},
	"发布被驳回": {
		icon: RunError,
		className: 'text-status-error bg-status-error-bg',
	},
	"已发布": {
		icon: RunSuccess,
		className: 'text-status-success bg-status-success-bg',
	},
	"下线审核中": {
		icon: CheckBlue,
		className: 'text-status-blue bg-status-blue-bg',
	},
	"下线被驳回": {
		icon: DownlineRejected,
		className: 'text-status-purple bg-status-purple-bg',
	},
	"已下线": {
		icon: Downline,
		className: 'text-status-white bg-status-white-bg',
	},
}

export default function StatusShow(props: Iprops) {
	const {status,className=''} = props
	return (
		<span style={{width: '94px',minWidth:'94px', height: '23px'}}
		      className={`inline-flex items-center rounded-xl pl-2 ${modelStatusMap[status]?.className} ${className} relative z-10`}>
			<img src={modelStatusMap[status]?.icon} alt="" style={{width: '14px', height: '14px'}}/>
			<span className={"ml-1 inline-flex items-center text-xs font-medium leading-[12px]"}>{status}</span>
		</span>
	)
}
