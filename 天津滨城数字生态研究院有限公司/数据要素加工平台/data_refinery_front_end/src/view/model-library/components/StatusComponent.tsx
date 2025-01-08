import React from "react";

interface IProps {
	status_desc: string;
}

const statusMap = {
	'已授权': {
		style: {
			color: '#00ACB6',
			backgroundColor:'#e4f6f7',
		}
	},
	'我的': {
		style: {
			color: '#F47929',
			backgroundColor:'#fde9dd',
		}
	},
	'未授权': {
		style: {
			color: '#5B637A',
			backgroundColor:'#e5e6ea',
		}
	},
	'已过期': {
		style: {
			color: '#ABABAB',
			backgroundColor:'#f1f1f1',
		}
	}
}

export default function StatusComponent(props:IProps) {
	//state
	const {status_desc} = props;
	// render
	return (
		<div className={"w-[74px] h-[22px] flex justify-center items-center rounded-xl text-xs leading-3"} style={statusMap[status_desc]?.style}>
			{status_desc}
		</div>
	)
}
