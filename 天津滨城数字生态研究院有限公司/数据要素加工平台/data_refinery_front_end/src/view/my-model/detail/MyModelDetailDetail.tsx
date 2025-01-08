import React, {useEffect, useState} from "react";
import StatusShow from "../components/StatusShow";
import {Table, Tooltip} from "antd";
import ButtonFifth from "../../../components/ButtonFifth";
import TypeList from "../../../components/TypeList";
import {Viewer} from "@toast-ui/react-editor";
import {ColumnsType} from "antd/es/table";
import {showLastName} from "../../../utils/util";
import ApiInfoDetail from "./components/ApiInfoDetail";
import TestModal from "../components/TestModal";
import TestModalSecond from "../components/TestModalSecond";
import {post} from "../../../axios";

// 自定义展开图标组件
export const CustomExpandIcon = ({ expanded, onExpand, record,changePosition=true }) => {
	return expanded ? (
			<span className={`mr-2 ${changePosition?'relative top-1':''} cursor-pointer`}
			      onClick={(e) => onExpand(record, e)}>
			<svg viewBox="64 64 896 896" focusable="false" data-icon="folder-open" width="19px" height="19px" fill="currentColor" aria-hidden="true"><path d="M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 00-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z"/></svg>
		</span>
	) : (
		<span className={`mr-2 ${changePosition?'relative top-1':''} cursor-pointer`}
		      onClick={(e) => onExpand(record, e)}>
			<svg viewBox="64 64 896 896" focusable="false" data-icon="folder" width="19px" height="19px" fill="currentColor" aria-hidden="true"><path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z"/></svg>
		</span>
	);
};

interface IProps {
	data:any,
	changeMode:(mode:string)=>void,
	onOk:(any)=>void,
}

interface DataType {
	key: React.ReactNode;
	name: string;
	human_size: string;
	children?: DataType[];
}

export const columns: ColumnsType<DataType> = [
	{
		title: '文件包内容',
		dataIndex: 'name',
		key: 'name',
		width: '50%',
	},
	{
		title: '大小',
		dataIndex: 'human_size',
		key: 'human_size',
		width: '50%',
	},
];

interface IModelTypeComponent {
	status_desc:string;
	className?:string;
	color?:string;
}

export function ModelTypeComponent(props:IModelTypeComponent) {
	// status
	const {status_desc,className='',color='blue'} = props
	// render
	return (
		<div className={`h-[22px] pl-3 pr-3 flex justify-center items-center rounded-xl text-xs leading-[12px] ${className}
		      ${color==='blue'?'bg-[#e1eaf8] text-blue':''}
		      ${color==='main'?'bg-[#dff0f1] text-main':''}
		`}>
			{status_desc}
		</div>
	)
}

