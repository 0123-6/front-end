import React from "react";

interface IProps {
  text: string|React.ReactNode;
  disabled?: boolean,
  click: (e:any)=>void,
  className?: string // 添加 className 属性
  style?: React.CSSProperties,
}

export default function ButtonThird(props:IProps) {
  const {text,disabled=false,click,className,style={}} = props
  return (
    <button className={`flex justify-center items-center rounded-lg leading-[14px] 
               ${!disabled?'bg-white text-main border border-[#a6d4d9] hover:cursor-pointer hover:text-main-hover hover:border-main-hover active:border-main-focus active:text-main-focus':'text-white-disable-text bg-white-disable-bg hover:cursor-not-allowed'}
               ${className}`}
            style={{...style}}
            onClick={click}
            disabled={disabled}>{text}</button>
  )
}
