import React from "react";

interface IProps {
	name: string;
	className?: string;
	style?: React.CSSProperties;
}

export default function TypeShowComponent(props:IProps) {
	const {name,className='',style={}} = props
	return (
		<div className={`h-[22px] pl-3 pr-3 flex justify-center items-center rounded-xl bg-[#e1eaf8] text-blue text-xs leading-[12px] ${className}`}
		 style={{...style}}>
			{name}
		</div>
	)
}