export default function MyModelDetailDetail(props:IProps) {
	// state
	const {data,changeMode,onOk} = props
	const menuList = ['模型描述','模型文件','API接口']

	const [menu,setMenu] = useState('')
	// 测试弹框
	const [showTestModal,setShowTestModal] = useState(false);
	// 测试弹框2
	const [showTestModalSecond,setShowTestModalSecond] = useState(false);

	// mounted
	useEffect(()=>{
		setMenu('模型描述')
	},[])
	// methods
	const changeMenu = (value) => {
		setMenu(value + '')
	}
	// 展示测试弹框
	const handleTest = () => {
		// (0, "未知状态") ok
		// (1, "未开始测试") ok
		// (2, "测试中") ok
		// (3, "测试成功")
		// (4, "测试失败")
		console.log('into handleTest, data: ', data)
		if(data.test_status === 1 || data.test_status === 0) {
			setShowTestModal(true)
		} else if (data.test_status === 2 || data.test_status === 3 || data.test_status === 4) {
			// 如果存在experiment_id，则跳转到实验详情页面,否则打开test的第二个弹框
			if (data.experiment_id) {
				window.open(location.origin+'/experiment/drag/test/'+data.experiment_id)
			} else {
				setShowTestModalSecond(true)
			}
		}
	}

	const testModalOnOk = async (_data) => {
		console.log('into testModalOnOk, _data: ', _data)
		const params = {
			comp_id: data.id,
			..._data,
		}
		const res = await post('/drapi/comp/test', params)
		console.log('res: ', res)
		setShowTestModal(false)
		onOk(null)
		setShowTestModalSecond(true)
	}
	const testModalOnCancel = () => {
		setShowTestModal(false)
	}
	// 展示测试弹框second
	const resetTest = () => {
		setShowTestModalSecond(false)
		setShowTestModal(true)
	}
	const testModalSecondOnCancel = () => {
		setShowTestModalSecond(false)
		onOk(null)
	}
	// render
	return (
		// 最外层
		<div className={"mt-6 w-full pl-[50px] pr-[50px] flex flex-col"}>
			{/*上*/}
			<div className="w-full h-[148px] flex justify-between">
				{/*左*/}
				<img src={data?.modelCoverUrl} alt="" style={{width:'264px',height:'100%',borderRadius:'8px'}}/>
				{/*右*/}
				<div className={"w-[578px] flex flex-col"}>
					<div className={"w-full flex justify-between items-center"}>
						<div className={"flex items-center"}>
							<span className={"text-lg text-black-dark font-medium"}>{data?.modelName}</span>
							<StatusShow status={data?.status_desc} className={"ml-4"}/>
						</div>
						{
							data?.status_desc &&
							<div className={"flex items-center"}>
								{data?.status_desc!=='已发布' && <ButtonFifth text={'测试'} click={handleTest} style={{width:'81px',height:'26px'}} disabled={data?.status_desc==='发布审核中'||data?.status_desc==='下线审核中'||data?.status_desc==='下线被驳回'}/>}
								{data?.status_desc!=='已发布' && <ButtonFifth text={'编辑'} click={()=>changeMode('编辑')} style={{width:'81px',height:'26px'}} disabled={data?.status_desc==='发布审核中'||data?.status_desc==='下线审核中'||data?.status_desc==='下线被驳回'} className={"ml-[9px]"}/>}
								{data?.status_desc==='已发布' && <ButtonFifth text={'体验'} click={null} style={{width:'81px',height:'26px'}} className={"ml-[9px]"}/>}
							</div>
						}
					</div>
					<Tooltip title={(data?.modelSimpleDescription && data?.modelSimpleDescription.length>82)?data?.modelSimpleDescription:null}
					         overlayClassName='my-model-detail-desc'>
						<div className={"mt-2 w-full h-[50px] min-h-[50px] text-sm leading-[25px] text-hidden-2"}>
							{data?.modelSimpleDescription}
						</div>
					</Tooltip>
					<div className={"mt-4 flex items-center"}>
						<ModelTypeComponent status_desc={data?.modelTypeDesc}/>
					</div>
					{/*版本+更新时间*/}
					<div className={"mt-[11px] flex items-center"}>
						<span className={"flex items-center"}>版本 {data?.modelVersion}</span>
						<span className={"ml-8 flex items-center"}>更新时间：{data?.update_at}</span>
					</div>
				</div>
			</div>
			{/*下*/}
			<div className={"w-full flex flex-col"}>
				{/*选项菜单栏*/}
				<TypeList list={menuList} value={menu} change={changeMenu} className={"pb-2"}/>
				{
					menu==='模型描述' && data?.modelDescription &&
					<Viewer initialValue={data?.modelDescription}/>
				}
				{
					menu==='模型文件' &&
					<div className={"mt-2 w-full flex flex-col"}>
						{/*文件名称*/}
						<div className={"flex items-center"}>{data?.modelFileUrl ? showLastName(data?.modelFileUrl) : data?.mirrorImage}</div>
						<Table
							className={"mt-3"}
							size='small'
							defaultExpandAllRows={true}
							dataSource={data?.modelFileSizeList}
							// @ts-ignore
							columns={columns}
							pagination={false}
							footer={null}
							expandable={{
								expandIcon: CustomExpandIcon, // 使用自定义的展开图标组件
							}}
						/>
					</div>
				}
				{
					menu==='API接口' &&
					<div className={"mt-2 w-full flex flex-col"}>
						<ApiInfoDetail data={data}
						               mode={data?.status_desc==='已发布'?'normal':'noData'}
						/>
					</div>
				}
			</div>
			<TestModal title={'启动测试服务'}
			           show={showTestModal}
			           data={data}
			           onOk={testModalOnOk}
			           onCancel={testModalOnCancel}/>
			<TestModalSecond title='提示'
			                 show={showTestModalSecond}
			                 data={{
				                 ...data,
				                 url:'/drapi/comp/test',
			                 }}
			                 onReset={resetTest}
			                 onCancel={testModalSecondOnCancel}/>
		</div>
	)
}
