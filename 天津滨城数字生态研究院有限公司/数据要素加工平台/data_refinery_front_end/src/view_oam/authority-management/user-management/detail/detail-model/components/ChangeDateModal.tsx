import {DatePicker, message} from "antd";
import React, {useEffect} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../../../../components/draggable-modal";
import ButtonSecond from "../../../../../../components/ButtonSecond";
import ButtonMain from "../../../../../../components/ButtonMain";

export default function ChangeDateModal(props: IDraggableModalProps) {
	// state
	// @ts-ignore
	const {title, show, data, onOk, onCancel} = props;
	const startDate = React.useRef<string>(null)
	const endDate = React.useRef<string>(null)
	// mounted
	useEffect(()=>{

	},[])
	// methods
	const onOkInner = () => {
		if(!startDate.current || !endDate.current) {
			message.error('请选择续期时间')
			return
		}
		const params = {
			startDate: startDate.current,
			endDate: endDate.current,
		}
		onOk(params)
	}
	const onCancelInner = (e) => {
		e.preventDefault()
		onCancel()
	}
	const changeRangeDate = (values) => {
		startDate.current = values[0].format('YYYY-MM-DD')
		endDate.current = values[1].format('YYYY-MM-DD')
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='modal-width-500 modal-height-286'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full flex flex-col"}>
				<div className={"mt-7 flex items-center"}>
					<span className={"w-[176px] flex justify-end"}>账号：</span>
					<span className={"flex items-center"}>18810506962</span>
				</div>
				<div className={"mt-[21px] flex items-center"}>
					<span className={"w-[176px] flex justify-end"}>上次授权时间：</span>
					<span className={"flex items-center"}>2023-02-09 — 2024-02-09</span>
				</div>
				<div className={"mt-[21px] flex items-center"}>
					<span className={"w-[176px] flex justify-end"}>续期时间：</span>
					<DatePicker.RangePicker onChange={changeRangeDate}
					                        format={'YYYY/MM/DD'}
					                        style={{width:'281px'}}
					                        allowClear={false}/>
				</div>
				{/*按钮*/}
				<div className={"mb-6 flex justify-center items-center"}
				     style={{marginTop:'41px'}}>
					<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'32px'}}/>
					<ButtonMain text={'确定'} className={"ml-4"} click={onOkInner} style={{width:'61px',height:'32px'}}/>
				</div>
			</div>
		</DraggableModal>
	)
}
