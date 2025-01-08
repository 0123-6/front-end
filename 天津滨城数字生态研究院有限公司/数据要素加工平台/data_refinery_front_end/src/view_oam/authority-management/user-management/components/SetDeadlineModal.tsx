import React, {useEffect} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import {DatePicker, Form, message} from "antd";
import {handleKeyDownDisabled} from "../../../../utils/util";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import moment from "moment";

export default function SetDeadlineModal(props: IDraggableModalProps) {
	// state
	// @ts-ignore
	const {title, show, data, onOk, onCancel} = props;
	const [form] = Form.useForm();
	// mounted
	useEffect(()=>{
		form.resetFields()
		if(show) {
			const params = {
				startTime: data?.startTime ? moment(data?.startTime) : null,
				endTime: data?.endTime ? moment(data?.endTime) : null,
			}
			form.setFieldsValue(params)
		}
	},[show])
	// methods
	const onOkInner = () => {
		const params = form.getFieldsValue(true)
		// 结束时间不能小于开始时间
		if (params.startTime.isAfter(params.endTime)) {
			message.error('结束时间不能早于开始时间')
			return
		}
		onOk({
			startTime: params.startTime.format('YYYY-MM-DD'),
			endTime: params.endTime.format('YYYY-MM-DD'),
		})
	}
	const onCancelInner = (e) => {
		e.preventDefault()
		onCancel()
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='oam-user-management-set-deadline-modal label-width-128'
		                show={show}
		                onCancel={onCancel}>
			<Form
				form={form}
				onFinish={onOkInner}
				onKeyDown={handleKeyDownDisabled}
			>
				<div className={"w-full flex flex-col text-sm leading-[14px]"}>
					{/*开始时间*/}
					<Form.Item
						style={{
							marginTop: '46px',
						}}
						label="开始时间"
						name="startTime"
						className={'label-height-40'}
						rules={[
							{ required: true, message: '请选择开始时间'},
						]}
					>
						<DatePicker size={'large'}
						            format={'YYYY/MM/DD'}
						            style={{width:'295px'}}
						            placeholder={'请选择开始时间'}
						/>
					</Form.Item>
					{/*结束时间*/}
					<Form.Item
						label="结束时间"
						name="endTime"
						className={'label-height-40'}
						rules={[
							{ required: true, message: '请选择结束时间'},
						]}
					>
						<DatePicker size={'large'}
						            format={'YYYY/MM/DD'}
						            style={{width:'295px'}}
						            placeholder={'请选择结束时间'}
						/>
					</Form.Item>
					<div className={"pb-8 w-full mt-[33px] flex justify-center items-center"}>
						<ButtonSecond text={'取消'} click={onCancelInner} style={{width: '61px', height: '32px'}}/>
						<ButtonMain text={'确认'} click={null} style={{width: '61px', height: '32px', marginLeft: '16px'}}/>
					</div>
				</div>
			</Form>
		</DraggableModal>
	)
}
