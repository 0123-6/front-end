import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import { get } from "../../../../axios";
import NavigationComponent from "../../../../components/NavigationComponent";
import {Spin, Tooltip} from "antd";
import {UserAvatarAndName} from "../../session-management";
import FeedbackLikeSvg from '../../../icon/FeedbackLikeSvg.svg'
import FeedbackUnlikeSvg from '../../../icon/FeedbackUnlikeSvg.svg'
import {Viewer} from "@toast-ui/react-editor";

export default function QuestionManagementDetail(props) {
	// state
	// @ts-ignore
	const history = useHistory();
	const [data,setData] = useState(null)
	const [isLoading,setIsLoading] = useState(false)
	// mounted
	useEffect(()=>{
		getData()
	},[])
	// methods
	const getData = async () => {
		const params = {
			id:Number(props.match.params.id)
		}
		setIsLoading(true)
		const {data} = await get(`/oam/question/${params.id}`)
		setData(data)
		setIsLoading(false)
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '问题管理', disabled: true},
					{label: '问题管理', router: '/oam/question-management/question-management'},
					{label: '问题详情', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pb-[140px] mb-8 flex flex-col rounded-lg"}>
				{/*加载效果*/}
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{/*最外层*/}
					<div className={"w-full flex flex-col"}>
						{/*上面*/}
						<div className={"w-full flex flex-col pl-[32px] pr-[32px] pt-6 pb-[22px]"}
						     style={{
							     backgroundImage: 'linear-gradient(171deg, rgba(162, 182, 255, 0.05), white)',
							     borderRadius: '8px 8px 0px 0px',
						     }}>
							<span className={"text-base font-medium"}>问题详情</span>
							<div className={"mt-[29px] flex items-center"}>
								<UserAvatarAndName user={data?.user}/>
								<span className={"ml-[19px]"}>提问于{data?.created_at}</span>
							</div>
							<div className={"mt-[18px] flex items-start"}>
								{/*<div className={"w-[52px] h-[27px] flex justify-center items-center"}*/}
								{/*     style={{*/}
								{/*	     background: 'rgba(1,71,235,0.22)',*/}
								{/*	     borderRadius: '8px 8px 0px 8px',*/}
								{/*     }}>*/}
								{/*	<span className={"flex items-center text-sm text-[#0147EB]"}>会话</span>*/}
								{/*</div>*/}
								<span className={"flex-1 flex-wrap text-[22px] leading-[27px] text-black-dark font-medium"}>{data?.question}</span>
							</div>
						</div>
						{/*下面*/}
						<div className={"bg-white flex flex-col pl-8 pr-8 mt-[27px]"}>
							{/*问题答案*/}
							<div className={"flex items-center"}>
								<div className={"w-[4px] h-[12px] bg-main rounded-sm"}/>
								<span className={"ml-2 mr-[13px] text-base text-black-dark"}>问题答案</span>
								{
									data?.like===1 &&
									<Tooltip title={'喜欢'} overlayClassName='like-or-unlike'>
										<img src={FeedbackLikeSvg} alt=""/>
									</Tooltip>
								}
								{
									data?.like===-1 &&
									<Tooltip title={'不喜欢'} overlayClassName='like-or-unlike'>
										<img src={FeedbackUnlikeSvg} alt=""/>
									</Tooltip>
								}
							</div>
							<div className={"mt-[14px] view-64"} key={data?.answer}>
								<Viewer initialValue={data?.answer}/>
							</div>
						</div>
					</div>
				</Spin>
			</div>
		</div>
	)
}
