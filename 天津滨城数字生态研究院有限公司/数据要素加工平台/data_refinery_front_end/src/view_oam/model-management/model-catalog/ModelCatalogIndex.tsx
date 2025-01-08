import React, {useEffect, useRef, useState} from "react";
import TypeList from "../../../components/TypeList";
import SearchBig from "../../../components/SearchBig";
import ButtonMain from "../../../components/ButtonMain";
import {Tree} from "antd";
import NoSearchData from "../../../icon/no-search-data.svg";
import PublishModal from "./components/PublishModal";
import {CustomExpandIcon} from "../../../view/my-model/detail/MyModelDetailDetail";

const {DirectoryTree} = Tree

interface IProps {
	data:any,
	changeMode:(mode:string,type:string)=>void,
}

export default function ModelCatalogIndex(props:IProps) {
	// state
	const {data,changeMode} = props
	const keyword = useRef('')

	// const [data, setData] = useState(null);
	// 用户目录，平台目录
	const typeList = ['平台目录','用户目录']
	const [type, setType] = useState('平台目录')


	const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
	const [autoExpandParent, setAutoExpandParent] = useState(true);
	const [myTreeData,setMyTreeData] = useState([])
	const [platformTreeData,setPlatformTreeData] = useState([])
	// 是否展示发布弹框
	const [showPublishModal, setShowPublishModal] = useState(false)
	// 是否是搜索模式
	// @ts-ignore
	const [searchMode, setSearchMode] = useState(false)
	// mounted
	useEffect(()=>{
		if(data) {
			console.log('ssssss')
			setPlatformTreeData(data?.platformTreeData)
			setMyTreeData(data?.myTreeData)
			if (data?.catalogType) {
				setType(data?.catalogType)
			}
		}
	},[data])
	// methods
	// 点击了发布按钮
	// @ts-ignore
	const clickPublish = () => {
		setShowPublishModal(true)
	}
	// 点击了编辑按钮
	const clickEdit = () => {
		changeMode('编辑',type)
	}
	const changeType = (value) => {
		setType(value+'')
	}
	const onExpand = (newExpandedKeys: React.Key[]) => {
		setExpandedKeys(newExpandedKeys);
		setAutoExpandParent(false);
	};
	const keydown = (e) => {
		if (e.keyCode === 13) {
			changeKeyword()
		}
	}
	const changeKeyword = () => {
		if(keyword.current === ''){
			setSearchMode(false)
			return
		} else {
			setSearchMode(true)
		}
		const allData = type === '平台目录' ? platformTreeData : myTreeData
		let showDataList = []
		for (let i = 0; i < allData.length; i++) {
			// 判断一级目录是否符合
			if (allData[i].title.indexOf(keyword.current) > -1) {
				showDataList.push(allData[i].key)
			}
			// 判断二级目录是否符合
			for (let j = 0; j < allData[i].children.length; j++) {
				if (allData[i].children[j].title.indexOf(keyword.current) > -1) {
					showDataList.push(allData[i].children[j].key)
				}
			}
		}
		setExpandedKeys(showDataList)
		if(showDataList.length > 0){
			setAutoExpandParent(true);
		}
	}
	// 弹框方法
	const publishModalOnOk = () => {
		setShowPublishModal(false)
	}
	const publishModalOnCancel = () => {
		setShowPublishModal(false)
	}
	// render
	return (
		<div className={"w-full flex flex-col pb-[140px] mb-8"}>
			{/*搜索和按钮*/}
			<div className={"w-full h-[40px] flex justify-between items-center"}>
				{/*左*/}
				<div className={"h-full flex items-center"}>
					{/*全部，拖拽编码筛选，*/}
					<TypeList list={typeList} value={type} change={changeType} className={"pb-1"}/>
					{/*search框筛选*/}
					<SearchBig placeholder='请输入目录名称'
					           ml={true}
					           style={{width: '284px'}}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e => keydown(e)}/>
				</div>
				{/*右*/}
				<div className={"flex items-center"}>
					{/*<ButtonMain text={'发布'} click={clickPublish} style={{width:'86px',height:'32px'}}/>*/}
					<ButtonMain text={'编辑'} click={clickEdit} style={{width:'86px',height:'32px'}} className={"ml-4"}/>
				</div>
			</div>
			{/*结果*/}
			<div className={"mt-3 w-full pl-[25px] flex flex-col"}>
				{
					<div className={"w-full flex flex-col"}>
						{
							// && !(searchMode && expandedKeys.length===0)
							((     (type === '平台目录' && platformTreeData.length>0 )    ||          (type === '用户目录' && myTreeData.length>0 )        )  ) &&
							<DirectoryTree
								showIcon={true}
								icon={(props) => <CustomExpandIcon {...props} changePosition={false} />}
								selectable={false}
								autoExpandParent={autoExpandParent}
								defaultExpandAll={false}
								treeData={type === '平台目录' ? platformTreeData : myTreeData}
								onExpand={onExpand}
								expandedKeys={expandedKeys}
								rootClassName={"model-catalog-tree"}
							>
							</DirectoryTree>
						}
						{
							// && !(searchMode && expandedKeys.length===0)
							!((     (type === '平台目录' && platformTreeData.length>0 )    ||          (type === '用户目录' && myTreeData.length>0 )        )  ) &&
							<div className="w-full flex flex-col justify-center items-center"
									 style={{height:'200px'}}>
								<img src={NoSearchData} alt="" style={{width:'120px',height:'120px'}}/>
								<div className="mt-3 flex text-sm text-black-light">暂无数据</div>
							</div>
						}
					</div>
				}
			</div>
			{/*弹框*/}
			{/*发布弹框*/}
			<PublishModal title={'提示'}
			              show={showPublishModal}
			              data={{name: type}}
			              onOk={publishModalOnOk}
			              onCancel={publishModalOnCancel}
			/>
		</div>
	)
}
