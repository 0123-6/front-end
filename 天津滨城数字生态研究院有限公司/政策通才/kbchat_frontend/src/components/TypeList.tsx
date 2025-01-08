import React from "react";

interface IProps {
  list: string[],
  value:string,
  change:(e)=>void,
  className?:string,
  showLine?:boolean
}

export default function TypeList(props:IProps) {
  const {list,value,change,className='',showLine=false} = props
  return (
    <div className={`flex flex-col bg-white ${className} ${showLine?'w-full relative':''}`}
         style={{
           height:'40px',
           minHeight:'40px',
           background:`${list.length===2?'#FFFFFF':''}`}}>
      <div className={"flex h-full"}>
        {
          list.map((_item,_index)=>{
            return (
              <div className={`h-full flex justify-center items-center text-sm border-b-2 hover:cursor-pointer z-10
                            ${value===_item?'bg-white text-main font-medium border-main':`text-black-light ${showLine?'border-[#F7F7F7]':'border-white'}`}`}
                   style={{
                     marginRight:(_index!==list.length-1)?'30px':'0',
                   }}
                   onClick={_e=>change(_item)}
                   key={_index}
              >
                {_item}
              </div>
            )
          })
        }
      </div>
      {
        showLine &&
        <div className={"h-[2px] bg-[#F7F7F7] absolute bottom-0"} style={{width:'calc(100% + 32px)'}}/>
      }
    </div>
  )
}
