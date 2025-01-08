import React from "react";

interface Iprops {
	className?: string,
	status: string,
	style?: React.CSSProperties,
}

const statusValueLabelMap = {
	'未申请': '未申请',
	'待审核': '待审核',
	'已驳回': '已驳回',
	'已上线': '已上线',
	'已下线': '已下线',
	'部署中': '部署中',
	'部署失败': '部署失败',
}

// 状态
export const statusList = [
	{
		label:'未申请',
		value:'未申请',
	},
	{
		label:'待审核',
		value:'待审核',
	},
	{
		label:'已驳回',
		value:'已驳回',
	},
	{
		label:'已上线',
		value:'已上线',
	},
	{
		label:'已下线',
		value:'已下线',
	},
	{
		label:'部署中',
		value:'部署中',
	},
	{
		label:'部署失败',
		value:'部署失败',
	}
]

export default function StatusCard2(props:Iprops) {
	let {className,status,style={}} = props
	status += ''
	let _style = {
		color: '',
		background: '',
		border: '',
	}
	if(status === '未申请') {
		_style = {
			color: '#8D95B2',
			background: 'rgba(141,149,178,0.21)',
			border: '0.8px solid rgba(141,149,178,0.3)',
		}
	} else if(status === '已下线') {// 未提交
		_style = {
			color: '#8D95B2',
			background: 'rgba(141,149,178,0.21)',
			border: '0.8px solid rgba(141,149,178,0.3)',
		}
	} else if (status === '待审核') {// 待审核
		_style = {
			color: '#E57F3F',
			background: 'rgba(229,127,63,0.21)',
			border: '0.8px solid rgba(229,127,63,0.3)',
		}
	} else if (status === '已上线') {// 已通过
		_style = {
			color: '#4CAAB4',
			background: 'rgba(76,170,180,0.21)',
			border: '0.8px solid rgba(76,170,180,0.3)',
		}
	} else if (status === '已驳回') {// 已驳回
		_style = {
			color: '#F06B7C',
			background: 'rgba(240,107,124,0.21)',
			border: '0.8px solid rgba(240,107,124,0.3)',
		}
	} else if (status === '部署中') {// 部署中
		_style = {
			color: '#4A83D6',
			background: 'rgba(74,131,214,0.21)',
			border: '0.8px solid rgba(74,131,214,0.3)',
		}
	} else if (status === '部署失败') {// 部署失败
		_style = {
			color: '#844AD6',
			background: 'rgba(132,74,214,0.21)',
			border: '0.8px solid rgba(132,74,214,0.3)',
		}
	}
	return (
		<div style={{width:'60px',height:'20px',borderRadius: '20px 18.75px 18.75px 0px',lineHeight:'14px',..._style,...style}}
		     className={`flex justify-center items-center text-xs ${className}`}>
			{statusValueLabelMap[status]}
		</div>
	)
}
