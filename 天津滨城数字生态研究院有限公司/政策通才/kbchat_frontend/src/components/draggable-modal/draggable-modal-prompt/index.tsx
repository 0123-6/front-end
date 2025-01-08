import DraggableModal from "../index";
import React from "react";
import ButtonSecond from "../../ButtonSecond";
import ButtonMain from "../../ButtonMain";

interface IProps {
	title?: string;
	wrapClassName?: string;
	show: boolean;
	children: React.ReactNode;
	onOk: (e) => void;
	onCancel: (e) => void;
}

export interface IDraggableModalPromptProps {
	title?: string;
	show: boolean;
	data: any;
	onOk: () => void;
	onCancel: () => void;
}

export default function DraggableModalPrompt(props:IProps) {
	// state
	const {title='提示', wrapClassName='experiment-delete', show, children, onOk, onCancel} = props;
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName={wrapClassName}
		                show={show}
		                onCancel={onCancel}>
			<div className="mt-11 w-full flex justify-center">
				{children}
			</div>
			<div className="mt-12 pb-6 w-full flex justify-center items-center">
				<ButtonSecond text={'取消'} click={onCancel} style={{width:'61px',height:'32px'}}/>
				<ButtonMain text={'确定'} className={"ml-4"} click={onOk} style={{width:'61px',height:'32px'}}/>
			</div>
		</DraggableModal>
	)
}
