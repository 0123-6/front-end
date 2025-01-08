import {useHistory} from 'react-router-dom';
import {useEffect, useState} from "react";
import { get } from '../../../../axios';
import {convertDataStructure} from "../../../../view/my-model/detail";
import React from 'react';
import NavigationComponent from "../../../../components/NavigationComponent";
import ModelManagementSvg from "../../../layout/icon/ModelManagementSvg";
import {Spin} from "antd";
import OfficialModelDetailDetail from "./OfficialModelDetailDetail";
import OfficialModelDetailEdit from "./OfficialModelDetailEdit";

export default function OfficialModelDetail(props) {
	// state
	const history = useHistory();
	// 模式，查看or 编辑
	const [mode,setMode] = useState('')
	// 是不是直接编辑
	const [isEdit,setIsEdit] = useState(false)
	const [data,setData] = useState(null)
	const [isLoading,setIsLoading] = useState(false)
	// 模型类型列表
	const [modelTypeList, setModelTypeList] = useState([]);
	// 模型分类列表
	const [modelClassList, setModelClassList] = useState([]);
	// mounted
	useEffect(()=>{
		console.log('props: ', props)
		if (props.location.params?.isEdit) {
			setIsEdit(true)
			setMode('编辑')
		} else {
			setMode('查看')
		}
		getModelTypeList()
		getModelClassList()
		return ()=>{
			setMode('查看')
		}
	},[])
	useEffect(()=>{
		if (modelTypeList.length>0 && modelClassList.length>0){
			getData()
		}
	},[modelTypeList,modelClassList])
	// methods
	const getModelTypeList = async () => {
		setIsLoading(true)
		const {data} = await get('/drapi/comp/model/types')
		let list = []
		for(let i=0;i<data.model_types.length;i++){
			list.push({
				label: data.model_types[i].name,
				value: data.model_types[i].id,
			})
		}
		setModelTypeList(list)
	}
	const getModelClassList = async () => {
		setIsLoading(true)
		const {data} = await get('/drapi/comp/menu/1')
		let list = []
		for(let i=0;i<data.length;i++){
			let item = {
				label: data[i].name,
				value: data[i].id,
				children: []
			}
			for(let j=0;j<data[i].children.length;j++){
				item.children.push({
					label: data[i].children[j].name,
					value: data[i].children[j].id,
				})
			}
			list.push(item)
		}
		console.log('ModelClassList: ', list)
		setModelClassList(list)
	}
	const getData = async () => {
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		const {data} = await get(`/drapi/oam/platform/comps/${params.id}`)
		setData(changeDataFormat(data))
		setIsLoading(false)

	}
	const changeDataFormat = (data) => {
		return {
			id: data.id,
			modelFormat: data.model_framework,
			modelFileUrl: (data?.model_file?.path) ? (data?.model_file?.path) : null,
			mirrorImage: data.mirror_image,
			modelFileSizeList: (data?.model_file?.structure) ? convertDataStructure(data.model_file.structure) : null,
			modelName: data.name,
			modelCoverUrl: data.cover,
			modelType: data?.model_type_id,
			modelTypeList: modelTypeList,
			modelTypeDesc: data.model_type_desc,
			modelClass: data.comp_menu_id,
			modelClassList: modelClassList,
			modelIcon: data.icon_id,
			labelMapping: data.label_mapping,
			inputType: data?.input_type,
			outputType: data?.output_type,
			modelVersion: data.version,
			modelSimpleDescription: data.abstract,
			modelDescription: data.description,
			update_at: data.updated_at,
			status_desc: data.sub_status_desc,
			api_info: data?.api_info,
			//创建方式
			modelCreateType: data?.type,
			modelCreateTypeDesc: data?.type_desc,
			editorData: data?.config,
			inputNodeData: data?.input,
			outputNodeData: data?.output,
			functionNodeData: data?.core_function,
		}
	}
	// 改变模式
	const changeMode = (_mode) => {
		setMode(_mode)
	}
	// 改变数据
	const changeData = (_data) => {
		if (_data){
			const newData = {
				...data,
				...(changeDataFormat(_data))
			}
			setData(newData)
		}else{
			getData()
		}
	}
	// 查看页面
	// 编辑页面
	const officialModelDetailEditOnOk:(_data:object)=>void = (_data) => {
		if (isEdit) {
			history.goBack()
		} else {
			changeData(_data)
			changeMode('查看')
		}
	}
	const officialModelDetailEditOnCancel = () => {
		if (isEdit) {
			history.goBack()
		} else {
			changeMode('查看')
		}
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '模型管理', iconSvg: ModelManagementSvg, disabled: true},
					{label: '官方模型', router: '/oam/model-management/official-model'},
					{label: mode==='查看'?'查看详情':'编辑模型', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 pb-[140px] mb-8 flex flex-col rounded-lg text-sm leading-[14px]"}>
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{mode === '查看' && <OfficialModelDetailDetail data={data} changeMode={changeMode}/>}
					{mode === '编辑' && <OfficialModelDetailEdit data={data} onOk={officialModelDetailEditOnOk} onCancel={officialModelDetailEditOnCancel}/>}
				</Spin>
			</div>
		</div>
	)
}
