import {Pagination, Popover, Spin, Tooltip} from "antd";
import {useEffect, useRef, useState} from "react";
import TimeSvg from "../../icon/experiment/TimeSvg";
import TypeList from "../../components/TypeList";
import React from "react";
import SearchBig from "../../components/SearchBig";
import NoSearchData from '../../icon/no-search-data.svg'
import {useHistory} from 'react-router-dom';
import pic1 from './icon/2k/1.png'
import pic2 from './icon/2k/2.png'
import pic3 from './icon/2k/3.png'
import pic4 from './icon/2k/4.png'
import pic5 from './icon/2k/5.png'
import pic6 from './icon/2k/6.png'
import pic7 from './icon/2k/7.png'
import pic8 from './icon/2k/8.png'
import FiledCard from "../../components/FiledCard";
import TypeShow from "./component/TypeShow";
import EditSvg from "../../icon/table/EditSvg";
import DeleteSvg from "../../icon/table/DeleteSvg";
import PublishSvg from "../../icon/table/PublishSvg";
import {PopoverContent} from "../data-element/common/PopoverContent";
import StatusComponent from "../model-library/components/StatusComponent";
import ButtonMain from "../../components/ButtonMain";

function DataResource() {
	// state
	const history = useHistory();
	// 搜索条件
	// type为全部，已授权，我的,未授权,已过期
	const statusList = ['全部', '已授权', '我的']
	const statusMap = {
		'全部': 'all',
		'已授权': 'auth',
		'我的': 'my',
	}
	const status = useRef('全部')

	const keyword = useRef('')
	const pageSize = useRef(16);
	const pageSizeChange = useRef(false);

	const pageNum = useRef(1);
	const [first, setFirst] = useState(true)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([]);
	const falseData = [
		{
			id: 1,
			name: '企业经营信息数据集',
			description: '该数据集包括某城市的重点中小企业的经营信息相关数据，主要字段包括企业ID、注册资金、员工数量、资产总额、负债总额、营业总收入、主营业务收入、利润总额、净利润、纳税总额、所有者权益合计、等经营相关指标、专利数量、商标数量、软著数量。',
			input_type: '表格',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '产业经济',
			app2: '',
			pic: pic1,
			status_desc: '已上线',
			user: {
				nickname: '王凯旋王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: false,
			auth_status_desc: '已授权',
		},
		{
			id: 2,
			name: '企业月电力负荷使用情况数据集',
			description: '该数据集包括某城市部门企业的用电负荷相关数据，主要字段包括企业ID、使用年月和用电负荷。',
			input_type: '表格',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '产业经济',
			app2: '',
			pic: pic2,
			status_desc: '待审核',
			user: {
				nickname: '王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: true,
			auth_status_desc: '已授权',
		},
		{
			id: 3,
			name: '分类图像数据集',
			description: '该数据集包括了生活中常见的几种事物的图片，比如人物、动物、交通工具等。',
			input_type: '图像',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '人工智能',
			app2: '',
			pic: pic3,
			status_desc: '未发布',
			user: {
				nickname: '王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: false,
			auth_status_desc: '未授权',
		},
		{
			id: 4,
			name: '市民热线文本数据集',
			description: '该数据集为市民拨打12345热线的文本信息。包含六种标签类型，分别为"社会管理与服务", "城市管理事件", "企业服务", "环境保护", "物业管理", "垃圾分类"。',
			input_type: '文本',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '民生服务',
			app2: '',
			pic: pic4,
			status_desc: '已驳回',
			user: {
				nickname: '王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: false,
			auth_status_desc: '未授权',
		},
		{
			id: 5,
			name: '城市音频数据集',
			description: '该数据集包括10种不同来源的城市声音音频，分别为 钻孔声、枪声、警笛声、手提钻、空调声、汽车鸣笛声、儿童玩耍声、狗叫声、引擎空转声和街道音乐声。',
			input_type: '音频',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '民生服务',
			app2: '',
			pic: pic5,
			status_desc: '已上线',
			user: {
				nickname: '王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: false,
			auth_status_desc: '未授权',
		},
		{
			id: 6,
			name: '交通道路监控视频',
			description: '该数据集来自真实场景道路监控视频。',
			input_type: '视频',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '智慧交通',
			app2: '',
			pic: pic6,
			status_desc: '待审核',
			user: {
				nickname: '王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: true,
			auth_status_desc: '未授权',
		},
		{
			id: 7,
			name: '交通道路监控图像',
			description: '该数据集来自真实场景道路监控图像，图片中包含轿车、SUV、渣土车、公交车等常见车辆。',
			input_type: '图像',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '跨模态搜索',
			app2: '',
			pic: pic7,
			status_desc: '已驳回',
			user: {
				nickname: '王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: false,
			auth_status_desc: '未授权',
		},
		{
			id: 8,
			name: '企业政策奖励文本',
			description: '该数据集来自某区真实企业奖励相关文本描述。',
			input_type: '文本',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '智慧政务',
			app2: '',
			pic: pic8,
			status_desc: '未发布',
			user: {
				nickname: '王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: false,
			auth_status_desc: '已过期',
		},
		{
			id: 9,
			name: '犯罪视频分类数据',
			description: '该数据集为城市中发生的真实的不同犯罪行为的记录视频。包括虐待、逮捕、纵火、斗殴、盗窃、爆炸、打架等几类犯罪行为视频。',
			input_type: '视频',
			status: 200,
			created_at: '2023-03-01 20:30:31',
			app1: '民生服务',
			app2: '',
			pic: pic1,
			status_desc: '已上线',
			user: {
				nickname: '王凯旋',
				avatar: 'http://minio.model-hubs.cn/web-static/avatar/202304/1AxN2g0npe.png',
				role_name: '数据要素加工者',
				description: '数据要素加工者',
			},
			is_mine: false,
			auth_status_desc: '已过期',
		},
	]
	// 全部数量
	const [pageSum, setPageSum] = useState(0);
	// 初始化函数
	useEffect(() => {
		search()
	}, []);
	const search = () => {
		// @ts-ignore
		let params = {
			page_num: pageNum.current,
			page_size: pageSize.current,
			filter_name: keyword.current,
			tab_filter: statusMap[status.current],
		}
		setLoading(true)
		setTimeout(() => {
			let _data = []
			for (let i = 0; i < falseData.length; i++) {
				// 从第pageSize*(pageNum-1)个开始取pageSize个
				if (i >= pageSize.current * (pageNum.current - 1) && i < pageSize.current * pageNum.current) {
					_data.push(falseData[i])
				}
			}
			setData(_data)
			setPageSum(falseData.length)
			setLoading(false)
			if (first) {
				setFirst(false)
			}
		}, 200)
	}
	const onShowSizeChange = (_current, newPageSize) => {
		console.log('into onShowSizeChange: _current: ', _current, ' ,newPageSize: ', newPageSize)
		console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
		pageNum.current = 1
		pageSize.current = newPageSize
		pageSizeChange.current = true
		console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
	};
	const keydown = (e) => {
		if (e.keyCode === 13) {
			changeKeyword()
		}
	}
	const changeSearchType = (value) => {
		status.current = value + ''
		pageNum.current = 1
		search()
	}
	const changeKeyword = () => {
		pageNum.current = 1
		search()
	}
	const changePageNum = (value) => {
		console.log('into changePageNum,嘿嘿嘿,传入的value为：', value)
		console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
		if (pageSizeChange.current === true) {
			pageSizeChange.current = false
		} else {
			pageNum.current = value
		}
		console.log('pageNum: ', pageNum.current, ' ,pageSize: ', pageSize.current)
		search()
	}
	const goDetail = (_index) => {
		history.push({
			pathname: '/data-resource/detail',
			state: data[_index],
		});
	}
	const handleEdit = (e,_index) => {
		e.stopPropagation()
		console.log(_index)
	}
	const handleDelete = (e,_index) => {
		e.stopPropagation()
		console.log(_index)
	}
	const handleApplyRelease = (e,_index) => {
		e.stopPropagation()
		console.log(_index)
	}
	// 跳转到我的数据
	const clickGoMyData = () => {
		history.push({
			pathname: '/data-resource/my-data',
		})
	}

	// render
	return (
		// 最外层
		<div className="w-full flex justify-center">
			{/*主体内容*/}
			<div className="flex flex-col w-[1036px] big:w-[1388px]">
				{/*title*/}
				<div className="mt-6 w-full flex justify-between items-center"
				     style={{height: '36px'}}>
					{/*左*/}
					<div className="w-full h-full flex items-center experiment">
						{/*全部，拖拽编码筛选，*/}
						<TypeList list={statusList} value={status.current} change={changeSearchType} style={{height:'36px',minHeight:'36px'}}/>
						{/*search框筛选*/}
						<SearchBig placeholder={`请输入数据名称`}
						           style={{height: '36px'}}
						           defaultValue={keyword.current}
						           change={e => keyword.current = e.target.value}
						           keyDown={e => keydown(e)}/>
					</div>
					{/*右*/}
					<div className={"flex items-center"}>
						<ButtonMain text={'我的数据'} click={clickGoMyData} className={"w-[88px] h-[28px]"}/>
					</div>
				</div>
				{/*中间内容*/}
				<div className="mt-4 w-full">
					{/*暂无数据*/}
					{
						first &&
						<Spin spinning={loading} size="large" tip="加载中...">
							<div className="w-full"
									 style={{height: '436px'}}>
							</div>
						</Spin>
					}
					{
						pageSum === 0 && !first &&
						<Spin spinning={loading} size="large" tip="加载中...">
							<div className="w-full flex flex-col justify-center items-center"
									 style={{height: '436px'}}>
								<img src={NoSearchData} alt=""/>
								<div className="mt-3 flex text-sm text-black-light">暂无数据</div>
							</div>
						</Spin>
					}
					{/*加载完成 && 有数据 节点卡片*/}
					{
						pageSum > 0 && !first &&
						<Spin spinning={loading} size="large" tip="加载中...">
							<div className="w-full grid grid-cols-3 big:grid-cols-4 gap-5">
								{
									data.map((_item, _index) => {
										return (
											<div
												className="w-full bg-white shadow-card flex flex-col hover:shadow-card-hover hover:cursor-pointer group rounded-xl"
												style={{height: '377px'}}
												key={_index} onClick={_e => goDetail(_index)}>
												{/*上部区域*/}
												<div className={"w-full flex overflow-hidden relative"}
												     style={{height: '187px', borderRadius: '12px 12px 0 0'}}>
													{/*图片本身*/}
													<img src={_item.pic} alt=""
													     style={{width: '100%', height: '100%', borderRadius: '12px 12px 0 0'}}/>
													{/*左侧斜角状态*/}
													{/*<div className={`flex justify-center items-center absolute text-white text-xs*/}
													{/*			${_item.status_desc === '已上线' ? 'bg-main' : ''}*/}
													{/*			${_item.status_desc === '待审核' ? 'bg-orange' : ''}*/}
													{/*			${_item.status_desc === '未发布' ? 'bg-status-notrun' : ''}*/}
													{/*			${_item.status_desc === '已驳回' ? 'bg-red' : ''}*/}
													{/*		`}*/}
													{/*     style={{*/}
													{/*	     width: '78px',*/}
													{/*	     height: '18px',*/}
													{/*	     lineHeight: '12px',*/}
													{/*	     top: '10px',*/}
													{/*	     left: '-20px',*/}
													{/*	     transform: 'rotate(-45deg)'*/}
													{/*     }}>*/}
													{/*	{_item.status_desc}*/}
													{/*</div>*/}
													{/*操作菜单*/}
													<div className={"hidden absolute group-hover:flex group-hover:items-center z-20"}
													     style={{top: '13px', right: '14px'}}>
														<span className={"inline-flex items-center text-table-icon"}>
                              <Tooltip title="编辑" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                <span className={`ml-1 ${(_item.status_desc !== '待审核' && _item.status_desc !== '已上线') ? 'hover:cursor-pointer hover:text-green' : 'text-table-icon-disable hover:cursor-not-allowed '}`}
                                      onClick={(_item.status_desc !== '待审核' && _item.status_desc !== '已上线') ? (e) => handleEdit(e,_index):(e)=>{e.stopPropagation()}}><EditSvg/></span>
                              </Tooltip>
															<Tooltip title="申请发布" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                <span className={`ml-1 ${(_item.status_desc !== '待审核' && _item.status_desc !== '已上线') ? 'hover:cursor-pointer hover:text-main' : 'text-table-icon-disable hover:cursor-not-allowed '}`}
                                      onClick={(_item.status_desc !== '待审核' && _item.status_desc !== '已上线') ? (e) => handleApplyRelease(e,_index):(e)=>{e.stopPropagation()}}><PublishSvg/></span>
                              </Tooltip>
                              <Tooltip title="删除" mouseEnterDelay={0} mouseLeaveDelay={0}>
                                <span className={`ml-1 ${(_item.status_desc !== '待审核' && _item.status_desc !== '已上线') ? 'hover:cursor-pointer hover:text-red' : 'text-table-icon-disable hover:cursor-not-allowed '}`}
	                                onClick={(_item.status_desc !== '待审核' && _item.status_desc !== '已上线') ? (e) => handleDelete(e,_index):(e)=>{e.stopPropagation()}}><DeleteSvg/></span>
                              </Tooltip>
                            </span>
													</div>
													{/*悬浮遮罩*/}
													<div className={"absolute hidden w-full h-full group-hover:flex z-10"}
													     style={{background:'rgba(0,0,0,55.48%)'}}></div>
												</div>
												{/*内容*/}
												<div className={"w-full pt-[19px] pl-5 pr-4 flex flex-col"}>
													{/*title*/}
													<div className="w-full flex justify-between items-center">
														{/*左*/}
														<span className="flex font-medium text-black-dark text-base text-hidden"
														      style={{width: '270px'}}>{_item.name}</span>
													</div>
													{/*标签*/}
													<div className={"mt-3 w-full flex justify-between items-center"}
													     style={{height: '22px'}}>
														<div className={"flex items-center"}>
															{/*左*/}
															<StatusComponent status_desc={_item?.is_mine ? '我的' : _item?.auth_status_desc}/>
															{/*左*/}
															<FiledCard data={_item.app1} className={"ml-2"}/>
														</div>
														{/*右*/}
														<TypeShow data={_item.input_type}/>
													</div>
													{/*文字*/}
													<div className="mt-2.5 w-full text-sm text-black text-hidden-2"
													     style={{lineHeight: '24px', height: '48px', minHeight: '48px'}}>
														{_item.description}
													</div>
													{/*分割线*/}
													<div style={{
														height: '1px',
														background: '#f8f8f8',
														marginTop: '18px',
														width: 'calc(100% + 16px)'
													}}/>
													{/*底部*/}
													<div className="mt-1 w-full flex justify-between items-center">
														{/*头像和名字*/}
														<Popover title={null}
														         placement="leftTop"
														         overlayClassName={'person-popover-2'}
														         trigger="hover"
														         content={PopoverContent({user:_item?.user})}
														>
															<div className={"flex items-center"}>
																{/*头像*/}
																<div className="rounded-full overflow-hidden outline-2 outline outline-white-divide"
																     style={{width: '24px',minWidth:'24px',height: '24px',minHeight:'24px'}}>
																	<img className="" src={(_item?.user?.avatar)?(_item?.user?.avatar):null} alt="" width="24px"/>
																</div>
																<span className={"ml-2 flex items-center text-sm max-w-[90px] text-hidden"}
																      style={{lineHeight: '14px'}}>{_item?.user?.nickname}</span>
															</div>
														</Popover>
														{/*时间*/}
														<div className="flex items-center">
															<span className="flex items-center text-white-svg-experiment"><TimeSvg/></span>
															<span className="ml-1 text-xs text-black"
															      style={{lineHeight: '14px'}}>{_item.created_at}</span>
														</div>
													</div>
												</div>
											</div>
										)
									})
								}
							</div>
						</Spin>
					}
				</div>
				{/*分页*/}
				<div className="mt-6 pb-6 w-full flex justify-center">
					{
						pageSum > 8 &&
						<Pagination showSizeChanger
												showQuickJumper
												showTitle={false}
												showTotal={total => `共${total}条`}
												onShowSizeChange={onShowSizeChange}
												onChange={value => changePageNum(value)}
												defaultPageSize={pageSize.current}
												defaultCurrent={1}
												pageSizeOptions={[8, 12, 16, 20]}
												current={pageNum.current}
												total={pageSum}/>
					}
				</div>
			</div>
		</div>
	)
}

export default DataResource
