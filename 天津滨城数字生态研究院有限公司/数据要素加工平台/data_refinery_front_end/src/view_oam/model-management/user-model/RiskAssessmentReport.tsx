import React from "react";
import {useEffect, useState} from "react";
import {falseUserModelRiskAssessmentData, userInfo} from "./util";
import NavigationComponent from "../../../components/NavigationComponent";
import ModelManagementSvg from "../../layout/icon/ModelManagementSvg";
import {message, Popover, Spin, Table} from "antd";
import MyModel from "../../../view/layout/icon/header/MyModel.svg";
import TypeShowComponent from "./components/TypeShowComponent";
import {PopoverContent} from "../../../view/data-element/common/PopoverContent";
import {formatPhone} from "../../../utils/util";
import Title from "../../../components/Title";
import RiskFactor from "../../../components/RiskFactor";
import pic1 from "../../../view/data-resource/icon/pic11.png";
import bg1 from "./icon/bg1.svg";
import DataResourceSvg from "./icon/DataResourceSvg";
import ButtonFifth from "../../../components/ButtonFifth";
import RiskAssessmentModal from "../components/RiskAssessmentModal";

export default function UserModelRiskAssessmentReport(props) {
	// state
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [originalDataAndReconstructedData, setOriginalDataAndReconstructedData] = useState(null)
	// 风险评估弹框
	const [showRiskAssessmentModal, setShowRiskAssessmentModal] = useState(false);
	const oData = [
		[
			{
				key: '1',
				'原数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
			},
			{
				key: '2',
				'原数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
			},
			{
				key: '3',
				'原数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
			},
			{
				key: '4',
				'原数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
			},
			{
				key: '5',
				'原数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
			},
		],
		[
			{
				key: '1',
				'原数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
				'重构数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
			},
			{
				key: '2',
				'原数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
				'重构数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
			},
			{
				key: '3',
				'原数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
				'重构数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
			},
			{
				key: '4',
				'原数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
				'重构数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
			},
			{
				key: '5',
				'原数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
				'重构数据': <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
			},
		],
		[
			{
				key: '1',
				'原数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
				'重构数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
			},
			{
				key: '2',
				'原数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
				'重构数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
			},
			{
				key: '3',
				'原数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
				'重构数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
			},
			{
				key: '4',
				'原数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
				'重构数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
			},
			{
				key: '5',
				'原数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
				'重构数据': '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
			},
		],
		[
			{
				key: '1',
				'原数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
			},
			{
				key: '2',
				'原数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
			},
			{
				key: '3',
				'原数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
			},
			{
				key: '4',
				'原数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
			},
			{
				key: '5',
				'原数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
				'重构数据': <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
			},
		],
		[
			{
				key: '1',
				'原数据': '名称1',
				'重构数据': '名称1',
			},
			{
				key: '2',
				'原数据': '名称2',
				'重构数据': '名称2',
			},
			{
				key: '3',
				'原数据': '名称3',
				'重构数据': '名称3',
			},
			{
				key: '4',
				'原数据': '名称4',
				'重构数据': '名称4',
			},
			{
				key: '5',
				'原数据': '名称5',
				'重构数据': '名称5',
			},
		],
		[
			{
				key: '1',
				'原数据': '512    123  432    125   512   322',
				'重构数据': '512    123  432    125   512   322',
			},
			{
				key: '2',
				'原数据': '512    123  432    125   512   322',
				'重构数据': '512    123  432    125   512   322',
			},
			{
				key: '3',
				'原数据': '512    123  432    125   512   322',
				'重构数据': '512    123  432    125   512   322',
			},
			{
				key: '4',
				'原数据': '512    123  432    125   512   322',
				'重构数据': '512    123  432    125   512   322',
			},
			{
				key: '5',
				'原数据': '512    123  432    125   512   322',
				'重构数据': '512    123  432    125   512   322',
			},
		],
	]
	// mounted
	useEffect(() => {
		getData()
	}, [])
	// methods
	const getData = async () => {
		// @ts-ignore
		const params = {
			id: Number(props.match.params.id)
		}
		setIsLoading(true)
		// const {data} = await get(`/drapi/comp/mycomps/${params.id}`)
		// @ts-ignore
		const {data} = await falseGetData()
		setData(data)
		setIsLoading(false)
	}
	const falseGetData = () => {
		return new Promise((resolve, _reject) => {
			setTimeout(() => {
				const params = {
					code: 0,
					desc: '',
					data: falseUserModelRiskAssessmentData,
				}
				const randomIndex = Math.floor(Math.random() * oData.length)
				setOriginalDataAndReconstructedData(oData[randomIndex])
				resolve(params)
			}, 200)
		})
	}
	const clickReassessment = () => {
		setShowRiskAssessmentModal(true)
	}
	// 风险评估弹框
	const RiskAssessmentModalOnOk = (_data) => {
		console.log('into RiskAssessmentModalOnOk')
		console.log(_data)
		setShowRiskAssessmentModal(false)
		message.success('开始风险评估成功')
	}
	const RiskAssessmentModalOnCancel = () => {
		console.log('into RiskAssessmentModalOnCancel')
		setShowRiskAssessmentModal(false)
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
					{label: '风险评估报告', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full flex flex-col rounded-lg"}>
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{/*最外层*/}
					<div className={"w-full flex flex-col"}>
						{/*头部*/}
						<div className={"w-full h-[168px] pl-8 pr-8 pt-6 flex justify-between text-sm leading-[14px] border-b-2 border-[#f7f7f7]"}
						     style={{
									 borderRadius:'8px 8px 0 0',
							     backgroundImage: data?.riskNumber<=3?'linear-gradient(90deg, #FBFFFF 0%, #FFFFFF 70%)':(data?.riskNumber<=8?'linear-gradient(90deg, #FFFCF9 0%, #FFFFFF 70%)':'linear-gradient(90deg, #FFFBFB 0%, #FFFFFF 70%)'),}}>
							{/*左*/}
							<div className={"h-full flex flex-col"}>
								<div className={"flex items-center"}>
									<img src={MyModel} alt="" style={{width:'22px',height:'22px'}}/>
									<span
										className={"ml-1 flex items-center text-lg text-black-dark leading-[18px] font-medium"}>{data?.name}</span>
								</div>
								<div className={"mt-3 flex items-center"}>
									<TypeShowComponent name={data?.model_type_desc}/>
								</div>
								<div className={"mt-3 flex items-center"}>
									<span className={"flex items-center"}>提交者:</span>
									<div className={"ml-3 flex"}>
										<Popover title={null}
										         placement="leftTop"
										         overlayClassName={'person-popover-2'}
										         trigger="hover"
										         content={PopoverContent({user: userInfo, showPhone: true})}
										>
											<div className={"flex"}
											     style={{height: '28px'}}>
												{/*头像*/}
												<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
												     style={{width: '28px', minWidth: '28px', height: '28px'}}>
													<img className="" src={(userInfo?.avatar) ? (userInfo?.avatar) : null} alt=""
													     style={{width: '100%', height: '100%'}}/>
												</div>
												{/*姓名*/}
												<div className={"ml-1.5 h-full flex items-center"}>
								<span className={"flex items-center text-hidden"}>
									<span>{(userInfo?.nickname) ? (userInfo?.nickname) : ((userInfo?.mobile) ? formatPhone(userInfo?.mobile) : '静态内容')}</span>
								</span>
												</div>
											</div>
										</Popover>
									</div>
								</div>
								{/*版本+测试时间*/}
								<div className={"mt-[11px] flex items-center"}>
									<span className={"flex items-center"}>版本 V1</span>
									<span className={"ml-6 flex items-center"}>测试时间：2022-09-23 17:20:57</span>
								</div>
							</div>
							{/*右*/}
							<div className={"h-full flex items-center"}>
								<ButtonFifth text={'重新评估'} click={clickReassessment} style={{width:'90px',height:'28px'}}/>
								<div className={"h-full flex flex-col justify-end"}>
									<img src={bg1} alt={''}/>
								</div>
							</div>

						</div>
						{/*内容*/}
						<div className={"pl-8 pr-8 pt-6 pb-[140px] w-full max-w-[1166px]"}>
							<Title title={'数据'}/>
							<div className={"mt-2.5 flex items-center text-sm leading-[14px] font-medium text-black"}>
								<div className={"flex items-center cursor-pointer hover:text-main"}>
									<DataResourceSvg/>
									<span className={"ml-2 flex items-center"}>渣土车未苫盖识别数据集</span>
								</div>
								<div className={"flex-1"}/>
							</div>
							{/*风险系数*/}
							<RiskFactor className={'mt-6'}/>
							<div className={"mt-6 w-full flex flex-col"}>
								<Table columns={[
									{
										title: '原数据',
										dataIndex: '原数据',
										key: '原数据',
										width: '50%',
									},
									{
										title: '重构数据',
										dataIndex: '重构数据',
										key: '重构数据',
										width: '50%',
									},
								]}
								       dataSource={originalDataAndReconstructedData}
								       pagination={false}
								       className={"mt-2"}
								       size='small'/>
							</div>
						</div>
					</div>
				</Spin>
			</div>
			<RiskAssessmentModal title={'风险评估'}
			                     show={showRiskAssessmentModal}
			                     data={data}
			                     onOk={RiskAssessmentModalOnOk}
			                     onCancel={RiskAssessmentModalOnCancel}/>
		</div>
	)
}
