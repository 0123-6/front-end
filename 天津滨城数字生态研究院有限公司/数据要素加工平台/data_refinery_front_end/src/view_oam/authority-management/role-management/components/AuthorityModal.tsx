import React, {useEffect} from "react";
import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import {Tree, TreeProps} from "antd";
import { DataNode } from "antd/lib/tree";
import {uuidv4} from "@antv/xflow";

export default function AuthorityModal(props: IDraggableModalProps) {
	// state
	// @ts-ignore
	const {title, show, data, onOk, onCancel} = props;
	const treeData: DataNode[] = [
		{
			title: '一级目录',
			key: uuidv4(),
			children: [
				{
					title: '二级目录',
					key: uuidv4(),
				},
				{
					title: '二级目录',
					key: uuidv4(),
				},
			],
		},
		{
			title: '一级目录',
			key: uuidv4(),
			children: [
				{
					title: '二级目录',
					key: uuidv4(),
				},
				{
					title: '二级目录',
					key: uuidv4(),
				},
			],
		},
	];
	// mounted
	useEffect(()=>{

	},[show])
	// methods
	const onOkInner = async () => {
		onOk(null)
	}
	const onCancelInner = (e) => {
		e.preventDefault()
		onCancel()
	}
	const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
		console.log('selected', selectedKeys, info);
	};

	const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
		console.log('onCheck', checkedKeys, info);
	};
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='modal-width-47vw modal-min-width-750 modal-height-70vh modal-min-height-500'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full h-[70vh] min-h-[500px] pt-[4.3vh] flex justify-around items-start"}>
				{/*OAM*/}
				<div className={"flex flex-col"}>
					<span className={"text-base font-medium"}>OAM</span>
					<Tree
						checkable
						defaultExpandedKeys={['0-0-0', '0-0-1']}
						defaultSelectedKeys={['0-0-0', '0-0-1']}
						defaultCheckedKeys={['0-0-0', '0-0-1']}
						onSelect={onSelect}
						onCheck={onCheck}
						treeData={treeData}
					/>
				</div>
				{/*前台*/}
				<div className={"flex flex-col"}>
					<span className={"text-base font-medium"}>前台</span>
				</div>
			</div>
			<div className={"pb-6 w-full mt-[1px] flex justify-center items-center"}>
				<ButtonSecond text={'取消'} click={onCancelInner} style={{width: '61px', height: '32px'}}/>
				<ButtonMain text={'确认'} click={onOkInner} style={{width: '61px', height: '32px', marginLeft: '16px'}}/>
			</div>
		</DraggableModal>
	)
}
