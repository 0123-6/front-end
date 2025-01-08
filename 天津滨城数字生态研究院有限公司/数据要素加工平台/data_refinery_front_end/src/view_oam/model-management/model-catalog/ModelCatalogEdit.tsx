import React, {useEffect, useRef, useState} from "react";
import SearchBig from "../../../components/SearchBig";
import ButtonMain from "../../../components/ButtonMain";
import ButtonSecond from "../../../components/ButtonSecond";
import {Input, message, Popover, Spin, Tooltip} from "antd";
import ButtonFifth from "../../../components/ButtonFifth";
import {uuidv4} from "@antv/xflow";
import NoSearchData from "../../../icon/no-search-data.svg";
import {del, get, post} from "../../../axios";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import DeleteSvg from "./icon/DeleteSvg";
import UploadSvg from "./icon/UploadSvg";
import Wenhao from "../../../icon/wenhao";
import ModelExampleNormal from "./icon/ModelExampleNormal";
import ModelExampleHover from "./icon/ModelExampleHover";
import {convertDataToTree} from "./index";

const InnerContent = (props) => {
	// state
	const {list} = props
	// 悬浮的index
	let [hoverIndex,setHoverIndex] = useState(-1)
	// render
	return (
		<div className={"w-[286px] pt-4 pb-4 pl-[21px] pr-[21px] grid grid-cols-6 gap-x-[14px] gap-y-4"}>
			{
				list?.map((item, index) => (
					<div className={"w-full h-[29px] flex justify-center items-center rounded"}
					     key={index}
					     onMouseOver={()=>setHoverIndex(index)}
					     onMouseOut={()=>setHoverIndex(-1)}
					     style={{border: '1px solid rgba(218,218,218,0.26)'}}
					>
						<img src={(index !== hoverIndex) ? item.icon : item.icon_hl} alt={''}/>
					</div>
				))
			}
		</div>
	)
}

//icon上传说明组件
const DescriptionComponent = () => {
	return (
		<div className={"w-[137px] h-[97px] flex flex-col pl-[11px] pr-[11px]"}>
			<span className={"mt-2 flex items-center text-sm leading-[14px]"}>示例</span>
			<div className={"mt-2 w-full flex justify-center items-center"}>
				{/*左*/}
				<div className={"flex flex-col items-center"}>
					<div className={"w-[29px] h-[29px] flex justify-center items-center rounded"}
					     style={{border: '1px solid rgba(218,218,218,0.26)'}}
					>
						<ModelExampleNormal/>
					</div>
					<span className="mt-1.5 flex items-center text-sm leading-[14px]">正常</span>
				</div>
				{/*右*/}
				<div className={"ml-5 flex flex-col items-center"}>
					<div className={"w-[29px] h-[29px] flex justify-center items-center rounded"}
					     style={{border: '1px solid rgba(218,218,218,0.26)'}}
					>
						<ModelExampleHover/>
					</div>
					<span className="mt-1.5 flex items-center text-sm leading-[14px]">高亮</span>
				</div>
			</div>
		</div>
	)
}

interface IAddIconContentProps {
	list: string[],
	show: boolean,
	onOk: ({newIconList:[],icon_list_add: [],icon_id_list_del:[]}) => void,
	onCancel: () => void,
}

