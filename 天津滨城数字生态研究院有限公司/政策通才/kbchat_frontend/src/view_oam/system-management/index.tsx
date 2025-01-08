import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import NavigationComponent from "../../components/NavigationComponent";
import PolicyLibrarySvg from './icon/PolicyLibrarySvg.svg'
import {message, Select, Spin} from "antd";
import DialogueMockUpSvg from './icon/DialogueMockUpSvg.svg'
import AnswerMethodSvg from './icon/AnswerMethodSvg.svg'
import {get, post } from "../../axios";

const list = [
	{
		label: '政策库',
		icon: PolicyLibrarySvg,
		defaultValue: null,
		options: [],
		disabled: false,
		style:{
			backgroundImage: 'linear-gradient(171deg, rgba(162, 182, 255, 0.09), white)',
		}
	},
	{
		label: '对话大模型',
		icon: DialogueMockUpSvg,
		defaultValue: 'vicuna-7B v1.5',
		options: [
			{label: 'vicuna-7B v1.5', value: 'vicuna-7B v1.5'},
		],
		disabled: true,
		style:{
			backgroundImage: 'linear-gradient(171deg, rgba(1, 188, 235, 0.03), white)',
		}
	},
	{
		label: '回答方式',
		icon: AnswerMethodSvg,
		defaultValue: '大模型+知识库',
		options: [
			{label: '大模型', value: '大模型'},
			{label: '大模型+知识库', value: '大模型+知识库'},
		],
		disabled: true,
		style:{
			backgroundImage: 'linear-gradient(171deg, rgba(200, 0, 255, 0.02), white)',
		}
	}
]

export default function SystemManagement() {
	// state
	// @ts-ignore
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const [finish, setFinish] = useState(false);
	// mounted
	useEffect(() => {
		getData()
	}, [])
	// methods
	const getData = async () => {
		setLoading(true)
		const {data} = await get('/oam/city/list/0')
		list[0].options = data.map(item => (
			{label: item.name, value: item.city}
		))
		for(let i=0;i<data.length;i++){
			if (data[i].is_active) {
				list[0].defaultValue = data[i].city
			}
		}
		setLoading(false)
		setFinish(true)
	}
	const changeValue = async (label: string, value: string) => {
		if (label === '政策库') {
			const params = {
				city: value
			}
			await post('/oam/city/default', params)
			message.success('修改成功')
		}
	}
	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#f6f8fc]"}>
				<NavigationComponent data={[
					{label: '系统管理', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			{/*加载效果*/}
			<Spin spinning={loading} size="default" tip="加载中...">
				<div className={"min-h-[300px] w-full pl-8 pr-8 pt-6 flex flex-col rounded-lg"}>
					<span className={"text-base font-medium"}>系统管理</span>
					<div className="mt-[3.6vh] pl-[22px] flex flex-wrap">
						{
							finish &&
							list.map((item, index) => (
								<div className="mr-8 w-[15.3vw] min-w-[250px] h-[14.1vh] min-h-[150px] rounded-2xl flex flex-col shadow-[0px_2px_8px_0px_rgba(255,255,255,1)] hover:shadow-[0px_2px_8px_0px_rgba(235,235,235,1)]"
								     key={index}
								     style={{
									     ...item.style
								     }}
								>
									{/*上面*/}
									<div className={"mt-5 pl-8 flex items-center"}>
										<img src={item?.icon} alt=""/>
										<span className={"ml-[21px] text-base font-medium"}>{item?.label}</span>
									</div>
									{/*下面*/}
									<div className={"mt-[19px] pl-7 pr-7 flex items-center"}>
										<Select
											onChange={(value) => changeValue(item.label,value)}
											size={"large"}
											disabled={item.disabled}
											className={"flex-1"}
											defaultValue={item.defaultValue}
											options={item.options}/>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</Spin>
		</div>
	)
}
