import React, {useEffect, useState} from "react";
import SearchDetailHeaderBg from '../../../../icon/SearchDetailHeaderBg.svg'
import {useHistory} from "react-router-dom";
import {Spin} from "antd";
import {Viewer} from "@toast-ui/react-editor";
import { get } from "../../../../axios";
import NavigationComponent from "../../../../components/NavigationComponent";

export default function PolicyLibraryListDetail(props) {
	// state
	const history = useHistory();
	const [data, setData] = useState(null);//搜索详情数据
	const [isLoading, setIsLoading] = useState(false);//搜索详情数据加载状态
	// mounted
	useEffect(()=>{
		const oldUser = JSON.parse(localStorage.getItem('user') || 'null')
		if(oldUser){
			getSearchDetail()
		} else {
			history.replace('/oam/login')
		}
	},[])
	// methods
	const getSearchDetail = async () => {
		// @ts-ignore
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		const {data} = await get(`/oam/city/policy/${props.match.params.city}/${params.id}`)
		setData(data)
		setIsLoading(false)
	}
	// const clickReturn = () => {
	// 	// history.replace('/search')
	// 	history.goBack()
	// }
	// render
	// return (
	// 	<div className={"mt-[90px] w-full flex flex-col items-center"}>
	// 		<div className={"flex flex-col"}
	// 		     style={{width:'62.5vw',minWidth:'800px'}}>
	// 		</div>
	// 	</div>
	// )


	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '政策库管理', router: '/oam/policy-library'},
					{label: (props.match.params.city==='bj'?'北京':'宁夏')+'政策库', router: '/oam/policy-library/list/'+props.match.params.city},
					{label: '政策文件详情', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pb-[140px] mb-8 flex flex-col rounded-lg"}>
				{/*加载效果*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{/*最外层*/}
					<div className={"w-full flex flex-col"}>
						<span className={"pl-[48px] pr-[48px] mt-6"}>政策文件详情</span>
						<div className={"mt-[6px] mb-[200px] w-full flex flex-col bg-white rounded-2xl"}
						     style={{boxShadow: '0px 2px 8px 0px rgba(217,222,238,0.35)'}}>
							{/*头部*/}
							<div className={"w-full pt-[46px] pb-[46px] flex justify-center items-center bg-cover"}
							     style={{
								     borderRadius: '16px 16px 0px 0px',
								     backgroundImage:`url(${SearchDetailHeaderBg})`
							     }}>
								<div className={"text-[28px] text-black-dark font-bold leading-9"}
								     style={{maxWidth:'80%'}}>{data?.title}</div>
							</div>
							{/*内容*/}
							<div className={"w-full pl-[48px] pr-[48px] flex flex-col text-base"}>
								{/*虚线*/}
								<div className={"w-full h-[1px] border border-dashed border-[#E3E3E3]"}/>
								{/*第一行*/}
								<div className={"mt-4 w-full flex justify-between items-center"}>
									{/*左*/}
									<div className={"flex-1 flex items-center"}>
										<span className={""}>发文机构：</span>
										<span className={"flex-1 text-hidden"}>{data?.pub_organ}</span>
									</div>
									{/*右*/}
									<div className={"ml-4 flex items-center"}>
										<span className={""}>发文日期：</span>
										<span className={"w-[126px]"}>{data?.pub_date}</span>
									</div>
								</div>
								{/*第二行*/}
								<div className="mt-2 w-full flex justify-between items-center">
									{/*左*/}
									<div className={"flex-1 flex items-center"}>
										<span className={""}>发文字号：</span>
										<span className={"flex-1 text-hidden"}>{data?.pub_no}</span>
									</div>
									{/*右*/}
									<div className={"ml-4 flex items-center"}>
										<span className={""}>实施日期：</span>
										<span className={"w-[126px]"}>{data?.effect_date}</span>
									</div>
								</div>
								{/*内容*/}
								<div className={"mt-10 pb-10 w-full pl-1 pr-1 flex flex-col"}>
									{
										data?.content &&
										<Viewer initialValue={data?.content}/>
									}
								</div>
							</div>
						</div>
					</div>
				</Spin>
			</div>
		</div>
	)


}
