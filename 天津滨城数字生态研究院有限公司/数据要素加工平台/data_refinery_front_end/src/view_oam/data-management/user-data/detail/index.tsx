import {message, Popover, Spin, Table, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import NavigationComponent from "../../../../components/NavigationComponent";
import DraggableModalPrompt from "../../../../components/draggable-modal/draggable-modal-prompt";
import ReviewModal from "../components/ReviewModal";
import {hintMap} from "../index";
import { post } from "../../../../axios";
import StatusShow from "../../../../view/data-resource/my-data/components/StatusShow";
import ButtonFifth from "../../../../components/ButtonFifth";
import ViewSvg from "../../../../view/data-resource/icon/ViewSvg";
import TrueSvg from "../../../../view/data-resource/icon/TrueSvg";
import Title from "../../../../components/Title";
import {columns1, data1, dataPreviewColumnsMap, dataPreviewDataMap} from "../../../../view/data-resource/static";
import ButtonMain from "../../../../components/ButtonMain";
import {PopoverContent} from "../../../../view/data-element/common/PopoverContent";
import DataManagementSvg from "../../../layout/icon/DataManagement";

export default function UserDataDetail(props) {
	// state
	const [data,setData] = useState(null)
	const [isLoading,setIsLoading] = useState(false)
	// 弹框
	// 审核弹框
	const [showReviewModal, setShowReviewModal] = useState(false);
	// 上线弹框
	const [showOnlineModal, setShowOnlineModal] = useState(false);
	// 下线弹框
	const [showOfflineModal, setShowOfflineModal] = useState(false);
	// mounted
	useEffect(()=>{
		getData()
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
		// @ts-ignore
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		const {data} = await getFalseData(params)
		// const {data} = await get(`/drapi/oam/user/comps/${params.id}`)
		// @ts-ignore
		// const {data} = await falseGetData()
		setData(data)
		setIsLoading(false)
	}
	// 弹框
	// 审核弹框
	const reviewModalOnOk = async (_data) => {
		console.log('into ReviewModalOnOk')
		console.log(_data)
		const params = {
			comp_id: data.id,
			audit_status: 1,
			..._data,
		}
		await post('/drapi/oam/user/comps/audit', params)
		setShowReviewModal(false)
		message.success('审核通过成功')
		getData()
	}
	const reviewModalOnCancel = () => {
		console.log('into ReviewModalOnCancel')
		setShowReviewModal(false)
	}
	const reviewModalOnReject = async (_data) => {
		console.log('into ReviewModalOnReject')
		console.log(_data)
		const params = {
			comp_id: data.id,
			audit_status: 2,
			..._data,
		}
		await post('/drapi/oam/user/comps/audit', params)
		setShowReviewModal(false)
		message.success('审核驳回成功')
		getData()
	}
	// 上线弹框
	const onlineModalOnOk = async (_data) => {
		console.log('into OnlineModalOnOk')
		console.log(_data)
		const params = {
			..._data,
		}
		await post(`/drapi/oam/comps/publish/${data.id}`, params)
		setShowOnlineModal(false)
		message.success('上线成功')
		getData()
	}
	const onlineModalOnCancel = () => {
		console.log('into OnlineModalOnCancel')
		setShowOnlineModal(false)
	}
	// 下线弹框
	const offlineModalOnOk = async (_data) => {
		console.log('into OfflineModalOnOk')
		console.log(_data)
		await post(`/drapi/oam/comps/offline/${data.id}`)
		setShowOfflineModal(false)
		message.success('下线成功')
		getData()
	}
	const offlineModalOnCancel = () => {
		console.log('into OfflineModalOnCancel')
		setShowOfflineModal(false)
	}
	const handleReview = () => {
		setShowReviewModal(true)
	}
	const handleOnline = () => {
		setShowOnlineModal(true)
	}
	const handleOffline = () => {
		setShowOfflineModal(true)
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '数据管理', iconSvg: DataManagementSvg, disabled: true},
					{label: '用户数据', router: '/oam/data-management/user-data',},
					{label: '查看详情', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 pb-[140px] flex flex-col rounded-lg"}>
				<Spin spinning={isLoading} size="large" tip="加载中...">
					<div className={"w-full flex flex-col"}>
						{/*头部信息*/}
						<div className={"w-full flex"}>
							{/*左*/}
							<img src={data?.coverUrl} alt="" style={{width:'264px',height:'148px',borderRadius:'8px'}}/>
							{/*右*/}
							<div className={"flex-1 ml-7 flex flex-col"}>
								<div className={"w-full flex justify-between items-start"}>
									<div className={"flex items-start"}>
										<Tooltip title={(data?.name && data?.name.length>58)?data?.name:null}
										         overlayClassName='my-model-detail-desc'>
											<div className={"flex-1 text-lg text-black-dark font-medium text-hidden-2"}>{data?.name}</div>
										</Tooltip>
										<StatusShow status={data?.status_desc} className={"ml-2"}/>
									</div>
								</div>
								<div className={"mt-[5px] w-full flex"}>
									<Tooltip title={(data?.description && data?.description.length>69)?data?.description:null}
									         overlayClassName='my-model-detail-desc'>
										<div className={"flex-1 h-[75px] min-h-[75px] text-sm leading-[25px] text-hidden-3"}>
											{data?.description}
										</div>
									</Tooltip>
									{
										data?.status_desc &&
										<div className={"flex items-start"}>
											<ButtonMain text={'审核'} click={handleReview} style={{width: '86px',height:'32px'}} disabled={!(data.status_desc==='上线审核'||data.status_desc==='下线审核')} className={"ml-6"}/>
											<ButtonFifth text={'上线'} click={handleOnline} style={{width: '86px',height:'32px'}} disabled={!(data.status_desc==='未上线'||data.status_desc==='驳回上线'||data.status_desc==='已下线')} className={"ml-2"}/>
											<ButtonFifth text={'下线'} click={handleOffline} style={{width: '86px',height:'32px'}} disabled={!(data.status_desc==='已上线'||data.status_desc==='驳回下线')} className={"ml-2"}/>
										</div>
									}
								</div>

								{/*<div className={"flex justify-center items-center rounded text-main text-sm"}*/}
								{/*     style={{width: '80px', height: '28px', background: 'rgba(76,170,180,0.21)', lineHeight: '14px'}}>*/}
								{/*	{data?.app1}*/}
								{/*</div>*/}
								{/*3个标签*/}
								<div className={"mt-[1px] flex items-center text-xs"}>
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
								<div className={"mt-[18px] flex items-center"}>
									{/*提供者*/}
									<div className={"flex items-center"}>
										<span className={"flex items-center text-sm"} style={{lineHeight: '14px'}}>提供者：</span>
										{/*头像和名字*/}
										<Popover title={null}
										         placement="leftTop"
										         overlayClassName={'person-popover-2'}
										         trigger="hover"
										         content={PopoverContent({user:data?.user})}
										>
											<div className={"flex items-center"}>
												{/*头像*/}
												<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
												     style={{width: '28px',minWidth:'28px',height: '28px',minHeight:'28px'}}>
													<img className="" src={(data?.user?.avatar)?(data?.user?.avatar):null} alt="" width="28px"/>
												</div>
												<span className={"ml-2 flex items-center text-sm text-hidden max-w-[190px]"}
												      style={{lineHeight: '14px'}}>{data?.user?.nickname}</span>
											</div>
										</Popover>
									</div>
									{/*时间*/}
									<div className={'ml-[38px] flex items-center text-black-light'}>
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
					</div>
				</Spin>
			</div>
			{/*弹窗*/}
			{/*上线弹框*/}
			<DraggableModalPrompt
				title={'上线'}
				// hint={'确认是否需要上线数据，数据将进入审核流程，审核流程中无法进行再次编辑信息'}
				show={showOnlineModal}
				onOk={onlineModalOnOk}
				onCancel={onlineModalOnCancel}>
				<span className="text-sm text-black flex items-center">确认上线<span className="text-main pl-1 pr-1 max-w-[180px] text-hidden">{data?.name}</span>吗？</span>
			</DraggableModalPrompt>
			{/*下线弹框*/}
			<DraggableModalPrompt
				title={'下线'}
				// hint={'确认是否下线数据，下线数据后该数据将无法使用，并数据将进入审核流程，审核流程中无法进行再次编辑信息'}
				show={showOfflineModal}
				onOk={offlineModalOnOk}
				onCancel={offlineModalOnCancel}>
				<span className="text-sm text-black flex items-center">确认下线<span className="text-main pl-1 pr-1 max-w-[180px] text-hidden">{data?.name}</span>吗？</span>
			</DraggableModalPrompt>
			<ReviewModal title={'审核'}
			             hint={hintMap[data?.status_desc]}
			             show={showReviewModal}
			             data={data}
			             onOk={reviewModalOnOk}
			             onCancel={reviewModalOnCancel}
			             onReject={reviewModalOnReject}/>
		</div>
	)
}
