import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
// @ts-ignore
import { get } from "../../../../axios";
import NavigationComponent from "../../../../components/NavigationComponent";
import DataResource from "../../detail/icon/DataResource.svg";
import DataResourceLight from "../../detail/icon/DataResourceLight.svg";
import { Spin } from "antd";
import DataResourceMyDataDetailDetail from "./DataResourceMyDataDetailDetail";
import DataResourceMyDataDetailEdit from "./DataResourceMyDataDetailEdit";

export default function DataResourceMyDataDetail(props) {
	// state
	const history = useHistory();
	// 模式，查看or 编辑
	const [mode,setMode] = useState('')
	// 是不是直接编辑
	const [isEdit,setIsEdit] = useState(false)
	const [data,setData] = useState(null)
	const [isLoading,setIsLoading] = useState(false)
	// mounted
	useEffect(()=>{
		if (props.location.params?.isEdit) {
			setIsEdit(true)
			setMode('编辑')
		} else {
			setMode('查看')
		}
		getData()
		return ()=>{
			setMode('查看')
		}
	},[])
	// methods
	const getFalseData = (_params) => {
		return new Promise<any>((resolve, _reject)=>{
			setTimeout(()=>{
				const res = {
					code: '200',
					data: JSON.parse(localStorage.getItem('selectedItem')),
				}
				resolve(res)
			},1000)
		})
	}
	const getData = async () => {
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		// const {data} = await get(`/drapi/comp/mycomps/${params.id}`)
		const {data} = await getFalseData(params)
		setData(data)
		setIsLoading(false)
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
				..._data
			}
			setData(newData)
		}else{
			getData()
		}
	}
	// 查看页面
	// 编辑页面
	const editOnOk:(_data:object)=>void = (_data) => {
		if (isEdit) {
			history.goBack()
		} else {
			changeData(_data)
			changeMode('查看')
		}
	}
	const editOnCancel = () => {
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
				{label: '数据资源', router: '/data-resource',icon:DataResource,iconActive:DataResourceLight},
				{label: '我的数据', router: '/data-resource/my-data',},
				{label: mode, disabled: true},
			]}/>
			{/*主体内容*/}
			<div className="flex-1 pb-32 mb-8 flex flex-col bg-white shadow-card rounded text-sm leading-[14px]"
			     style={{width: '960px'}}>
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{mode === '查看' && <DataResourceMyDataDetailDetail data={data} changeMode={changeMode} onOk={changeData}/>}
					{mode === '编辑' && <DataResourceMyDataDetailEdit data={data} onOk={editOnOk} onCancel={editOnCancel}/>}
				</Spin>
			</div>
		</div>
	)
}
