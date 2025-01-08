import React, {useEffect, useState} from "react";
import {Input, InputNumber, Select} from "antd";
import {NsGraphStatusCommand, NsNodeCmd, useXFlowApp, XFlowNodeCommands} from "@antv/xflow";

export const CalculationOfMonthlyGrowthRate = (_targetType, _targetData, _modelService, commandService) => () => {

	const app = useXFlowApp()
	const [targetData,setTargetData] = useState(_targetData)
	const [options,setOptions] = useState([])

	useEffect(()=>{
		app.getAllEdges().then(res => {
			console.log('res: ',res)
			for(let i=0;i<res.length;i++) {
				const edge = res[i].data
				if (_targetData.id === edge.target) {
					const sourceId = edge.source
					app.getNodeById(sourceId).then(res => {
						console.log('res: ',res)
						setOptions(res.data.output_list[0][targetData.config[0].source_index].value.map((item,_index)=>{
							return {
								label:item,
								value:item,
							}
						}))
					})
				}
			}
		})
	},[])

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
				{/*主键*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[0].label}</span>
					{/*输入框*/}
					<Select
						value={targetData.config[0].value}
						onChange={e => change(e,0)}
						size="middle" maxTagCount="responsive"
						options={options}/>
				</div>
				{/*计算列*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[1].label}</span>
					{/*输入框*/}
					<Select
						value={targetData.config[1].value}
						onChange={e => change(e,1)}
						size="middle" maxTagCount="responsive"
						options={options}/>
				</div>
				{/*时间列*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[2].label}</span>
					{/*输入框*/}
					<Select
						value={targetData.config[2].value}
						onChange={e => change(e,2)}
						size="middle" maxTagCount="responsive"
						options={options}/>
				</div>
				{/*时间格式*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[3].label}</span>
					{/*输入框*/}
					<Input autoComplete={"off"} className="flex-1" value={targetData.config[3].value} onChange={e => change(e,3)} size="middle"/>
				</div>
				{/*增长率列名*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[4].label}</span>
					{/*输入框*/}
					<Input autoComplete={"off"} className="flex-1" value={targetData.config[4].value} onChange={e => change(e,4)} size="middle"/>
				</div>
				{/*保留小数位*/}
				<div className="w-full mt-5 flex flex-col">
					{/*title*/}
					<span className="flex text-sm text-black-light mb-2">{targetData.config[5].label}</span>
					{/*输入框*/}
					<InputNumber className="flex-1" value={targetData.config[5].value} onChange={e => change(e,5)} size="middle"/>
				</div>
			</div>
		</div>
	)
}
