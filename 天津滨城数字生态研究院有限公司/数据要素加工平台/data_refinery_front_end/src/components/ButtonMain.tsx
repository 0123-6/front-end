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
  const {text,disabled=false,click,className,style={},showShadow=false} = props
  return (
    <button className={`flex justify-center items-center rounded-lg text-sm leading-[14px]
              ${!disabled?'bg-main text-white hover:cursor-pointer hover:bg-main-hover active:bg-main-focus':'text-white-disable-text bg-white-disable-bg hover:cursor-not-allowed'}
              ${className}`}
            style={{boxShadow:(showShadow&&!disabled)?'0px 2px 4px 0px rgba(31,199,179,0.2)':'',...style}}
            onClick={click}
            disabled={disabled}>{text}</button>
  )
}