// 添加icon悬浮框
const AddIconContent = (props: IAddIconContentProps) => {
	// state
	console.log('props: ', props)
	const {list, show, onOk, onCancel} = props
	// @ts-ignore
	const [uploading, setUploading] = useState(false)
	const [newList, setNewList] = useState([])
	// 新增iconList
	const newIconList = useRef([])
	// 删除的iconList
	const deleteIconList = useRef([])
	// 待上传区域
	const [willUploadObject, setWillUploadObject] = useState({
		icon: null,
		icon_hl: null,
	})
	// 悬浮的index
	let [hoverIndex,setHoverIndex] = useState(-1)
	// mounted
	// useEffect(() => {
	// 	if (list?.length > 0) {
	// 		setNewList(list)
	// 	}
	// 	return () => {
	// 		setNewList([])
	// 	}
	// }, [])

	useEffect(() => {
		if (show) {
			if (list?.length > 0) {
				setNewList(list)
				newIconList.current = []
				deleteIconList.current = []
			}
		} else {
			setNewList([])
			newIconList.current = []
			deleteIconList.current = []
		}
	}, [show])
	// methods
	// @ts-ignore
	const oldClickUploadImage = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (event) => {
			// @ts-ignore
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = async () => {

				// setModelCoverFile(file);
				// setShowImageEditorModal(true)
				//
				// setModelCoverUrl(URL.createObjectURL(file))
				// form.setFieldValue('modelCoverUrl', null)
				setUploading(true)
				const params = {
					business_type: 'model-icon',
					avatar: file,
				}
				const res = await post('/drapi/file/upload', params, {headers: {'Content-Type': 'multipart/form-data'}})
				const url = res.data.urls[0]
				setNewList([...newList, url])
				setUploading(false)
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}
	const clickUploadImage = (type) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (event) => {
			// @ts-ignore
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = async () => {
				setUploading(true)
				const params = {
					business_type: 'model-icon',
					avatar: file,
				}
				const res = await post('/drapi/file/upload', params, {headers: {'Content-Type': 'multipart/form-data'}})
				const url = res.data.urls[0]
				setWillUploadObject({
					...willUploadObject,
					[type]: url,
				})
				setUploading(false)
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}
	const deleteImage = (index) => {
		console.log('删除icon，index: ', index)
		const _list = [...newList]
		console.log('_list[index]: ', _list[index])
		// 判断删除的是新增的还是原来的
		if(_list[index]?.isAdd) {
			newIconList.current = newIconList.current.filter((item, _index) => item.id !== _list[index].id)
		} else {
			deleteIconList.current.push(_list[index]?.id)
		}
		_list.splice(index, 1)
		setNewList(_list)
	}
	// 点击了取消按钮
	const innerOnCancel = () => {
		onCancel()
	}
	// 点击了确定按钮
	const innerOnOk = () => {
		const params = {
			newIconList: newList,
			icon_list_add: newIconList.current,
			icon_id_list_del: deleteIconList.current,
		}
		onOk(params)
	}
	// 上传区域删除按钮
	const deleteWillUploadObject = (type) => {
		setWillUploadObject({
			...willUploadObject,
			[type]: null,
		})
	}
	const willUploadObjectOnOk = () => {
		setNewList([...newList, willUploadObject])
		setWillUploadObject({
			icon: null,
			icon_hl: null,
		})
		newIconList.current.push({
			...willUploadObject,
			isAdd: true,
			id: uuidv4(),
		})
	}
	// render
	return (
		<div className={"w-[286px] flex flex-col pt-4 pb-5 pl-[21px] pr-[21px]"}>
			<div className={"flex items-center"}>
				<span className={"mr-1 flex items-center text-sm leading-[14px]"}>请选择icon</span>
				<Popover title={null}
				         placement="top"
				         overlayClassName={'model-catalog-edit-add-icon-description-popover'}
				         trigger="hover"
				         content={DescriptionComponent}
				>
					<div className={"flex items-center text-black-light"}>
						<Wenhao/>
					</div>
				</Popover>
			</div>

			<div className={"mt-2 w-full grid grid-cols-6 gap-x-[14px] gap-y-4"}>
				{
					newList?.map((item, index) => (
						<div
							className={"w-full h-[29px] flex justify-center items-center relative rounded border border-[#f5f5f5] hover:border-main"}
							key={index}
							onMouseOver={()=>setHoverIndex(index)}
							onMouseOut={()=>setHoverIndex(-1)}
						>
							<img src={(index !== hoverIndex) ? item.icon : item.icon_hl} alt={''}/>
							<div
								className={"absolute w-[13px] h-[13px] flex justify-center items-center rounded-full bg-[#E8E8E8] cursor-pointer text-[#9E9E9E] hover:text-main"}
								style={{top: '-7px', right: '-7px'}}
								onClick={_e => deleteImage(index)}
							>
								<DeleteSvg/>
							</div>
						</div>
					))
				}
				{/*{*/}
				{/*	newList.length < 20 &&*/}
				{/*	<div*/}
				{/*		className={"w-full h-[29px] flex justify-center items-center rounded cursor-pointer border border-[#f5f5f5] hover:text-main hover:border-main"}*/}
				{/*		onClick={() => setShowUploadArea(true)}>*/}
				{/*		<span className={"flex items-center text-sm leading-[14px]"}>+</span>*/}
				{/*	</div>*/}
				{/*}*/}
			</div>
			{/*上传icon区域*/}
			<div className="mt-2.5 w-full h-[104px] bg-[#FAFAFA] flex justify-center items-center relative">
				{/*上传区域*/}
				<div className={"flex items-center"}>
					{/*左*/}
					<div className={"flex flex-col"}>
						{
							willUploadObject.icon &&
							<div className={"w-[29px] h-[29px] flex justify-center items-center relative rounded border border-[#f5f5f5] hover:border-main"}>
								<img src={willUploadObject.icon} alt={''}/>
								<div
									className={"absolute w-[13px] h-[13px] flex justify-center items-center rounded-full bg-[#E8E8E8] cursor-pointer text-[#9E9E9E] hover:text-main"}
									style={{top: '-7px', right: '-7px'}}
									onClick={() => deleteWillUploadObject('icon')}
								>
									<DeleteSvg/>
								</div>
							</div>
						}
						{
							!willUploadObject.icon &&
							<div
								className={"w-[29px] h-[29px] flex justify-center items-center rounded cursor-pointer border border-[#f5f5f5] hover:text-main hover:border-main"}
								onClick={()=>clickUploadImage('icon')}>
								<span className={"flex items-center text-sm leading-[14px]"}>+</span>
							</div>
						}
						<div className={"mt-2 flex items-center"}>
							<span className={"flex items-center text-sm leading-[14px]"}>正常</span>
						</div>
					</div>
					{/*右*/}
					<div className={"ml-[40px] flex flex-col"}>
						{
							willUploadObject.icon_hl &&
							<div className={"w-[29px] h-[29px] flex justify-center items-center relative rounded border border-[#f5f5f5] hover:border-main"}>
								<img src={willUploadObject.icon_hl} alt={''}/>
								<div
									className={"absolute w-[13px] h-[13px] flex justify-center items-center rounded-full bg-[#E8E8E8] cursor-pointer text-[#9E9E9E] hover:text-main"}
									style={{top: '-7px', right: '-7px'}}
									onClick={() => deleteWillUploadObject('icon_hl')}
								>
									<DeleteSvg/>
								</div>
							</div>
						}
						{
							!willUploadObject.icon_hl &&
							<div
								className={"w-[29px] h-[29px] flex justify-center items-center rounded cursor-pointer border border-[#f5f5f5] hover:text-main hover:border-main"}
								onClick={()=>clickUploadImage('icon_hl')}>
								<span className={"flex items-center text-sm leading-[14px]"}>+</span>
							</div>
						}
						<div className={"mt-2 flex items-center"}>
							<span className={"flex items-center text-sm leading-[14px]"}>高亮</span>
						</div>
					</div>
				</div>
				{/*按钮区域*/}
				<div className={"absolute right-4 bottom-2.5"}>
					<Tooltip title="提交" overlayClassName={"operator-line"}>
						<div className={`flex justify-center items-center 
						                ${willUploadObject.icon && willUploadObject.icon_hl ? 'text-[#9EA1A8] hover:text-main cursor-pointer' : 'text-table-icon-disable cursor-not-allowed'}
						               `}
						     onClick={willUploadObject.icon && willUploadObject.icon_hl ? willUploadObjectOnOk : null}>
							<UploadSvg/>
						</div>
					</Tooltip>
				</div>
			</div>
			<div className={"mt-2.5 w-full flex justify-end items-center"}>
				<ButtonSecond text={'取消'} click={innerOnCancel} style={{width: '56px', height: '24px'}}/>
				<ButtonMain text={'确定'} click={innerOnOk} style={{width: '56px', height: '24px'}} className={"ml-4"}/>
			</div>
		</div>
	)
}

interface IInnerShowIconComponent {
	list: [],
	left?: number,
}

// 一级菜单和二级菜单内部的icon缩略图
const InnerShowIconComponent = (props: IInnerShowIconComponent) => {
	const {list,left=10} = props

	// @ts-ignore
	return (
		<Popover title={null}
		         placement="top"
		         overlayClassName={'model-catalog-edit-popover'}
		         trigger="hover"
		         content={<InnerContent list={list}/>}
		>
			{/*<div className={"flex items-center absolute left-[10px]"}*/}
			{/*     style={{width: `calc(29px + ${(10 * (list?.length - 1))}px )`}}>*/}
			{/*	{*/}
			{/*		//取前4个icon展示.slice(0,4)*/}
			{/*		// @ts-ignore*/}
			{/*		list?.toReversed()?.map((_item, index) => (*/}
			{/*			<div className={"flex justify-center items-center bg-white absolute"}*/}
			{/*			     key={index}*/}
			{/*			     style={{*/}
			{/*				     width: '29px',*/}
			{/*				     height: '29px',*/}
			{/*				     border: '1px solid rgba(218,218,218,0.26)',*/}
			{/*				     borderRadius: '5px',*/}
			{/*				     boxShadow: '2px 0px 4px 0px rgba(233,233,233,0.28)',*/}
			{/*				     right: (10 * index) + 'px'*/}
			{/*			     }}>*/}
			{/*				/!*<img src={`${(location.origin.indexOf('localhost')!==-1?'http://test.datarefinery.cn':location.origin)+_item}`} alt={''}/>*!/*/}
			{/*				<img src={`${_item.icon}`} alt={''}/>*/}
			{/*			</div>*/}
			{/*		))*/}
			{/*	}*/}
			{/*</div>*/}
			<div className={"flex items-center absolute"}
			     style={{width: '29px',left:left+'px'}}>
				{
					//取前4个icon展示.slice(0,4)
					// @ts-ignore
					list?.slice(0,1)?.map((_item, index) => (
						<div className={"flex justify-center items-center bg-white absolute"}
						     key={index}
						     style={{
							     width: '29px',
							     height: '29px',
							     right: '0px',
						     }}>
							{/*// @ts-ignore*/}
							<img src={`${_item.icon}`} alt={''}/>
						</div>
					))
				}
			</div>
		</Popover>
	)
}

interface IProps {
	data: {
		treeData: any[],
		catalogType: '平台目录' | '用户目录',
	},
	onOk: () => void,
	onCancel: () => void,
}

export default function ModelCatalogEdit(props: IProps) {
	// state
	console.log('props: ', props)
	const scrollRef = useRef(null)
	// @ts-ignore
	const {data, onOk, onCancel} = props
	const [first, setFirst] = useState(true)
	const [newTreeData, setNewTreeData] = useState([])
	const keyword = useRef('')
	// 是否展示添加icon的悬浮框
	const [showAddIcon, setShowAddIcon] = useState(false)
	// 添加icon对应的目录id
	const addIconKey = useRef('')
	// 选中的一级菜单index
	const selectedFirstIndex = useRef(0)
	// 选中的二级菜单index
	const selectedSecondIndex = useRef(0)
	// 是否展示删除一级菜单弹框
	const [showDeleteFirstModal, setShowDeleteFirstModal] = useState(false)
	// 是否展示删除二级菜单弹框
	const [showDeleteSecondModal, setShowDeleteSecondModal] = useState(false)
	const [loading, setLoading] = useState(false);

	// mounted
	useEffect(() => {
		if (data) {
			setLoading(true)
			const copyData = JSON.parse(JSON.stringify(data?.treeData))
			setNewTreeData(copyData)
			setFirst(false)
			setLoading(false)
		}
	}, [data])
	// methods
	const keydown = (e) => {
		if (e.keyCode === 13) {
			getData()
		}
	}
	// 获取数据
	const getData = async () => {
		const params = {
			type: props.data?.catalogType === '平台目录' ? 1 : 2,
			with_icon: 1,
		}
		setLoading(true)
		let res_tree_data = await get('/drapi/oam/compmenus',params)
		let filterData = convertDataToTree(res_tree_data.data)
		if (keyword.current) {
			// 筛选，条件为1级目录或者2级目录的name中包含keyword
			filterData = filterData.filter((item) => {
				if (item.title.indexOf(keyword.current) !== -1) {
					return true
				}
				if (item.children) {
					const filterChildren = item.children.filter((child) => {
						if (child.title.indexOf(keyword.current) !== -1) {
							return true
						}
					})
					if (filterChildren.length) {
						// item.children = filterChildren
						return true
					}
				}
			})
		}
		console.log('filterData: ', filterData)
		setNewTreeData(filterData)
		setLoading(false)
	}
	const clickEditOk = () => {
		console.log('点击了保存按钮')
		// const params = {
		// 	catalogType: data?.catalogType,
		// 	treeData: newTreeData,
		// }
		onOk()
	}

	// 点击了删除一级目录按钮
	const deleteFirstMenuItem = (firstMenuItemIndex) => {
		console.log('点击了删除一级目录按钮')
		selectedFirstIndex.current = firstMenuItemIndex
		setShowDeleteFirstModal(true)
	}
	// 点击了删除二级目录按钮
	const deleteSecondMenuItem = (firstMenuItemIndex, secondMenuItemIndex) => {
		console.log('点击了删除二级目录按钮')
		selectedFirstIndex.current = firstMenuItemIndex
		selectedSecondIndex.current = secondMenuItemIndex
		setShowDeleteSecondModal(true)
	}
	// @ts-ignore
	const addCatalog = async (_params) => {
		console.log('_params: ', _params)
		return new Promise<any>((resolve, _reject) => {
			setTimeout(() => {
				resolve({
					data: {
						..._params,
						id: uuidv4(),
						children: []
					}
				})
			}, 1000)
		})}

	// 添加一级目录
	const addFirstMenuItem = async () => {
		console.log('点击了添加一级目录按钮')
		const copyData = JSON.parse(JSON.stringify(newTreeData))
		const params = {
			parent_id: null,
			name: '新建一级目录',
			type: props.data?.catalogType === '平台目录' ? 1 : 2,
		}
		// const {data} = await addCatalog(params)
		const {data} = await post('/drapi/oam/compmenus',params)
		const newItem = {
			title: data.name,
			key: data.id,
			children: data?.children ? data?.children : [],
		}
		copyData.push(newItem)
		setNewTreeData(copyData)
		//将滚动条滚动到底部
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight
	}

	// 点击了添加二级目录按钮
	const addSecondMenuItem = async (firstMenuItemIndex) => {
		console.log('点击了添加二级目录按钮')
		const copyData = JSON.parse(JSON.stringify(newTreeData))
		const params = {
			parent_id: copyData[firstMenuItemIndex].key,
			name: '新建二级目录',
			type: props.data?.catalogType === '平台目录' ? 1 : 2,
		}
		// const {data} = await addCatalog(params)
		const {data} = await post('/drapi/oam/compmenus',params)
		const newItem = {
			title: data.name,
			key: data.id,
			children: data.children,
		}
		copyData[firstMenuItemIndex].children.push(newItem)
		setNewTreeData(copyData)
	}

	const clickAddIcon = (key) => {
		// if (showAddIcon) {
		// 	message.warning('请先完成当前操作')
		// 	return
		// }
		console.log('点击了添加icon')
		addIconKey.current = key
		if(showAddIcon) {
			setShowAddIcon(false)
		}
		setShowAddIcon(true)
	}
	// @ts-ignore
	const updateIconList = async (params) => {
		console.log('params: ', params)
		return new Promise<any>((resolve, _reject) => {
			setTimeout(() => {
				resolve({
					data: {
						...params,
					}
				})
			}, 1000)
		})
	}
	const addIconContentOnOk = async (data) => {
		console.log('添加icon的弹窗点击了确定')
		console.log('data: ', data)
		const copyData = JSON.parse(JSON.stringify(newTreeData))
		const params = {
			menu_id: addIconKey.current,
			icon_list_add: data.icon_list_add,
			icon_id_list_del: data.icon_id_list_del,
		}
		// await updateIconList(params)
		const res = await post('/drapi/oam/compmenus/icon',params)
		// 遍历找到对应的目录
		for (let i = 0; i < copyData.length; i++) {
			if (copyData[i].key === addIconKey.current) {
				copyData[i].icon_list = res.data.icon_list
			}
			// 遍历二级目录
			for (let j = 0; j < copyData[i].children.length; j++) {
				if (copyData[i].children[j].key === addIconKey.current) {
					copyData[i].children[j].icon_list = res.data.icon_list
				}
			}
		}
		setNewTreeData(copyData)
		// closePopover()
		addIconKey.current = ''
		setShowAddIcon(false)
	}
	const addIconContentOnCancel = () => {
		console.log('添加icon的弹窗点击了取消')
		// closePopover()
		addIconKey.current = ''
		setShowAddIcon(false)
	}
	// @ts-ignore
	const deleteCatalog = async (params) => {
		console.log('params: ', params)
		return new Promise(resolve=>{
			setTimeout(()=>{
				resolve({
					code: 0,
					data: {
					}
				})
			}, 1000)
		})
	}
	// 弹框方法
	const deleteFirstModalOnOk = async () => {
		console.log('删除一级目录弹框点击了确定')
		const copyData = JSON.parse(JSON.stringify(newTreeData))
		const params = {
			id: copyData[selectedFirstIndex.current].key,
		}
		// await deleteCatalog(params)
		await del(`/drapi/oam/compmenus/${params.id}`,null)
		copyData.splice(selectedFirstIndex.current, 1)
		setNewTreeData(copyData)
		setShowDeleteFirstModal(false)
		message.success('删除成功')
	}
	const deleteFirstModalOnCancel = () => {
		console.log('删除一级目录弹框点击了取消')
		setShowDeleteFirstModal(false)
	}
	const deleteSecondModalOnOk = async () => {
		console.log('删除二级目录弹框点击了确定')
		const copyData = JSON.parse(JSON.stringify(newTreeData))
		const params = {
			id: copyData[selectedFirstIndex.current].children[selectedSecondIndex.current].key,
		}
		// await deleteCatalog(params)
		await del(`/drapi/oam/compmenus/${params.id}`,null)
		copyData[selectedFirstIndex.current].children.splice(selectedSecondIndex.current, 1)
		setNewTreeData(copyData)
		setShowDeleteSecondModal(false)
		message.success('删除成功')
	}
	const deleteSecondModalOnCancel = () => {
		console.log('删除二级目录弹框点击了取消')
		setShowDeleteSecondModal(false)
	}

	// @ts-ignore
	const updateCatalog = async (params) => {
		console.log('params: ', params)
		return new Promise(resolve=>{
			setTimeout(()=>{
				resolve({
					code: 0,
					data: {
					}
				})
			}, 1000)
		})
	}
	// 改变一级目录title
	const changeFirstMenuItemTitle = async (firstMenuItemIndex, value) => {
		console.log('改变一级目录title')
		const copyData = JSON.parse(JSON.stringify(newTreeData))
		const params = {
			id: copyData[firstMenuItemIndex].key,
			name: value,
			type: props.data?.catalogType === '平台目录' ? 1 : 2,
		}
		await post('/drapi/oam/compmenus',params)
		copyData[firstMenuItemIndex].title = value
		setNewTreeData(copyData)
	}

	// 改变二级目录title
	const changeSecondMenuItemTitle = async (firstMenuItemIndex, secondMenuItemIndex, value) => {
		console.log('改变二级目录title')
		const copyData = JSON.parse(JSON.stringify(newTreeData))
		const params = {
			id: copyData[firstMenuItemIndex].children[secondMenuItemIndex].key,
			name: value,
			type: props.data?.catalogType === '平台目录' ? 1 : 2,
		}
		await post('/drapi/oam/compmenus',params)
		copyData[firstMenuItemIndex].children[secondMenuItemIndex].title = value
		setNewTreeData(copyData)
	}

	// @ts-ignore
	const changeOrder = async (params) => {
		console.log('params: ', params)
		return new Promise(resolve=>{
			setTimeout(()=>{
				resolve({
					code: 0,
					data: {
					}
				})
			}, 1000)
		})
	}

	const handleDragEnd = async (result) => {
		console.log('result', result)
		if (!result.type || !result.destination) {
			return;
		}
		const oldTreeData = JSON.parse(JSON.stringify(newTreeData))
		const reorderedItems = Array.from(newTreeData);
		let params = {
			menu_id: Number(result.draggableId),
			parent_id: "firstMenuItems" === result.destination.droppableId ? null : Number(reorderedItems[result.destination.droppableId].key),
			order: result.destination.index,
		}
		if (result.type === 'firstMenuItems') {
			// 如果拖拽的是一级菜单项
			const [movedItem] = reorderedItems.splice(result.source.index, 1);
			reorderedItems.splice(result.destination.index, 0, movedItem);
		} else if (result.type === 'secondMenuItems') {
			// 如果拖拽的是二级菜单项
			const sourceParams = {
				firstMenuIndex: Number(result.source.droppableId),
				secondMenuIndex: Number(result.source.index)
			}
			const destinationParams = {
				firstMenuIndex: Number(result.destination.droppableId),
				secondMenuIndex: Number(result.destination.index)
			}
			const [movedItem] = reorderedItems[sourceParams.firstMenuIndex].children.splice(sourceParams.secondMenuIndex, 1);
			reorderedItems[destinationParams.firstMenuIndex].children.splice(destinationParams.secondMenuIndex, 0, movedItem);
		}
		// 更新newTreeData的顺序
		setNewTreeData(reorderedItems);
		// await changeOrder(params)
		await post('/drapi/oam/compmenus/order',params).catch(()=>{
			message.error('排序失败')
			setNewTreeData(oldTreeData)
		})
	};
	const handleOpenChange = (newOpen: boolean) => {
		setShowAddIcon(newOpen);
	};

	// render
	return (
		<div className={"w-full pl-[18px] flex flex-col"}>
			{/*搜索和按钮*/}
			<div className={"w-full h-[40px] flex justify-between items-center"}>
				{/*左*/}
				<div className={"h-full flex items-center"}>
					{/*search框筛选*/}
					<SearchBig placeholder='请输入目录名称'
					           ml={false}
					           style={{width: '284px'}}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e => keydown(e)}/>
				</div>
				{/*右*/}
				<div className={"flex items-center"}>
					{/*<ButtonSecond text={'取消'} click={onCancel} style={{width: '86px', height: '32px'}}/>*/}
					<ButtonSecond text={'返回'} click={clickEditOk} style={{width: '86px', height: '32px'}} className={"ml-4"}/>
				</div>
			</div>
			{/*结果*/}
			<Spin spinning={loading} size="large" tip="加载中...">
				{/* 使用DragDropContext包裹需要拖拽的部分 */}
				{
					newTreeData.length > 0 &&
					<>
						<DragDropContext onDragEnd={handleDragEnd}>
							<div className={"mt-1 pb-[140px] w-full flex flex-col overflow-y-auto"}
									 ref={scrollRef}
									 style={{height: 'calc(100vh - 60px - 50px - 40px - 40px - 4px - 24px - 38px - 8px - 5px)'}}>
								{/* 使用Droppable包裹一级菜单 */}
								<Droppable droppableId="firstMenuItems" type={"firstMenuItems"}>
									{(provided) => (
										<div {...provided.droppableProps} ref={provided.innerRef}>
											{
												// 使用Draggable包裹一级菜单项
												newTreeData.map((firstMenuItem, firstMenuIndex) => (
													<Draggable draggableId={firstMenuItem.key+''}
													           index={firstMenuIndex}
													           key={firstMenuItem.key+''}>
														{(provided) => (
															<div {...provided.draggableProps}
															     {...(!keyword.current ? provided.dragHandleProps : {})}
															     ref={provided.innerRef}>
																{/* 一级菜单内容 */}
																<div key={firstMenuIndex}
																     className={"pt-4 w-full flex flex-col bg-white"}>
																	{/*展示一级菜单*/}
																	<div className={"flex items-center"}>
																		<div className={"flex items-center relative"}
																		     style={{width: '625px',marginRight:'24px'}}>
																			<Input autoComplete={"off"}
																			       style={{paddingLeft:firstMenuItem?.icon_list?.length > 0?'46px':''}}
																			       defaultValue={firstMenuItem.title}
																			       onBlur={e => changeFirstMenuItemTitle(firstMenuIndex, e.target.value)}
																			       size="middle"/>
																			{
																				firstMenuItem?.icon_list?.length > 0 &&
																				<InnerShowIconComponent list={firstMenuItem?.icon_list}/>
																			}
																			{
																				!(firstMenuItem?.children?.length > 0) &&
																				<Popover title={null}
																								 placement="bottomLeft"
																								 overlayClassName={'model-catalog-edit-add-icon-popover'}
																								 trigger="click"
																								 open={(firstMenuItem.key === addIconKey.current) && showAddIcon}
																								 onOpenChange={handleOpenChange}
																								 content={<AddIconContent list={firstMenuItem?.icon_list}
																				                                  show={(firstMenuItem.key === addIconKey.current) && showAddIcon}
																				                                  onOk={addIconContentOnOk}
																				                                  onCancel={addIconContentOnCancel}/>}
																				>
																					<div className={"absolute right-4"}>
																						<ButtonSecond click={() => clickAddIcon(firstMenuItem.key)}
																													text={'添加icon'}
																													style={{width: '86px', height: '24px'}}/>
																					</div>
																				</Popover>
																			}
																		</div>
																		<ButtonSecond text={'添加二级目录'}
																		              click={() => addSecondMenuItem(firstMenuIndex)}
																		              style={{marginLeft: '19px', width: '109px', height: '28px'}}/>
																		{
																			!(firstMenuItem?.children?.length > 0) &&
																			<ButtonSecond text={'删除'}
																										click={() => deleteFirstMenuItem(firstMenuIndex)}
																										style={{marginLeft: '19px', width: '86px', height: '28px'}}/>
																		}
																	</div>
																	{/*展示二级菜单*/}
																	<Droppable droppableId={`${firstMenuIndex}`}
																	           type={"secondMenuItems"}
																	           direction="vertical">
																		{(provided) => (
																			<div ref={provided.innerRef} {...provided.droppableProps}>
																				{
																					firstMenuItem?.children.map((secondMenuItem, secondMenuIndex) => (
																						<Draggable draggableId={secondMenuItem.key+''}
																						           index={secondMenuIndex}
																						           key={secondMenuItem.key+''}>
																							{(provided) => (
																								<div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
																									<div key={secondMenuIndex} className={"pt-4"}>
																										<div className={"pl-5 flex items-center relative"}
																										     style={{width: '625px'}}>
																											<Input autoComplete={"off"}
																											       style={{paddingLeft:secondMenuItem?.icon_list?.length > 0?'46px':''}}
																											       defaultValue={secondMenuItem.title}
																											       onBlur={e => changeSecondMenuItemTitle(firstMenuIndex, secondMenuIndex, e.target.value)}
																											       size="middle"/>
																											{
																												secondMenuItem?.icon_list?.length > 0 &&
																												<InnerShowIconComponent list={secondMenuItem?.icon_list} left={30}/>
																											}
																											<Popover title={null}
																											         placement="bottomLeft"
																											         overlayClassName={'model-catalog-edit-add-icon-popover'}
																											         trigger="click"
																											         open={(secondMenuItem.key === addIconKey.current) && showAddIcon}
																											         onOpenChange={handleOpenChange}
																											         content={<AddIconContent list={secondMenuItem?.icon_list}
																											                                  show={(secondMenuItem.key === addIconKey.current) && showAddIcon}
																											                                  onOk={addIconContentOnOk}
																											                                  onCancel={addIconContentOnCancel}/>}
																											>
																												<div className={"absolute right-[91px]"}>
																													<ButtonSecond click={() => clickAddIcon(secondMenuItem.key)}
																													              text={'添加icon'}
																														// disabled={(secondMenuItem.key !== addIconKey.current) && showAddIcon}
																														            style={{width: '86px', height: '24px'}}/>
																												</div>
																											</Popover>
																											<ButtonSecond click={() => deleteSecondMenuItem(firstMenuIndex, secondMenuIndex)} text={'删除'}
																											              style={{width: '56px', height: '24px'}}
																											              className={"absolute right-4"}/>
																										</div>
																									</div>
																								</div>
																							)}
																						</Draggable>
																					))
																				}
																				{provided.placeholder}
																			</div>
																		)}
																	</Droppable>
																</div>
															</div>
														)}
													</Draggable>
												))
											}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						</DragDropContext>
						{/*底部固定按钮*/}
						<div className={"mt-2 w-full flex items-center"}>
							<ButtonFifth text={'+添加目录'}
													 click={addFirstMenuItem}
													 style={{width: '625px', height: '38px'}}/>
						</div>
					</>
				}
				{
					!first && newTreeData.length === 0 &&
					<div className="w-full flex flex-col justify-center items-center"
							 style={{height: '400px'}}>
						<img src={NoSearchData} alt="" style={{width: '200px', height: '200px'}}/>
						<div className="mt-3 flex text-sm text-black-light">暂无数据</div>
					</div>
				}
			</Spin>
			{/*弹框*/}
			<DraggableModalPrompt
				show={showDeleteFirstModal}
				onOk={deleteFirstModalOnOk}
				onCancel={deleteFirstModalOnCancel}>
				<span className="text-sm text-black">确定要删除一级目录<span
					className="text-main pl-1 pr-1">{newTreeData[selectedFirstIndex.current]?.title}</span>吗?</span>
			</DraggableModalPrompt>
			<DraggableModalPrompt
				show={showDeleteSecondModal}
				onOk={deleteSecondModalOnOk}
				onCancel={deleteSecondModalOnCancel}>
				<span className="text-sm text-black">确定要删除二级目录<span
					className="text-main pl-1 pr-1">{newTreeData[selectedFirstIndex.current]?.children[selectedSecondIndex.current]?.title}</span>吗?</span>
			</DraggableModalPrompt>
		</div>
	)
}
