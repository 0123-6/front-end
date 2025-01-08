import React, {useEffect, useRef, useState} from "react";
import {Input, InputNumber, Select, Switch} from "antd";
import {
	NsEdgeCmd, NsGraph,
	NsGraphStatusCommand,
	NsNodeCmd,
	useXFlowApp,
	XFlowEdgeCommands,
	XFlowNodeCommands
} from "@antv/xflow";
import {IGraphCommandService, IModelService} from "@antv/xflow-core";
import {TargetData, TargetType} from "@antv/xflow-extension/es/canvas-json-schema-form/interface";
import {FrontendApplication} from "@antv/xflow-core/es/xflow-main/application";
import ButtonSecond from "../../../components/ButtonSecond";
import {CloseCircleFilled} from "@ant-design/icons";
import AutoModal from "./components/AutoModal";

interface IProps {
	targetType: TargetType;
	targetData: TargetData;
	modelService: IModelService;
	commandService: IGraphCommandService;
}

export const adjustEdge = (edgeList,commandService:IGraphCommandService,node:NsGraph.INodeConfig) => {
	// 重新添加边
	edgeList.forEach(item => {
		// @ts-ignore
		const edge = item?.data ? item.data : item
		if (edge.target === node.id) {
			commandService.executeCommand<NsEdgeCmd.DelEdge.IArgs>(XFlowEdgeCommands.DEL_EDGE.id,{
				edgeConfig: edge,
			}).then(_res => {
				commandService.executeCommand<NsEdgeCmd.AddEdge.IArgs>(XFlowEdgeCommands.ADD_EDGE.id,{
					edgeConfig: {
						...edge,
						edge
					},
				})
			})
		}
	})
}

