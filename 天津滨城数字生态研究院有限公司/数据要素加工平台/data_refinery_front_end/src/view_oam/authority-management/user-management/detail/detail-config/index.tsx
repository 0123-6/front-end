import React, {useEffect, useRef, useState} from "react";
import ButtonMain from "../../../../../components/ButtonMain";
import ButtonFifth from "../../../../../components/ButtonFifth";
import {message, Select, Spin} from "antd";
import {modelCpuConfigurationList, modelGpuConfigurationList} from "../../../../../utils/static";

export default function DetailConfig() {
	// state
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);
	const [mode, setMode] = useState('查看');// 查看，编辑
	const newCpuValue = useRef(null)
	const newMemoryValue = useRef(null)
	const newGpuValue = useRef(null)
	// mounted
	useEffect(() => {
		setMode('查看')
		setData(null)
		getData()
	}, [])
	// methods
	const getFalseData = async () => {
		return new Promise<any>(resolve => {
			setTimeout(() => {
				const res = {
					code: '200',
					data: {
						cpu_total: 2,
						cpu_used: 1,
						memory_total: 4,
						memory_used: 2,
						gpu_total: 2,
						gpu_used: 1,
					},
					message: 'success'
				}
				resolve(res)
			}, 200)
		})
	}
	const getData = async () => {
		setLoading(true)
		const {data} = await getFalseData()
		setData(data)
		setLoading(false)
	}
	const clickConfig = () => {
		newCpuValue.current = data.cpu_total
		newMemoryValue.current = data.memory_total
		newGpuValue.current = data.gpu_total
		setMode('编辑')
	}
	const configOnOk = () => {
		// 校验
		if (newCpuValue.current < data.cpu_used) {
			message.error('CPU总数不能小于已使用数')
			return
		}
		if (newMemoryValue.current < data.memory_used) {
			message.error('内存总数不能小于已使用数')
			return
		}
		if (newGpuValue.current < data.gpu_used) {
			message.error('GPU总数不能小于已使用数')
			return
		}
		// 发送网络请求
		const newData = {
			...data,
			cpu_total: newCpuValue.current,
			memory_total: newMemoryValue.current,
			gpu_total: newGpuValue.current,
		}
		setData(newData)
		message.success('保存成功')
		setMode('查看')

	}
	const configOnCancel = () => {
		setMode('查看')
	}
	const changeCpuValue = (value) => {
		newCpuValue.current = JSON.parse(value).cpu
		newMemoryValue.current = JSON.parse(value).memory
	}
	const changeGpuValue = (value) => {
		newGpuValue.current = value
	}
	// render
	return (
		// 最外层
		<div className={"w-full flex flex-col pl-8 pr-8"}>
			{/*搜索和按钮*/}
			<div className={"mt-4 w-full h-[36px] flex justify-end items-center"}>
				{
					mode === '查看' &&
					<ButtonMain text={'设置'} click={clickConfig} style={{width:'90px',height:'28px'}}/>
				}
				{
					mode === '编辑' &&
					<div className={"flex items-center"}>
						<ButtonFifth text={'取消'} click={configOnCancel} style={{width:'90px',height:'28px'}}/>
						<ButtonMain text={'保存'} click={configOnOk} style={{width:'90px',height:'28px'}} className={"ml-4"}/>
					</div>
				}
			</div>
			{/*表格和分页*/}
			<div className={"mt-2 w-full"}>
				<Spin spinning={loading} size="default" tip="加载中...">
					<div className={"w-full flex flex-col text-sm leading-[22px]"}>
						{/*表头*/}
						<div className={"w-full h-[42px] flex items-center bg-[#F8F8F8]"}
						     style={{
							     borderRadius: '4px 4px 0px 0px',
						     }}
						>
							<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
								<span className={"font-medium"}>类型</span>
							</div>
							<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
								<span className={"font-medium"}>资源配置</span>
							</div>
							<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
								<span className={"font-medium"}>占用情况</span>
							</div>
						</div>
						{/*cpu*/}
						<div className={"w-full h-[48px] flex items-center bg-white"}>
							<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
								<span className={""}>CPU</span>
							</div>
							<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
								{
									mode === '查看' &&
									<span>{data?.cpu_total} vCPU {data?.memory_total} GiB</span>
								}
								{
									mode === '编辑' &&
									<Select
										onChange={changeCpuValue}
										defaultValue={(data?.cpu_total && data?.memory_total) ? JSON.stringify({cpu:data?.cpu_total,memory:data?.memory_total}) : null}
										// size={'large'}
										style={{
											width: '100%',
										}}
										placeholder={'请选择CPU规格'}
										options={modelCpuConfigurationList}/>
								}
							</div>
							{
								data &&
								<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
									<span className={"w-[60px] flex justify-end items-center"}>{(data?.cpu_used / data?.cpu_total * 100).toFixed(2)}%</span>
									<div className={"ml-3 flex-1 h-[6px] bg-[#F3F3F3] rounded relative"}>
										<div className={"absolute left-0 top-0 h-full rounded bg-main"}
												 style={{
											     width: `${data?.cpu_used / data?.cpu_total * 100}%`
										     }}/>
									</div>
								</div>
							}
						</div>
						{/*GPU*/}
						<div className={"w-full h-[48px] flex items-center bg-white"}>
							<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
								<span className={""}>GPU</span>
							</div>
							<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
								{
									mode === '查看' &&
									<span>{data?.gpu_total}</span>
								}
								{
									mode === '编辑' &&
									<Select
										onChange={changeGpuValue}
										defaultValue={data?.gpu_total}
										// size={'large'}
										style={{
											width: '100%',
										}}
										placeholder={'请选择GPU规格'}
										options={modelGpuConfigurationList}/>
								}
							</div>
							{
								data &&
								<div className={"w-1/3 pl-[22px] pr-[22px] flex items-center"}>
									<span className={"w-[60px] flex justify-end items-center"}>{(data?.gpu_used / data?.gpu_total * 100).toFixed(2)}%</span>
									<div className={"ml-3 flex-1 h-[6px] bg-[#F3F3F3] rounded relative"}>
										<div className={"absolute left-0 top-0 h-full rounded bg-main"}
												 style={{
											     width: `${data?.gpu_used / data?.gpu_total * 100}%`
										     }}/>
									</div>
								</div>
							}
						</div>
					</div>
				</Spin>
			</div>
		</div>
	)
}
