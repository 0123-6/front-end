import React, {useState} from "react";
import {Input, InputNumber, Select} from "antd";
import {NsGraphStatusCommand, NsNodeCmd, XFlowNodeCommands} from "@antv/xflow";

export const SpectrogramExtraction = (_targetType, _targetData, _modelService, commandService) => () => {

	const [targetData,setTargetData] = useState(_targetData)

	const changeLabel = (e,key) => {
		// 普通input框，取e.target.value,数字input框,取e
		const value = e.target ? e.target.value : e;
		setTargetData({
			...targetData,
			[key]: value
		})
		// @ts-ignore
		let executeCommand = commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
			nodeConfig:{
				...targetData,
				[key]: value,
				status: NsGraphStatusCommand.StatusEnum.DEFAULT
			}
		});
	}

	const change = (e,index) => {
		// 普通input框，取e.target.value,数字input框,取e
		const value = e.target ? e.target.value : e;
		let newConfig = JSON.parse(JSON.stringify(targetData.config))
		newConfig[index].value = value
		setTargetData({
			...targetData,
			config: newConfig,
		})
		// @ts-ignore
		let executeCommand = commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
			nodeConfig:{
				...targetData,
				config: newConfig,
				status: NsGraphStatusCommand.StatusEnum.DEFAULT
			}
		});
	}

	return (
		//最外层
		<div className="w-full h-full flex flex-col bg-white">
			{/*标题*/}
			<div className="pt-4 pb-2 w-full flex text-sm text-black">
				{/*模型名称*/}
				<div className="ml-4">模型名称</div>
				{/*模型名称2*/}
				<div style={{marginLeft:'10px'}}>{targetData.label}</div>
			</div>
			{/*内容*/}
			<div className="w-full flex flex-col"
			     style={{paddingLeft:'14px',paddingRight:'15px',}}>
				{/*label*/}
				<div className="w-full mt-2 flex items-center">
					{/*title*/}
					<span className="flex text-sm text-black-light mr-3" style={{width:'56px'}}>节点名称</span>
					{/*输入框*/}
					<Input autoComplete={"off"} className="flex-1" value={targetData.label} onChange={e => changeLabel(e,'label')} size="middle"/>
				</div>
				{/*提取方式*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[0].label}</span>
					{/*输入框*/}
					<Select
						value={targetData.config[0].value}
						onChange={e => change(e,0)}
						size="middle" maxTagCount="responsive"
						options={targetData.config[0].source_data}/>
				</div>
				{/*采样率*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[1].label}</span>
					{/*输入框*/}
					<InputNumber className="flex-1" value={targetData.config[1].value} onChange={e => change(e,1)} size="middle"/>
				</div>
				{/*窗口大小*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[2].label}</span>
					{/*输入框*/}
					<InputNumber className="flex-1" value={targetData.config[2].value} onChange={e => change(e,2)} size="middle"/>
				</div>
				{/*帧移长度*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[3].label}</span>
					{/*输入框*/}
					<InputNumber className="flex-1" value={targetData.config[3].value} onChange={e => change(e,3)} size="middle"/>
				</div>
				{/*窗口长度*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[4].label}</span>
					{/*输入框*/}
					<InputNumber className="flex-1" value={targetData.config[4].value} onChange={e => change(e,4)} size="middle"/>
				</div>
				{/*梅尔滤波器数量*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[5].label}</span>
					{/*输入框*/}
					<InputNumber className="flex-1" value={targetData.config[5].value} onChange={e => change(e,5)} size="middle"/>
				</div>
				{/*最小谱图频率*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[6].label}</span>
					{/*输入框*/}
					<InputNumber className="flex-1" value={targetData.config[6].value} onChange={e => change(e,6)} size="middle"/>
				</div>
				{/*最大谱图频率*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[7].label}</span>
					{/*输入框*/}
					<InputNumber className="flex-1" value={targetData.config[7].value} onChange={e => change(e,7)} size="middle"/>
				</div>
				{/*MFCC数量*/}
				{/*<div className="w-full mt-5 flex flex-col">*/}
				{/*	/!*title*!/*/}
				{/*	<span className="flex text-sm text-black-light mb-2">{targetData.config[8].label}</span>*/}
				{/*	/!*输入框*!/*/}
				{/*	<InputNumber className="flex-1" value={targetData.config[8].value} onChange={e => change(e,8)} size="middle"/>*/}
				{/*</div>*/}
			</div>
		</div>
	)
}
