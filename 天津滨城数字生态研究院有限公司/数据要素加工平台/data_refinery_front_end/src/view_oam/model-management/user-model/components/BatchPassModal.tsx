import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import React, {useEffect, useState} from "react";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import EditTable from "../../../../components/EditTable";
import {Tooltip} from "antd";
import {modelCpuConfigurationList, modelGpuConfigurationList} from "../../../../utils/static";

export default function BatchPassModal(props: IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel} = props;
	const [tableData,setTableData] = React.useState([])
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 40,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			width: 251,
			render: (_text, _record, _index) => (
				<Tooltip title={((_text) && (_text)?.length>16)?(_text):null} overlayClassName='my-model-table'>
					<div className={"w-full flex items-center cursor-pointer hover:text-main text-hidden"}
					     onClick={() => handleView(_index)}>{_text}</div>
				</Tooltip>
			),
		},
		{
			title: 'CPU',
			dataIndex: 'cpu',
			key: 'cpu',
			width: 150,
			editable: true,
			type: 'select',
			options: modelCpuConfigurationList,
			placeholder: '请选择CPU',
		},
		{
			title: 'GPU',
			dataIndex: 'gpu',
			key: 'gpu',
			width: 100,
			editable: true,
			type: 'select',
			options: modelGpuConfigurationList,
			placeholder: '请选择GPU',
		},
		{
			title: '备注',
			dataIndex: 'audit_msg',
			key: 'audit_msg',
			width: 250,
			editable: true,
			type: 'input',
			placeholder: '请输入备注',
		},
	]
	// 可编辑表格数据
	const [editTableData,setEditTableData] = useState([])
	// mounted
	useEffect(()=>{
		if (show) {
			console.log('BatchOfflineModal show')
			const newData = data.map(item=>({
				key: item.id,
				id: item.id,
				name: item.name,
				cpu: (item?.cpu && item?.memory) ? JSON.stringify({cpu:item?.cpu,memory:item?.memory}) : JSON.stringify({cpu:1, memory:2}),
				gpu: item?.gpu ? item?.gpu : 0,
				audit_msg: item?.audit_info?.report
			}))
			setTableData(newData)
			setEditTableData(newData)
		}
		return ()=>{
			setTableData([])
			setEditTableData([])
		}
	},[show])
	// methods
	const onOkInner = () => {
		onOk(editTableData)
	}
	const onCancelInner = () => {
		onCancel()
	}
	const handleView = (index) => {
		window.open(location.href + '/detail/' + data[index].id)
	};
	return (
		<DraggableModal title={title}
		                wrapClassName='oam-user-model-batch-pass-modal'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full pl-[42px] pr-[42px] flex flex-col items-center text-sm leading-[14px]"}>
				{/*表格*/}
				<div className={"mt-9 w-full"}>
					<EditTable
						tableStyle={{height:'522px'}}
						tableScroll={{ y: 480 }} // 设置自适应宽度
						data={tableData}
						columns={columns}
						change={data=>setEditTableData(data)}/>
				</div>
				{/*按钮*/}
				<div className={"mb-6 flex"}>
					<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'32px'}}/>
					<ButtonMain text={'确定'} className={"ml-4"} click={onOkInner} style={{width:'61px',height:'32px'}}/>
				</div>
			</div>
		</DraggableModal>
	)
}
