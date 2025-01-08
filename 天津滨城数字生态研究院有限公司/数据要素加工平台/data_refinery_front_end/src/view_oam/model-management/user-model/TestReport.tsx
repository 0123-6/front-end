import React, {useEffect, useState} from "react";
import NavigationComponent from "../../../components/NavigationComponent";
import ModelManagementSvg from "../../layout/icon/ModelManagementSvg";
import {Popover, Spin, Table} from "antd";
import MyModel from "../../../view/layout/icon/header/MyModel.svg";
import TypeShowComponent from "./components/TypeShowComponent";
import {PopoverContent} from "../../../view/data-element/common/PopoverContent";
import {formatPhone, mySort} from "../../../utils/util";
import Title from "../../../components/Title";
import XflowSmall from "../../../components/xflow-small";
import pic1 from "../../../view/data-resource/icon/pic11.png";
import bg1 from './icon/bg1.svg'
import {get} from "../../../axios";

export default function UserModelTestReport(props) {
	// state
	const [data, setData] = useState(null)
	const [loading,setLoading] = useState(false);
	const [resultMap, setResultMap] = useState({})
	// mounted
	useEffect(() => {
		getData()
	}, [])
	useEffect(() => {
		if(data?.content) {
			getDetailData()
		}
	}, [data])
	useEffect(() => {
		console.log('resultMap: ',resultMap)
	}, [resultMap])
	// methods
	const getData = async () => {
		// @ts-ignore
		const params = {
			id: Number(props.match.params.id)
		}
		setLoading(true)
		let {data} = await get(`/drapi/oam/user/comps/test/report/${params.id}`)
		console.log('data: ',data)
		const sortedNodeIdList = mySort(data.content)
		let newNodes = []
		for (let i = 0; i < sortedNodeIdList.length; i++) {
			for (let j = 0; j < data.content.nodes.length; j++) {
				if (sortedNodeIdList[i] === data.content.nodes[j].id) {
					newNodes.push(data.content.nodes[j])
				}
			}
		}
		data.content.nodes = newNodes
		console.log('排序后data: ',data)
		// @ts-ignore
		// const {data} = await falseGetData()
		setData(data)
		setLoading(false)
	}
	const getDetailData = async () => {
		const nodes = data?.content?.nodes
		setLoading(true)
		for (let i = 0; i < nodes.length; i++) {
			const params = {
				experiment_id: data?.experiment_id,
				node_id: nodes[i].id,
				comp_id: nodes[i].comp_id,
			}
			const res = await get('/drapi/oam/comps/experiment/result/show', params)
			// setResultMap({
			// 	...resultMap,
			// 	[nodes[i].id]: res?.data
			// })
			setResultMap(prevResultMap => ({
				...prevResultMap,
				[nodes[i].id]: res?.data,
			}));
		}
		setLoading(false)
	}
	// @ts-ignore
	const falseGetData = () => {
		return new Promise((resolve, _reject) => {
			setTimeout(() => {
				const params = {
					code: 0,
					desc: '',
					data: '',
				}
				resolve(params)
			}, 200)
		})
	}
	const clickXFlowSmall = (id) => {
		console.log('id: ',id)
		// y轴滚动到指定位置，x轴不变
		const node = document.getElementById(id);
		if (node) {
			// 应该是相对于父元素的位置
			const top = node.offsetTop;
			document.getElementById('layoutOamRef').scrollTo({
				top: top+50,
				behavior: "smooth"
			})
		}
	};

	// render
	return (
		// 最外层
		<div className={"w-full bg-white flex flex-col"}>
			{/*头部区域*/}
			<div className={"w-full h-[50px] min-h-[50px] flex items-center bg-[#fafafa]"}>
				<NavigationComponent data={[
					{label: '模型管理', iconSvg: ModelManagementSvg, disabled: true},
					{label: '用户模型', router: '/oam/model-management/user-model'},
					{label: '测试报告', disabled: true},
				]}/>
			</div>
			{/*内容区域*/}
			<div className={"w-full flex flex-col rounded-lg"}>
				<Spin spinning={loading} size="large" tip="加载中...">
					{/*最外层*/}
					<div className={"w-full flex flex-col"}>
						{/*头部*/}
						<div className={"w-full h-[168px] pl-8 pr-8 pt-6 flex justify-between text-sm leading-[14px] border-b-2 border-[#f7f7f7]"}
						     style={{borderRadius:'8px 8px 0 0',backgroundImage: 'linear-gradient(90deg, #FBFFFF 0%, #FFFFFF 70%)',}}>
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
										         content={PopoverContent({user: data?.user, showPhone: true})}
										>
											<div className={"flex"}
											     style={{height: '28px'}}>
												{/*头像*/}
												<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
												     style={{width: '28px', minWidth: '28px', height: '28px'}}>
													<img className="" src={(data?.user?.avatar) ? (data?.user?.avatar) : null} alt=""
													     style={{width: '100%', height: '100%'}}/>
												</div>
												{/*姓名*/}
												<div className={"ml-1.5 h-full flex items-center"}>
								<span className={"flex items-center"}>
									<span>{(data?.user?.nickname) ? (data?.user?.nickname) : ((data?.user?.mobile) ? formatPhone(data?.user?.mobile) : '静态内容')}</span>
								</span>
												</div>
											</div>
										</Popover>
									</div>
								</div>
								{/*版本+测试时间*/}
								<div className={"mt-[11px] flex items-center"}>
									<span className={"flex items-center"}>版本 {data?.version}</span>
									<span className={"ml-6 flex items-center"}>测试时间：{data?.test_time}</span>
								</div>
							</div>
							{/*右*/}
							<div className={"h-full flex flex-col justify-end"}>
								<img src={bg1}/>
							</div>
						</div>
						{/*内容*/}
						<div className={"pl-8 pr-8 pt-6 pb-[140px] w-full max-w-[1166px]"}>
							<Title title={'测试流程'}/>
							{/*内容*/}
							<div className={"mt-3 w-full flex"}
							     style={{height:'149px',border:'1px solid #f5f6f7'}}>
								<XflowSmall content={data?.content} type='row' canClick={true} onClick={clickXFlowSmall}/>
							</div>
							{/*遍历{data?.content?.nodes*/}
							{
								data?.content?.nodes?.map((item, index) => {
									return (
										<div className={"pt-5 flex flex-col text-sm leading-[14px]"}
										     id={item?.id}
										     key={index}>
											<div className={"flex items-center text-black-dark font-medium"}>{item?.label}</div>
											{
												(resultMap[item?.id]?.data_type === 'csv') &&
												<Table style={{height:'472px'}}
															 className={"mt-2"}
															 scroll={{ x: 'max-content',y: 430 }} // 设置自适应宽度
															 dataSource={resultMap[item?.id]?.data.map(  (item,_index) => {
													       let params = {
														       key:_index,
													       }
																 item?.header_list.map((header,_index) => {
														       params[header+' '] = item[_index]
													       })
													       return params
												       })}
															 columns={resultMap[item?.id]?.header_list.map((item,_index) => ({title:item,dataIndex:item+' ',key:item,width:160}))}
															 size="small"
															 pagination={false}/>
											}
										</div>
									)
								})
							}
							{/*读取数据*/}
							{/*<div className={"mt-5 flex items-center text-sm leading-[14px] text-black-dark font-medium"}>读取数据</div>*/}
							{
								false &&
								<Table columns={[
									{
										title: '序号',
										dataIndex: 'index',
										key: 'index',
										width: '20%',
									},
									{
										title: '企业ID',
										dataIndex: 'id',
										key: 'id',
										width: '30%',
									},
									{
										title: '发展力指数',
										dataIndex: 'description',
										key: 'description',
										width: '50%',
									},
								]}
											 dataSource={[
									       {
										       key: '1',
										       index: 1,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '2',
										       index: 2,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '3',
										       index: 3,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '4',
										       index: 4,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '5',
										       index: 5,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '6',
										       index: 6,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '7',
										       index: 7,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '8',
										       index: 8,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '9',
										       index: 9,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
									       {
										       key: '10',
										       index: 10,
										       id: '11727762',
										       description: '201.40240322733763',
									       },
								       ]}
											 pagination={false}
											 className={"mt-2"}
											 size='small'/>
							}
							{/*数据筛选*/}
							{/*<div className={"mt-5 flex items-center text-sm leading-[14px] text-black-dark font-medium"}>数据筛选</div>*/}
							{
								false &&
								<Table columns={[
									{
										title: '图片',
										dataIndex: 'picture',
										key: 'picture',
										width: '30%',
									},
									{
										title: 'label',
										dataIndex: 'label',
										key: 'label',
										width: '70%',
									},
								]}
											 dataSource={[
									       {
										       key: '1',
										       picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
									       {
										       key: '2',
										       picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
									       {
										       key: '3',
										       picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
									       {
										       key: '4',
										       picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
									       {
										       key: '5',
										       picture: <img src={pic1} alt="" style={{width:'43px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
								       ]}
											 pagination={false}
											 className={"mt-2"}
											 size='small'/>
							}
							{/*数据筛选*/}
							{/*<div className={"mt-5 flex items-center text-sm leading-[14px] text-black-dark font-medium"}>数据筛选</div>*/}
							{
								false &&
								<Table columns={[
									{
										title: '音频',
										dataIndex: 'audio',
										key: 'audio',
										width: '50%',
									},
									{
										title: '字符串',
										dataIndex: 'my_string',
										key: 'my_string',
										width: '50%',
									},
								]}
											 dataSource={[
									       {
										       key: '1',
										       audio: <audio src='/music1.mp3' controls style={{width:'319px',height:'28px',}}/>,
										       my_string: '0',
									       },
									       {
										       key: '2',
										       audio: <audio src='/music1.mp3' controls style={{width:'319px',height:'28px'}}/>,
										       my_string: '0',
									       },
									       {
										       key: '3',
										       audio: <audio src='/music1.mp3' controls style={{width:'319px',height:'28px'}}/>,
										       my_string: '0',
									       },
									       {
										       key: '4',
										       audio: <audio src='/music1.mp3' controls style={{width:'319px',height:'28px'}}/>,
										       my_string: '0',
									       },
									       {
										       key: '5',
										       audio: <audio src='/music1.mp3' controls style={{width:'319px',height:'28px'}}/>,
										       my_string: '0',
									       },
								       ]}
											 pagination={false}
											 className={"mt-2"}
											 size='small'/>
							}
							{/*数据筛选*/}
							{/*<div className={"mt-5 flex items-center text-sm leading-[14px] text-black-dark font-medium"}>数据筛选</div>*/}
							{
								false &&
								<Table columns={[
									{
										title: 'ID',
										dataIndex: 'id',
										key: 'id',
										width: '20%',
									},
									{
										title: '文本',
										dataIndex: 'text',
										key: 'text',
										width: '80%',
									},
								]}
											 dataSource={[
									       {
										       key: '1',
										       id: '1',
										       text: '对开票销售收入首次达到500万、1000万、1000万元以上的大数据商用企业，分别给予10万、30万、50万元一次性奖励。',
									       },
									       {
										       key: '2',
										       id: '2',
										       text: '对开票销售收入首次达到1000万、2000万、5000万元以上的大数据智能硬件企业，分别给予20万、40万、60万元一次性奖励。',
									       },
									       {
										       key: '3',
										       id: '3',
										       text: '开展大规模、多层次职业技能培训，建设一批高技能人才培训基地。',
									       },
									       {
										       key: '4',
										       id: '4',
										       text: '对在新三板上市的企业，给予200万元一次性奖励。',
									       },
									       {
										       key: '5',
										       id: '5',
										       text: '对在主板、中小板、创业板上市的企业，分别给予600万、500万、400万元一次性奖励。',
									       },
								       ]}
											 pagination={false}
											 className={"mt-2"}
											 size='small'/>
							}
							{/*数据筛选*/}
							{/*<div className={"mt-5 flex items-center text-sm leading-[14px] text-black-dark font-medium"}>数据筛选</div>*/}
							{
								false &&
								<Table columns={[
									{
										title: '视频',
										dataIndex: 'video',
										key: 'video',
										width: '30%',
									},
									{
										title: '占位',
										dataIndex: 'label',
										key: 'label',
										width: '70%',
									},
								]}
											 dataSource={[
									       {
										       key: '1',
										       video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
									       {
										       key: '2',
										       video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
									       {
										       key: '3',
										       video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
									       {
										       key: '4',
										       video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
									       {
										       key: '5',
										       video: <img src={pic1} alt="" style={{width:'80px',height:'40px',borderRadius:'4px'}}/>,
										       label: '0',
									       },
								       ]}
											 pagination={false}
											 className={"mt-2"}
											 size='small'/>
							}
						</div>
					</div>
				</Spin>
			</div>
		</div>
	)
}
