import React from "react";
import TableSvg from "../icon/card/TableSvg";
import PictureSvg from "../icon/card/PictureSvg";
import AudioSvg from "../icon/card/AudioSvg";
import VideoSvg from "../icon/card/VideoSvg";
import TextSvg from "../icon/card/TextSvg";

interface IProps {
	data: string
}

export default function TypeShow(props:IProps) {
	const {data} = props
	return (
		<div className={"flex justify-center items-center pl-4 pr-4 rounded-xl text-xs "}
		     style={{height:'22px',background: 'rgba(206,220,222,0.36)',lineHeight:'14px',color:'#B9C8CB'}}>
			{
				data==='表格' &&
				<TableSvg/>
			}
			{
				(data==='图片'||data==='图像') &&
				<PictureSvg/>
			}
			{
				data==='音频' &&
				<AudioSvg/>
			}
			{
				data==='视频' &&
				<VideoSvg/>
			}
			{
				data==='文本' &&
				<TextSvg/>
			}
			<span className={"ml-1.5 flex items-center text-black-light"}>{data}</span>
		</div>
	)
}
