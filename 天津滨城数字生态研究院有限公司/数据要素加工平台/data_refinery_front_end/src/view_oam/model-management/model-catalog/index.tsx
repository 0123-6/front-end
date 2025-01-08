import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import NavigationComponent from "../../../components/NavigationComponent";
import ModelManagementSvg from "../../layout/icon/ModelManagementSvg";
import {get} from "../../../axios";
import ModelCatalogIndex from "./ModelCatalogIndex";
import {Spin} from "antd";
import ModelCatalogEdit from "./ModelCatalogEdit";

// 将后端数据转换为树形结构
export const convertDataToTree = (res_tree_data) => {
	let result = []
	// 循环一级目录
	for (let i = 0; i < res_tree_data.length; i++) {
		let item = res_tree_data[i]
		let newItem = {
			title: item.name,
			key: item.id,
			children: [],
			icon_list: item.icon_list,
		}
		// children可能是空数组，也可能是有数据的数组
		for (let j = 0; j < item.children.length; j++) {
			let newChild = {
				title: item.children[j].name,
				key: item.children[j].id,
				children: [],
				icon_list: item.children[j].icon_list,
			}
			newItem.children.push(newChild)
		}
		result.push(newItem)
	}
	return result
}

export default function ModelCatalog() {
	// state
	// @ts-ignore
	const history = useHistory();
	const catalogType = useRef(null)
	const [loading, setLoading] = useState(false);
	const [myTreeData,setMyTreeData] = useState([])
	const [platformTreeData,setPlatformTreeData] = useState([])
	// 模式，查看or 编辑
	const [mode,setMode] = useState('查看')
	// mounted
	// 初始化函数
	useEffect(() => {
		init()
	}, []);
	// methods
	const init = async () => {
		setMode('查看')
		setLoading(true)
		await Promise.all([getPlatformData(), getMyData()]);
		setLoading(false)
	}

	const getPlatformData = async () => {
		const params = {
			type: 1,
			with_icon: 1,
		}
		let res_tree_data = await get('/drapi/oam/compmenus',params)
		const newTreeData = convertDataToTree(res_tree_data.data)
		console.log('getPlatformData ',newTreeData)
		setPlatformTreeData(newTreeData)
	}

	const getMyData = async () => {
		const params = {
			type: 2,
			with_icon: 1,
		}
		let res_tree_data = await get('/drapi/oam/compmenus',params)
		const newTreeData = convertDataToTree(res_tree_data.data)
		console.log('getMyData ',newTreeData)
		setMyTreeData(newTreeData)
	}

	// 改变模式
	const changeMode = (_mode,newCatalogType='用户目录') => {
		catalogType.current = newCatalogType
		setMode(_mode)
	}
	// 编辑页面
	const modelCatalogEditOnOk:()=>void = () => {
		init()
	}
	const modelCatalogEditOnCancel = () => {
		changeMode('查看',catalogType.current)
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '模型管理', iconSvg: ModelManagementSvg, disabled: true},
					{label: '模型目录', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full max-w-[1253px] pl-8 pr-8 pt-6 flex flex-col rounded-lg text-sm leading-[14px]"}>
				<Spin spinning={loading} size="large" tip="加载中...">
					{
						mode === '查看' && (platformTreeData.length===0 || myTreeData.length===0) &&
						<div className={"w-full h-[500px] flex items-center justify-center"}/>
					}
					{
						mode === '查看' && platformTreeData.length>0 && myTreeData.length>0 &&
						<ModelCatalogIndex data={{
																			platformTreeData,
																			myTreeData,
																			catalogType: catalogType.current,
																		}}
						                   changeMode={changeMode}
						/>
					}
					{
						mode === '编辑' &&
						<ModelCatalogEdit data={{
																			treeData: catalogType.current === '平台目录' ? platformTreeData: myTreeData,
																			catalogType: catalogType.current,
															}}
						                  onOk={modelCatalogEditOnOk}
						                  onCancel={modelCatalogEditOnCancel}/>
					}
				</Spin>
			</div>
		</div>
	)
}
