import React from "react";

interface IProps {
	text: string|React.ReactNode;
	disabled?: boolean,
	click: (e:any)=>void,
	className?: string // 添加 className 属性
	style?: React.CSSProperties,
}

export default function ButtonSendSmsCode(props:IProps) {
	const {text,disabled=false,click,className,style={}} = props
	return (
		<button className={`flex justify-center items-center rounded-lg leading-[14px] 
               ${!disabled?'bg-white text-main border border-main hover:cursor-pointer hover:text-main-hover hover:border-main-hover active:border-main-focus active:text-main-focus':'text-black border border-white-disable-e6 hover:cursor-not-allowed'}
               ${className}`}
		        style={{...style}}
		        onClick={click}
		        disabled={disabled}>{text}</button>
	)
}
