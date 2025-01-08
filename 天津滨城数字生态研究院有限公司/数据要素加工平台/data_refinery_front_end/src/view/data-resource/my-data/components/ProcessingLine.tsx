import React from "react";

interface IProps {
	percent: number;
	text: string;
	finishText: string;
}

export default function ProcessingLine(props: IProps) {
	// state
	const {percent,text,finishText} = props
	// mounted
	// methods
	// render
	return (
		<div className="w-full h-[26px] flex justify-center items-center bg-[#F9FAFA] rounded-2xl relative">
			<span className="text-sm leading-[14px] text-[#4DA9B4] font-medium z-20">{percent<100 ? (text+percent+'%') : finishText}</span>
			<div className={"absolute h-full left-0 bg-[#d7e9eb] rounded-2xl"}
			     style={{
						 width: percent+'%',
				     transition: 'width 0.5s ease-in-out',
			     }}/>
		</div>
	)
}
