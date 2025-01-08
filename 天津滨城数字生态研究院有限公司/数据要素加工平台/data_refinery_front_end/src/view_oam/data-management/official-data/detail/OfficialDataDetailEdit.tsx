import React, {useEffect, useState} from "react";
import {Input, message, Select, Spin, Table} from "antd";
import { post } from "../../../../axios";
import ButtonMain from "../../../../components/ButtonMain";
import ButtonFifth from "../../../../components/ButtonFifth";
import {PlusOutlined} from "@ant-design/icons";
import {applicationFieldList} from "../../../../utils/static";
import Title from "../../../../components/Title";
import {dataPreviewColumnsMap, dataPreviewDataMap} from "../../../../view/data-resource/static";
import ImageEditorModal from "../../../../view/my-model/create/components/ImageEditorModal";

interface IProps {
	data: any,
	onOk: (_data: object) => void,
	onCancel: () => void,
}

export default function OfficialDataDetailEdit(props: IProps) {
	// state
	const {data, onOk, onCancel} = props
	const [coverUrl, setCoverUrl] = useState('')
	const [coverFile, setCoverFile] = useState(null)
	const [coverLoading, setCoverLoading] = useState(false)
	const [name, setName] = useState('')
	const [industry, setIndustry] = useState('')
	const [description, setDescription] = useState('')
	// 弹框
	// 展示弹框
	const [showImageEditorModal, setShowImageEditorModal] = useState(false)
	// mounted
	useEffect(() => {
		if(data) {
			setCoverUrl(data?.coverUrl)
			setName(data?.name)
			setIndustry(data?.industry)
			setDescription(data?.description)
		}
	}, [data])
	// methods
	const clickUploadCover = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (event) => {
			// @ts-ignore
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				setCoverFile(file);
				setShowImageEditorModal(true)
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}
	// 编辑图片弹框事件
	const imageEditorModalOnOk = async (_data) => {
		const {imageFile} = _data
		setShowImageEditorModal(false)
		const params = {
			business_type: 'dataset-cover',
			avatar: imageFile,
		}
		setCoverUrl(URL.createObjectURL(imageFile))

		setCoverLoading(true)
		const res = await post('/drapi/file/upload', params, {headers: {'Content-Type': 'multipart/form-data'}})
		const url = res.data.urls[0]
		setCoverUrl(url)
		setCoverLoading(false)
	}
	const imageEditorModalOnCancel = () => {
		setShowImageEditorModal(false)
	}
	const clickEditOk = () => {
		// 发送请求
		const params = {
			id: data?.id,
			coverUrl,
			name,
			industry,
			description,
		}
		message.success('编辑成功')
		onOk(params)
	}
	// render
	return (
		// 最外层
		<div className={"w-full flex flex-col relative"}>
			{/*按钮*/}
			<div className={"absolute top-[28px] right-0 flex justify-end items-center"}>
				<ButtonMain text={'保存'} click={clickEditOk} style={{width: '86px',height:'32px'}}/>
				<ButtonFifth text={'取消'} click={onCancel} style={{width: '86px',height:'32px'}} className={"ml-[11px]"}/>
			</div>
			<div className={"w-[48.96vw] min-w-[680px] flex flex-col"}>
				{/*图片和名称等*/}
				<div className={"flex "}>
					<div className={"relative"}>
						{
							!coverUrl &&
							<div className={"w-[264px] h-[148px]"}>
								<Spin spinning={coverLoading} size="small" tip="上传中...">
									<div
										className="group w-full h-full flex justify-center items-center cursor-pointer relative rounded-lg bg-white outline-2 outline-dashed outline-[#e7eaee] hover:outline-[#70bcc2] transition-all duration-300"
										style={{width:'264px',height:'148px',}}
										onClick={clickUploadCover}
									>
										<PlusOutlined
											className="text-[#E1E1E1] group-hover:text-[#70bcc2] text-[15px] transition-all duration-300"/>
									</div>
								</Spin>
							</div>
						}
						{
							coverUrl &&
							<div className={"w-[264px] h-[148px]"}>
								<Spin spinning={coverLoading} size="small" tip="上传中...">
									<img src={coverUrl} alt=""
											 onClick={clickUploadCover}
											 className={"cursor-pointer relative rounded-lg outline-2 outline-dashed outline-[#e7eaee] hover:outline-[#70bcc2] transition-all duration-300"}
											 style={{width:'264px',height:'148px',}}/>
								</Spin>
							</div>
						}
					</div>
					<div className={"ml-[22px] flex-1 flex flex-col"}>
						<Input placeholder={"请输入数据集名称"}
						       style={{height:'38px',width:'100%'}}
						       autoComplete={"off"}
						       value={name}
						       onChange={(e) => setName(e.target.value)}/>
						<Select placeholder={"请选择所属行业"}
						        size={'large'}
						        options={applicationFieldList.map(item => ({label: item, value: item}))}
						        style={{height:'38px',width:'100%',marginTop:'17px'}}
						        value={industry}
						        onChange={(value) => setIndustry(value)}/>
					</div>
				</div>
				{/*描述*/}
				<div className={"mt-4 w-full"}>
					<Input.TextArea rows={4} maxLength={500} showCount placeholder="请输入数据集描述"
					                value={description}
					                onChange={e=>setDescription(e.target.value)}/>
				</div>
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
				<ImageEditorModal title='编辑图片'
				                  show={showImageEditorModal}
				                  data={{imageFile: coverFile}}
				                  onOk={imageEditorModalOnOk}
				                  onCancel={imageEditorModalOnCancel}/>
			</div>
		</div>
	)
}
