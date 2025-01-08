import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import pic1 from '../icon/pic11.png'
import TableInput from "../../../icon/element-processing/TableInput";
import TextInput from "../../../icon/element-processing/TextInput";
import PictureInput from "../../../icon/element-processing/PictureInput";
import VideoInput from "../../../icon/element-processing/VideoInput";
import MusicInput from "../../../icon/element-processing/MusicInput";
import TimeSvg from "../icon/TimeSvg";
import ViewSvg from "../icon/ViewSvg";
import TrueSvg from "../icon/TrueSvg";
import Title from "../../../components/Title";
import {Popover, Spin, Table} from "antd";
import NavigationComponent from "../../../components/NavigationComponent";
import {PopoverContent} from "../../data-element/common/PopoverContent";
import DataResource from "./icon/DataResource.svg";
import DataResourceLight from "./icon/DataResourceLight.svg";
import {columns1, data1, dataPreviewColumnsMap, dataPreviewDataMap} from "../static";



export default function DataResourceDetail() {

	// state
	const history = useHistory();
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	// mounted
	useEffect(() => {
		setIsLoading(true)
		setTimeout(() => {
			setData(history.location.state)
			setIsLoading(false)
		}, 200)
	}, [])

	// methods
	// const goBack = () => {
	// 	history.goBack()
	// }

	// render
	return (
		// 最外层
		<div className="w-full bg flex flex-col items-center">
			{/*导航栏*/}
			<NavigationComponent data={[
				{label: '数据资源', router: '/data-resource',icon:DataResource,iconActive:DataResourceLight},
				{label: '查看', disabled: true},
			]}/>
			{/*主体内容*/}
			<div className="flex flex-col bg-white pt-6 pl-8 pr-8 pb-32 mb-8 shadow-card rounded"
			     style={{width: '960px'}}>
				<Spin spinning={isLoading} size="large" tip="加载中...">
					{/*头部信息*/}
					<div className={"w-full flex"}>
						{/*左*/}
						<img src={pic1} alt="" style={{width: '272px', height: '127px'}}/>
						{/*右*/}
						<div className={"ml-7 flex flex-col"}>
							<div className={"text-lg text-black-dark font-medium"}>{data?.name}</div>
							<div className={"mt-3 flex justify-center items-center rounded text-main text-sm"}
							     style={{width: '80px', height: '28px', background: 'rgba(76,170,180,0.21)', lineHeight: '14px'}}>
								{data?.app1}
							</div>
							{/*3个标签*/}
							<div className={"mt-3 flex items-center text-xs"}>
								<div className={"mr-2 flex justify-center items-center rounded-lg"}
								     style={{width: '90px', height: '40px', background: 'rgba(206,220,222,0.24)'}}>
								<span
									className="mr-1 flex items-center text-white-svg-experiment hover:text-white-svg-experiment-hover">
									{data?.input_type === '表格' && <TableInput/>}
									{(data?.input_type === '文本' || data?.input_type === 'text') && <TextInput/>}
									{data?.input_type === '图像' && <PictureInput/>}
									{data?.input_type === '视频' && <VideoInput/>}
									{data?.input_type === '音频' && <MusicInput/>}
									{data?.input_type === '向量' && <TextInput/>}
								</span>
									{data?.input_type}数据
								</div>
								<div className={"mr-2 flex justify-center items-center rounded-lg"}
								     style={{width: '90px', height: '40px', background: 'rgba(206,220,222,0.24)'}}>
									22.15MB
								</div>
								<div className={"mr-2 flex justify-center items-center rounded-lg"}
								     style={{width: '90px', height: '40px', background: 'rgba(206,220,222,0.24)'}}>
									样本：10000
								</div>
							</div>
							{/*提供者行*/}
							<div className={"mt-2 flex items-center"}>
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
								<div style={{marginLeft: '38px'}}
								     className={'flex items-center text-black-light'}>
									<TimeSvg/>
									<span className={"ml-1.5 flex items-center text-black"}>2023-03-10</span>
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
					{/*描述*/}
					<div className={"mt-2.5 w-full"}
					     style={{lineHeight: '25px'}}>
						{data?.description}
					</div>
					{/*title*/}
					<Title title="字段描述" style={{marginTop: '24px'}}/>
					<Table columns={columns1}
					       dataSource={data1}
					       pagination={false}
					       className={"mt-2"}
					       size='small'/>
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
				</Spin>
			</div>
		</div>
	)
}
