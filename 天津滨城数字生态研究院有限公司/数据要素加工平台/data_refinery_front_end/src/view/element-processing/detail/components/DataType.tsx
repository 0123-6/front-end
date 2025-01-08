import TableSvg from "../../../data-resource/icon/card/TableSvg";
import TextSvg from "../../../data-resource/icon/card/TextSvg";
import PictureSvg from "../../../data-resource/icon/card/PictureSvg";
import VideoSvg from "../../../data-resource/icon/card/VideoSvg";
import AudioSvg from "../../../data-resource/icon/card/AudioSvg";
import React from "react";

interface IProps {
	type: string,
	style?: React.CSSProperties,
	fontSize?: number,
}

const IOTypeMap = {
	text: '文本',
	csv: '表格',
	image: '图片',
	video: '视频',
	audio: '音频',
}

export default function DataType(props:IProps) {
	const {type,style={},fontSize=12} = props
	return (
		<div className={`flex justify-center items-center rounded-xl text-black-light
			${fontSize===12?'text-xs leading-[12px]':'text-sm leading-[14px]'}`}
		     style={{width:'64px',height:'22px',background:'rgba(206,220,222,0.36)',...style}}>
									<span className="flex items-center text-white-svg-experiment hover:text-white-svg-experiment-hover">
										{(type==='表格' || IOTypeMap[type]==='表格') && <TableSvg/>}
										{(type==='文本'||type==='text') && <TextSvg/>}
										{(type==='图片' || IOTypeMap[type]==='图片') && <PictureSvg/>}
										{(type==='视频' || IOTypeMap[type]==='视频') && <VideoSvg/>}
										{(type==='音频' || IOTypeMap[type]==='音频') && <AudioSvg/>}
										{(type==='向量' || IOTypeMap[type]==='向量') && <TextSvg/>}
									</span>
			<span className={"ml-1 flex items-center"}>{IOTypeMap[type]?(IOTypeMap[type]):(type)}</span>
		</div>
	)
}
