import React from "react";

interface IProps {
	text: string | React.ReactNode;
	disabled?: boolean,
	click: (e: any) => void,
	className?: string // 添加 className 属性
	style?: React.CSSProperties;
	showShadow?: boolean,
}

export default function ButtonSecond(props: IProps) {
	// state
	const {text, disabled = false, click, className, style = {}, showShadow = false} = props
	return (
		<button className={`flex justify-center items-center rounded-lg text-base
              ${!disabled ? 'bg-main text-white hover:cursor-pointer hover:bg-main-hover active:bg-main-focus' : 'text-white-disable-text bg-white-disable-bg hover:cursor-not-allowed'}
              ${className}`}
		        style={{boxShadow: (showShadow && !disabled) ? '' : '', ...style}}
		        onClick={click}
		        disabled={disabled}>{text}</button>
	)
}
