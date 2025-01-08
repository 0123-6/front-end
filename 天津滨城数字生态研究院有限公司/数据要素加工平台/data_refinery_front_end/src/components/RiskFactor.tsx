import Title from "./Title";
// @ts-ignore
import Processing1 from "../view/element-processing/production-task/icon/processing/processing-1.svg";
import Processing2 from "../view/element-processing/production-task/icon/processing/processing-2.svg";
import Processing3 from "../view/element-processing/production-task/icon/processing/processing-3.svg";
import Processing4 from "../view/element-processing/production-task/icon/processing/processing-4.svg";
import Processing5 from "../view/element-processing/production-task/icon/processing/processing-5.svg";
import Processing6 from "../view/element-processing/production-task/icon/processing/processing-6.svg";
import Processing7 from "../view/element-processing/production-task/icon/processing/processing-7.svg";
import Processing8 from "../view/element-processing/production-task/icon/processing/processing-8.svg";
import Processing9 from "../view/element-processing/production-task/icon/processing/processing-9.svg";
import Processing10 from "../view/element-processing/production-task/icon/processing/processing-10.svg";

import Processing13 from "../view/element-processing/production-task/icon/processing/processing-1-3.svg";
import Processing47 from "../view/element-processing/production-task/icon/processing/processing-4-7.svg";
import Processing810 from "../view/element-processing/production-task/icon/processing/processing-8-10.svg";
import React from "react";
import Wenhao from "../icon/wenhao";
import {Tooltip} from "antd";

interface IProps {
	className?: string;
	style?: React.CSSProperties;
	num?: number;
	description?: string;
}

export default function RiskFactor(props: IProps) {
	const { className='', style={},num=2,description='这是风险系数的描述信息这是风险系数的描述信息这是风险系数的描述信息这是风险系数的描述信息这是风险系数描述' } = props;
	return (
		<div className={`w-full flex flex-col ${className}`} style={{...style}}>
			{/*title*/}
			<Title title='风险系数'>
				<Tooltip title={description}
				         overlayClassName={'tooltip-risk-factor'}>
					<div className={"flex items-center text-black-light"}>
						<Wenhao/>
					</div>
				</Tooltip>
			</Title>
			{/*内容*/}
			<div className={"mt-5 w-full flex"}>
				{/*风险系数*/}
				{/*<div className={"mt-4 w-full flex items-center rounded"}*/}
				{/*     style={{height:'40px',background: 'rgba(74,168,178,0.09)',}}>*/}
				{/*  <div className={"ml-5"}>风险系数：</div>*/}
				{/*  <div className={"text-main ml-4 flex items-center"}><ShanDianSvg/></div>*/}
				{/*  <div className={"text-main ml-4 flex items-center"}><ShanDianSvg/></div>*/}
				{/*  <div className={"text-main ml-4 flex items-center"}><ShanDianSvg/></div>*/}
				{/*  <div className={"ml-4 flex items-center"} style={{color:'#D4D3D3'}}><ShanDianSvg/></div>*/}
				{/*  <div className={"ml-4 flex items-center"} style={{color:'#D4D3D3'}}><ShanDianSvg/></div>*/}
				{/*  <div className={"ml-4 flex items-center text-main"}>60 (低风险)</div>*/}
				{/*</div>*/}
				{/*左*/}
				<div className={"flex flex-col"}>
					{num===1 && <img src={Processing1} alt=""/>}
					{num===2 && <img src={Processing2} alt=""/>}
					{num===3 && <img src={Processing3} alt=""/>}
					{num===4 && <img src={Processing4} alt=""/>}
					{num===5 && <img src={Processing5} alt=""/>}
					{num===6 && <img src={Processing6} alt=""/>}
					{num===7 && <img src={Processing7} alt=""/>}
					{num===8 && <img src={Processing8} alt=""/>}
					{num===9 && <img src={Processing9} alt=""/>}
					{num===10 && <img src={Processing10} alt=""/>}
					<div className={"mt-1 w-full flex justify-between items-center text-sm text-black-light leading-[14px]"}>
						<span className={"flex items-center"}>低</span>
						<span className={"flex items-center"}>高</span>
					</div>
				</div>
				{/*右*/}
				<div style={{marginLeft:'47px'}}
				     className={"ml-6 flex flex-col"}>
					<div className={"flex items-center"}
					     style={{marginTop:'68px'}}>
						<img src={Processing13} alt=""/>
						<img src={Processing47} alt="" style={{marginLeft:'36px'}}/>
						<img src={Processing810} alt="" style={{marginLeft:'36px'}}/>
					</div>
					<span className={"mt-1 flex items-center text-sm leading-[14px] text-black-light"}>数据要素风险系数1-10级等级评估（系数越小风险系数越低)</span>
				</div>
			</div>
		</div>
	)
}
