import React, {useEffect, useState} from 'react';
import {get} from "../../axios";
import NavigationComponent from "../../components/NavigationComponent";
import {Popover, Spin, Tooltip} from "antd";
import TypeList from "../../components/TypeList";
import {Viewer} from "@toast-ui/react-editor";
import {ModelTypeComponent} from "../my-model/detail/MyModelDetailDetail";
import {PopoverContent} from "../data-element/common/PopoverContent";
import StatusComponent from "./components/StatusComponent";
import ApiInfoDetail from "../my-model/detail/components/ApiInfoDetail";
import ModelLibrary from "./icon/ModelLibrary.svg";
import ModelLibraryLight from "./icon/ModelLibraryLight.svg";

export default function ModelLibraryDetail(props) {
	console.log('props: ',props)
	// state
	const [data,setData] = useState(null)
	const [isLoading,setIsLoading] = useState(false)
	// 模型类型列表
	const [modelTypeList, setModelTypeList] = useState([]);
	const menuList = ['模型描述','API接口']
	const [menu,setMenu] = useState('')
	// mounted
	useEffect(()=>{
		getModelTypeList()
		setMenu('模型描述')
	},[])
	useEffect(()=>{
		if (modelTypeList.length>0){
			getData()
		}
	},[modelTypeList])
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
	// @ts-ignore
	const getFalseData = async (_params) => {
		return new Promise<any>((resolve, _reject) => {
			setTimeout(() => {
				const data = JSON.parse(JSON.stringify(props?.location?.params?.data))
				const res = {
					"code": 0,
					"msg": "success",
					"data": data
				}
				resolve(res);
			}, 200);
		});
	}
	const getData = async () => {
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		const {data} = await get(`/drapi/comp/comps/${params.id}`)
		setData(data)
		setIsLoading(false)
	}
	const changeMenu = (value) => {
		setMenu(value + '')
	}
	// render
	return (
		// 最外层
		<div className="w-full bg flex flex-col items-center">
			<NavigationComponent data={[
				{label: '模型库', router: '/model-library', icon: ModelLibrary, iconActive: ModelLibraryLight},
				{label: '查看',disabled:true},
			]}/>
			{/*主体内容*/}
			<div className="pb-32 mb-8 flex flex-col bg-white shadow-card rounded text-sm leading-[14px]"
			     style={{width: '960px'}}>
				<Spin spinning={isLoading} size="large" tip="加载中...">
					<div className={"mt-6 w-full pl-[50px] pr-[50px] flex flex-col"}>
						{/*上*/}
						<div className="w-full h-[148px] flex justify-between">
							{/*左*/}
							<img src={data?.cover} alt="" style={{width:'264px',height:'100%',borderRadius:'8px'}}/>
							{/*右*/}
							<div className={"w-[578px] flex flex-col"}>
								<div className={"w-full flex items-center"}>
									<span className={"text-lg text-black-dark font-medium"}>{data?.name}</span>
								</div>
								<Tooltip title={(data?.abstract && data?.abstract.length>82)?data?.abstract:null}
								         overlayClassName='my-model-detail-desc'>
									<div className={"mt-2 w-full h-[50px] text-sm leading-[25px] text-hidden-2"}>
										{data?.abstract}
									</div>
								</Tooltip>
								<div className={"mt-3 flex items-center"}>
									<StatusComponent status_desc={data?.is_mine ? '我的' : data?.auth_status_desc}/>
									{
										data?.type !== 1 &&
										<ModelTypeComponent status_desc={data?.model_type_desc} className={"ml-2"}/>
									}
								</div>
								{/*版本+更新时间*/}
								<div className={"mt-[11px] flex items-center"}>
									{/*用户信息*/}
									{/*头像和名字*/}
									<Popover title={null}
									         placement="leftTop"
									         overlayClassName={'person-popover-2'}
									         trigger="hover"
									         open={false}
									         content={PopoverContent({user:data?.user})}
									>
										<div className={"flex items-center"}>
											{/*头像*/}
											<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
											     style={{width: '22px',minWidth:'22px',height: '22px',minHeight:'22px'}}>
												<img className="" src={(data?.user?.avatar)?(data?.user?.avatar):null} alt="" width="22px"/>
											</div>
											<span className={"ml-2 flex items-center text-sm max-w-[190px] leading-[14px]"}>{data?.user?.nickname}</span>
										</div>
									</Popover>
									<span className={"ml-7 flex items-center"}>版本 {data?.version}</span>
									<span className={"ml-8 flex items-center"}>更新时间：{data?.updated_at}</span>
								</div>
							</div>
						</div>
						{/*下*/}
						<div className={"mt-4 w-full flex flex-col"}>
							{/*选项菜单栏*/}
							<TypeList list={menuList} value={menu} change={changeMenu} className={"pb-2"}/>
							{
								menu==='模型描述' && data?.description &&
								<Viewer initialValue={data?.description}/>
							}
							{
								menu==='API接口' &&
								<div className={"mt-2 w-full flex flex-col"}>
									<ApiInfoDetail data={data}
									               mode={(data?.is_mine || data?.auth_status===1) ? 'normal' : (data?.auth_status===0 ? 'unauthorized' : (data?.auth_status===2)?'expired':null)}
									/>
								</div>
							}
						</div>
					</div>
				</Spin>
			</div>
		</div>
	)
}
