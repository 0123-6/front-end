import React, {useEffect, useRef, useState} from "react";
import {del, get, post } from "../../../axios";
import DraggableModal, {IDraggableModalProps} from "../../../components/draggable-modal";
import {Input, message, Spin, Switch, Tooltip} from "antd";
import EditSvg from "../../../icon/EditSvg";
import DeleteSvg from "../../icon/DeleteSvg";
import CopySvg from "../../../icon/CopySvg";
import copy from "copy-to-clipboard";
import ButtonMain from "../../../components/ButtonMain";
import SuccessSvg from "../../../icon/SuccessSvg.svg";
import CloseSvg from "../../../icon/CloseSvg";
import DraggableModalPrompt from "../../../components/draggable-modal/draggable-modal-prompt";

export default function QuestionTemplateModal(props: IDraggableModalProps) {
	// state
	const {title, show, onCancel} = props;
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	const [editIndex, setEditIndex] = useState(-1)
	const editInputRef = useRef(null)
	const deleteIndexRef = useRef(null)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	// mounted
	useEffect(()=>{
		if(show) {
			getData()
		} else {
			setData([])
			setLoading(false)
			setEditIndex(-1)
			deleteIndexRef.current = null
			setShowDeleteModal(false)
		}
	},[show])
	// methods
	const getData = async () => {
		const params = {
			city: props?.data?.city,
		}
		setLoading(true)
		const {data} = await get(`/oam/city/default/question/${params.city}`)
		setData(data)
		setLoading(false)
	}
	const changeStatus = async (index,checked) => {
		const newData = [...data]
		newData[index].status = checked ? 1 : 2
		// 向后台发送请求
		const params = {
			id: newData[index].id,
			status: newData[index].status,
		}
		await post('/oam/city/default/question',params)
		setData(newData)
		// message.success('修改成功')
	}
	const clickCopy = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		// 复制
		copy(data[index].question)
		message.success('复制成功')
	}
	const clickCreate = () => {
		const newData = [...data]
		newData.push({
			id: null,
			status: 1,
			question: '',
			city: props?.data?.city,
		})
		setData(newData)
		setEditIndex(newData.length-1)
	}
	const clickEdit = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		setEditIndex(index)
	}
	// 编辑保存
	const editOnKeyDown = (e) => {
		if (e.keyCode === 13) {
			editOnOk(e)
		}
	}
	const editOnOk = async (e) => {
		e.stopPropagation()
		e.preventDefault()
		// 判断是否为空
		if (editInputRef.current.input.value === '') {
			message.error('问题模板不能为空')
			return
		}
		const params = {
			id: data[editIndex].id,
			question: editInputRef.current.input.value,
			city: props?.data?.city,
		}
		const res = await post('/oam/city/default/question', params)
		// message.success('修改成功')
		// 直接更新历史记录
		const newData = [...data]
		newData[editIndex].id = res.data.id
		newData[editIndex].question = res.data.question
		newData[editIndex].status = res.data.status
		setData(newData)
		setEditIndex(-1)
	}
	const editOnCancel = (e) => {
		e.stopPropagation()
		e.preventDefault()
		// 如果是新建的，而且没有保存，直接删除
		if (data[editIndex].id === null) {
			const newData = [...data]
			newData.splice(editIndex,1)
			setData(newData)
		}
		setEditIndex(-1)
	}
	const clickDelete = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		deleteIndexRef.current = index
		setShowDeleteModal(true)
	}
	const deleteModalOnOk = async () => {
		const params = {
			id: data[deleteIndexRef.current].id,
		}
		await del(`/oam/city/default/question/${params.id}`, null)
		message.success('删除成功')
		getData()
		setShowDeleteModal(false)
		deleteIndexRef.current = -1
	}
	const deleteModalOnCancel = () => {
		setShowDeleteModal(false)
		deleteIndexRef.current = -1
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='question-template-modal'
		                show={show}
		                onCancel={onCancel}>
			{/*加载效果*/}
			<Spin spinning={loading} size="large" tip="加载中...">
				<div className={"mt-[0.8vh] w-full flex flex-col"}>
					<div className={"min-h-[300px] max-h-[60vh] overflow-x-hidden overflow-y-auto w-full flex flex-col pl-6 pr-[39px]"}>
						{
							data.map((item,index)=>(
								<div className={`mb-[2vh] h-[4.1vh] min-h-[21px] flex items-center bg-white
								          ${index === editIndex ? 'shadow-[0px_0px_5px_0px_rgba(198,198,198,0.41)] rounded-lg' : ''}`}
								     key={index}>
									{
										index !== editIndex &&
										<>
											<span className={"w-[70%] flex items-center text-[15px] text-hidden"}>{item?.question}</span>
											<div className="w-[100px] min-w-[100px] flex justify-center items-center">
												<Switch defaultChecked={item?.status===1} size={'small'} onChange={(checked) => changeStatus(index,checked)}/>
												<span className={"ml-[5px]"}>{item?.status===1?'启用':'禁用'}</span>
											</div>
											<div className={`w-[20%] flex justify-end items-center ${item?.status===1 ? 'text-[#CFD1D8]': 'text-[#A4AFCA]'}`}>
												<Tooltip title={'编辑'} overlayClassName='like-or-unlike'>
											<span className={`w-[20px] h-[20px] flex justify-center items-center ${item?.status===1 ? 'cursor-not-allowed' : 'cursor-pointer hover:text-[#2554FF]'}`}
														onClick={e => item?.status===1 ? null : clickEdit(e, index)}>
												<EditSvg/>
											</span>
												</Tooltip>
												<Tooltip title={'复制'} overlayClassName='like-or-unlike'>
										<span className={`ml-[1.4vw] w-[20px] h-[20px] flex justify-center items-center ${false ? 'cursor-not-allowed' : 'text-[#A4AFCA] cursor-pointer hover:text-[#01BCEB]'}`}
													onClick={e => clickCopy(e, index)}>
											<CopySvg/>
										</span>
												</Tooltip>
												<Tooltip title={'删除'} overlayClassName='like-or-unlike'>
										<span className={`ml-[1.4vw] w-[20px] h-[20px] flex justify-center items-center ${item?.status===1 ? 'cursor-not-allowed' : 'cursor-pointer hover:text-[#EC1515]'}`}
										      onClick={e => item?.status===1 ? null : clickDelete(e, index)}>
											<DeleteSvg/>
										</span>
												</Tooltip>
											</div>
										</>
									}
									{
										index === editIndex &&
										<>
											<div className={`mr-[5px] w-[7px] h-full bg-[#0147EB]`}
													 style={{
												     borderRadius:'8px 0 0 8px',
												     boxShadow: '0px 0px 2px 0px rgba(198,198,198,0.5)',
											     }}/>
											<Input autoComplete="off"
														 autoFocus
														 defaultValue={item?.question}
														 className={"flex-1"}
														 style={{
												       fontSize:'14px',
												       lineHeight: '14px',
												       height:'26px',
												       border:'1px solid rgba(37,84,255,1)',
												       borderRadius:'8px',
												       color: '#262626',
											       }}
														 onClick={(e)=>e.stopPropagation()}
														 onKeyDown={(e)=>editOnKeyDown(e)}
														 ref={editInputRef}
											/>
											<Tooltip title={'保存'}
															 overlayClassName={"like-or-unlike-or-copy"}>
												<div className="ml-1 w-[28px] h-[28px] rounded flex justify-center items-center text-black hover:bg-[#F7F7F7] hover:text-main cursor-pointer"
														 onClick={(e)=>editOnOk(e)}>
													<img src={SuccessSvg} alt=""/>
												</div>
											</Tooltip>
											<Tooltip title={'取消'}
															 overlayClassName={"like-or-unlike-or-copy"}>
												<div className="mr-1 w-[28px] h-[28px] rounded flex justify-center items-center text-black hover:bg-[#F7F7F7] hover:text-main cursor-pointer"
														 onClick={(e)=>editOnCancel(e)}>
													<CloseSvg/>
												</div>
											</Tooltip>
										</>
									}
								</div>
							))
						}
					</div>
					<div className={"mt-[4vh] mb-[1.8vh] flex justify-center items-center"}>
						<ButtonMain text={'新建'}
						            click={clickCreate}
						            className={"w-[104px] h-[36px]"}
						            disabled={editIndex!==-1}/>
					</div>
				</div>
			</Spin>
			{/*删除弹框*/}
			<DraggableModalPrompt
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-base text-black-dark flex items-center">确定删除<span className="max-w-[180px] text-main pl-1 pr-1 text-hidden">{data[deleteIndexRef.current]?.question}</span>问题模板吗？</span>
			</DraggableModalPrompt>
		</DraggableModal>
	)
}
