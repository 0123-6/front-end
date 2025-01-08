import React from "react";
import EditSvg from "../icon/experiment/EditSvg";
import DeleteSvg from "../icon/experiment/DeleteSvg";
import PublishSvg from "../icon/experiment/PublishSvg";

interface IProps {
	list: IItem[];
	onOk: (type:string)=>void;
}

interface IItem {
	name: string;
	disabled?: boolean;
}

export default function InnerMenuComponent(props:IProps) {
	// state
	const {list,onOk} = props
	// mounted
	// methods
	const clickMenu = (e:any,item:IItem)=>{
		e.stopPropagation()
		e.preventDefault()
		if(item?.disabled) {
			return
		}
		onOk(item.name)
	}
	// render
	return (
		<div className="pb-2 w-[107px] bg-white flex flex-col rounded-sm">
			{
				list.map((item,index)=>(
					<div className={`mt-2 h-[28px] text-sm leading-[14px] pl-3 flex items-center ${!item?.disabled ? 'text-black hover:bg-[#F3F4F5] hover:cursor-pointer hover:text-main' : 'hover:cursor-not-allowed text-black-light'} group`}
					     key={index}
					     onClick={e=>clickMenu(e,item)}>
						{/*// @ts-ignore*/}
						<span className={`flex items-center text-black-light ${!item?.disabled ? 'group-hover:text-main' : ''}`}>
							{item?.name === '编辑' && <EditSvg/>}
							{item?.name === '删除' && <DeleteSvg/>}
							{item?.name === '申请发布' && <PublishSvg/>}
						</span>
						<span className={"flex items-center pl-2"}>{item.name}</span>
					</div>
				))
			}
		</div>
	)
}
