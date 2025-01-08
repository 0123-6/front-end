import React, {useEffect, useRef, useState} from "react";
import DraggableModal from "../../../components/draggable-modal";
import ButtonMain from "../../../components/ButtonMain";
import RunningSvg from "../icon/RunningSvg.svg"
import FalseSvg from "../icon/FalseSvg.svg"
import SuccessSvg from "../icon/SuccessSvg.svg"
import {post} from "../../../axios";
import {saveExperiment} from "../../../axios/xflow";
import {message} from "antd";

const newList = [
	{
		step: 1,
		step_status: 'Running',
		icon1: RunningSvg,
		icon2: null,
	},
	{
		step: 1,
		step_status: 'Failed',
		icon1: FalseSvg,
		icon2: null,
	},
	{
		step: 1,
		step_status: 'Succeeded',
		icon1: SuccessSvg,
		icon2: null,
	},
	{
		step: 2,
		step_status: 'Running',
		icon1: SuccessSvg,
		icon2: RunningSvg,
	},
	{
		step: 2,
		step_status: 'Failed',
		icon1: SuccessSvg,
		icon2: FalseSvg,
	},
	{
		step: 2,
		step_status: 'Succeeded',
		icon1: SuccessSvg,
		icon2: SuccessSvg,
	},
]

export default function TestModalSecond(props) {
	// state
	const {title, show, data, onReset, onCancel} = props;
	const comp_id = data?.id
	const [status, setStatus] = useState(null)
	// 定时查询
	const timer = useRef(null)
	// 新实验信息
	const [experiment, setExperiment] = useState(null)
	// mounted
	useEffect(() => {
		if(show) {
			getData()
			timer.current = setInterval(() => {
				getData()
			}, 3000)
		} else {
			clearInterval(timer.current)
			timer.current = null
			setStatus(null)
		}
		return () => {
			clearInterval(timer.current)
			timer.current = null
			setStatus(null)
		}
	}, [show]);
	// methods
	const getData = async () => {
		const params = {
			comp_id,
		}
		const {data} = await post(props.data.url, params)
		for(let i=0;i<newList.length;i++) {
			if(data?.step === newList[i].step && data?.step_status === newList[i].step_status) {
				setStatus({
					...data,
					...newList[i],
				})
			}
		}
		if(data?.step === 2 && data?.step_status === 'Succeeded') {
			clearInterval(timer.current)
			timer.current = null
			const params = {
				name: '测试实验-'+props?.data?.name,
				description: '测试实验-'+props?.data?.name,
				type: 1,
				is_test: 1,
				comp_id,
			}
			// 提前打开新页面
			// const newTab = window.open('about:blank')
			const {data} = await saveExperiment(params)
			setExperiment(data)
			message.success('创建实验成功')
		}
	}
	const goTestPage = () => {
		// 判断url中是否存在oam
		const isOamPage = location.pathname.indexOf('oam') !== -1
		if(isOamPage) {
			window.open(location.origin+'/oam/experiment/drag/test/'+experiment?.id)
		} else {
			window.open(location.origin+'/experiment/drag/test/'+experiment?.id)
		}
		onCancel()
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='my-model-test-2'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full flex flex-col items-center text-sm leading-[14px]"} style={{height:'339px'}}>
				{/*进度条*/}
				<div className={"flex items-center"}
				     style={{marginTop:'120px'}}>
					<img src={status?.icon1} alt=""
					      className={`${(status?.step === 1 && status?.step_status==='Running')?'rotate':''}`}/>
					<span className={"ml-3 flex items-center font-medium"}>部署模型</span>
					<div className={"ml-6 mr-4"} style={{width:'259px',height:'2px',backgroundColor:'#a6d4d9'}}/>
					{
						status?.step === 1 &&
						<div className={"rounded-full flex justify-center items-center"}
						     style={{width:'28px',height:'28px',border:'1px solid rgba(0,0,0,0.25)',color:'rgba(0,0,0,0.25)'}}>2</div>
					}
					{
						status?.step === 2 &&
						<img src={status?.icon2} alt=""
								 className={`${(status?.step === 2 && status?.step_status==='Running')?'rotate':''}`}/>
					}
					<span className={`ml-3 flex items-center ${status?.step === 1?'':'font-medium'}`}
					      style={{color:status?.step === 1?'rgba(0,0,0,0.25)':null}}>生成模型</span>
				</div>
				{/*提示语*/}
				{
					status?.step_status === 'Failed' &&
					<div className={"flex flex-col items-center"}
					     style={{marginTop:'50px'}}>
						<span className={"flex items-center font-medium"} style={{color:'#F17685'}}>【{status?.step_msg}】，请重启测试</span>
						<ButtonMain text='重启测试' click={onReset} className={"mt-10"} style={{width:'87px',height:'32px'}}/>
					</div>
				}
				{
					(status?.step===2 && status?.step_status === 'Succeeded' && !experiment) &&
					<div className={"flex flex-col items-center"}
							 style={{marginTop:'50px'}}>
						<span className={"flex items-center font-medium text-main"}>新建实验中...</span>
					</div>
				}
				{
					(status?.step===2 && status?.step_status === 'Succeeded' && experiment) &&
					<div className={"flex flex-col items-center"}
							 style={{marginTop:'50px'}}>
						<span className={"flex items-center font-medium text-main"}>新建实验成功</span>
						<ButtonMain text='进入实验' click={goTestPage} className={"mt-10"} style={{width:'87px',height:'32px'}}/>
					</div>
				}
			</div>
		</DraggableModal>
	)
}