export const AutoRightPanel = (props: IProps):JSX.Element =>  {
	const {commandService} = props;
	const [targetData,setTargetData] = useState(props.targetData)
	const app = useXFlowApp()
	let [beforeNodeList,setBeforeNodeList] = useState([])
	const [showModal,setShowModal] = useState(false)
	const [selectItemIndex,setSelectItemIndex] = useState(0)
	// 是否禁用
	const [isDisabled,setIsDisabled] = useState(false)
	// 轮询时间
	const timer = useRef(null)
	// effect
	useEffect(() => {
		getBeforeNodeList(app, targetData)
	},[targetData])
	useEffect(() => {
		if(!timer.current) {
			timer.current = setInterval(() => {
				changeDisabled()
			},1000)
		}
		return () => {
			clearInterval(timer.current)
			timer.current = null
		}
	},[])
	// methods
	const changeDisabled = () => {
		if(sessionStorage.getItem('allRunning')==='ok') {
			setIsDisabled(true)
		} else {
			setIsDisabled(false)
		}
	}
	const getBeforeNodeList = async (app: FrontendApplication,targetData) => {
		const res = await app.getAllEdges()
		const list = []
		for (let i = 0; i < res.length; i++) {
			const edge = res[i].data
			if (targetData.id === edge.target) {
				const sourceId = edge.source
				const sourceNode = await app.getNodeById(sourceId)
				list.push(sourceNode.data.output_list[0])
			}
		}
		setBeforeNodeList(list)
	}

	const changeLabel = (e,key) => {
		// 普通input框，取e.target.value,数字input框,取e
		const value = e.target ? e.target.value : e;
		app.getNodeById(targetData.id).then(res => {
			setTargetData({
				...res.data,
				[key]: value,
				status: NsGraphStatusCommand.StatusEnum.DEFAULT
			})
			commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
				nodeConfig:{
					...res.data,
					[key]: value,
					status: NsGraphStatusCommand.StatusEnum.DEFAULT,
				},
			}).then(_res => {
				app.getAllEdges().then(edgeList => {
					adjustEdge(edgeList,commandService,targetData)
				})
			})
		})
	}

	const change = (e,index) => {
		// 普通input框，取e.target.value,数字input框,取e
		const value = e?.target ? e.target.value : e;
		let newConfig = JSON.parse(JSON.stringify(targetData.config))
		newConfig[index].value = value
		app.getNodeById(targetData.id).then(res => {
			setTargetData({
				...res.data,
				config: newConfig,
				status: NsGraphStatusCommand.StatusEnum.DEFAULT
			})
			commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id,{
				nodeConfig:{
					...res.data,
					config: newConfig,
					status: NsGraphStatusCommand.StatusEnum.DEFAULT
				}
			}).then(_res => {
				app.getAllEdges().then(edgeList => {
					adjustEdge(edgeList,commandService,targetData)
				})
			})
		})
	}

	const getOptions = (item) => {
		console.log('into getOptions')
		if ((item.source_input_sub_index!==undefined && item.source_input_sub_index!==null && item.source_input_sub_index !== -1)
			&& beforeNodeList.length > 0) {
			console.log('beforeNodeList',beforeNodeList)
			const values = beforeNodeList[item.source_input_index?item.source_input_index:0][item.source_input_sub_index].value
			console.log('values',values)
			const result = values.map((item,_index) => {
				return {
					value: item,
					label: item
				}
			})
			console.log('result',result)
			return result
		}
		console.log('[]')
		return []
	}
	const clickShowModal = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		setSelectItemIndex(index)
		setShowModal(true)
	}
	const clickDeleteModalData = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		change(null,index)
	}
	const modalOnOk = (data) => {
		setShowModal(false)
		change(data,selectItemIndex)
	}
	const modalOnCancel = () => {
		setShowModal(false)
	}

	// render
	return (
		//最外层
		<div className="w-full h-full flex flex-col bg-white">
			{/*标题*/}
			<div className="pt-4 pb-2 w-full flex text-sm text-black">
				{/*模型名称*/}
				<div className="ml-4">模型名称</div>
				{/*模型名称2*/}
				<span style={{marginLeft:'10px'}}
				      className={"w-[183px] text-hidden"}>{targetData.label}</span>
			</div>
			{/*内容*/}
			<div className="w-full flex flex-col"
			     style={{paddingLeft:'14px',paddingRight:'15px',}}>
				{/*label*/}
				<div className="w-full mt-2 flex items-center text-sm text-black-light">
					{/*title*/}
					<span className={`flex w-[56px] mr-3 justify-end}`}>节点名称</span>
					{/*输入框*/}
					<Input autoComplete={"off"}
					       style={{height:'32px'}}
					       className="flex-1 rounded"
					       placeholder="请输入节点名称"
					       defaultValue={targetData.label}
					       onChange={e => changeLabel(e,'label')}
					       size="middle"
					       disabled={isDisabled}
					/>
				</div>
				{
					targetData?.config?.map((item,index) => {
						return (
							<div className="w-full flex flex-col"
							     key={index}>
								{
									(item.type === 'select' || item.type === 'select_mul') &&
									<div className={`w-full mt-5 flex text-sm text-black-light ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 && false))?'items-center':'flex-col'}`}>
										<span className={`flex ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 && false))?'w-[56px] mr-3 justify-end':'mb-2'}`}>{item.label}</span>
										<Select
											className={`${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 && false)) ? 'flex-1' : 'w-full'}`}
											value={item.value ? item.value : null}
											showArrow={true}
											showSearch={false}
											disabled={isDisabled}
											onChange={e => change(e,index)}
											size="middle"
											placeholder={item?.placeholder ? item?.placeholder : '请选择'+item.label}
											mode={item.type === 'select' ? null : 'multiple'}
											maxTagCount={item.type === 'select' ? null : 'responsive'}
											options={item.source_data ? item.source_data : getOptions(item)}/>
									</div>
								}
								{
									item.type === 'str' &&
									<div className={`w-full mt-5 flex text-sm text-black-light ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4))?'items-center':'flex-col'}`}>
										{/*title*/}
										<span className={`flex ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4))?'w-[56px] mr-3 justify-end':'mb-2'}`}>{item.label}</span>
										{/*输入框*/}
										<Input defaultValue={item.value}
													 style={{height:'32px'}}
										       placeholder={item?.placeholder ? item?.placeholder : '请输入'+item.label}
													 disabled={isDisabled}
													 className={`${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4)) ? 'flex-1' : 'w-full'}`}
													 autoComplete={"off"}
													 onChange={e => change(e,index)}
													 size="middle"/>
									</div>
								}
								{
									item.type === 'int' &&
									<div className={`w-full mt-5 flex text-sm text-black-light ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 || true))?'items-center':'flex-col'}`}>
										<span className={`flex ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 || true))?'min-w-[56px] mr-3 justify-end':'mb-2'}`}>{item.label}</span>
										<InputNumber
											placeholder={item?.placeholder ? item?.placeholder : '请输入'+item.label}
											className={`${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 || true)) ? 'flex-1' : 'w-full'}`}
											value={item.value}
											disabled={isDisabled}
											style={{height:'32px'}}
											onChange={e => change(e,index)}
											size="middle"/>
									</div>
								}
								{
									item.type === 'bool' &&
									<div className={`w-full mt-5 flex text-sm text-black-light ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 || true))?'items-center':'flex-col'}`}>
										<span className={`flex ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 || true))?'min-w-[56px] mr-3 justify-end':'mb-2'}`}>{item.label}</span>
										<Switch checked={item.value}
														disabled={isDisabled}
										        style={{width:'32px'}}
														onChange={e => change(e,index)} />
									</div>
								}
								{
									(item.type === 'modal' || item.type === 'dataset') &&
									<div className={`w-full mt-5 flex flex-col text-sm text-black-light`}>
										<span className={`flex ${(item?.style?.same_line ? item?.style?.same_line : (item?.label.length<=4 && false))?'w-[56px] mr-3 justify-end':'mb-2'}`}>{item.label}</span>
										<div className={"h-[38px] flex items-center"}>
											{
												(!item.value||Object.getOwnPropertyNames(item.value).length===0) &&
												<ButtonSecond style={{width:'187px',height:'38px',lineHeight:'14px'}}
																			disabled={isDisabled}
																			text={`+选择${item.label}`}
																			click={_e=>clickShowModal(_e,index)}/>
											}
											{
												!(!item.value||Object.getOwnPropertyNames(item.value).length===0) &&
												<div className={"h-full flex items-center pl-4 pr-4"}
														 style={{borderRadius:'2px',background:'#F0F2F5'}}>
													<span className={"max-w-[196px] text-hidden flex items-center text-sm"} style={{color:'#919399'}} title={item.value[item.source_data.show_param].length>14?item.value[item.source_data.show_param]:null}>{item.value[item.source_data.show_param]}</span>
													<CloseCircleFilled style={{color:'#919399'}}
													                   className={"ml-2 flex items-center"}
													                   onClick={!isDisabled ? _e=>clickDeleteModalData(_e,index) : null}/>
												</div>
											}
										</div>
									</div>
								}
							</div>
						)
					})
				}
			</div>
			{
				targetData?.config &&
				<AutoModal title={'选择'+targetData.config[selectItemIndex]?.label}
									 api={targetData.config[selectItemIndex]?.source_data?.api}
									 table_head_list={targetData.config[selectItemIndex]?.source_data?.table_head_list}
									 show={showModal}
									 onOk={modalOnOk}
									 onCancel={modalOnCancel}/>
			}
		</div>
	)
}

