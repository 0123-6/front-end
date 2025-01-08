import DraggableModal, {IDraggableModalProps} from "../../../../../../../components/draggable-modal";
import React, {useEffect, useRef, useState} from "react";
import FirstAuthorizedModal from "./components/FirstAuthorizedModal";
import SecondAuthorizedModal from "./components/SecondAuthorizedModal";

export default function AuthorizedModal(props: IDraggableModalProps) {
	// state
	const {title, show, onOk, onCancel} = props;
	const [number, setNumber] = useState<number>(1)
	const secondModalAllData = useRef([])
	// mounted
	useEffect(()=>{
		setNumber(1)
		secondModalAllData.current = []
	},[show])
	// methods
	const firstAuthorizedModalOnOk = (_data) => {
		secondModalAllData.current = _data
		setNumber(2)
	}
	const firstAuthorizedModalOnCancel = () => {
		onCancel()
	}
	const secondAuthorizedModalOnOk = (_data) => {
		onOk(_data)
	}
	const secondAuthorizedModalOnCancel = () => {
		secondModalAllData.current = []
		setNumber(1)
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='modal-width-47vw modal-min-width-750 modal-height-70vh modal-min-height-500'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full h-[70vh] min-h-[500px] flex flex-col"}>
				{
					number === 1 &&
					<FirstAuthorizedModal onOk={firstAuthorizedModalOnOk}
					                      onCancel={firstAuthorizedModalOnCancel} />
				}
				{
					number === 2 &&
					<SecondAuthorizedModal defaultAllData={secondModalAllData.current}
					                       onOk={secondAuthorizedModalOnOk}
					                       onCancel={secondAuthorizedModalOnCancel}/>
				}
			</div>
		</DraggableModal>
	)
}
