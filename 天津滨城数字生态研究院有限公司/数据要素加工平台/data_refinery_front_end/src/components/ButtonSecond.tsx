import React from "react";

interface IProps {
  text: string|React.ReactNode;
  disabled?: boolean,
  click: (e:any)=>void,
  className?: string // 添加 className 属性
  style?: React.CSSProperties,
}

export default function ButtonSecond(props:IProps) {
  const {text,disabled=false,click,className,style={}} = props
  return (
    <button className={`flex justify-center items-center rounded-lg leading-[14px]
               ${!disabled?'bg-white text-main hover:cursor-pointer hover:text-main-hover active:text-main-focus':'text-white-disable-text bg-white-disable-bg hover:cursor-not-allowed'}
               ${className}`}
            style={{border:'1px solid rgba(191,208,224,1)',...style}}
            onClick={click}
            disabled={disabled}>{text}</button>
  )
}
