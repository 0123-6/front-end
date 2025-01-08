import React, {useEffect, useState} from "react";
import {convertDataStructure} from "../../../view/my-model/detail";
import NavigationComponent from "../../../components/NavigationComponent";
import ModelManagementSvg from "../../layout/icon/ModelManagementSvg";
import {Spin, Table, Tooltip} from "antd";
import TypeList from "../../../components/TypeList";
import {Viewer} from "@toast-ui/react-editor";
import {columns, CustomExpandIcon} from "../../../view/my-model/detail/MyModelDetailDetail";
import StatusShow from "./components/StatusShow";
import TypeShowComponent from "./components/TypeShowComponent";
import DownloadSvg from "./icon/DownloadSvg";
import {showLastName} from "../../../utils/util";
import { get } from "../../../axios";
import ApiInfoDetail from "../../../view/my-model/detail/components/ApiInfoDetail";

export default function UserModelDetail(props) {
	// state
	const [data,setData] = useState(null)
	const [isLoading,setIsLoading] = useState(false)
	const menuList = ['模型描述','模型文件','API接口']
	const [menu,setMenu] = useState('')
	// mounted
	useEffect(()=>{
		setMenu('模型描述')
		getData()
	},[])
	// methods
	const changeMenu = (value) => {
		setMenu(value + '')
	}
	// methods
	const getData = async () => {
		// @ts-ignore
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		const {data} = await get(`/drapi/oam/user/comps/${params.id}`)
		// @ts-ignore
		// const {data} = await falseGetData()
		setData(changeDataFormat(data))
		setIsLoading(false)
	}
	const changeDataFormat = (data) => {
		return {
			id: data.id,
			modelFormat: data.model_framework,
			modelFileUrl: data.model_file.path,
			mirrorImage: data.mirror_image,
			modelFileSizeList: convertDataStructure(data.model_file.structure),
			modelName: data.name,
			modelCoverUrl: data.cover,
			modelType: data.model_type_id,
			// modelTypeList: modelTypeList,
			modelTypeDesc: data.model_type_desc,
			modelClass: data.comp_menu_id,
			// modelClassList: modelClassList,
			modelIcon: data.icon_id,
			labelMapping: data.label_mapping,
			modelVersion: data.version,
			modelSimpleDescription: data.abstract,
			modelDescription: data.description,
			update_at: data.updated_at,
			status_desc: data.sub_status_desc,
			api_info: data?.api_info,
		}
	}
	const clickDownload = () => {
		if (data?.modelFileUrl) {
			window.open(location.origin+data?.modelFileUrl)
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
					{label: '用户模型', router: '/oam/model-management/user-model'},
					{label: '查看详情', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 pb-[140px] flex flex-col rounded-lg"}>
				<Spin spinning={isLoading} size="large" tip="加载中...">
					<div className={"w-full flex flex-col"}>
						{/*上*/}
						<div className="w-full max-w-[1166px] h-[148px] flex">
							{/*左*/}
							<img src={data?.modelCoverUrl} alt="" style={{width:'264px',height:'100%',borderRadius:'8px'}}/>
							{/*右*/}
							<div className={"ml-[18px] w-[578px] flex flex-col"}>
								<div className={"w-full flex justify-between items-center"}>
									<div className={"flex items-center"}>
										<span className={"text-lg text-black-dark font-medium"}>{data?.modelName}</span>
										<StatusShow status={data?.status_desc} className={"ml-4"}/>
									</div>
								</div>
								<Tooltip title={(data?.modelSimpleDescription && data?.modelSimpleDescription.length>82)?data?.modelSimpleDescription:null}
								         overlayClassName='my-model-detail-desc'>
									<div className={"mt-2 w-full h-[50px] text-sm leading-[25px] text-hidden-2"}>
										{data?.modelSimpleDescription}
									</div>
								</Tooltip>
								<div className={"mt-2 h-[22px] flex items-center"}>
									<TypeShowComponent name={data?.modelTypeDesc}/>
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
							<TypeList list={menuList} value={menu} change={changeMenu} showLine={true}/>
							<div className={"mt-2 w-full max-w-[1166px] flex flex-col"}>
								{
									menu==='模型描述' && data?.modelDescription &&
									<Viewer initialValue={data?.modelDescription}/>
								}
								{
									menu==='模型文件' &&
									<div className={"mt-2 w-full flex flex-col"}>
										{/*文件名称*/}
										<div className={"flex items-center"}>
											{/*展示最后一个/之后的内容*/}
											<div className={"flex items-center"}>{data?.modelFileUrl ? showLastName(data?.modelFileUrl) : data?.mirrorImage}</div>
											{
												data?.modelFileUrl &&
												<div className={"ml-[35px] flex items-center cursor-pointer hover:text-main"}
														 onClick={clickDownload}>
													<DownloadSvg/>
													<span className={"ml-1 flex items-center"}>下载</span>
												</div>
											}
										</div>
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
						</div>
					</div>
				</Spin>
			</div>
		</div>
	)
}
