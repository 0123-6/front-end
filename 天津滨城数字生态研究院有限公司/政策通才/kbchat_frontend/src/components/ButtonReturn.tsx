import React from "react";

interface IProps {
	text: string|React.ReactNode;
	disabled?: boolean,
	click: (e:any)=>void,
	className?: string // 添加 className 属性
	style?: React.CSSProperties,
}

export default function ButtonReturn(props:IProps) {
	const {text,disabled=false,click,className,style={}} = props
	return (
		<button className={`flex justify-center items-center rounded text-xs font-medium 
              ${!disabled?'bg-return text-black-light hover:cursor-pointer hover:bg-main hover:text-white active:bg-main-focus active:text-white':'text-white-disable-text bg-white-disable-bg hover:cursor-not-allowed'}
              ${className}`}
		        style={{width:'57px',height:'28px',lineHeight:'12px',...style}}
		        onClick={click}
		        disabled={disabled}>{text}</button>
	)
}
