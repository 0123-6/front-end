import React from "react";

interface Iprops {
  title: string,
  className?: string,
  style?: object,
  children?: any
}

export default function Title(props:Iprops) {
  const {title,style={},className='',children} = props
  return (
    <div className={`w-full flex items-center ${className}`}
         style={{...style}}>
      {/*左*/}
      <div className="bg-main flex items-center"
           style={{width:'3px',height:'14px',borderRadius:'1.5px'}}/>
      {/*右*/}
      <div className="ml-2 flex items-center text-sm text-black-dark font-medium leading-[14px]">
        {title}
      </div>
      {/*子*/}
      {
        children &&
        <div className={"ml-1 flex items-center"}>{children}</div>
      }
    </div>
  )
}
