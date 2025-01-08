import React, {useEffect, useState} from "react";
import SuccessSvg from "../../icon/SuccessSvg.svg";

interface IProps {
	nameList?: string[];
	number: number;
	isCenter?: boolean;
	style?: React.CSSProperties;
	lineWidth?: string;
}

const lineWidthMap = {
	2: '259px',
	3: '173px',
	4: '118px',
}

export default function ProgressBarComponent(props:IProps) {
	// state
	const {nameList=['上传文件','填写基本信息'],number,isCenter=true,style={},lineWidth} = props
	const [current,setCurrent] = useState(1)
	// mounted
	useEffect(() => {
		setCurrent(number)
	}, [number])
	// methods
	// render
	return (
		<div className={`w-full flex ${isCenter?'justify-center':''} items-center text-sm leading-[14px]`}
		     style={style}>
			{
				nameList.map((item,index) => (
					<div className={"flex items-center"}
					     key={index}>
						{
							(current === index + 1) &&
							<div className={"bg-main rounded-full flex justify-center items-center"}
									 style={{width:'28px',height:'28px'}}>
								<span className={"flex items-center text-white"}>{index + 1}</span>
							</div>
						}
						{
							(current > index + 1) &&
							<img src={SuccessSvg} alt="" style={{width:'28px',height:'28px'}}/>
						}
						{
							(current < index + 1) &&
							<div className={"rounded-full flex justify-center items-center"}
									 style={{width:'28px',height:'28px',border:'1px solid rgba(0,0,0,0.25)',color:'rgba(0,0,0,0.25)'}}>
								<span className={"flex items-center"}>{index + 1}</span>
							</div>
						}
						<span className={`ml-2 flex items-center ${(current >= index + 1)?'font-medium':''}`}
						      style={{color:(current < index + 1)?'rgba(0,0,0,0.25)':'unset',}}>{item}</span>
						{
							(index+1 !== nameList.length) &&
							<div className={"ml-4 mr-4"}
							     style={{
										 width: lineWidth ? lineWidth: lineWidthMap[nameList.length],
								     height:'2px',
								     backgroundColor: (current >= index + 1)?'#a6d4d9':'#C5C5C5',
								     transition: 'background-color 0.2s ease-in-out',
							     }}/>
						}
					</div>
				))
			}
		</div>
	)
}
