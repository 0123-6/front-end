import React from "react";
import LikeSvg from "../../icon/LikeSvg";
import UnlikeSvg from "../../icon/UnlikeSvg";
import CopySvg from "../../icon/CopySvg";
import {Tooltip} from "antd";

interface IProps {
	click: (name:string) => void;
	style?: React.CSSProperties;
	className?: string;
	like?: number;//0:空 1:点赞 -1:踩
	onlyShowCopy?: boolean;
}

export default function LikeOrUnlikeOrCopy(props:IProps) {
	// state
	const {click, style={}, className,like=0,onlyShowCopy=false} = props
	let list = []
	if (onlyShowCopy) {
		list = [
			{
				name: '复制',
				icon: <CopySvg/>,
			}
		]
	} else {
		list = [
			{
				name: '点赞',
				icon: <LikeSvg/>,
			},
			{
				name: '踩',
				icon: <UnlikeSvg/>,
			},
			{
				name: '复制',
				icon: <CopySvg/>,
			}
		]
	}
	// mounted
	// methods
	const innerClick = (name:string) => {
		console.log(name)
		// 如果是点赞或者踩，就判断是否已经点过赞或者踩，如果是就取消，否则就点赞或者踩
		if(name==='点赞' && like===1 || name==='踩' && like===-1) {
			name = null
		}
		click(name)
	}
	// render
	return (
		<div className={`h-[50px] bg-white rounded-lg items-center text-black ${className}`}
		     style={{
					 // boxShadow: '0px 2px 8px 0px rgba(217,222,238,1)',
					 boxShadow: 'rgb(217, 222, 238) 0px 1px 1px 0px',
			     ...style,
		     }}>
			{
				list.map((item, index) => (
					<Tooltip title={item.name}
					         key={index}
					         overlayClassName={"like-or-unlike-or-copy"}>
						<div key={index}
						     className={`w-[50px] min-w-[50px] h-full flex flex-col justify-between items-center cursor-pointer hover:text-main group/two
						      ${index!==0?'border-l border-white-divide':''}
						      ${like===1&&index===0?'text-main':''}
						      ${like===-1&&index===1?'text-main':''}
					     `}
						     onClick={_e=>innerClick(item.name)}
						>
							<div className={"flex-1 flex justify-center items-center"}>
								{item.icon}
							</div>
							<div className={`w-[25px] h-[4px] rounded bg-white group-hover/two:bg-main 
							${like===1&&index===0?'bg-main':''}
							${like===-1&&index===1?'bg-main':''}
							`}/>
						</div>
					</Tooltip>
				))
			}
		</div>
	)
}
