import React from "react";
import CopySvg from "./icon/CopySvg";

interface IProps {
	click: () => void;
}

export default function CopyComponent(props:IProps) {
	// state
	const {click} = props;
	// render
	return (
		<div className={"p-1 flex items-center text-xs text-black-light cursor-pointer hover:text-main group/two"}
		     onClick={click}>
			<div className={"flex items-center text-white-svg-experiment group-hover/two:text-main"}><CopySvg/></div>
			<span className={"ml-1.5 flex items-center"}>复制</span>
		</div>
	)
}
