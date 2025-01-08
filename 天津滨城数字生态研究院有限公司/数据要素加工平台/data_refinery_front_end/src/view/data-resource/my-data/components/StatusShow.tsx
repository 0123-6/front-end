import NotRun from "../../../../icon/table/status/未运行.svg";
// import RunError from "../../../../icon/table/status/运行失败.svg";
import RunSuccess from "../../../../icon/table/status/运行成功.svg";
import React from "react";
import CheckBlue from "../../../../icon/table/status/审核蓝.svg";
import CheckOrange from "../../../../icon/table/status/审核橙.svg";
import DownlineRejected from "../../../../icon/table/status/被驳回.svg";
import Downline from "../../../../icon/table/status/已下线.svg";

interface Iprops {
	status: string,
	className?: string,
}

const statusMap = {
	"未上线": {
		icon: NotRun,
		className: 'bg-[#eaeaee] text-[#62697F]',
	},
	"上线审核": {
		icon: CheckOrange,
		className: 'bg-[#fdeede] text-[#E57F3F]',
	},
	"已上线": {
		icon: RunSuccess,
		className: 'bg-[#e7f7f3] text-[#52C5A8]',
	},
	"驳回上线": {
		icon: DownlineRejected,
		className: 'bg-[#eee6fa] text-[#844AD6]',
	},
	"下线审核": {
		icon: CheckBlue,
		className: 'bg-[#e6eefa] text-[#4A83D6]',
	},
	"已下线": {
		icon: Downline,
		className: 'bg-[#f0f2f2] text-[#B7B7B7]',
	},
	"驳回下线": {
		icon: CheckBlue,
		className: 'bg-[#e6eefa] text-[#4A83D6]',
	},
}

export const statusList = [
	{ text: '未上线', value: 1 },
	{ text: '上线审核', value: 100 },
	{ text: '驳回上线', value: 204 },
	{ text: '已上线', value: 200 },
	{ text: '下线审核', value: 300 },
	{ text: '驳回下线', value: 404 },
	{ text: '已下线', value: 400 },
]

export default function StatusShow(props: Iprops) {
	const {status,className=''} = props
	return (
		<span style={{width: '85px',minWidth:'85px', height: '23px'}}
		      className={`inline-flex items-center rounded-xl pl-2 ${statusMap[status]?.className} ${className} relative`}>
			<img src={statusMap[status]?.icon} alt="" style={{width: '14px', height: '14px'}}/>
			<span className={"ml-1 inline-flex items-center text-xs font-medium leading-[12px]"}>{status}</span>
		</span>
	)
}
