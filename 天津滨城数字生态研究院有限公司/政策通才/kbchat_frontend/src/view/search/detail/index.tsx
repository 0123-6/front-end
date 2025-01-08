import React, {useEffect, useState} from "react";
import SearchDetailHeaderBg from "../../../icon/SearchDetailHeaderBg.svg";
import {useHistory} from "react-router-dom";
import { get } from "../../../axios";
import {Spin} from "antd";
import {Viewer} from "@toast-ui/react-editor";

export default function SearchDetail(props) {
	// state
	const history = useHistory();
	const [data, setData] = useState(null);//搜索详情数据
	const [loading, setLoading] = useState(false);//搜索详情数据加载状态
	const source = new URLSearchParams(props.location.search)?.get('source')
	// mounted
	useEffect(()=>{
		const oldUser = JSON.parse(localStorage.getItem('user') || 'null')
		if(oldUser){
			getSearchDetail()
		} else {
			history.replace('/login')
		}
	},[])
	// methods
	const getSearchDetail = async () => {
		// @ts-ignore
		const params = {
			id:Number(props.match.params.id)
		}
		setLoading(true)
		const {data} = await get(`/kb/zc/${params.id}`)
		setData(data)
		setLoading(false)
	}
	const clickReturn = () => {
		history.replace('/search')
	}
	// render
	return (
		<div className={"mt-[90px] w-full flex flex-col items-center"}>
			<div className={"flex flex-col"}
			     style={{width:'62.5vw',minWidth:'800px'}}>
				{/*顶部*/}
				{
					source!=='chat' &&
					<div className={"w-full flex justify-end items-center"}>
						<button className="w-[83px] h-[28px] bg-[#FBFBFB] rounded-lg text-base text-black hover:text-main active:text-main-focus"
										style={{}}
										onClick={clickReturn}>{'<返回'}</button>
					</div>
				}
				{/*内容*/}
				<Spin spinning={loading} size="large" tip="加载中...">
					<div className={"mt-[6px] mb-[200px] w-full flex flex-col bg-white rounded-2xl"}
					     style={{boxShadow: '0px 2px 8px 0px rgba(217,222,238,0.35)'}}>
						{/*头部*/}
						<div className={"w-full pt-[46px] pb-[46px] flex justify-center items-center bg-cover"}
						     style={{
							     borderRadius: '16px 16px 0px 0px',
							     backgroundImage:`url(${SearchDetailHeaderBg})`
						     }}>
							<div className={"text-[28px] text-black-dark font-bold leading-9"}
							     style={{
								     maxWidth: '80%',
								     textAlign: 'center', // 居中对齐
								     display: 'flex',
								     flexDirection: 'column',
								     alignItems: 'center', // 在交叉轴上居中对齐
							     }}
							>
								{data?.title}
							</div>
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
									<span className={"flex-1 text-hidden"}>{data?.pub_name}</span>
								</div>
								{/*右*/}
								<div className={"ml-4 flex items-center"}>
									<span className={""}>发文日期：</span>
									<span className={"w-[126px]"}>{data?.pub_time}</span>
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
									<span className={"w-[126px]"}>{data?.effect_time}</span>
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
				</Spin>
			</div>
			{/*<NavigationComponent data={[*/}
			{/*  {label: '搜索', router: '/my-model', icon: MyModel, iconActive: MyModelLight},*/}
			{/*  {label:mode,disabled:true},*/}
			{/*]}/>*/}
		</div>
	)
}
