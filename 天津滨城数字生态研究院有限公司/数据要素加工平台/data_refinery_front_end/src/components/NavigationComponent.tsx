import React, {useState} from "react";
import { useHistory } from 'react-router-dom';

interface Item {
	label: string,
	router?: string,
	disabled?: boolean,
	icon?: any,
	iconActive?: any,
	iconSvg?: React.ReactNode,
}

interface IProps {
	data: Item[],
	width?: number;
}

export default function NavigationComponent(props:IProps) {
	const {data=[{label:'',router:'',disabled:false,icon:null,iconActive:null}],width=960} = props
	const history = useHistory();
	// 悬浮的index
	let [hoverIndex,setHoverIndex] = useState(-1)
	// methods
	const goRouter = (index) => {
		if (!data[index].disabled && data[index].router) {
			history.replace(data[index].router)
		}
	}
	// render
	// @ts-ignore
	return (
		<div className={"flex items-center text-sm"}
		     style={{height:'42px',width:width+'px'}}>
			{
				data.map((_item,_index) => (
					<div className={"flex items-center"} key={_index}>
						<div className={`flex items-center ${!_item.disabled?'text-black hover:cursor-pointer hover:text-main active:text-main-hover':'text-black-light'}`}
						     style={{lineHeight:'14px'}}
						     onMouseOver={()=>setHoverIndex(_index)}
						     onMouseOut={()=>setHoverIndex(-1)}
						     onClick={()=>goRouter(_index)}>
							<img src={(_index !== hoverIndex) ? _item.icon : _item.iconActive} alt="" className={`${_item.icon?'mr-1':''}`}/>
							{/*@ts-ignore*/}
							{_item.iconSvg && <span className={"mr-1 flex items-center"}><_item.iconSvg/></span>}
							<span className={"flex items-center"}>{data[_index].label}</span>
						</div>
						{
							(_index !== data.length-1) &&
							<span className={"ml-1 mr-2 flex items-center"}
										style={{lineHeight:'14px'}}> / </span>
						}
					</div>
				))
			}
		</div>
	)
}
