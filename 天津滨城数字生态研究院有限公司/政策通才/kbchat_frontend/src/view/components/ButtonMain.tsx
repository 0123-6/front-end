import React from "react";

interface IProps {
	text: string|React.ReactNode;
	disabled?: boolean,
	click: (e:any)=>void,
	className?: string // 添加 className 属性
	style?: React.CSSProperties;
	showShadow?: boolean,
}

export default function ButtonMain(props:IProps) {
	// state
	const {text,disabled=false,click,className,style={},showShadow=false} = props
	// mounted
	// methods
	// render
	return (
		<button className={`flex justify-center items-center rounded-2xl text-base
            ${!disabled?'bg-white text-main border border-main cursor-pointer hover:text-main-hover hover:border-main-hover active:text-main-focus active:border-main-focus':'text-white-disable-text bg-white-disable-bg hover:cursor-not-allowed'}
            ${className}`}
		        style={{boxShadow:(showShadow&&!disabled)?'0px 2px 8px 0px rgba(217,222,238,0.5)':'',...style}}
		        onClick={click}
		        disabled={disabled}>{text}</button>
	)
}
