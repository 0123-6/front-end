import React, {useEffect, useState} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../components/draggable-modal";
import ButtonMain from "../../../components/ButtonMain";
import ButtonSecond from "../../../components/ButtonSecond";

export default function OfflineModal(props: IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel} = props;
	const [showDetail,setShowDetail] = useState(false)
	// mounted
	useEffect(()=>{
		if(show) {
			// 定义0-1的随机数
			const random = Math.random()
			// 0-0.5的概率显示详情
			if (random<0.5) {
				setShowDetail(true)
			} else {
				setShowDetail(false)
			}
		}
		return () => {
			setShowDetail(false)
		}
	},[show])
	// methods
	const onOkInner = () => {
		onOk(null)
	}
	const onCancelInner = () => {
		onCancel()
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='oam-user-model-offline-modal'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full flex flex-col items-center text-sm leading-[14px]"}>
				{/*提示*/}
				<div className={"mt-[50px] flex items-center"}>
					<span className={"flex items-center"}>确定下线</span>
					<span className={"ml-1 flex items-center text-main text-hidden"}
					      title={data?.name.length>13?data?.name:null}
					      style={{maxWidth:'186px'}}>{data?.name}</span>
					<span className={"ml-1 flex items-center"}>模型吗？</span>
				</div>
				{
					showDetail &&
					<span className={"mt-6 w-[230px] flex items-center text-xs leading-[18px] text-[#B7B7B7] font-medium"}>当前模型正在使用中，已有46人在用，最晚授权到期时间2022-07-21</span>
				}
				{/*按钮*/}
				<div className={"mb-6 flex"}
				     style={{marginTop:'52px'}}>
					<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'32px'}}/>
					<ButtonMain text={'确定'} className={"ml-4"} click={onOkInner} style={{width:'61px',height:'32px'}}/>
				</div>
			</div>
		</DraggableModal>
	)
}
