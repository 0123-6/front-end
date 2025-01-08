import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import NavigationComponent from "../../../components/NavigationComponent";
import MyModel from "./icon/MyModel.svg";
import MyModelLight from "./icon/MyModelLight.svg";
import {Spin} from "antd";
import MyModelDetailDetail from "./MyModelDetailDetail";
import MyModelDetailEdit from "./MyModelDetailEdit";
import {get} from "../../../axios";
import {uuidv4} from "@antv/xflow";

interface DataType {
	key: React.ReactNode;
	name: string;
	human_size: string;
	children?: DataType[];
}

export const convertDataStructure = (data: any[]): DataType[] => {
	return data?.map((item) => {
		const { filename, is_dir, human_size, sub_files } = item;
		const dataType: DataType = {
			key: filename+uuidv4(),
			name: filename,
			human_size: human_size?human_size:null,
		};

		if (is_dir && sub_files && sub_files.length > 0) {
			dataType.children = convertDataStructure(sub_files);
		}

		return dataType;
	});
};

export default function MyModelDetail(props) {
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
		const {data} = await get('/drapi/comp/menu/2')
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
		const {data} = await get(`/drapi/comp/mycomps/${params.id}`)
		setData(changeDataFormat(data))
		setIsLoading(false)
	}

	const changeDataFormat = (data) => {
		return {
			...data,
			id: data.id,
			modelFormat: data.model_framework,
			modelFileUrl: (data?.model_file?.path) ? (data?.model_file?.path) : null,
			mirrorImage: data.mirror_image,
			modelFileSizeList: (data?.model_file?.structure) ? convertDataStructure(data.model_file.structure) : null,
			modelName: data.name,
			modelCoverUrl: data.cover,
			modelType: data.model_type_id,
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
			status_desc: data.status_desc,
			api_info: data?.api_info,
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
	const myModelDetailEditOnOk:(_data:object)=>void = (_data) => {
		if (isEdit) {
			history.goBack()
		} else {
			changeData(_data)
			changeMode('查看')
		}
	}
	const myModelDetailEditOnCancel = () => {
		if (isEdit) {
			history.goBack()
		} else {
			changeMode('查看')
		}
	}
	// render
	return (
		// 最外层
		<div className="w-full bg flex flex-col items-center">
			<NavigationComponent data={[
				{label: '我的模型', router: '/my-model', icon: MyModel, iconActive: MyModelLight},
				{label:mode,disabled:true},
			]}/>
			{/*主体内容*/}
			<div className="pb-32 mb-8 flex flex-col bg-white shadow-card rounded text-sm leading-[14px]"
			     style={{width: '960px'}}>
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{mode === '查看' && <MyModelDetailDetail data={data} changeMode={changeMode} onOk={changeData}/>}
					{mode === '编辑' && <MyModelDetailEdit data={data} onOk={myModelDetailEditOnOk} onCancel={myModelDetailEditOnCancel}/>}
				</Spin>
			</div>
		</div>
	)
}
