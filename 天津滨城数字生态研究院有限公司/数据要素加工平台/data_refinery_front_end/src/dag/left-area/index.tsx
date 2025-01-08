import React, {useEffect, useRef, useState} from "react";
import {useGraphDnd} from "@antv/xflow-extension/es/canvas-collapse-panel/panel-body/dnd-hook";
import {AlgoNode} from "../react-node/algo-node";
import TypeList from "../../components/TypeList";
import SearchBig from "../../components/SearchBig";
import {DownOutlined} from "@ant-design/icons";
import {message, Popover, Spin, Tree} from "antd";
import NoSearchData from "../../icon/no-search-data.svg";
import {
	MODELS,
	NsGraph,
	NsGraphStatusCommand,
	NsNodeCmd,
	NsNodeCollapsePanel, useXFlowApp,
	uuidv4,
	XFlowNodeCommands
} from "@antv/xflow";
import {get} from "../../axios";
import {DND_RENDER_ID} from "../constant";
import {getExperimentById} from "../../axios/xflow";

const {DirectoryTree} = Tree

const onNodeDrop: NsNodeCollapsePanel.IOnNodeDrop = async (node, commands) => {
	const args: NsNodeCmd.AddNode.IArgs = {
		nodeConfig: {...node, id: uuidv4()},
	}
	console.log('节点释放,执行添加节点命令,参数 ', args)
	commands.executeCommand(XFlowNodeCommands.ADD_NODE.id, args).then(res => {
		console.log('节点添加成功,后置钩子，res', res)
	})
}

const innerPopover = (data:any) => {
	// state
	// mounted
	// methods
	const goDetail = () => {
		console.log('跳转到详情页')
		window.open(location.origin + '/model-library/detail/' + data.id)
	}
	// render
	return (
		<div className={"w-[300px] p-4 flex flex-col"}>
			<div className={"w-full flex items-center"}>
				<span className={"flex items-center cursor-pointer text-black-dark hover:text-main"}
				      onClick={goDetail}>{data?.label}</span>
			</div>
			<div className={"mt-1 w-full h-[2px] bg-[#f0f0f0]"}/>
			<div className={"mt-1 w-full flex items-center"}>{data?.abstract}</div>
		</div>
	)
}

const PanelNode = (props:{data:any,isTest?:boolean}) => {
	// state
	const {data,isTest=false} = props
	// @ts-ignore
	const {onMouseDown} = useGraphDnd({onNodeDrop});
	return (
		<Popover key={uuidv4()}
		         overlayClassName={'xflow-left-card-popover'}
		         placement="right"
		         title={null}
		         content={innerPopover(data)}
		         trigger="hover">
			<div key={uuidv4()}
			     onMouseDown={onMouseDown({...data,width:215,height:36})}>
				<AlgoNode data={data} isNodeTreePanel isTest={isTest}/>
			</div>
		</Popover>
	)
}

interface IProps {
	isTest?: boolean
}

