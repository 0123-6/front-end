import React, {useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';
import { get } from "../../axios";
import NavigationComponent from "../../components/NavigationComponent";
import {formatNumberWithCommas} from "../../utils/util";
import ViewSvg from "../icon/ViewSvg";
import EditSvg from "../../icon/EditSvg";
import {Spin, Tooltip} from "antd";
import QuestionTemplateModal from "./components/QuestionTemplateModal";

export default function PolicyLibrary() {
	// state
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const selectedItem = useRef(null);
	// 弹框
	const [showQuestionTemplateModal, setShowQuestionTemplateModal] = useState(false)
	// mounted
	useEffect(() => {
		getData()
	}, [])
	// methods
	const getData = async () => {
		setLoading(true)
		const {data} = await get('/oam/city/list')
		setData(data)
		setLoading(false)
	}
	// 点击查看列表
	const clickView = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		// 跳转到详情页
		history.push({
			pathname: '/oam/policy-library/list/' + data[index].city,
		})
	}
	const clickEdit = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		// 打开编辑弹框
		selectedItem.current = data[index]
		setShowQuestionTemplateModal(true)
	}
	// 弹框方法
	const questionTemplateModalOnOk = () => {
		setShowQuestionTemplateModal(false)
	}
	const questionTemplateModalOnCancel = () => {
		setShowQuestionTemplateModal(false)
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '政策库', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
				<span className={"text-base font-medium"}>政策库</span>
				{/*加载效果*/}
				<Spin spinning={loading} size="large" tip="加载中...">
					{/*政策库列表*/}
					<div className={"min-h-[400px] mt-[50px] pl-[25px] pr-[25px] flex flex-wrap"}>
						{
							data.map((item, index) => (
								<div className={`w-[27.2vw] min-w-[400px] h-[29.7vh] min-h-[300px] mr-[1.7vw] flex flex-col rounded-2xl pl-8 pr-5 pt-4 group cursor-pointer
							        ${index%2===0?'shadow-[0px_2px_8px_0px_rgba(255,255,255,1)]':'0px_2px_8px_0px_rgba(217,222,238,0.15)'}
							        hover:shadow-[0px_2px_10px_0px_rgba(228,228,228,1)]
							     `}
								     style={{
									     backgroundImage: index%2===0?'linear-gradient(171deg, rgba(162, 182, 255, 0.09), white)':'linear-gradient(171deg, rgba(1, 188, 235, 0.03), white)',
									     border: '1px solid rgba(229,229,229,0.3)',
								     }}
								     onClick={e=>clickView(e,index)}
								     key={index}>
									{/*顶部*/}
									<div className={"h-[36px] min-h-[36px] flex justify-between items-center"}>
										<span className={"text-[20px] text-black-dark font-medium"}>{item?.name}</span>
										<div className={"hidden group-hover:flex items-center"}>
											<Tooltip title={'查看'} overlayClassName='like-or-unlike'>
												<div className={"w-[36px] h-[36px] flex justify-center items-center bg-white rounded-[18px] text-[#A4AFCA] hover:text-main cursor-pointer"}
												     style={{
													     border: '1px solid rgba(245,245,245,1)',
													     boxShadow: '0px 2px 8px 0px rgba(217,222,238,0.35)',
												     }}
												     onClick={e=>clickView(e,index)}
												>
													<ViewSvg/>
												</div>
											</Tooltip>
											<Tooltip title={'提示问题编辑'} overlayClassName='like-or-unlike'>
												<div className={"ml-[11px] w-[36px] h-[36px] flex justify-center items-center bg-white rounded-[18px] text-[#A4AFCA] hover:text-[#01BCEB] cursor-pointer"}
												     style={{
													     border: '1px solid rgba(245,245,245,1)',
													     boxShadow: '0px 2px 8px 0px rgba(217,222,238,0.35)',
												     }}
												     onClick={e=>clickEdit(e,index)}
												>
													<EditSvg/>
												</div>
											</Tooltip>
										</div>
									</div>
									<div className={"mt-[1.5vh] mb-[2.8vh] h-[1px] min-h-[1px]"}
									     style={{
										     width: 'calc(100% + 20px)',
										     background: 'rgba(226,231,245,0.2)',
									     }}>
									</div>
									<div className={"flex flex-wrap"}>
										{/*总数*/}
										<div className={"mb-[4.1vh] w-1/3 flex flex-col"}>
											<span className={"text-[24px] text-main font-medium"}>{formatNumberWithCommas(item?.total)}</span>
											<span className={"mt-2 text-base"}>总数</span>
										</div>
										{/*周度更新数*/}
										<div className={"mb-[4.1vh] w-1/3 flex flex-col"}>
											<span className={"text-[24px] text-main font-medium"}>{formatNumberWithCommas(item?.week_new_zc_count)}</span>
											<span className={"mt-2 text-base"}>周度更新数</span>
										</div>
										{/*每日问题数*/}
										<div className={"mb-[4.1vh] w-1/3 flex flex-col"}>
											<span className={"text-[24px] text-main font-medium"}>{formatNumberWithCommas(item?.month_new_zc_count)}</span>
											<span className={"mt-2 text-base"}>月度更新数</span>
										</div>
										{/*月度更新数*/}
										<div className={"w-1/3 flex flex-col"}>
											<span className={"text-[24px] text-[#01BCEB] font-medium"}>{formatNumberWithCommas(item?.today_question_count)}</span>
											<span className={"mt-2 text-base"}>每日问题数</span>
										</div>
										{/*每月问题数*/}
										<div className={"w-1/3 flex flex-col"}>
											<span className={"text-[24px] text-[#01BCEB] font-medium"}>{formatNumberWithCommas(item?.month_question_count)}</span>
											<span className={"mt-2 text-base"}>每月问题数</span>
										</div>
									</div>
								</div>
							))
						}
					</div>
				</Spin>
			</div>
			{/*弹窗*/}
			<QuestionTemplateModal title={'问题模版'}
			                       show={showQuestionTemplateModal}
			                       data={selectedItem.current}
			                       onOk={questionTemplateModalOnOk}
			                       onCancel={questionTemplateModalOnCancel}
			/>
		</div>
	)
}
