import React, {useEffect} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../components/draggable-modal";
import ButtonSecond from "../../../components/ButtonSecond";
import ButtonMain from "../../../components/ButtonMain";
import {Tooltip} from "antd";
import EditTable from "../../../components/EditTable";

export default function BatchOfflineModal(props: IDraggableModalProps) {
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
			title: '类型',
			dataIndex: 'model_type_desc',
			key: 'model_type_desc',
			width: 161,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
		{
			title: '使用人数',
			dataIndex: 'user_count',
			key: 'user_count',
			width: 100,
			render: (_text, _record, _index) => (
				<div className={"w-full flex items-center"}>{_text?_text:'-'}</div>
			),
		},
	]
	// mounted
	useEffect(()=>{
		if (show) {
			console.log('BatchOfflineModal show')
			const newData = data.map(item=>({
				key: item.id,
				id: item.id,
				name: item.name,
				model_type_desc: item.model_type_desc,
				user_count: item.user_count,
			}))
			setTableData(newData)
		}
		return ()=>{
			setTableData([])
		}
	},[show])

	// methods
	const onOkInner = () => {
		onOk(null)
	}
	const onCancelInner = () => {
		onCancel()
	}
	const handleView = (index) => {
		window.open(location.href + '/detail/' + data[index].id)
	};
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='oam-user-model-batch-offline-modal'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full pl-[38px] pr-[38px] flex flex-col items-center text-sm leading-[14px]"}>
				{/*表格和分页*/}
				<div className={"mt-9 w-full"}>
					<EditTable
						tableStyle={{height:'522px'}}
						tableScroll={{ y: 480 }} // 设置自适应宽度
						data={tableData}
						columns={columns}
						change={null}/>
				</div>
				{/*分页*/}
				{/*<div className="mt-6 pb-6 w-full flex justify-center">*/}
				{/*	{*/}
				{/*		pageSum > 10 &&*/}
				{/*		<Pagination showSizeChanger*/}
				{/*								showQuickJumper*/}
				{/*								showTitle={false}*/}
				{/*								showTotal={total => `共${total}条`}*/}
				{/*								onShowSizeChange={onShowSizeChange}*/}
				{/*								onChange={value => changePageNum(value)}*/}
				{/*								defaultPageSize={pageSize.current}*/}
				{/*								defaultCurrent={1}*/}
				{/*								pageSizeOptions={[10, 20, 30, 40]}*/}
				{/*								current={pageNum.current}*/}
				{/*								total={pageSum}/>*/}
				{/*	}*/}
				{/*</div>*/}
				{/*按钮*/}
				<div className={"mb-6 flex"}>
					<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'32px'}}/>
					<ButtonMain text={'确定'} className={"ml-4"} click={onOkInner} style={{width:'61px',height:'32px'}}/>
				</div>
			</div>
		</DraggableModal>
	)
}
