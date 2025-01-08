import React, {useEffect, useState} from "react";
import {Table, Tooltip} from "antd";
import ButtonFifth from "../../../../components/ButtonFifth";
import TypeList from "../../../../components/TypeList";
import {Viewer} from "@toast-ui/react-editor";
import { JsonEditor as Editor } from 'jsoneditor-react';
import {showLastName} from "../../../../utils/util";
import {columns, CustomExpandIcon} from "../../../../view/my-model/detail/MyModelDetailDetail";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { arduinoLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import TypeShowComponent from "../../user-model/components/TypeShowComponent";
import DownloadSvg from "../../user-model/icon/DownloadSvg";
import StatusShow from "../components/StatusShow";
import ApiInfoDetail from "../../../../view/my-model/detail/components/ApiInfoDetail";

interface IProps {
	data:any,
	changeMode:(mode:string)=>void,
}

export default function OfficialModelDetailDetail(props:IProps) {
	// state
	const {data,changeMode} = props
	const [menuList,setMenuList] = useState([])
	const [menu,setMenu] = useState('')
	// mounted
	useEffect(()=>{
		if(data) {
			if(data?.modelCreateType === 2 || data?.modelCreateType === 3){
				setMenuList(['模型描述','模型文件','API接口'])
				setMenu('模型描述')
			} else if (data?.modelCreateType === 1) {
				setMenuList(['模型描述','组件信息'])
				setMenu('模型描述')
			}
		}
	},[data])
	// methods
	const changeMenu = (value) => {
		setMenu(value + '')
	}
	const clickDownload = () => {
		if (data?.modelFileUrl) {
			window.open(location.origin+data?.modelFileUrl)
		}
	}
	// render
	return (
		// 最外层
		<div className={"w-full flex flex-col"}>
			{/*上*/}
			<div className="w-full h-[148px] flex">
				{/*左*/}
				<img src={data?.modelCoverUrl} alt="" style={{width:'264px',height:'100%',borderRadius:'8px'}}/>
				{/*右*/}
				<div className={"ml-[18px] max-w-[884px] flex flex-col"}
				     style={{width:'calc(100% - 282px)'}}>
					<div className={"w-full flex justify-between items-center"}>
						<div className={"flex items-center"}>
							<span className={"text-lg text-black-dark font-medium"}>{data?.modelName}</span>
							<StatusShow status={data?.status_desc} className={"ml-4"}/>
						</div>
						<ButtonFifth text={'编辑'}
						             click={()=>changeMode('编辑')}
						             style={{width:'86px',height:'32px'}}
						             disabled={!(data?.status_desc!=='发布中' && data?.status_desc!=='已发布')}
						/>
					</div>
					<Tooltip title={(data?.modelSimpleDescription && data?.modelSimpleDescription.length>82)?data?.modelSimpleDescription:null}
					         overlayClassName='my-model-detail-desc'>
						<div className={"mt-2 w-full h-[50px] min-h-[50px] text-sm leading-[25px] text-hidden-2"}>
							{data?.modelSimpleDescription}
						</div>
					</Tooltip>
					<div className={"mt-2 h-[22px] flex items-center"}>
						{
							data?.modelTypeDesc &&
							<TypeShowComponent name={data?.modelTypeDesc}/>
						}
					</div>
					{/*版本+更新时间*/}
					<div className={"mt-[11px] flex items-center"}>
						<span className={"flex items-center"}>版本 {data?.modelVersion}</span>
						<span className={"ml-8 flex items-center"}>更新时间：{data?.update_at}</span>
					</div>
				</div>
			</div>
			{/*下*/}
			<div className={"w-full flex flex-col"}>
				{/*选项菜单栏*/}
				{
					menu &&
					<TypeList list={menuList} value={menu} change={changeMenu} showLine={true}/>
				}
				<div className={"mt-2 w-full max-w-[1166px] flex flex-col"}>
					{
						menu==='模型描述' && data?.modelDescription &&
						<Viewer initialValue={data?.modelDescription}/>
					}
					{
						menu==='组件信息' &&
						<div className={"w-full flex flex-col detail-pointer-events-none"}>
							<div className={"mt-[14px] w-full flex"}>
								<div className={"w-[73px] h-[40px] pr-4 flex justify-end items-center"}>参数</div>
								<div className={"w-[656px]"}>
									<Editor
										value={data?.editorData}
										mode='code'
										navigationBar={false}
										statusBar={false}
										search={false}
										sortObjectKeys={false}
										onChange={null}
									/>
								</div>
							</div>
							<div className={"mt-6 w-full flex"}>
								<div className={"w-[73px] h-[40px] pr-4 flex justify-end items-center"}>输入桩</div>
								<div className={"w-[656px]"}>
									<Editor
										value={data?.inputNodeData}
										mode='code'
										navigationBar={false}
										statusBar={false}
										search={false}
										sortObjectKeys={false}
										onChange={null}
									/>
								</div>
							</div>
							<div className={"mt-6 w-full flex"}>
								<div className={"w-[73px] h-[40px] pr-4 flex justify-end items-center"}>输出桩</div>
								<div className={"w-[656px]"}>
									<Editor
										value={data?.outputNodeData}
										mode='code'
										navigationBar={false}
										statusBar={false}
										search={false}
										sortObjectKeys={false}
										onChange={null}
									/>
								</div>
							</div>
							<div className={"mt-6 w-full flex"}>
								<div className={"w-[73px] h-[40px] pr-4 flex justify-end items-center"}>功能函数</div>
								<div className={"w-[656px]"}>

									<SyntaxHighlighter language="javascript" style={{
										...arduinoLight,
										hljs:{
											...arduinoLight.hljs,
											background: '#fbfbfb',
										}
									}}>
										{data?.functionNodeData}
									</SyntaxHighlighter>
								</div>
							</div>

						</div>
					}
					{
						menu==='模型文件' &&
						<div className={"mt-4 w-full flex flex-col"}>
							{/*文件名称*/}
							<div className={"flex items-center"}>
								{/*展示最后一个/之后的内容*/}
								<div className={"flex items-center"}>{data?.modelFileUrl ? showLastName(data?.modelFileUrl) : data?.mirrorImage}</div>
								{
									data?.modelFileUrl &&
									<div className={"ml-[35px] flex items-center cursor-pointer hover:text-main"}
											 onClick={clickDownload}>
										<DownloadSvg/>
										<span className={"ml-1 flex items-center"}>下载</span>
									</div>
								}
							</div>
							<Table
								className={"mt-3"}
								size='small'
								defaultExpandAllRows={true}
								dataSource={data?.modelFileSizeList}
								// @ts-ignore
								columns={columns}
								pagination={false}
								footer={null}
								expandable={{
									expandIcon: CustomExpandIcon, // 使用自定义的展开图标组件
								}}
							/>
						</div>
					}
					{
						menu==='API接口' &&
						<div className={"mt-4 w-full flex flex-col"}>
							<ApiInfoDetail data={data}
														 mode={data?.status_desc==='已发布'?'normal':'noData'}
							/>
						</div>
					}
				</div>
			</div>
		</div>
	)
}