export default function LeftArea(props:IProps) {
	// state
	const {isTest} = props
	const app = useXFlowApp()
	const typeList = ['平台','我的']
	const [type, setType] = useState('平台')
	const keyword = useRef('')
	// 是否是搜索模式
	const [searchMode, setSearchMode] = useState(false)
	// 是否是第一次搜索
	const [first,setFirst] = useState(true)
	const [searchResult, setSearchResult] = useState([])
	// 是否正在搜索
	const [loading, setLoading] = useState(false)
	const [pageSum, setPageSum] = useState(0)
	// 全部的数据
	const [allPlatformData,setAllPlatformData] = useState([])
	const [allMyData,setAllMyData] = useState([])
	const [myTreeData,setMyTreeData] = useState([])
	const [platformTreeData,setPlatformTreeData] = useState([])
	// test页面，默认展开的节点
	const [defaultExpandedKeys,setDefaultExpandedKeys] = useState<string[]>([])
	// const treeData = [
	// 	{
	// 		title: '数据读取',
	// 		key: uuidv4(),
	// 		children: [
	// 			{
	// 				key: uuidv4(),
	// 				title: <PanelNode label={'读取数据'}/>,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: '结构化数据',
	// 		key: uuidv4(),
	// 		children: [
	// 			{
	// 				title: '数据预处理',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'数据筛选'}/>,
	// 					},
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'数据按列值排序'}/>,
	// 					}
	// 				],
	// 			},
	// 			{
	// 				title: '特征工程',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'Min-Max标准化'}/>,
	// 					}
	// 				],
	// 			},
	// 			{
	// 				title: '其他',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'熵权法'}/>,
	// 					},
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'月增长率计算'}/>,
	// 					},
	// 				],
	// 			}
	// 		],
	// 	},
	// 	{
	// 		title: '图像',
	// 		key: uuidv4(),
	// 		children: [
	// 			{
	// 				title: '图像预处理',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'调整图片尺寸'}/>,
	// 					}
	// 				],
	// 			},
	// 			{
	// 				title: '目标检测',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'车辆检测'}/>,
	// 					}
	// 				],
	// 			},
	// 			{
	// 				title: '人脸识别',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'人脸位置识别'}/>,
	// 					},
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'人脸特征向量提取'}/>,
	// 					},
	// 				],
	// 			},
	// 			{
	// 				title: '其他',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'车流量统计'}/>,
	// 					},
	// 				],
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: '视频',
	// 		key: uuidv4(),
	// 		children: [
	// 			{
	// 				title: '预处理',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'视频解码'}/>,
	// 					},
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'视频分类前处理'}/>,
	// 					},
	// 				],
	// 			},
	// 			{
	// 				title: '视频分类',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'犯罪视频分类'}/>,
	// 					}
	// 				],
	// 			}
	// 		],
	// 	},
	// 	{
	// 		title: '文本',
	// 		key: uuidv4(),
	// 		children: [
	// 			{
	// 				title: '文本预处理',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'文本前处理'}/>,
	// 					}
	// 				],
	// 			},
	// 			{
	// 				title: '命名实体识别',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'实体抽取模型推理'}/>,
	// 					}
	// 				],
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: '音频',
	// 		key: uuidv4(),
	// 		children: [
	// 			{
	// 				title: '音频预处理',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'频谱图提取'}/>,
	// 					}
	// 				],
	// 			},
	// 			{
	// 				title: '音频分类',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'城市音频分类'}/>,
	// 					}
	// 				],
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: '多模态',
	// 		key: uuidv4(),
	// 		children: [
	// 			{
	// 				title: '多模态表征',
	// 				key: uuidv4(),
	// 				children: [
	// 					{
	// 						key: uuidv4(),
	// 						title: <PanelNode label={'Clip特征提取'}/>,
	// 					}
	// 				],
	// 			}
	// 		],
	// 	},
	// ];
	// mounted
	useEffect(() => {
		// 判断pathname是否包含oam
		const isOamPage = location.pathname.indexOf('oam') !== -1
		if(!isTest || isOamPage) {
			setType('平台')
		} else {
			setType('我的')
		}
		init()
		return () => {
			setType('平台')
		}
	},[])

	useEffect(() => {
		search()
	}, [type])
	//platformTreeData
	useEffect(() => {
		// 判断pathname是否包含oam
		const isOamPage = location.pathname.indexOf('oam') !== -1
		if (isTest && isOamPage && platformTreeData.length > 0 && allPlatformData.length > 0) {
			// 使用models
			MODELS.GRAPH_META.useValue(app.modelService).then(res=>{
				const _experimentInfo = res.meta.experimentInfo
				if (_experimentInfo?.name) {
					const nodeId = _experimentInfo?.comp_info?.id
					initSetDefaultExpandKeys(allPlatformData,nodeId)
				} else {
					getExperimentById(_experimentInfo).then(res => {
						const nodeId = res.data?.comp_info?.id
						initSetDefaultExpandKeys(allPlatformData,nodeId)
					})
				}
			})
		}
	}, [platformTreeData,allPlatformData])
	//myTreeData
	useEffect(() => {
		// 判断pathname是否包含oam
		const isOamPage = location.pathname.indexOf('oam') !== -1
		if (isTest && !isOamPage && myTreeData.length > 0 && allMyData.length > 0) {
			// 使用models
			MODELS.GRAPH_META.useValue(app.modelService).then(res=>{
				const _experimentInfo = res.meta.experimentInfo
				if (_experimentInfo?.name) {
					const nodeId = _experimentInfo?.comp_info?.id
					initSetDefaultExpandKeys(allMyData,nodeId)
				} else {
					getExperimentById(_experimentInfo).then(res => {
						const nodeId = res.data?.comp_info?.id
						initSetDefaultExpandKeys(allMyData,nodeId)
					})
				}
			})
		}
	}, [myTreeData,allMyData])
	// methods
	// 自动创建一个模型，如何实验nodes为空
	const autoCreateModelIfNoNodes = async (node) => {
		const f = async () => {
			const allNodes = await app.getAllNodes()
			if (allNodes.length === 0) {
				console.log('实验为空，自动创建一个模型')
				app.executeCommand(XFlowNodeCommands.ADD_NODE.id, {
					nodeConfig: {
						...node,
						id: uuidv4(),
					}
				})
			}
		}
		let timer = setInterval(async () => {
			if (sessionStorage.getItem('onLoad') === 'true') {
				f()
				clearInterval(timer)
				timer = null
			} else {
				console.log('等待onLoad')
			}
		}, 50)
	}
	const initSetDefaultExpandKeys = async (list,nodeId) => {
		// 是否有对应的nodeId
		let hasNodeId = false
		for (let i = 0; i < list.length; i++) {
			if (list[i].id === nodeId) {
				hasNodeId = true
				setDefaultExpandedKeys([list[i].comp_menu_id])
				autoCreateModelIfNoNodes(list[i])
			}
		}
		if (!hasNodeId) {
			message.error('测试模型不存在，请联系管理员')
		}
	}
	const getRealItem = (item,onePoint=false) => {
		let ports = []
		if (onePoint) {
			ports.push({
				id: uuidv4(),
				type: NsGraph.AnchorType.INPUT,
				group: NsGraph.AnchorGroup.TOP,
				tooltip: '输入桩',
			})
			ports.push({
				id: uuidv4(),
				type: NsGraph.AnchorType.OUTPUT,
				group: NsGraph.AnchorGroup.BOTTOM,
				tooltip: '输出桩',
			})
		}
		else {
			for (let i = 0; i < item?.input_list?.length; i++) {
				ports.push({
					id: uuidv4(),
					type: NsGraph.AnchorType.INPUT,
					group: NsGraph.AnchorGroup.TOP,
					tooltip: '输入桩',
				})
			}
			for (let i = 0; i < item?.output_list?.length; i++) {
				ports.push({
					id: uuidv4(),
					type: NsGraph.AnchorType.OUTPUT,
					group: NsGraph.AnchorGroup.BOTTOM,
					tooltip: '输出桩',
				})
			}
		}
		return {
			...item,
			comp_id: item.id,
			renderKey: DND_RENDER_ID,
			// 前端需要的前端运行状态
			status: NsGraphStatusCommand.StatusEnum.DEFAULT,//状态
			is_single_debug: 0,  // 是否是单节点运行
			log: "",
			ports,
		}
	}
	const getPlatformData = async () => {
		const params = {
			is_test: isTest ? 1 : 0,
		}
		// 判断pathname是否包含oam
		const isOamPage = location.pathname.indexOf('oam') !== -1
		let node_data = await get(`/drapi/${isOamPage?'oam':'comp'}/comps4menu/1`, params)
		node_data = node_data.data
		let newAllData = []
		for (let i = 0; i < node_data.length; i++) {
			let item = node_data[i]
			let newItem = {
				id: item.id,
				label: item.name,
				name: item.name_en,
				abstract: item.abstract,
				input_list: item.input_list,
				config: item.config,
				output_list: item.output_list,
				comp_menu_id: item.comp_menu_id,
				icon: item.icon,
				icon_hl: item.icon_hl,
				status_desc: item.status_desc,
			}
			const real_item = getRealItem(newItem)
			newAllData.push(real_item)
		}
		setAllPlatformData(newAllData)

		let res_tree_data = await get('/drapi/comp/menu/1',params)
		res_tree_data = res_tree_data.data
		let newTreeData = []
		// 循环一级目录,[]
		for (let i = 0; i < res_tree_data.length; i++) {
			let item = res_tree_data[i]
			let newItem = {
				title: item.name,
				key: item.id,
				children: [],
			}
			// children可能是空数组，也可能是有数据的数组
			for (let j = 0; j < item.children.length; j++) {
				let newChild = {
					title: item.children[j].name,
					key: item.children[j].id,
					children: [],
				}
				newItem.children.push(newChild)
			}
			newTreeData.push(newItem)
		}
		// 遍历目录，将节点放入对应的目录中,如果是一级目录，直接放入，如果是存在二级目录，需要遍历二级目录，将节点放入对应的二级目录中
		for (let i = 0; i < newTreeData.length; i++) {
			if (newTreeData[i].children.length === 0) {
				// 一级目录
				for (let j = 0; j < newAllData.length; j++) {
					if (newAllData[j].comp_menu_id === newTreeData[i].key) {
						newTreeData[i].children.push({
							title: <PanelNode data={newAllData[j]} isTest={isTest}/>,
							key: 'node'+newAllData[j].id,
						})
					}
				}
			} else {
				// 二级目录
				for (let j = 0; j < newTreeData[i].children.length; j++) {
					for (let k = 0; k < newAllData.length; k++) {
						if (newAllData[k].comp_menu_id === newTreeData[i].children[j].key) {
							newTreeData[i].children[j].children.push({
								title: <PanelNode data={newAllData[k]} isTest={isTest}/>,
								key: 'node'+newAllData[k].id,
							})
						}
					}
				}
			}
		}

		// 删除空的一级目录和二级目录
		for (let i = 0; i < newTreeData.length; i++) {
			// 如果存在二级目录，则遍历二级目录，如果二级目录为空，则删除
			if (newTreeData[i]?.children.length !== 0) {
				for (let j = 0; j < newTreeData[i]?.children.length; j++) {
					if (newTreeData[i]?.children[j]?.children?.length === 0) {
						newTreeData[i]?.children.splice(j, 1)
						j--
					}
				}
			}
			// 删除空的一级目录
			if (newTreeData[i]?.children.length === 0) {
				newTreeData.splice(i, 1)
				i--
			}
		}
		console.log('getPlatformData ',newTreeData)
		setPlatformTreeData(newTreeData)
	}

	const getMyData = async () => {
		const params = {
			is_test: isTest ? 1 : 0,
		}
		// 判断pathname是否包含oam
		const isOamPage = location.pathname.indexOf('oam') !== -1
		let node_data = await get(`/drapi/${isOamPage?'oam':'comp'}/comps4menu/2`, params)
		node_data = node_data.data

		let newAllData = []
		for (let i = 0; i < node_data.length; i++) {
			let item = node_data[i]
			let newItem = {
				id: item.id,
				label: item.name,
				name: item.name_en,
				abstract: item.abstract,
				input_list: item.input_list,
				config: item.config,
				output_list: item.output_list,
				comp_menu_id: item.comp_menu_id,
				icon: item.icon,
				icon_hl: item.icon_hl,
				status_desc: item.status_desc,
			}
			const real_item = getRealItem(newItem,true)
			newAllData.push(real_item)
		}
		setAllMyData(newAllData)

		let res_tree_data = await get('/drapi/comp/menu/2',params)
		res_tree_data = res_tree_data.data
		let newTreeData = []
		// 循环一级目录,[]
		for (let i = 0; i < res_tree_data.length; i++) {
			let item = res_tree_data[i]
			let newItem = {
				title: item.name,
				key: item.id,
				children: [],
			}
			// children可能是空数组，也可能是有数据的数组
			for (let j = 0; j < item.children.length; j++) {
				let newChild = {
					title: item.children[j].name,
					key: item.children[j].id,
					children: [],
				}
				newItem.children.push(newChild)
			}
			newTreeData.push(newItem)
		}
		// 遍历目录，将节点放入对应的目录中,如果是一级目录，直接放入，如果是存在二级目录，需要遍历二级目录，将节点放入对应的二级目录中
		for (let i = 0; i < newTreeData.length; i++) {
			if (newTreeData[i].children.length === 0) {
				// 一级目录
				for (let j = 0; j < newAllData.length; j++) {
					if (newAllData[j].comp_menu_id === newTreeData[i].key) {
						newTreeData[i].children.push({
							title: <PanelNode data={newAllData[j]} isTest={isTest}/>,
							key: 'node'+newAllData[j].id,
						})
					}
				}
			} else {
				// 二级目录
				for (let j = 0; j < newTreeData[i].children.length; j++) {
					for (let k = 0; k < newAllData.length; k++) {
						if (newAllData[k].comp_menu_id === newTreeData[i].children[j].key) {
							newTreeData[i].children[j].children.push({
								title: <PanelNode data={newAllData[k]} isTest={isTest}/>,
								key: 'node'+newAllData[k].id,
							})
						}
					}
				}
			}
		}
		// 删除空的一级目录和二级目录
		for (let i = 0; i < newTreeData.length; i++) {
			// 如果存在二级目录，则遍历二级目录，如果二级目录为空，则删除
			if (newTreeData[i]?.children.length !== 0) {
				for (let j = 0; j < newTreeData[i]?.children.length; j++) {
					if (newTreeData[i]?.children[j]?.children?.length === 0) {
						newTreeData[i]?.children.splice(j, 1)
						j--
					}
				}
			}
			// 删除空的一级目录
			if (newTreeData[i]?.children.length === 0) {
				newTreeData.splice(i, 1)
				i--
			}
		}
		console.log('getMyData ',newTreeData)
		setMyTreeData(newTreeData)
	}

	const init = async () => {
		setLoading(true)
		await Promise.all([getPlatformData(), getMyData()]);
		setLoading(false)
		setFirst(false)
	}

	const changeType = (value) => {
		setType(value+'')
	}
	const keydown = (e) => {
		if(e.keyCode === 13) {
			search()
		}
	}
	// 搜索函数
	const search = () => {
		console.log('into search method ',keyword.current)
		if (keyword.current === '') {
			setSearchMode(false)
			setSearchResult([])
			setPageSum(0)
		} else {
			setSearchMode(true)
			// setLoading(true)
			let res = []
			const allData = type === '平台' ? allPlatformData : allMyData
			for (let i = 0; i < allData.length; i++) {
				if (allData[i].label.indexOf(keyword.current) !== -1) {
					res.push(allData[i])
				}
			}
			setSearchResult(res)
			setPageSum(res.length)
			setFirst(false)
			setLoading(false)
		}
	}
	// render
	// @ts-ignore
	return (
		// 最外层
		<div className={"w-full h-full flex flex-col overflow-x-hidden overflow-y-auto"}>
			{/*菜单栏*/}
			<div className={"w-full flex pl-4"}>
				<TypeList list={typeList} value={type} change={changeType}/>
			</div>
			<div className={"mt-4 w-full flex flex-col"}>
				{/*search框筛选*/}
				<div className={"w-full"} style={{height:'38px',marginBottom:'2px',padding:'1px 16px'}}>
					<SearchBig placeholder='搜索模型'
					           style={{width:'100%'}}
					           ml={false}
					           defaultValue={keyword.current}
					           change={e => keyword.current = e.target.value}
					           keyDown={e=>keydown(e)}/>
				</div>
				{/*结果*/}
				<div className={"w-full flex flex-col"}>
					{/*暂无数据*/}
					{
						first &&
						<Spin spinning={loading} size="default" tip="加载中...">
							<div className="w-full"
									 style={{height:'200px'}}>
							</div>
						</Spin>
					}
					{
						!first && !searchMode &&
						<div className={"w-full flex flex-col"}>
							{
								(     (type === '平台' && platformTreeData.length>0 && (!isTest || defaultExpandedKeys.length>0) )    ||          (type === '我的' && myTreeData.length>0 && (!isTest || defaultExpandedKeys.length>0))        ) &&
								<DirectoryTree
									showIcon={false}
									switcherIcon={<DownOutlined />}
									selectable={false}
									autoExpandParent={false}
									defaultExpandedKeys={defaultExpandedKeys}
									treeData={type === '平台' ? platformTreeData : myTreeData}
								>
								</DirectoryTree>
							}
							{
								!((type === '平台' && platformTreeData.length>0) || (type === '我的' && myTreeData.length>0)) &&
								<div className="w-full flex flex-col justify-center items-center"
										 style={{height:'200px'}}>
									<img src={NoSearchData} alt="" style={{width:'120px',height:'120px'}}/>
									<div className="mt-3 flex text-sm text-black-light">暂无数据</div>
								</div>
							}
						</div>
					}
					{
						!first && searchMode &&
						<div className={"w-full flex flex-col"}
								 style={{}}>
							{
								pageSum===0 && !first &&
								<Spin spinning={loading} size="default" tip="加载中...">
									<div className="w-full flex flex-col justify-center items-center"
											 style={{height:'200px'}}>
										<img src={NoSearchData} alt="" style={{width:'120px',height:'120px'}}/>
										<div className="mt-3 flex text-sm text-black-light">暂无数据</div>
									</div>
								</Spin>
							}
							{/*加载完成 && 有数据 节点卡片*/}
							{
								pageSum > 0 && !first &&
								<Spin spinning={loading} size="default" tip="加载中...">
									<div className="w-full flex flex-col items-center">
										{/*节点卡片*/}
										{
											searchResult.map((_item,_index) => {
												return (
													<div className={"w-full mt-4 flex justify-center items-center"}
													     key={_index}>
														<PanelNode data={_item} isTest={isTest}/>
													</div>
												)
											})
										}
									</div>
								</Spin>
							}
						</div>
					}
				</div>
			</div>
		</div>
	)
}
