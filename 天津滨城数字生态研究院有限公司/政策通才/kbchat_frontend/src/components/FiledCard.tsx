import React from "react";

interface IProps {
	data: string,
	className?: string,
}

export default function FiledCard(props:IProps) {
	const {data,className=''} = props
	return (
		<span className={`mr-2 flex justify-center items-center pl-4 pr-4 rounded-xl text-main text-sm ${className}`}
		      style={{
			      lineHeight:'14px',
			      height:'22px',
			      background: 'rgba(76,170,180,0.18)',
		      }}>{data}</span>
	)
}
