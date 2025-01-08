import React, {useEffect, useState} from "react";
// import ButtonThird from "../../../components/ButtonThird";
import {Form, Input, message, Spin} from "antd";
// import { useHistory } from 'react-router-dom';
import {getExperimentById, saveExperiment} from "../../../axios/xflow";
import ButtonThird from "../../../components/ButtonThird";
import SelectDataResourceModal
	from "../../element-processing/production-task/create/components/SelectDataResourceModal";
import NavigationComponent from "../../../components/NavigationComponent";
import ButtonFifth from "../../../components/ButtonFifth";
import ButtonSecond from "../../../components/ButtonSecond";
import ButtonMain from "../../../components/ButtonMain";
import {handleKeyDownDisabled} from "../../../utils/util";
import Experiment from './icon/mian/Experiment.svg'
import ExperimentActive from './icon/mian/ExperimentActive.svg'
import Code from './icon/mian/Code.svg'
import CodeActive from './icon/mian/CodeActive.svg'

export default function Notebook(props) {
	// state
	const [form] = Form.useForm();
	// const history = useHistory();
	// 模式，查看or 编辑
	const [mode,setMode] = useState('查看')
	const [data,setData] = useState(null)
	// @ts-ignore
	const [dataResource,setDataResource] = useState(null)
	const [showDataResourceModal,setShowDataResourceModal] = useState(false)
	const [isLoading,setIsLoading] = useState(false)
	// mounted
	useEffect(()=>{
		getResult()
	},[])
	useEffect(()=>{
		if(mode==='编辑'){
			form.setFieldsValue(data)
		}
	},[mode])
	// methods
	const getResult = async () => {
		const params = {
			id: Number(props.match.params.id)
		}
		setIsLoading(true)
		const result = await getExperimentById(params)
		setData(result.data)
		setIsLoading(false)
	}
	// 选择数据源弹框
	const dataResourceModalOnOk = (_data) => {
		console.log(_data)
		setDataResource(_data)
		setShowDataResourceModal(false)
	}
	const dataResourceModalOnCancel = () => {
		console.log('into dataResourceModalOnCancel')
		setShowDataResourceModal(false)
	}
	// 保存
	const clickSave = async () => {
		const newData = form.getFieldsValue(true)
		const params = {
			...data,
			...newData,
		}
		await saveExperiment(params);
		message.success('修改实验成功')
		setMode('查看')
		setData(params)
	}
	// 取消
	const clickCancel = (e) => {
		e.preventDefault()
		setMode('查看')
	}

	// render
	return (
		// 最外层
		<div className="w-full bg flex flex-col items-center">
			<div className={"flex"} style={{width: '1305px'}}>
				<NavigationComponent data={[
					{label:'实验',router:'/experiment',icon:Experiment,iconActive:ExperimentActive},
					{label:'编码',router:'/experiment',icon:Code,iconActive:CodeActive},
					{label:'查看',disabled:true},
				]}/>
			</div>
			{/*主体内容*/}
			<div className="flex mb-8 sticky top-0"
			     style={{width: '1305px'}}>
				<Spin spinning={isLoading} size="large" tip="加载中..." wrapperClassName={'spin-row'}>
					{/*左边*/}
					<div className={"w-[321px] flex flex-col bg-white shadow-card rounded"}
					     style={{paddingLeft:'34px',paddingRight:'30px',height:'900px'}}>
						{
							mode === '查看' &&
							<div className={"w-full flex flex-col"}>
								{/*编辑*/}
								<div className={"mt-4 w-full flex justify-end items-center"}>
									<ButtonFifth style={{width:'53px',height:'24px'}}
															 text={'编辑'}
															 click={()=>setMode('编辑')}/>
								</div>
								{/*id+name*/}
								<div className={"mt-2 flex items-center"}>
							<span className={"flex items-center font-medium text-lg text-black-dark"}>
								{data?.name}
							</span>
								</div>
								{/*描述*/}
								<div className={"mt-2.5 w-full text-sm"}
										 style={{lineHeight:'25px'}}>
									{data?.description}
								</div>
							</div>
						}
						{
							mode === '编辑' &&
							<div className={"w-full flex flex-col"}>
								<Form
									form={form}
									onFinish={clickSave}
									onKeyDown={handleKeyDownDisabled}
								>
									{/*按钮*/}
									<div className="mt-3.5 w-full flex justify-end items-center">
										<ButtonSecond style={{width:'86px',height:'28px',lineHeight:'14px'}}
																	text={'取消'}
																	click={clickCancel}/>
										<ButtonMain className="ml-2"
																style={{width:'86px',height:'28px',lineHeight:'14px'}}
																text={'保存'}
																click={null}/>
									</div>
									<Form.Item
										label=""
										className='codeName'
										style={{marginTop:'12px'}}
										name="name"
										rules={[{ required: true, message: '请输入实验名称' }]}
									>
										<Input placeholder="请输入实验名称" autoComplete={"off"}/>
									</Form.Item>
									<Form.Item
										label=""
										name="description"
										rules={[{ required: true, message: '请输入实验简介' }]}
									>
										<Input.TextArea maxLength={500} rows={13} showCount
																		onKeyDown={e => e.stopPropagation()}
																		placeholder="请输入实验简介"/>
									</Form.Item>
								</Form>
							</div>
						}
						{/*数据资源*/}
						<div className={"mt-4 w-full flex items-center"}>
							<span className={"flex items-center"}>数据资源：</span>
							<ButtonThird style={{width:'129px',height:'28px',borderRadius:'8px'}}
							             // disabled={dataResource!==null}
							             disabled={false}
							             text='+选择数据源'
							             click={_e=>setShowDataResourceModal(true)}/>
							{/*<Input placeholder={'请输入数据资源链接'}*/}
							{/*       style={{width:'300px'}}*/}
							{/*       value={dataResource}*/}
							{/*       onChange={e=>setDataResource(e.target.value)}/>*/}
						</div>
					</div>
					{/*	notebook*/}
					<div className={"w-[960px] ml-6 pt-6 pb-6 pl-8 pr-8 bg-white shadow-card rounded"}
					     style={{height:'900px'}}>
						<iframe className={"w-full h-full "}
							// sandbox="allow-scripts allow-forms allow-same-origin"
							      src={data?.notebook_url}/>
					</div>
				</Spin>
			</div>
			{/*选择数据源弹框*/}
			<SelectDataResourceModal data={null}
			                         show={showDataResourceModal}
			                         onCancel={dataResourceModalOnCancel}
			                         onOk={dataResourceModalOnOk}/>
		</div>
	)
}
