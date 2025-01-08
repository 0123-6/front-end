import React, {useState} from "react";
import {message, Table} from "antd";
import CopyComponent from "../../../../components/CopyComponent";
import noData from "../../../data-element/api-serve/icon/noData.svg";
import PythonLogo from "../../../../icon/api/python_logo.png";
import JSLogo from "../../../../icon/api/js-logo.png";
import CURLLogo from "../../../../icon/api/curl-logo.png";
import copy from "copy-to-clipboard";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { arduinoLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import unauthorizedSvg from "../../../model-library/icon/unauthorizedSvg.svg";
import expiredSvg from "../../../model-library/icon/expiredSvg.svg";

// mode为枚举类型，分别为正常，无数据，未授权，已过期
interface IProps {
	data:any,
	mode?:'normal'|'noData'|'unauthorized'|'expired',
}

const requestExampleModeList = [
	{
		name:'python',
		icon: PythonLogo,
		key: 'python',
	},
	{
		name:'JavaScript',
		icon: JSLogo,
		key: 'js',
	},
	{
		name:'cURL',
		icon: CURLLogo,
		key: 'curl',
	}
]

export default function ApiInfoDetail(props:IProps) {
	// state
	const {data,mode='normal'} = props
	const [requestExampleMode,setRequestExampleMode] = useState(requestExampleModeList[0])
	// mounted
	// methods
	// 点击复制按钮
	const clickCopy = (_message) => {
		copy(_message)
		message.success('复制成功')
	}
	// render
	return (
		<div className={"w-full flex flex-col text-sm"}>
			{/*API接口*/}
			{
				mode === 'normal' &&
				<div className={"w-full flex flex-col text-sm"}>
					{/*title*/}
					<div className={"w-full flex items-center"}>接口地址：{data?.api_info?.url}</div>
					<div className={"mt-3 w-full flex items-center"}>请求格式：{data?.api_info?.content_type}</div>
					<div className={"mt-3 w-full flex items-center"}>请求方式：{data?.api_info?.method}</div>
					<div className={"mt-3 w-full flex items-center"}>接口备注：{data?.api_info?.remark ? data?.api_info?.remark : '—'}</div>
					{/*请求参数说明*/}
					<div className={"text-black-dark leading-[14px] font-medium"}
							 style={{marginTop:'22px'}}>
						请求参数说明
					</div>
					<Table
						columns={[
							{
								title: '名称',
								dataIndex: 'name',
								key: 'name',
								width: '15%',
							},
							{
								title: '类型',
								dataIndex: 'type',
								key: 'type',
								width: '15%',
							},
							{
								title: '必填',
								dataIndex: 'is_required',
								key: 'is_required',
								width: '10%',
							},
							{
								title: '说明',
								dataIndex: 'remark',
								key: 'remark',
								width: '60%',
							},
						]}
						dataSource={data?.api_info?.queries ? data?.api_info?.queries.map(item=>({...item,is_required:item.is_required+''})) : []}
						pagination={false}
						className={"mt-2"}
						size='small'/>
					{/*请求示例*/}
					<div className={"text-black-dark leading-[14px] font-medium"}
							 style={{marginTop:'22px'}}>
						请求示例
					</div>
					{/*请求示例语言*/}
					<div className={"mt-2.5 flex items-center"}>
						{
							requestExampleModeList.map((item,_index)=>(
								<div key={_index}
								     className={`mr-4 h-[28px] pl-4 pr-4 rounded-lg flex justify-center items-center text-sm leading-[14px] cursor-pointer
											      ${requestExampleMode.name!==item.name?'bg-[#F9F9F9] text-black-light':'bg-[#f4fafb] text-main'}`}
								     onClick={_e=>setRequestExampleMode(item)}
								>
									<img src={item.icon} alt="" style={{width:'16px',height:'16px'}}/>
									<span className={"ml-1 flex items-center"}>{item.name}</span>
								</div>
							))
						}
					</div>
					{/*请求示例内容*/}
					<div className={"mt-2.5 w-full flex flex-col rounded pt-1 pb-2 pl-5 pr-5 relative group/one"}
							 style={{background: 'rgba(148,198,203,0.04)',}}>
						<SyntaxHighlighter language="javascript" style={{
							...arduinoLight,
							hljs:{
								...arduinoLight.hljs,
								background: 'unset',
							}
						}}>
							{data?.api_info?.query_example[requestExampleMode.key] ? data?.api_info?.query_example[requestExampleMode.key] : '暂无数据'}
						</SyntaxHighlighter>
						{/*复制按钮*/}
						<div className={"hidden group-hover/one:flex absolute top-3 right-11"}>
							<CopyComponent click={()=>clickCopy(data?.api_info?.query_example[requestExampleMode.key])}/>
						</div>
					</div>
					{/*返回示例*/}
					<div className={"text-black-dark leading-[14px] font-medium"}
							 style={{marginTop:'22px'}}>
						返回示例
					</div>
					<div className={"mt-2.5 w-full flex flex-col rounded pt-1 pb-2 pl-5 pr-5 relative group/one"}
							 style={{background: 'rgba(148,198,203,0.04)',}}>
						<SyntaxHighlighter language="javascript" style={{
							...arduinoLight,
							hljs:{
								...arduinoLight.hljs,
								background: 'unset',
							}
						}} showLineNumbers>
							{data?.api_info?.response_example}
						</SyntaxHighlighter>
						{/*复制按钮*/}
						<div className={"hidden group-hover/one:flex absolute top-3 right-11"}>
							<CopyComponent click={()=>clickCopy(data?.api_info?.response_example)}/>
						</div>
					</div>
				</div>
			}
			{
				mode === 'noData' &&
				<div className={"mt-6 w-full flex flex-col text-sm"}>
					<div className="w-full flex flex-col justify-center items-center"
							 style={{height:'260px'}}>
						<img src={noData} alt=""/>
						<div className="mt-3 flex text-xs text-black-light">暂无API接口信息</div>
					</div>
				</div>
			}
			{
				mode === 'unauthorized' &&
				<div className={"mt-6 w-full flex flex-col text-sm"}>
					<div className="w-full flex flex-col justify-center items-center"
							 style={{height:'260px'}}>
						<img src={unauthorizedSvg} alt=""/>
						<div className="mt-3 flex text-xs text-black-light">未获得授权如需使用该项服务，请联系平台方。</div>
					</div>
				</div>
			}
			{
				mode === 'expired' &&
				<div className={"mt-6 w-full flex flex-col text-sm"}>
					<div className="w-full flex flex-col justify-center items-center"
							 style={{height:'260px'}}>
						<img src={expiredSvg} alt=""/>
						<div className="mt-3 flex text-xs text-black-light">服务已到期如需继续使用该项服务，请联系平台方。</div>
					</div>
				</div>
			}
		</div>
	)
}
