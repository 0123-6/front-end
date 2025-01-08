import React, {useState} from "react";
import {message, Table, Tooltip} from "antd";
// import TableInput from "../../../../icon/element-processing/TableInput";
// import TextInput from "../../../../icon/element-processing/TextInput";
// import PictureInput from "../../../../icon/element-processing/PictureInput";
// import VideoInput from "../../../../icon/element-processing/VideoInput";
// import MusicInput from "../../../../icon/element-processing/MusicInput";
import ViewSvg from "../../icon/ViewSvg";
import TrueSvg from "../../icon/TrueSvg";
import Title from "../../../../components/Title";
import {columns1, data1, dataPreviewColumnsMap, dataPreviewDataMap} from "../../static";
import StatusShow from "../components/StatusShow";
import ButtonFifth from "../../../../components/ButtonFifth";
import DraggableModalPrompt from "../../../../components/draggable-modal/draggable-modal-prompt";

interface IProps {
	data:any,
	changeMode:(mode:string)=>void,
	onOk:(any)=>void,
}

export default function DataResourceMyDataDetailDetail(props:IProps) {
	// state
	const {data,changeMode,onOk} = props

	// 弹框
	// 上线弹框
	const [showOnlineModal, setShowOnlineModal] = useState(false);
	// mounted
	const clickOnline = () => {
		setShowOnlineModal(true)
	}
	const onlineModalOnOk = async () => {
		// await post('/drapi/comp/mycomps/'+selectedItem.current.id+'/online', null)
		message.success('上线成功')
		onOk(null)
		setShowOnlineModal(false)
	}
	const onlineModalOnCancel = () => {
		setShowOnlineModal(false)
	}
	// methods
	// render
	return (
		// 最外层
		<div className={"mt-6 w-full pl-[50px] pr-[50px] flex flex-col"}>
			{/*头部信息*/}
			<div className={"w-full flex"}>
				{/*左*/}
				<img src={data?.coverUrl} alt="" style={{width:'264px',height:'148px',borderRadius:'8px'}}/>
				{/*右*/}
				<div className={"flex-1 ml-7 flex flex-col"}>
					<div className={"w-full flex justify-between items-start"}>
						<div className={"flex items-start"}>
							<Tooltip title={(data?.name && data?.name.length>28)?data?.name:null}
							         overlayClassName='my-model-detail-desc'>
								<div className={"max-w-[260px] text-lg text-black-dark font-medium text-hidden-2"}>{data?.name}</div>
							</Tooltip>
							<StatusShow status={data?.status_desc} className={"ml-2"}/>
						</div>
						{
							data?.status_desc &&
							<div className={"flex items-center"}>
								<ButtonFifth text={'上线'} click={clickOnline} style={{width:'79px',height:'24px'}} disabled={!(data.status_desc==='未上线'||data.status_desc==='驳回上线'||data.status_desc==='已下线')}/>
								<ButtonFifth text={'编辑'} click={()=>changeMode('编辑')} style={{width:'79px',height:'24px'}} disabled={!(data.status_desc==='未上线' || data.status_desc==='驳回上线' || data.status_desc==='已下线')} className={"ml-[11px]"}/>
							</div>
						}
					</div>
					<Tooltip title={(data?.description && data?.description.length>80)?data?.description:null}
					         overlayClassName='my-model-detail-desc'>
						<div className={"mt-2 w-full h-[50px] min-h-[50px] text-sm leading-[25px] text-hidden-2"}>
							{data?.description}
						</div>
					</Tooltip>
					{/*<div className={"flex justify-center items-center rounded text-main text-sm"}*/}
					{/*     style={{width: '80px', height: '28px', background: 'rgba(76,170,180,0.21)', lineHeight: '14px'}}>*/}
					{/*	{data?.app1}*/}
					{/*</div>*/}
					{/*3个标签*/}
					<div className={"mt-3 flex items-center text-xs"}>
						<div className={"mr-2 flex justify-center items-center rounded-2xl text-main"}
						     style={{width: '74px', height: '23px', background: '#e6f3f5'}}>
							{data?.industry}
						</div>
						<div className={"mr-2 flex justify-center items-center rounded-2xl"}
						     style={{width: '74px', height: '23px', background: '#eeefef'}}>
								{/*<span*/}
								{/*	className="mr-1 flex items-center text-white-svg-experiment hover:text-white-svg-experiment-hover">*/}
								{/*	{data?.input_type === '表格' && <TableInput/>}*/}
								{/*	{(data?.input_type === '文本' || data?.input_type === 'text') && <TextInput/>}*/}
								{/*	{data?.input_type === '图像' && <PictureInput/>}*/}
								{/*	{data?.input_type === '视频' && <VideoInput/>}*/}
								{/*	{data?.input_type === '音频' && <MusicInput/>}*/}
								{/*	{data?.input_type === '向量' && <TextInput/>}*/}
								{/*</span>*/}
							{data?.type_desc}数据
						</div>
						<div className={"mr-2 flex justify-center items-center rounded-2xl"}
						     style={{width: '74px', height: '23px', background: '#eeefef'}}>
							22.15MB
						</div>
						<div className={"mr-2 flex justify-center items-center rounded-2xl"}
						     style={{width: '74px', height: '23px', background: '#eeefef'}}>
							样本:10000
						</div>
					</div>
					{/*提供者行*/}
					<div className={"mt-2 flex items-center"}>
						{/*时间*/}
						<div className={'flex items-center text-black-light'}>
							<span className={"flex items-center text-black"}>创建时间：2023-03-10</span>
						</div>
						{/*浏览次数*/}
						<div style={{marginLeft: '32px'}}
						     className={'flex items-center text-black-light'}>
							<ViewSvg/>
							<span className={"ml-1.5 flex items-center text-black"}>324</span>
						</div>
						{/*对号*/}
						<div style={{marginLeft: '38px'}}
						     className={'flex items-center text-black-light'}>
							<TrueSvg/>
							<span className={"ml-1.5 flex items-center text-black"}>142</span>
						</div>
					</div>
				</div>
			</div>
			{
				data?.type === 'csv' &&
				<>
					{/*title*/}
					<Title title="字段描述" style={{marginTop: '24px'}}/>
					<Table columns={columns1}
								 dataSource={data1}
								 pagination={false}
								 className={"mt-2"}
								 size='small'/>
				</>
			}
			{/*数据预览*/}
			<Title title="数据预览" style={{marginTop: '12px'}}/>
			<Table
				size='small'
				className={"mt-2"}
				dataSource={dataPreviewDataMap[data?.type]}
				// @ts-ignore
				columns={dataPreviewColumnsMap[data?.type]}
				pagination={false}
				scroll={{ x: 'max-content' }} // 设置自适应宽度
			/>
			{/*上线弹框*/}
			<DraggableModalPrompt
				title={'上线'}
				hint={'确认是否需要上线数据，数据将进入审核流程，审核流程中无法进行再次编辑信息'}
				show={showOnlineModal}
				onOk={onlineModalOnOk}
				onCancel={onlineModalOnCancel}>
				<span className="text-sm text-black flex items-center">确认上线<span className="max-w-[180px] text-hidden text-main pl-1 pr-1">{data?.name}</span>吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
